---
title: "Langding — Complete Documentation"
slug: "langding-documentation"
date: "2026-08-11"
group: "GOVERNANCE"
tags: [architecture, governance, AXVN, agents, security, corpus, retrieval]
lang: "vi"
summary: "Tài liệu kỹ thuật hoàn chỉnh cho dự án Langding — AXVN Tech Holding (vnkr.vn)."
---

# Langding — Tài Liệu Hoàn Chỉnh

> **AXVN Tech Holding** · `https://vnkr.vn` · Cập nhật: 2026-08-11

Đây là tài liệu duy nhất cho toàn bộ dự án. Mục lục bên dưới là điểm vào cho mọi
chủ đề — kỹ thuật, vận hành, bảo mật, corpus và agent contract.

---

## Mục Lục

1. [Project Context](#1-project-context)
2. [Technology Stack & Architecture](#2-technology-stack--architecture)
3. [Folder Structure](#3-folder-structure)
4. [Security](#4-security)
5. [Realtime (SSE)](#5-realtime-sse)
6. [AuditLog](#6-auditlog)
7. [Database Models](#7-database-models)
8. [Environment Variables](#8-environment-variables)
9. [Development & Deployment](#9-development--deployment)
10. [Admin Guide](#10-admin-guide)
11. [Knowledge Base & Corpus](#11-knowledge-base--corpus)
12. [Improvement Guide & Roadmap](#12-improvement-guide--roadmap)
13. [Incident Response](#13-incident-response)
14. [Troubleshooting](#14-troubleshooting)
15. [Visual Standards](#15-visual-standards)
16. [Changelog](#16-changelog)
17. [Agent Contract](#17-agent-contract)

---

## 1. Project Context

Langding là website công khai, CMS quản trị và cổng cổ đông cho **AXVN Tech Holding**.
Website công bố định hướng hệ sinh thái số và nội dung tham chiếu; không phải nền
tảng giao dịch hay lời chào bán tài chính.

| Mục | Nội dung |
|---|---|
| Tên công khai | **AXVN Tech Holding** / **AXVN Group** |
| Canonical URL | `https://vnkr.vn` |
| Đối tượng | Khách truy cập thông tin · Quản trị viên · Cổ đông |
| Mục tiêu | Thông tin nhất quán, rõ nguồn và an toàn |
| Logo | Placeholder cho đến khi có brand kit AXVN chính thức |

### Nguồn sự thật kỹ thuật

Sự thật kỹ thuật **chỉ** lấy từ mã nguồn, `package.json`, cấu hình và tài liệu
này. Không suy diễn kiến trúc Langding từ tài liệu AXVN/VNKR khác.

### Nguồn chiến lược

Định hướng AXVN lấy từ `_extracted/CHIEN_LUOC_2026_2031/` sau khi tìm bằng
`_standardized/index.json` hoặc `chunks.jsonl`, rồi xác minh theo `original_path`.
Trích dẫn định dạng: `[slug | original_path]`.

---

## 2. Technology Stack & Architecture

| Lớp | Công nghệ |
|---|---|
| Framework | Next.js 16 App Router — standalone build |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Backend | Node.js API routes (tích hợp trong Next.js) |
| Database | MongoDB 9 + Mongoose ODM |
| Reverse Proxy | Nginx (TLS 1.3, HSTS) |
| Process Manager | PM2 — **Fork Mode** (instances: 1) |
| Realtime | Server-Sent Events — `lib/sse-broker.ts` |
| Media | Cloudinary — namespace `AXVN/`, `AXVN/blog`, `AXVN/documents` |
| AI Assist | Anthropic Claude (`ANTHROPIC_API_KEY`) |
| Auth | HMAC-SHA256 signed cookie — Edge-compatible Web Crypto |
| Validation | Zod v4 |
| Email | Nodemailer (`noreply@vnkr.vn`) |

### Luồng request chuẩn

```
Browser
  → Nginx (TLS 1.3)
  → middleware.ts (auth header check, CSRF, cookie HMAC verify)
  → Next.js App Router (page / route handler)
  → Zod validator
  → Service layer
  → Mongoose / MongoDB
  → Typed ApiResponse<T>
```

### Ghi chú quan trọng

- **PM2 Fork Mode** bắt buộc vì SSE broker in-memory. Scale ngang → cần Redis adapter trước khi đổi sang cluster mode.
- **Edge Runtime** (`middleware.ts`): không dùng Node.js `crypto` module — chỉ dùng Web Crypto API (`crypto.subtle`).
- **Zod v4**: `z.literal(true, { errorMap })` không tương thích → dùng `z.boolean().refine(v => v === true, { message })`.

---

## 3. Folder Structure

```
langding/
├── docs/                  # Tài liệu kỹ thuật & vận hành
├── infra/                 # PM2, Nginx configs, lkvip_holding server configs
├── scripts/               # Vận hành: deploy, rollback, setup, backup, health, seed
├── public/                # Static assets
├── GEMINI.md              # Agent contract + Architecture (AI entry point)
└── src/
    ├── app/               # Next.js App Router (routes, pages, API handlers)
    │   ├── (admin)/admin/ # Admin CMS pages (server-protected)
    │   ├── (site)/        # Public site + portals
    │   │   ├── content/   # CMS pages (about, strategy, compliance, ...)
    │   │   └── portals/   # Shareholders portal, investment portal
    │   └── api/           # Route handlers
    │       ├── admin/     # Admin API (checkAdminAPI + CSRF)
    │       ├── shareholders/ # Shareholder API (checkShareholderAPI)
    │       └── ...        # Public routes
    │
    ├── core/              # Infrastructure — KHÔNG chứa business logic
    │   ├── database/      # MongoDB singleton + admin seed
    │   ├── models/        # Mongoose schemas canonical
    │   ├── rbac/          # requireAdminGuard, checkAdminAPI, permissions
    │   ├── security/      # Session HMAC, CSRF
    │   └── vn-utils/      # VN-specific utils (hanh-chinh, validators)
    │
    ├── modules/           # Business logic — Feature-Sliced
    │   ├── auth/          # auth-utils, sh-session
    │   ├── audit-log/     # AuditLog + logAudit()
    │   ├── blog/          # Blog CRUD
    │   ├── shareholders/  # Shareholder + task/meeting/message models
    │   ├── documents/     # Documents service + schema + actions
    │   ├── enquiries/     # Enquiries + consent fields
    │   ├── settings/      # Settings + actions
    │   └── ...            # capital-transactions, content, investment-plans, ...
    │
    └── shared/            # Cross-cutting (dùng ≥ 2 modules)
        ├── components/    # Shared UI components
        ├── hooks/         # Shared React hooks
        ├── services/      # Proxy services
        ├── types/         # Global TypeScript types
        └── utils/         # logger, api-response, errors, pagination, rate-limit
```

---

## 4. Security

### 4.1. Session Management

```
Payload: JSON { id, email, exp }
  → base64url-encode
  → HMAC-SHA256 (Web Crypto — Edge-compatible)
  → httpOnly cookie, secure, sameSite=strict, TTL 8h
```

| Cookie | Dùng cho | File |
|---|---|---|
| `admin_session` | Admin | `lib/session.ts` |
| `sh_session` | Cổ đông | `lib/sh-session.ts` |

### 4.2. MFA (TOTP 2FA)

| Route | Mô tả |
|---|---|
| `GET /api/admin/mfa/setup` | Tạo secret TOTP + QR code |
| `POST /api/admin/mfa/verify` | Kích hoạt `mfaEnabled = true` |
| `POST /api/admin/mfa/login-verify` | Dùng khi `mfaRequiredForLogin = true` |

**Login MFA flow:**
1. `POST /api/admin-login` → nếu `mfaEnabled` → trả `{ requiresMfa: true, email }`
2. Client hiển thị bước nhập OTP
3. `POST /api/admin/mfa/login-verify` → set session cookie nếu OTP đúng

> `mfaRequiredForLogin` phải được admin tự kích hoạt qua UI — không tự động sau setup.

### 4.3. CSRF Protection (Double-submit)

Tất cả mutation (POST/PUT/PATCH/DELETE) yêu cầu:
1. Cookie `csrf_token` (set bởi `GET /api/csrf`)
2. Header `x-csrf-token` khớp với cookie

### 4.4. Rate Limiting

| Endpoint | Giới hạn |
|---|---|
| `/api/admin-login` | 5 attempts / 60s |
| `/api/shareholders/auth` | 5 attempts / 60s (progressive lockout) |
| `/api/contact` | 5 requests / 5 phút |
| `/api/partner-submit` | 3 requests / 10 phút |
| `/api/opportunities` | 3 requests / 60s |

### 4.5. Tuân thủ NĐ 13/2023 (BVDLCN)

- Mọi form contact/enquiry yêu cầu `consentGiven: true` + `consentTimestamp`
- Validator `contactEnquirySchema` (Zod) reject nếu thiếu consent
- Lưu vào DB: `Enquiry.consentGiven`, `Enquiry.consentTimestamp`
- Email admin hiển thị consent audit trail

### 4.6. KYC/AML (NQ 05/2025 + NĐ 284/2025)

- Cổ đông nộp KYC: `POST /api/shareholders/kyc`
- `nationalId` có `select: false` — không bao giờ trả về trong response
- Admin approve/reject: `PATCH /api/admin/shareholders/[id]/kyc`
- Mỗi thao tác KYC ghi `AuditLog` với `actor.id`, `action`, `delta`

### 4.7. Security Headers

Nginx cấu hình: HSTS, X-Frame-Options, X-Content-Type-Options, CSP.

---

## 5. Realtime (SSE)

Hệ thống dùng **Server-Sent Events** — không polling.

| Endpoint | Room | Dùng cho |
|---|---|---|
| `GET /api/admin/events/sse` | `"admin"` | Thông báo admin realtime |
| `GET /api/shareholders/messages/sse?channel=<ch>` | `"sh-messages-<channel>"` | Tin nhắn cổ đông |

- **Broker:** `lib/sse-broker.ts` — in-process pub/sub, room-based
- **Heartbeat:** global timer 25s (**1 timer** cho toàn process — không per-connection)
- **Scale limit:** In-memory chỉ phù hợp 1 process (PM2 fork). Scale ngang → cần Redis pub/sub adapter.

---

## 6. AuditLog

Tất cả hành động admin/quan trọng đều ghi `AuditLog`:

| Action prefix | Thao tác | Retention |
|---|---|---|
| `shareholder.*` | CRUD cổ đông, KYC approve/reject | 7 năm |
| `capital.*` | Thay đổi vốn góp | 7 năm |
| `admin.login.*` | Đăng nhập admin | 7 năm |
| `blog.*`, `page.*`, `document.*` | CMS mutation | 1 năm |

TTL tự động qua MongoDB TTL index trên field `retainUntil`.

---

## 7. Database Models

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

> **Legacy:** Các collection có tên "Fortress" trong DB **không được đổi tên** trong đợt rebrand — chỉ đổi UI/API paths.

---

## 8. Environment Variables

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `SESSION_SECRET` | ✅ | ≥ 64 hex chars — ký session cookie admin |
| `ADMIN_EMAIL` | ✅ | Email superadmin seed |
| `ADMIN_PASSWORD` | ✅ | Password superadmin seed (không dùng default) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary secret |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | ✅ | Email notification |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://vnkr.vn` (production) |
| `WHATSAPP_VERIFY_TOKEN` | ✅ | WhatsApp webhook token |
| `ANTHROPIC_API_KEY` | ⚪ | AI assist — Anthropic Claude (optional) |
| `NEXT_PUBLIC_GA_ID` | ⚪ | Google Analytics (optional) |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⚪ | Meta Pixel (optional) |

**Quy tắc:**
- Không commit API key, password, DSN hay token
- `SESSION_SECRET` phải ≥ 64 random hex chars (`openssl rand -hex 64`)
- Analytics scripts chỉ inject khi ID thực (không phải placeholder)

---

## 9. Development & Deployment

### 9.1. Local development

```bash
cp .env.example .env.local   # điền secrets
npm run dev
```

### 9.2. Kiểm tra trước khi commit

```bash
npx tsc --noEmit --pretty false   # TypeScript — phải 0 errors
npm run build                     # Production build
npm audit --audit-level=high      # Security audit
```

### 9.3. Deploy lên VPS (Ubuntu)

```bash
bash scripts/deploy.sh
# git pull → npm ci → npm audit → npm run build → pm2 reload langding
```

### 9.4. Backup database

```bash
bash scripts/backup.sh
# mongodump hàng ngày → /var/backups/AXVN/AXVN_YYYYMMDD_HHMMSS.gz
# + offsite sync S3 (nếu S3_BUCKET đã cấu hình)
```

### 9.5. Seed gói đầu tư mẫu

```bash
npm run seed:plans
```

Chỉ dùng với database trống. Tài khoản admin được tạo từ `ADMIN_EMAIL` và `ADMIN_PASSWORD` khi ứng dụng kết nối database.

### 9.6. Verify sau deploy

```bash
# 1. Health check
curl https://vnkr.vn/api/health
# Expected: {"status":"ok","db":"connected","uptime":...}

# 2. Rate limit shareholder (expected: 401×5, 429×1)
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://vnkr.vn/api/shareholders/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# 3. PM2 fork mode
pm2 show langding | grep exec_mode
# Expected: fork_mode

# 4. npm audit
npm audit --audit-level=high
# Expected: 0 high/critical vulnerabilities
```

### 9.7. Rollback

```bash
cd /var/www/AXVN/app
git log --oneline -10        # tìm SHA ổn định
git checkout <sha>
npm ci --omit=dev
npm run build
pm2 restart langding
curl -sf https://vnkr.vn/api/health && echo "OK"
```

---

## 10. Admin Guide

### 10.1. Đăng nhập

- **URL:** `/admin-login`
- **Bảo mật:** HMAC-signed cookie auth. Không chia sẻ tài khoản. Luôn đăng xuất (`/admin-logout`) sau khi hoàn tất.

### 10.2. Dashboard (`/admin`)

Tổng quan: thống kê hệ thống, nhật ký hoạt động gần nhất, yêu cầu mới từ cổ đông.

### 10.3. Quản lý nội dung (`/admin/content`, `/admin/blog`)

Tích hợp **AI Content Assistant (Gemini)**:
1. Truy cập trang quản lý → tạo mới hoặc chỉnh sửa bài viết/tài liệu
2. Dùng **AI Assist** (nút trong toolbar) để:
   - Tạo dàn ý bài viết
   - Viết tiếp đoạn văn từ ý chính
   - Sửa lỗi ngữ pháp/cấu trúc câu
   - Tóm tắt hoặc mở rộng nội dung từ tài liệu nội bộ
3. **Luôn kiểm tra lại** thông tin do AI tạo trước khi Publish

### 10.4. Quản lý cổ đông (`/admin/shareholders`)

| Sub-module | URL | Chức năng |
|---|---|---|
| Cổ đông | `/admin/shareholders` | Xem danh sách, thông tin, trạng thái |
| Nhiệm vụ | `/admin/shareholder-ops/tasks` | Tạo, cập nhật trạng thái, phân quyền |
| Cuộc họp | `/admin/shareholder-ops/meetings` | Lên lịch, URL phòng, danh sách khách mời |
| Nhắn tin | `/admin/shareholder-ops/messages` | SSE realtime — kiểm tra thường xuyên |

### 10.5. Cài đặt hệ thống (`/admin/settings`)

*Chỉ Superadmin:*
- Cấu hình Footer, Newsletter, thông tin liên hệ
- Quản lý tài khoản Admin (`/admin/admins`)
- Xem nhật ký hoạt động (`/admin/audit-log`)

### 10.6. Mẹo vận hành

- Tận dụng AI để tối ưu hóa thời gian soạn thảo
- Kiểm tra `/admin/audit-log` khi có sự cố bất thường
- Bảo mật: luôn đăng xuất sau khi hoàn tất công việc

---

## 11. Knowledge Base & Corpus

### 11.1. Ba lớp dữ liệu

| Lớp | Đường dẫn | Vai trò | Quyền ghi |
|---|---|---|---|
| Nguồn thẩm quyền | `../doc/` | Markdown gốc ngoài repo | Không sửa qua agent |
| Bất biến | `_extracted/` | Bản sao byte-for-byte của nguồn | Chỉ đọc |
| Truy xuất | `_standardized/` | Metadata + chỉ mục + chunks | Chỉ sinh bằng script |

`_extracted/` được xác thực bằng SHA-256 so với nguồn. Không chỉnh sửa trực
tiếp; mọi thay đổi bắt đầu từ nguồn rồi chạy lại pipeline.

### 11.2. Quy mô corpus

- **47 tài liệu Markdown**: 36 trong `MD/` (nhóm `LEGAL`), 11 trong `CHIEN_LUOC_2026_2031/` (nhóm `STRATEGY`)
- **189 chunk truy xuất**, phủ đủ 47/47 tài liệu
- Độ dài chunk: min 30 từ, max 598 từ, trung bình 449 từ (~400–800 token)
- Phân loại: 26 `confidential`, 21 `internal`. Toàn bộ `lang: vi`

### 11.3. Frontmatter chuẩn

Mỗi file trong `_standardized/documents/` có frontmatter phẳng UTF-8:
`title`, `slug`, `date`, `group`, `original_path`, `source_sha256`, `lang`,
`document_type`, `classification`, `tags`, `summary`.

`scripts/validate_corpus.py` bắt buộc 11 trường, kiểm tra `slug` và
`original_path` không trùng, so `source_sha256` với `_extracted/`.

### 11.4. Schema chunk (`_standardized/chunks.jsonl`)

```json
{
  "id": "<slug>--0001",
  "text": "…nội dung giữ nguyên UTF-8…",
  "metadata": {
    "title": "…", "slug": "…", "date": "…",
    "group": "STRATEGY|LEGAL",
    "original_path": "_extracted/…md",
    "path": "_standardized/documents/…md"
  }
}
```

### 11.5. Pipeline

```bash
python3 scripts/import_corpus.py       # ../doc -> _extracted (kiểm SHA-256)
python3 scripts/standardize_corpus.py  # _extracted -> _standardized/
python3 scripts/make_chunks.py --check # kiểm hợp đồng chunk, không ghi
python3 scripts/validate_corpus.py     # kiểm toàn bộ 3 lớp
```

> `make_chunks.py` mặc định `--check`. Chỉ dùng `--write` khi chấp nhận sinh lại
> toàn bộ ranh giới chunk (sẽ invalidate mọi embedding cũ).

### 11.6. Embeddings

```bash
python3 scripts/create_embeddings.py \
  --embedding-provider openai --vector-store pinecone --dry-run
```

Mặc định `--dry-run` (không gọi mạng). Chạy thật cần `--no-dry-run` +
`--confirm-external-upload`. Đưa corpus ra ngoài phải có phê duyệt theo
`external_embedding_requires_approval` trong `.ai/manifest.yaml`.

### 11.7. Truy xuất và trích dẫn

```
[slug | original_path]
```

Tìm trong `_standardized/index.json` → xác minh trong `_extracted/` → trích dẫn.
Không suy diễn số liệu chiến lược, pháp lý hay tài chính nếu không tìm được câu nguồn.

### 11.8. Giới hạn công bố

- Đầu ra công khai chỉ là bản tóm tắt được duyệt
- Không công khai nguyên văn `_extracted/`, `chunks.jsonl`, `source_sha256`, đường dẫn nội bộ hay metadata vector
- 26 tài liệu `confidential` — mặc định coi là nội bộ

---

## 12. Improvement Guide & Roadmap

### 12.1. Fix đã thực thi (Revision 1 + 2)

| # | File | Vấn đề | Fix |
|---|---|---|---|
| 1 | `api/shareholders/auth/route.ts` | Không có rate limit | Rate limit 5/min + progressive lockout |
| 2 | `lib/sse-broker.ts` | N timers per connection | 1 global timer `.unref()` |
| 3–4 | `api/admin/events/sse`, `api/shareholders/messages/sse` | Per-connection `setInterval` | Dùng global timer |
| 5 | `ecosystem.config.js` | cluster mode, tên `fortress-website` | Fork mode, instances:1, rename `langding` |
| 6 | `scripts/deploy.sh` | `--no-audit`, PM2 tên sai | Bỏ `--no-audit`, thêm `npm audit`, fix PM2 name |
| 7 | `scripts/verify.sh` | Không có security audit | Thêm `npm audit` bước 1/5 |
| 8 | `services/shareholder.service.ts` | Default password `"fortress2026!"` | Throw error khi không có password |
| 9 | `services/settings.service.ts` | Defaults còn "Fortress" | Rebrand → AXVN |
| 10 | `lib/email.ts` | Fallback còn `fortressih.com` | Đổi → `noreply@vnkr.vn` |
| 11 | `.env.example` | `ADMIN_PASSWORD=123456`, hardcode secrets | Strong placeholders, rebrand AXVN |
| 12 | `api/admin/documents/route.ts` | POST không dùng Zod | Thêm `documentSchema.safeParse()` |
| 13 | `api/health/route.ts` | Không có health check | Tạo mới `/api/health` với DB ping |
| 14 | `middleware.ts` | `sh_session` chỉ check presence; `Buffer.from` trong Edge | `verifyShareholderCookie()` HMAC+exp; atob |
| 15 | `lib/env.ts` | Thiếu GA/Pixel IDs | Thêm optional fields |
| 16 | `app/layout.tsx` | GA/Pixel inject dù ID là placeholder | Conditional render |
| 17 | `api/admin-login/route.ts` | Fallback `===` timing attack | Rate limit + generic error |
| 18 | `validators/index.ts` | `contactEnquirySchema` thiếu consent | Thêm `consentGiven` + `consentTimestamp` |
| 19 | `models/Enquiry.ts` | Không lưu consent | Thêm consent fields |
| 20 | `models/Settings.ts` | Defaults còn "Fortress" | Rebrand → AXVN |
| 21 | `package.json` | `name: "fortress-website"` | → `"AXVN-langding"` |
| 22 | `api/admin/ai/route.ts` | System prompt còn "Fortress" | Rebrand → AXVN Tech Holding |
| 23 | `scripts/check-env.sh` | Check sai tên env var | Fix + thêm `SESSION_SECRET` |
| 24 | `scripts/backup.sh` | Paths "fortress", không có offsite | Rebrand + S3 offsite block + log |
| 25 | `.github/workflows/ci.yml` | Chưa có CI | GitHub Actions: audit+lint+typecheck+build |

### 12.2. Việc cần làm tiếp (chưa tự động hóa)

**Monitoring (Ngay, miễn phí):**
1. Đăng ký [uptimerobot.com](https://uptimerobot.com)
2. Thêm monitor HTTP(s) → `https://vnkr.vn/api/health`, interval 5 phút, alert Email+Telegram
3. Monitor thêm: `https://vnkr.vn` (homepage)

**MFA TOTP (Q4 2025):**
```bash
npm install otplib qrcode
```
Flow: Setup QR → Verify → `mfaEnabled: true` → Login flow với OTP bước 2.

**KYC Fields Shareholder (Q4 2025–Q1 2026):**
```typescript
// Thêm vào src/models/Shareholder.ts
kycStatus: { type: String, enum: ["not_started","pending","approved","rejected"], default: "not_started" },
nationalId: { type: String, select: false },  // mã hóa AES-256-GCM
isPEP: { type: Boolean, default: false },
isSanctioned: { type: Boolean, default: false },
```
> `nationalId` **phải mã hóa AES-256-GCM** tại rest — không lưu plaintext.

**Redis Scale (Q2 2026 — khi cần > 1 instance):**
```bash
npm install ioredis
```
Thứ tự: Redis pub/sub cho SSE → Redis ZSET rate limiter → đổi `ecosystem.config.js` sang cluster mode.

**Analytics IDs (khi có):**
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789
```
Scripts tự động inject sau restart.

### 12.3. Trạng thái rủi ro

| Domain | Baseline | Sau R1 | Sau R2 |
|---|---|---|---|
| 1. Quản trị | 5.5 | 5.0 | **4.5** |
| 2. Tài sản | 6.5 | 4.5 | **4.0** |
| 3. Bảo mật | 6.0 | 4.0 | **3.5** |
| 4. Lỗ hổng | 5.0 | 3.5 | **3.5** |
| 5. Ứng phó | 6.7 | 5.5 | **5.5** |
| 6. Chuỗi cung ứng | 4.5 | 4.5 | **4.5** |
| 7. Tuân thủ | 7.0 | 6.0 | **5.5** |

### 12.4. Roadmap

```
Q3 2025 (Hoàn thành — R1+R2):
  ✅ Rebrand Fortress → AXVN toàn bộ codebase
  ✅ Rate limit shareholder + admin auth
  ✅ SSE global heartbeat (1 timer)
  ✅ PM2 fork mode, instances: 1
  ✅ npm audit pipeline
  ✅ Health check /api/health
  ✅ HMAC verify sh_session middleware
  ✅ Consent fields (NĐ 13/2023)
  ✅ MFA TOTP admin
  ✅ Incident Response Playbook
  ✅ GitHub Actions CI/CD
  ✅ .env.example sạch, không hardcode secrets

Q4 2025:
  □ UptimeRobot / Betterstack monitoring
  □ KYC fields Shareholder model

Q1 2026 (Pre-NQ05 filing):
  □ AML/KYC third-party integration
  □ Penetration test
  □ Data encryption at rest (nationalId AES-256-GCM)
  □ Audit log retention 7 năm cho capital events
  □ Legal review toàn bộ website content

Q2 2026 (Scale):
  □ Redis pub/sub cho SSE broker
  □ Redis ZSET rate limiter
  □ PM2 cluster mode
  □ Read replica MongoDB
  □ CDN static assets
```

---

## 13. Incident Response

### 13.1. Severity Classification

| Level | Tên | Định nghĩa | Target Response | Target Resolution |
|---|---|---|---|---|
| P0 | Critical | Production down hoàn toàn; data breach; auth bypass | 15 min | 4 h |
| P1 | High | Major feature broken; perf degradation nghiêm trọng; suspected breach | 30 min | 8 h |
| P2 | Medium | Non-critical feature broken; lỗi gián đoạn; audit anomaly | 2 h | 24 h |
| P3 | Low | Cosmetic; minor UX; informational alert | Next business day | 72 h |

### 13.2. On-Call Contacts

| Role | Escalation |
|---|---|
| Primary On-Call (DevOps Lead) | Immediate |
| Security Lead (CTO) | P0/P1 only |
| Database Admin (Backend Lead) | P0/P1 only |
| Comms/PR (COO) | P0 customer impact |

> Contacts đầy đủ trong kênh `#incident-response` (Slack/Teams nội bộ).

### 13.3. Incident Lifecycle

```
Detected → Triaged → Contained → Eradicated → Recovered → Post-mortem
```

**Triage Checklist (15 phút đầu):**
```
[ ] Xác nhận incident thực (không phải false positive)
[ ] Gán severity P0–P3
[ ] Tạo ticket / Slack thread (tiêu đề: INC-YYYYMMDD-NNN)
[ ] Notify on-call theo bảng severity
[ ] Bắt đầu ghi incident timeline
[ ] Preserve evidence — KHÔNG restart services trước khi capture logs
```

**Timeline Template:**
```
INC-YYYYMMDD-NNN  [SEVERITY]  [SHORT TITLE]

Timeline (UTC+7):
  HH:MM — [Detected by / how]
  HH:MM — [First responder notified]
  HH:MM — [Severity assigned]
  HH:MM — [Containment action]
  HH:MM — [Root cause identified]
  HH:MM — [Fix deployed]
  HH:MM — [Service restored / verified]

Affected systems: …
Impact: Users affected / Data exposure / Revenue
Root cause: …
Fix: …
Prevention: …
```

### 13.4. Runbooks

**P0 — Application Down:**
```bash
pm2 status
pm2 logs langding --err --lines 100
systemctl status nginx && nginx -t
curl -s https://vnkr.vn/api/health | jq .
# Rollback nếu crash loop:
git checkout <prev-sha> && pm2 restart langding
```

**Database Connectivity:**
```bash
grep "MongoDB" /var/log/AXVN-app.log | tail -20
mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')"
# Nếu credentials lộ: rotate MONGODB_URI trong .env.local → pm2 restart
```

**Authentication Bypass / Session Compromise:**
```bash
openssl rand -hex 64   # tạo SESSION_SECRET mới
# Cập nhật .env.local → pm2 restart langding (invalidate toàn bộ sessions)
grep "verifyShareholderCookie" src/middleware.ts
```

**Data Breach:**
```bash
# 1. Notify Security Lead + COO ngay
# 2. Preserve logs:
cp -r /var/log/nginx /tmp/incident-$(date +%Y%m%d)/nginx
pm2 logs langding --lines 5000 > /tmp/incident-$(date +%Y%m%d)/pm2.log
bash scripts/backup.sh
# 3. PDPA Vietnam / GDPR: 72-hour notification window
```

**SSE / High Error Rate:**
```bash
top -bn1 | head -20 && df -h && free -m
pm2 restart langding   # nếu memory leak
grep "SSE" /var/log/AXVN-app.log | tail -20
```

**WhatsApp Webhook:**
```bash
grep "whatsapp" /var/log/AXVN-app.log | tail -50
curl -X GET "https://vnkr.vn/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=$TOKEN&hub.challenge=test"
```

### 13.5. Communication Templates

**Internal (Slack/Teams):**
```
🚨 INCIDENT [P0/P1/P2]: <title>
Time: HH:MM UTC+7 | Impact: <description>
Responder: <name> | Status: Investigating / Contained / Resolved
Next update: HH:MM
```

**Customer-facing (P0 với user impact):**
```
We are aware of an issue affecting [feature]. Our team is actively working on a resolution.
We apologise for any inconvenience. — AXVN Tech Holding Team
```

### 13.6. Post-Mortem

Bắt buộc cho P0 và P1. Due: **5 business days**.
File: `docs/postmortems/INC-YYYYMMDD-NNN.md`

Sections: Summary → Timeline → Root Cause (5 Whys) → Impact → What went well → What went wrong → Action items (owner + due date)

> Blameless culture: tập trung vào systems và processes, không vào cá nhân.

### 13.7. Recovery Verification Checklist

```
[ ] /api/health → 200, db: "ok"
[ ] Admin login hoạt động
[ ] Shareholder login hoạt động (HMAC cookie valid)
[ ] MongoDB connection ổn định (không có retry logs)
[ ] SSE streams active
[ ] WhatsApp webhook responding
[ ] Backup mới nhất tồn tại và < 24h
[ ] Không có error spike mới trong PM2 logs
```

### 13.8. Monitoring Endpoints

| Endpoint | Mục đích |
|---|---|
| `GET /api/health` | App + DB liveness |
| `GET /api/admin/events/sse` | Admin realtime stream |
| `pm2 monit` | Process CPU/RAM |
| `/var/log/AXVN-backup.log` | Backup status |

---

## 14. Troubleshooting

### MongoDB

- **Lỗi kết nối:** Kiểm tra `MONGODB_URI` trong `.env.local`. Đảm bảo `mongod` đang chạy.
- **Dữ liệu gói đầu tư trống:** `npm run seed:plans`
- **Thay đổi schema hoặc dữ liệu:** Repository không có script migration độc lập; chuẩn bị, review và sao lưu trước khi chạy một migration riêng.

### SSE

- **Không nhận tin nhắn:** Kiểm tra `lib/sse-broker.ts`. Nginx cần:
  ```nginx
  proxy_buffering off;
  proxy_cache off;
  proxy_set_header Connection '';
  proxy_http_version 1.1;
  chunked_transfer_encoding on;
  ```

### Deploy / Build

- **Build fail:** `npx tsc --noEmit` để phát hiện lỗi TypeScript trước
- **PM2 reload không thành công:** `pm2 logs langding --lines 200` — kiểm tra env vars đầy đủ chưa

### AI / Anthropic Claude

- **Không phản hồi:** Kiểm tra `ANTHROPIC_API_KEY` trong `.env.local` và billing tại `console.anthropic.com`

### Các lỗi khác

- **Permissions:** `chmod +x scripts/*.sh`
- **ESLint crash:** Rà soát `eslint.config.mjs` và dependencies

---

## 15. Visual Standards

### 15.1. Color Palette (Design Tokens)

| Token | Hex | Usage |
|---|---|---|
| `AXVN-navy` | `#07111D` | Primary backgrounds, dark text |
| `AXVN-deep` | `#0B1B2E` | Secondary backgrounds |
| `AXVN-charcoal` | `#111827` | Tertiary backgrounds/overlays |
| `AXVN-gold` | `#C9A24A` | Primary accent, CTA, labels |
| `AXVN-champagne` | `#E6C879` | Secondary accent |
| `AXVN-ivory` | `#F4F1EA` | Primary body text |
| `AXVN-silver` | `#AEB6C1` | Secondary/muted text |

> Dùng `AXVN-` tokens độc quyền — tránh arbitrary hex values để đảm bảo WCAG AA contrast.

### 15.2. Layout & Spacing

- **Horizontal Padding:** `var(--section-px)`
- **Vertical Padding:** `var(--section-py)`
- **Container Width:** `max-w-[1400px]` (standardized)

### 15.3. Accessibility

Tất cả text phải đạt WCAG AA contrast ratio so với background.

---

## 16. Changelog

### [Unreleased] — 2026-08-11 (pass 2)

**API Routes — Hardening:**
- 8 files: Thay `console.error/log` bằng `logger.error()` từ `@/lib/logger`
- `api/chat/route.ts`: `fs.readFileSync` → `fs.promises.readFile`; xóa implicit `any`; keyword threshold `> 3` → `> 2`
- `export const dynamic = "force-dynamic"` cho 6 public DB routes
- `middleware.ts`: xóa wrapper `hmac()` thừa; inline comment Web Crypto

**Validators / VN Library:**
- `lib/vn/zod-vn.ts`: Đổi tên schema → chuẩn quốc tế (`zNationalId`, `zPhone`, `zTaxIdBusiness`, `zAmountVND`, `zAddress`, `zKyc`) + aliases backward-compat

**Validation:** `tsc --noEmit` ✅ · `npm run build` 77/77 ✅ · `console.*` trong api/ ✅ 0

---

### [Prior] — 2026-08-11 (pass 1)

**Database / Schema:**
- `models/InvestmentPlan.ts`: `Schema<any>` → `Schema<IInvestmentPlan>`; thêm 4 interface fields
- `models/Shareholder.ts`: `ShareholderStatus` re-export từ `models/index.ts`
- `types/index.ts`: `ShareholderStatus` → re-export từ `@/models`
- `validators/index.ts`: `z.literal(true, ...)` → `z.boolean().refine(...)` (Zod v4 compat)
- `middleware.ts`: Xóa `createHmac` Node.js; đổi sang async Web Crypto

**Validation:** `tsc --noEmit` ✅ · `npm run build` 77/77 ✅

---

### [Prior] — 2026-08-10

**Bug Fixes:**
- `validators/index.ts`: `z.literal(true, { errorMap })` → Zod v4 fix
- `app/shareholders/dashboard/page.tsx`: Fix missing `ShieldCheck` import
- `api/admin/mfa/verify/route.ts`: Fix `getCurrentUser()` → `user.email`
- `api/partner-submit` + `api/opportunities`: Thêm `consentGiven` + `consentTimestamp`

**Features:**
- MFA (TOTP 2FA): 3 fields Admin model + login MFA flow hoàn thiện
- Audit Trail: `approveKyc()`, `rejectKyc()` gọi `logAudit` thực sự
- Email: `sendEnquiryNotification()` nâng cấp — consent audit row, branding AXVN

**Rebranding Fortress → AXVN Tech Holding:**
- Cloudinary folders: `fortress/*` → `AXVN/*`
- Route path: `/invest-with-fortress` → `/invest-with-AXVN`
- Components, API, services, constants: toàn bộ đã rebrand
- `models/Admin.ts`: 3 MFA fields; `constants/brand.ts`: xóa dead code

**Validation:** `tsc --noEmit` ✅ · `npm run build` 77/77 ✅ · Fortress refs trong `src/**` ✅ 0

---

### [Prior] — trước 2026-08-10

Xem `git log` cho lịch sử commit trước ngày này.

---

## 17. Agent Contract

<!-- BEGIN:nextjs-agent-rules -->

### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/`
(resolved from this file's directory) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at
`node_modules/next/dist/server/lib/generate-agent-files.js`.

<!-- END:nextjs-agent-rules -->

### Quy tắc làm việc

**Trước khi thay đổi bất kỳ code nào:**
1. Đọc tài liệu Next.js 16 liên quan tại `node_modules/next/dist/docs/`
2. Đọc file này (`DOCUMENTATION.md`) — đặc biệt Sections 1–5
3. Kiểm tra `.ai/manifest.yaml`, `.ai/work-queue.yaml`, `.ai/locks.yaml` trước khi nhận task

**Đối với claims chiến lược/pháp lý/tài chính:**
- Tìm bằng `_standardized/index.json` hoặc `chunks.jsonl`
- Xác minh trong `_extracted/` theo `original_path`
- Trích dẫn: `[slug | original_path]`
- **Không** tự suy diễn, bịa số liệu, hoặc truyền corpus nội bộ ra ngoài

**Multi-agent workflow:**
- Làm việc trên 1 scope nhỏ, đã unlock tại một thời điểm
- Ghi file scope vào `.ai/locks.yaml` trước khi chỉnh sửa
- Để lại UTF-8 handoff trong `.ai/handoffs/` khi release
- Không ghi đè thay đổi in-progress của agent khác

**Tuyệt đối không:**
- Sửa `_extracted/`, alter valid Vietnamese UTF-8
- Invent source-backed facts
- Transmit confidential corpus ra external services khi chưa được phê duyệt
- Đổi middleware thành proxy hoặc đổi infrastructure (chỉ thay URL/copy)

**Coding conventions:**
- Giữ UTF-8 xuyên suốt
- Patch nhỏ, focused — không format toàn repo
- Không sửa generated/lock/vendor files ngoài yêu cầu
- Sau mỗi thay đổi: `npx tsc --noEmit` phải pass trước khi tiếp tục

---

*AXVN Tech Holding — Platform Engineering · vnkr.vn · Tài liệu duy nhất — xem git log cho lịch sử*
