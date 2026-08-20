/**
 * src/lib/csrf.ts — Double-submit CSRF token protection.
 *
 * Flow:
 *   1. Client calls GET /api/csrf → receives a token in a cookie AND in the JSON body.
 *   2. Client sends mutating requests (POST/PUT/PATCH/DELETE) with:
 *        - Cookie:  csrf_token=<token>   (set automatically by browser)
 *        - Header:  x-csrf-token: <token>  (must be set explicitly by JS)
 *   3. Middleware/route verifies cookie value === header value.
 *
 * Why this works: A cross-origin attacker can forge a request with the cookie
 * (browser sends it automatically) but CANNOT read the cookie value to set
 * the matching header (same-origin policy blocks JS reads from other origins).
 *
 * Token is HMAC-signed to prevent forgery even if somehow the cookie is guessable.
 */

import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "csrf_token";
const HEADER_NAME = "x-csrf-token";
const TOKEN_TTL_SECONDS = 60 * 60 * 4; // 4 hours

function getSecret(): string {
  // Prefer dedicated CSRF_SECRET if configured (recommended for production).
  // Falls back to SESSION_SECRET + ":csrf" suffix for backward compatibility.
  const dedicated = process.env.CSRF_SECRET;
  if (dedicated && dedicated.length >= 32) return dedicated;
  const session = process.env.SESSION_SECRET;
  return (session || "dev-csrf-fallback-secret") + ":csrf";
}

function signToken(raw: string): string {
  return createHmac("sha256", getSecret()).update(raw).digest("hex");
}

/** Generate a new CSRF token string */
export function generateCsrfToken(): string {
  const rand = randomBytes(24).toString("hex");
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = `${rand}.${exp}`;
  const sig = signToken(payload);
  return `${payload}.${sig}`;
}

/** Validate a CSRF token string (signature + expiry) */
export function validateCsrfToken(token: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  // format: rand . exp . sig  (3 parts)
  if (parts.length !== 3) return false;

  const [rand, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);

  if (isNaN(exp) || Date.now() / 1000 > exp) return false;

  const payload = `${rand}.${expStr}`;
  const expected = signToken(payload);

  // Constant-time comparison
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export const CSRF_COOKIE_NAME = COOKIE_NAME;
export const CSRF_HEADER_NAME = HEADER_NAME;
