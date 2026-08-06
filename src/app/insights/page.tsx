import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Góc Nhìn & Báo Cáo Chuyên Sâu | Fortress Investment Holdings",
  description:
    "Tổng hợp các bài viết phân tích thị trường, nghiên cứu lĩnh vực và nhận định chiến lược từ các chuyên gia Fortress Investment Holdings.",
  openGraph: {
    title: "Góc Nhìn & Báo Cáo Chuyên Sâu | Fortress Investment Holdings",
    description:
      "Góc nhìn đầu tư, phân tích thị trường và bình luận chiến lược từ Fortress Investment Holdings.",
    type: "website",
  },
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Navbar />
      <InsightsClient />
      <Footer />
    </main>
  );
}
