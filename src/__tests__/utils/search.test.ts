/**
 * Unit tests — shared/utils/search.ts (buildSearchFilter)
 *
 * Run: npx vitest run src/__tests__/utils/search.test.ts
 */

import { describe, it, expect } from "vitest";
import { buildSearchFilter } from "@/shared/utils/search";

// ─────────────────────────────────────────────────────────────────────────────

describe("buildSearchFilter — empty / falsy term", () => {
  it("returns {} for undefined term", () => {
    expect(buildSearchFilter(undefined, ["name", "email"])).toEqual({});
  });

  it("returns {} for empty string", () => {
    expect(buildSearchFilter("", ["name"])).toEqual({});
  });

  it("still returns {} for whitespace-only (treated as truthy)", () => {
    // Whitespace is a non-empty string → truthy, generates filter
    const result = buildSearchFilter("  ", ["name"]);
    expect(result).toHaveProperty("$or");
  });
});

describe("buildSearchFilter — single field", () => {
  it("builds $or with one field when single field given", () => {
    const result = buildSearchFilter("alice", ["name"]);
    expect(result).toEqual({
      $or: [{ name: { $regex: "alice", $options: "i" } }],
    });
  });

  it("sets case-insensitive option", () => {
    const result = buildSearchFilter("test", ["title"]);
    expect((result.$or as Array<Record<string, unknown>>)[0]["title"]).toEqual({
      $regex: "test",
      $options: "i",
    });
  });
});

describe("buildSearchFilter — multiple fields", () => {
  it("builds $or with multiple entries", () => {
    const result = buildSearchFilter("AXVN", ["name", "email", "notes"]);
    const or = result.$or as Array<Record<string, unknown>>;
    expect(or).toHaveLength(3);
    expect(or[0]).toEqual({ name: { $regex: "AXVN", $options: "i" } });
    expect(or[1]).toEqual({ email: { $regex: "AXVN", $options: "i" } });
    expect(or[2]).toEqual({ notes: { $regex: "AXVN", $options: "i" } });
  });

  it("all entries use the same search term", () => {
    const term = "cổ đông";
    const result = buildSearchFilter(term, ["name", "email"]);
    const or = result.$or as Array<Record<string, unknown>>;
    for (const entry of or) {
      const fieldFilter = Object.values(entry)[0] as { $regex: string; $options: string };
      expect(fieldFilter.$regex).toBe(term);
    }
  });
});

describe("buildSearchFilter — edge cases", () => {
  it("returns {} for empty fields array even with a term", () => {
    const result = buildSearchFilter("test", []);
    // Empty $or is valid but useless — still built
    expect(result.$or).toEqual([]);
  });

  it("preserves special regex characters in the term (no escaping)", () => {
    // The function does NOT escape — this is by design (MongoDB handles it)
    const result = buildSearchFilter("test.*", ["name"]);
    const or = result.$or as Array<Record<string, unknown>>;
    expect((or[0]["name"] as { $regex: string }).$regex).toBe("test.*");
  });

  it("each field generates an independent filter entry", () => {
    const result = buildSearchFilter("x", ["a", "b", "c", "d"]);
    const or = result.$or as Array<Record<string, unknown>>;
    const fields = or.map((e) => Object.keys(e)[0]);
    expect(fields).toEqual(["a", "b", "c", "d"]);
  });
});
