# ================================================================
# infra/lkvip_holding/stalwart/README.md
#
# Stalwart Mail Server — Cấu hình cho lkvip_holding
# ================================================================

# Stalwart Mail Server

**Stalwart** là mail server all-in-one (IMAP, JMAP, SMTP) viết bằng Rust.
Được dùng cho internal email AXVN Tech Holding (noreply@vnkr.vn, etc.).

## Setup nhanh (Ubuntu 22.04)

```bash
# 1. Cài đặt Stalwart
curl --proto '=https' --tlsv1.2 -sSf https://get.stalw.art/install.sh | sudo sh

# 2. Stalwart service
sudo systemctl enable stalwart-mail
sudo systemctl start stalwart-mail

# 3. Admin UI: https://your-server:8080/admin
#    Default credentials: admin / <random — xem output cài đặt>
```

## Ports

| Port | Protocol | Mục đích |
|------|----------|---------|
| 25   | SMTP     | Receiving mail (MX) |
| 465  | SMTP SSL | Sending mail (submission) |
| 587  | SMTP TLS | Sending mail (STARTTLS) |
| 993  | IMAP SSL | IMAP client |
| 8080 | HTTP     | Admin UI (chỉ localhost) |

## DNS Records cần thiết

```
# MX record
vnkr.vn.  MX  10  mail.vnkr.vn.

# A record
mail.vnkr.vn.  A  <server-ip>

# SPF
vnkr.vn.  TXT  "v=spf1 mx a:mail.vnkr.vn ~all"

# DKIM (lấy public key từ Stalwart Admin UI)
default._domainkey.vnkr.vn.  TXT  "v=DKIM1; k=rsa; p=<public-key>"

# DMARC
_dmarc.vnkr.vn.  TXT  "v=DMARC1; p=quarantine; rua=mailto:postmaster@vnkr.vn"
```

## Nginx proxy cho Admin UI (localhost only)

```nginx
# Thêm vào nginx.conf.lkvip nếu cần access Admin UI qua browser:
server {
    listen 127.0.0.1:8081;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }
}
```

## Tích hợp với Langding App

SMTP config trong `.env.local`:
```env
SMTP_HOST=127.0.0.1
SMTP_PORT=587
SMTP_USER=noreply@vnkr.vn
SMTP_PASS=<password từ Stalwart Admin>
```

## Config files

Stalwart lưu config tại `/etc/stalwart/config.toml` sau khi cài đặt.
Xem tài liệu chính thức: https://stalw.art/docs/

## Backup mail data

```bash
# Backup mail data directory
tar -czf /var/backups/AXVN/stalwart-$(date +%Y%m%d).tar.gz /var/lib/stalwart/
```
