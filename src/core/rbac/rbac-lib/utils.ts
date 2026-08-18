/**
 * src/lib/rbac/utils.ts
 *
 * Các hàm tiện ích kiểm tra quyền tái sử dụng trong toàn bộ ứng dụng.
 *
 * Sử dụng:
 *   import { hasPermission, hasRole, canAccess, getRoleHierarchyLevel } from "@/core/rbac/rbac-lib/utils";
 *
 *   // Kiểm tra quyền đơn lẻ
 *   const ok = hasPermission(user, "documents:download");
 *
 *   // Kiểm tra nhiều quyền (AND)
 *   const ok = hasAllPermissions(user, ["content:write", "content:publish"]);
 *
 *   // Kiểm tra nhiều quyền (OR)
 *   const ok = hasAnyPermission(user, ["documents:read", "documents:download"]);
 *
 *   // Kiểm tra vai trò
 *   const ok = hasRole(user, "admin");
 *   const ok = hasMinimumRole(user, "admin"); // admin hoặc superadmin
 *
 * Lưu ý: Tất cả hàm trong file này là PURE — không có side-effect,
 * không gọi DB, không redirect. Dùng được ở mọi nơi (client, server, Edge).
 */

import type { AppRole, AuthenticatedUser, Permission, PermissionCheckResult } from "./types";
import { ROLE_PERMISSIONS } from "./permissions";

// ─── Thứ tự phân cấp vai trò (số càng cao = quyền càng lớn) ─────────────────

/**
 * Bậc phân cấp vai trò.
 * Dùng để so sánh vai trò theo thứ tự cấp bậc.
 */
const ROLE_HIERARCHY: Record<AppRole, number> = {
  public: 0,       // Thấp nhất
  shareholder: 1,
  admin: 2,
  superadmin: 3,   // Cao nhất
};

// ─── Kiểm tra vai trò ─────────────────────────────────────────────────────────

/**
 * Kiểm tra người dùng có đúng vai trò cho trước không (khớp chính xác).
 *
 * @example
 *   hasRole(user, "admin") // true nếu user.role === "admin"
 */
export function hasRole(
  user: AuthenticatedUser | null | undefined,
  role: AppRole
): boolean {
  return user?.role === role;
}

/**
 * Kiểm tra người dùng có một trong các vai trò cho trước không.
 *
 * @example
 *   hasAnyRole(user, ["admin", "superadmin"]) // true nếu admin hoặc superadmin
 */
export function hasAnyRole(
  user: AuthenticatedUser | null | undefined,
  roles: AppRole[]
): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Kiểm tra người dùng có vai trò tối thiểu yêu cầu không.
 * Dựa theo cấp bậc: public < shareholder < admin < superadmin.
 *
 * @example
 *   hasMinimumRole(user, "admin") // true nếu admin hoặc superadmin
 *   hasMinimumRole(user, "shareholder") // true nếu shareholder, admin, hoặc superadmin
 */
export function hasMinimumRole(
  user: AuthenticatedUser | null | undefined,
  minimumRole: AppRole
): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
}

/**
 * Trả về cấp bậc số của vai trò.
 * Dùng để so sánh hai vai trò.
 */
export function getRoleHierarchyLevel(role: AppRole): number {
  return ROLE_HIERARCHY[role];
}

/**
 * So sánh hai vai trò.
 * @returns số dương nếu roleA > roleB, số âm nếu roleA < roleB, 0 nếu bằng nhau
 */
export function compareRoles(roleA: AppRole, roleB: AppRole): number {
  return ROLE_HIERARCHY[roleA] - ROLE_HIERARCHY[roleB];
}

// ─── Kiểm tra quyền hạn ───────────────────────────────────────────────────────

/**
 * Lấy danh sách tất cả quyền hạn của người dùng.
 * Trả về mảng rỗng nếu user là null/undefined.
 */
export function getUserPermissions(
  user: AuthenticatedUser | null | undefined
): Permission[] {
  if (!user) return [];
  return ROLE_PERMISSIONS[user.role] ?? [];
}

/**
 * Kiểm tra người dùng có một quyền hạn cụ thể không.
 *
 * @example
 *   hasPermission(user, "documents:download") // true nếu có quyền tải tài liệu
 */
export function hasPermission(
  user: AuthenticatedUser | null | undefined,
  permission: Permission
): boolean {
  const perms = getUserPermissions(user);
  return perms.includes(permission);
}

/**
 * Kiểm tra người dùng có TẤT CẢ các quyền hạn cho trước không (AND logic).
 *
 * @example
 *   hasAllPermissions(user, ["content:write", "content:publish"])
 *   // true chỉ khi có cả 2 quyền
 */
export function hasAllPermissions(
  user: AuthenticatedUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (permissions.length === 0) return true;
  const perms = getUserPermissions(user);
  return permissions.every((p) => perms.includes(p));
}

/**
 * Kiểm tra người dùng có ÍT NHẤT MỘT trong các quyền hạn cho trước không (OR logic).
 *
 * @example
 *   hasAnyPermission(user, ["documents:read", "documents:manage"])
 *   // true nếu có ít nhất 1 trong 2 quyền
 */
export function hasAnyPermission(
  user: AuthenticatedUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (permissions.length === 0) return true;
  const perms = getUserPermissions(user);
  return permissions.some((p) => perms.includes(p));
}

// ─── Kiểm tra truy cập tổng hợp ──────────────────────────────────────────────

/**
 * Kiểm tra người dùng có quyền truy cập với điều kiện kết hợp vai trò + quyền.
 *
 * @param user        - Người dùng đã xác thực
 * @param allowedRoles - Danh sách vai trò được phép (OR)
 * @param permissions  - Danh sách quyền cần có (mặc định: AND)
 * @param requireAny   - Nếu true, chỉ cần 1 quyền trong danh sách (OR)
 *
 * @returns Kết quả kiểm tra với thông tin lỗi nếu bị từ chối
 *
 * @example
 *   // Admin hoặc superadmin, phải có quyền sửa nội dung
 *   canAccess(user, ["admin", "superadmin"], ["content:write"])
 *
 *   // Mọi vai trò authenticated, cần ít nhất 1 quyền đọc
 *   canAccess(user, ["admin", "superadmin", "shareholder"], ["reports:read", "reports:read_all"], true)
 */
export function canAccess(
  user: AuthenticatedUser | null | undefined,
  allowedRoles: AppRole[],
  permissions: Permission[] = [],
  requireAny = false
): PermissionCheckResult {
  // Chưa xác thực
  if (!user) {
    return {
      allowed: false,
      reason: "Bạn cần đăng nhập để truy cập trang này.",
      statusCode: 401,
    };
  }

  // Kiểm tra vai trò
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      allowed: false,
      reason: `Vai trò "${user.role}" không có quyền truy cập khu vực này.`,
      statusCode: 403,
    };
  }

  // Kiểm tra quyền hạn (nếu có yêu cầu)
  if (permissions.length > 0) {
    const permCheck = requireAny
      ? hasAnyPermission(user, permissions)
      : hasAllPermissions(user, permissions);

    if (!permCheck) {
      return {
        allowed: false,
        reason: "Tài khoản của bạn không có đủ quyền hạn để thực hiện thao tác này.",
        statusCode: 403,
      };
    }
  }

  return { allowed: true };
}

// ─── Kiểm tra theo nhóm vai trò thông dụng ────────────────────────────────────

/**
 * Kiểm tra nhanh: người dùng có phải là Admin (bao gồm superadmin) không?
 */
export function isAdmin(user: AuthenticatedUser | null | undefined): boolean {
  return hasAnyRole(user, ["admin", "superadmin"]);
}

/**
 * Kiểm tra nhanh: người dùng có phải là Siêu Quản Trị không?
 */
export function isSuperAdmin(user: AuthenticatedUser | null | undefined): boolean {
  return hasRole(user, "superadmin");
}

/**
 * Kiểm tra nhanh: người dùng có phải là Cổ Đông không?
 * (Không bao gồm admin — admin truy cập cổng cổ đông theo kênh riêng)
 */
export function isShareholder(user: AuthenticatedUser | null | undefined): boolean {
  return hasRole(user, "shareholder");
}

/**
 * Kiểm tra nhanh: người dùng có phải là Người Dùng Công Khai không?
 */
export function isPublicUser(user: AuthenticatedUser | null | undefined): boolean {
  return hasRole(user, "public");
}

/**
 * Kiểm tra người dùng đã xác thực (có session) hay chưa.
 * Public user đã đăng ký + đăng nhập vẫn được coi là "đã xác thực".
 */
export function isAuthenticated(user: AuthenticatedUser | null | undefined): boolean {
  return user !== null && user !== undefined;
}

// ─── Tiện ích hiển thị ────────────────────────────────────────────────────────

/**
 * Chuyển vai trò thành tên tiếng Việt dễ đọc cho người dùng.
 */
export function getRoleDisplayName(role: AppRole): string {
  const names: Record<AppRole, string> = {
    superadmin: "Siêu Quản Trị Viên",
    admin: "Quản Trị Viên",
    shareholder: "Cổ Đông Dự Án",
    public: "Người Dùng Công Khai",
  };
  return names[role] ?? role;
}

/**
 * Chuyển vai trò thành màu badge cho UI.
 * Trả về class Tailwind CSS.
 */
export function getRoleBadgeClass(role: AppRole): string {
  const classes: Record<AppRole, string> = {
    superadmin: "bg-purple-100 text-purple-800 border-purple-200",
    admin: "bg-blue-100 text-blue-800 border-blue-200",
    shareholder: "bg-green-100 text-green-800 border-green-200",
    public: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return classes[role] ?? "bg-gray-100 text-gray-700";
}
