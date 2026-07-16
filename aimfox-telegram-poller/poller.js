// Aimfox → Telegram (polling)
// Asks Aimfox for unread replies on a timer and pings Telegram for new ones.
// Pure Node.js, zero dependencies. Requires Node 20+ (you have v24).
// Run with:  node --env-file=.env poller.js

import fs from "node:fs";
import path from "node:path";

const API_KEY = process.env.AIMFOX_API_KEY;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const INTERVAL = Number(process.env.POLL_INTERVAL_SECONDS || 120) * 1000;

const API_BASE = "https://api.aimfox.com/api/v2";

if (!API_KEY || !BOT_TOKEN || !CHAT_ID) {
  console.error("❌ Missing AIMFOX_API_KEY, TELEGRAM_BOT_TOKEN, or TELEGRAM_CHAT_ID. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

// --- local state + history -------------------------------------------------
const DATA_DIR = path.join(process.cwd(), "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const STATE_FILE = path.join(DATA_DIR, "state.json");
const LOG_FILE = path.join(DATA_DIR, "replies.jsonl");

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { cursor: 0, alerted: [] };
  }
}
function saveState(state) {
  // keep the alerted list bounded
  if (state.alerted.length > 500) state.alerted = state.alerted.slice(-500);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
function recordRaw(convo) {
  fs.appendFile(LOG_FILE, JSON.stringify({ received_at: new Date().toISOString(), convo }) + "\n", () => {});
}

// --- helpers ---------------------------------------------------------------
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function aimfox(pathname) {
  const res = await fetch(`${API_BASE}${pathname}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(`Aimfox ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

// Map owner account id -> "First Last" so alerts say which inbox got the reply.
let accountNames = {};
async function loadAccounts() {
  try {
    const data = await aimfox("/accounts");
    const list = data.accounts || data;
    accountNames = Object.fromEntries((list || []).map((a) => [String(a.id), a.full_name]));
  } catch (e) {
    console.error("⚠️  Could not load account names:", e.message);
  }
}

function formatAlert(c) {
  const m = c.last_message || {};
  const lead = (c.participants && c.participants[0]) || {};
  const name = lead.full_name || (m.sender && m.sender.full_name) || "Unknown lead";
  const via = accountNames[String(c.owner)] || `account ${c.owner}`;
  const handle = lead.public_identifier ? `https://www.linkedin.com/in/${lead.public_identifier}` : null;
  const occ = lead.occupation ? String(lead.occupation).split("|")[0].trim() : "";

  let out = `🔔 <b>New LinkedIn reply</b>\n`;
  out += `👤 <b>${esc(name)}</b>\n`;
  if (occ) out += `<i>${esc(occ)}</i>\n`;
  out += `🔗 via ${esc(via)}\n`;
  if (m.body) out += `\n💬 ${esc(m.body)}\n`;
  if (handle) out += `\n<a href="${esc(handle)}">Open LinkedIn profile</a>`;
  return out;
}

// --- main poll -------------------------------------------------------------
async function poll(state, firstRun) {
  const data = await aimfox("/conversations?unread=true");
  const convos = data.conversations || data || [];

  // On the very first run, don't blast every existing unread reply.
  // Just record where we are and alert only on replies that arrive afterwards.
  if (firstRun) {
    const maxTs = convos.reduce((mx, c) => Math.max(mx, c.last_activity_at || 0), 0);
    state.cursor = maxTs;
    convos.forEach((c) => c.last_message && state.alerted.push(c.last_message.urn));
    saveState(state);
    console.log(`🟢 Initialized. ${convos.length} unread already in inbox (skipped). Watching for new replies…`);
    return;
  }

  // Oldest first, so alerts arrive in order.
  const sorted = [...convos].sort((a, b) => (a.last_activity_at || 0) - (b.last_activity_at || 0));
  let newest = state.cursor;

  for (const c of sorted) {
    const m = c.last_message;
    if (!m) continue;
    const ts = c.last_activity_at || m.created_at || 0;

    // Skip anything we've already handled, and skip messages we sent ourselves.
    const fromLead = !m.sender || String(m.sender.id) !== String(c.owner);
    if (ts <= state.cursor || state.alerted.includes(m.urn) || !fromLead) continue;

    try {
      await sendTelegram(formatAlert(c));
      recordRaw(c);
      state.alerted.push(m.urn);
      newest = Math.max(newest, ts);
      console.log(`✅ ${new Date().toISOString()}  alerted: ${m.sender && m.sender.full_name}`);
    } catch (e) {
      console.error(`❌ failed to alert for ${m.urn}:`, e.message);
    }
  }

  state.cursor = Math.max(state.cursor, newest);
  saveState(state);
}

// --- loop ------------------------------------------------------------------
async function main() {
  await loadAccounts();
  const state = loadState();
  const firstRun = !fs.existsSync(STATE_FILE);

  console.log(`🚀 Aimfox → Telegram poller started. Checking every ${INTERVAL / 1000}s.`);

  const tick = async (isFirst) => {
    try {
      await poll(state, isFirst);
    } catch (e) {
      console.error(`⚠️  ${new Date().toISOString()}  poll error:`, e.message);
    }
  };

  await tick(firstRun);
  setInterval(() => tick(false), INTERVAL);
}

export { poll, loadAccounts, formatAlert };

// Only start the loop when run directly (not when imported by a test).
if (import.meta.url === `file://${process.argv[1]}`) main();
