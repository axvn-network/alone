/**
 * Unit tests — RBAC role hierarchy & permission checks
 *
 * Chạy: npx vitest run src/__tests__/core/rbac.test.ts
 */

import { describe, it, expect } from "vitest";

// ── RBAC hierarchy extracted for pure unit testing ────────────────────────
type Role = "superadmin" | "admin" | "shareholder" | "public";

const ROLE_RANK: Record<Role, number> = {
  superadmin:  100,
  admin:        80,
  shareholder:  40,
  public:        0,
};

function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[requiredRole];
}

function canAccess(userRole: Role, resource: string): boolean {
  const perms: Record<string, Role> = {
    "admin:read":          "admin",
    "admin:write":         "admin",
    "admin:delete":        "superadmin",
    "shareholder:read":    "shareholder",
    "shareholder:kyc":     "shareholder",
    "shareholder:docs":    "shareholder",
    "public:read":         "public",
    "settings:write":      "superadmin",
    "audit-log:read":      "admin",
    "capital-tx:confirm":  "admin",
    "capital-tx:create":   "admin",
  };
  const required = perms[resource];
  if (!required) return false;
  return hasRole(userRole, required);
}

// ─────────────────────────────────────────────────────────────────────────────

describe("hasRole — hierarchy enforcement", () => {
  it("superadmin satisfies all roles", () => {
    expect(hasRole("superadmin", "superadmin")).toBe(true);
    expect(hasRole("superadmin", "admin")).toBe(true);
    expect(hasRole("superadmin", "shareholder")).toBe(true);
    expect(hasRole("superadmin", "public")).toBe(true);
  });

  it("admin satisfies admin, shareholder, public", () => {
    expect(hasRole("admin", "admin")).toBe(true);
    expect(hasRole("admin", "shareholder")).toBe(true);
    expect(hasRole("admin", "public")).toBe(true);
    expect(hasRole("admin", "superadmin")).toBe(false);
  });

  it("shareholder cannot satisfy admin or superadmin", () => {
    expect(hasRole("shareholder", "shareholder")).toBe(true);
    expect(hasRole("shareholder", "public")).toBe(true);
    expect(hasRole("shareholder", "admin")).toBe(false);
    expect(hasRole("shareholder", "superadmin")).toBe(false);
  });

  it("public satisfies only public", () => {
    expect(hasRole("public", "public")).toBe(true);
    expect(hasRole("public", "shareholder")).toBe(false);
    expect(hasRole("public", "admin")).toBe(false);
  });
});

describe("canAccess — resource permission checks", () => {
  it("superadmin can access everything", () => {
    expect(canAccess("superadmin", "admin:delete")).toBe(true);
    expect(canAccess("superadmin", "settings:write")).toBe(true);
    expect(canAccess("superadmin", "capital-tx:confirm")).toBe(true);
  });

  it("admin can manage capital transactions", () => {
    expect(canAccess("admin", "capital-tx:confirm")).toBe(true);
    expect(canAccess("admin", "capital-tx:create")).toBe(true);
  });

  it("admin cannot delete (superadmin only)", () => {
    expect(canAccess("admin", "admin:delete")).toBe(false);
    expect(canAccess("admin", "settings:write")).toBe(false);
  });

  it("shareholder can access shareholder resources", () => {
    expect(canAccess("shareholder", "shareholder:read")).toBe(true);
    expect(canAccess("shareholder", "shareholder:kyc")).toBe(true);
    expect(canAccess("shareholder", "shareholder:docs")).toBe(true);
  });

  it("shareholder cannot access admin resources", () => {
    expect(canAccess("shareholder", "admin:read")).toBe(false);
    expect(canAccess("shareholder", "audit-log:read")).toBe(false);
  });

  it("public can only read public resources", () => {
    expect(canAccess("public", "public:read")).toBe(true);
    expect(canAccess("public", "shareholder:read")).toBe(false);
    expect(canAccess("public", "admin:read")).toBe(false);
  });

  it("returns false for unknown resources", () => {
    expect(canAccess("superadmin", "unknown:resource")).toBe(false);
    expect(canAccess("public", "nonexistent")).toBe(false);
  });
});
