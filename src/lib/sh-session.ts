/**
 * src/lib/sh-session.ts
 *
 * Shareholder session helpers have been merged into session.ts to share
 * the HMAC-SHA256 crypto primitives.  This file re-exports them for
 * backward compatibility — no callers need to change their imports.
 */

export {
  SH_COOKIE,
  makeShareholderToken,
  parseShareholderToken,
} from "./session";
