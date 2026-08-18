/**
 * src/modules/audit-log/service.ts — re-export shim
 * Canonical implementation: @/shared/services/audit.service
 */
export {
  queryLogs,
  logAudit,
  getLogsByActor,
  deleteExpiredLogs,
} from "@/shared/services/audit.service";
export type { AuditQuery, LogAuditOptions, AuditActor } from "@/shared/services/audit.service";
