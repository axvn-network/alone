/**
 * src/modules/blog/index.ts
 * Barrel export — import from "@/modules/blog"
 */

export * from "./service";
export { default as BlogModel } from "./model";
export type { IBlog, IBlogSEO } from "./model";
export { blogSchema } from "./schema";
export type { BlogInput } from "./schema";
