# Runbook — AXVN Tech Holding Langding

> Tài liệu vận hành hợp nhất: deploy, rollback, backup, incident response và troubleshooting.
> Mọi incident nghiêm trọng → bắt đầu từ Phần 4.

---

## 1. Quy trình Phát triển & Triển khai

### 1.1. Local development
```bash
cp .env.local.example .env.local  # điền secrets
npm install
npm run dev
```

### 1.2. Kiểm tra trước khi commit
```bash
npx tsc --noEmit --pretty false   # TypeScript check
npm run lint                       # ESLint (0 warnings)
npm run build                      # Production build
git diff --check                   # Whitespace/conflict markers
```
Hoặc chạy toàn bộ pipeline: `bash scripts/verify.sh`

### 1.3. First-time VPS provisioning
```bash
sudo bash scripts/setup.sh
# Cài: Node.js 22.x, PM2, Nginx, pm2-logrotate
# Tạo: /var/backups/AXVN, /var/log/pm2
```

### 1.4. Deploy lên production (Ubuntu VPS)
```bash
# Full deploy (git pull + build + PM2 reload)
bash scripts/deploy.sh

# Tùy chọn:
bash scripts/deploy.sh --skip-build   # copy assets + reload PM2 (code không đổi)
bash scripts/deploy.sh --no-git       # build từ code hiện tại (không git pull)
```

**Quy trình bên trong `deploy.sh`:**
1. Validate `.env.local` (`check-env.sh`)
2. `git pull --ff-only`
3. `tsc --noEmit`
4. `npm run build` → `.next/standalone/`
5. Copy `.next/static` + `public` → standalone
6. Sync + test Nginx config
7. `pm2 reload AXVN-langding` (zero-downtime)
8. Smoke test (homepage, /api/health, /admin redirect)

### 1.5. Rollback
```bash
# Interactive (hiển thị 10 commits gần nhất + prompt)
bash scripts/rollback.sh

# Trực tiếp với SHA
bash scripts/rollback.sh <git-sha>

# Chỉ xem lịch sử
bash scripts/rollback.sh --list
```

### 1.6. Seed dữ liệu mẫu (first-time setup)
```bash
# Gói đầu tư
npx tsx scripts/seed-investment-plans.ts
# --force để override nếu đã có dữ liệu

# RBAC
npx tsx scripts/seed-rbac.ts

# Reset mật khẩu admin khẩn cấp
npx tsx scripts/reset-admin.ts
```

### 1.7. Backup MongoDB
```bash
# Chạy thủ công
bash scripts/backup.sh

# Cron hàng ngày lúc 2:00 AM:
# 0 2 * * * /var/lkvip/langding/scripts/backup.sh >> /var/log/AXVN-backup.log 2>&1
```
- Backup local: `/var/backups/AXVN/AXVN_YYYYMMDD_HHMMSS.gz`
- Retention: 30 ngày (default) — cấu hình qua `BACKUP_RETENTION_DAYS`
- Offsite S3: tự động nếu `S3_BUCKET` được cấu hình

### 1.8. SSL certificate
```bash
# Lấy cert lần đầu (sau khi DNS đã trỏ)
certbot --nginx -d vnkr.vn

# Renew thủ công
certbot renew --nginx && systemctl reload nginx

# Cron SSL renew (đã có trong setup):
# 30 3 * * * certbot renew --nginx --quiet
```

---

## 2. Health Check & Monitoring

```bash
# Full smoke test
bash scripts/health-check.sh

# Từ xa
BASE_URL=https://vnkr.vn bash scripts/health-check.sh
```

**Endpoints quan trọng:**

| Endpoint | Mục đích |
|---|---|
| `GET /api/health` | App + DB liveness |
| `GET /api/admin/events/sse` | Admin realtime stream |
| `pm2 monit` | Process CPU/RAM |
| `/var/log/AXVN-backup.log` | Backup status |
| `bash infra/lkvip_holding/scripts/server-health.sh` | VPS system health |

**Quick commands:**
```bash
# App status
pm2 status
pm2 show AXVN-langding

# Logs
pm2 logs AXVN-langding --lines 100
pm2 logs AXVN-langding --err --lines 50
tail -f /var/log/nginx/langding_error.log

# Restart/reload
pm2 reload AXVN-langding          # zero-downtime
pm2 restart AXVN-langding         # full restart
systemctl reload nginx
```

---

## 3. Post-deploy Verification

```bash
# 1. Health check
curl https://vnkr.vn/api/health
# Expected: {"status":"ok","db":"connected","uptime":...}

# 2. PM2 fork mode
pm2 show AXVN-langding | grep exec_mode
# Expected: fork_mode

# 3. npm audit passes
npm audit --audit-level=high
# Expected: 0 high/critical vulnerabilities

# 4. Rate limit (shareholder)
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://vnkr.vn/api/shareholders/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Expected: 401 × 5, 429 × 1

# 5. Backup paths
bash scripts/backup.sh
# Expected: /var/backups/AXVN/AXVN_YYYYMMDD_HHMMSS.gz
```

---

## 4. Incident Response

### 4.1. Severity Classification

| Level | Name | Definition | Response | Resolution |
|---|---|---|---|---|
| P0 | **Critical** | Production fully down; data breach confirmed; auth bypassed | 15 min | 4 h |
| P1 | **High** | Major feature broken; significant perf degradation; suspected breach | 30 min | 8 h |
| P2 | **Medium** | Non-critical feature broken; intermittent errors; audit anomaly | 2 h | 24 h |
| P3 | **Low** | Cosmetic issue; minor UX bug; informational alert | Next business day | 72 h |

### 4.2. On-Call Contacts

| Role | Escalation |
|---|---|
| DevOps Lead (Primary On-Call) | Immediate — WhatsApp/Signal (in team doc) |
| CTO (Security Lead) | P0/P1 only — Email + phone |
| Backend Lead (Database Admin) | P0/P1 only — WhatsApp |
| COO (Comms/PR) | P0 customer impact — Email |

> Contacts stored in private `#incident-response` Slack/Teams channel.

### 4.3. Incident Lifecycle
```
Detected → Triaged → Contained → Eradicated → Recovered → Post-mortem
```

**Detection sources:**
- Uptime monitor alerts (`/api/health`)
- PM2 crash logs: `pm2 logs AXVN-langding --err`
- MongoDB Atlas / server alerts
- User-reported via support channel
- Audit-log anomaly (≥ 10 failed logins in 5 min)

**Triage checklist (first 15 minutes):**
```
[ ] Confirm incident is real (not false positive)
[ ] Assign severity (P0–P3)
[ ] Create incident ticket (INC-YYYYMMDD-NNN)
[ ] Notify on-call per severity table
[ ] Start incident timeline log
[ ] Preserve evidence — do NOT restart before capturing logs
```

**Incident timeline template:**
```
INC-YYYYMMDD-NNN  [SEVERITY]  [SHORT TITLE]

Timeline (UTC+7):
  HH:MM — Detected by / how
  HH:MM — First responder notified
  HH:MM — Severity assigned
  HH:MM — Containment action taken
  HH:MM — Root cause identified
  HH:MM — Fix deployed
  HH:MM — Service restored / verified

Affected systems:
Impact (users, data exposure, revenue):
Root cause:
Fix:
Prevention:
```

### 4.4. Runbooks by Incident Type

**P0 — Application Down:**
```bash
pm2 status
pm2 logs AXVN-langding --err --lines 100
systemctl status nginx && nginx -t
curl -s https://vnkr.vn/api/health | jq .
# Nếu crash loop:
bash scripts/rollback.sh
```

**Database Connectivity Failure:**
```bash
pm2 logs AXVN-langding --lines 50 | grep -i mongo
mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')"
# Atlas: kiểm tra status page + IP whitelist
# Nếu credentials bị lộ: edit .env.local → pm2 restart AXVN-langding
```

**Auth Bypass / Session Compromise:**
```bash
# NGAY LẬP TỨC: xoay SESSION_SECRET
openssl rand -hex 64
# Cập nhật .env.local → SESSION_SECRET
pm2 restart AXVN-langding  # invalidate tất cả sessions

# Audit recent admin logins
# AuditLog: action "admin_login", "login_failed" last 24h

# Verify proxy HMAC active
grep "verifyShareholderCookie" /var/lkvip/langding/src/proxy.ts
```

**Data Breach (confirmed or suspected):**
```bash
# 1. NGAY: Notify Security Lead + COO
# 2. Preserve logs TRƯỚC khi làm bất cứ điều gì:
INCIDENT_DIR="/tmp/incident-$(date +%Y%m%d)"
mkdir -p "$INCIDENT_DIR"
cp -r /var/log/nginx "$INCIDENT_DIR/"
pm2 logs AXVN-langding --lines 5000 > "$INCIDENT_DIR/pm2.log"

# 3. DB snapshot ngay
bash /var/lkvip/langding/scripts/backup.sh

# 4. Xác định records bị ảnh hưởng qua AuditLog
# 5. Nghĩa vụ thông báo:
#    - Dữ liệu cá nhân (PDPA Vietnam): 72h notification window
#    - Dữ liệu tài chính: thông báo cơ quan liên quan
```

**WhatsApp Webhook Failure:**
```bash
pm2 logs AXVN-langding --lines 50 | grep -i whatsapp
grep WHATSAPP /var/lkvip/langding/.env.local

TOKEN=$(grep WHATSAPP_VERIFY_TOKEN /var/lkvip/langding/.env.local | cut -d= -f2)
curl -X GET "https://vnkr.vn/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=$TOKEN&hub.challenge=test"
# Re-register webhook qua Meta Business Manager nếu cần
```

**High Error Rate / Performance Degradation:**
```bash
top -bn1 | head -20
df -h && free -m
# MongoDB: kiểm tra slow queries (Atlas Performance Advisor)
# Missing indexes: AuditLog, Enquiry, Blog
pm2 restart AXVN-langding  # nếu nghi memory leak
pm2 logs AXVN-langding --lines 50 | grep -i sse
```

**SSL Certificate Expired:**
```bash
openssl x509 -enddate -noout -in /etc/letsencrypt/live/vnkr.vn/fullchain.pem
certbot renew --nginx
systemctl reload nginx
# Nếu fail: kiểm tra DNS, firewall port 80
ufw status && curl -I http://vnkr.vn
```

**Nginx Down:**
```bash
systemctl status nginx
nginx -t
systemctl restart nginx
journalctl -u nginx -n 50
tail -n 50 /var/log/nginx/langding_error.log
```

### 4.5. Communication Templates

**Internal (Slack/Teams):**
```
[INCIDENT P0/P1/P2]: <title>
Time detected: HH:MM UTC+7
Impact: <description>
Responder: <name>
Status: Investigating / Contained / Resolved
Next update: HH:MM
```

**Customer-facing (P0 with user impact):**
```
We are aware of an issue affecting [feature]. Our team is actively working on a resolution.
We apologise for any inconvenience.
Status updates: [status page or contact email]
— AXVN Tech Holding Team
```

### 4.6. Post-Mortem
Required for all P0 and P1 incidents. Due within **5 business days**.  
Template: `docs/postmortems/INC-YYYYMMDD-NNN.md`

Sections: Summary · Timeline (UTC+7) · Root Cause (5 Whys) · Impact · What went well · What went wrong · Action items (owner + due date)

> Blameless culture: focus on systems and processes, not individuals.

### 4.7. Recovery Verification Checklist
```
[ ] /api/health returns 200 with db: "ok"
[ ] Admin login works
[ ] Shareholder login works (HMAC cookie valid)
[ ] MongoDB connection stable (no retry logs)
[ ] SSE streams active (admin events + shareholder messages)
[ ] WhatsApp webhook responding
[ ] Latest backup exists and < 24h old
[ ] No new error spikes in PM2 logs
[ ] SSL cert valid > 14 days
[ ] Nginx config test passes (nginx -t)
```

---

## 5. Troubleshooting

### 5.1. MongoDB / Database

**Lỗi kết nối:**
```bash
grep MONGODB_URI .env.local
mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')"
# Đảm bảo IP server đã whitelist trong Atlas Network Access
# URI format: mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

**Dữ liệu gói đầu tư trống:**
```bash
npx tsx scripts/seed-investment-plans.ts  # --force để override
```

**Schema migration:**
1. `bash scripts/backup.sh`
2. Viết script vào `scripts/archived/migrate-YYYYMMDD.ts`
3. Chạy với `npx tsx` sau khi review kỹ

**MongoDB connection pool exhausted:**
```bash
pm2 restart AXVN-langding
grep -r "mongoose.connect" src/
# Chỉ nên có 1 kết quả trong src/core/database/db.ts
```

---

### 5.2. Realtime (SSE)

**SSE không nhận tin nhắn:**
1. Kiểm tra SSE route handlers trong `src/app/api/` — pub/sub hoạt động không
2. Nginx phải có trong `location /`:
```nginx
proxy_buffering       off;
proxy_cache           off;
proxy_set_header      Connection "upgrade";
proxy_http_version    1.1;
```
3. Browser không block SSE (DevTools → Network → EventSource)
4. **Không dùng PM2 cluster mode** — SSE in-memory chỉ hoạt động `fork` mode

**SSE connections piling up / memory leak:**
```bash
pm2 logs AXVN-langding --lines 100 | grep -i sse
grep -n "setInterval" src/app/api/admin/events/sse/route.ts src/app/api/shareholders/messages/sse/route.ts
# Phải có 1 global timer duy nhất, không per-connection
```

**SSE local OK nhưng production fail:**
- Nginx `proxy_read_timeout` phải ≥ 120s
- Cloudflare Free plan có thể timeout SSE connections

---

### 5.3. Deploy / Build

**Build thất bại:**
```bash
npx tsc --noEmit --pretty false
npm run build 2>&1 | tail -30
```

**PM2 reload không thành công:**
```bash
pm2 logs AXVN-langding --lines 200
bash scripts/check-env.sh
ls -la .next/standalone/server.js
ls -la .next/standalone/.next/static/ .next/standalone/public/
```

**"Another build is already running":**
```bash
rm -rf .next/build 2>/dev/null || true
npm run build
```

**Next.js standalone không start:**
```bash
NODE_ENV=production PORT=3000 node .next/standalone/server.js
# Nếu module not found: npm ci --omit=dev
```

**TypeScript errors sau khi thêm package:**
```bash
npm run build    # tạo .next/types trước
npx tsc --noEmit
```

---

### 5.4. PM2

**Process không start / crash loop:**
```bash
pm2 logs AXVN-langding --err --lines 100
cat infra/ecosystem.config.js
pm2 delete AXVN-langding
pm2 start infra/ecosystem.config.js --env production
pm2 save
```

**PM2 không tự start sau reboot:**
```bash
pm2 startup
# Chạy lệnh mà pm2 startup in ra
pm2 save
```

**PM2 log quá lớn:**
```bash
ls -lh /var/log/pm2/
pm2 flush AXVN-langding
pm2 show pm2-logrotate || make pm2-setup
```

**Memory restart loop:**
```bash
pm2 show AXVN-langding | grep memory
pm2 restart AXVN-langding --max-memory-restart 1G
# Nguyên nhân thường: SSE connections không cleanup, rate limiter in-memory tích tụ
```

---

### 5.5. Nginx

**502 Bad Gateway:**
```bash
pm2 status
ss -tlnp | grep 3000
nginx -t
```

**SSL cert lỗi / expired:**
```bash
openssl x509 -enddate -noout -in /etc/letsencrypt/live/vnkr.vn/fullchain.pem
certbot renew --nginx && systemctl reload nginx
```

**Nginx không reload (syntax error):**
```bash
nginx -t
journalctl -u nginx -n 30
tail -n 30 /var/log/nginx/error.log
```

---

### 5.6. Authentication / Session

**Admin login redirect loop:**
```bash
grep SESSION_SECRET .env.local
# SESSION_SECRET phải ≥ 64 hex chars
openssl rand -hex 64
```

**Shareholder cookie không hợp lệ:**
```bash
grep "verifyShareholderCookie" src/proxy.ts
# Nếu đã đổi SESSION_SECRET → tất cả sessions cũ invalid (expected)
```

**CSRF token error (403 Forbidden):**
- Client gọi `GET /api/csrf` trước để lấy token
- Gửi trong header `x-csrf-token` với mỗi mutation
- CSRF token expire sau session timeout (8h)

**MFA loop (không qua được login):**
```bash
# Emergency: disable MFA qua DB (chỉ khi mất access hoàn toàn)
mongosh "$MONGODB_URI" --eval "
  db.admins.updateOne(
    { email: 'admin@vnkr.vn' },
    { \$set: { mfaEnabled: false, mfaRequiredForLogin: false } }
  )
"
```

---

### 5.7. AI / Anthropic Claude

**AI không phản hồi:**
1. Kiểm tra `ANTHROPIC_API_KEY` trong `.env.local`
2. Billing + quota: [console.anthropic.com](https://console.anthropic.com)
3. `pm2 logs AXVN-langding --lines 30 | grep -i anthropic`

---

### 5.8. Cloudinary / Media

**Upload thất bại:**
```bash
grep CLOUDINARY .env.local
# pm2 logs AXVN-langding | grep -i cloudinary
```

**Ảnh không load (404):**
- Folder namespace phải là `AXVN/` (không còn `fortress/`)
- Kiểm tra URL trong DB: `db.uploads.find({}).limit(5)`

---

### 5.9. Email (SMTP / Nodemailer)

**Email không gửi:**
```bash
grep SMTP .env.local
telnet $SMTP_HOST $SMTP_PORT
pm2 logs AXVN-langding --lines 30 | grep -i smtp
```

---

### 5.10. Environment / Config

**Biến env không được load:**
```bash
bash scripts/check-env.sh   # hoặc: make env-check
```

**Permission denied khi chạy scripts:**
```bash
chmod +x scripts/*.sh
chmod +x infra/lkvip_holding/scripts/*.sh
```

**node_modules missing / corrupt:**
```bash
rm -rf node_modules && npm ci
```

**ESLint crash (FlatCompat circular JSON):**
```bash
cat eslint.config.mjs
DEBUG=eslint:* npm run lint 2>&1 | head -30
```

---

### 5.11. Security Alerts

**Rate limit 429 Too Many Requests (giả):**
```bash
# Kiểm tra X-Real-IP forwarding qua Nginx
grep "X-Real-IP" /etc/nginx/sites-available/langding.conf
```

**npm audit warnings:**
```bash
npm audit
npm audit fix               # cẩn thận breaking changes
npm audit fix --force       # chỉ khi hiểu rõ impact
```

---

*Last reviewed: 2026-08 | AXVN Tech Holding — Platform Engineering · vnkr.vn*
