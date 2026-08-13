# CHANGELOG — AXVN Tech Holding Landing Page

Tất cả thay đổi đáng chú ý được ghi tại đây theo chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — 2026-08-11 (pass 2)

### 🔧 API Routes — Hardening & Correctness

#### Logger
- **8 files** — Thay thế toàn bộ `console.error` / `console.log` trong API routes bằng `logger.error()` từ `@/lib/logger`:
  - `api/contact/route.ts`
  - `api/partner-submit/route.ts`
  - `api/opportunities/route.ts`
  - `api/enquiries/route.ts`
  - `api/admin/ai/route.ts`
  - `api/whatsapp/webhook/route.ts` (2 chỗ)
  - `api/chat/route.ts`

#### Chat API (`api/chat/route.ts`) — Refactor
- Đổi `fs.readFileSync` → `fs.promises.readFile` (async — không block event loop).
- Thêm kiểu `IndexDocument` / `IndexData` — xóa `any` implicit.
- Keyword threshold `> 3` → `> 2` (giảm bỏ sót keyword ngắn như "vốn", "KYC").
- Dùng `??` thay `?` + ternary cho `source`.

#### Dynamic caching — public routes đọc DB
Thêm `export const dynamic = "force-dynamic"` vào 6 route files để ngăn Next.js cache sai dữ liệu từ DB:
  - `api/blog/route.ts`
  - `api/documents/route.ts`
  - `api/investment-plans/route.ts`
  - `api/content/route.ts`
  - `api/settings/route.ts`
  - `api/enquiries/route.ts`

#### Middleware (`middleware.ts`) — Cleanup
- Xóa wrapper function `hmac()` thừa (chỉ gọi qua `hmacSha256()`) — giữ lại `hmacSha256()` là hàm duy nhất.
- Thêm inline comment `// Web Crypto — Edge compatible` tại CSRF signature regeneration.

### Validators / VN Library (external — đã hợp nhất)
- **`lib/vn/zod-vn.ts`** — Đổi tên schema sang chuẩn quốc tế: `zNationalId`, `zPhone`, `zTaxIdBusiness`, `zAmountVND`, `zAddress`, `zKyc`; giữ aliases Vietnamese cũ để backward-compat.
- **`lib/vn/index.ts`** — Re-export tất cả schema Zod mới + aliases từ barrel.
- **`validators/index.ts`** — Cập nhật re-export từ `zod-vn` với tên mới + aliases.

### 📋 Validation

| Kiểm tra | Kết quả |
|---|---|
| `npx tsc --noEmit` | ✅ PASS — 0 errors |
| `npm run build` | ✅ PASS — 77/77 pages |
| `console.*` trong `src/app/api/` | ✅ 0 matches |
| `force-dynamic` trên public DB routes | ✅ 6/6 routes |

---

## [Prior] — 2026-08-11 (pass 1)

### 🔧 Database / Schema Standardization

#### Models
- **`models/InvestmentPlan.ts`** — Fix `new Schema<any>` → `new Schema<IInvestmentPlan>` (loại bỏ eslint-disable comment không cần thiết).
- **`models/InvestmentPlan.ts`** — Bổ sung 4 fields còn thiếu vào `IInvestmentPlan` interface: `rights: string[]`, `obligations: string[]`, `documents: string[]`, `shareholderType: string` (đã có trong schema nhưng thiếu trong interface).
- **`models/Shareholder.ts`** — `ShareholderStatus` vẫn là canonical source; re-export từ `models/index.ts` để consumer dùng `@/types` không cần import trực tiếp từ model.

#### Types
- **`types/index.ts`** — `ShareholderStatus` từ định nghĩa cục bộ → re-export từ `@/models` (single source of truth, tránh drift).

#### Validators
- **`validators/index.ts`** — Fix `z.literal(true, ...)` không tương thích Zod v4 (2 chỗ: `contactEnquirySchema` và `partnerApplicationSchema`) → `z.boolean().refine(v => v === true, message)`.

#### Middleware (Edge Runtime)
- **`middleware.ts`** — Xóa `import { createHmac } from "crypto"` (Node.js module không chạy được trong Edge Runtime).
  - Hàm `hmac()` đổi sang async, ủy thác cho `hmacSha256()` (Web Crypto API).
  - `verifyCsrfToken()` đổi sang `async function`.
  - Tất cả signature verification dùng `crypto.subtle` — tương thích Vercel Edge / Cloudflare Workers.
  - **`lib/csrf.ts`** giữ nguyên Node.js `createHmac` vì chạy trong API route (Node runtime), không bị ảnh hưởng.

### 📋 Validation

| Kiểm tra | Kết quả |
|---|---|
| `npx tsc --noEmit` | ✅ PASS — 0 errors |
| `npm run build` | ✅ PASS — 77/77 pages |
| `createHmac` trong `middleware.ts` | ✅ 0 matches |
| `Schema<any>` trong models | ✅ 0 matches |
| `z.literal(true, ...)` trong validators | ✅ 0 matches |
| `ShareholderStatus` định nghĩa trùng | ✅ 0 duplicates |

---

## [Prior] — 2026-08-10

### 🐛 Bug Fixes

#### TypeScript / Runtime
- **`validators/index.ts`** — Fix `z.literal(true, { errorMap })` không tương thích Zod v4 → đổi sang `z.boolean().refine(v => v === true, { message })`.
- **`app/shareholders/dashboard/page.tsx`** — Fix lỗi `Cannot find name 'ShieldCheck'` do thiếu import từ `lucide-react`.
- **`app/api/admin/mfa/verify/route.ts`** — Fix bug: `getCurrentUser()` trả về `SessionUser | null` nhưng code dùng như `string` → `Admin.findOne({ email: user })` trỏ sai. Sửa thành `user.email`.

#### Consent / GDPR (NĐ 13/2023)
- **`app/api/partner-submit/route.ts`** — Thêm `consentGiven` + `consentTimestamp` vào normalized object trước khi validate schema.
- **`app/api/opportunities/route.ts`** — Thêm `consentGiven` + `consentTimestamp` vào payload trước khi validate.

---

### ✨ Features

#### MFA (TOTP 2FA) — Hoàn thiện
- **`models/Admin.ts`** — Thêm 3 fields MFA vào schema: `mfaSecret (String, select:false)`, `mfaEnabled (Boolean)`, `mfaRequiredForLogin (Boolean)`.
- **`app/api/admin-login/route.ts`** — Tích hợp MFA flow: sau khi xác thực mật khẩu đúng, nếu `mfaEnabled = true` trả về `{ requiresMfa: true, email }` thay vì set session cookie ngay.
- Routes `mfa/setup`, `mfa/verify`, `mfa/login-verify` đã hoạt động đúng với model mới.

#### Audit Trail — Hoàn thiện
- **`services/shareholder.service.ts`** — Hoàn thiện `approveKyc()`: xóa `void adminId; // future audit` → gọi thực sự `logAudit({ action: "shareholder.kyc.approve", delta })`.
- **`services/shareholder.service.ts`** — Hoàn thiện `rejectKyc(id, adminId?)`: thêm optional `adminId` parameter + gọi `logAudit` khi có.
- **`app/api/admin/shareholders/[id]/kyc/route.ts`** — Truyền `user.id` vào `rejectKyc(id, user.id)`.

#### Email Notification
- **`lib/email.ts`** — Nâng cấp `sendEnquiryNotification()`:
  - Thêm `consentGiven` + `consentTimestamp` vào signature (optional)
  - Hiển thị consent audit row trong HTML email nếu có
  - Đổi branding: subject `[AXVN] New ...`, footer AXVN Tech Holding · vnkr.vn
  - Tham số `phone`, `company`, `subject` đổi sang optional

---

### 🔄 Rebranding (Fortress → AXVN Tech Holding)

#### Cloudinary Folders
- **`models/Upload.ts`** — Default folder `"fortress"` → `"AXVN"`.
- **`utils/cloudinary.ts`** — Default folder trong `uploadToCloudinary()` và `replaceInCloudinary()`: `"fortress"` → `"AXVN"`.
- **`app/api/admin/upload/route.ts`** — `"fortress/blog"` → `"AXVN/blog"`.
- **`app/api/admin/documents/upload/route.ts`** — `"fortress/documents"` → `"AXVN/documents"`.
- **`app/api/media/route.ts`** — Default folder fallback `"fortress"` → `"AXVN"`.

#### Route Paths
- **`src/app/invest-with-fortress/`** → đổi tên thư mục thành **`src/app/invest-with-AXVN/`**.
- Tất cả internal links trong `invest-with-AXVN/` đã cập nhật.
- Function name `InvestWithFortressPage` → `InvestWithAXVNPage`.

#### Components & Pages
- **`components/Footer.tsx`** — Href `/invest-with-fortress` → `/invest-with-AXVN`.
- **`components/Hero.tsx`** — Href đổi.
- **`components/Navbar.tsx`** — Href đổi.
- **`components/PartnershipCTA.tsx`** — Href đổi.
- **`components/InvestorForm.tsx`** — Href + text đổi.
- **`components/PartnerJourney.tsx`** — `nextHref` đổi.
- **`components/ProjectEcosystem.tsx`** — Node ID `"fortress"` → `"AXVN"`, label `"FORTRESS"` → `"AXVN TECH HOLDING"`, CONNECTIONS từ `"fortress"` → `"AXVN"`, POSITIONS key đổi.
- **`app/page.tsx`** — Metadata description/og rebrand → AXVN Tech Holding + NQ 05/2025.
- **`app/about/page.tsx`** — Metadata + toàn bộ text body rebrand.
- **`app/documents/page.tsx`** — Metadata rebrand.
- **`app/investment-focus/page.tsx`**, **`app/our-approach/page.tsx`**, **`app/insights/InsightsClient.tsx`** — Href + text rebrand.
- **`app/admin/blog/[slug]/page.tsx`** — Google preview: `fortressih.com` → `vnkr.vn`.

#### API & Services
- **`app/api/admin/ai/route.ts`** — System prompt + `page_title`/`page_content` prompts: "Fortress Investment Holdings" → "AXVN Tech Holding".
- **`app/api/whatsapp/webhook/route.ts`** — Verify token fallback `"fortress_webhook_2025"` → `"AXVN_webhook_2025"`, footer texts, URLs, button labels, email `info@fortressih.com` → `info@vnkr.vn`, route `/invest-with-fortress` → `/invest-with-AXVN`.
- **`constants/project.ts`** — Comment paths rebrand.
- **`constants/brand.ts`** — Xóa `logoStatus: "placeholder"` (dead code).

#### Types
- **`types/index.ts`** — Thêm `totalShareholders: number` + `totalPlans: number` vào `DashboardStats` interface để đồng bộ với `dashboardService.getDashboardStats()`.

---

### 🗑️ Removed

- **`src/app/invest-with-fortress/`** — Xóa thư mục route cũ sau khi migrate sang `invest-with-AXVN/`.
- **`.next/types/`** — Xóa cache types cũ để loại bỏ stale references sau rename.

---

### 📋 Validation

| Kiểm tra | Kết quả |
|---|---|
| `npx tsc --noEmit` | ✅ PASS — 0 errors |
| `npm run build` | ✅ PASS — 77/77 pages |
| Fortress references trong `src/**/*.ts(x)` | ✅ 0 matches |
| Legacy `/invest-with-fortress` paths trong source | ✅ 0 matches |

---

## [Prior] — before 2026-08-10

Xem lịch sử commit `git log` cho các thay đổi trước ngày này.
