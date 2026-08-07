import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  excerpt: z.string().max(500, "Excerpt too long").optional().default(""),
  content: z.string().optional().default(""),
  featuredImage: z.string().optional().default(""),
  category: z.string().optional().default("General"),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  publishedAt: z.string().datetime().nullable().optional().default(null),
  seo: z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    keywords: z.string().optional().default(""),
    ogImage: z.string().optional().default(""),
    canonicalUrl: z.string().optional().default(""),
  }).optional(),
});

export const contactEnquirySchema = z.object({
  type: z.enum(["Contact", "Investment Opportunity", "Business Acquisition", "Joint Venture", "Strategic Partnership"]),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(1, "Message is required").max(5000),
  document: z.string().optional().default(""),
});

export const pageContentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required").optional(),
  hero: z.record(z.string(), z.unknown()).optional(),
  sections: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    content: z.string(),
    image: z.string().optional(),
    order: z.number(),
  })).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  seo: z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    keywords: z.string().optional().default(""),
    ogImage: z.string().optional().default(""),
    canonicalUrl: z.string().optional().default(""),
  }).optional(),
});

export const seoSchema = z.object({
  pageSlug: z.string().min(1, "Page slug is required"),
  title: z.string().max(70, "SEO title too long").optional(),
  description: z.string().max(160, "Description too long").optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

export const chatButtonSchema = z.object({
  type: z.enum(["whatsapp", "telegram", "zalo", "livechat"]),
  enabled: z.boolean().default(true),
  value: z.string().default(""),
  messageVi: z.string().optional().default(""),
  messageEn: z.string().optional().default(""),
});

export const settingsSchema = z.object({
  companyName: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  googleMap: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
  googleAnalyticsId: z.string().optional(),
  metaPixelId: z.string().optional(),
  footer: z.string().optional(),
  chatButtons: z.array(chatButtonSchema).optional(),
});

// ─── Investment Plan ──────────────────────────────────────────────────────────

export const investmentPlanSchema = z.object({
  tier: z.enum(["seed", "growth", "expansion", "strategic", "anchor"]),
  name: z.string().min(1, "Tên (VI) là bắt buộc").max(200),
  nameEn: z.string().min(1, "Tên (EN) là bắt buộc").max(200),
  tagline: z.string().optional().default(""),
  taglineEn: z.string().optional().default(""),
  minCommitment: z.number().min(0, "Vốn cam kết tối thiểu phải >= 0"),
  maxCommitment: z.number().min(0).optional().default(0),
  currency: z.string().optional().default("VND"),
  duration: z.string().optional().default(""),
  durationEn: z.string().optional().default(""),
  equityRange: z.string().optional().default(""),
  equityRangeEn: z.string().optional().default(""),
  benefits: z.array(z.string()).optional().default([]),
  benefitsEn: z.array(z.string()).optional().default([]),
  conditions: z.array(z.string()).optional().default([]),
  conditionsEn: z.array(z.string()).optional().default([]),
  rights: z.array(z.string()).optional().default([]),
  obligations: z.array(z.string()).optional().default([]),
  documents: z.array(z.string()).optional().default([]),
  shareholderType: z.string().optional().default(""),
  highlighted: z.boolean().optional().default(false),
  badge: z.string().optional().default(""),
  badgeEn: z.string().optional().default(""),
  order: z.number().optional().default(0),
  status: z.enum(["active", "draft", "closed"]).optional().default("draft"),
});

// ─── Document ─────────────────────────────────────────────────────────────────

export const documentSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(500),
  titleEn: z.string().optional().default(""),
  category: z.enum([
    "financial_report",
    "disclosure",
    "charter",
    "shareholder_meeting",
    "annual_report",
    "governance_report",
  ]),
  fileUrl: z.string().url("URL file không hợp lệ"),
  fileType: z.enum(["pdf", "doc", "xlsx", "other"]).optional().default("pdf"),
  publishedDate: z.string().min(1, "Ngày công bố là bắt buộc"),
  year: z.number().int().min(2000).max(2100),
  quarter: z.number().int().min(1).max(4).optional(),
  reportType: z.string().optional().default(""),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

// ─── Shareholder ──────────────────────────────────────────────────────────────

export const shareholderSchema = z.object({
  name: z.string().min(1, "Họ tên là bắt buộc").max(200),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  phone: z.string().optional().default(""),
  role: z.enum(["tech", "financial", "tech-company", "individual", "legal", "foreign"]),
  status: z.enum(["pending", "active", "suspended"]).optional().default("pending"),
  equityPercent: z.number().min(0).max(100).optional().default(0),
  capitalCommitted: z.number().min(0).optional().default(0),
  capitalPaid: z.number().min(0).optional().default(0),
  notes: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
export type PageContentInput = z.infer<typeof pageContentSchema>;
export type SEOInput = z.infer<typeof seoSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type InvestmentPlanInput = z.infer<typeof investmentPlanSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ShareholderInput = z.infer<typeof shareholderSchema>;

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!formatted[path]) formatted[path] = [];
    formatted[path].push(issue.message);
  }
  return formatted;
}
