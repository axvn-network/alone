import type { MetadataRoute } from "next";
import * as blogService from "@/modules/blog";

const BASE = "https://langding.tc-gaming.live";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE}/`, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE}/content/about`, changeFrequency: "monthly", priority: 0.8 },
  {
    url: `${BASE}/content/our-approach`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE}/content/investment-focus`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE}/content/strategy`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { url: `${BASE}/content/insights`, changeFrequency: "weekly", priority: 0.9 },
  {
    url: `${BASE}/content/documents`,
    changeFrequency: "weekly",
    priority: 0.6,
  },
  { url: `${BASE}/content/contact`, changeFrequency: "monthly", priority: 0.7 },
  {
    url: `${BASE}/portals/invest-with-axvn`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE}/content/privacy-policy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE}/content/terms-of-use`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Append published blog posts dynamically
  try {
    const { posts } = await blogService.getBlogs({
      status: "published",
      limit: 200,
    });
    const blogEntries: MetadataRoute.Sitemap = (
      posts as { slug: string; updatedAt?: string }[]
    ).map((p) => ({
      url: `${BASE}/content/insights/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    return [...STATIC_ROUTES, ...blogEntries];
  } catch {
    return STATIC_ROUTES;
  }
}
