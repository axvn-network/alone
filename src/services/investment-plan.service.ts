import InvestmentPlan from "@/models/InvestmentPlan";
import type { IInvestmentPlan, PlanStatus } from "@/models/InvestmentPlan";
import { connectDB } from "@/lib/db";

// ─── Public ───────────────────────────────────────────────────────────────────

/** Lấy tất cả gói đang active, sắp xếp theo order */
export async function getActivePlans(): Promise<IInvestmentPlan[]> {
  await connectDB();
  return InvestmentPlan.find({ status: "active" }).sort({ order: 1 }).lean() as unknown as IInvestmentPlan[];
}

/** Alias dùng bởi public API endpoint */
export const getPublicPlans = getActivePlans;

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAllPlans(options?: { status?: PlanStatus }) {
  await connectDB();
  const query = options?.status ? { status: options.status } : {};
  return InvestmentPlan.find(query).sort({ order: 1 }).lean();
}

export async function getPlanById(id: string) {
  await connectDB();
  return InvestmentPlan.findById(id).lean();
}

export async function createPlan(data: Partial<IInvestmentPlan>) {
  await connectDB();
  const plan = await InvestmentPlan.create(data);
  return plan.toObject();
}

export async function updatePlan(id: string, data: Partial<IInvestmentPlan>) {
  await connectDB();
  return InvestmentPlan.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
}

export async function deletePlan(id: string) {
  await connectDB();
  return InvestmentPlan.findByIdAndDelete(id).lean();
}

/**
 * Reorder plans by providing ordered array of plan IDs.
 * Each plan's `order` field is set to its index in the array.
 */
export async function reorderPlans(orderedIds: string[]) {
  await connectDB();
  const ops = orderedIds.map((id, idx) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: idx + 1 } } },
  }));
  await InvestmentPlan.bulkWrite(ops);
  return getAllPlans();
}

/** Aggregate stats for the dashboard */
export async function getPlanStats() {
  await connectDB();
  const [total, active, draft, closed] = await Promise.all([
    InvestmentPlan.countDocuments(),
    InvestmentPlan.countDocuments({ status: "active" }),
    InvestmentPlan.countDocuments({ status: "draft" }),
    InvestmentPlan.countDocuments({ status: "closed" }),
  ]);
  return { total, active, draft, closed };
}
