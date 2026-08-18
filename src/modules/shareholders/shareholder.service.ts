/**
 * src/modules/shareholders/shareholder.service.ts — re-export shim
 * CRUD operations for Shareholder documents.
 * Canonical implementation: @/shared/services/shareholder.service
 */
export {
  list,
  getById,
  create,
  update,
  remove,
  approveKyc,
  rejectKyc,
  shareholderService,
} from "@/shared/services/shareholder.service";
export type { ShareholderQuery } from "@/shared/services/shareholder.service";
