import type { Metadata } from "next";
import DocumentsClient from "./DocumentsClient";

export const metadata: Metadata = {
  title: "Công Bố Thông Tin & Tài Liệu | GVI Tech Holding",
  description:
    "Hệ thống công bố thông tin minh bạch của GVI Tech Holding — bao gồm báo cáo tài chính, báo cáo thường niên, điều lệ công ty, nghị quyết đại hội cổ đông và các tài liệu quản trị.",
  openGraph: {
    title: "Công Bố Thông Tin & Tài Liệu | GVI Tech Holding",
    description:
      "Hệ thống công bố thông tin minh bạch — báo cáo tài chính, báo cáo thường niên, điều lệ công ty và tài liệu quản trị.",
    type: "website",
  },
};

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <DocumentsClient />
    </main>
  );
}
