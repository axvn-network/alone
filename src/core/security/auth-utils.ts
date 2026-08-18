/**
 * src/lib/auth-utils.ts — re-export shim
 * Canonical implementation lives at: @/modules/auth/auth-utils
 */
export {
  getCurrentUser,
  requireAuth,
  requireAdmin,
  logoutAdmin,
} from "@/modules/auth/auth-utils";
export type { SessionUser } from "@/modules/auth/auth-utils";
