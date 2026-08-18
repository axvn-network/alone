---
title: "Langding Project Context"
slug: "langding-project-context"
date: "2026-08-09"
group: "GOVERNANCE"
tags: [architecture, governance, AXVN, agents]
lang: "vi"
summary: "Ban do du an, thuong hieu, quy uoc nguon su that va no ky thuat cua Langding."
---

# Langding — Project Context

## 1. Project overview
Langding la website cong khai, CMS quan tri va cong co dong cho **AXVN Tech Holding**. Website cong bo dinh huong he sinh thai so va noi dung tham chieu — khong phai nen tang giao dich hay loi chao ban tai chinh.

## 2. Audience
- Khach truy cap: xem thong tin AXVN.
- Quan tri vien: quan ly noi dung qua admin CMS.
- Co dong: dung shareholder portal (phan quyen).

## 3. Public brand
Ten cong khai: **AXVN Tech Holding** / **AXVN Group**. Canonical URL: `https://vnkr.vn`. Logo hien la placeholder cho den khi co brand kit AXVN chinh thuc.

## 4. Strategy source of truth
Dinh huong AXVN lay tu noi dung corpus `_extracted/CHIEN_LUOC_2026_2031/` (nam ngoai repo) — tim bang `_standardized/index.json` hoac `chunks.jsonl`, xac minh theo `original_path`. Trich dan: `[slug | original_path]`. Khong suy dien chien luoc tu tai lieu ngoai corpus.

## 5. Technical source of truth
Su that ky thuat chi lay tu ma nguon, `package.json`, cau hinh va [`ARCH_BLUEPRINT.md`](ARCH_BLUEPRINT.md). Khong suy dien kien truc tu tai lieu chien luoc AXVN/VNKR.

## 6. Technology stack
Next.js 16 App Router · React 19 · TypeScript 5.9 · Tailwind CSS 4 · Framer Motion · Mongoose/MongoDB · Zod · Nodemailer · Cloudinary · Anthropic Claude · PM2/Nginx.

## 7. Configuration
- `.env.local` chua secrets — khong commit.
- `NEXT_PUBLIC_SITE_URL` phai la `https://vnkr.vn` khi production.
- `SESSION_SECRET` >= 64 hex chars (`openssl rand -hex 64`).

## 8. Logging & audit
- Loi server qua `logger` (`@/shared/utils/logger`) — khong dung `console.*` trong API routes.
- Audit log ghi moi hanh dong admin quan trong.
- Khong log secrets, access token, du lieu KYC hay toan van corpus noi bo.

## 9. Coding conventions
- UTF-8 toan bo; patch nho; khong format toan repo.
- Khong sua generated/lock/vendor files tru khi co yeu cau ro rang.
- Khong `any` trong models hoac service layer.
- Khong commit API keys, secrets, DSN hay token.
- Doc tai lieu Next.js lien quan truoc khi sua code framework.

## 10. Tech debt (hien tai)
| Van de | Ghi chu |
|---|---|
| ESLint FlatCompat circular JSON | Crashes khi chay `eslint.config.mjs` — xem RUNBOOK §5.10 |
| Legacy Fortress names | Route/model/CSS names chua "fortress" — chi doi UI, khong doi collection DB |
| CMS content | Co the con branding cu — can audit thu cong |
| Source strategy | Mot so claims chua xac minh hoac mau thuan — luon doi chieu `original_path` |
| SSE in-memory | Chi phu hop 1 process — can Redis truoc khi scale ngang |

## 11. Roadmap
```
Da xong (Q3 2025):
  [x] Rebrand Fortress -> AXVN toan bo codebase
  [x] Rate limit shareholder auth (5/min + progressive lockout)
  [x] SSE global heartbeat (1 timer, khong per-connection)
  [x] PM2 fork mode (instances: 1)
  [x] npm audit pipeline
  [x] Health check endpoint /api/health
  [x] HMAC verify sh_session proxy (Edge-safe)
  [x] Consent fields ND 13/2023
  [x] MFA TOTP admin (otplib)
  [x] KYC fields Shareholder model
  [x] GitHub Actions CI (audit + lint + typecheck + build)
  [x] logger.* thay console.* trong API routes
  [x] force-dynamic tren public DB routes

Q1 2026 (Pre-NQ05 filing):
  [ ] AML/KYC third-party integration
  [ ] Penetration test
  [ ] nationalId encryption at rest (AES-256-GCM)
  [ ] Audit log retention 7 nam (capital events)
  [ ] UptimeRobot / Betterstack monitoring
  [ ] Legal review toan bo website content

Q2 2026 (Scale):
  [ ] Redis pub/sub cho SSE broker
  [ ] Redis rate limiter (ZSET sliding window)
  [ ] PM2 cluster mode (sau khi co Redis)
  [ ] Read replica MongoDB
  [ ] CDN static assets
```
