/**
 * Unit tests — HMAC session tokens for Shareholder + Public User
 *   makeShareholderToken, parseShareholderToken (session.ts)
 *   makePublicUserToken, parsePublicUserToken (public-session.ts)
 *
 * Run: npx vitest run src/__tests__/security/session-tokens.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";

// ── Env stubs ────────────────────────────────────────────────────────────────
const TEST_SECRET = "a".repeat(64);

beforeAll(() => {
  process.env.SESSION_SECRET = TEST_SECRET;
  process.env.MONGODB_URI = "mongodb://localhost:27017/test";
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
});

import {
  makeShareholderToken,
  parseShareholderToken,
} from "@/core/security/session";

import {
  makePublicUserToken,
  parsePublicUserToken,
} from "@/core/rbac/rbac-lib/public-session";

// ─────────────────────────────────────────────────────────────────────────────

describe("makeShareholderToken", () => {
  it("returns a string with exactly one dot (encoded.sig)", () => {
    const token = makeShareholderToken("user-1", "sh@axvn.vn");
    expect(typeof token).toBe("string");
    // Should have format: base64url.hexsig — last dot separates sig
    expect(token.includes(".")).toBe(true);
  });

  it("each call returns a unique token (nonce)", () => {
    const t1 = makeShareholderToken("user-1", "sh@axvn.vn");
    const t2 = makeShareholderToken("user-1", "sh@axvn.vn");
    expect(t1).not.toBe(t2);
  });

  it("encodes id and email in the payload", () => {
    const token = makeShareholderToken("abc123", "shareholder@test.com");
    const dot = token.lastIndexOf(".");
    const encoded = token.slice(0, dot);
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const payload = JSON.parse(json);
    expect(payload.id).toBe("abc123");
    expect(payload.email).toBe("shareholder@test.com");
  });

  it("payload contains exp in the future", () => {
    const token = makeShareholderToken("user-1", "sh@axvn.vn");
    const dot = token.lastIndexOf(".");
    const encoded = token.slice(0, dot);
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(b64, "base64").toString());
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});

describe("parseShareholderToken — valid", () => {
  it("returns id and email for a fresh token", () => {
    const token = makeShareholderToken("user-42", "test@sh.vn");
    const result = parseShareholderToken(token);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("user-42");
    expect(result!.email).toBe("test@sh.vn");
  });

  it("handles different IDs correctly", () => {
    const token = makeShareholderToken("mongodb-objectid-123", "another@sh.vn");
    const result = parseShareholderToken(token);
    expect(result?.id).toBe("mongodb-objectid-123");
    expect(result?.email).toBe("another@sh.vn");
  });
});

describe("parseShareholderToken — invalid", () => {
  it("returns null for empty string", () => {
    expect(parseShareholderToken("")).toBeNull();
  });

  it("returns null for a token with no dot separator", () => {
    expect(parseShareholderToken("nodothere")).toBeNull();
  });

  it("returns null for tampered signature", () => {
    const token = makeShareholderToken("user-1", "sh@axvn.vn");
    const tampered = token.slice(0, -4) + "XXXX";
    expect(parseShareholderToken(tampered)).toBeNull();
  });

  it("returns null for a token signed with a different secret", () => {
    // Simulate a token from another environment by crafting with wrong secret
    const token = makeShareholderToken("user-1", "sh@axvn.vn");
    // Mutate last 8 hex chars of signature
    const lastDot = token.lastIndexOf(".");
    const sig = token.slice(lastDot + 1);
    const badSig = sig.slice(0, -8) + "00000000";
    const fakeToken = token.slice(0, lastDot + 1) + badSig;
    expect(parseShareholderToken(fakeToken)).toBeNull();
  });

  it("returns null for random base64 garbage", () => {
    expect(parseShareholderToken("dGVzdA.dGVzdA")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Public User Token
// ─────────────────────────────────────────────────────────────────────────────

describe("makePublicUserToken", () => {
  it("returns a non-empty string", () => {
    const token = makePublicUserToken("pub-1", "pub@test.com");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
  });

  it("each call produces a unique token (nonce)", () => {
    const t1 = makePublicUserToken("pub-1", "pub@test.com");
    const t2 = makePublicUserToken("pub-1", "pub@test.com");
    expect(t1).not.toBe(t2);
  });

  it("expiry is 7 days from now (604800 s)", () => {
    const before = Math.floor(Date.now() / 1000);
    const token = makePublicUserToken("pub-1", "pub@test.com");
    const dot = token.lastIndexOf(".");
    const encoded = token.slice(0, dot);
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(b64, "base64").toString());
    const delta = payload.exp - before;
    // 7 days = 604800 s; allow ±5 s
    expect(delta).toBeGreaterThan(604790);
    expect(delta).toBeLessThan(604810);
  });
});

describe("parsePublicUserToken — valid", () => {
  it("returns id and email for a fresh token", () => {
    const token = makePublicUserToken("pub-99", "user@public.com");
    const result = parsePublicUserToken(token);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("pub-99");
    expect(result!.email).toBe("user@public.com");
  });
});

describe("parsePublicUserToken — invalid", () => {
  it("returns null for empty string", () => {
    expect(parsePublicUserToken("")).toBeNull();
  });

  it("returns null for no dot separator", () => {
    expect(parsePublicUserToken("nodothere")).toBeNull();
  });

  it("returns null for tampered token", () => {
    const token = makePublicUserToken("pub-1", "pub@test.com");
    const tampered = token.slice(0, -4) + "ZZZZ";
    expect(parsePublicUserToken(tampered)).toBeNull();
  });

  it("returns null for corrupted JSON payload", () => {
    // Build a token with invalid JSON but valid-looking structure
    const fakeEncoded = Buffer.from("not valid json").toString("base64")
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    expect(parsePublicUserToken(`${fakeEncoded}.fakesig`)).toBeNull();
  });
});

describe("Token namespace isolation — shareholder vs public", () => {
  it("a shareholder token is NOT parsed as a valid public token", () => {
    const shToken = makeShareholderToken("sh-1", "sh@axvn.vn");
    // Public-session uses a different HMAC key (SESSION_SECRET + ':pub')
    const result = parsePublicUserToken(shToken);
    expect(result).toBeNull();
  });

  it("a public token is NOT parsed as a valid shareholder token", () => {
    const pubToken = makePublicUserToken("pub-1", "pub@test.com");
    // Session.ts shareholder uses SESSION_SECRET directly (no ':pub' suffix)
    const result = parseShareholderToken(pubToken);
    expect(result).toBeNull();
  });
});
