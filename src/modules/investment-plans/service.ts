/**
 * src/modules/investment-plans/service.ts
 * InvestmentPlan service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import InvestmentPlan, {
  type IInvestmentPlan,
  type PlanStatus,
} from "@/modules/investment-plans/model";

export async function getAllPlans(
  statusOrOpts?: PlanStatus | { status?: PlanStatus | string },
) {
  await connectDB();
  const status =
    typeof statusOrOpts === "string" ? statusOrOpts : statusOrOpts?.status;
  const filter = status ? { status } : {};
  return InvestmentPlan.find(filter).sort({ order: 1 }).lean();
}

export async function getActivePlans() {
  return getAllPlans("active");
}

export async function getPublicPlans() {
  await connectDB();
  return InvestmentPlan.find({ status: "active" }).sort({ order: 1 }).lean();
}

export async function getPlanById(id: string) {
  await connectDB();
  return InvestmentPlan.findById(id).lean();
}

export async function createPlan(data: Partial<IInvestmentPlan>) {
  await connectDB();
  return InvestmentPlan.create(data);
}

export async function updatePlan(id: string, data: Partial<IInvestmentPlan>) {
  await connectDB();
  return InvestmentPlan.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  ).lean();
}

export async function deletePlan(id: string) {
  await connectDB();
  await InvestmentPlan.findByIdAndDelete(id);
  return true;
}

export async function reorderPlans(orderedIds: string[]) {
  await connectDB();
  await Promise.all(
    orderedIds.map((id, index) =>
      InvestmentPlan.findByIdAndUpdate(id, { $set: { order: index } }),
    ),
  );
  return true;
}

export async function getPlanStats() {
  await connectDB();
  const [total, active, draft] = await Promise.all([
    InvestmentPlan.countDocuments(),
    InvestmentPlan.countDocuments({ status: "active" }),
    InvestmentPlan.countDocuments({ status: "draft" }),
  ]);
  return { total, active, draft };
}
