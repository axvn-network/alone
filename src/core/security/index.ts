/**
 * src/core/security/index.ts
 *
 * Security primitives — CSRF, session, AES-256-GCM encryption.
 * Single import point for all security concerns.
 */

export { generateCsrfToken, validateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "./csrf";
export {
  setSessionCookie,
  getSessionEmail,
  clearSessionCookie,
  parseSessionToken,
  makeShareholderToken,
  parseShareholderToken,
  COOKIE_NAME as SESSION_COOKIE_NAME,
  SH_COOKIE,
} from "./session";
export { encryptAES, decryptAES } from "./crypto-aes";
export { getCurrentUser, requireAuth, requireAdmin, logoutAdmin } from "./auth-utils";
export type { SessionUser } from "./auth-utils";
