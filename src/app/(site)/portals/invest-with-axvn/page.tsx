import type { Metadata } from "next";
import StrategicCollaborationPage from "@/app/(site)/components/public/StrategicCollaborationPage";

export const metadata: Metadata = {
  title: "Hợp Tác Cùng AXVN | AXVN Tech Holding",
  description:
    "AXVN Tech Holding hợp tác với tổ chức, chuyên gia và nhà đầu tư có năng lực phù hợp. Tìm hiểu các phương thức tham gia vào hệ sinh thái FinTech số Việt Nam.",
  openGraph: {
    title: "Hợp Tác Cùng AXVN | AXVN Tech Holding",
    description: "Tham gia xây dựng hạ tầng tài chính số Việt Nam cùng AXVN Tech Holding.",
    url: "https://axvn.vn/invest-with-axvn",
  },
};

export default function InvestWithAXVNPage() {
  return <StrategicCollaborationPage variant="overview" />;
}
