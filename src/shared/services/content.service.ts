import Page from "@/core/models/Page";
import type { PageContentInput } from "@/validators";
import { connectDB } from "@/core/database/db";

const DEFAULT_PAGES = [
  "home", "about", "investment-focus", "our-approach",
  "partner-with-us", "contact", "privacy-policy",
  "terms-of-use", "investment-disclaimer",
];

function slugToTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getPage(slug: string) {
  await connectDB();
  let page = await Page.findOne({ slug }).lean();
  if (!page) {
    page = await Page.create({ slug, title: slugToTitle(slug) });
    page = page.toObject();
  }
  return page;
}

/** Public-safe version — returns only published page data */
export async function getPublicPage(slug: string) {
  await connectDB();
  const page = await Page.findOne({ slug }).lean();
  if (!page) return { slug, title: slugToTitle(slug) };
  return page;
}

export async function getAllPages() {
  await connectDB();
  const pages = await Page.find().sort({ slug: 1 }).lean();
  return DEFAULT_PAGES.map((slug) => {
    const existing = pages.find((p) => p.slug === slug);
    return existing || { slug, title: slugToTitle(slug) };
  });
}

export async function updatePage(slug: string, data: Partial<PageContentInput>) {
  await connectDB();

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined)   updateData.title    = data.title;
  if (data.content !== undefined) updateData.content  = data.content;
  if (data.hero)                  updateData.hero     = data.hero;
  if (data.sections)              updateData.sections = data.sections;
  if (data.seo)                   updateData.seo      = data.seo;
  if (data.data !== undefined)    updateData.data     = data.data;
  updateData.updatedAt = new Date();

  const page = await Page.findOneAndUpdate(
    { slug },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return page;
}

/**
 * Bulk upsert — useful when seeding or syncing multiple pages at once.
 */
export async function upsertMany(entries: { slug: string; data: Partial<PageContentInput> }[]) {
  await connectDB();
  const results = await Promise.all(entries.map(({ slug, data }) => updatePage(slug, data)));
  return results;
}
