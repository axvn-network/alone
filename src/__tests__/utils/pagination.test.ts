/**
 * Unit tests — shared/utils/pagination.ts
 *
 * Run: npx vitest run src/__tests__/utils/pagination.test.ts
 */

import { describe, it, expect } from "vitest";
import { paginate } from "@/shared/utils/pagination";

// ─────────────────────────────────────────────────────────────────────────────

describe("paginate — defaults", () => {
  it("returns page=1, limit=50, skip=0 when called with no args", () => {
    const result = paginate();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(50);
    expect(result.skip).toBe(0);
  });

  it("returns page=1, limit=50, skip=0 when called with empty objects", () => {
    const result = paginate({}, {});
    expect(result).toEqual({ page: 1, limit: 50, skip: 0 });
  });
});

describe("paginate — basic pagination", () => {
  it("computes skip correctly for page 2", () => {
    const result = paginate({ page: 2, limit: 10 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(10);
  });

  it("computes skip for page 3 with default limit", () => {
    const result = paginate({ page: 3 });
    expect(result.skip).toBe(100); // (3-1) * 50
  });

  it("computes skip correctly for large page numbers", () => {
    const result = paginate({ page: 100, limit: 25 });
    expect(result.skip).toBe(99 * 25); // 2475
  });
});

describe("paginate — boundary clamping", () => {
  it("clamps page to minimum 1 when 0 is given", () => {
    expect(paginate({ page: 0 }).page).toBe(1);
  });

  it("clamps page to minimum 1 when negative", () => {
    expect(paginate({ page: -5 }).page).toBe(1);
  });

  it("clamps limit to minimum 1 for negative values", () => {
    // limit: 0 → opts.limit || defaultLimit = 50 (0 is falsy → uses default)
    expect(paginate({ limit: 0 }).limit).toBe(50);
    // limit: -10 → -10 is truthy → Math.max(1, -10) = 1
    expect(paginate({ limit: -10 }).limit).toBe(1);
  });

  it("clamps limit to maxLimit (default 200)", () => {
    expect(paginate({ limit: 1000 }).limit).toBe(200);
  });

  it("respects custom maxLimit", () => {
    expect(paginate({ limit: 500 }, { maxLimit: 100 }).limit).toBe(100);
  });

  it("respects custom default limit", () => {
    const result = paginate({}, { limit: 20 });
    expect(result.limit).toBe(20);
  });

  it("skip is always non-negative", () => {
    expect(paginate({ page: 0 }).skip).toBeGreaterThanOrEqual(0);
    expect(paginate({ page: -1 }).skip).toBeGreaterThanOrEqual(0);
  });
});

describe("paginate — explicit values", () => {
  it("page=1 always gives skip=0", () => {
    expect(paginate({ page: 1, limit: 30 }).skip).toBe(0);
  });

  it("accepts limit at exactly maxLimit boundary", () => {
    const result = paginate({ limit: 200 }, { maxLimit: 200 });
    expect(result.limit).toBe(200);
  });

  it("limit of 1 is valid", () => {
    const result = paginate({ page: 5, limit: 1 });
    expect(result.skip).toBe(4);
    expect(result.limit).toBe(1);
  });
});

describe("paginate — undefined opts", () => {
  it("treats undefined page as 1", () => {
    expect(paginate({ page: undefined }).page).toBe(1);
  });

  it("treats undefined limit as default", () => {
    expect(paginate({ limit: undefined }).limit).toBe(50);
  });
});
