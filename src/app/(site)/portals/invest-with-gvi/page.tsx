import type { Metadata } from "next";
import StrategicCollaborationPage from "@/components/public/StrategicCollaborationPage";

export const metadata: Metadata = {
  title: "Hợp Tác Cùng GVI | GVI Tech Holding",
  description:
    "GVI Tech Holding hợp tác với tổ chức, chuyên gia và nhà đầu tư có năng lực phù hợp. Tìm hiểu các phương thức tham gia vào hệ sinh thái FinTech số Việt Nam.",
  openGraph: {
    title: "Hợp Tác Cùng GVI | GVI Tech Holding",
    description: "Tham gia xây dựng hạ tầng tài chính số Việt Nam cùng GVI Tech Holding.",
    url: "https://vnkr.vn/invest-with-gvi",
  },
};

export default function InvestWithGVIPage() {
  return <StrategicCollaborationPage variant="overview" />;
}
