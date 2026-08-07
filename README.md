# Fortress Investment Holdings — Website

Production-grade Next.js 15 website for Fortress Investment Holdings.
MongoDB database · Cloudinary media · Nodemailer email · Admin panel with signed-cookie auth.

---

## Quick Start (Local Development)

```bash
# 1. Clone and install
git clone <repo-url>
cd fortress-main
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET

# 3. Seed data
node scripts/seed-mongo.js   # Creates admin user in MongoDB
node scripts/seed.js         # Seeds flat-file demo data

# 4. Start dev server
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin-login
```

---

## Deploy to Ubuntu VPS

### Prerequisites
- Ubuntu 22.04 LTS (or 24.04)
- Root SSH access
- Domain A record pointing to VPS IP

### Step 1 — VPS Setup (run once as root)

```bash
ssh root@YOUR_VPS_IP
git clone <repo-url> /var/www/fortress/app
cd /var/www/fortress/app

# Installs Node.js 20, MongoDB 7, Nginx, Certbot, UFW, Fail2Ban, PM2
sudo bash scripts/setup.sh
```

### Step 2 — Configure Environment

```bash
cd /var/www/fortress/app
cp .env.example .env.local
nano .env.local

# Required values:
#   MONGODB_URI=mongodb://127.0.0.1:27017/fortress_db
#   ADMIN_EMAIL=admin@yourdomain.com
#   ADMIN_PASSWORD=<strong_password_min_12_chars>
#   SESSION_SECRET=$(openssl rand -hex 32)
#   NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 3 — Validate & First Deploy

```bash
bash scripts/check-env.sh          # Validate all required vars

export DOMAIN=yourdomain.com
bash scripts/first-deploy.sh       # Build → seed → Nginx → PM2
```

### Step 4 — SSL Certificate

```bash
bash scripts/ssl-setup.sh yourdomain.com
```

### Step 5 — Verify

```bash
pm2 status
curl -I https://yourdomain.com     # HTTP 200
```

---

## Rolling Updates (Zero-Downtime)

```bash
cd /var/www/fortress/app
git pull
bash scripts/deploy.sh            # npm ci → build → pm2 reload
```

---

## Backup & Restore

```bash
# Manual backup
bash scripts/backup.sh
# → /var/backups/fortress/fortress_YYYYMMDD_HHMMSS.gz

# Install automatic daily backup at 02:00
(crontab -l; echo "0 2 * * * /var/www/fortress/app/scripts/backup.sh >> /var/log/fortress-backup.log 2>&1") | crontab -

# Restore
mongorestore --uri="mongodb://127.0.0.1:27017" \
  --archive=/var/backups/fortress/fortress_YYYYMMDD_HHMMSS.gz --gzip
```

---

## PM2 Commands

```bash
pm2 status
pm2 logs fortress-website --lines 100
pm2 monit
pm2 reload fortress-website --update-env   # zero-downtime reload
pm2 restart fortress-website               # hard restart
pm2 save && pm2 startup                    # persist across reboots
```

---

## Security Architecture

### Session Cookies
- **Format:** `base64url(JSON{id,email,exp})` + `.` + `HMAC-SHA256(payload, SESSION_SECRET)`
- **httpOnly** + **secure** + **sameSite=strict** (production)
- **8-hour expiry** embedded in signed payload — cannot be forged
- **Constant-time comparison** prevents timing attacks
- **On logout:** cookie is explicitly expired (maxAge=0, expires=epoch)

### CSRF Protection
All admin API mutations (`POST/PUT/PATCH/DELETE` on `/api/admin/*`) require:
1. A `csrf_token` cookie (set by `GET /api/csrf`)
2. A matching `x-csrf-token` request header

The double-submit pattern means a cross-origin attacker cannot forge the header even if they can trigger the cookie.

The admin frontend must:
```js
// 1. On mount — fetch and store CSRF token
const { token } = await fetch('/api/csrf').then(r => r.json());

// 2. Include on all mutating requests
fetch('/api/admin/...', {
  method: 'POST',
  headers: { 'x-csrf-token': token, 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Rate Limiting
| Endpoint | Limit | Window | Lockout |
|----------|-------|--------|---------|
| `/api/admin-login` | 5 attempts | 1 min | Progressive (doubles each violation, max 24h) |
| `/api/contact` | 5 submissions | 5 min | Progressive |
| `/api/partner-submit` | 3 submissions | 10 min | Progressive |
| `/api/enquiries` (POST) | 5 submissions | 1 min | Progressive |

Rate-limit keys are cleared on successful login to avoid locking out legitimate users.

### Input Sanitization
All user-submitted strings are sanitized before Zod validation and DB writes:
- `sanitizeText()` — strips HTML tags, null bytes, control characters
- `sanitizeEmail()` — lowercases, removes non-email characters
- `sanitizeMessage()` — strips `<script>` blocks, null bytes

### Response Headers (every route)
Set by Next.js config and middleware:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Strict CSP; no inline eval; external scripts allowlisted |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | Set by Nginx (`max-age=63072000; includeSubDomains; preload`) |

### Error Messages
`handleError()` in [`src/utils/errors.ts`](src/utils/errors.ts) normalises all thrown errors:
- `AppError` subclasses: intentional messages pass through
- Mongoose `ValidationError`: field-level messages extracted, returned as 422
- Mongoose duplicate key: safe "Duplicate entry" message
- Unknown errors: logged server-side, client receives generic 500 (no stack trace leak)

---

## Admin Panel

| URL | Description |
|-----|-------------|
| `/admin-login` | Login page |
| `/admin` | Dashboard |
| `/admin/blog` | Blog post management |
| `/admin/content` | Page content management |
| `/admin/enquiries` | Contact & submission inbox |
| `/admin/settings` | Site settings, social links |

Admin credentials are set via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`.
The admin user is auto-created on first DB connection if no admin exists.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | `production` or `development` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Full URL e.g. `https://fortressih.com` |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `ADMIN_EMAIL` | ✅ | Admin email (seed + fallback auth) |
| `ADMIN_PASSWORD` | ✅ | Admin password (min 12 chars) |
| `SESSION_SECRET` | ✅ | 32+ char hex for signing cookies — `openssl rand -hex 32` |
| `SMTP_HOST` | ⭕ | SMTP host e.g. `smtp.gmail.com` |
| `SMTP_USER` | ⭕ | SMTP username |
| `SMTP_PASS` | ⭕ | SMTP password / app password |
| `SMTP_FROM` | ⭕ | From address for outgoing emails |
| `CLOUDINARY_CLOUD_NAME` | ⭕ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ⭕ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ⭕ | Cloudinary API secret |
| `BACKUP_RETENTION_DAYS` | ⭕ | Days to retain backups (default: 30) |

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin-login/      POST  — login with rate-limit + lockout
│   │   │   ├── admin-logout/     POST  — clears session cookie
│   │   │   ├── admin-session/    GET   — check current session
│   │   │   ├── csrf/             GET   — issue CSRF token
│   │   │   ├── admin/            Admin CRUD routes (CSRF-protected)
│   │   │   ├── contact/          POST  — public contact form (sanitized)
│   │   │   ├── partner-submit/   POST  — investment proposal form
│   │   │   └── ...
│   │   ├── admin/                Admin panel pages (session-protected)
│   │   └── admin-login/          Login page
│   ├── lib/
│   │   ├── session.ts            HMAC-signed cookie session
│   │   ├── csrf.ts               CSRF double-submit token
│   │   ├── auth-utils.ts         getCurrentUser, requireAuth
│   │   ├── db.ts                 MongoDB connection + admin seed
│   │   └── email.ts              Nodemailer wrapper
│   ├── utils/
│   │   ├── rate-limit.ts         Progressive lockout rate limiter
│   │   ├── sanitize.ts           Input sanitization (HTML strip)
│   │   ├── errors.ts             Safe error normalisation
│   │   ├── api-response.ts       Typed response helpers
│   │   └── cloudinary.ts         Upload/delete helpers
│   ├── models/                   Mongoose models
│   ├── services/                 Business logic
│   └── validators/               Zod schemas
├── middleware.ts                 Edge: session guard + CSRF check + security headers
├── scripts/
│   ├── setup.sh                  Ubuntu VPS one-time setup (as root)
│   ├── first-deploy.sh           First deploy: build + seed + Nginx + PM2
│   ├── deploy.sh                 Rolling update (zero-downtime)
│   ├── backup.sh                 mongodump with rotation
│   ├── ssl-setup.sh              certbot SSL + auto-renewal cron
│   ├── check-env.sh              Validate env vars before deploy
│   ├── seed-mongo.js             MongoDB admin seed
│   └── seed.js                   Flat-file demo seed
├── ecosystem.config.js           PM2 cluster config
├── nginx.conf.example            Nginx reverse-proxy + SSL template
├── next.config.ts                Output: standalone; CSP; security headers
└── middleware.ts                 Edge: auth guard + CSRF + response headers
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, standalone output) |
| Language | TypeScript |
| Database | MongoDB 7 + Mongoose |
| Styling | Tailwind CSS 4 + Framer Motion + GSAP |
| Auth | HMAC-SHA256 signed httpOnly cookies |
| CSRF | Double-submit signed token |
| Rate Limiting | In-process progressive lockout |
| Input Safety | Custom HTML/script sanitizer (defence-in-depth) |
| Media | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Validation | Zod |
| Process Mgr | PM2 (cluster mode) |
| Web Server | Nginx (TLS 1.3, OCSP stapling, HSTS) |
| SSL | Let's Encrypt / Certbot |
