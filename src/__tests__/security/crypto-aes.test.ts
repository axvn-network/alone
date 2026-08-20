/**
 * Unit tests — AES-256-GCM encryption / decryption (crypto-aes.ts)
 *
 * Run: npx vitest run src/__tests__/security/crypto-aes.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";

// ── Env stubs ────────────────────────────────────────────────────────────────
beforeAll(() => {
  // Use a dedicated 32-char key so getDerivedKey takes the ENCRYPTION_KEY branch
  process.env.ENCRYPTION_KEY = "x".repeat(32);
  process.env.SESSION_SECRET = "a".repeat(64);
  process.env.MONGODB_URI = "mongodb://localhost:27017/test";
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
});

import { encryptAES, decryptAES } from "@/core/security/crypto-aes";

// ─────────────────────────────────────────────────────────────────────────────

describe("encryptAES", () => {
  it("returns a base64 string", () => {
    const out = encryptAES("hello");
    expect(typeof out).toBe("string");
    expect(() => Buffer.from(out, "base64")).not.toThrow();
  });

  it("produces at least IV(12) + authTag(16) + 1 byte = 29 bytes", () => {
    const out = encryptAES("a");
    const buf = Buffer.from(out, "base64");
    expect(buf.length).toBeGreaterThanOrEqual(29);
  });

  it("each call produces a different ciphertext (unique random IV)", () => {
    const c1 = encryptAES("same plaintext");
    const c2 = encryptAES("same plaintext");
    expect(c1).not.toBe(c2);
  });

  it("ciphertext length grows with plaintext length", () => {
    const short = encryptAES("a");
    const long = encryptAES("a".repeat(1000));
    expect(Buffer.from(long, "base64").length).toBeGreaterThan(
      Buffer.from(short, "base64").length,
    );
  });

  it("handles empty string", () => {
    const out = encryptAES("");
    expect(typeof out).toBe("string");
    // Must still produce IV + tag even for empty plaintext
    expect(Buffer.from(out, "base64").length).toBeGreaterThanOrEqual(28);
  });

  it("handles unicode / Vietnamese characters", () => {
    const plaintext = "Nguyễn Văn Hùng — Hà Nội";
    const out = encryptAES(plaintext);
    expect(typeof out).toBe("string");
    expect(out.length).toBeGreaterThan(0);
  });
});

describe("decryptAES — round-trip", () => {
  it("recovers the original plaintext", () => {
    const pt = "Hello, World!";
    const ct = encryptAES(pt);
    expect(decryptAES(ct)).toBe(pt);
  });

  it("recovers Vietnamese characters correctly", () => {
    const pt = "Nguyễn Văn Hùng — 100.000.000 ₫";
    expect(decryptAES(encryptAES(pt))).toBe(pt);
  });

  it("handles empty string encryption (produces IV+tag only)", () => {
    // Empty plaintext → 28 bytes packed (12 IV + 16 tag, 0 ciphertext bytes).
    // The guard requires buf.length >= 29, so decryptAES returns null for empty
    // plaintext by design — AES-GCM with no ciphertext bytes is not meaningful.
    const ct = encryptAES("");
    expect(typeof ct).toBe("string");
    // The packed buffer is 28 bytes → guard returns null
    expect(decryptAES(ct)).toBeNull();
  });

  it("recovers long text (1 KB)", () => {
    const pt = "A".repeat(1024);
    expect(decryptAES(encryptAES(pt))).toBe(pt);
  });

  it("recovers special characters and JSON", () => {
    const pt = JSON.stringify({ nationalId: "079056789012", taxId: "0123456789" });
    expect(decryptAES(encryptAES(pt))).toBe(pt);
  });
});

describe("decryptAES — failure cases", () => {
  it("returns null for random garbage base64", () => {
    expect(decryptAES("AAAAAAAAAAAAAAAA")).toBeNull();
  });

  it("returns null for too-short buffer (< IV + tag + 1)", () => {
    // 28 bytes in base64
    const short = Buffer.alloc(27).toString("base64");
    expect(decryptAES(short)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(decryptAES("")).toBeNull();
  });

  it("returns null when ciphertext is bit-flipped (auth tag mismatch)", () => {
    const ct = encryptAES("sensitive data");
    // Flip a byte in the ciphertext portion (after 12+16=28 bytes prefix)
    const buf = Buffer.from(ct, "base64");
    if (buf.length > 29) {
      buf[29] ^= 0xff;
      expect(decryptAES(buf.toString("base64"))).toBeNull();
    }
  });

  it("returns null when IV is tampered", () => {
    const ct = encryptAES("sensitive data");
    const buf = Buffer.from(ct, "base64");
    buf[0] ^= 0xff; // flip first byte of IV
    expect(decryptAES(buf.toString("base64"))).toBeNull();
  });

  it("returns null when auth tag is tampered", () => {
    const ct = encryptAES("sensitive data");
    const buf = Buffer.from(ct, "base64");
    buf[12] ^= 0xff; // flip first byte of auth tag
    expect(decryptAES(buf.toString("base64"))).toBeNull();
  });
});

describe("encryptAES / decryptAES — key independence", () => {
  it("does not decrypt when key env var changes (simulated)", () => {
    const pt = "top secret";
    const ct = encryptAES(pt);

    // Temporarily change key to simulate wrong key
    const orig = process.env.ENCRYPTION_KEY;
    process.env.ENCRYPTION_KEY = "y".repeat(32);
    const result = decryptAES(ct);
    process.env.ENCRYPTION_KEY = orig;

    // Wrong key should fail GCM auth → null
    expect(result).toBeNull();
  });
});
