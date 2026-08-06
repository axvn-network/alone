import Enquiry from "@/models/Enquiry";
import type { ContactEnquiryInput } from "@/validators";
import { NotFoundError } from "@/utils/errors";
import { connectDB } from "@/lib/db";

export async function createEnquiry(data: ContactEnquiryInput) {
  await connectDB();
  const enquiry = await Enquiry.create(data);
  return enquiry.toObject();
}

export async function getEnquiries(options?: {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  await connectDB();

  const { status, type, page = 1, limit = 20 } = options || {};
  const query: Record<string, unknown> = {};

  if (status) query.status = status;
  if (type) query.type = type;

  const total = await Enquiry.countDocuments(query);
  const enquiries = await Enquiry.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { enquiries, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getEnquiryById(id: string) {
  await connectDB();
  const enquiry = await Enquiry.findById(id).lean();
  if (!enquiry) throw new NotFoundError("Enquiry not found");
  return enquiry;
}

export async function updateEnquiryStatus(id: string, status: "new" | "read" | "archived") {
  await connectDB();
  const enquiry = await Enquiry.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
  if (!enquiry) throw new NotFoundError("Enquiry not found");
  return enquiry;
}

export async function deleteEnquiry(id: string) {
  await connectDB();
  const enquiry = await Enquiry.findByIdAndDelete(id).lean();
  if (!enquiry) throw new NotFoundError("Enquiry not found");
  return enquiry;
}
