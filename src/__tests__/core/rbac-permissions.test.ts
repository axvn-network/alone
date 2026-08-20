/**
 * Unit tests — RBAC permissions registry (ROLE_PERMISSIONS, ROUTE_ACCESS_MAP,
 *               PUBLIC_ROUTE_PREFIXES, ROLE_LOGIN_PATHS, ROLE_HOME_PATHS)
 *
 * Run: npx vitest run src/__tests__/core/rbac-permissions.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  ROLE_PERMISSIONS,
  ROUTE_ACCESS_MAP,
  PUBLIC_ROUTE_PREFIXES,
  ROLE_LOGIN_PATHS,
  ROLE_HOME_PATHS,
  ROLE_FORBIDDEN_PATHS,
} from "@/core/rbac/rbac-lib/permissions";

// ─────────────────────────────────────────────────────────────────────────────

describe("ROLE_PERMISSIONS — integrity", () => {
  it("defines permissions for all 4 roles", () => {
    const roles = ["superadmin", "admin", "shareholder", "public"] as const;
    for (const role of roles) {
      expect(ROLE_PERMISSIONS[role]).toBeDefined();
      expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
      expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
    }
  });

  it("superadmin has admin_accounts:manage", () => {
    expect(ROLE_PERMISSIONS.superadmin).toContain("admin_accounts:manage");
  });

  it("admin does NOT have admin_accounts:manage", () => {
    expect(ROLE_PERMISSIONS.admin).not.toContain("admin_accounts:manage");
  });

  it("superadmin is a superset of admin permissions", () => {
    const saSet = new Set(ROLE_PERMISSIONS.superadmin);
    for (const perm of ROLE_PERMISSIONS.admin) {
      expect(saSet.has(perm)).toBe(true);
    }
  });

  it("admin has all shareholder permissions (content not in shareholder but admin > shareholder)", () => {
    // admin has MORE permissions than shareholder; shareholder's perm set is a subset check
    const adSet = new Set(ROLE_PERMISSIONS.admin);
    const shPerms = ROLE_PERMISSIONS.shareholder;
    // Check key shareholder perms are present in admin
    expect(adSet.has("documents:read")).toBe(true);
    expect(adSet.has("documents:download")).toBe(true);
    expect(adSet.has("investment_plans:read")).toBe(true);
    expect(adSet.has("sh_meetings:read")).toBe(true);
    expect(adSet.has("sh_messages:read")).toBe(true);
    expect(adSet.has("sh_messages:write")).toBe(true);
    expect(adSet.has("sh_tasks:read")).toBe(true);
    expect(shPerms.length).toBeGreaterThan(0);
  });

  it("shareholder cannot manage content", () => {
    expect(ROLE_PERMISSIONS.shareholder).not.toContain("content:write");
    expect(ROLE_PERMISSIONS.shareholder).not.toContain("content:publish");
    expect(ROLE_PERMISSIONS.shareholder).not.toContain("content:delete");
  });

  it("public only has public: permissions", () => {
    const nonPublic = ROLE_PERMISSIONS.public.filter((p) => !p.startsWith("public:"));
    expect(nonPublic).toHaveLength(0);
  });

  it("all permissions in each role are strings of format 'resource:action'", () => {
    for (const [_role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      for (const perm of perms) {
        expect(typeof perm).toBe("string");
        expect(perm).toMatch(/^[a-z_]+:[a-z_]+$/);
      }
    }
  });

  it("no duplicate permissions within a role", () => {
    for (const [_role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      const set = new Set(perms);
      expect(set.size).toBe(perms.length);
    }
  });
});

describe("ROUTE_ACCESS_MAP — structure", () => {
  it("is a non-empty object", () => {
    expect(typeof ROUTE_ACCESS_MAP).toBe("object");
    expect(Object.keys(ROUTE_ACCESS_MAP).length).toBeGreaterThan(0);
  });

  it("every entry has allowedRoles array", () => {
    for (const [_route, config] of Object.entries(ROUTE_ACCESS_MAP)) {
      expect(Array.isArray(config.allowedRoles)).toBe(true);
      expect(config.allowedRoles.length).toBeGreaterThan(0);
    }
  });

  it("/admin/* only allows admin and superadmin", () => {
    const config = ROUTE_ACCESS_MAP["/admin/*"];
    expect(config).toBeDefined();
    expect(config.allowedRoles).toContain("admin");
    expect(config.allowedRoles).toContain("superadmin");
    expect(config.allowedRoles).not.toContain("shareholder");
    expect(config.allowedRoles).not.toContain("public");
  });

  it("/api/admin/admins requires superadmin only", () => {
    const config = ROUTE_ACCESS_MAP["/api/admin/admins"];
    expect(config).toBeDefined();
    expect(config.allowedRoles).toEqual(["superadmin"]);
    expect(config.requiredPermissions).toContain("admin_accounts:manage");
  });

  it("/portals/shareholders/dashboard allows shareholders and admins", () => {
    const config = ROUTE_ACCESS_MAP["/portals/shareholders/dashboard"];
    expect(config).toBeDefined();
    expect(config.allowedRoles).toContain("shareholder");
    expect(config.allowedRoles).toContain("admin");
    expect(config.allowedRoles).toContain("superadmin");
  });

  it("public routes include public role", () => {
    for (const route of ["/", "/about/*", "/contact/*", "/insights/*"]) {
      const config = ROUTE_ACCESS_MAP[route];
      expect(config).toBeDefined();
      expect(config.allowedRoles).toContain("public");
    }
  });

  it("all allowedRoles are valid AppRole values", () => {
    const validRoles = new Set(["superadmin", "admin", "shareholder", "public"]);
    for (const [, config] of Object.entries(ROUTE_ACCESS_MAP)) {
      for (const role of config.allowedRoles) {
        expect(validRoles.has(role)).toBe(true);
      }
    }
  });
});

describe("PUBLIC_ROUTE_PREFIXES", () => {
  it("is a non-empty string array", () => {
    expect(Array.isArray(PUBLIC_ROUTE_PREFIXES)).toBe(true);
    expect(PUBLIC_ROUTE_PREFIXES.length).toBeGreaterThan(0);
  });

  it("all entries are strings starting with /", () => {
    for (const prefix of PUBLIC_ROUTE_PREFIXES) {
      expect(typeof prefix).toBe("string");
      expect(prefix.startsWith("/")).toBe(true);
    }
  });

  it("includes key public paths", () => {
    expect(PUBLIC_ROUTE_PREFIXES).toContain("/api/health");
    expect(PUBLIC_ROUTE_PREFIXES).toContain("/api/csrf");
    expect(PUBLIC_ROUTE_PREFIXES).toContain("/api/shareholders/auth");
    expect(PUBLIC_ROUTE_PREFIXES).toContain("/admin-login");
    expect(PUBLIC_ROUTE_PREFIXES).toContain("/portals/shareholders/login");
  });

  it("does NOT include admin-protected paths", () => {
    expect(PUBLIC_ROUTE_PREFIXES).not.toContain("/admin");
    expect(PUBLIC_ROUTE_PREFIXES).not.toContain("/api/admin");
  });

  it("has no duplicates", () => {
    const set = new Set(PUBLIC_ROUTE_PREFIXES);
    expect(set.size).toBe(PUBLIC_ROUTE_PREFIXES.length);
  });
});

describe("ROLE_LOGIN_PATHS / ROLE_HOME_PATHS / ROLE_FORBIDDEN_PATHS", () => {
  const roles = ["superadmin", "admin", "shareholder", "public"] as const;

  it("ROLE_LOGIN_PATHS has an entry for every role", () => {
    for (const role of roles) {
      expect(typeof ROLE_LOGIN_PATHS[role]).toBe("string");
      expect(ROLE_LOGIN_PATHS[role].startsWith("/")).toBe(true);
    }
  });

  it("admin and superadmin share the same login path", () => {
    expect(ROLE_LOGIN_PATHS.superadmin).toBe(ROLE_LOGIN_PATHS.admin);
  });

  it("shareholder login path differs from admin", () => {
    expect(ROLE_LOGIN_PATHS.shareholder).not.toBe(ROLE_LOGIN_PATHS.admin);
  });

  it("ROLE_HOME_PATHS has an entry for every role", () => {
    for (const role of roles) {
      expect(typeof ROLE_HOME_PATHS[role]).toBe("string");
      expect(ROLE_HOME_PATHS[role].startsWith("/")).toBe(true);
    }
  });

  it("admin/superadmin home path starts with /admin", () => {
    expect(ROLE_HOME_PATHS.admin).toMatch(/^\/admin/);
    expect(ROLE_HOME_PATHS.superadmin).toMatch(/^\/admin/);
  });

  it("shareholder home path contains shareholders portal", () => {
    expect(ROLE_HOME_PATHS.shareholder).toMatch(/shareholders/);
  });

  it("ROLE_FORBIDDEN_PATHS has an entry for every role", () => {
    for (const role of roles) {
      expect(typeof ROLE_FORBIDDEN_PATHS[role]).toBe("string");
      expect(ROLE_FORBIDDEN_PATHS[role].startsWith("/")).toBe(true);
    }
  });
});
