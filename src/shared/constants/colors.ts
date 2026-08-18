/**
 * src/constants/colors.ts
 * 
 * Single source of truth for the AXVN Tech Holding brand color palette.
 * Use these variables in Tailwind CSS configurations and TypeScript files.
 */

export const BRAND_COLORS = {
  navy: "#03080e",
  deep: "#0a121d",
  charcoal: "#161e2a",
  gold: "#d4af37",
  champagne: "#f7e7ce",
  ivory: "#fffff0",
  silver: "#c0c0c0",
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;
