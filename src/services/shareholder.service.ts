import { connectDB } from "@/lib/db";
import Shareholder, { IShareholder, ShareholderRole, ShareholderStatus } from "@/models/Shareholder";
import bcrypt from "bcryptjs";

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

function toSafe(doc: IShareholder) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (obj as any).password;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (obj as any).nationalId;   // KYC-sensitive — never expose
  return {
    ...obj,
    _id: String(obj._id),
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : null,
    lastLogin: obj.lastLogin ? new Date(obj.lastLogin).toISOString() : null,
    kycSubmittedAt: obj.kycSubmittedAt ? new Date(obj.kycSubmittedAt).toISOString() : null,
    kycApprovedAt:  obj.kycApprovedAt  ? new Date(obj.kycApprovedAt).toISOString()  : null,
    nationalIdIssuedDate: obj.nationalIdIssuedDate ? new Date(obj.nationalIdIssuedDate).toISOString() : null,
  };
}

export async function list(query: ShareholderQuery = {}) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (query.status)    filter.status    = query.status;
  if (query.role)      filter.role      = query.role;
  if (query.kycStatus) filter.kycStatus = query.kycStatus;
  if (query.search) {
    filter.$or = [
      { name:  { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const page  = Math.max(1, query.page  || 1);
  const limit = Math.min(200, Math.max(1, query.limit || 200));

  const [docs, total] = await Promise.all([
    Shareholder.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Shareholder.countDocuments(filter),
  ]);

  return {
    shareholders: docs.map((d) => {
      const safe = { ...d, _id: String(d._id) };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (safe as any).password;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (safe as any).nationalId;
      return safe;
    }),
    total,
    page,
    limit,
  };
}

export async function getById(id: string) {
  await connectDB();
  const doc = await Shareholder.findById(id).lean();
  if (!doc) throw new Error("Shareholder not found");
  const safe = { ...doc, _id: String(doc._id) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (safe as any).password;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (safe as any).nationalId;
  return safe;
}

export async function getByEmail(email: string) {
  await connectDB();
  const doc = await Shareholder.findOne({ email: email.toLowerCase() }).select("+password").lean();
  return doc || null;
}

export async function create(data: CreateShareholderDto) {
  await connectDB();
  const hashed = await bcrypt.hash(data.password || "gvi2026!", 12);
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
  void adminId; // for future audit trail integration
  return toSafe(doc);
}

export async function rejectKyc(id: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndUpdate(
    id,
    { $set: { kycStatus: "rejected", kycApprovedAt: null } },
    { new: true }
  );
  if (!doc) throw new Error("Shareholder not found");
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
