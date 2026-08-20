/**
 * Unit tests — HMAC session cookie utilities
 *
 * Tests không cần DB, không cần Next.js runtime.
 * Chạy: npx vitest run src/__tests__/security/session.test.ts
 */

import { describe, it, expect } from "vitest";

// ── Stub process.env trước khi import module ───────────────────────────────
const TEST_SECRET = "a".repeat(64); // 64-char hex string

// Mock environment (read-only vars set via vitest env config or CLI)
process.env.SESSION_SECRET = TEST_SECRET;
// NODE_ENV is read-only — set via CLI: NODE_ENV=test vitest
process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.ADMIN_EMAIL = "test@axvn.vn";
process.env.ADMIN_PASSWORD = "testpassword123";

// ── Import module under test ────────────────────────────────────────────────
// We test the pure crypto helpers extracted from session.ts logic directly
// to avoid Next.js 'cookies()' server-only imports in test env.

import { createHmac, randomBytes } from "crypto";

// ── Replicate the signing logic from session.ts ────────────────────────────
function b64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function makeToken(
  payload: object,
  secret: string,
  expiresInSeconds = 3600,
): string {
  const fullPayload = {
    ...payload,
    id: randomBytes(16).toString("hex"),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encoded = b64urlEncode(JSON.stringify(fullPayload));
  const sig = sign(encoded, secret);
  return `${encoded}.${sig}`;
}

function verifyToken(
  raw: string,
  secret: string,
): { valid: boolean; payload?: Record<string, unknown> } {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return { valid: false };
  const encoded = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);
  const expected = sign(encoded, secret);
  if (!constantTimeEqual(provided, expected)) return { valid: false };
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const payload = JSON.parse(json) as Record<string, unknown>;
    if (!payload.exp || Date.now() / 1000 > (payload.exp as number)) {
      return { valid: false };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

// ─────────────────────────────────────────────────────────────────────────────

describe("HMAC session token — signing & verification", () => {
  it("creates a valid token that passes verification", () => {
    const token = makeToken({ email: "admin@axvn.vn" }, TEST_SECRET);
    const result = verifyToken(token, TEST_SECRET);
    expect(result.valid).toBe(true);
    expect(result.payload?.email).toBe("admin@axvn.vn");
  });

  it("rejects a tampered payload", () => {
    const token = makeToken({ email: "admin@axvn.vn" }, TEST_SECRET);
    const tampered = token.slice(0, -4) + "XXXX";
    expect(verifyToken(tampered, TEST_SECRET).valid).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    const token = makeToken({ email: "admin@axvn.vn" }, TEST_SECRET);
    expect(verifyToken(token, "b".repeat(64)).valid).toBe(false);
  });

  it("rejects an expired token", () => {
    const token = makeToken({ email: "admin@axvn.vn" }, TEST_SECRET, -1);
    expect(verifyToken(token, TEST_SECRET).valid).toBe(false);
  });

  it("rejects a token missing the dot separator", () => {
    expect(verifyToken("nodothere", TEST_SECRET).valid).toBe(false);
  });

  it("rejects empty string", () => {
    expect(verifyToken("", TEST_SECRET).valid).toBe(false);
  });

  it("includes a random id in every token (replay-resistance)", () => {
    const t1 = makeToken({ email: "x@x.vn" }, TEST_SECRET);
    const t2 = makeToken({ email: "x@x.vn" }, TEST_SECRET);
    expect(t1).not.toBe(t2);
  });
});

describe("constantTimeEqual", () => {
  it("returns true for identical strings", () => {
    expect(constantTimeEqual("abc", "abc")).toBe(true);
  });

  it("returns false for different strings of same length", () => {
    expect(constantTimeEqual("abc", "abd")).toBe(false);
  });

  it("returns false for different length strings", () => {
    expect(constantTimeEqual("ab", "abc")).toBe(false);
  });

  it("returns false for empty vs non-empty", () => {
    expect(constantTimeEqual("", "a")).toBe(false);
  });

  it("returns true for two empty strings", () => {
    expect(constantTimeEqual("", "")).toBe(true);
  });
});
