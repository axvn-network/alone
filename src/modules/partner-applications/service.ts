/**
 * src/modules/partner-applications/service.ts — re-export shim
 * Canonical implementation: @/shared/services/partnerApplication.service
 */
export {
  createApplication,
  listApplications,
  listByRole,
  getApplicationById,
  updateApplication,
  deleteApplication,
  compareApplicants,
  getStats,
} from "@/shared/services/partnerApplication.service";
export type { ListApplicationsQuery } from "@/shared/services/partnerApplication.service";
