/**
 * src/core/index.ts
 *
 * Core system infrastructure — não bộ hệ thống.
 * Không chứa UI, không phụ thuộc vào React hay Next.js runtime.
 *
 * Sub-modules:
 *   database/ — MongoDB connection, pool management, health check
 *   models/   — All Mongoose data models (direct + re-export shims)
 *   rbac/     — Role-based access control, guards, permission tables
 *   security/ — CSRF, session signing, AES-256-GCM, proxy middleware
 *   vn-utils/ — Vietnamese locale helpers (currency, CCCD, MST, phone)
 *   env.ts    — Validated environment variables (t3-oss/env-nextjs)
 *
 * Dependency rules:
 *   core/ sub-modules MAY import from each other.
 *   core/ MUST NOT import from src/modules/, src/app/, or src/shared/components/.
 *   All other layers (modules/, app/, shared/) MAY import from core/.
 */

// ── Infrastructure ───────────────────────────────────────────────────────────
export { connectDB, isDBConnected } from "./database";
export { env } from "./env";

// ── Data models ──────────────────────────────────────────────────────────────
export * from "./models";

// ── RBAC (roles, permissions, guards) ────────────────────────────────────────
export * from "./rbac";

// ── Security primitives ───────────────────────────────────────────────────────
export * from "./security";

// ── Vietnamese locale utilities ───────────────────────────────────────────────
export * from "./vn-utils";
