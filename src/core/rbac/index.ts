/**
 * src/core/rbac/index.ts
 *
 * Role-Based Access Control — single import point.
 * Full re-export from rbac-lib so callers never need to reach into sub-files.
 *
 * Hierarchy: superadmin > admin > shareholder > public
 */

export * from "./rbac-lib";
export type { APIGuardResult } from "./rbac-lib";
