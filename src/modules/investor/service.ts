/**
 * src/modules/investor/service.ts
 * Business logic — Investor
 */

import { connectDB } from "@/core/database";
import { paginate } from "@/utils/pagination";
import Investor from "./model";
import type { InvestorQuery, InvestorListResult } from "./types";
import type { CreateInvestorInput, UpdateInvestorInput } from "./schema";

export async function list(
  query: InvestorQuery = {},
): Promise<InvestorListResult> {
  await connectDB();
  const { page, limit, skip } = paginate(query, { limit: 20, maxLimit: 100 });
  const [docs, total] = await Promise.all([
    Investor.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Investor.countDocuments(),
  ]);
  return {
    docs: docs as unknown as InvestorListResult["docs"],
    total,
    page,
    limit,
  };
}

export async function create(data: CreateInvestorInput) {
  await connectDB();
  return Investor.create(data);
}

export async function update(id: string, data: UpdateInvestorInput) {
  await connectDB();
  return Investor.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id: string) {
  await connectDB();
  return Investor.findByIdAndDelete(id);
}
