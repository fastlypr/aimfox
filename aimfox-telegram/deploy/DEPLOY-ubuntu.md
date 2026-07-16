# Deploy on Ubuntu (webhook + backup poll)

```
Aimfox ──HTTPS──► Caddy (:443, auto-TLS) ──► app.js (:3000) ──► Telegram
                        ▲
              aimfox.fastlypr.com  (DNS A record → server IP)
```

---

## Step 1 — Set up the subdomain (DNS)

You need a subdomain pointing at your server so Aimfox can reach it over HTTPS.

1. Find your server's **public IP**:
   ```bash
   curl -4 ifconfig.me
   ```
2. Go to wherever **fastlypr.com's DNS** is managed (your registrar, or Cloudflare
   if that's where the nameservers point).
3. Add a new **DNS record**:
   | Field | Value |
   |-------|-------|
   | Type  | `A` |
   | Name / Host | `aimfox`  (this creates `aimfox.fastlypr.com`) |
   | Value / Points to | your server's public IP from step 1 |
   | TTL   | Auto / default |
   | Proxy (Cloudflare only) | **DNS only** — grey cloud, NOT orange |
4. Save. Give it a few minutes, then verify from your laptop:
   ```bash
   dig +short aimfox.fastlypr.com     # should print your server IP
   ```

> **Cloudflare note:** the orange-cloud "Proxied" mode interferes with Caddy getting
> its own certificate. Set the record to **DNS only** (grey cloud). Simplest path.

---

## Step 2 — Install Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

## Step 3 — Put the app in place

```bash
sudo mkdir -p /opt/aimfox-telegram
# copy app.js, .env.example and the deploy/ folder into /opt/aimfox-telegram
sudo useradd --system --no-create-home aimfox
sudo chown -R aimfox:aimfox /opt/aimfox-telegram
```

## Step 4 — Configure

```bash
cd /opt/aimfox-telegram
sudo -u aimfox cp .env.example .env
sudo -u aimfox nano .env
```
Fill in `AIMFOX_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and set
`AIMFOX_WEBHOOK_SECRET` to a random string (`openssl rand -hex 16`).

## Step 5 — Run it as a service

```bash
sudo cp deploy/aimfox-telegram.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aimfox-telegram
sudo systemctl status aimfox-telegram      # active (running)
journalctl -u aimfox-telegram -f           # live logs
curl localhost:3000/                        # -> running message
```

## Step 6 — HTTPS with Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile     # make sure the domain = aimfox.fastlypr.com
sudo systemctl reload caddy
sudo ufw allow 80,443/tcp          # if a firewall is enabled
```

Verify HTTPS from your laptop:
```bash
curl https://aimfox.fastlypr.com/     # -> running message, valid cert
```

## Step 7 — Hand back to Claude

Send Claude:
- webhook URL: `https://aimfox.fastlypr.com/aimfox-reply`
- the `AIMFOX_WEBHOOK_SECRET` you set

Claude registers it on Aimfox (`POST /webhooks`, Vipan workspace) for
`reply` + `new_reply` + `campaign_reply`. Then trigger a real reply to confirm the
instant Telegram ping. (The backup poll is already working the moment the service
is up, even before HTTPS is finished.)

---

## Handy
```bash
sudo systemctl restart aimfox-telegram   # after editing .env
journalctl -u aimfox-telegram -f         # watch logs
tail -f /opt/aimfox-telegram/data/replies.jsonl
```
