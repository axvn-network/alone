/**
 * src/services/partnerApplication.service.ts
 *
 * CRUD + nhóm theo vai trò + so sánh ứng viên.
 */

import { connectDB } from "@/core/database/db";
import PartnerApplication, {
  IPartnerApplication,
  PartnerApplicationStatus,
} from "@/core/models/PartnerApplication";
import type { ShareholderRole } from "@/core/models/Shareholder";
import type { PartnerApplicationInput, PartnerApplicationUpdateInput } from "@/validators";
import { NotFoundError } from "@/utils/errors";
import { paginate } from "@/utils/pagination";
import { buildSearchFilter } from "@/utils/search";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSafe(doc: IPartnerApplication | Record<string, unknown>) {
  const obj = typeof (doc as IPartnerApplication).toObject === "function"
    ? (doc as IPartnerApplication).toObject()
    : { ...(doc as Record<string, unknown>) };
  return obj;
}

// ─── Public — Nộp đơn ────────────────────────────────────────────────────────

export async function createApplication(
  data: PartnerApplicationInput
): Promise<ReturnType<typeof toSafe>> {
  await connectDB();
  const doc = await PartnerApplication.create({
    ...data,
    status: "submitted",
  });
  return toSafe(doc);
}

// ─── Admin — Danh sách ───────────────────────────────────────────────────────

export interface ListApplicationsQuery {
  role?:    ShareholderRole;
  status?:  PartnerApplicationStatus;
  search?:  string;
  page?:    number;
  limit?:   number;
}

export async function listApplications(query: ListApplicationsQuery = {}) {
  await connectDB();
  const filter: Record<string, unknown> = {
    ...(query.role   ? { desiredRole: query.role }   : {}),
    ...(query.status ? { status:      query.status } : {}),
    ...buildSearchFilter(query.search, ["fullName", "email", "company"]),
  };

  const { page, limit, skip } = paginate(query, { limit: 20, maxLimit: 100 });

  const [docs, total] = await Promise.all([
    PartnerApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PartnerApplication.countDocuments(filter),
  ]);

  return { docs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Admin — Nhóm theo vai trò (dashboard compare view) ──────────────────────

export async function listByRole(): Promise<
  Record<ShareholderRole, IPartnerApplication[]>
> {
  await connectDB();

  const docs = await PartnerApplication.find({
    status: { $in: ["submitted", "under_review", "shortlisted"] },
  })
    .sort({ createdAt: -1 })
    .lean() as unknown as IPartnerApplication[];

  const groups: Record<string, IPartnerApplication[]> = {};
  const allRoles: ShareholderRole[] = [
    "tech", "financial", "tech-company", "individual", "legal", "foreign",
  ];
  for (const r of allRoles) groups[r] = [];

  for (const doc of docs) {
    const r = doc.desiredRole;
    if (groups[r]) groups[r].push(doc);
  }

  return groups as Record<ShareholderRole, IPartnerApplication[]>;
}

// ─── Admin — Xem chi tiết ─────────────────────────────────────────────────────

export async function getApplicationById(id: string) {
  await connectDB();
  const doc = await PartnerApplication.findById(id).lean();
  if (!doc) throw new NotFoundError("Đơn đăng ký không tồn tại");
  return doc;
}

// ─── Admin — Cập nhật (status + adminNotes + desiredRole) ────────────────────

export async function updateApplication(
  id: string,
  data: PartnerApplicationUpdateInput,
  reviewerId?: string
) {
  await connectDB();
  const patch: Record<string, unknown> = { ...data };
  if (data.status && data.status !== "submitted" && data.status !== "draft") {
    patch.reviewedBy = reviewerId ?? "";
    patch.reviewedAt = new Date();
  }
  const doc = await PartnerApplication.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true }
  ).lean();
  if (!doc) throw new NotFoundError("Đơn đăng ký không tồn tại");
  return doc;
}

// ─── Admin — Xóa ──────────────────────────────────────────────────────────────

export async function deleteApplication(id: string) {
  await connectDB();
  const doc = await PartnerApplication.findByIdAndDelete(id).lean();
  if (!doc) throw new NotFoundError("Đơn đăng ký không tồn tại");
  return doc;
}

// ─── Admin — So sánh nhiều ứng viên cùng vai trò ─────────────────────────────

export async function compareApplicants(ids: string[]) {
  await connectDB();
  const docs = await PartnerApplication.find({ _id: { $in: ids } }).lean();
  return docs;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getStats() {
  await connectDB();
  const [total, submitted, underReview, shortlisted, approved, rejected] =
    await Promise.all([
      PartnerApplication.countDocuments(),
      PartnerApplication.countDocuments({ status: "submitted" }),
      PartnerApplication.countDocuments({ status: "under_review" }),
      PartnerApplication.countDocuments({ status: "shortlisted" }),
      PartnerApplication.countDocuments({ status: "approved" }),
      PartnerApplication.countDocuments({ status: "rejected" }),
    ]);
  return { total, submitted, underReview, shortlisted, approved, rejected };
}
