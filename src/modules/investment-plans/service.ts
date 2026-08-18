/**
 * src/modules/investment-plans/service.ts
 * InvestmentPlan service — re-export shim from canonical service file.
 */

export {
  getActivePlans, getPublicPlans, getAllPlans,
  getPlanById, createPlan, updatePlan,
  deletePlan, reorderPlans, getPlanStats,
} from "@/shared/services/investment-plan.service";
