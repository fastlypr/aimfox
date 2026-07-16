// Aimfox → Telegram local relay
// Pure Node.js, zero dependencies. Requires Node 20+ (you have v24).
// Run with:  node --env-file=.env server.js

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = process.env.PORT || 3000;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || "/aimfox-reply";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SECRET = process.env.AIMFOX_WEBHOOK_SECRET || ""; // optional shared secret

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

// --- local record of every reply (seed for the future "memory" database) ---
const DATA_DIR = path.join(process.cwd(), "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const LOG_FILE = path.join(DATA_DIR, "replies.jsonl");

function recordRaw(payload) {
  const line = JSON.stringify({ received_at: new Date().toISOString(), payload }) + "\n";
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error("⚠️  Could not write to replies.jsonl:", err.message);
  });
}

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Build a readable Telegram message from whatever Aimfox sends.
// Field names can vary by event, so we probe several and keep the raw as fallback.
function formatMessage(p) {
  const event = p.event || p.type || p.event_type || "reply";

  const lead = p.lead || p.target || p.contact || p.from || {};
  const name =
    lead.full_name ||
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    p.full_name ||
    p.name ||
    "Unknown lead";

  const message =
    (p.message && (p.message.text || p.message.body)) ||
    p.text ||
    p.body ||
    p.reply ||
    "";

  const account = p.account_name || (p.account && p.account.full_name) || p.account_id || "";
  const campaign = (p.campaign && p.campaign.name) || p.campaign_name || p.campaign_id || "";

  let out = `🔔 <b>New LinkedIn reply</b>\n`;
  out += `👤 <b>${esc(name)}</b>\n`;
  if (campaign) out += `📣 ${esc(campaign)}\n`;
  if (account) out += `🔗 via ${esc(account)}\n`;
  if (message) out += `\n💬 ${esc(message)}\n`;
  out += `\n<code>event: ${esc(event)}</code>`;

  // If we couldn't find the reply text, attach the raw payload so nothing is lost.
  // (The first real reply shows us the exact field names, then we make this pretty.)
  if (!message) {
    out += `\n\n<b>Raw payload:</b>\n<pre>${esc(JSON.stringify(p).slice(0, 1500))}</pre>`;
  }
  return out;
}

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Telegram API ${res.status}: ${detail}`);
  }
}

const server = http.createServer((req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Aimfox → Telegram relay is running.\n");
    return;
  }

  if (req.method !== "POST" || req.url.split("?")[0] !== WEBHOOK_PATH) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  // Optional shared-secret check (set the same value as a header on the Aimfox webhook)
  if (SECRET && req.headers["x-webhook-secret"] !== SECRET) {
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1_000_000) req.destroy(); // basic guard
  });

  req.on("end", async () => {
    // Answer Aimfox immediately so it never retries / duplicates.
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"status":"ok"}');

    let payload = {};
    try {
      payload = body ? JSON.parse(body) : {};
    } catch {
      payload = { _unparsed: body };
    }

    recordRaw(payload);

    try {
      await sendTelegram(formatMessage(payload));
      console.log(`✅ ${new Date().toISOString()}  alert sent to Telegram`);
    } catch (err) {
      console.error(`❌ ${new Date().toISOString()}  failed to send:`, err.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Aimfox → Telegram relay listening on http://localhost:${PORT}${WEBHOOK_PATH}`);
  console.log(`   Health check: http://localhost:${PORT}/`);
  console.log(`   Raw replies logged to: ${LOG_FILE}`);
});
