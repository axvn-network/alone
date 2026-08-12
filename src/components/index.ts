/**
 * src/components/index.ts
 * Root barrel — re-exports every component group.
 * Import directly from the subdir for clarity, e.g.:
 *   import PageHero from "@/components/public/PageHero"
 *   import AdminSidebar from "@/components/admin/AdminSidebar"
 */

// ── Layout (nav, footer, providers) ─────────────────────────────────────────
export * from "./layout";

// ── Admin UI ─────────────────────────────────────────────────────────────────
export * from "./admin";

// ── Public page components ───────────────────────────────────────────────────
export * from "./public";

// ── Shared editor components ─────────────────────────────────────────────────
export * from "./shared";

// ── Animation primitives ─────────────────────────────────────────────────────
export * from "./animations";

// ── UI primitives ─────────────────────────────────────────────────────────────
export { Button, Heading, Section, SectionTag } from "./ui/Primitives";
export type { SectionProps } from "./ui/Primitives";
export { default as Accordion, AccordionRoot, AccordionItem } from "./ui/Accordion";

// ── Visual/data components ────────────────────────────────────────────────────
export * from "./visual";
