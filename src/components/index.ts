/**
 * src/components/index.ts
 * Root barrel — re-exports every component group.
 * Import directly from the subdir for clarity, e.g.:
 *   import PageHero from "@/app/(site)/components/public/PageHero"
 *   import AdminSidebar from "@/components/admin/AdminSidebar"
 */

// ── Layout (nav, footer, providers) ─────────────────────────────────────────
export * from "./layout";

// ── Admin UI ─────────────────────────────────────────────────────────────────
export * from "./admin";

// ── Visual/data components ────────────────────────────────────────────────────
export * from "./visual";
