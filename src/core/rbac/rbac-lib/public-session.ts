/**
 * src/lib/rbac/public-session.ts
 *
 * Quản lý session cookie cho Người Dùng Công Khai (Public User).
 *
 * Cùng thuật toán HMAC-SHA256 đã dùng cho admin và cổ đông,
 * nhưng tên cookie khác ("pub_session") để tránh xung đột.
 *
 * Payload token:
 *   { id: string; email: string; exp: number; nonce: string }
 */

import { createHmac, randomBytes } from "crypto";

/** Tên cookie lưu session của người dùng công khai */
export const PUB_COOKIE = "pub_session";

/** Thời gian hết hạn session: 7 ngày */
const PUB_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// ─── Payload ──────────────────────────────────────────────────────────────────

interface PubPayload {
  /** ID tài liệu MongoDB */
  id: string;
  /** Email người dùng */
  email: string;
  /** Unix timestamp hết hạn */
  exp: number;
  /** Nonce ngẫu nhiên — chống replay nhẹ */
  nonce: string;
}

// ─── Helpers nội bộ ──────────────────────────────────────────────────────────

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET phải có ít nhất 32 ký tự.");
    }
    return "dev-only-insecure-fallback-do-not-use-in-prod-ever";
  }
  // Namespace riêng để tách biệt khỏi admin/shareholder secret
  return s + ":pub";
}

function b64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ─── API công khai ────────────────────────────────────────────────────────────

/**
 * Tạo token session cho Public User.
 * Dùng sau khi xác thực thành công để ghi cookie.
 */
export function makePublicUserToken(id: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + PUB_MAX_AGE_SECONDS;
  const payload: PubPayload = {
    id,
    email,
    exp,
    nonce: randomBytes(8).toString("hex"),
  };
  const encoded = b64urlEncode(JSON.stringify(payload));
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

/**
 * Phân tích và xác minh token session của Public User.
 * Trả về `{ id, email }` nếu hợp lệ và chưa hết hạn, ngược lại null.
 */
export function parsePublicUserToken(
  raw: string
): { id: string; email: string } | null {
  try {
    const dot = raw.lastIndexOf(".");
    if (dot === -1) return null;

    const encoded = raw.slice(0, dot);
    const provided = raw.slice(dot + 1);

    // Xác minh chữ ký HMAC — chống giả mạo
    if (!constantTimeEqual(provided, sign(encoded))) return null;

    // Giải mã payload
    const json = Buffer.from(
      encoded.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString();
    const data = JSON.parse(json) as PubPayload;

    // Kiểm tra hết hạn
    if (!data.exp || Date.now() / 1000 > data.exp) return null;

    return { id: data.id, email: data.email };
  } catch {
    return null;
  }
}

/** Thời gian tối đa (giây) cho cookie pub_session */
export const PUB_MAX_AGE = PUB_MAX_AGE_SECONDS;
