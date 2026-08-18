/**
 * src/core/rbac/index.ts
 *
 * Role-Based Access Control.
 * Re-exports auth-utils + exposes permission helpers.
 *
 * Roles: superadmin > admin > shareholder > public
 *
 * Migration path:
 *   Phase 1 (now):   thin wrappers over lib/auth-utils.ts
 *   Phase 2 (NQ05):  integrate with external KYC provider, add AML role checks
 */

export {
  getCurrentUser,
  requireAuth,
  requireAdmin,
  logoutAdmin,
} from "@/core/security/auth-utils";

export type { SessionUser } from "@/core/security/auth-utils";

/** Check if a user has superadmin role */
export function isSuperAdmin(role: string): boolean {
  return role === "superadmin";
}

/** Check if a user has at least admin access */
export function isAdmin(role: string): boolean {
  return role === "admin" || role === "superadmin";
}
