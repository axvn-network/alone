import type { Metadata } from "next";
import InsightsClient, { type InsightsClientProps } from "./InsightsClient";
import * as blogService from "@/modules/blog";

export const metadata: Metadata = {
  title: "Góc Nhìn & Báo Cáo Chuyên Sâu | AXVN Tech Holding",
  description:
    "Tổng hợp các bài viết phân tích thị trường, nghiên cứu lĩnh vực và nhận định chiến lược từ các chuyên gia AXVN Tech Holding.",
  openGraph: {
    title: "Góc Nhìn & Báo Cáo Chuyên Sâu | AXVN Tech Holding",
    description:
      "Góc nhìn đầu tư, phân tích thị trường và bình luận chiến lược từ AXVN Tech Holding.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  let initialArticles: InsightsClientProps["initialArticles"] = [];
  let fetchError = false;

  try {
    const { posts } = await blogService.getBlogs({
      status: "published",
      page: 1,
      limit: 100,
    });
    initialArticles = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      category: post.category || "General",
      readTime: post.readTime || "5 min read",
      tags: post.tags || [],
      featuredImage: post.featuredImage || undefined,
      date: (post.publishedAt || post.createdAt).toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
    }));
  } catch {
    fetchError = true;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-safe md:pb-0">
      <InsightsClient
        initialArticles={initialArticles}
        initialError={fetchError}
      />
    </main>
  );
}
