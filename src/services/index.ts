// ─── Namespace re-exports ─────────────────────────────────────────────────────
// Usage: import { blogService } from "@/services"
// then:  blogService.createBlog(...)
export * as auditService from "./audit.service";
export * as blogService from "./blog.service";
export * as contentService from "./content.service";
export * as dashboardService from "./dashboard.service";
export * as enquiryService from "./enquiry.service";
export * as investmentPlanService from "./investment-plan.service";
export * as llmService from "./llm.service";
export * as mediaService from "./media.service";
export * as partnerApplicationService from "./partnerApplication.service";
export * as settingsService from "./settings.service";
export * as shareholderService from "./shareholder.service";
export * as shareholderOpsService from "./shareholder-ops.service";

// ─── Named object exports ─────────────────────────────────────────────────────
// documentService is a plain object (not namespace), exported directly so callers
// can destructure: import { documentService } from "@/services"
export { documentService } from "./document.service";
