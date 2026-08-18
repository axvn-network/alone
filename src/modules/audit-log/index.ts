/**
 * src/modules/audit-log/index.ts
 * Barrel export — import from "@/modules/audit-log"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as AuditLog } from "./model";
export type { IAuditLog } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export {
  queryLogs,
  logAudit,
  getLogsByActor,
  deleteExpiredLogs,
} from "./service";
export type {
  AuditQuery,
  LogAuditOptions,
  AuditActor,
} from "./service";
