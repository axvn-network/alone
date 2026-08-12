/**
 * actions/index.ts — barrel for server actions
 * Import individual actions from this barrel or directly from the action file.
 *   e.g. import { signOut, getSession } from "@/actions"
 *        import { createBlogAction } from "@/actions"
 */

// ─── Auth actions ─────────────────────────────────────────────────────────────
export { signIn, signOut, getSession } from "./auth.actions";

// ─── Blog actions ─────────────────────────────────────────────────────────────
export { createBlogAction, updateBlogAction, deleteBlogAction, publishBlogAction } from "./blog.actions";
