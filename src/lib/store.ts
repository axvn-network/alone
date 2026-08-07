/**
 * store.ts — flat-file JSON store (fallback khi MongoDB không có)
 * Chỉ dùng cho: Pages, Articles, Settings
 * Enquiries/contacts đều đi qua MongoDB (enquiry.service.ts)
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read<T>(name: string, fallback: T): T {
  ensureDataDir();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return fallback;
  }
}

function write<T>(name: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

/* ─── Page Content ─────────────────────────────────────────────────────────── */

export interface PageData {
  slug: string;
  title: string;
  content: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

const defaultPages: PageData[] = [
  "home", "about", "investment-focus", "our-approach",
  "invest-with-fortress", "contact", "privacy-policy",
  "terms-of-use", "investment-disclaimer",
].map((slug) => ({
  slug,
  title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  content: "",
  data: {},
  updatedAt: new Date().toISOString(),
}));

export function getPages(): PageData[] {
  const pages = read<PageData[]>("pages", defaultPages);
  return pages.length === 0 ? defaultPages : pages;
}

export function getPage(slug: string): PageData | undefined {
  return getPages().find((p) => p.slug === slug);
}

export function savePage(slug: string, data: { title?: string; content?: string; data?: Record<string, unknown> }) {
  const pages = getPages();
  const idx = pages.findIndex((p) => p.slug === slug);
  const existing = pages[idx] ?? { slug, title: slug, content: "", data: {} };
  const updated: PageData = {
    ...existing,
    ...data,
    slug,
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) pages[idx] = updated;
  else pages.push(updated);
  write("pages", pages);
}

/* ─── Blog Articles ─────────────────────────────────────────────────────────── */

export interface ArticleData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featuredImage: string;
  status: "draft" | "published";
  seo: { title: string; description: string };
  createdAt: string;
  updatedAt: string;
}

export function getArticles(): ArticleData[] {
  return read<ArticleData[]>("articles", []);
}

export function getArticle(slug: string): ArticleData | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function saveArticle(slug: string, data: Omit<ArticleData, "slug" | "createdAt" | "updatedAt">) {
  const articles = getArticles();
  const idx = articles.findIndex((a) => a.slug === slug);
  const now = new Date().toISOString();
  const updated: ArticleData = {
    ...data,
    slug,
    createdAt: idx >= 0 ? articles[idx].createdAt : now,
    updatedAt: now,
  };
  if (idx >= 0) articles[idx] = updated;
  else articles.unshift(updated);
  write("articles", articles);
}

export function deleteArticle(slug: string) {
  write("articles", getArticles().filter((a) => a.slug !== slug));
}

/* ─── Site Settings ─────────────────────────────────────────────────────────── */

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  companyName: string;
  phoneNumber: string;
  emailAddress: string;
  officeAddress: string;
  googleMapsEmbed: string;
  whatsappNumber: string;
  socialLinks: SocialLink[];
  footerContent: string;
  logo: string;
  favicon: string;
}

const defaultSettings: SiteSettings = {
  companyName: "Fortress Investment Holdings",
  phoneNumber: "+971 4 XXX XXXX",
  emailAddress: "info@fortressih.com",
  officeAddress: "Dubai, United Arab Emirates",
  googleMapsEmbed: "",
  whatsappNumber: "971500000000",
  socialLinks: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/135716850" },
    { platform: "Instagram", url: "https://www.instagram.com/fortressihdubai/" },
    { platform: "Facebook", url: "https://www.facebook.com/profile.php?id=61591930895552" },
    { platform: "X (Twitter)", url: "https://x.com/Fortressih" },
    { platform: "Threads", url: "https://www.threads.com/@fortressihdubai" },
    { platform: "YouTube", url: "https://www.youtube.com/@FortressIH" },
  ],
  footerContent: "",
  logo: "/large-logo.png",
  favicon: "",
};

export function getSettings(): SiteSettings {
  return read<SiteSettings>("settings", defaultSettings);
}

export function saveSettings(data: SiteSettings) {
  write("settings", data);
}
