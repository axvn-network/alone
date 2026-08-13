# AXVN Tech Holding — Website

Next.js website cho AXVN Tech Holding.
MongoDB · Cloudinary · Nodemailer · Admin panel với HMAC-signed cookie auth · SSE realtime · AI content assistant.

> **Lưu ý trước khi public:** Chủ sở hữu cần xác minh toàn bộ thông tin pháp lý, giấy phép, số liệu tài chính, địa chỉ và kênh liên hệ trong CMS/Settings trước khi go-live.

---

## Quick Start (Development)

```bash
# 1. Clone & cài đặt
git clone <repo-url>
cd langding
npm install

# 2. Cấu hình môi trường
cp .env.example .env.local
# Chỉnh .env.local — bắt buộc: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET

# 3. Khởi động dev server
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin-login

# 4. Seed gói đầu tư mẫu (chỉ dùng lần đầu với DB trống)
npm run seed:plans
```

---

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
npm run build
npm run verify
```

Không có migration độc lập trong repository. MongoDB indexes do Mongoose quản lý khi ứng dụng khởi động; mọi migration dữ liệu phải được bổ sung và review riêng trước khi chạy production.

---

## Deploy (Ubuntu VPS)

```bash
# Rolling update (zero-downtime)
cd /var/lkvip/langding
git pull
bash scripts/deploy.sh     # typecheck → build → PM2 reload
```

### Cấu hình môi trường production

```bash
cp .env.example .env.local
nano .env.local
# MONGODB_URI=mongodb://127.0.0.1:27017/AXVN_db
# ADMIN_EMAIL=admin@yourdomain.com
# ADMIN_PASSWORD=<strong_min_12_chars>
# SESSION_SECRET=$(openssl rand -hex 32)
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# GEMINI_API_KEY=AIza...
```

### Xác minh sau deploy

```bash
pm2 status
curl -I https://yourdomain.com   # HTTP 200
bash scripts/check-env.sh        # Kiểm tra tất cả env vars
```

---

## PM2

```bash
pm2 status
pm2 logs AXVN-langding --lines 100
pm2 reload AXVN-langding --update-env   # zero-downtime reload
pm2 restart AXVN-langding               # hard restart
pm2 save && pm2 startup                    # persist across reboots
```

---

## Backup & Restore

```bash
# Backup thủ công
bash scripts/backup.sh
# → /var/backups/AXVN/AXVN_YYYYMMDD_HHMMSS.gz

# Backup tự động hằng ngày lúc 02:00
(crontab -l; echo "0 2 * * * /var/lkvip/langding/scripts/backup.sh >> /var/log/AXVN-backup.log 2>&1") | crontab -

# Restore
mongorestore --uri="mongodb://127.0.0.1:27017" \
  --archive=/var/backups/AXVN/AXVN_YYYYMMDD_HHMMSS.gz --gzip
```

---

## Admin Panel

| URL | Quyền | Mô tả |
|-----|-------|-------|
| `/admin-login` | Public | Đăng nhập admin |
| `/admin` | Admin | Dashboard — stats & activity |
| `/admin/blog` | Admin | Quản lý bài viết (AI assist) |
| `/admin/content` | Admin | Quản lý nội dung trang (AI assist) |
| `/admin/documents` | Admin | Tài liệu quản trị (AI assist) |
| `/admin/investment-plans` | Admin | Gói đầu tư (AI điền nội dung VI/EN) |
| `/admin/shareholders` | Admin | Cổ đông + nhiệm vụ + họp + tin nhắn (AI assist) |
| `/admin/enquiries` | Admin | Hộp thư liên hệ & đề xuất |
| `/admin/calls` | Admin | Quản lý URL phòng họp |
| `/admin/settings` | **Superadmin** | Cài đặt hệ thống, footer, newsletter (AI assist) |
| `/admin/admins` | **Superadmin** | Quản lý tài khoản admin |
| `/admin/audit-log` | **Superadmin** | Nhật ký hoạt động hệ thống |

### Shareholder Portal

| URL | Mô tả |
|-----|-------|
| `/shareholders/login` | Đăng nhập cổ đông |
| `/shareholders/dashboard` | Portal: nhiệm vụ, họp, nhắn tin realtime (SSE) |

---

## Environment Variables

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `NODE_ENV` | ✅ | `production` hoặc `development` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL đầy đủ e.g. `https://vnkr.vn` |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `ADMIN_EMAIL` | ✅ | Email admin (seed + fallback auth) |
| `ADMIN_PASSWORD` | ✅ | Mật khẩu admin (tối thiểu 12 ký tự) |
| `SESSION_SECRET` | ✅ | 32+ hex chars — `openssl rand -hex 32` |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key (AI assistant) |
| `SMTP_HOST` | ⭕ | SMTP host e.g. `smtp.gmail.com` |
| `SMTP_USER` | ⭕ | SMTP username |
| `SMTP_PASS` | ⭕ | SMTP password / app password |
| `SMTP_FROM` | ⭕ | From address cho email gửi đi |
| `CLOUDINARY_CLOUD_NAME` | ⭕ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ⭕ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ⭕ | Cloudinary API secret |
| `WHATSAPP_VERIFY_TOKEN` | ⭕ | Webhook verify token (WhatsApp Business) |
| `WHATSAPP_ACCESS_TOKEN` | ⭕ | Meta permanent access token |
| `WHATSAPP_PHONE_NUMBER_ID` | ⭕ | Phone Number ID từ Meta dashboard |
| `NEXT_PUBLIC_GA_ID` | ⭕ | GA4 measurement ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⭕ | Meta Pixel ID |
| `BACKUP_RETENTION_DAYS` | ⭕ | Số ngày giữ backup (mặc định: 30) |

---

## Security

### Session
- **Format:** `base64url(JSON{id,email,exp})` + `.` + `HMAC-SHA256(payload, SESSION_SECRET)`
- `httpOnly` + `secure` + `sameSite=strict` (production)
- Hết hạn 8 giờ, nhúng trong payload đã ký — không thể giả mạo
- So sánh constant-time chống timing attack

### CSRF
Tất cả mutation admin (`POST/PUT/PATCH/DELETE /api/admin/*`) yêu cầu:
1. Cookie `csrf_token` (set bởi `GET /api/csrf`)
2. Header `x-csrf-token` khớp

Double-submit pattern: kẻ tấn công cross-origin không thể giả mạo header dù trigger được cookie.

### Rate Limiting
| Endpoint | Giới hạn | Cửa sổ |
|----------|---------|--------|
| `/api/admin-login` | 5 lần | 1 phút (per IP + per user) |
| `/api/contact` | 5 lần | 5 phút |
| `/api/partner-submit` | 3 lần | 10 phút |
| `/api/shareholders/messages/sse` | 20 kết nối | 60 giây |

### Security Headers (mọi route)
`X-Frame-Options: SAMEORIGIN` · `X-Content-Type-Options: nosniff` · `X-XSS-Protection: 1; mode=block` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · `HSTS` (qua Nginx)

---

## Cấu Trúc Dự Án

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin-login/          POST — đăng nhập + rate limit
│   │   │   ├── admin-logout/         POST — xóa session cookie
│   │   │   ├── csrf/                 GET  — cấp CSRF token
│   │   │   ├── admin/                CRUD routes (CSRF-protected)
│   │   │   │   ├── admins/           Quản lý tài khoản admin (superadmin)
│   │   │   │   ├── audit-log/        Nhật ký hệ thống (superadmin)
│   │   │   │   ├── ai/               AI content generation (Gemini)
│   │   │   │   ├── shareholders/     CRUD cổ đông
│   │   │   │   ├── shareholder-ops/  Tasks, meetings, messages
│   │   │   │   ├── events/sse/       SSE push cho admin
│   │   │   │   ├── investment-plans/ Gói đầu tư
│   │   │   │   ├── articles/         Blog
│   │   │   │   ├── documents/        Tài liệu quản trị
│   │   │   │   ├── enquiries/        Hộp thư
│   │   │   │   ├── settings/         Cài đặt site (superadmin)
│   │   │   │   ├── content/          CMS pages
│   │   │   │   └── upload/           Cloudinary upload
│   │   │   ├── shareholders/
│   │   │   │   ├── auth/             Đăng nhập / session cổ đông
│   │   │   │   ├── messages/         Chat (GET + POST + SSE)
│   │   │   │   ├── tasks/            Nhiệm vụ
│   │   │   │   └── meetings/         Lịch họp
│   │   │   └── ...                   Public routes (contact, blog, plans…)
│   │   ├── admin/                    Trang admin (session-protected)
│   │   └── shareholders/             Shareholder portal
│   ├── components/
│   │   └── AiAssistPanel.tsx         AI content assistant (Gemini)
│   ├── lib/
│   │   ├── session.ts                HMAC-signed cookie session
│   │   ├── sh-session.ts             Shareholder session token
│   │   ├── csrf.ts                   CSRF double-submit token
│   │   ├── auth-utils.ts             getCurrentUser, requireAuth
│   │   ├── sse-broker.ts             In-memory SSE pub/sub
│   │   ├── channel-roles.ts          Phân quyền SSE channels
│   │   └── db.ts                     MongoDB connection
│   ├── models/                       Mongoose models
│   ├── services/                     Business logic layer
│   ├── types/                        TypeScript interfaces dùng chung
│   ├── utils/
│   │   ├── api-response.ts           Typed response helpers
│   │   ├── errors.ts                 Safe error normalisation
│   │   ├── sanitize.ts               HTML sanitizer + escapeRegex
│   │   ├── paginate.ts               Cursor-based pagination
│   │   └── rate-limit.ts             Progressive lockout
│   └── validators/                   Zod schemas (tiếng Việt messages)
├── middleware.ts                     Edge: auth guard + CSRF + security headers
├── scripts/
│   ├── deploy.sh                     Rolling update (npm ci → build → pm2 reload)
│   ├── deploy-langding.sh            Full deploy script
│   ├── backup.sh                     mongodump với rotation
│   ├── check-env.sh                  Kiểm tra env vars trước deploy
│   ├── seed-investment-plans.ts      Seed gói đầu tư mẫu
│   ├── verify.sh                     Quality gate cục bộ
│   └── setup.sh                      Thiết lập VPS Ubuntu
├── infra/
│   ├── ecosystem.config.js           PM2 fork configuration
│   └── nginx/nginx.conf.langding     Nginx reverse-proxy + SSL template
└── next.config.ts                    Standalone output; CSP; security headers
```

## Tech Stack

| Lớp | Công nghệ |
|-----|----------|
| Framework | Next.js 16 (App Router, standalone) |
| Ngôn ngữ | TypeScript 5 |
| Database | MongoDB 9 + Mongoose |
| Styling | Tailwind CSS 4 + Framer Motion + GSAP |
| Auth | HMAC-SHA256 signed httpOnly cookies |
| CSRF | Double-submit signed token |
| Realtime | Server-Sent Events (SSE) — in-memory pub/sub |
| AI | Google Gemini 2.0-flash (content generation) |
| Rate Limiting | In-process progressive lockout |
| Input Safety | Custom HTML sanitizer + Zod validation |
| Media | Cloudinary |
| Email | Nodemailer (SMTP) |
| Validation | Zod 4 (messages tiếng Việt) |
| Process Mgr | PM2 (fork mode, 1 instance) |
| Web Server | Nginx (TLS 1.3, HSTS) |

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.


