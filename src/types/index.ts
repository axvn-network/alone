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
