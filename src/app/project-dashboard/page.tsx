import type { Metadata } from "next";
import ProjectDashboardContent from "./ProjectDashboardContent";

export const metadata: Metadata = {
  title: "Bảng Điều Hướng Chiến Lược",
  description: "Góc nhìn trực quan về lộ trình, năng lực và tài liệu tham chiếu công khai của GVI Tech Holding.",
};

export default function ProjectDashboardPage() {
  return <ProjectDashboardContent />;
}
