/**
 * src/services/capital-transaction.service.ts
 *
 * ⚠️  DEPRECATED — Use @/modules/capital-transactions directly.
 *
 * Backward-compatibility shim. Remove after all callers are updated.
 * All logic now lives in src/modules/capital-transactions/
 */

export * from "@/modules/capital-transactions";

// Legacy named-object compat: import { capitalTransactionService } from "@/shared/services/..."
import * as _svc from "@/modules/capital-transactions";
export const capitalTransactionService = _svc;
