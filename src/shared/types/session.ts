/**
 * Public session payload shape — mirrors the signed cookie payload
 * produced by src/core/security/session.ts.
 */
export interface SessionPayload {
  /** Random session ID (16-byte hex) — can be used for server-side revocation */
  id: string;
  email: string;
  /** Unix timestamp (seconds) when the session expires */
  exp: number;
}
