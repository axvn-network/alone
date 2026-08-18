# Architecture Blueprint — AXVN Tech Holding (Langding)

> **Source of truth kỹ thuật** — mọi thay đổi kiến trúc phải cập nhật file này trước khi implement.
> Đọc cùng với [`DOCUMENTATION.md`](DOCUMENTATION.md) và [`CONTEXT.md`](CONTEXT.md).

---

## 1. Triết lý Kiến trúc (Guiding Principles)

| Nguyên tắc | Mô tả |
|---|---|
| **Route-Centric (Feature-First)** | Colocation tuyệt đối — mọi tài nguyên (components, hooks, types) của một route phải nằm trong thư mục của route đó |
| **Service Layer Separation** | UI không bao giờ gọi model/DB trực tiếp; luôn qua `src/services/` |
| **Strict Typing** | Không `any`. Không `as unknown as`. Mỗi interface phải có định nghĩa rõ ràng |
| **Zero-Garbage Policy** | Không tồn tại `utils/`, `components/` dùng chung ở root nếu chỉ dùng cho 1 feature |
| **Edge-Safe Middleware** | `middleware.ts` chỉ được dùng Web Crypto API (`crypto.subtle`) — không import Node.js modules |
| **Single Process for SSE** | PM2 **fork mode** bắt buộc khi dùng SSE in-memory broker. Scale ngang → Redis adapter trước |

---

## 2. Request Flow

```
Browser
  │
  ▼
Nginx (TLS 1.3 · HSTS · gzip · static cache)
  │
  ▼
middleware.ts  ← Edge Runtime (Web Crypto only)
  ├─ Auth header check (admin_session HMAC, sh_session HMAC+exp)
  ├─ CSRF double-submit verify (mutation routes)
  └─ Route guards (redirect /admin → /admin-login nếu chưa auth)
  │
  ▼
Next.js App Router  ← Node.js Runtime
  ├─ Page/Layout (RSC)   → Server Component → render HTML
  └─ Route Handler (API) → Zod validator → Service → Mongoose/MongoDB
                                                    ↓
                                              Typed ApiResponse<T>
```

---

## 3. Cấu trúc Thư mục (Canonical — thực tế)

```
langding/
├── .ai/                      # Agent protocol (manifest, work-queue, locks, handoffs)
├── .github/workflows/        # CI/CD: ci.yml (lint+typecheck+build), cd.yml (SSH deploy)
├── docs/                     # Tài liệu kỹ thuật (file này)
├── infra/
│   ├── ecosystem.config.js   # PM2 config (fork mode, AXVN-langding)
│   ├── Makefile              # Developer ergonomics (mirror of root Makefile)
│   ├── nginx/                # Nginx configs cho từng vhost
│   │   ├── nginx.conf.langding    # langding.tc-gaming.live (production)
│   │   ├── nginx.conf.example     # Generic template (thay YOURDOMAIN)
│   │   └── nginx.conf.http-only   # HTTP-only để lấy cert lần đầu
│   └── lkvip_holding/        # VPS-level infrastructure
│       ├── nginx/            # Multi-vhost config + snippets (ssl-params, gzip, security-headers)
│       ├── scripts/          # Server provisioning, SSL renew, server health
│       └── stalwart/         # Mail server config (Stalwart MTA)
├── scripts/
│   ├── deploy.sh             # Zero-downtime deploy (git pull + build + PM2 reload)
│   ├── rollback.sh           # Interactive git rollback với SHA prompt
│   ├── setup.sh              # First-time VPS provisioning
│   ├── health-check.sh       # Smoke test + PM2 check (exit code chuẩn)
│   ├── backup.sh             # MongoDB backup + S3 offsite sync + rotation
│   ├── check-env.sh          # Validate .env.local variables
│   ├── verify.sh             # Full pipeline: audit + build + tsc + lint
│   ├── make-module.sh        # Scaffold Feature-Sliced module (6 files)
│   ├── compress-images.mjs   # Lossless image compression (sharp)
│   ├── reset-admin.ts        # Emergency admin password reset (bắt buộc pass)
│   ├── seed-investment-plans.ts  # Seed investment plans (first-time, --force flag)
│   └── archived/             # Scripts không còn dùng (giữ để tham khảo)
├── public/                   # Static assets (robots.txt, sitemap.xml, images)
├── Makefile                  # Developer ergonomics — 20+ targets
├── GEMINI.md                 # Agent contract + Architecture (AI agent entry point)
└── src/
    ├── app/                  # Next.js App Router
    │   ├── (admin)/admin/    # Admin CMS pages (server-protected, redirect nếu chưa auth)
    │   ├── (site)/           # Public site + portals
    │   │   ├── content/      # CMS pages (about, strategy, compliance, ...)
    │   │   └── portals/      # Shareholder portal, investment portal
    │   └── api/              # Route handlers (backend)
    │       ├── health/       # GET /api/health — DB ping
    │       ├── admin/        # Admin-only routes (auth + CSRF required)
    │       ├── shareholders/ # Shareholder routes (sh_session required)
    │       └── ...           # Public routes
    │
    ├── core/                 # Infrastructure — KHÔNG chứa business logic
    │   ├── database/db.ts    # MongoDB singleton connection + admin seed
    │   ├── env.ts            # Typed env validation
    │   ├── models/           # Mongoose schemas (canonical: Admin, Shareholder, ...)
    │   ├── rbac/             # RBAC guards: requireAdminGuard, checkAdminAPI, permissions
    │   ├── security/         # Session HMAC, CSRF — không tự implement lại
    │   └── vn-utils/         # Vietnam-specific utils (hanh-chinh, validators)
    │
    ├── modules/              # Business logic — Feature-Sliced
    │   ├── auth/             # auth-utils, sh-session, sh-auth
    │   ├── audit-log/        # AuditLog service + model + logAudit()
    │   ├── blog/             # Blog CRUD + service
    │   ├── capital-transactions/ # Giao dịch vốn
    │   ├── content/          # CMS pages service + model
    │   ├── documents/        # Documents service + model + schema + actions
    │   ├── enquiries/        # Enquiries service + model + actions
    │   ├── investment-plans/ # Investment plans service + model
    │   ├── investor/         # Investor portal types + service
    │   ├── media/            # Media upload
    │   ├── partner-applications/ # Partner applications service + model
    │   ├── public-users/     # Public user model
    │   ├── settings/         # Settings service + model + schema + actions
    │   └── shareholders/     # Shareholders service + models (task, meeting, message)
    │       └── *.model.ts    # message.model, meeting.model, task.model
    │
    └── shared/               # Cross-cutting concerns (dùng ≥ 2 modules)
        ├── components/       # Shared UI components (ui/, admin/)
        ├── hooks/            # Shared React hooks
        ├── services/         # Proxy services (bridge modules ↔ API layer)
        ├── types/            # Global TypeScript types/interfaces
        └── utils/            # logger, csrf, api-response, errors, pagination, rate-limit
```

---

## 4. Quy tắc Import (Guardrails)

| Rule | Ví dụ đúng | Ví dụ sai |
|---|---|---|
| UI không gọi model trực tiếp | `import { shareholderService } from "@/modules/shareholders"` | `import Shareholder from "@/core/models/Shareholder"` trong component |
| Infrastructure từ `@/core/` | `import { connectDB } from "@/core/database"` | `import { connectDB } from "../../lib/db"` |
| Auth guards từ `@/core/rbac` | `import { checkAdminAPI } from "@/core/rbac"` | Tự viết auth check |
| Logger từ `@/shared/utils/logger` | `logger.error("msg", err)` | `console.error(...)` trong production |
| middleware.ts chỉ dùng Web Crypto | `crypto.subtle.verify(...)` | `import { createHmac } from "crypto"` |
| Zod v4 literal boolean | `z.boolean().refine(v => v === true)` | `z.literal(true, { errorMap })` |

---

## 5. Auth Architecture

```
Admin Session:
  Login → POST /api/admin/login
        → set cookie: admin_session (HMAC-SHA256)
        → src/core/security/session.ts: setSessionCookie / getSessionEmail
        → Guards: requireAdminGuard() / checkAdminAPI() từ src/core/rbac

Shareholder Session:
  Login → POST /api/shareholders/auth (rate-limited: 5/min, progressive lockout)
        → set cookie: sh_session (HMAC-SHA256 + exp)
        → src/modules/auth/sh-session.ts: makeShareholderToken / parseShareholderToken
        → Guards: requireShareholderGuard() / checkShareholderAPI() từ src/core/rbac

Public User Session:
  → cookie: pub_session — src/core/rbac/rbac-lib/public-session

RBAC Guards (src/core/rbac):
  requireAdminGuard()       → Server Component / Action — redirect nếu chưa auth
  requireSuperAdminGuard()  → Server Component / Action
  checkAdminAPI()           → Route Handler — trả JSON 401/403
  checkSuperAdminAPI()      → Route Handler
  checkShareholderAPI()     → Route Handler
  checkPermissionAPI([...]) → Route Handler — fine-grained permissions

CSRF Protection (admin mutations):
  Client → GET /api/csrf → receives csrf_token cookie
         → set header x-csrf-token: <token> trên POST/PUT/PATCH/DELETE
         → validateCsrfToken() từ src/core/security / src/shared/utils/csrf
```

---

## 6. Realtime Architecture (SSE)

```
SSE Broker: rooms: Map<string, Set<writer>>
  ├── 1 global heartbeat timer (25s, .unref()) — KHÔNG per-connection
  └── subscribe(room, writer) / broadcast(room, event, data) / unsubscribe()

Admin SSE:   GET /api/admin/events/sse            → room: "admin"
Shareholder: GET /api/shareholders/messages/sse   → room: "sh-messages-<channel>"

Scale limit: In-memory, chỉ phù hợp 1 process (PM2 fork mode)
Scale ngang: npm install ioredis → sse-broker.redis.ts (pub/sub) → cluster mode
```

---

## 7. Database Layer

### Models (canonical)

| Model | Collection | Key fields |
|---|---|---|
| `Admin` | `admins` | email, password (bcrypt), mfaSecret (select:false), mfaEnabled |
| `Shareholder` | `shareholders` | status, kycStatus, nationalId (select:false, encrypt) |
| `Enquiry` | `enquiries` | consentGiven, consentTimestamp (NĐ 13/2023) |
| `AuditLog` | `auditlogs` | action, actor, delta, retainUntil (TTL index) |
| `InvestmentPlan` | `investmentplans` | tier, minCommitment, status |

**Quy tắc:**
- Mỗi model file phải có TypeScript interface `I<Model>Doc`
- Không dùng `new Schema<any>` — luôn typed: `new Schema<I<Model>Doc>`
- `nationalId` phải có `select: false` — không bao giờ trả về trong API response
- Legacy collection names (Fortress era) **không được đổi tên** — chỉ đổi UI/API paths

### AuditLog Retention

| Action prefix | Thao tác | Retention |
|---|---|---|
| `shareholder.*`, `capital.*`, `admin.login.*` | Tài chính, cổ đông | 7 năm |
| `blog.*`, `page.*`, `document.*` | CMS | 1 năm |

TTL tự động qua MongoDB TTL index trên field `retainUntil`.

---

## 8. Security Architecture

```
Layer 1 — Network:       Nginx (TLS 1.3, HSTS, rate limit zones)
Layer 2 — Edge:          middleware.ts (HMAC cookie verify, CSRF, route guards)
Layer 3 — Application:   Zod validation, checkAdminAPI(), rate-limit (shared/utils)
Layer 4 — Data:          nationalId select:false, bcrypt(12 rounds), audit trail
Layer 5 — Infrastructure: .env.local (không commit), SESSION_SECRET ≥ 64 hex
```

**Compliance:**
- **NĐ 13/2023 (BVDLCN):** consentGiven + consentTimestamp bắt buộc trên mọi PII form
- **NQ 05/2025 / NĐ 284/2025 (AML/KYC):** kycStatus, nationalId (encrypted), isPEP, isSanctioned

---

## 9. Deployment Architecture

```
GitHub (main branch)
  │
  ▼ (git pull --ff-only)
VPS lkvip_holding: /var/lkvip/langding
  │
  ├─ npm ci --omit=dev
  ├─ npm run build → .next/standalone/
  ├─ cp -r .next/static + public → .next/standalone/
  ├─ pm2 reload AXVN-langding  ← zero-downtime
  └─ nginx -s reload

Process:  PM2 fork mode, 1 instance, port 3000 (localhost only)
Proxy:    Nginx → 127.0.0.1:3000 (không expose port 3000 ra ngoài)
Cron:     0 2 * * *  backup.sh → /var/backups/AXVN/
          30 3 * * * renew-ssl.sh → certbot renew
```

---

## 10. Scale Path (khi cần)

```
Current (1 process):
  PM2 fork mode + in-memory SSE broker + in-memory rate limiter

Phase 1 (> 1000 concurrent users):
  + Redis (Upstash hoặc self-hosted)
  + Thay sse-broker.ts → sse-broker.redis.ts (ioredis pub/sub)
  + Thay rate-limit.ts → rate-limit.redis.ts (ZSET sliding window)

Phase 2 (horizontal scale):
  + PM2 cluster mode (instances: "max")
  + MongoDB read replica
  + CDN cho static assets

Phase 3 (high availability):
  + Load balancer (Nginx upstream)
  + Multiple VPS instances
  + MongoDB Atlas M10+ with auto-scaling
```

---

## 11. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
Trigger: push/PR → main, develop (Node 20.x + 22.x matrix)
Steps:
  1. npm audit --audit-level=high
  2. npm run lint        (ESLint --max-warnings=0)
  3. npm run typecheck   (tsc --noEmit)
  4. npm run build       (Next.js standalone)
```

---

## 12. Kiểm soát Kiến trúc

Mọi thay đổi kiến trúc phải:
1. Cập nhật file này trước khi merge
2. Pass CI pipeline đầy đủ
3. Cập nhật `DOCUMENTATION.md` Section 2–3 nếu liên quan
4. Ghi entry vào `CHANGELOG.md`

**Cấm tuyệt đối:**
- Import từ thư mục legacy trong code mới
- `any` type trong models hoặc service layer
- Node.js crypto modules trong `middleware.ts`
- Cluster mode PM2 khi chưa có Redis adapter
- Commit API keys, secrets, DSN vào repo

---

*AXVN Tech Holding — Platform Engineering · vnkr.vn*
