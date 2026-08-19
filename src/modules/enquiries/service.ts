/**
 * src/modules/enquiries/service.ts
 * Enquiry service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import Enquiry, { type IEnquiry, type EnquiryStatus } from "@/modules/enquiries/model";
import { type ContactEnquiryInput } from "@/modules/enquiries/schema";

export interface EnquiryStats {
  total: number;
  newCount: number;
  readCount: number;
  archivedCount: number;
}

export async function createEnquiry(
  data: ContactEnquiryInput,
  meta?: { ipAddress?: string; userAgent?: string },
): Promise<IEnquiry> {
  await connectDB();
  return Enquiry.create({ ...data, ...meta });
}

export async function getEnquiries(options?: {
  status?: EnquiryStatus | string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  await connectDB();
  const { status, type, page = 1, limit = 20 } = options ?? {};
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (type)   filter.type   = type;
  const [docs, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);
  return { enquiries: docs, total, page, limit };
}

export async function listForAdmin(options?: { page?: number; limit?: number; status?: EnquiryStatus | string; type?: string }) {
  return getEnquiries(options);
}

export async function getEnquiryById(id: string) {
  await connectDB();
  return Enquiry.findById(id).lean();
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus | string) {
  await connectDB();
  return Enquiry.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
}

export async function deleteEnquiry(id: string) {
  await connectDB();
  await Enquiry.findByIdAndDelete(id);
  return true;
}

export async function bulkMarkRead(ids: string[]) {
  await connectDB();
  await Enquiry.updateMany({ _id: { $in: ids } }, { $set: { status: "read" } });
  return true;
}

export async function getStats(): Promise<EnquiryStats> {
  await connectDB();
  const [total, newCount, readCount, archivedCount] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ status: "read" }),
    Enquiry.countDocuments({ status: "archived" }),
  ]);
  return { total, newCount, readCount, archivedCount };
}
