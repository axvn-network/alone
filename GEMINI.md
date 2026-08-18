# Project Architecture & Conventions

This project follows a modular, feature-centric architecture based on Domain-Driven Design (DDD) to ensure scalability, maintainability, and clean separation of concerns.

## Directory Structure

```
src/
├── app/          # Routing: (admin), (site), api (external integrations only: webhooks, sse)
├── core/         # Infrastructure: database, rbac, security, vn-utils, env.ts
├── modules/      # Business Domain: { model, service, actions, schema, types, components }.ts
├── shared/       # Stateless resources: components, constants, contexts, hooks, types, utils, i18n
├── local-data/   # Static JSON (moved outside src)
└── scripts/      # CLI/Ops (moved outside src)
```

## Rules:
- **Single Source of Truth:** All business logic, models, services, and actions for a domain MUST reside within its `src/modules/<domain>/` folder.
- **Zero Internal APIs:** Use Server Actions (`src/modules/*/actions.ts`) for internal CRUD operations. Keep `app/api/` strictly for external integrations (webhooks, SSE, public endpoints).
- **Separation of Concerns:** 
  - `app/` is only for routing.
  - `core/` is for system-wide infrastructure (database, auth, security).
  - `shared/` is for stateless utilities and UI components.
- **Import Conventions:** Always use alias imports (`@/core/…`, `@/modules/…`, `@/shared/…`) — never relative paths.
- **Core/Modules Constraints:**
  - `core/` must not import from `modules/` or `app/`.
  - `modules/` may import from `core/` and `shared/` but not from other `modules/` directly.

## Module Structure

Each `src/modules/<domain>/` MUST contain:

```
index.ts        — barrel export (public API)
model.ts        — Mongoose/Prisma model definition
service.ts      — Business logic implementation
schema.ts       — Zod input validation schema
actions.ts      — Next.js Server Actions (CRUD, internal logic)
types.ts        — domain-specific TypeScript types
components/     — domain-specific React components
```

## Automation & Infrastructure
- The root `Makefile` (`/var/lkvip/langding/Makefile`) is the **canonical and only entry point** for all developer and infrastructure commands.
- Automation scripts reside in `/var/lkvip/langding/scripts/`.
