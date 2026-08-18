/**
 * src/services/shareholder.service.ts
 *
 * Shareholder CRUD + KYC operations.
 * Route handlers import from here — keeps API routes thin.
 */

import { connectDB } from "@/core/database/db";
import Shareholder, {
  type IShareholder,
  type ShareholderRole,
  type ShareholderStatus,
} from "@/core/models/Shareholder";
import { NotFoundError } from "@/utils/errors";

// ─── Query types ──────────────────────────────────────────────────────────────

export interface ShareholderQuery {
  search?: string;
  role?: ShareholderRole;
  status?: ShareholderStatus;
  kycStatus?: IShareholder["kycStatus"];
  page?: number;
  limit?: number;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export async function list(query: ShareholderQuery = {}) {
  await connectDB();
  const { search, role, status, kycStatus, page = 1, limit = 20 } = query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (kycStatus) filter.kycStatus = kycStatus;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Shareholder.find(filter)
      .select("-password -nationalId -nationalIdRaw")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Shareholder.countDocuments(filter),
  ]);

  return { docs, total, page, limit };
}

// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getById(id: string) {
  await connectDB();
  const doc = await Shareholder.findById(id)
    .select("-password -nationalId -nationalIdRaw")
    .lean();
  if (!doc) throw new NotFoundError("Shareholder not found");
  return doc;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function create(data: Partial<IShareholder>) {
  await connectDB();
  const doc = await Shareholder.create(data);
  return doc.toObject();
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function update(id: string, data: Partial<IShareholder>) {
  await connectDB();
  const doc = await Shareholder.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
    .select("-password -nationalId -nationalIdRaw")
    .lean();
  if (!doc) throw new NotFoundError("Shareholder not found");
  return doc;
}

// ─── Remove ───────────────────────────────────────────────────────────────────

export async function remove(id: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndDelete(id).lean();
  if (!doc) throw new NotFoundError("Shareholder not found");
  return doc;
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export async function approveKyc(id: string, adminId: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndUpdate(
    id,
    {
      $set: {
        kycStatus: "approved",
        kycApprovedAt: new Date(),
        kycApprovedBy: adminId,
      },
    },
    { new: true }
  )
    .select("-password -nationalId -nationalIdRaw")
    .lean();
  if (!doc) throw new NotFoundError("Shareholder not found");
  return doc;
}

export async function rejectKyc(id: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndUpdate(
    id,
    { $set: { kycStatus: "rejected", kycApprovedAt: null } },
    { new: true }
  )
    .select("-password -nationalId -nationalIdRaw")
    .lean();
  if (!doc) throw new NotFoundError("Shareholder not found");
  return doc;
}

// ─── Named object export (compat with @/shared/services barrel) ─────────────────────

export const shareholderService = { list, getById, create, update, remove, approveKyc, rejectKyc };
