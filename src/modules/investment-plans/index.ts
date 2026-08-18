/**
 * src/modules/investment-plans/index.ts
 * Barrel export — import from "@/modules/investment-plans"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as InvestmentPlanModel } from "./model";
export type { IInvestmentPlan, PlanTier, PlanStatus } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export {
  getActivePlans,
  getPublicPlans,
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  reorderPlans,
  getPlanStats,
} from "./service";

// ── Schema ────────────────────────────────────────────────────────────────────
export { investmentPlanSchema } from "./schema";
export type { InvestmentPlanInput } from "./schema";

// ── Actions ───────────────────────────────────────────────────────────────────
export {
  createPlanAction,
  updatePlanAction,
  deletePlanAction,
  reorderPlansAction,
} from "./actions";
