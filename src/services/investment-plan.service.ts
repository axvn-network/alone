import InvestmentPlan from "@/models/InvestmentPlan";
import type { IInvestmentPlan, PlanStatus } from "@/models/InvestmentPlan";
import { connectDB } from "@/lib/db";

// ─── Public ───────────────────────────────────────────────────────────────────

/** Lấy tất cả gói đang active, sắp xếp theo order */
export async function getActivePlans(): Promise<IInvestmentPlan[]> {
  await connectDB();
  return InvestmentPlan.find({ status: "active" }).sort({ order: 1 }).lean() as unknown as IInvestmentPlan[];
}

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
