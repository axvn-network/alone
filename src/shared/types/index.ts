import type { ShareholderRole, ShareholderStatus } from "@/modules/shareholders/model";
import type { PlanStatus } from "@/modules/investment-plans/model";
import type { DocumentCategory } from "@/modules/documents/model";
import type { PartnerApplicationStatus, AssessmentDimensions } from "@/modules/partner-applications/model";

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  companyName: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  googleMap: string;
  socialLinks: SocialLink[];
  googleAnalyticsId: string;
  metaPixelId: string;
  footer: string;
  /** Legal disclaimer / compliance text shown in the footer */
  footerLegal: string;
  /** Display name used in outgoing system emails */
  smtpFromName: string;
  /** From-address used in outgoing system emails */
  smtpFromEmail: string;
}

// ─── Page / SEO ───────────────────────────────────────────────────────────────

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface PageSection {
  id: string;
  type: string;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface PageData {
  slug: string;
  title: string;
  hero: Record<string, unknown>;
  sections: PageSection[];
  seo: PageSEO;
  updatedAt: Date;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: Date | null;
  seo: PageSEO;
  createdAt: Date;
  updatedAt: Date;
}

/** Lightweight shape for admin article list cards — no content or SEO fields. */
export interface AdminArticleItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: "draft" | "published";
  updatedAt: string;
}

// ─── Enquiry ──────────────────────────────────────────────────────────────────

export type EnquiryType =
  | "Contact"
  | "Investment Opportunity"
  | "Business Acquisition"
  | "Joint Venture"
  | "Strategic Partnership";

export interface Enquiry {
  type: EnquiryType;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  document: string;
  status: "new" | "read" | "archived";
  createdAt: Date;
}

/** Normalised enquiry shape for the admin list page. */
export interface AdminEnquiryItem {
  id: string;
  type: "contact" | "submission";
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  details: {
    phone: string;
    company: string;
    document: string;
    enquiryType: string;
  };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/** Single entry in the admin dashboard activity feed. */
export interface ActivityItem {
  id: string;
  type: "contact" | "submission";
  title: string;
  description: string;
  time: string;
}

/**
 * Shape returned by GET /api/admin/stats and dashboardService.getDashboardStats().
 * Must stay in sync with what admin/page.tsx expects.
 */
export interface DashboardStats {
  blogPosts: number;
  totalContacts: number;
  totalSubmissions: number;
  newEnquiries: number;
  totalShareholders: number;
  totalPlans: number;
  /** Số giao dịch vốn đang chờ xét duyệt */
  pendingCapitalTx: number;
  activities: ActivityItem[];
}

// ─── Media / Upload ───────────────────────────────────────────────────────────

export interface UploadRecord {
  publicId: string;
  secureUrl: string;
  folder: string;
  resourceType: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
}

// ─── API envelope ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ─── Admin user ───────────────────────────────────────────────────────────────

export interface AdminUser {
  name: string;
  email: string;
  role: "admin" | "superadmin";
  lastLogin: Date | null;
}

// ─── Shareholder ──────────────────────────────────────────────────────────────

// Re-exported here so consumers only need "@/types".
export type { ShareholderRole, ShareholderStatus } from "@/modules/shareholders/model";

export interface ShareholderUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: ShareholderRole;
  status: ShareholderStatus;
  equityPercent: number;
  capitalCommitted: number;
  capitalPaid: number;
  notes: string;
  avatarUrl: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Investment Plan ──────────────────────────────────────────────────────────

export type PlanTier = "seed" | "growth" | "expansion" | "strategic" | "anchor";
// Re-exported here so consumers only need "@/types".
export type { PlanStatus } from "@/modules/investment-plans/model";

export interface InvestmentPlanItem {
  _id: string;
  tier: PlanTier;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  minCommitment: number;
  maxCommitment: number;
  minimumEquity: number;
  currency: string;
  duration: string;
  durationEn: string;
  equityRange: string;
  equityRangeEn: string;
  benefits: string[];
  benefitsEn: string[];
  conditions: string[];
  conditionsEn: string[];
  rights: string[];
  obligations: string[];
  documents: string[];
  shareholderType: string;
  highlighted: boolean;
  badge: string;
  badgeEn: string;
  order: number;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Document ─────────────────────────────────────────────────────────────────

// Re-exported here so consumers only need "@/types".
export type { DocumentCategory } from "@/modules/documents/model";

export interface DocumentItem {
  _id: string;
  title: string;
  titleEn?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: "pdf" | "doc" | "xlsx" | "other";
  publishedDate: string;
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportType?: string;
  isFeatured: boolean;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

// ─── Partner Application ──────────────────────────────────────────────────────

// Re-exported here so consumers only need "@/types".
export type { PartnerApplicationStatus, AssessmentDimensions } from "@/modules/partner-applications/model";

export interface PartnerApplicationItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  linkedinUrl: string;
  quizAnswers: Record<string, string>;
  assessmentScore: AssessmentDimensions;
  suggestedRole: ShareholderRole;
  desiredRole: ShareholderRole;
  capitalRange: string;
  motivation: string;
  capabilities: string;
  investmentPlan: string;
  consentGiven: boolean;
  consentTimestamp: string;
  status: PartnerApplicationStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditLogItem {
  _id: string;
  actor: { id: string; name: string; email: string };
  action: string;
  target: { collection: string; id: string };
  delta: Record<string, unknown>;
  ip: string;
  userAgent: string;
  retainUntil: string;
  createdAt: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiRequest {
  query: string;
}

export interface ChatApiResponse {
  answer: string;
  source?: string;
}

// ─── SSE ─────────────────────────────────────────────────────────────────────

export interface SSEEvent<T = unknown> {
  event: string;
  data: T;
}
