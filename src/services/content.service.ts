import Page from "@/models/Page";
import type { PageContentInput } from "@/validators";
import { connectDB } from "@/lib/db";

const DEFAULT_PAGES = [
  "home", "about", "investment-focus", "our-approach",
  "partner-with-us", "contact", "privacy-policy",
  "terms-of-use", "investment-disclaimer",
];

export async function getPage(slug: string) {
  await connectDB();
  let page = await Page.findOne({ slug }).lean();
  if (!page) {
    page = await Page.create({ slug, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) });
    page = page.toObject();
  }
  return page;
}

export async function getAllPages() {
  await connectDB();
  const pages = await Page.find().sort({ slug: 1 }).lean();
  return DEFAULT_PAGES.map((slug) => {
    const existing = pages.find((p) => p.slug === slug);
    return existing || { slug, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
  });
}

export async function updatePage(slug: string, data: Partial<PageContentInput>) {
  await connectDB();

  const updateData: Record<string, unknown> = {};
  if (data.title) updateData.title = data.title;
  if (data.hero) updateData.hero = data.hero;
  if (data.sections) updateData.sections = data.sections;
  if (data.seo) updateData.seo = data.seo;
  updateData.updatedAt = new Date();

  const page = await Page.findOneAndUpdate(
    { slug },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return page;
}
