/**
 * src/modules/partner-applications/service.ts
 * PartnerApplication service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import PartnerApplication, {
  type IPartnerApplication,
  type PartnerApplicationStatus,
} from "@/modules/partner-applications/model";

export interface ListApplicationsQuery {
  status?: PartnerApplicationStatus;
  desiredRole?: string;
  /** Alias của desiredRole — từ query param ?role= */
  role?: string;
  /** Tìm kiếm theo fullName hoặc email */
  search?: string;
  page?: number;
  limit?: number;
}

export async function createApplication(
  data: Partial<IPartnerApplication>,
): Promise<IPartnerApplication> {
  await connectDB();
  return PartnerApplication.create(data);
}

export async function listApplications(q: ListApplicationsQuery = {}) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (q.status) filter.status = q.status;
  // Hỗ trợ cả desiredRole lẫn role (alias từ query param)
  const roleFilter = q.desiredRole ?? q.role;
  if (roleFilter) filter.desiredRole = roleFilter;
  if (q.search)
    filter.$or = [
      { fullName: { $regex: q.search, $options: "i" } },
      { email: { $regex: q.search, $options: "i" } },
    ];
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(200, Math.max(1, q.limit ?? 20));
  const [docs, total] = await Promise.all([
    PartnerApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    PartnerApplication.countDocuments(filter),
  ]);
  return { applications: docs, total, page, limit };
}

/** Nếu không truyền role thì trả về tất cả, grouped không lọc */
export async function listByRole(role?: string) {
  await connectDB();
  const filter = role ? { desiredRole: role } : {};
  return PartnerApplication.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getApplicationById(id: string) {
  await connectDB();
  return PartnerApplication.findById(id).lean();
}

export async function updateApplication(
  id: string,
  data: Partial<IPartnerApplication>,
  _updatedBy?: string,
) {
  await connectDB();
  return PartnerApplication.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  ).lean();
}

export async function deleteApplication(id: string) {
  await connectDB();
  await PartnerApplication.findByIdAndDelete(id);
  return true;
}

export async function compareApplicants(ids: string[]) {
  await connectDB();
  return PartnerApplication.find({ _id: { $in: ids } }).lean();
}

export async function getStats() {
  await connectDB();
  const statuses: PartnerApplicationStatus[] = [
    "submitted",
    "under_review",
    "shortlisted",
    "approved",
    "rejected",
  ];
  const counts = await Promise.all(
    statuses.map((s) => PartnerApplication.countDocuments({ status: s })),
  );
  const result: Record<string, number> = { total: 0 };
  statuses.forEach((s, i) => {
    result[s] = counts[i];
    result.total += counts[i];
  });
  return result;
}
