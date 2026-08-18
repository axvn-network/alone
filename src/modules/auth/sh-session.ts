/**
 * src/modules/auth/sh-session.ts
 *
 * Shareholder session helpers — HMAC-SHA256 signed tokens.
 * Re-exports from core/security/session for backward compatibility.
 */

export {
  SH_COOKIE,
  makeShareholderToken,
  parseShareholderToken,
} from "@/core/security/session";
