import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
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

/* ─── Contact Enquiries ─── */

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function getContacts(): ContactEnquiry[] {
  return read<ContactEnquiry[]>("contacts", []);
}

export function addContact(data: Omit<ContactEnquiry, "id" | "read" | "createdAt">) {
  const contacts = getContacts();
  contacts.unshift({
    ...data,
    id: `c_${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  });
  write("contacts", contacts);
}

/* ─── Partner Submissions ─── */

export interface PartnerSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  opportunityType: string;
  investmentRange: string;
  message: string;
  fileName: string;
  read: boolean;
  createdAt: string;
}

export function getSubmissions(): PartnerSubmission[] {
  return read<PartnerSubmission[]>("submissions", []);
}

export function addSubmission(data: Omit<PartnerSubmission, "id" | "read" | "createdAt">) {
  const submissions = getSubmissions();
  submissions.unshift({
    ...data,
    id: `s_${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  });
  write("submissions", submissions);
}

/* ─── Page Content ─── */

export interface PageData {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

const defaultPages: PageData[] = [
  { slug: "home", title: "Home", content: "<h2>Welcome to Fortress Investment Holdings</h2><p>Built on Strength. Driven by Vision.</p>", updatedAt: new Date().toISOString() },
  { slug: "about", title: "About Us", content: "<h2>About Fortress Investment Holdings</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "investment-focus", title: "Investment Focus", content: "<h2>Our Investment Focus</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "our-approach", title: "Our Approach", content: "<h2>Our Approach</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "partner-with-us", title: "Partner With Us", content: "<h2>Partner With Us</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "contact", title: "Contact Us", content: "<h2>Contact Us</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "privacy-policy", title: "Privacy Policy", content: "<h2>Privacy Policy</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "terms-of-use", title: "Terms of Use", content: "<h2>Terms of Use</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
  { slug: "investment-disclaimer", title: "Investment Disclaimer", content: "<h2>Investment Disclaimer</h2><p>Content pending...</p>", updatedAt: new Date().toISOString() },
];

export function getPages(): PageData[] {
  const pages = read<PageData[]>("pages", defaultPages);
  if (pages.length === 0) {
    write("pages", defaultPages);
    return defaultPages;
  }
  return pages;
}

export function getPage(slug: string): PageData | undefined {
  return getPages().find((p) => p.slug === slug);
}

export function savePage(slug: string, data: { title: string; content: string }) {
  const pages = getPages();
  const idx = pages.findIndex((p) => p.slug === slug);
  const updated: PageData = { slug, title: data.title, content: data.content, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    pages[idx] = updated;
  } else {
    pages.push(updated);
  }
  write("pages", pages);
}

/* ─── Blog Articles ─── */

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
  const updated: ArticleData = { ...data, slug, createdAt: idx >= 0 ? articles[idx].createdAt : now, updatedAt: now };
  if (idx >= 0) {
    articles[idx] = updated;
  } else {
    articles.unshift(updated);
  }
  write("articles", articles);
}

export function deleteArticle(slug: string) {
  const articles = getArticles().filter((a) => a.slug !== slug);
  write("articles", articles);
}

/* ─── Enquiries helpers ─── */

export function markEnquiryRead(id: string) {
  const contacts = getContacts();
  const cIdx = contacts.findIndex((c) => c.id === id);
  if (cIdx >= 0) {
    contacts[cIdx].read = true;
    write("contacts", contacts);
    return true;
  }
  const submissions = getSubmissions();
  const sIdx = submissions.findIndex((s) => s.id === id);
  if (sIdx >= 0) {
    submissions[sIdx].read = true;
    write("submissions", submissions);
    return true;
  }
  return false;
}

export function deleteEnquiry(id: string) {
  const contacts = getContacts().filter((c) => c.id !== id);
  write("contacts", contacts);
  const submissions = getSubmissions().filter((s) => s.id !== id);
  write("submissions", submissions);
}

/* ─── Site Settings ─── */

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
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.643879742878!2d55.2708!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d348d56a8df%3A0x2e84e1b4b4b4b4b4!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1234567890",
  whatsappNumber: "971500000000",
  socialLinks: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/135716850/admin/dashboard/?editPageActiveTab=info" },
    { platform: "Instagram", url: "https://www.instagram.com/fortressihdubai/" },
    { platform: "Facebook", url: "https://www.facebook.com/profile.php?id=61591930895552" },
    { platform: "X (Twitter)", url: "https://x.com/Fortressih" },
    { platform: "Threads", url: "https://www.threads.com/@fortressihdubai" },
  ],
  footerContent: "A Dubai-based diversified investment holding company focused on identifying, acquiring, and growing high-potential opportunities across real estate, private equity, technology, digital assets, energy, commodities, and hospitality.",
  logo: "/large-logo.png",
  favicon: "",
};

export function getSettings(): SiteSettings {
  return read<SiteSettings>("settings", defaultSettings);
}

export function saveSettings(data: SiteSettings) {
  write("settings", data);
}
