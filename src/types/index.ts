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

/** Lightweight shape for admin article list cards — no content/seo */
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

/** Shaped enquiry for admin list page */
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

/** Activity feed item for the admin dashboard */
export interface ActivityItem {
  id: string;
  type: "contact" | "submission";
  title: string;
  description: string;
  time: string;
}

/**
 * Shape returned by /api/admin/stats and dashboardService.getDashboardStats()
 * — matches exactly what admin/page.tsx Stats interface expects.
 */
export interface DashboardStats {
  blogPosts: number;
  totalContacts: number;
  totalSubmissions: number;
  newEnquiries: number;
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

// ─── API wrapper ──────────────────────────────────────────────────────────────

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

export type ShareholderRole = "tech" | "financial" | "tech-company" | "individual" | "legal" | "foreign";
export type ShareholderStatus = "pending" | "active" | "suspended";

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
export type PlanStatus = "active" | "draft" | "closed";

export interface InvestmentPlanItem {
  _id: string;
  tier: PlanTier;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  minCommitment: number;
  maxCommitment: number;
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

export type DocumentCategory =
  | "financial_report"
  | "disclosure"
  | "charter"
  | "shareholder_meeting"
  | "annual_report"
  | "governance_report";

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
