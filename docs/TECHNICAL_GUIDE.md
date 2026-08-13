# Hướng dẫn Kỹ thuật (Technical Guide)

Tài liệu này tổng quan về kiến trúc, bảo mật và quy trình kỹ thuật cho dự án **AXVN Tech Holding Landing Page** (`vnkr.vn`).

---

## 1. Kiến trúc Hệ thống

Dự án sử dụng kiến trúc **Next.js 16 (App Router)** với mô hình `standalone` để tối ưu hóa việc triển khai (deploy) trên môi trường sản xuất.

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion.
- **Backend:** Node.js (tích hợp trong Next.js API routes).
- **Database:** MongoDB 9 + Mongoose (ODM).
- **Reverse Proxy:** Nginx (TLS 1.3, HSTS).
- **Process Manager:** PM2 (Fork Mode — tương thích SSE in-memory).
- **Realtime:** Server-Sent Events (SSE) qua `lib/sse-broker.ts`.
- **Media:** Cloudinary (folder namespace: `AXVN/`, `AXVN/blog`, `AXVN/documents`).

### Luồng request chuẩn

```
Browser → Nginx (TLS) → Next.js App Router
  → middleware.ts (auth header check)
  → Route Handler → Zod validator → Service → Mongoose/MongoDB
  → Typed API Response (ApiResponse<T>)
```

---

## 2. Bảo mật (Security)

### 2.1. Session Management
Sử dụng `HMAC-SHA256 signed cookie` cho phiên làm việc:
- Payload: `JSON { id, email, exp }` → base64url-encode → HMAC-SHA256
- Cookie: `httpOnly`, `secure`, `sameSite=strict` (production), TTL 8h
- Admin: `lib/session.ts` + cookie `admin_session`
- Cổ đông: `lib/sh-session.ts` + cookie `sh_session`

### 2.2. MFA (TOTP — 2FA)
- **Setup:** `GET /api/admin/mfa/setup` → tạo secret TOTP + QR code
- **Xác nhận:** `POST /api/admin/mfa/verify` → kích hoạt `mfaEnabled = true`
- **Login MFA:** `POST /api/admin/mfa/login-verify` → dùng khi `mfaRequiredForLogin = true`
- **Flow login:**
  1. POST `/api/admin-login` → nếu `mfaEnabled` trả về `{ requiresMfa: true, email }`
  2. Client hiển thị bước nhập OTP
  3. POST `/api/admin/mfa/login-verify` → set session cookie nếu OTP đúng

### 2.3. CSRF Protection (Double-submit pattern)
Tất cả mutation (POST/PUT/PATCH/DELETE) yêu cầu:
1. Cookie `csrf_token` (set bởi `GET /api/csrf`)
2. Header `x-csrf-token` khớp với cookie

### 2.4. Rate Limiting
Progressive lockout (tăng window khi vượt giới hạn nhiều lần):
- `/api/admin-login`: 5 attempts / 60s
- `/api/contact`: 5 requests / 5 phút
- `/api/partner-submit`: 3 requests / 10 phút
- `/api/opportunities`: 3 requests / 60s

### 2.5. Tuân thủ NĐ 13/2023 (BVDLCN)
- Mọi form contact/enquiry yêu cầu `consentGiven: true` + `consentTimestamp`
- Validator: `contactEnquirySchema` (Zod) — reject nếu thiếu consent
- Lưu vào DB: `Enquiry.consentGiven`, `Enquiry.consentTimestamp`
- Email notification admin hiển thị thông tin consent audit trail

### 2.6. KYC/AML (NQ 05/2025 + NĐ 284/2025)
- Cổ đông nộp KYC qua `POST /api/shareholders/kyc`
- `nationalId` có `select: false` — không bao giờ trả về trong response
- Admin approve/reject qua `PATCH /api/admin/shareholders/[id]/kyc`
- Mỗi thao tác KYC đều ghi `AuditLog` với `actor.id`, `action`, `delta`

---

## 3. Realtime với SSE

Hệ thống sử dụng **Server-Sent Events (SSE)** — không polling.
- **Broker:** `lib/sse-broker.ts` — in-process pub/sub, room-based
- **Admin SSE:** `GET /api/admin/events/sse` — room `"admin"`
- **Shareholder SSE:** `GET /api/shareholders/messages/sse?channel=<ch>` — room `"sh-messages-<channel>"`
- **Heartbeat:** global timer 25s (1 timer cho toàn process, không per-connection)
- **Lưu ý scale:** SSE in-memory chỉ phù hợp 1 process (PM2 fork mode). Scale ngang → cần Redis adapter.

---

## 4. AuditLog

Tất cả hành động admin/quan trọng đều được ghi `AuditLog`:

| Action prefix | Thao tác | Retention |
|---|---|---|
| `shareholder.*` | CRUD cổ đông, KYC approve/reject | 7 năm |
| `capital.*` | Thay đổi vốn góp | 7 năm |
| `admin.login.*` | Đăng nhập admin | 7 năm |
| `blog.*`, `page.*`, `document.*` | CMS mutation | 1 năm |

TTL tự động qua MongoDB TTL index trên field `retainUntil`.

---

## 5. Cấu trúc Thư mục

```
src/
├── app/             # Routes + pages (App Router)
│   ├── (admin)/     # Admin module
│   │   └── admin/   # Admin CMS pages
│   ├── (site)/      # Site routes
│   │   ├── auth/    # Auth routes (e.g., admin-login)
│   │   ├── content/ # CMS pages (about, privacy, etc.)
│   │   └── portals/ # User portals (shareholders, investment)
│   └── api/         # Route handlers (backend)
├── components/      # Shared UI components
├── constants/       # brand.ts, project.ts
├── data/            # Static data (compliance tasks, etc.)
├── hooks/           # React hooks
├── lib/             # Infrastructure (db, session, email, SSE, auth)
├── models/          # Mongoose schemas
├── services/        # Business logic layer
├── types/           # TypeScript types/interfaces
├── utils/           # Helpers (sanitize, rate-limit, errors, cloudinary)
└── validators/      # Zod schemas
```

---

## 6. Quy trình Phát triển & Triển khai

### 6.1. Môi trường phát triển
```bash
cp .env.local.example .env.local  # điền secrets
npm run dev
```

### 6.2. Kiểm tra trước khi commit
```bash
npx tsc --noEmit --pretty false   # TypeScript check
npm run build                     # Production build
```

### 6.3. Triển khai (Production — Ubuntu VPS)
```bash
bash scripts/deploy.sh
# Quy trình: git pull → npm ci → npm run build → pm2 reload langding
```

### 6.4. Backup
```bash
bash scripts/backup.sh  # mongodump hàng ngày — lên lịch cron
```

---

## 7. Environment Variables (bắt buộc)

| Biến | Mô tả |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | ≥ 32 chars — ký session cookie admin |
| `ADMIN_EMAIL` | Email superadmin seed |
| `ADMIN_PASSWORD` | Password superadmin seed |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | Cloudinary key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Email notification |
| `GEMINI_API_KEY` | AI assist (optional) |
| `WHATSAPP_VERIFY_TOKEN` | WhatsApp webhook token |
| `NEXT_PUBLIC_APP_URL` | `https://vnkr.vn` (production) |

---

## 8. Models & Database Collections

| Model | Collection | Mô tả |
|---|---|---|
| `Admin` | `admins` | Tài khoản quản trị + MFA fields |
| `Shareholder` | `shareholders` | Cổ đông + KYC/AML fields |
| `Blog` | `blogs` | Bài viết CMS |
| `Page` | `pages` | CMS pages (hero, sections, SEO) |
| `Enquiry` | `enquiries` | Liên hệ/đề xuất + consent fields |
| `InvestmentPlan` | `investmentplans` | Gói hợp tác đầu tư |
| `DocumentModel` | `documents` | Tài liệu công bố thông tin |
| `Settings` | `settings` | Cấu hình website (singleton) |
| `Upload` | `uploads` | Lịch sử upload Cloudinary |
| `ShareholderTask` | `shareholdertasks` | Nhiệm vụ cổ đông |
| `ShareholderMeeting` | `shareholdermeetings` | Lịch họp ĐHCĐ |
| `ShareholderMessage` | `shareholdermessages` | Nhắn tin cổ đông portal |
| `AuditLog` | `auditlogs` | Immutable audit trail |

---

## 9. Lưu ý quan trọng

- **Legacy paths:** `/invest-with-fortress` → đã migrate sang `/invest-with-AXVN`. Không sử dụng lại path cũ.
- **Cloudinary folders:** Toàn bộ đã đổi từ `fortress/*` → `AXVN/*`.
- **Zod v4:** `z.literal(true, { errorMap })` không còn hoạt động — dùng `z.boolean().refine(v => v === true, { message })`.
- **SSE scale:** Hiện in-memory, phù hợp PM2 fork mode 1 process. Cần Redis adapter nếu scale ngang.
- **MFA:** `mfaRequiredForLogin` phải được admin tự kích hoạt qua UI — không tự động sau khi setup.
