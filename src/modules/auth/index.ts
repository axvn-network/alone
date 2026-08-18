/**
 * src/modules/auth/index.ts
 * Barrel export — import from "@/modules/auth"
 *
 * Exports:
 *   - Admin model + types
 *   - Admin auth helpers (getCurrentUser, requireAuth, requireAdmin)
 *   - Shareholder auth helper (getActiveShareholder)
 */

// ── Admin model ───────────────────────────────────────────────────────────────
export { default as AdminModel } from "./model";
export type { IAdmin } from "./model";

// ── Admin auth helpers ────────────────────────────────────────────────────────
export { getCurrentUser, requireAuth, requireAdmin, logoutAdmin } from "./auth-utils";
export type { SessionUser } from "./auth-utils";

// ── Shareholder auth helper ───────────────────────────────────────────────────
export { getActiveShareholder } from "./sh-auth";
