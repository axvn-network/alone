# Project Architecture & Conventions

This project follows a modular, feature-centric architecture to ensure scalability and maintainability.

## Directory Structure

```
src/
├── app/          # Next.js routing only — page.tsx, layout.tsx, route.ts, error.tsx
│   ├── (admin)/  # Admin portal pages (session-protected)
│   ├── (site)/   # Public site pages
│   └── api/      # Route handlers: admin/*, shareholders/*, public/*
├── core/         # Infrastructure brain — no React, no UI
│   ├── database/ # MongoDB connection + connectDB()
│   ├── models/   # Mongoose models (canonical source for non-module models)
│   ├── rbac/     # Role-based access control: guards, permissions, types
│   ├── security/ # Session, CSRF, auth-utils
│   └── vn-utils/ # Vietnamese business logic: currency, CCCD, hanh-chinh, Zod schemas
├── modules/      # Business domain logic — one folder per domain
│   ├── audit-log/
│   ├── auth/
│   ├── blog/
│   ├── capital-transactions/
│   ├── content/
│   ├── dashboard/
│   ├── documents/
│   ├── enquiries/
│   ├── investment-plans/
│   ├── investor/
│   ├── media/
│   ├── partner-applications/
│   ├── public-users/
│   ├── settings/
│   └── shareholders/
├── shared/       # Cross-cutting — used by both app/ and modules/
│   ├── components/
│   │   ├── admin/      # AdminNavbar, AdminSidebar
│   │   ├── animations/ # Framer Motion primitives
│   │   ├── layout/     # GlobalNavbar, GlobalFooter, PageContainer…
│   │   └── ui/         # Accordion, Primitives, RichTextEditor, AiAssistPanel…
│   ├── constants/      # Brand, colors, strategy, API endpoint constants
│   ├── contexts/       # AdminSessionContext, CsrfContext, LangContext
│   ├── hooks/          # useDebounce, usePermission, useSmoothScroll…
│   ├── services/       # Canonical service implementations (shared across modules)
│   ├── types/          # Global TypeScript interfaces
│   ├── utils/          # api-response, errors, logger, pagination, search…
│   └── validators/     # Zod schemas (Vietnamese error messages)
├── data/         # Static JSON (roadmap, governance, compliance…)
└── locales/      # i18n translation files (vi, en)
```

## Import Conventions

| Import | Resolves to |
|--------|------------|
| `@/core/database` | `src/core/database/index.ts` |
| `@/core/models/Xxx` | `src/core/models/Xxx.ts` |
| `@/core/rbac/rbac-lib` | `src/core/rbac/rbac-lib/index.ts` |
| `@/core/security/session` | `src/core/security/session.ts` |
| `@/modules/blog` | `src/modules/blog/index.ts` |
| `@/shared/services/audit.service` | `src/shared/services/audit.service.ts` |
| `@/shared/components/ui/Accordion` | `src/shared/components/ui/Accordion.tsx` |
| `@/shared/utils/api-response` | `src/shared/utils/api-response.ts` |
| `@/validators` | `src/shared/validators/index.ts` |
| `@/types` | `src/shared/types/index.ts` |
| `@/constants` | `src/shared/constants/index.ts` |
| `@/hooks` | `src/shared/hooks/index.ts` |
| `@/contexts` | `src/shared/contexts/index.ts` |

**Rules:**
- Always use alias imports (`@/core/…`, `@/modules/…`, `@/shared/…`) — never relative paths for cross-folder references.
- `core/` may not import from `modules/`, `app/`, or `shared/components/`.
- `modules/` may import from `core/` and `shared/` but not from other `modules/` directly.
- `shared/services/` imports only from `@/core/models/` and `@/core/database`.

## Naming Conventions

- **Folders:** `kebab-case`
- **Components:** `PascalCase.tsx`
- **Services / utils:** `camelCase.ts` or `kebab-case.service.ts`
- **Mongoose models:** `PascalCase.ts`

## Module Structure

Each `src/modules/<domain>/` should contain:

```
index.ts        — barrel export (public API)
model.ts        — Mongoose model re-export shim → @/core/models/Xxx
service.ts      — re-export shim → @/shared/services/xxx.service
schema.ts       — Zod input validation schema
actions.ts      — Next.js Server Actions (optional)
types.ts        — domain-specific TypeScript types (optional)
components/     — domain-specific React components (optional)
```

## Standards

1. New business features **must** be implemented within `src/modules/`.
2. Shared UI components **must** live in `src/shared/components/`.
3. All canonical Mongoose models live in `src/core/models/` (for cross-domain models) or `src/modules/<domain>/model.ts` (for single-domain models).
4. All canonical service logic lives in `src/shared/services/*.service.ts`.
5. Do not introduce new top-level `src/` directories without architectural review.
6. `app/` contains **only** routing files: `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `loading.tsx`, `not-found.tsx`.
