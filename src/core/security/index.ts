/**
 * src/core/security/index.ts
 *
 * Security primitives — CSRF, session, rate-limit.
 * Single import point for all security concerns.
 *
 * Migration path:
 *   Phase 2 (scale): move rate-limit to Redis ZSET sliding window
 *   Phase 3 (NQ05):  AES-256-GCM encryption for nationalId at rest
 */

export { generateCsrfToken, validateCsrfToken } from "@/core/security/csrf";
export {
  setSessionCookie,
  getSessionEmail,
  clearSessionCookie,
  parseSessionToken,
} from "@/core/security/session";
