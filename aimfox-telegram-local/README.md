# Aimfox → Telegram (local relay)

A tiny local server that gets a Telegram ping whenever a new reply lands in Aimfox.
Pure Node.js, **no dependencies**, runs on your Mac.

```
Aimfox  ──(webhook)──►  cloudflared tunnel  ──►  server.js (localhost)  ──►  Telegram
```

Aimfox is a cloud service, so it needs a public HTTPS URL to reach your Mac.
`cloudflared` provides a free tunnel for that. Your code and data stay local.

---

## 1. Create the Telegram bot

1. Open Telegram, message **@BotFather**, send `/newbot`, follow the prompts.
2. Copy the **bot token** it gives you (looks like `123456789:AAE...`).
3. Message **@userinfobot** — it replies with your numeric **chat id**.
   (For a team group: add the bot to the group, then use the group's id.)

## 2. Configure

```bash
cd aimfox-telegram-local
cp .env.example .env
```

Open `.env` and paste in your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

## 3. Run the server

```bash
node --env-file=.env server.js
```

You should see `🚀 ... relay listening on http://localhost:3000/aimfox-reply`.
Leave this terminal open (it must stay running to receive replies).

## 4. Expose it with a tunnel

Install cloudflared (once):

```bash
brew install cloudflared
```

In a **second terminal**, start the tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
```

It prints a public URL like `https://random-words.trycloudflare.com`.
**Your webhook URL is that + the path**, e.g.
`https://random-words.trycloudflare.com/aimfox-reply`

Copy that full URL and send it to Claude — Claude registers it on the Aimfox side.

> Note: the free quick-tunnel URL changes each time you restart cloudflared.
> Fine for testing. For an always-on setup we can use a named tunnel (fixed URL)
> or move the server to a small always-on host later.

## 5. Test

Once the Aimfox webhook is pointed at your tunnel URL, have someone reply to one of
your LinkedIn campaigns (or wait for a real one). You should get a Telegram message.

Every raw payload is also saved to `data/replies.jsonl` — this is the start of the
conversation-history "memory" for the later AI-reply phase.

---

## Troubleshooting

- **No Telegram message?** Check the server terminal for `❌ failed to send` — usually a
  wrong token or chat id. Send the bot a message first if it's a fresh bot.
- **Aimfox not hitting you?** Make sure both the server *and* the tunnel are running,
  and that the registered webhook URL matches the current tunnel URL.
- **Want only Aimfox to reach you?** Set `AIMFOX_WEBHOOK_SECRET` in `.env` to a random
  string; Claude will add it as a header on the Aimfox webhook.
