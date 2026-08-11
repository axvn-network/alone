export * as auditService from "./audit.service";
export * as blogService from "./blog.service";
export * as contentService from "./content.service";
export * as dashboardService from "./dashboard.service";
export * as enquiryService from "./enquiry.service";
export * as investmentPlanService from "./investment-plan.service";
export * as mediaService from "./media.service";
export * as settingsService from "./settings.service";
export * as shareholderService from "./shareholder.service";
export * as shareholderOpsService from "./shareholder-ops.service";

// Re-export individual service objects for routes that use them directly
export { documentService } from "./document.service";
