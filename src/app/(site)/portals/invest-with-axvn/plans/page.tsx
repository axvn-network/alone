import type { Metadata } from "next";
import StrategicCollaborationPage from "@/shared/components/blocks/StrategicCollaborationPage";

export const metadata: Metadata = {
  title: "Khung Hợp Tác | AXVN Tech Holding",
  description:
    "Các hình thức hợp tác và đăng ký tham gia cùng AXVN Tech Holding.",
};

export default function InvestWithAXVNPlansPage() {
  return <StrategicCollaborationPage variant="plans" />;
}
