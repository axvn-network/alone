/**
 * src/modules/partner-applications/index.ts
 * Barrel export — import from "@/modules/partner-applications"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as PartnerApplication } from "./model";
export type { IPartnerApplication, PartnerApplicationStatus, AssessmentDimensions } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export {
  createApplication,
  listApplications,
  listByRole,
  getApplicationById,
  updateApplication,
  deleteApplication,
  compareApplicants,
  getStats,
} from "./service";
export type { ListApplicationsQuery } from "./service";

// ── Schema ────────────────────────────────────────────────────────────────────
export { assessmentResultSchema, partnerApplicationSchema, partnerApplicationUpdateSchema } from "./schema";
export type { AssessmentResultInput, PartnerApplicationInput, PartnerApplicationUpdateInput } from "./schema";

// ── Actions ───────────────────────────────────────────────────────────────────
export { submitPartnerApplicationAction, updateApplicationStatusAction } from "./actions";
