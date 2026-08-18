/**
 * src/lib/rbac/index.ts
 *
 * Điểm xuất (export) trung tâm cho toàn bộ hệ thống phân quyền RBAC.
 *
 * Import từ đây thay vì từ từng file riêng lẻ:
 *
 *   import {
 *     // Kiểu dữ liệu
 *     AppRole, Permission, AuthenticatedUser,
 *
 *     // Tiện ích thuần (pure functions — dùng mọi nơi)
 *     hasPermission, hasRole, canAccess, isAdmin,
 *
 *     // Guard server-side (Node.js only — không dùng ở client)
 *     requireAdminGuard, checkAdminAPI, resolveCurrentUser,
 *
 *     // Hằng số quyền hạn
 *     ROLE_PERMISSIONS, ROUTE_ACCESS_MAP,
 *   } from "@/core/rbac/rbac-lib";
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Sơ đồ phụ thuộc (dependency graph):
 *
 *   types.ts          ← Không phụ thuộc gì
 *      ↑
 *   permissions.ts    ← Phụ thuộc types.ts
 *      ↑
 *   utils.ts          ← Phụ thuộc types.ts + permissions.ts
 *      ↑
 *   guards.ts         ← Phụ thuộc utils.ts + DB + session helpers
 *   public-session.ts ← Phụ thuộc crypto (Node.js)
 */

// ─── Kiểu dữ liệu ────────────────────────────────────────────────────────────
export type {
  AppRole,
  Permission,
  AuthenticatedUser,
  PermissionCheckResult,
  RouteConfig,
} from "./types";

// ─── Bảng quyền hạn & bản đồ route ──────────────────────────────────────────
export {
  ROLE_PERMISSIONS,
  ROUTE_ACCESS_MAP,
  PUBLIC_ROUTE_PREFIXES,
  ROLE_LOGIN_PATHS,
  ROLE_HOME_PATHS,
  ROLE_FORBIDDEN_PATHS,
} from "./permissions";

// ─── Tiện ích kiểm tra quyền (pure — dùng mọi nơi, kể cả client) ─────────────
export {
  // Kiểm tra vai trò
  hasRole,
  hasAnyRole,
  hasMinimumRole,
  getRoleHierarchyLevel,
  compareRoles,

  // Kiểm tra quyền hạn
  getUserPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,

  // Kiểm tra kết hợp
  canAccess,

  // Nhóm vai trò thông dụng
  isAdmin,
  isSuperAdmin,
  isShareholder,
  isPublicUser,
  isAuthenticated,

  // Tiện ích hiển thị
  getRoleDisplayName,
  getRoleBadgeClass,
} from "./utils";

// ─── Guard server-side (Node.js only — KHÔNG import ở client/Edge) ──────────
// Các hàm này gọi cookies(), redirect(), DB — không hoạt động trong Edge Runtime
export {
  // Resolver người dùng hiện tại
  resolveCurrentUser,

  // Guard cho Server Component / Server Action (redirect on fail)
  requireAdminGuard,
  requireSuperAdminGuard,
  requireShareholderGuard,
  requireAuthGuard,
  requirePermissionGuard,

  // Guard cho Route Handler (trả JSON lỗi thay vì redirect)
  checkAdminAPI,
  checkSuperAdminAPI,
  checkShareholderAPI,
  checkPermissionAPI,
} from "./guards";

export type { APIGuardResult } from "./guards";

// ─── Session Public User ──────────────────────────────────────────────────────
export {
  PUB_COOKIE,
  PUB_MAX_AGE,
  makePublicUserToken,
  parsePublicUserToken,
} from "./public-session";
