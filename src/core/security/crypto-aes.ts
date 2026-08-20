/**
 * src/core/security/crypto-aes.ts
 *
 * AES-256-GCM encryption / decryption for PII fields (national ID, tax ID, etc.)
 * Required by Decree 13/2023/NĐ-CP — personal data must be encrypted at rest.
 *
 * Each encryption call generates a fresh random 12-byte IV — never reused.
 * Wire format (base64): iv(12 B) || authTag(16 B) || ciphertext
 *
 * ── Key priority ─────────────────────────────────────────────────────────────
 * 1. ENCRYPTION_KEY env var (recommended — dedicated 32+ char key)
 * 2. SHA-256(SESSION_SECRET) — backward-compatible fallback
 *
 * ── Compliance status ────────────────────────────────────────────────────────
 * ⚠️  Implementation is complete and tested. PII field encryption (nationalId,
 *     taxId in shareholder KYC) is planned for Q1/2026 migration sprint.
 *     Until then, those fields are stored unencrypted. This file is NOT dead
 *     code — it will be wired during the KYC encryption migration.
 *
 * To enable: call encryptAES(value) before saving + decryptAES(stored) when
 * reading in src/modules/shareholders/model.ts pre/post hooks.
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getDerivedKey(): Buffer {
  // Prefer dedicated ENCRYPTION_KEY; fall back to deriving from SESSION_SECRET.
  const encKey = process.env.ENCRYPTION_KEY;
  if (encKey && encKey.length >= 32) {
    return createHash("sha256").update(encKey).digest();
  }
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET (or ENCRYPTION_KEY) must be at least 32 characters for AES-256 encryption.",
      );
    }
    // Development-only fallback — never used in production
    return createHash("sha256").update("dev-only-insecure-fallback").digest();
  }
  return createHash("sha256").update(secret).digest();
}

/**
 * Encrypt a string using AES-256-GCM.
 * @param plaintext  The value to encrypt.
 * @returns Base64 string containing iv + authTag + ciphertext.
 */
export function encryptAES(plaintext: string): string {
  const key = getDerivedKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack: iv(12) || authTag(16) || ciphertext
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/**
 * Decrypt a string produced by encryptAES().
 * @param encoded  Base64 string from encryptAES().
 * @returns The original plaintext, or null if the data is corrupt or the key is wrong.
 */
export function decryptAES(encoded: string): string | null {
  try {
    const key = getDerivedKey();
    const buf = Buffer.from(encoded, "base64");

    if (buf.length < IV_LEN + TAG_LEN + 1) return null;

    const iv = buf.subarray(0, IV_LEN);
    const authTag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const ciphertext = buf.subarray(IV_LEN + TAG_LEN);

    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);

    return decipher.update(ciphertext) + decipher.final("utf8");
  } catch {
    return null;
  }
}
