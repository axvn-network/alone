/**
 * src/modules/dashboard/index.ts
 * Barrel export — import from "@/modules/dashboard"
 *
 * No dedicated model — aggregates across models.
 * Service lives at: @/shared/services/dashboard.service.ts
 */

export { getDashboardStats } from "@/shared/services/dashboard.service";
export type { DashboardStatsResult } from "@/shared/services/dashboard.service";
