import { connectDB } from "@/core/database/db";
import Blog from "@/core/models/Blog";
import Enquiry from "@/core/models/Enquiry";
import Shareholder from "@/core/models/Shareholder";
import InvestmentPlan from "@/core/models/InvestmentPlan";
import ShareholderTask from "@/core/models/ShareholderTask";
import ShareholderMeeting from "@/core/models/ShareholderMeeting";
import CapitalTransaction from "@/core/models/CapitalTransaction";
import type { ActivityItem, DashboardStats } from "@/shared/types";

/** @deprecated Use DashboardStats from @/shared/types */
export type DashboardStatsResult = DashboardStats;

const SUBMISSION_TYPES = [
  "Investment Opportunity",
  "Business Acquisition",
  "Joint Venture",
  "Strategic Partnership",
] as const;

export async function getDashboardStats(): Promise<DashboardStatsResult> {
  await connectDB();

  const [
    blogPosts,
    totalContacts,
    totalSubmissions,
    newEnquiries,
    totalShareholders,
    totalPlans,
    pendingCapitalTx,
    recentEnquiries,
  ] = await Promise.all([
    Blog.countDocuments({ status: "published" }),
    Enquiry.countDocuments({ type: "Contact" }),
    Enquiry.countDocuments({ type: { $in: SUBMISSION_TYPES } }),
    Enquiry.countDocuments({ status: "new" }),
    Shareholder.countDocuments({ status: "active" }),
    InvestmentPlan.countDocuments({ status: "active" }),
    CapitalTransaction.countDocuments({ status: "pending" }),
    Enquiry.find({}, { _id: 1, name: 1, type: 1, subject: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const activities: ActivityItem[] = recentEnquiries.map((e: Record<string, unknown>) => ({
    id:          String(e._id),
    type:        (e.type as string) === "Contact" ? "contact" : "submission",
    title:       e.name as string,
    description: (e.subject as string) || (e.type as string),
    time:        (e.createdAt as Date).toISOString(),
  }));

  return {
    blogPosts,
    totalContacts,
    totalSubmissions,
    newEnquiries,
    totalShareholders,
    totalPlans,
    pendingCapitalTx,
    activities,
  };
}

export interface BlogStatsResult {
  total:      number;
  published:  number;
  drafts:     number;
  categories: number;
}

export async function getBlogStats(): Promise<BlogStatsResult> {
  await connectDB();
  const [total, published, drafts, categoriesAgg] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Blog.distinct("category"),
  ]);
  return { total, published, drafts, categories: categoriesAgg.length };
}

export interface ShareholderDashboardStats {
  totalTasks:       number;
  doneTasks:        number;
  inProgressTasks:  number;
  blockedTasks:     number;
  upcomingMeetings: number;
  unreadMessages:   number;
}

export async function getShareholderDashboardStats(
  shareholderId: string,
  role:          string
): Promise<ShareholderDashboardStats> {
  await connectDB();
  const { Types } = await import("mongoose");
  const shId = new Types.ObjectId(shareholderId);

  const taskFilter = {
    $or: [
      { assignedTo: shId },
      { assignedRoles: role },
      { assignedRoles: { $size: 0 } },
    ],
  };

  const [totalTasks, doneTasks, inProgressTasks, blockedTasks, upcomingMeetings, unreadMessages] =
    await Promise.all([
      ShareholderTask.countDocuments(taskFilter),
      ShareholderTask.countDocuments({ ...taskFilter, status: "done" }),
      ShareholderTask.countDocuments({ ...taskFilter, status: "in_progress" }),
      ShareholderTask.countDocuments({ ...taskFilter, status: "blocked" }),
      ShareholderMeeting.countDocuments({
        $or: [{ invitedRoles: role }, { invitedRoles: { $size: 0 } }, { attendees: shId }],
        status: "scheduled",
      }),
      (await import("@/core/models/ShareholderMessage")).default.countDocuments({
        readBy: { $ne: shId },
      }),
    ]);

  return { totalTasks, doneTasks, inProgressTasks, blockedTasks, upcomingMeetings, unreadMessages };
}
