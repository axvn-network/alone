/**
 * src/modules/content/service.ts
 * Page/CMS content service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import Page, { type IPage } from "./model";

export async function getPage(slug: string) {
  await connectDB();
  return Page.findOne({ slug }).lean();
}

export async function getPublicPage(slug: string) {
  await connectDB();
  return Page.findOne({ slug }).lean();
}

export async function getAllPages() {
  await connectDB();
  return Page.find({}).sort({ updatedAt: -1 }).lean();
}

export async function updatePage(slug: string, data: Partial<IPage>) {
  await connectDB();
  return Page.findOneAndUpdate(
    { slug },
    { $set: data },
    { new: true, upsert: false },
  ).lean();
}

export async function upsertMany(
  pages: Array<{ slug: string } & Partial<IPage>>,
) {
  await connectDB();
  await Promise.all(
    pages.map((p) =>
      Page.findOneAndUpdate(
        { slug: p.slug },
        { $set: p },
        { upsert: true, new: true },
      ),
    ),
  );
  return true;
}
