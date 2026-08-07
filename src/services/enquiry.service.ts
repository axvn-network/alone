import Enquiry from "@/models/Enquiry";
import type { ContactEnquiryInput } from "@/validators";
import { NotFoundError } from "@/utils/errors";
import { connectDB } from "@/lib/db";

/** Shape returned to the admin enquiries list page */
export interface AdminEnquiryItem {
  id: string;
  /** Normalised: "contact" | "submission" */
  type: "contact" | "submission";
  name: string;
  email: string;
  subject: string;
  message: string;
  /** true when status !== "new" */
  read: boolean;
  createdAt: string;
  details: {
    phone: string;
    company: string;
    document: string;
    /** Raw DB type label for extra context */
    enquiryType: string;
  };
}

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
  page?: number;
  limit?: number;
}) {
  await connectDB();

  const { status, type, page = 1, limit = 20 } = options || {};
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (type) query.type = type;

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
}): Promise<AdminEnquiryItem[]> {
  await connectDB();

  const query: Record<string, unknown> = {};

  if (options?.status) {
    query.status = options.status;
  }
  if (options?.type === "contact") {
    query.type = "Contact";
  } else if (options?.type === "submission") {
    query.type = {
      $in: ["Investment Opportunity", "Business Acquisition", "Joint Venture", "Strategic Partnership"],
    };
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
      phone: e.phone || "",
      company: e.company || "",
      document: e.document || "",
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
