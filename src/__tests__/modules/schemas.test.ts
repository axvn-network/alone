/**
 * Unit tests — Zod schemas: shareholder + auth
 *   shareholderSchema, loginSchema, changePasswordSchema,
 *   forgotPasswordSchema, resetPasswordSchema
 *
 * Run: npx vitest run src/__tests__/modules/schemas.test.ts
 */

import { describe, it, expect } from "vitest";
import { shareholderSchema } from "@/modules/shareholders/schema";
import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/modules/auth/schema";

// ─────────────────────────────────────────────────────────────────────────────
// shareholderSchema
// ─────────────────────────────────────────────────────────────────────────────

describe("shareholderSchema", () => {
  const validBase = {
    name: "Nguyễn Văn Hùng",
    email: "hung@axvn.vn",
    role: "individual" as const,
  };

  it("accepts a minimal valid shareholder", () => {
    expect(shareholderSchema.safeParse(validBase).success).toBe(true);
  });

  it("accepts all valid role values", () => {
    const roles = ["tech", "financial", "tech-company", "individual", "legal", "foreign"] as const;
    for (const role of roles) {
      expect(shareholderSchema.safeParse({ ...validBase, role }).success).toBe(true);
    }
  });

  it("rejects invalid role", () => {
    expect(shareholderSchema.safeParse({ ...validBase, role: "ghost" }).success).toBe(false);
  });

  it("rejects empty name", () => {
    expect(shareholderSchema.safeParse({ ...validBase, name: "" }).success).toBe(false);
  });

  it("rejects name > 200 chars", () => {
    expect(shareholderSchema.safeParse({ ...validBase, name: "a".repeat(201) }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(shareholderSchema.safeParse({ ...validBase, email: "not-an-email" }).success).toBe(false);
    expect(shareholderSchema.safeParse({ ...validBase, email: "" }).success).toBe(false);
  });

  it("rejects password shorter than 6 chars when provided", () => {
    expect(shareholderSchema.safeParse({ ...validBase, password: "abc" }).success).toBe(false);
  });

  it("accepts password when valid", () => {
    expect(shareholderSchema.safeParse({ ...validBase, password: "secret123" }).success).toBe(true);
  });

  it("defaults status to pending", () => {
    const result = shareholderSchema.safeParse(validBase);
    if (result.success) expect(result.data.status).toBe("pending");
  });

  it("accepts valid status values", () => {
    for (const status of ["pending", "active", "suspended"] as const) {
      expect(shareholderSchema.safeParse({ ...validBase, status }).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(shareholderSchema.safeParse({ ...validBase, status: "banned" }).success).toBe(false);
  });

  it("defaults equityPercent to 0", () => {
    const result = shareholderSchema.safeParse(validBase);
    if (result.success) expect(result.data.equityPercent).toBe(0);
  });

  it("rejects equityPercent > 100", () => {
    expect(shareholderSchema.safeParse({ ...validBase, equityPercent: 101 }).success).toBe(false);
  });

  it("rejects equityPercent < 0", () => {
    expect(shareholderSchema.safeParse({ ...validBase, equityPercent: -1 }).success).toBe(false);
  });

  it("accepts equityPercent at boundaries (0 and 100)", () => {
    expect(shareholderSchema.safeParse({ ...validBase, equityPercent: 0 }).success).toBe(true);
    expect(shareholderSchema.safeParse({ ...validBase, equityPercent: 100 }).success).toBe(true);
  });

  it("rejects capitalCommitted < 0", () => {
    expect(shareholderSchema.safeParse({ ...validBase, capitalCommitted: -1 }).success).toBe(false);
  });

  it("accepts capitalCommitted = 0", () => {
    expect(shareholderSchema.safeParse({ ...validBase, capitalCommitted: 0 }).success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// loginSchema
// ─────────────────────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(loginSchema.safeParse({ email: "admin@axvn.vn", password: "password123" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(loginSchema.safeParse({ email: "not-email", password: "password123" }).success).toBe(false);
  });

  it("rejects empty email", () => {
    expect(loginSchema.safeParse({ email: "", password: "password123" }).success).toBe(false);
  });

  it("rejects password shorter than 6 characters", () => {
    expect(loginSchema.safeParse({ email: "admin@axvn.vn", password: "12345" }).success).toBe(false);
  });

  it("rejects empty password", () => {
    expect(loginSchema.safeParse({ email: "admin@axvn.vn", password: "" }).success).toBe(false);
  });

  it("accepts exactly 6-character password (boundary)", () => {
    expect(loginSchema.safeParse({ email: "admin@axvn.vn", password: "123456" }).success).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
    expect(loginSchema.safeParse({ password: "pass123" }).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// changePasswordSchema
// ─────────────────────────────────────────────────────────────────────────────

describe("changePasswordSchema", () => {
  const valid = { currentPassword: "old-pass", newPassword: "new-pass-1" };

  it("accepts valid input", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty currentPassword", () => {
    expect(changePasswordSchema.safeParse({ ...valid, currentPassword: "" }).success).toBe(false);
  });

  it("rejects newPassword shorter than 6", () => {
    expect(changePasswordSchema.safeParse({ ...valid, newPassword: "abc" }).success).toBe(false);
  });

  it("accepts newPassword exactly 6 chars", () => {
    expect(changePasswordSchema.safeParse({ ...valid, newPassword: "abc123" }).success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forgotPasswordSchema
// ─────────────────────────────────────────────────────────────────────────────

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@axvn.vn" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "not-email" }).success).toBe(false);
  });

  it("rejects empty email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
  });

  it("rejects missing email field", () => {
    expect(forgotPasswordSchema.safeParse({}).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// resetPasswordSchema
// ─────────────────────────────────────────────────────────────────────────────

describe("resetPasswordSchema", () => {
  const valid = { token: "reset-token-123", password: "newpassword" };

  it("accepts valid reset data", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty token", () => {
    expect(resetPasswordSchema.safeParse({ ...valid, token: "" }).success).toBe(false);
  });

  it("rejects password shorter than 6", () => {
    expect(resetPasswordSchema.safeParse({ ...valid, password: "12345" }).success).toBe(false);
  });

  it("accepts password exactly 6 chars", () => {
    expect(resetPasswordSchema.safeParse({ ...valid, password: "abc123" }).success).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(resetPasswordSchema.safeParse({}).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ token: "abc" }).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ password: "abc123" }).success).toBe(false);
  });
});
