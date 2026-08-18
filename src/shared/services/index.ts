// ─── Namespace re-exports ─────────────────────────────────────────────────────
// Usage: import * as blogService from "@/modules/blog"
// then:  blogService.createBlog(...)
export * as auditService from "./audit.service";
export * as contentService from "./content.service";
export * as dashboardService from "./dashboard.service";
export { getDashboardStats } from "@/modules/dashboard";
export * as enquiryService from "./enquiry.service";
export * as investmentPlanService from "./investment-plan.service";
export * as llmService from "./llm.service";
export {
  uploadFile,
  deleteFile,
  listUploads,
  getUploadById,
  getUploadByPublicId,
  listByResourceType,
  getUploadStats,
} from "@/modules/media";
export * as mediaService from "./media.service";
export * as partnerApplicationService from "./partnerApplication.service";
export * as settingsService from "./settings.service";

// ─── Named object exports ─────────────────────────────────────────────────────
export { documentService } from "./document.service";
export { capitalTransactionService } from "./capital-transaction.service";

// ─── Shareholder services ─────────────────────────────────────────────────────
export { shareholderService } from "./shareholder.service";
export { shareholderOpsService } from "./shareholder-ops.service";

// ─── Module-level services (canonical) ───────────────────────────────────────
// blog → import từ @/modules/blog trực tiếp
