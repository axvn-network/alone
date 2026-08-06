import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Enquiry from "@/models/Enquiry";

export async function getDashboardStats() {
  await connectDB();

  const blogCount = await Blog.countDocuments();
  const draftCount = await Blog.countDocuments({ status: "draft" });
  const publishedCount = await Blog.countDocuments({ status: "published" });
  const enquiryCount = await Enquiry.countDocuments();

  const recentEnquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentPosts = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    blogCount,
    draftCount,
    publishedCount,
    enquiryCount,
    recentEnquiries,
    recentPosts,
  };
}
