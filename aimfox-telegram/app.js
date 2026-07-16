// Aimfox → Telegram (webhook + backup poll, unified)
//
// Design: there is ONE place that sends alerts (`checkNow`), which reads unread
// replies from the Aimfox API. It is triggered two ways:
//   1. Instantly, when Aimfox POSTs a webhook (just a "go look now" signal).
//   2. On a slow timer, as a safety net in case a webhook is ever dropped.
// Because both paths funnel through the same sender + dedup set, you never get
// a duplicate alert, and every message is richly formatted from the API data.
//
// Pure Node.js, zero dependencies. Node 20+.  Run: node --env-file=.env app.js

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const API_KEY = process.env.AIMFOX_API_KEY;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 3000;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || "/aimfox-reply";
const SECRET = process.env.AIMFOX_WEBHOOK_SECRET || "";
const BACKUP_POLL = Number(process.env.BACKUP_POLL_SECONDS || 600) * 1000; // safety net
const API_BASE = "https://api.aimfox.com/api/v2";

if (!API_KEY || !BOT_TOKEN || !CHAT_ID) {
  console.error("❌ Missing AIMFOX_API_KEY, TELEGRAM_BOT_TOKEN, or TELEGRAM_CHAT_ID. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

// --- state + history -------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const STATE_FILE = path.join(DATA_DIR, "state.json");
const LOG_FILE = path.join(DATA_DIR, "replies.jsonl");

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); }
  catch { return { cursor: 0, alerted: [] }; }
}
function saveState(s) {
  if (s.alerted.length > 1000) s.alerted = s.alerted.slice(-1000);
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
}
const state = loadState();
const firstRun = !fs.existsSync(STATE_FILE);

// --- helpers ---------------------------------------------------------------
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function aimfox(pathname) {
  const res = await fetch(`${API_BASE}${pathname}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
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

let accountNames = {};
async function loadAccounts() {
  try {
    const data = await aimfox("/accounts");
    const list = data.accounts || data;
    accountNames = Object.fromEntries((list || []).map((a) => [String(a.id), a.full_name]));
  } catch (e) { console.error("⚠️  Could not load account names:", e.message); }
}

function formatAlert(c) {
  const m = c.last_message || {};
  const lead = (c.participants && c.participants[0]) || {};
  const name = lead.full_name || (m.sender && m.sender.full_name) || "Unknown lead";
  const via = accountNames[String(c.owner)] || `account ${c.owner}`;
  const handle = lead.public_identifier ? `https://www.linkedin.com/in/${lead.public_identifier}` : null;
  const occ = lead.occupation ? String(lead.occupation).split("|")[0].trim() : "";
  let out = `🔔 <b>New LinkedIn reply</b>\n👤 <b>${esc(name)}</b>\n`;
  if (occ) out += `<i>${esc(occ)}</i>\n`;
  out += `🔗 via ${esc(via)}\n`;
  if (m.body) out += `\n💬 ${esc(m.body)}\n`;
  if (handle) out += `\n<a href="${esc(handle)}">Open LinkedIn profile</a>`;
  return out;
}

// --- the single sender path (dedup guaranteed) -----------------------------
let checking = false;
async function checkNow(trigger) {
  if (checking) return;            // avoid overlapping runs (webhook + timer)
  checking = true;
  try {
    const data = await aimfox("/conversations?unread=true");
    const convos = data.conversations || data || [];

    // First ever run: seed position, don't spam existing unread.
    if (firstRun && !state._seeded) {
      state.cursor = convos.reduce((mx, c) => Math.max(mx, c.last_activity_at || 0), 0);
      convos.forEach((c) => c.last_message && state.alerted.push(c.last_message.urn));
      state._seeded = true;
      saveState(state);
      console.log(`🟢 Initialized (${convos.length} existing unread skipped). Watching for new replies…`);
      return;
    }

    const sorted = [...convos].sort((a, b) => (a.last_activity_at || 0) - (b.last_activity_at || 0));
    for (const c of sorted) {
      const m = c.last_message;
      if (!m) continue;
      const ts = c.last_activity_at || m.created_at || 0;
      const fromLead = !m.sender || String(m.sender.id) !== String(c.owner);
      if (ts <= state.cursor || state.alerted.includes(m.urn) || !fromLead) continue;
      try {
        await sendTelegram(formatAlert(c));
        fs.appendFile(LOG_FILE, JSON.stringify({ received_at: new Date().toISOString(), trigger, convo: c }) + "\n", () => {});
        state.alerted.push(m.urn);
        state.cursor = Math.max(state.cursor, ts);
        console.log(`✅ ${new Date().toISOString()}  [${trigger}] alerted: ${m.sender && m.sender.full_name}`);
      } catch (e) {
        console.error(`❌ alert failed for ${m.urn}:`, e.message);
      }
    }
    saveState(state);
  } catch (e) {
    console.error(`⚠️  ${new Date().toISOString()}  [${trigger}] check error:`, e.message);
  } finally {
    checking = false;
  }
}

// --- webhook server (instant trigger) --------------------------------------
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200); res.end("Aimfox → Telegram (webhook + poll) running.\n"); return;
  }
  if (req.method !== "POST" || req.url.split("?")[0] !== WEBHOOK_PATH) {
    res.writeHead(404); res.end("Not found"); return;
  }
  if (SECRET && req.headers["x-webhook-secret"] !== SECRET) {
    res.writeHead(401); res.end("Unauthorized"); return;
  }
  // Drain body, answer immediately, then check.
  req.on("data", () => {});
  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"status":"ok"}');
    checkNow("webhook");
  });
});

// --- start -----------------------------------------------------------------
async function main() {
  await loadAccounts();
  server.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}${WEBHOOK_PATH}  (webhook = instant)`);
    console.log(`   Backup poll every ${BACKUP_POLL / 1000}s (safety net for dropped webhooks).`);
  });
  await checkNow("startup");
  setInterval(() => checkNow("backup-poll"), BACKUP_POLL);
}

export { checkNow, formatAlert, loadAccounts, state };
if (import.meta.url === `file://${process.argv[1]}`) main();
