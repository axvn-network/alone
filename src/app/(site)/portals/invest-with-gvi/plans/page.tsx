import type { Metadata } from "next";
import StrategicCollaborationPage from "@/components/public/StrategicCollaborationPage";

export const metadata: Metadata = {
  title: "Khung Hợp Tác | GVI Tech Holding",
  description:
    "Các hình thức hợp tác và đăng ký tham gia cùng GVI Tech Holding.",
};

export default function InvestWithGVIPlansPage() {
  return <StrategicCollaborationPage variant="plans" />;
}
