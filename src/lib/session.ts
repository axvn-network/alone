/**
 * src/lib/session.ts — Secure HMAC-SHA256 signed session cookies.
 *
 * Cookie payload (JSON, then base64url-encoded):
 *   { id: <random 16-byte hex>, email: <string>, exp: <unix seconds> }
 *
 * Cookie value format:
 *   base64url(payload) + "." + HMAC-SHA256(base64url(payload), SESSION_SECRET)
 *
 * Security properties:
 *   - Tamper-proof: HMAC signature over the full payload
 *   - Replay-resistant: exp field; id field enables server-side revocation
 *   - Constant-time comparison: prevents timing attacks
 *   - httpOnly + secure + sameSite=strict in production
 */

import { cookies } from "next/headers";
import { createHmac, randomBytes } from "crypto";

export const COOKIE_NAME = "admin_session";
const SESSION_HOURS = 8; // shorter window = less exposure
const MAX_AGE_SECONDS = SESSION_HOURS * 60 * 60;

interface SessionPayload {
  /** Random session ID — can be used for server-side revocation */
  id: string;
  email: string;
  /** Unix timestamp (seconds) when the session expires */
  exp: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET must be at least 32 chars. Generate: openssl rand -hex 32"
      );
    }
    return "dev-only-insecure-fallback-do-not-use-in-prod-ever";
  }
  return secret;
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
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function createToken(payload: SessionPayload): string {
  const encoded = b64urlEncode(JSON.stringify(payload));
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

function parseToken(token: string): SessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;

  const encoded = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  const expected = sign(encoded);

  if (!constantTimeEqual(provided, expected)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    ) as SessionPayload;

    // Check expiry
    if (!payload.exp || Date.now() / 1000 > payload.exp) return null;
    if (!payload.email || !payload.id) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Write a new signed session cookie */
export async function setSessionCookie(email: string): Promise<string> {
  const sessionId = randomBytes(16).toString("hex");
  const payload: SessionPayload = {
    id: sessionId,
    email,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const token = createToken(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return sessionId;
}

/** Verify and read the session cookie. Returns email on success, null otherwise. */
export async function getSessionEmail(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;
    if (!raw) return null;
    const payload = parseToken(raw);
    return payload?.email ?? null;
  } catch {
    return null;
  }
}

/** Parse token from a raw string (used by middleware Edge context) */
export function parseSessionToken(raw: string): string | null {
  const payload = parseToken(raw);
  return payload?.email ?? null;
}

// ─── Shareholder session helpers ─────────────────────────────────────────────
//
// Shared HMAC-SHA256 token logic — same algorithm, different cookie name and
// payload shape.  Kept here to avoid duplicating the crypto primitives.

export const SH_COOKIE = "sh_session";
const SH_MAX_AGE = MAX_AGE_SECONDS; // same 8-hour window

interface ShPayload {
  id: string;
  email: string;
  exp: number;
  nonce: string;
}

export function makeShareholderToken(id: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + SH_MAX_AGE;
  const encoded = b64urlEncode(
    JSON.stringify({ id, email, exp, nonce: randomBytes(8).toString("hex") })
  );
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

export function parseShareholderToken(raw: string): { id: string; email: string } | null {
  try {
    const dot = raw.lastIndexOf(".");
    if (dot === -1) return null;
    const encoded = raw.slice(0, dot);
    const provided = raw.slice(dot + 1);
    if (!constantTimeEqual(provided, sign(encoded))) return null;
    const data = JSON.parse(
      Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    ) as ShPayload;
    if (!data.exp || Date.now() / 1000 > data.exp) return null;
    return { id: data.id, email: data.email };
  } catch {
    return null;
  }
}

/** Delete the session cookie */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
