# Incident Response Playbook — AXVN Tech Holding Langding Platform

> **Version:** 1.1 | **Owner:** CTO / DevOps Lead | **Review cycle:** Quarterly
> **Last updated:** 2025-Q3

---

## 1. Severity Classification

| Level | Name | Definition | Target Response | Target Resolution |
|-------|------|-----------|-----------------|-------------------|
| P0 | **Critical** | Production fully down; data breach confirmed; authentication bypassed | 15 min | 4 h |
| P1 | **High** | Major feature broken; significant performance degradation; suspected breach | 30 min | 8 h |
| P2 | **Medium** | Non-critical feature broken; intermittent errors; audit anomaly | 2 h | 24 h |
| P3 | **Low** | Cosmetic issue; minor UX bug; informational alert | Next business day | 72 h |

---

## 2. On-Call Contacts

| Role | Name | Contact | Escalation |
|------|------|---------|------------|
| Primary On-Call | DevOps Lead | WhatsApp / Signal (in team doc) | Immediate |
| Security Lead | CTO | Email + phone | P0/P1 only |
| Database Admin | Backend Lead | WhatsApp | P0/P1 only |
| Comms / PR | COO | Email | P0 customer impact |

> Contacts stored in the private `#incident-response` Slack/Teams channel.

---

## 3. Incident Lifecycle

```
Detected → Triaged → Contained → Eradicated → Recovered → Post-mortem
```

### 3.1 Detection Sources
- Uptime monitor alerts (`/api/health` endpoint)
- PM2 crash logs: `pm2 logs AXVN-langding --err`
- MongoDB Atlas / server alerts
- User-reported via support channel
- Automated audit-log anomaly (≥10 failed logins in 5 min)
- WhatsApp webhook error spike

### 3.2 Triage Checklist (first 15 minutes)
```
[ ] Confirm incident is real (not false positive)
[ ] Assign severity (P0–P3)
[ ] Create incident ticket / Slack thread (title: INC-YYYYMMDD-NNN)
[ ] Notify on-call contacts per severity table
[ ] Start incident timeline log (copy template below)
[ ] Preserve evidence — do NOT restart services before capturing logs
```

### 3.3 Incident Timeline Template
```
INC-YYYYMMDD-NNN  [SEVERITY]  [SHORT TITLE]

Timeline (UTC+7):
  HH:MM — [Detected by / how]
  HH:MM — [First responder notified]
  HH:MM — [Severity assigned]
  HH:MM — [Containment action taken]
  HH:MM — [Root cause identified]
  HH:MM — [Fix deployed]
  HH:MM — [Service restored / verified]

Affected systems:
  - 

Impact:
  - Users affected: 
  - Data exposure: Yes/No — [detail]
  - Revenue impact: 

Root cause:
  

Fix:
  

Prevention:
  
```

---

## 4. Runbooks by Incident Type

### 4.1 Application Down (P0)
```bash
# 1. Check PM2 status
pm2 status

# 2. Check recent crash logs
pm2 logs AXVN-langding --err --lines 100

# 3. Check Nginx
systemctl status nginx
nginx -t

# 4. Health endpoint
curl -s https://vnkr.vn/api/health | jq .

# 5. If crash loop — rollback
cd /var/lkvip/langding
bash scripts/rollback.sh
```

### 4.2 Database Connectivity Failure
```bash
# 1. Check DB connection logs
pm2 logs AXVN-langding --lines 50 | grep -i mongo

# 2. Test URI directly
mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')"

# 3. If Atlas — check Atlas status page + IP whitelist
# 4. Rotate MONGODB_URI if credentials compromised:
#    Edit .env.local → new MONGODB_URI
pm2 restart AXVN-langding
```

### 4.3 Authentication Bypass / Session Compromise
```bash
# 1. IMMEDIATE — rotate SESSION_SECRET
openssl rand -hex 64
# Edit .env.local → update SESSION_SECRET

# 2. Restart to invalidate all existing sessions
pm2 restart AXVN-langding

# 3. Audit recent admin logins
# Query AuditLog for action: "admin_login" last 24h
# Query AuditLog for action: "login_failed" spikes

# 4. Check middleware.ts HMAC validation is active
grep "verifyShareholderCookie" /var/lkvip/langding/src/middleware.ts

# 5. Force-invalidate shareholder sessions
#    (update lastPasswordChange on all shareholders in DB)
```

### 4.4 Data Breach (Confirmed or Suspected)
```bash
# 1. IMMEDIATELY notify Security Lead + COO
# 2. Preserve logs — do NOT wipe:
INCIDENT_DIR="/tmp/incident-$(date +%Y%m%d)"
mkdir -p "$INCIDENT_DIR"
cp -r /var/log/nginx "$INCIDENT_DIR/"
pm2 logs AXVN-langding --lines 5000 > "$INCIDENT_DIR/pm2.log"

# 3. Take DB snapshot before any changes
bash /var/lkvip/langding/scripts/backup.sh

# 4. Identify affected records via AuditLog
#    (capital events, shareholder ops have 7-year retention)

# 5. Legal / regulatory notification obligations:
#    - Personal data (PDPA Vietnam / GDPR): 72-hour notification window
#    - Financial data: Notify relevant regulators
```

### 4.5 WhatsApp Webhook Failure
```bash
# 1. Check webhook route logs
pm2 logs AXVN-langding --lines 50 | grep -i whatsapp

# 2. Verify WHATSAPP_VERIFY_TOKEN env var
grep WHATSAPP /var/lkvip/langding/.env.local

# 3. Test webhook manually
TOKEN=$(grep WHATSAPP_VERIFY_TOKEN /var/lkvip/langding/.env.local | cut -d= -f2)
curl -X GET "https://vnkr.vn/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=$TOKEN&hub.challenge=test"

# 4. Check Meta Business Manager webhook status
# 5. Re-register webhook if needed via Meta Business Manager
```

### 4.6 High Error Rate / Performance Degradation
```bash
# 1. Check server resources
top -bn1 | head -20
df -h
free -m

# 2. Check MongoDB slow queries (Atlas Performance Advisor)
# 3. Check for missing indexes — especially on AuditLog, Enquiry, Blog

# 4. Restart app if memory leak
pm2 restart AXVN-langding

# 5. If SSE connections piling up — check global heartbeat
pm2 logs AXVN-langding --lines 50 | grep -i sse
# SSE broker uses global heartbeat — không có per-connection timer (sse-broker.ts)
```

### 4.7 SSL Certificate Expired or Near Expiry
```bash
# 1. Check cert expiry
openssl x509 -enddate -noout -in /etc/letsencrypt/live/vnkr.vn/fullchain.pem

# 2. Manual renew
certbot renew --nginx

# 3. If renew fails — check DNS, firewall port 80
ufw status
curl -I http://vnkr.vn  # phải 200 hoặc redirect

# 4. Reload Nginx sau khi renew thành công
systemctl reload nginx
```

### 4.8 Nginx Down
```bash
# 1. Check status
systemctl status nginx

# 2. Test config
nginx -t

# 3. Restart
systemctl restart nginx

# 4. Check logs nếu vẫn fail
journalctl -u nginx -n 50
tail -n 50 /var/log/nginx/langding_error.log
```

---

## 5. Rollback Procedure

```bash
# Interactive rollback (recommended)
cd /var/lkvip/langding
bash scripts/rollback.sh

# Manual rollback nếu cần
cd /var/lkvip/langding
git log --oneline -10           # identify last-known-good SHA
git checkout <sha>
npm ci --omit=dev
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 reload AXVN-langding

# Verify
bash scripts/health-check.sh
```

---

## 6. Communication Templates

### Internal (Slack/Teams)
```
🚨 INCIDENT [P0/P1/P2]: <title>
Time detected: HH:MM UTC+7
Impact: <description>
Responder: <name>
Status: Investigating / Contained / Resolved
Next update: HH:MM
```

### Customer-Facing (if P0 with user impact)
```
We are aware of an issue affecting [feature]. Our team is actively working on a resolution.
We apologise for any inconvenience.
Status updates: [status page or contact email]
— AXVN Tech Holding Team
```

---

## 7. Post-Mortem Process

Required for all P0 and P1 incidents. Due within **5 business days**.

**Template:** `docs/postmortems/INC-YYYYMMDD-NNN.md`

Sections:
1. **Summary** — 1–2 sentences
2. **Timeline** (UTC+7)
3. **Root Cause Analysis** — 5 Whys
4. **Impact** — users, duration, data, revenue
5. **What went well**
6. **What went wrong**
7. **Action items** (owner + due date)

> Blameless culture: focus on systems and processes, not individuals.

---

## 8. Key Monitoring Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | App + DB liveness |
| `GET /api/admin/events/sse` | Admin realtime stream |
| `pm2 monit` | Process CPU/RAM |
| `/var/log/AXVN-backup.log` | Backup status |
| `bash scripts/health-check.sh` | Full smoke test |
| `bash infra/lkvip_holding/scripts/server-health.sh` | VPS system health |

---

## 9. Recovery Verification Checklist

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

## 10. Quick Reference Commands

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
systemctl reload nginx             # nginx reload

# Health
bash /var/lkvip/langding/scripts/health-check.sh
bash /var/lkvip/langding/infra/lkvip_holding/scripts/server-health.sh

# Backup on-demand
bash /var/lkvip/langding/scripts/backup.sh

# Rollback
bash /var/lkvip/langding/scripts/rollback.sh
```

---

*Last updated: 2025-Q3 | AXVN Tech Holding — Platform Engineering · vnkr.vn*
