# Aimfox → Telegram

Get a Telegram alert whenever a new reply lands in your Aimfox (LinkedIn) inbox.
Groundwork for a later AI-assisted reply system.

## Use this: [`aimfox-telegram/`](aimfox-telegram/)

The current, recommended app — **webhook (instant) + backup poll (safety net)** in
one program, zero dependencies, Node 20+. See its [README](aimfox-telegram/README.md).

Two ways to run it:
- **Poll-only** — just an Aimfox API key + Telegram bot token + chat id. No public
  URL, no server exposure. Alerts every ~1–2 min.
- **Webhook + poll** — add a public HTTPS URL for instant alerts. See
  [`deploy/DEPLOY-ubuntu.md`](aimfox-telegram/deploy/DEPLOY-ubuntu.md).

## Setup

Copy `.env.example` to `.env` and fill in:
- `AIMFOX_API_KEY` — Aimfox → Workspace Settings → Integrations
- `TELEGRAM_BOT_TOKEN` — @BotFather → `/newbot`
- `TELEGRAM_CHAT_ID` — @userinfobot

```bash
cd aimfox-telegram
cp .env.example .env   # fill in values
node --env-file=.env app.js
```

Secrets (`.env`) and runtime data (`data/`) are gitignored — never committed.

## Reference
- [`AIMFOX_API_ENDPOINTS.md`](AIMFOX_API_ENDPOINTS.md) — full Aimfox API endpoint reference.

## Older variants (superseded by `aimfox-telegram/`)
- `aimfox-telegram-poller/` — poll-only version
- `aimfox-telegram-local/` — webhook-only version
- `aimfox-telegram-workflow.json` — n8n workflow
