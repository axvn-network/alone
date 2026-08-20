/**
 * src/constants/blog.ts
 *
 * Single source of truth for blog article categories.
 * Used in both blog/page.tsx (list + badge colors) and blog/[slug]/page.tsx
 * (category selector).  Change here to update both simultaneously.
 */

export const ARTICLE_CATEGORIES = [
  "Real Estate",
  "Business Acquisitions",
  "Private Equity",
  "AI & Technology",
  "Digital Assets & Blockchain",
  "Hospitality",
  "Trading & Distribution",
  "Market Insights",
  "Company News",
  "Strategic Investment Management",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const CAT_COLORS: Record<string, string> = {
  "Real Estate": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Business Acquisitions": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Private Equity": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "AI & Technology": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Digital Assets & Blockchain":
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Hospitality: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Trading & Distribution": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Market Insights": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Company News": "bg-red-500/10 text-red-400 border-red-500/20",
  "Strategic Investment Management":
    "bg-teal-500/10 text-teal-400 border-teal-500/20",
};
