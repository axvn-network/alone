/**
 * src/modules/dashboard/service.ts
 * Dashboard aggregation service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import Blog from "@/modules/blog/model";
import Enquiry from "@/modules/enquiries/model";
import Shareholder from "@/modules/shareholders/model";
import InvestmentPlan from "@/modules/investment-plans/model";
import PartnerApplication from "@/modules/partner-applications/model";
import DocumentModel from "@/modules/documents/model";
import CapitalTransaction from "@/modules/capital-transactions/model";

export interface DashboardActivity {
  id: string;
  type: "contact" | "submission";
  title: string;
  description: string;
  time: Date | string;
}

export interface DashboardStatsResult {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  /** Alias publishedBlogs — dùng trong stat cards */
  blogPosts: number;
  totalEnquiries: number;
  newEnquiries: number;
  /** Alias totalEnquiries — dùng trong stat cards */
  totalContacts: number;
  /** Số enquiry loại đề xuất hợp tác */
  totalSubmissions: number;
  totalShareholders: number;
  activeShareholders: number;
  pendingShareholders: number;
  totalPlans: number;
  activePlans: number;
  totalApplications: number;
  pendingApplications: number;
  totalDocuments: number;
  publishedDocuments: number;
  /** Số giao dịch vốn đang chờ duyệt */
  pendingCapitalTx: number;
  /** Hoạt động gần đây (enquiries + applications) */
  activities: DashboardActivity[];
}

export async function getDashboardStats(): Promise<DashboardStatsResult> {
  await connectDB();

  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalEnquiries,
    newEnquiries,
    totalSubmissions,
    totalShareholders,
    activeShareholders,
    pendingShareholders,
    totalPlans,
    activePlans,
    totalApplications,
    pendingApplications,
    totalDocuments,
    publishedDocuments,
    pendingCapitalTx,
    recentEnquiries,
    recentApplications,
  ] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({
      type: {
        $in: [
          "Investment Opportunity",
          "Strategic Partnership",
          "Joint Venture",
          "Business Acquisition",
        ],
      },
    }),
    Shareholder.countDocuments(),
    Shareholder.countDocuments({ status: "active" }),
    Shareholder.countDocuments({ status: "pending" }),
    InvestmentPlan.countDocuments(),
    InvestmentPlan.countDocuments({ status: "active" }),
    PartnerApplication.countDocuments(),
    PartnerApplication.countDocuments({ status: "submitted" }),
    DocumentModel.countDocuments(),
    DocumentModel.countDocuments({ status: "published" }),
    CapitalTransaction.countDocuments({ status: "pending" }),
    Enquiry.find().sort({ createdAt: -1 }).limit(4).lean() as Promise<
      { _id: unknown; name?: string; message?: string; subject?: string; createdAt: Date }[]
    >,
    PartnerApplication.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean() as Promise<
      { _id: unknown; fullName?: string; desiredRole?: string; createdAt: Date }[]
    >,
  ]);

  // Gộp và sort activities
  const activities: DashboardActivity[] = [
    ...recentEnquiries.map((e) => ({
      id: String(e._id),
      type: "contact" as const,
      title: e.name ?? "Khách hàng",
      description: e.message?.slice(0, 80) ?? e.subject ?? "",
      time: e.createdAt,
    })),
    ...recentApplications.map((a) => ({
      id: String(a._id),
      type: "submission" as const,
      title: a.fullName ?? "Ứng viên",
      description: `Vai trò: ${a.desiredRole ?? ""}`,
      time: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return {
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    blogPosts: publishedBlogs,
    totalEnquiries,
    newEnquiries,
    totalContacts: totalEnquiries,
    totalSubmissions,
    totalShareholders,
    activeShareholders,
    pendingShareholders,
    totalPlans,
    activePlans,
    totalApplications,
    pendingApplications,
    totalDocuments,
    publishedDocuments,
    pendingCapitalTx,
    activities,
  };
}
