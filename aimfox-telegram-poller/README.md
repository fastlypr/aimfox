# Aimfox → Telegram (polling)

Pings your Telegram whenever a new reply lands in Aimfox. It works by **asking
Aimfox for unread replies every couple of minutes** — no public server, no HTTPS,
no DNS, no tunnel. Just outbound API calls, so it runs anywhere (laptop or Ubuntu).

```
poller.js  ──asks──►  Aimfox API (unread replies)
poller.js  ──sends──►  Telegram (new ones only)
```

Pure Node.js, **zero dependencies**. Needs Node 20+.

---

## 1. Get three values

- **Aimfox API key** — in Aimfox: *Workspace Settings → Integrations → API key*
  (use the **Vipan** workspace). A normal key is fine.
- **Telegram bot token** — message **@BotFather**, send `/newbot`, copy the token.
- **Telegram chat id** — message **@userinfobot**, it replies with your numeric id.
  (For a team group: add the bot to the group and use the group id.)

## 2. Configure

```bash
cd aimfox-telegram-poller
cp .env.example .env
nano .env        # paste the three values
```

## 3. Run

```bash
node --env-file=.env poller.js
```

First start says *"Initialized … Watching for new replies"* — it deliberately does
**not** alert on replies already sitting in your inbox, only ones that arrive after.
Then reply-test it (or wait for a real one) and you'll get a Telegram message.

Tune the frequency with `POLL_INTERVAL_SECONDS` in `.env` (default 120 = every 2 min).

---

## Run it 24/7 on Ubuntu (systemd)

```bash
sudo mkdir -p /opt/aimfox-telegram-poller
# copy poller.js + .env into /opt/aimfox-telegram-poller
sudo useradd --system --no-create-home aimfox
sudo chown -R aimfox:aimfox /opt/aimfox-telegram-poller
sudo cp deploy/aimfox-poller.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aimfox-poller
journalctl -u aimfox-poller -f     # watch it work
```

(The service file is in `deploy/`. Confirm your node path with `which node`.)

---

## What it stores

- `data/state.json` — how far it has read (so it never double-alerts).
- `data/replies.jsonl` — every reply it alerted on. This is the seed for the
  conversation-history "memory" we'll build the AI auto-reply on later.

## Notes / limits

- Latency = the poll interval (up to ~2 min). Fine for outreach; if you ever want
  instant, the webhook version (`../aimfox-telegram-local`) does that.
- "Unread" is the signal. If you read a reply in Aimfox before the poller checks,
  it still catches it (it tracks message ids + timestamps, not just the unread flag),
  as long as the poller was running when the reply arrived.
- Aimfox rate limit is 60 req/min; this uses ~1 call per interval. No concern.
