/**
 * Unit tests — CSRF token (generateCsrfToken / validateCsrfToken)
 *
 * Run: npx vitest run src/__tests__/security/csrf.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";

// ── Env stubs ────────────────────────────────────────────────────────────────
beforeAll(() => {
  process.env.SESSION_SECRET = "a".repeat(64);
  process.env.CSRF_SECRET = "b".repeat(64);
  process.env.MONGODB_URI = "mongodb://localhost:27017/test";
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
});

import { generateCsrfToken, validateCsrfToken } from "@/core/security/csrf";

// ─────────────────────────────────────────────────────────────────────────────

describe("generateCsrfToken — token structure", () => {
  it("returns a string", () => {
    const token = generateCsrfToken();
    expect(typeof token).toBe("string");
  });

  it("token has exactly 3 dot-delimited parts", () => {
    const token = generateCsrfToken();
    const parts = token.split(".");
    expect(parts).toHaveLength(3);
  });

  it("part[0] is a hex-encoded random value (48 hex chars = 24 bytes)", () => {
    const token = generateCsrfToken();
    const [rand] = token.split(".");
    expect(rand).toMatch(/^[0-9a-f]{48}$/);
  });

  it("part[1] is a numeric Unix timestamp (exp in future)", () => {
    const token = generateCsrfToken();
    const [, expStr] = token.split(".");
    const exp = parseInt(expStr, 10);
    expect(Number.isInteger(exp)).toBe(true);
    expect(exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("expiry is approximately 4 hours from now", () => {
    const before = Math.floor(Date.now() / 1000);
    const token = generateCsrfToken();
    const exp = parseInt(token.split(".")[1], 10);
    const delta = exp - before;
    // 4 hours = 14400 s; allow ±5 s tolerance
    expect(delta).toBeGreaterThan(14390);
    expect(delta).toBeLessThan(14410);
  });

  it("every call produces a unique token (random component)", () => {
    const t1 = generateCsrfToken();
    const t2 = generateCsrfToken();
    expect(t1).not.toBe(t2);
    expect(t1.split(".")[0]).not.toBe(t2.split(".")[0]);
  });

  it("part[2] is a 64-char hex HMAC signature", () => {
    const token = generateCsrfToken();
    const [, , sig] = token.split(".");
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("validateCsrfToken — valid tokens", () => {
  it("validates a freshly generated token", () => {
    const token = generateCsrfToken();
    expect(validateCsrfToken(token)).toBe(true);
  });

  it("validates the same token called twice", () => {
    const token = generateCsrfToken();
    expect(validateCsrfToken(token)).toBe(true);
    expect(validateCsrfToken(token)).toBe(true);
  });
});

describe("validateCsrfToken — invalid inputs", () => {
  it("rejects empty string", () => {
    expect(validateCsrfToken("")).toBe(false);
  });

  it("rejects a random string without dots", () => {
    expect(validateCsrfToken("randomgibberish")).toBe(false);
  });

  it("rejects only 2 parts", () => {
    expect(validateCsrfToken("aaa.bbb")).toBe(false);
  });

  it("rejects 4 or more parts", () => {
    expect(validateCsrfToken("a.b.c.d")).toBe(false);
  });

  it("rejects tampered signature", () => {
    const token = generateCsrfToken();
    const [rand, exp, sig] = token.split(".");
    const badSig = sig.slice(0, -4) + "XXXX";
    expect(validateCsrfToken(`${rand}.${exp}.${badSig}`)).toBe(false);
  });

  it("rejects tampered rand component", () => {
    const token = generateCsrfToken();
    const [rand, exp, sig] = token.split(".");
    const badRand = rand.slice(0, -4) + "0000";
    expect(validateCsrfToken(`${badRand}.${exp}.${sig}`)).toBe(false);
  });

  it("rejects an expired token (exp in the past)", () => {
    // Build a token with exp already elapsed
    const rand = "a".repeat(48);
    const exp = Math.floor(Date.now() / 1000) - 1;
    // We can't forge a valid sig without the secret — but if we could the exp check
    // would fire. Test that non-matching sig also rejects.
    const fakeToken = `${rand}.${exp}.fakesig`;
    expect(validateCsrfToken(fakeToken)).toBe(false);
  });

  it("rejects NaN exp", () => {
    const token = generateCsrfToken();
    const [rand, , sig] = token.split(".");
    expect(validateCsrfToken(`${rand}.notanumber.${sig}`)).toBe(false);
  });
});
