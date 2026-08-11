import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";

export const metadata: Metadata = {
  title: "Góc Nhìn & Báo Cáo Chuyên Sâu | GVI Tech Holding",
  description:
    "Tổng hợp các bài viết phân tích thị trường, nghiên cứu lĩnh vực và nhận định chiến lược từ các chuyên gia GVI Tech Holding.",
  openGraph: {
    title: "Góc Nhìn & Báo Cáo Chuyên Sâu | GVI Tech Holding",
    description:
      "Góc nhìn đầu tư, phân tích thị trường và bình luận chiến lược từ GVI Tech Holding.",
    type: "website",
  },
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-safe md:pb-0">
      <InsightsClient />
    </main>
  );
}
