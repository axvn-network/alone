import Enquiry from "@/models/Enquiry";
import type { ContactEnquiryInput } from "@/validators";
import type { AdminEnquiryItem } from "@/types";
import { NotFoundError } from "@/utils/errors";
import { connectDB } from "@/lib/db";

export interface EnquiryStats {
  total: number;
  new: number;
  read: number;
  archived: number;
  contacts: number;
  submissions: number;
}

const SUBMISSION_TYPES = [
  "Investment Opportunity",
  "Business Acquisition",
  "Joint Venture",
  "Strategic Partnership",
];

// ─── public submission ────────────────────────────────────────────────────────

export async function createEnquiry(data: ContactEnquiryInput) {
  await connectDB();
  const enquiry = await Enquiry.create(data);
  return enquiry.toObject();
}

// ─── paginated list (admin, with raw DB docs) ─────────────────────────────────

export async function getEnquiries(options?: {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await connectDB();

  const { status, type, search, page = 1, limit = 20 } = options || {};
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (type)   query.type   = type;
  if (search) {
    query.$or = [
      { name:    { $regex: search, $options: "i" } },
      { email:   { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const [total, enquiries] = await Promise.all([
    Enquiry.countDocuments(query),
    Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return { enquiries, total, page, totalPages: Math.ceil(total / limit) };
}

/** Shaped list for the admin Enquiries page — matches EnquiryItem interface */
export async function listForAdmin(options?: {
  type?: "contact" | "submission";
  status?: string;
  search?: string;
}): Promise<AdminEnquiryItem[]> {
  await connectDB();

  const query: Record<string, unknown> = {};

  if (options?.status) {
    query.status = options.status;
  }
  if (options?.type === "contact") {
    query.type = "Contact";
  } else if (options?.type === "submission") {
    query.type = { $in: SUBMISSION_TYPES };
  }
  if (options?.search) {
    query.$or = [
      { name:    { $regex: options.search, $options: "i" } },
      { email:   { $regex: options.search, $options: "i" } },
      { subject: { $regex: options.search, $options: "i" } },
    ];
  }

  const docs = await Enquiry.find(query).sort({ createdAt: -1 }).limit(200).lean();

  return docs.map((e) => ({
    id: String(e._id),
    type: e.type === "Contact" ? "contact" : "submission",
    name: e.name,
    email: e.email,
    subject: e.subject || e.type,
    message: e.message,
    read: e.status !== "new",
    createdAt: (e.createdAt as Date).toISOString(),
    details: {
      phone:       e.phone    || "",
      company:     e.company  || "",
      document:    e.document || "",
      enquiryType: e.type,
    },
  }));
}

// ─── single doc ───────────────────────────────────────────────────────────────

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

/** Bulk mark read — e.g., mark all new contact enquiries as read */
export async function bulkMarkRead(ids: string[]) {
  await connectDB();
  const result = await Enquiry.updateMany(
    { _id: { $in: ids } },
    { $set: { status: "read" } }
  );
  return result.modifiedCount;
}

/** Summary stats for dashboard badge & overview */
export async function getStats(): Promise<EnquiryStats> {
  await connectDB();
  const [total, newCount, readCount, archivedCount, contacts, submissions] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ status: "read" }),
    Enquiry.countDocuments({ status: "archived" }),
    Enquiry.countDocuments({ type: "Contact" }),
    Enquiry.countDocuments({ type: { $in: SUBMISSION_TYPES } }),
  ]);
  return { total, new: newCount, read: readCount, archived: archivedCount, contacts, submissions };
}
