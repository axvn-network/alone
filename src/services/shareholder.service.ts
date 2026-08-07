import { connectDB } from "@/lib/db";
import Shareholder, { IShareholder, ShareholderRole, ShareholderStatus } from "@/models/Shareholder";
import bcrypt from "bcryptjs";

export interface ShareholderQuery {
  status?: ShareholderStatus;
  role?: ShareholderRole;
  search?: string;
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
}

export interface UpdateShareholderDto extends Partial<Omit<CreateShareholderDto, "password">> {
  password?: string;
}

function toSafe(doc: IShareholder) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (obj as any).password;
  return {
    ...obj,
    _id: String(obj._id),
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : null,
    lastLogin: obj.lastLogin ? new Date(obj.lastLogin).toISOString() : null,
  };
}

export async function list(query: ShareholderQuery = {}) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (query.status) filter.status = query.status;
  if (query.role) filter.role = query.role;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  const docs = await Shareholder.find(filter).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: String(d._id), password: undefined }));
}

export async function getById(id: string) {
  await connectDB();
  const doc = await Shareholder.findById(id).lean();
  if (!doc) throw new Error("Shareholder not found");
  const safe = { ...doc, _id: String(doc._id) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (safe as any).password;
  return safe;
}

export async function create(data: CreateShareholderDto) {
  await connectDB();
  const hashed = await bcrypt.hash(data.password || "fortress2026!", 12);
  const doc = await Shareholder.create({
    ...data,
    password: hashed,
    status: data.status || "pending",
    equityPercent: data.equityPercent ?? 0,
    capitalCommitted: data.capitalCommitted ?? 0,
    capitalPaid: data.capitalPaid ?? 0,
  });
  return toSafe(doc);
}

export async function update(id: string, data: UpdateShareholderDto) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = { ...data };
  if (data.password) {
    update.password = await bcrypt.hash(data.password, 12);
  } else {
    delete update.password;
  }
  const doc = await Shareholder.findByIdAndUpdate(id, update, { new: true });
  if (!doc) throw new Error("Shareholder not found");
  return toSafe(doc);
}

export async function remove(id: string) {
  await connectDB();
  const doc = await Shareholder.findByIdAndDelete(id);
  if (!doc) throw new Error("Shareholder not found");
  return true;
}

export async function getStats() {
  await connectDB();
  const [total, active, pending, suspended] = await Promise.all([
    Shareholder.countDocuments(),
    Shareholder.countDocuments({ status: "active" }),
    Shareholder.countDocuments({ status: "pending" }),
    Shareholder.countDocuments({ status: "suspended" }),
  ]);
  return { total, active, pending, suspended };
}
