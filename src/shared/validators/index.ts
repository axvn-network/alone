/**
 * src/validators/index.ts
 *
 * Central Zod schema registry for the entire application.
 * Vietnamese data standards are integrated from @/core/vn-utils/vn-lib/zod-vn.
 *
 * Rules:
 *   - Phone     : stored as E.164, validated via libphonenumber-js
 *   - VND       : non-negative integer (no decimals)
 *   - National ID: 12 digits + valid province prefix (CCCD / Thông tư 59/2021/TT-BCA)
 *   - Dates     : ISO 8601 in storage, dd/mm/yyyy in display
 *   - Timezone  : Asia/Ho_Chi_Minh (UTC+7) throughout
 */

import { z } from "zod";

// ─── VN-specific Zod schemas ──────────────────────────────────────────────────
// Re-exported so consumers import from "@/validators" instead of "@/core/vn-utils/vn-lib/zod-vn"
export {
  // ── Primary (international) names ─────────────────────────────────────────
  zNationalId,
  zNationalIdOptional,
  zTaxIdBusiness,
  zTaxIdBranch,
  zTaxIdIndividual,
  zPhone,
  zPhoneOptional,
  zSwiftBic,
  zSwiftBicOptional,
  zAmountVND,
  zAmountVNDOptional,
  zBarcodeGS1,
  zDate,
  zDateOptional,
  zAddress,
  zKyc,
  // ── Backward-compatible aliases (legacy Vietnamese names) ──────────────────
  zCCCD,
  zCCCDOptional,
  zMSTDN,
  zMSTPhuThuoc,
  zMSTCaNhan,
  zSDTVN,
  zSDTVNOptional,
  zSoTienVND,
  zSoTienVNDOptional,
  zBarcodeGS1VN,
  zNgayThang,
  zNgayThangOptional,
  zDiaChiVN,
  zKycVN,
} from "@/core/vn-utils/vn-lib/zod-vn";

export type {
  AddressInput,
  KycInput,
  // Backward-compat
  DiaChiVNInput,
  KycVNInput,
} from "@/core/vn-utils/vn-lib/zod-vn";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword:     z.string().min(6, "New password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ─── Blog / Article ───────────────────────────────────────────────────────────

const seoObjectSchema = z.object({
  title:        z.string().optional().default(""),
  description:  z.string().optional().default(""),
  keywords:     z.string().optional().default(""),
  ogImage:      z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
});

export const blogSchema = z.object({
  title:         z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  excerpt:       z.string().max(500, "Excerpt must be 500 characters or fewer").optional().default(""),
  content:       z.string().optional().default(""),
  featuredImage: z.string().optional().default(""),
  category:      z.string().optional().default("General"),
  readTime:      z.string().optional().default("5 min read"),
  tags:          z.array(z.string()).optional().default([]),
  status:        z.enum(["draft", "published"]).optional().default("draft"),
  publishedAt:   z.string().datetime().nullable().optional().default(null),
  seo:           seoObjectSchema.optional(),
});

// ─── Contact / Enquiry ────────────────────────────────────────────────────────

export const contactEnquirySchema = z.object({
  type:    z.enum(["Contact", "Investment Opportunity", "Business Acquisition", "Joint Venture", "Strategic Partnership"]),
  name:    z.string().min(1, "Name is required").max(100),
  email:   z.string().email("Invalid email address"),
  phone:   z.string().optional().default(""),
  company: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(1, "Message is required").max(5000),
  document: z.string().optional().default(""),
  /**
   * Personal-data consent — required under Decree 13/2023/NĐ-CP.
   * Must be true; any other value is rejected.
   */
  consentGiven:     z.boolean().refine((v) => v === true, "You must consent to personal data processing to continue"),
  /** ISO timestamp recorded when the user ticked the checkbox — retained for audit trail */
  consentTimestamp: z.string().min(1, "Consent timestamp is required"),
});

// ─── Page content / Visual Editor ────────────────────────────────────────────

export const pageContentSchema = z.object({
  slug:     z.string().min(1, "Slug is required"),
  title:    z.string().min(1, "Title is required").optional(),
  content:  z.string().optional(),
  hero:     z.record(z.string(), z.unknown()).optional(),
  sections: z.array(z.object({
    id:      z.string(),
    type:    z.string(),
    title:   z.string(),
    content: z.string(),
    image:   z.string().optional(),
    order:   z.number(),
  })).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  seo:  seoObjectSchema.optional(),
});

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const seoSchema = z.object({
  pageSlug:     z.string().min(1, "Page slug is required"),
  title:        z.string().max(70, "SEO title must be 70 characters or fewer").optional(),
  description:  z.string().max(160, "Meta description must be 160 characters or fewer").optional(),
  keywords:     z.string().optional(),
  ogImage:      z.string().optional(),
  canonicalUrl: z.string().optional(),
});

// ─── Site Settings ────────────────────────────────────────────────────────────

export const chatButtonSchema = z.object({
  type:      z.enum(["whatsapp", "telegram", "zalo", "livechat"]),
  enabled:   z.boolean().default(true),
  value:     z.string().default(""),
  messageVi: z.string().optional().default(""),
  messageEn: z.string().optional().default(""),
});

export const settingsSchema = z.object({
  companyName:        z.string().optional(),
  logo:               z.string().optional(),
  favicon:            z.string().optional(),
  email:              z.string().email().optional().or(z.literal("")),
  phone:              z.string().optional(),
  address:            z.string().optional(),
  whatsapp:           z.string().optional(),
  googleMap:          z.string().optional(),
  socialLinks:        z.array(z.object({
    platform: z.string(),
    url:      z.string(),
  })).optional(),
  googleAnalyticsId:  z.string().optional(),
  metaPixelId:        z.string().optional(),
  footer:             z.string().optional(),
  chatButtons:        z.array(chatButtonSchema).optional(),
});

// ─── Investment Plan ──────────────────────────────────────────────────────────

export const investmentPlanSchema = z.object({
  tier:             z.enum(["seed", "growth", "expansion", "strategic", "anchor"]),
  name:             z.string().min(1, "Name (VI) is required").max(200),
  nameEn:           z.string().min(1, "Name (EN) is required").max(200),
  tagline:          z.string().optional().default(""),
  taglineEn:        z.string().optional().default(""),
  minCommitment:    z.number().min(0, "Minimum commitment must be >= 0"),
  maxCommitment:    z.number().min(0).optional().default(0),
  currency:         z.string().optional().default("VND"),
  duration:         z.string().optional().default(""),
  durationEn:       z.string().optional().default(""),
  equityRange:      z.string().optional().default(""),
  equityRangeEn:    z.string().optional().default(""),
  benefits:         z.array(z.string()).optional().default([]),
  benefitsEn:       z.array(z.string()).optional().default([]),
  conditions:       z.array(z.string()).optional().default([]),
  conditionsEn:     z.array(z.string()).optional().default([]),
  rights:           z.array(z.string()).optional().default([]),
  obligations:      z.array(z.string()).optional().default([]),
  documents:        z.array(z.string()).optional().default([]),
  shareholderType:  z.string().optional().default(""),
  highlighted:      z.boolean().optional().default(false),
  badge:            z.string().optional().default(""),
  badgeEn:          z.string().optional().default(""),
  order:            z.number().optional().default(0),
  status:           z.enum(["active", "draft", "closed"]).optional().default("draft"),
});

// ─── Document ─────────────────────────────────────────────────────────────────

export const documentSchema = z.object({
  title:          z.string().min(1, "Title is required").max(500),
  titleEn:        z.string().optional().default(""),
  category:       z.enum([
    "financial_report",
    "disclosure",
    "charter",
    "shareholder_meeting",
    "annual_report",
    "governance_report",
  ]),
  fileUrl:        z.string().min(1, "File URL is required"),
  fileType:       z.enum(["pdf", "doc", "xlsx", "other"]).optional().default("pdf"),
  publishedDate:  z.string().min(1, "Published date is required"),
  year:           z.number().int().min(2000).max(2100),
  quarter:        z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  reportType:     z.string().optional().default(""),
  isFeatured:     z.boolean().optional().default(false),
  status:         z.enum(["published", "draft"]).optional().default("published"),
});

// ─── Shareholder ──────────────────────────────────────────────────────────────

export const shareholderSchema = z.object({
  name:             z.string().min(1, "Full name is required").max(200),
  email:            z.string().email("Invalid email address"),
  password:         z.string().min(6, "Password must be at least 6 characters").optional(),
  phone:            z.string().optional().default(""),
  role:             z.enum(["tech", "financial", "tech-company", "individual", "legal", "foreign"]),
  status:           z.enum(["pending", "active", "suspended"]).optional().default("pending"),
  equityPercent:    z.number().min(0).max(100).optional().default(0),
  capitalCommitted: z.number().min(0).optional().default(0),
  capitalPaid:      z.number().min(0).optional().default(0),
  notes:            z.string().optional().default(""),
  avatarUrl:        z.string().optional().default(""),
});

// ─── Partner Application ──────────────────────────────────────────────────────

const shareholderRoleEnum = z.enum(["tech", "financial", "tech-company", "individual", "legal", "foreign"]);

export const assessmentResultSchema = z.object({
  technical: z.number().min(0).max(100),
  financial: z.number().min(0).max(100),
  legal:     z.number().min(0).max(100),
  strategic: z.number().min(0).max(100),
  network:   z.number().min(0).max(100),
});

export const partnerApplicationSchema = z.object({
  // Personal / organisation info
  fullName:    z.string().min(1, "Full name is required").max(200),
  email:       z.string().email("Invalid email address"),
  phone:       z.string().optional().default(""),
  company:     z.string().optional().default(""),
  position:    z.string().optional().default(""),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")).default(""),

  // Quiz
  quizAnswers:     z.record(z.string(), z.string()),
  assessmentScore: assessmentResultSchema,
  suggestedRole:   shareholderRoleEnum,

  // Formal registration
  desiredRole:    shareholderRoleEnum,
  capitalRange:   z.string().optional().default(""),
  motivation:     z.string().min(1, "Please describe your motivation for joining").max(3000),
  capabilities:   z.string().min(1, "Please describe the capabilities you can contribute").max(3000),
  investmentPlan: z.string().optional().default(""),

  /**
   * Personal-data consent — required under Decree 13/2023/NĐ-CP.
   * Must be true; any other value is rejected.
   */
  consentGiven:     z.boolean().refine((v) => v === true, "You must consent to personal data processing to continue"),
  /** ISO timestamp recorded when the user ticked the checkbox — retained for audit trail */
  consentTimestamp: z.string().min(1, "Consent timestamp is required"),
});

export const partnerApplicationUpdateSchema = z.object({
  status:      z.enum(["draft", "submitted", "under_review", "shortlisted", "approved", "rejected"]).optional(),
  adminNotes:  z.string().optional(),
  desiredRole: shareholderRoleEnum.optional(),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type LoginInput                    = z.infer<typeof loginSchema>;
export type BlogInput                     = z.infer<typeof blogSchema>;
export type ContactEnquiryInput           = z.infer<typeof contactEnquirySchema>;
export type PageContentInput              = z.infer<typeof pageContentSchema>;
export type SEOInput                      = z.infer<typeof seoSchema>;
export type SettingsInput                 = z.infer<typeof settingsSchema>;
export type InvestmentPlanInput           = z.infer<typeof investmentPlanSchema>;
export type DocumentInput                 = z.infer<typeof documentSchema>;
export type ShareholderInput              = z.infer<typeof shareholderSchema>;
export type AssessmentResultInput         = z.infer<typeof assessmentResultSchema>;
export type PartnerApplicationInput       = z.infer<typeof partnerApplicationSchema>;
export type PartnerApplicationUpdateInput = z.infer<typeof partnerApplicationUpdateSchema>;

// ─── Error formatter ──────────────────────────────────────────────────────────

/**
 * Converts a ZodError into a flat `{ field: string[] }` map
 * compatible with the ApiResponse `errors` field.
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!formatted[path]) formatted[path] = [];
    formatted[path].push(issue.message);
  }
  return formatted;
}
