/**
 * src/hooks/index.ts
 * Barrel — re-exports all custom React hooks.
 *
 * Usage:
 *   import { usePageContent, useReducedMotion, useSmoothScroll } from "@/hooks";
 *   import { useDebounce } from "@/hooks";
 *   import { usePermission } from "@/hooks";
 */

export { usePageContent } from "./usePageContent";
export { useReducedMotion } from "./useReducedMotion";
export { useSmoothScroll } from "./useSmoothScroll";
export { useDebounce } from "./useDebounce";
export { usePermission } from "./usePermission";
export type { UsePermissionReturn } from "./usePermission";
