import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Enquiry from "@/models/Enquiry";

export interface ActivityItem {
  id: string;
  /** "contact" = type "Contact"; "submission" = all investment types */
  type: "contact" | "submission";
  /** Sender name */
  title: string;
  /** Subject or enquiry type label */
  description: string;
  /** ISO string — used by timeAgo() on the frontend */
  time: string;
}

export interface DashboardStatsResult {
  /** Total published blog posts */
  blogPosts: number;
  /** Total "Contact" enquiries */
  totalContacts: number;
  /** Total investment-type enquiries */
  totalSubmissions: number;
  /** Unread enquiries count — used for nav badge */
  newEnquiries: number;
  /** 10 most recent enquiries as activity feed items */
  activities: ActivityItem[];
}

const SUBMISSION_TYPES = [
  "Investment Opportunity",
  "Business Acquisition",
  "Joint Venture",
  "Strategic Partnership",
] as const;

export async function getDashboardStats(): Promise<DashboardStatsResult> {
  await connectDB();

  // All counts fire in parallel — single round-trip latency
  const [
    blogPosts,
    totalContacts,
    totalSubmissions,
    newEnquiries,
    recentEnquiries,
  ] = await Promise.all([
    Blog.countDocuments({ status: "published" }),
    Enquiry.countDocuments({ type: "Contact" }),
    Enquiry.countDocuments({ type: { $in: SUBMISSION_TYPES } }),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.find({}, { _id: 1, name: 1, type: 1, subject: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const activities: ActivityItem[] = recentEnquiries.map((e) => ({
    id: String(e._id),
    type: e.type === "Contact" ? "contact" : "submission",
    title: e.name,
    description: (e.subject as string) || (e.type as string),
    time: (e.createdAt as Date).toISOString(),
  }));

  return {
    blogPosts,
    totalContacts,
    totalSubmissions,
    newEnquiries,
    activities,
  };
}

/** Lightweight blog stats — used by admin/blog page stat cards */
export interface BlogStatsResult {
  total: number;
  published: number;
  drafts: number;
  categories: number;
}

export async function getBlogStats(): Promise<BlogStatsResult> {
  await connectDB();

  const [total, published, drafts, categories] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Blog.distinct("category").then((arr) => arr.length),
  ]);

  return { total, published, drafts, categories };
}
