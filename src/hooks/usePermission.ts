/**
 * src/hooks/usePermission.ts
 *
 * Hook React phía client để kiểm tra quyền hạn của người dùng hiện tại.
 *
 * Sử dụng:
 *   const { user, loading, hasPermission, hasRole, canAccess } = usePermission();
 *
 *   // Kiểm tra quyền
 *   if (hasPermission("documents:download")) {
 *     // hiện nút tải xuống
 *   }
 *
 *   // Kiểm tra vai trò
 *   if (hasRole("admin")) {
 *     // hiện menu admin
 *   }
 *
 *   // Kiểm tra nhiều quyền cùng lúc
 *   if (canAccess(["reports:read", "reports:read_all"], false)) {
 *     // hiện trang báo cáo (chỉ cần 1 trong 2 quyền)
 *   }
 *
 * Lưu ý:
 *   - Hook tự động fetch session từ /api/auth khi mount
 *   - Kết quả được cache trong state — không fetch lại liên tục
 *   - Dùng `refresh()` để cập nhật lại khi có thay đổi (sau login/logout)
 *   - Hook này chạy phía client — KHÔNG dùng trong Server Component
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppRole, Permission } from "@/lib/rbac/types";
import {
  hasPermission as _hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole as _hasRole,
  hasAnyRole,
  hasMinimumRole,
  isAdmin as _isAdmin,
  isSuperAdmin as _isSuperAdmin,
  isShareholder as _isShareholder,
  getRoleDisplayName,
  getRoleBadgeClass,
} from "@/lib/rbac/utils";
import type { AuthenticatedUser } from "@/lib/rbac/types";

// ─── Kiểu dữ liệu trả về của hook ────────────────────────────────────────────

export interface UsePermissionReturn {
  /** Thông tin người dùng đang đăng nhập (null nếu chưa đăng nhập) */
  user: AuthenticatedUser | null;
  /** Đang fetch thông tin phiên không? */
  loading: boolean;
  /** Người dùng đã đăng nhập chưa? */
  isAuthenticated: boolean;

  // ── Kiểm tra quyền hạn ──────────────────────────────────────────────────
  /** Kiểm tra người dùng có quyền hạn cụ thể không */
  hasPermission: (permission: Permission) => boolean;
  /** Kiểm tra người dùng có TẤT CẢ quyền trong danh sách (AND) */
  hasAllPermissions: (permissions: Permission[]) => boolean;
  /** Kiểm tra người dùng có ÍT NHẤT MỘT quyền trong danh sách (OR) */
  hasAnyPermission: (permissions: Permission[]) => boolean;
  /** Kiểm tra kết hợp: AND hoặc OR theo tham số requireAll */
  canAccess: (permissions: Permission[], requireAll?: boolean) => boolean;

  // ── Kiểm tra vai trò ─────────────────────────────────────────────────────
  /** Kiểm tra người dùng có đúng vai trò không */
  hasRole: (role: AppRole) => boolean;
  /** Kiểm tra người dùng có một trong các vai trò không */
  hasAnyRole: (roles: AppRole[]) => boolean;
  /** Kiểm tra người dùng có vai trò tối thiểu (theo cấp bậc) không */
  hasMinimumRole: (role: AppRole) => boolean;

  // ── Kiểm tra nhanh theo nhóm ─────────────────────────────────────────────
  /** Người dùng có phải Admin (bao gồm superadmin) không? */
  isAdmin: boolean;
  /** Người dùng có phải Siêu Quản Trị không? */
  isSuperAdmin: boolean;
  /** Người dùng có phải Cổ Đông không? */
  isShareholder: boolean;
  /** Người dùng có phải Người Dùng Công Khai không? */
  isPublicUser: boolean;

  // ── Tiện ích hiển thị ────────────────────────────────────────────────────
  /** Tên vai trò tiếng Việt dễ đọc */
  roleDisplayName: string;
  /** Class CSS badge cho vai trò */
  roleBadgeClass: string;

  /** Cập nhật lại thông tin phiên (dùng sau login/logout) */
  refresh: () => Promise<void>;
}

// ─── Hook chính ───────────────────────────────────────────────────────────────

/**
 * Hook kiểm tra quyền hạn và vai trò của người dùng hiện tại.
 *
 * @param source - Nguồn session cần fetch: "public" | "shareholder" | "admin" | "auto"
 *   - "auto" (mặc định): thử /api/auth trước, nếu không có thì thử /api/shareholders/auth
 *   - "public": chỉ kiểm tra session Public User
 *   - "shareholder": chỉ kiểm tra session Cổ Đông
 *   - "admin": không fetch (admin dùng server-side auth)
 */
export function usePermission(
  source: "public" | "shareholder" | "admin" | "auto" = "auto"
): UsePermissionReturn {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  /** Fetch thông tin phiên từ server */
  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      let resolved: AuthenticatedUser | null = null;

      if (source === "public" || source === "auto") {
        // Thử Public User session
        const res = await fetch("/api/auth", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            resolved = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              role: "public",
              source: "public",
            };
          }
        }
      }

      if (!resolved && (source === "shareholder" || source === "auto")) {
        // Thử Cổ Đông session
        const res = await fetch("/api/shareholders/auth", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            resolved = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              role: "shareholder",
              source: "shareholder",
            };
          }
        }
      }

      setUser(resolved);
    } catch {
      // Lỗi mạng hoặc server — coi như chưa đăng nhập
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  // ─── Các hàm kiểm tra (memoized implicitly thông qua user state) ──────────

  return {
    user,
    loading,
    isAuthenticated: user !== null,

    // Quyền hạn
    hasPermission: (permission) => _hasPermission(user, permission),
    hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
    hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
    canAccess: (permissions, requireAll = true) =>
      requireAll
        ? hasAllPermissions(user, permissions)
        : hasAnyPermission(user, permissions),

    // Vai trò
    hasRole: (role) => _hasRole(user, role),
    hasAnyRole: (roles) => hasAnyRole(user, roles),
    hasMinimumRole: (role) => hasMinimumRole(user, role),

    // Kiểm tra nhanh
    isAdmin: _isAdmin(user),
    isSuperAdmin: _isSuperAdmin(user),
    isShareholder: _isShareholder(user),
    isPublicUser: user?.role === "public",

    // Hiển thị
    roleDisplayName: user ? getRoleDisplayName(user.role) : "Khách",
    roleBadgeClass: user ? getRoleBadgeClass(user.role) : "bg-gray-100 text-gray-500",

    refresh: fetchSession,
  };
}
