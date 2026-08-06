import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Enquiry from "@/models/Enquiry";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const blogPosts = await Blog.countDocuments();
    const totalContacts = await Enquiry.countDocuments({ type: "Contact" });
    const totalSubmissions = await Enquiry.countDocuments({
      type: { $in: ["Investment Opportunity", "Business Acquisition", "Joint Venture", "Strategic Partnership"] },
    });

    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();



    const activities = [
      ...recentEnquiries.map((e) => ({
        id: e._id.toString(),
        type: (e.type === "Contact" ? "contact" : "submission") as "contact" | "submission",
        title: e.name,
        description: e.subject || e.type,
        time: e.createdAt,
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      blogPosts,
      totalContacts,
      totalSubmissions,
      activities,
    });
  } catch {
    return NextResponse.json(
      { blogPosts: 0, totalContacts: 0, totalSubmissions: 0, activities: [] },
      { status: 200 }
    );
  }
}
