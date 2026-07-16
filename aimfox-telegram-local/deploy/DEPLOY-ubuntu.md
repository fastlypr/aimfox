# Deploying on Ubuntu

Goal: `server.js` runs 24/7 as a service, reachable at a public HTTPS URL that
Aimfox can post replies to.

```
Aimfox ──(HTTPS webhook)──► Caddy (:443, auto-TLS) ──► server.js (localhost:3000) ──► Telegram
                                    ▲
                          aimfox.yourdomain.com  (DNS A record → server IP)
```

Prerequisites: an Ubuntu server with a public IP, and a **subdomain** you can point
at it (Aimfox needs valid HTTPS, which needs a domain — a bare IP won't do).

---

## 1. Install Node.js 20+ (you tested on v24)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # confirm >= 20
```

## 2. Put the app in place

```bash
sudo mkdir -p /opt/aimfox-telegram-local
# copy server.js, .env.example (and the deploy/ folder) into /opt/aimfox-telegram-local
sudo useradd --system --no-create-home aimfox        # dedicated service user
sudo chown -R aimfox:aimfox /opt/aimfox-telegram-local
```

## 3. Configure

```bash
cd /opt/aimfox-telegram-local
sudo -u aimfox cp .env.example .env
sudo -u aimfox nano .env
```

Fill in:
- `TELEGRAM_BOT_TOKEN` (from @BotFather)
- `TELEGRAM_CHAT_ID` (from @userinfobot)
- **`AIMFOX_WEBHOOK_SECRET`** — set this on a public server. Put any long random
  string (`openssl rand -hex 16`). It stops random internet traffic from spamming
  your Telegram; Claude adds the matching header when registering the webhook.

## 4. Run it as a service

```bash
sudo cp deploy/aimfox-telegram.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aimfox-telegram
sudo systemctl status aimfox-telegram        # should be "active (running)"
journalctl -u aimfox-telegram -f             # live logs
```

Test locally on the box:

```bash
curl localhost:3000/          # -> "Aimfox → Telegram relay is running."
```

## 5. HTTPS with Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

Point a DNS **A record** (e.g. `aimfox.yourdomain.com`) at the server's public IP,
then edit the Caddyfile with that domain:

```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile      # replace aimfox.example.com with your subdomain
sudo systemctl reload caddy
```

Open port 80 and 443 if a firewall is on:

```bash
sudo ufw allow 80,443/tcp
```

## 6. Verify + hand off to Claude

```bash
curl https://aimfox.yourdomain.com/     # -> "Aimfox → Telegram relay is running."
```

Then send Claude:
- your webhook URL: `https://aimfox.yourdomain.com/aimfox-reply`
- the `AIMFOX_WEBHOOK_SECRET` value you set (so it's added as the `x-webhook-secret` header)

Claude registers it on the Aimfox (Vipan) workspace for `reply`, `new_reply`,
`campaign_reply`. Then trigger a real reply and you get your first Telegram ping.

---

## Handy commands

```bash
sudo systemctl restart aimfox-telegram    # after editing .env
journalctl -u aimfox-telegram -f          # watch logs
tail -f /opt/aimfox-telegram-local/data/replies.jsonl   # raw reply history
```
