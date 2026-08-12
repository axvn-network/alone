/**
 * src/lib/index.ts
 *
 * Public barrel for lib utilities.
 *
 * Server-only modules (session, sh-session, db, email, csrf) are intentionally
 * NOT re-exported here — importing them in client bundles would cause build errors.
 * Import those directly from their respective files.
 *
 * Usage:
 *   import { env } from "@/lib";
 *   import { logger } from "@/lib";
 *   import { t } from "@/lib";
 *   import { encryptAES, decryptAES } from "@/lib";
 *   import { fadeUpVariants, staggerContainerVariants } from "@/lib";
 */

// ── Environment config ────────────────────────────────────────────────────────
export { env } from "./env";

// ── Structured logger ─────────────────────────────────────────────────────────
export { logger } from "./logger";

// ── i18n ─────────────────────────────────────────────────────────────────────
export { t } from "./i18n";
export type { Locale, LocaleKeys } from "./i18n";

// ── AES-256-GCM PII encryption (server-side only) ─────────────────────────────
export { encryptAES, decryptAES } from "./crypto-aes";

// ── Framer Motion animation presets ──────────────────────────────────────────
export {
  easings,
  durations,
  viewportOptions,
  fadeUpVariants,
  fadeInVariants,
  cardVariants,
  scaleInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  buttonVariants,
  staggerContainerVariants,
  navVariants,
  modalBackdropVariants,
  modalContentVariants,
  dropdownVariants,
  sidebarVariants,
  accordionVariants,
  toastVariants,
  skeletonVariants,
  iconHoverVariants,
  imageRevealVariants,
  linkUnderlineVariants,
  counterTransition,
} from "./animation";

// ── SSE broker ────────────────────────────────────────────────────────────────
export {
  addClient,
  removeClient,
  broadcast,
  clientCount,
} from "./sse-broker";
export type { SSEClient } from "./sse-broker";

// ── Admin auth helpers (server-side only) ─────────────────────────────────────
export { getCurrentUser, requireAuth, requireAdmin } from "./auth-utils";
export type { SessionUser } from "./auth-utils";

// ── Vietnamese data layer ─────────────────────────────────────────────────────
export * from "./vn";
