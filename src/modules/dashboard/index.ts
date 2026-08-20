/**
 * src/modules/dashboard/index.ts
 * Barrel export — import from "@/modules/dashboard"
 *
 * No dedicated model — aggregates across models.
 * Service lives at: @/modules/dashboard/service.ts
 */

export { getDashboardStats } from "./service";
export type { DashboardStatsResult } from "./service";
