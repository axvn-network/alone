import { connectDB } from "@/lib/db";
import Shareholder, { IShareholder, ShareholderRole, ShareholderStatus } from "@/models/Shareholder";
import { logAudit } from "@/services/audit.service";
import bcrypt from "bcryptjs";
import { paginate } from "@/utils/pagination";
import { buildSearchFilter } from "@/utils/search";

export interface ShareholderQuery {
  status?: ShareholderStatus;
  role?: ShareholderRole;
  search?: string;
  kycStatus?: IShareholder["kycStatus"];
  page?: number;
  limit?: number;
}

export interface CreateShareholderDto {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: ShareholderRole;
  status?: ShareholderStatus;
  equityPercent?: number;
  capitalCommitted?: number;
  capitalPaid?: number;
  notes?: string;
  avatarUrl?: string;
  // KYC fields
  kycStatus?: IShareholder["kycStatus"];
  nationalId?: string;
  nationalIdIssuedDate?: string | Date | null;
  nationalIdIssuedPlace?: string;
  permanentAddress?: string;
  sourceOfFunds?: string;
  isPEP?: boolean;
  isSanctioned?: boolean;
}

export interface UpdateShareholderDto extends Partial<Omit<CreateShareholderDto, "password">> {
  password?: string;
  kycStatus?: IShareholder["kycStatus"];
  kycSubmittedAt?: string | Date | null;
  kycApprovedAt?: string | Date | null;
}

function toDate(v: unknown): Date | null {
  if (!v) return null;
  return new Date(v as string | number | Date);
}

function toSafe(doc: IShareholder) {
  const raw = doc.toObject ? doc.toObject() : { ...doc };
  // Destructure out sensitive fields so they are never serialised.
  const { password: _pw, nationalId: _nid, ...obj } = raw as Record<string, unknown>;
  return {
    ...obj,
    _id: String(obj._id),
    createdAt: toDate(obj.createdAt)?.toISOString() ?? null,
    updatedAt: toDate(obj.updatedAt)?.toISOString() ?? null,
    lastLogin: toDate(obj.lastLogin)?.toISOString() ?? null,
    kycSubmittedAt: toDate(obj.kycSubmittedAt)?.toISOString() ?? null,
    kycApprovedAt:  toDate(obj.kycApprovedAt)?.toISOString()  ?? null,
    nationalIdIssuedDate: toDate(obj.nationalIdIssuedDate)?.toISOString() ?? null,
  };
}

export async function list(query: ShareholderQuery = {}) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {
    ...(query.status    ? { status:    query.status }    : {}),
    ...(query.role      ? { role:      query.role }      : {}),
    ...(query.kycStatus ? { kycStatus: query.kycStatus } : {}),
    ...buildSearchFilter(query.search, ["name", "email"]),
  };

  const { page, limit, skip } = paginate(query, { limit: 200, maxLimit: 200 });

  const [docs, total] = await Promise.all([
    Shareholder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Shareholder.countDocuments(filter),
  ]);

  return {
    shareholders: docs.map(toSafe),
    total,
    page,
    limit,
  };
}

export async function getById(id: string) {
  await connectDB();
  const doc = await Shareholder.findById(id);
  if (!doc) throw new Error("Shareholder not found");
  return toSafe(doc);
}

export async function getByEmail(email: string) {
  await connectDB();
  const doc = await Shareholder.findOne({ email: email.toLowerCase() }).select("+password").lean();
  return doc || null;
}

export async function create(data: CreateShareholderDto) {
  await connectDB();
  if (!data.password) throw new Error("Mật khẩu cổ đông là bắt buộc khi tạo tài khoản mới");
  const hashed = await bcrypt.hash(data.password, 12);
  const doc = await Shareholder.create({
    ...data,
    password: hashed,
    status:           data.status           || "pending",
    equityPercent:    data.equityPercent    ?? 0,
    capitalCommitted: data.capitalCommitted ?? 0,
    capitalPaid:      data.capitalPaid      ?? 0,
    kycStatus:        data.kycStatus        || "not_started",
    isPEP:            data.isPEP            ?? false,
    isSanctioned:     data.isSanctioned     ?? false,
  });
  return toSafe(doc);
}

export async function update(id: string, data: UpdateShareholderDto) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields: Record<string, any> = { ...data };
  if (data.password) {
    updateFields.password = await bcrypt.hash(data.password, 12);
  } else {
    delete updateFields.password;
  }
  const doc = await Shareholder.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
  if (!doc) throw new Error("Shareholder not found");
  return toSafe(doc);
}

export async function remove(id: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndDelete(id);
  if (!doc) throw new Error("Shareholder not found");
  return true;
}

export async function updateLastLogin(id: string) {
  await connectDB();
  await Shareholder.findByIdAndUpdate(id, { lastLogin: new Date() });
}

export async function approveKyc(id: string, adminId: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndUpdate(
    id,
    { $set: { kycStatus: "approved", kycApprovedAt: new Date() } },
    { new: true }
  );
  if (!doc) throw new Error("Shareholder not found");
  await logAudit({
    actor: { id: adminId },
    action: "shareholder.kyc.approve",
    collection: "shareholders",
    id,
    delta: { kycStatus: "approved" },
  });
  return toSafe(doc);
}

export async function rejectKyc(id: string, adminId?: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndUpdate(
    id,
    { $set: { kycStatus: "rejected", kycApprovedAt: null } },
    { new: true }
  );
  if (!doc) throw new Error("Shareholder not found");
  if (adminId) {
    await logAudit({
      actor: { id: adminId },
      action: "shareholder.kyc.reject",
      collection: "shareholders",
      id,
      delta: { kycStatus: "rejected" },
    });
  }
  return toSafe(doc);
}

export async function getStats() {
  await connectDB();
  const [total, active, pending, suspended, kycApproved, kycPending] = await Promise.all([
    Shareholder.countDocuments(),
    Shareholder.countDocuments({ status: "active" }),
    Shareholder.countDocuments({ status: "pending" }),
    Shareholder.countDocuments({ status: "suspended" }),
    Shareholder.countDocuments({ kycStatus: "approved" }),
    Shareholder.countDocuments({ kycStatus: "pending" }),
  ]);
  return { total, active, pending, suspended, kycApproved, kycPending };
}
