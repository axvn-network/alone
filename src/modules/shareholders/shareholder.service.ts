/**
 * src/modules/shareholders/shareholder.service.ts
 * Canonical Shareholder CRUD service.
 */
import { connectDB } from "@/core/database";
import Shareholder, {
  type IShareholder,
  type ShareholderRole,
  type ShareholderStatus,
} from "./model";

export interface ShareholderQuery {
  search?: string;
  role?: ShareholderRole;
  status?: ShareholderStatus;
  kycStatus?: IShareholder["kycStatus"];
  page?: number;
  limit?: number;
}

export async function list(q: ShareholderQuery = {}) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (q.role) filter.role = q.role;
  if (q.status) filter.status = q.status;
  if (q.kycStatus) filter.kycStatus = q.kycStatus;
  if (q.search) {
    const re = new RegExp(q.search, "i");
    filter.$or = [{ name: re }, { email: re }];
  }
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(200, Math.max(1, q.limit ?? 20));
  const [docs, total] = await Promise.all([
    Shareholder.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Shareholder.countDocuments(filter),
  ]);
  return { shareholders: docs, total, page, limit };
}

export async function getById(id: string) {
  await connectDB();
  return Shareholder.findById(id).select("-password").lean();
}

export async function create(
  data: Partial<IShareholder> & {
    email: string;
    password?: string;
    role: ShareholderRole;
  },
) {
  await connectDB();
  return Shareholder.create(data);
}

export async function update(id: string, data: Partial<IShareholder>) {
  await connectDB();
  return Shareholder.findByIdAndUpdate(id, { $set: data }, { new: true })
    .select("-password")
    .lean();
}

export async function remove(id: string) {
  await connectDB();
  await Shareholder.findByIdAndDelete(id);
  return true;
}

export async function approveKyc(id: string, _approvedBy?: string) {
  await connectDB();
  return Shareholder.findByIdAndUpdate(
    id,
    { $set: { kycStatus: "approved", kycNote: "" } },
    { new: true },
  )
    .select("-password")
    .lean();
}

export async function rejectKyc(id: string, note = "") {
  await connectDB();
  return Shareholder.findByIdAndUpdate(
    id,
    { $set: { kycStatus: "rejected", kycNote: note } },
    { new: true },
  )
    .select("-password")
    .lean();
}

export const shareholderService = {
  list,
  getById,
  create,
  update,
  remove,
  approveKyc,
  rejectKyc,
};
