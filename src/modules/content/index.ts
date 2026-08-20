/**
 * src/modules/content/index.ts
 * Barrel export — import from "@/modules/content"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as Page } from "./model";
export type { IPage, IPageSection, IPageSEO } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export {
  getPage,
  getPublicPage,
  getAllPages,
  updatePage,
  upsertMany,
} from "./service";

// ── Schema ────────────────────────────────────────────────────────────────────
export { pageContentSchema, seoSchema } from "./schema";
export type { PageContentInput, SEOInput } from "./schema";

// ── Actions ───────────────────────────────────────────────────────────────────
export { updatePageAction } from "./actions";
