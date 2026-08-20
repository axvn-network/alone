/**
 * Unit tests — RBAC utility functions (pure, no DB, no Next.js)
 *
 * Covers: hasRole, hasAnyRole, hasMinimumRole, compareRoles,
 *         getRoleHierarchyLevel, getUserPermissions,
 *         hasPermission, hasAllPermissions, hasAnyPermission,
 *         canAccess, isAdmin, isSuperAdmin, isShareholder,
 *         isPublicUser, isAuthenticated,
 *         getRoleDisplayName, getRoleBadgeClass
 *
 * Run: npx vitest run src/__tests__/core/rbac-utils.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  hasRole,
  hasAnyRole,
  hasMinimumRole,
  compareRoles,
  getRoleHierarchyLevel,
  getUserPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canAccess,
  isAdmin,
  isSuperAdmin,
  isShareholder,
  isPublicUser,
  isAuthenticated,
  getRoleDisplayName,
  getRoleBadgeClass,
} from "@/core/rbac/rbac-lib/utils";
import type { AuthenticatedUser } from "@/core/rbac/rbac-lib/types";

// ── Test fixtures ─────────────────────────────────────────────────────────────

function makeUser(
  role: AuthenticatedUser["role"],
  overrides?: Partial<AuthenticatedUser>,
): AuthenticatedUser {
  return {
    id: "user-1",
    name: "Test User",
    email: "test@axvn.vn",
    role,
    source: role === "shareholder" ? "shareholder" : role === "public" ? "public" : "admin",
    ...overrides,
  };
}

const SA = makeUser("superadmin");
const AD = makeUser("admin");
const SH = makeUser("shareholder");
const PU = makeUser("public");

// ─────────────────────────────────────────────────────────────────────────────

describe("hasRole — exact match", () => {
  it("returns true when role matches exactly", () => {
    expect(hasRole(SA, "superadmin")).toBe(true);
    expect(hasRole(AD, "admin")).toBe(true);
    expect(hasRole(SH, "shareholder")).toBe(true);
    expect(hasRole(PU, "public")).toBe(true);
  });

  it("returns false when role differs", () => {
    expect(hasRole(SA, "admin")).toBe(false);
    expect(hasRole(AD, "superadmin")).toBe(false);
    expect(hasRole(SH, "admin")).toBe(false);
    expect(hasRole(PU, "shareholder")).toBe(false);
  });

  it("returns false for null/undefined user", () => {
    expect(hasRole(null, "admin")).toBe(false);
    expect(hasRole(undefined, "admin")).toBe(false);
  });
});

describe("hasAnyRole", () => {
  it("returns true when user role is in the list", () => {
    expect(hasAnyRole(SA, ["admin", "superadmin"])).toBe(true);
    expect(hasAnyRole(AD, ["admin", "superadmin"])).toBe(true);
    expect(hasAnyRole(SH, ["shareholder"])).toBe(true);
  });

  it("returns false when user role is NOT in the list", () => {
    expect(hasAnyRole(PU, ["admin", "superadmin", "shareholder"])).toBe(false);
    expect(hasAnyRole(SH, ["admin", "superadmin"])).toBe(false);
  });

  it("returns false for null/undefined user", () => {
    expect(hasAnyRole(null, ["admin"])).toBe(false);
    expect(hasAnyRole(undefined, ["superadmin"])).toBe(false);
  });
});

describe("hasMinimumRole — hierarchy check", () => {
  it("superadmin satisfies all minimum role levels", () => {
    expect(hasMinimumRole(SA, "public")).toBe(true);
    expect(hasMinimumRole(SA, "shareholder")).toBe(true);
    expect(hasMinimumRole(SA, "admin")).toBe(true);
    expect(hasMinimumRole(SA, "superadmin")).toBe(true);
  });

  it("admin satisfies admin, shareholder, public — not superadmin", () => {
    expect(hasMinimumRole(AD, "admin")).toBe(true);
    expect(hasMinimumRole(AD, "shareholder")).toBe(true);
    expect(hasMinimumRole(AD, "public")).toBe(true);
    expect(hasMinimumRole(AD, "superadmin")).toBe(false);
  });

  it("shareholder satisfies shareholder, public — not admin/superadmin", () => {
    expect(hasMinimumRole(SH, "shareholder")).toBe(true);
    expect(hasMinimumRole(SH, "public")).toBe(true);
    expect(hasMinimumRole(SH, "admin")).toBe(false);
    expect(hasMinimumRole(SH, "superadmin")).toBe(false);
  });

  it("public satisfies only public", () => {
    expect(hasMinimumRole(PU, "public")).toBe(true);
    expect(hasMinimumRole(PU, "shareholder")).toBe(false);
    expect(hasMinimumRole(PU, "admin")).toBe(false);
    expect(hasMinimumRole(PU, "superadmin")).toBe(false);
  });

  it("returns false for null/undefined user", () => {
    expect(hasMinimumRole(null, "public")).toBe(false);
    expect(hasMinimumRole(undefined, "shareholder")).toBe(false);
  });
});

describe("getRoleHierarchyLevel", () => {
  it("returns correct numeric levels", () => {
    expect(getRoleHierarchyLevel("superadmin")).toBeGreaterThan(getRoleHierarchyLevel("admin"));
    expect(getRoleHierarchyLevel("admin")).toBeGreaterThan(getRoleHierarchyLevel("shareholder"));
    expect(getRoleHierarchyLevel("shareholder")).toBeGreaterThan(getRoleHierarchyLevel("public"));
    expect(getRoleHierarchyLevel("public")).toBe(0);
  });
});

describe("compareRoles", () => {
  it("returns positive when roleA outranks roleB", () => {
    expect(compareRoles("superadmin", "admin")).toBeGreaterThan(0);
    expect(compareRoles("admin", "shareholder")).toBeGreaterThan(0);
    expect(compareRoles("shareholder", "public")).toBeGreaterThan(0);
  });

  it("returns negative when roleA is lower than roleB", () => {
    expect(compareRoles("public", "admin")).toBeLessThan(0);
    expect(compareRoles("shareholder", "superadmin")).toBeLessThan(0);
  });

  it("returns zero for same role", () => {
    expect(compareRoles("admin", "admin")).toBe(0);
    expect(compareRoles("public", "public")).toBe(0);
  });
});

describe("getUserPermissions", () => {
  it("returns an array for every role", () => {
    for (const user of [SA, AD, SH, PU]) {
      const perms = getUserPermissions(user);
      expect(Array.isArray(perms)).toBe(true);
      expect(perms.length).toBeGreaterThan(0);
    }
  });

  it("returns empty array for null/undefined", () => {
    expect(getUserPermissions(null)).toEqual([]);
    expect(getUserPermissions(undefined)).toEqual([]);
  });

  it("superadmin has admin_accounts:manage, admin does not", () => {
    const saPerms = getUserPermissions(SA);
    const adPerms = getUserPermissions(AD);
    expect(saPerms).toContain("admin_accounts:manage");
    expect(adPerms).not.toContain("admin_accounts:manage");
  });

  it("shareholder does NOT have admin-level permissions", () => {
    const shPerms = getUserPermissions(SH);
    expect(shPerms).not.toContain("admin_accounts:manage");
    expect(shPerms).not.toContain("content:write");
    expect(shPerms).not.toContain("enquiries:manage");
  });

  it("public only has public: permissions", () => {
    const pubPerms = getUserPermissions(PU);
    const nonPublic = pubPerms.filter((p) => !p.startsWith("public:"));
    expect(nonPublic).toHaveLength(0);
  });
});

describe("hasPermission", () => {
  it("returns true when user has the permission", () => {
    expect(hasPermission(AD, "content:write")).toBe(true);
    expect(hasPermission(SH, "documents:read")).toBe(true);
    expect(hasPermission(PU, "public:access")).toBe(true);
  });

  it("returns false when user lacks the permission", () => {
    expect(hasPermission(SH, "content:write")).toBe(false);
    expect(hasPermission(PU, "documents:read")).toBe(false);
    expect(hasPermission(AD, "admin_accounts:manage")).toBe(false);
  });

  it("returns false for null/undefined user", () => {
    expect(hasPermission(null, "public:access")).toBe(false);
    expect(hasPermission(undefined, "content:read")).toBe(false);
  });
});

describe("hasAllPermissions — AND logic", () => {
  it("returns true when user has all permissions", () => {
    expect(hasAllPermissions(AD, ["content:read", "content:write", "content:publish"])).toBe(true);
    expect(hasAllPermissions(SH, ["documents:read", "documents:download"])).toBe(true);
  });

  it("returns false if any permission is missing", () => {
    expect(hasAllPermissions(SH, ["documents:read", "content:write"])).toBe(false);
  });

  it("returns true for empty permission list", () => {
    expect(hasAllPermissions(PU, [])).toBe(true);
  });

  it("returns false for null user", () => {
    expect(hasAllPermissions(null, ["public:access"])).toBe(false);
  });
});

describe("hasAnyPermission — OR logic", () => {
  it("returns true when user has at least one", () => {
    expect(hasAnyPermission(SH, ["content:write", "documents:read"])).toBe(true);
    expect(hasAnyPermission(AD, ["admin_accounts:manage", "content:read"])).toBe(true);
  });

  it("returns false when user has none", () => {
    expect(hasAnyPermission(PU, ["documents:read", "content:write"])).toBe(false);
  });

  it("returns true for empty permission list", () => {
    expect(hasAnyPermission(PU, [])).toBe(true);
  });

  it("returns false for null user", () => {
    expect(hasAnyPermission(null, ["public:access"])).toBe(false);
  });
});

describe("canAccess — combined role + permission check", () => {
  it("allows when role is in allowedRoles and no permissions required", () => {
    const result = canAccess(AD, ["admin", "superadmin"]);
    expect(result.allowed).toBe(true);
  });

  it("denies when role is not in allowedRoles", () => {
    const result = canAccess(PU, ["admin", "superadmin"]);
    expect(result.allowed).toBe(false);
    expect(result.statusCode).toBe(403);
  });

  it("denies with 401 when user is null", () => {
    const result = canAccess(null, ["admin"]);
    expect(result.allowed).toBe(false);
    expect(result.statusCode).toBe(401);
  });

  it("allows when role matches AND has required permission (AND logic)", () => {
    const result = canAccess(AD, ["admin", "superadmin"], ["content:write"]);
    expect(result.allowed).toBe(true);
  });

  it("denies when role matches but permission missing (AND logic)", () => {
    const result = canAccess(AD, ["admin", "superadmin"], ["admin_accounts:manage"]);
    expect(result.allowed).toBe(false);
    expect(result.statusCode).toBe(403);
  });

  it("allows with OR logic when user has at least one permission", () => {
    const result = canAccess(SH, ["shareholder", "admin", "superadmin"], ["documents:read", "content:write"], true);
    expect(result.allowed).toBe(true);
  });

  it("denies with OR logic when user has none of the permissions", () => {
    const result = canAccess(SH, ["shareholder", "admin", "superadmin"], ["content:write", "audit_log:read"], true);
    expect(result.allowed).toBe(false);
  });

  it("allows when allowedRoles is empty (no role restriction)", () => {
    const result = canAccess(PU, []);
    expect(result.allowed).toBe(true);
  });
});

describe("isAdmin / isSuperAdmin / isShareholder / isPublicUser / isAuthenticated", () => {
  it("isAdmin returns true for admin and superadmin only", () => {
    expect(isAdmin(SA)).toBe(true);
    expect(isAdmin(AD)).toBe(true);
    expect(isAdmin(SH)).toBe(false);
    expect(isAdmin(PU)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("isSuperAdmin returns true only for superadmin", () => {
    expect(isSuperAdmin(SA)).toBe(true);
    expect(isSuperAdmin(AD)).toBe(false);
    expect(isSuperAdmin(null)).toBe(false);
  });

  it("isShareholder returns true only for shareholder", () => {
    expect(isShareholder(SH)).toBe(true);
    expect(isShareholder(AD)).toBe(false);
    expect(isShareholder(null)).toBe(false);
  });

  it("isPublicUser returns true only for public", () => {
    expect(isPublicUser(PU)).toBe(true);
    expect(isPublicUser(SH)).toBe(false);
    expect(isPublicUser(null)).toBe(false);
  });

  it("isAuthenticated returns true when user object present", () => {
    expect(isAuthenticated(SA)).toBe(true);
    expect(isAuthenticated(PU)).toBe(true);
    expect(isAuthenticated(null)).toBe(false);
    expect(isAuthenticated(undefined)).toBe(false);
  });
});

describe("getRoleDisplayName", () => {
  it("returns Vietnamese display name for each role", () => {
    expect(getRoleDisplayName("superadmin")).toBe("Siêu Quản Trị Viên");
    expect(getRoleDisplayName("admin")).toBe("Quản Trị Viên");
    expect(getRoleDisplayName("shareholder")).toBe("Cổ Đông Dự Án");
    expect(getRoleDisplayName("public")).toBe("Người Dùng Công Khai");
  });
});

describe("getRoleBadgeClass", () => {
  it("returns a non-empty Tailwind class string for each role", () => {
    for (const role of ["superadmin", "admin", "shareholder", "public"] as const) {
      const cls = getRoleBadgeClass(role);
      expect(typeof cls).toBe("string");
      expect(cls.length).toBeGreaterThan(0);
    }
  });

  it("returns different classes for different roles", () => {
    const sa = getRoleBadgeClass("superadmin");
    const ad = getRoleBadgeClass("admin");
    expect(sa).not.toBe(ad);
  });
});
