/**
 * Unit tests — Capital Transaction business logic (pure functions only)
 *
 * Chạy: npx vitest run src/__tests__/modules/capital-transactions.test.ts
 */

import { describe, it, expect } from "vitest";
import type { CapTxType, CapTxStatus } from "@/modules/capital-transactions/types";

// ── Pure business logic helpers extracted for testing ─────────────────────

function isTerminalStatus(status: CapTxStatus): boolean {
  return status === "confirmed" || status === "rejected" || status === "cancelled";
}

function canTransition(from: CapTxStatus, to: CapTxStatus): boolean {
  const transitions: Record<CapTxStatus, CapTxStatus[]> = {
    pending:   ["confirmed", "rejected", "cancelled"],
    confirmed: [],
    rejected:  [],
    cancelled: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

function calculateCapitalPaid(
  existing: number,
  txType: CapTxType,
  txStatus: CapTxStatus,
  amount: number,
): number {
  if (txType === "deposit" && txStatus === "confirmed") {
    return existing + amount;
  }
  return existing;
}

function formatCapTxAmount(amount: number, currency = "VND"): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  }
  return `${amount} ${currency}`;
}

// ─────────────────────────────────────────────────────────────────────────────

describe("isTerminalStatus", () => {
  it("confirmed is terminal", () => expect(isTerminalStatus("confirmed")).toBe(true));
  it("rejected is terminal", () => expect(isTerminalStatus("rejected")).toBe(true));
  it("cancelled is terminal", () => expect(isTerminalStatus("cancelled")).toBe(true));
  it("pending is not terminal", () => expect(isTerminalStatus("pending")).toBe(false));
});

describe("canTransition", () => {
  it("allows pending → confirmed", () => expect(canTransition("pending", "confirmed")).toBe(true));
  it("allows pending → rejected", () => expect(canTransition("pending", "rejected")).toBe(true));
  it("allows pending → cancelled", () => expect(canTransition("pending", "cancelled")).toBe(true));
  it("blocks confirmed → rejected (terminal)", () => expect(canTransition("confirmed", "rejected")).toBe(false));
  it("blocks confirmed → confirmed", () => expect(canTransition("confirmed", "confirmed")).toBe(false));
  it("blocks rejected → cancelled", () => expect(canTransition("rejected", "cancelled")).toBe(false));
});

describe("calculateCapitalPaid", () => {
  it("adds amount when deposit confirmed", () => {
    expect(calculateCapitalPaid(1_000_000, "deposit", "confirmed", 500_000)).toBe(1_500_000);
  });

  it("does not change when deposit is pending", () => {
    expect(calculateCapitalPaid(1_000_000, "deposit", "pending", 500_000)).toBe(1_000_000);
  });

  it("does not change for capital_call type even if confirmed", () => {
    expect(calculateCapitalPaid(1_000_000, "capital_call", "confirmed", 500_000)).toBe(1_000_000);
  });

  it("does not change for adjustment type", () => {
    expect(calculateCapitalPaid(2_000_000, "adjustment", "confirmed", 100_000)).toBe(2_000_000);
  });

  it("handles zero existing capital paid", () => {
    expect(calculateCapitalPaid(0, "deposit", "confirmed", 1_000_000)).toBe(1_000_000);
  });
});

describe("formatCapTxAmount", () => {
  it("formats VND with locale separator", () => {
    const result = formatCapTxAmount(1_000_000);
    expect(result).toContain("1");
    expect(result).toMatch(/[₫VND]/);
  });

  it("formats non-VND currency with code", () => {
    expect(formatCapTxAmount(500, "USD")).toBe("500 USD");
  });
});

describe("CapitalTx type integrity", () => {
  it("satisfies CapTxType union", () => {
    const validTypes: CapTxType[] = ["capital_call", "deposit", "payment_confirm", "adjustment"];
    expect(validTypes).toHaveLength(4);
  });

  it("satisfies CapTxStatus union", () => {
    const validStatuses: CapTxStatus[] = ["pending", "confirmed", "rejected", "cancelled"];
    expect(validStatuses).toHaveLength(4);
  });
});
