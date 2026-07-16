# Aimfox → Telegram (webhook + backup poll)

Instant Telegram alerts when a new reply lands in Aimfox, with a self-healing
backup poll so nothing is missed if a webhook is ever dropped.

```
Aimfox ──webhook (instant)──►┐
                             ├─► app.js ──reads unread replies via API──► Telegram
timer  ──backup poll────────►┘        (one sender, deduped — never doubles)
```

Both triggers funnel through the **same** sender + dedup memory, so you get each
reply exactly once. Pure Node.js, zero dependencies. Node 20+.

## Needs
- **Aimfox API key** (Vipan workspace): Aimfox → Workspace Settings → Integrations
- **Telegram bot token** (@BotFather) + **chat id** (@userinfobot)
- A **public HTTPS URL** for the webhook (Ubuntu + Caddy — see `deploy/DEPLOY-ubuntu.md`)

## Quick local run (before server deploy)
```bash
cp .env.example .env      # fill in the values
node --env-file=.env app.js
```
`GET http://localhost:3000/` should say it's running. The backup poll alone will
already deliver alerts; the webhook just makes them instant once it's public.

## Server deploy
See **`deploy/DEPLOY-ubuntu.md`** — systemd + Caddy (HTTPS) + subdomain steps.

## Then hand back to Claude
Send Claude your webhook URL (`https://your-subdomain/aimfox-reply`) and the
`AIMFOX_WEBHOOK_SECRET`. Claude registers the webhook on Aimfox (`POST /webhooks`)
for `reply` + `new_reply` + `campaign_reply`.

## Files it writes
- `data/state.json` — read position + alerted message ids (dedup).
- `data/replies.jsonl` — every alerted reply (seed for the future AI "memory").
