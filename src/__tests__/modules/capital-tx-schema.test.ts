/**
 * Unit tests — Zod schema validation for capital transactions
 *   createCapTxSchema, updateCapTxStatusSchema, submitDepositSchema
 *
 * Run: npx vitest run src/__tests__/modules/capital-tx-schema.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  createCapTxSchema,
  updateCapTxStatusSchema,
  submitDepositSchema,
} from "@/modules/capital-transactions/schema";

// ─────────────────────────────────────────────────────────────────────────────

describe("createCapTxSchema", () => {
  const valid = {
    shareholderId: "sh-abc-123",
    type: "capital_call" as const,
    amount: 10_000_000,
  };

  it("accepts a minimal valid payload", () => {
    const result = createCapTxSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts all CapTxType values", () => {
    for (const type of ["capital_call", "deposit", "payment_confirm", "adjustment"] as const) {
      const result = createCapTxSchema.safeParse({ ...valid, type });
      expect(result.success).toBe(true);
    }
  });

  it("accepts a full payload with optional fields", () => {
    const result = createCapTxSchema.safeParse({
      ...valid,
      description: "Q1 capital call",
      referenceNo: "REF-2025-001",
      adminNote: "Confirmed via email",
      proofUrl: "https://cdn.axvn.vn/proof.pdf",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing shareholderId", () => {
    const { shareholderId: _, ...rest } = valid;
    const result = createCapTxSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects empty shareholderId", () => {
    const result = createCapTxSchema.safeParse({ ...valid, shareholderId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = createCapTxSchema.safeParse({ ...valid, type: "withdrawal" });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive amount", () => {
    expect(createCapTxSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false);
    expect(createCapTxSchema.safeParse({ ...valid, amount: -100 }).success).toBe(false);
  });

  it("rejects non-integer amount", () => {
    const result = createCapTxSchema.safeParse({ ...valid, amount: 1_000_000.5 });
    expect(result.success).toBe(false);
  });

  it("defaults optional string fields to empty string", () => {
    const result = createCapTxSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.description).toBe("");
      expect(result.data.referenceNo).toBe("");
      expect(result.data.adminNote).toBe("");
      expect(result.data.proofUrl).toBe("");
    }
  });

  it("rejects description longer than 500 chars", () => {
    const result = createCapTxSchema.safeParse({
      ...valid,
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects adminNote longer than 1000 chars", () => {
    const result = createCapTxSchema.safeParse({
      ...valid,
      adminNote: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateCapTxStatusSchema", () => {
  const valid = {
    id: "tx-123",
    status: "confirmed" as const,
  };

  it("accepts confirmed / rejected / cancelled", () => {
    for (const status of ["confirmed", "rejected", "cancelled"] as const) {
      expect(updateCapTxStatusSchema.safeParse({ ...valid, status }).success).toBe(true);
    }
  });

  it("rejects status=pending (not allowed in update)", () => {
    const result = updateCapTxStatusSchema.safeParse({ ...valid, status: "pending" });
    expect(result.success).toBe(false);
  });

  it("rejects missing id", () => {
    const { id: _, ...rest } = valid;
    expect(updateCapTxStatusSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects empty id", () => {
    expect(updateCapTxStatusSchema.safeParse({ ...valid, id: "" }).success).toBe(false);
  });

  it("defaults adminNote to empty string", () => {
    const result = updateCapTxStatusSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.adminNote).toBe("");
    }
  });

  it("rejects adminNote longer than 1000 chars", () => {
    const result = updateCapTxStatusSchema.safeParse({
      ...valid,
      adminNote: "x".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});

describe("submitDepositSchema", () => {
  const valid = {
    shareholderId: "sh-456",
    amount: 5_000_000,
  };

  it("accepts a valid deposit", () => {
    expect(submitDepositSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing shareholderId", () => {
    const { shareholderId: _, ...rest } = valid;
    expect(submitDepositSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects zero amount", () => {
    expect(submitDepositSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false);
  });

  it("rejects negative amount", () => {
    expect(submitDepositSchema.safeParse({ ...valid, amount: -1 }).success).toBe(false);
  });

  it("rejects non-integer amount", () => {
    expect(submitDepositSchema.safeParse({ ...valid, amount: 999.99 }).success).toBe(false);
  });

  it("defaults optional fields to empty string", () => {
    const result = submitDepositSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.proofUrl).toBe("");
      expect(result.data.description).toBe("");
    }
  });

  it("accepts all-optional fields when provided", () => {
    const result = submitDepositSchema.safeParse({
      ...valid,
      proofUrl: "https://cdn.axvn.vn/proof.png",
      description: "Bank transfer Q1",
    });
    expect(result.success).toBe(true);
  });
});
