# CHANGELOG — AXVN Tech Holding Landing Page

Tất cả thay đổi đáng chú ý được ghi tại đây theo chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — 2026-08-18 — Architecture Migration & Standardization

### Architecture Migration (Flat -> Feature-Sliced)

#### Source Tree Restructure
- **`src/lib/`** — Dissolved. Contents migrated to:
  - `src/core/database/` — DB singleton (`db.ts`)
  - `src/core/security/` — Session HMAC, CSRF (`session.ts`, `csrf.ts`)
  - `src/core/vn-utils/` — Vietnam-specific validators and Zod schemas
  - `src/shared/utils/` — `logger.ts`, `api-response.ts`, `errors.ts`, `pagination.ts`, `rate-limit.ts`, `cloudinary.ts`
  - `src/shared/services/` — Cross-cutting service adapters (email, etc.)
- **`src/models/`** — Moved to `src/core/models/`
- **`src/services/`** — Moved to `src/modules/<name>/service.ts` (co-located with each module)
- **`src/validators/`** — Moved to `src/shared/validators/`
- **`src/types/`** — Moved to `src/shared/types/`
- **`src/utils/`** — Moved to `src/shared/utils/`
- **`src/hooks/`** — Moved to `src/shared/hooks/`
- **`src/constants/`** — Moved to `src/shared/constants/`
- **`src/components/`** — Moved to `src/shared/components/`
- **`middleware.ts`** — Renamed to `src/proxy.ts` (export function: `proxy`)

#### Auth Migration
- **NextAuth removed** — All auth replaced with HMAC-SHA256 signed cookies
  - Admin session: `src/core/security/session.ts` (`admin_session` cookie)
  - Shareholder session: `src/modules/auth/sh-session.ts` (`sh_session` cookie)
  - No `NEXTAUTH_*` environment variables required

#### Import Path Updates
- All imports from `@/lib/*` -> `@/core/*` or `@/shared/utils/*`
- All imports from `@/models/*` -> `@/core/models/*`
- All imports from `@/services/*` -> `@/modules/<name>/service` or `@/shared/services/*`
- All imports from `@/validators` -> `@/shared/validators`
- All imports from `@/types` -> `@/shared/types`
- All imports from `@/utils/*` -> `@/shared/utils/*`

#### Documentation & Scripts Standardization
- All docs updated: stale `lib/`, `models/`, `services/`, `middleware.ts`, NextAuth references replaced with correct paths
- `scripts/make-module.sh`: scaffold templates updated to use `@/core/database`, `@/core/rbac`, `@/shared/utils/errors`
- `scripts/reset-admin.ts`: import path `src/models/Admin` -> `src/core/models/Admin`
- `scripts/verify.sh`: step order aligned with CI spec: audit -> lint -> typecheck -> build
- `scripts/check-env.sh`: added `WHATSAPP_VERIFY_TOKEN` check

### Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS |
| `npm run lint` | PASS |
| No `src/lib/` references in source | 0 matches |
| No `middleware.ts` references in docs | 0 matches |

---

## [Unreleased] — 2026-08-11 (pass 2)

### API Routes — Hardening & Correctness

#### Logger
- **8 files** — Thay thế toàn bộ `console.error` / `console.log` trong API routes bằng `logger.error()` từ `@/shared/utils/logger`:
  - `api/contact/route.ts`
  - `api/partner-submit/route.ts`
  - `api/opportunities/route.ts`
  - `api/enquiries/route.ts`
  - `api/admin/ai/route.ts`
  - `api/whatsapp/webhook/route.ts` (2 cho)
  - `api/chat/route.ts`

#### Chat API (`api/chat/route.ts`) — Refactor
- Doi `fs.readFileSync` -> `fs.promises.readFile` (async — khong block event loop).
- Them kieu `IndexDocument` / `IndexData` — xoa `any` implicit.
- Keyword threshold `> 3` -> `> 2` (giam bo sot keyword ngan nhu "von", "KYC").
- Dung `??` thay `?` + ternary cho `source`.

#### Dynamic caching — public routes doc DB
Them `export const dynamic = "force-dynamic"` vao 6 route files de ngan Next.js cache sai du lieu tu DB:
  - `api/blog/route.ts`
  - `api/documents/route.ts`
  - `api/investment-plans/route.ts`
  - `api/content/route.ts`
  - `api/settings/route.ts`
  - `api/enquiries/route.ts`

#### Proxy (`src/proxy.ts`) — Cleanup
- Xoa wrapper function `hmac()` thua (chi goi qua `hmacSha256()`) — giu lai `hmacSha256()` la ham duy nhat.
- Them inline comment `// Web Crypto — Edge compatible` tai CSRF signature regeneration.

### Validators / VN Library (external — da hop nhat)
- **`src/core/vn-utils/zod-vn.ts`** — Doi ten schema sang chuan quoc te: `zNationalId`, `zPhone`, `zTaxIdBusiness`, `zAmountVND`, `zAddress`, `zKyc`; giu aliases Vietnamese cu de backward-compat.
- **`src/core/vn-utils/index.ts`** — Re-export tat ca schema Zod moi + aliases tu barrel.
- **`src/shared/validators/index.ts`** — Cap nhat re-export tu `zod-vn` voi ten moi + aliases.

### Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS — 77/77 pages |
| `console.*` trong `src/app/api/` | 0 matches |
| `force-dynamic` tren public DB routes | 6/6 routes |

---

## [Prior] — 2026-08-11 (pass 1)

### Database / Schema Standardization

#### Models
- **`src/core/models/InvestmentPlan.ts`** — Fix `new Schema<any>` -> `new Schema<IInvestmentPlan>` (loai bo eslint-disable comment khong can thiet).
- **`src/core/models/InvestmentPlan.ts`** — Bo sung 4 fields con thieu vao `IInvestmentPlan` interface: `rights: string[]`, `obligations: string[]`, `documents: string[]`, `shareholderType: string` (da co trong schema nhung thieu trong interface).
- **`src/core/models/Shareholder.ts`** — `ShareholderStatus` van la canonical source; re-export tu `src/core/models/index.ts` de consumer dung `@/core/models` khong can import truc tiep tu model.

#### Types
- **`src/shared/types/index.ts`** — `ShareholderStatus` tu dinh nghia cuc bo -> re-export tu `@/core/models` (single source of truth, tranh drift).

#### Validators
- **`src/shared/validators/index.ts`** — Fix `z.literal(true, ...)` khong tuong thich Zod v4 (2 cho: `contactEnquirySchema` va `partnerApplicationSchema`) -> `z.boolean().refine(v => v === true, message)`.

#### Proxy (Edge Runtime)
- **`src/proxy.ts`** — Xoa `import { createHmac } from "crypto"` (Node.js module khong chay duoc trong Edge Runtime).
  - Ham `hmac()` doi sang async, uy thac cho `hmacSha256()` (Web Crypto API).
  - `verifyCsrfToken()` doi sang `async function`.
  - Tat ca signature verification dung `crypto.subtle` — tuong thich Vercel Edge / Cloudflare Workers.
  - **`src/shared/utils/csrf.ts`** giu nguyen Node.js `createHmac` vi chay trong API route (Node runtime), khong bi anh huong.

### Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS — 77/77 pages |
| `createHmac` trong `middleware.ts` | 0 matches |
| `Schema<any>` trong models | 0 matches |
| `z.literal(true, ...)` trong validators | 0 matches |
| `ShareholderStatus` dinh nghia trung | 0 duplicates |

---

## [Prior] — 2026-08-10

### Bug Fixes

#### TypeScript / Runtime
- **`src/shared/validators/index.ts`** — Fix `z.literal(true, { errorMap })` khong tuong thich Zod v4 -> doi sang `z.boolean().refine(v => v === true, { message })`.
- **`app/shareholders/dashboard/page.tsx`** — Fix loi `Cannot find name 'ShieldCheck'` do thieu import tu `lucide-react`.
- **`app/api/admin/mfa/verify/route.ts`** — Fix bug: `getCurrentUser()` tra ve `SessionUser | null` nhung code dung nhu `string` -> `Admin.findOne({ email: user })` tro sai. Sua thanh `user.email`.

#### Consent / GDPR (ND 13/2023)
- **`app/api/partner-submit/route.ts`** — Them `consentGiven` + `consentTimestamp` vao normalized object truoc khi validate schema.
- **`app/api/opportunities/route.ts`** — Them `consentGiven` + `consentTimestamp` vao payload truoc khi validate.

---

### Features

#### MFA (TOTP 2FA) — Hoan thien
- **`src/core/models/Admin.ts`** — Them 3 fields MFA vao schema: `mfaSecret (String, select:false)`, `mfaEnabled (Boolean)`, `mfaRequiredForLogin (Boolean)`.
- **`app/api/admin-login/route.ts`** — Tich hop MFA flow: sau khi xac thuc mat khau dung, neu `mfaEnabled = true` tra ve `{ requiresMfa: true, email }` thay vi set session cookie ngay.
- Routes `mfa/setup`, `mfa/verify`, `mfa/login-verify` da hoat dong dung voi model moi.

#### Audit Trail — Hoan thien
- **`src/modules/shareholders/service.ts`** — Hoan thien `approveKyc()`: xoa `void adminId; // future audit` -> goi thuc su `logAudit({ action: "shareholder.kyc.approve", delta })`.
- **`src/modules/shareholders/service.ts`** — Hoan thien `rejectKyc(id, adminId?)`: them optional `adminId` parameter + goi `logAudit` khi co.
- **`app/api/admin/shareholders/[id]/kyc/route.ts`** — Truyen `user.id` vao `rejectKyc(id, user.id)`.

#### Email Notification
- **`src/shared/services/email.ts`** — Nang cap `sendEnquiryNotification()`:
  - Them `consentGiven` + `consentTimestamp` vao signature (optional)
  - Hien thi consent audit row trong HTML email neu co
  - Doi branding: subject `[AXVN] New ...`, footer AXVN Tech Holding · vnkr.vn
  - Tham so `phone`, `company`, `subject` doi sang optional

---

### Rebranding (Fortress -> AXVN Tech Holding)

#### Cloudinary Folders
- **`src/shared/utils/cloudinary.ts`** — Default folder `"fortress"` -> `"AXVN"` trong `uploadToCloudinary()` va `replaceInCloudinary()`.
- **`app/api/admin/upload/route.ts`** — `"fortress/blog"` -> `"AXVN/blog"`.
- **`app/api/admin/documents/upload/route.ts`** — `"fortress/documents"` -> `"AXVN/documents"`.
- **`app/api/media/route.ts`** — Default folder fallback `"fortress"` -> `"AXVN"`.

#### Route Paths
- **`src/app/invest-with-fortress/`** -> doi ten thu muc thanh **`src/app/invest-with-AXVN/`**.
- Tat ca internal links trong `invest-with-AXVN/` da cap nhat.
- Function name `InvestWithFortressPage` -> `InvestWithAXVNPage`.

#### Components & Pages
- **`src/shared/components/layout/Footer.tsx`** — Href `/invest-with-fortress` -> `/invest-with-AXVN`.
- **`src/shared/components/layout/Hero.tsx`** — Href doi.
- **`src/shared/components/layout/Navbar.tsx`** — Href doi.
- Cac component lien quan (PartnershipCTA, InvestorForm, PartnerJourney, ProjectEcosystem) — Href, node ID, label da rebrand.
- **`app/page.tsx`** — Metadata description/og rebrand -> AXVN Tech Holding + NQ 05/2025.
- Cac trang content va admin blog — Metadata + text rebrand, Google preview `fortressih.com` -> `vnkr.vn`.

#### API & Services
- **`app/api/admin/ai/route.ts`** — System prompt: "Fortress Investment Holdings" -> "AXVN Tech Holding".
- **`app/api/whatsapp/webhook/route.ts`** — Verify token fallback, footer texts, URLs, email -> AXVN/vnkr.vn.
- **`src/shared/constants/brand.ts`** — Xoa `logoStatus: "placeholder"` (dead code).

#### Types
- **`src/shared/types/index.ts`** — Them `totalShareholders: number` + `totalPlans: number` vao `DashboardStats` interface.

---

### Removed

- **`src/app/invest-with-fortress/`** — Xoa thu muc route cu sau khi migrate sang `src/app/invest-with-AXVN/`.
- **`.next/types/`** — Xoa cache types cu de loai bo stale references sau rename.

---

### Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS — 77/77 pages |
| Fortress references trong `src/**/*.ts(x)` | 0 matches |
| Legacy `/invest-with-fortress` paths trong source | 0 matches |

---

## [Prior] — before 2026-08-10

Xem lich su commit `git log` cho cac thay doi truoc ngay nay.
