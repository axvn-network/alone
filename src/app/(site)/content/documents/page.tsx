import type { Metadata } from "next";
import DocumentsClient, { type DocItem } from "./DocumentsClient";
import { documentService } from "@/modules/documents";

export const metadata: Metadata = {
  title: "Công Bố Thông Tin & Tài Liệu | AXVN Tech Holding",
  description:
    "Hệ thống công bố thông tin minh bạch của AXVN Tech Holding — bao gồm báo cáo tài chính, báo cáo thường niên, điều lệ công ty, nghị quyết đại hội cổ đông và các tài liệu quản trị.",
  openGraph: {
    title: "Công Bố Thông Tin & Tài Liệu | AXVN Tech Holding",
    description:
      "Hệ thống công bố thông tin minh bạch — báo cáo tài chính, báo cáo thường niên, điều lệ công ty và tài liệu quản trị.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [documentsResult, yearsResult] = await Promise.allSettled([
    documentService.listPublic({ page: 1, limit: 10 }),
    documentService.getYears(),
  ]);

  const initialDocuments: DocItem[] = documentsResult.status === "fulfilled"
    ? documentsResult.value.documents.map((document) => ({
      _id: String(document._id),
      title: document.title,
      category: document.category,
      fileUrl: document.fileUrl,
      fileType: document.fileType,
      publishedDate: new Date(document.publishedDate).toISOString(),
      year: document.year,
      quarter: document.quarter ?? undefined,
      reportType: document.reportType || undefined,
      isFeatured: document.isFeatured,
    }))
    : [];
  const initialYears = yearsResult.status === "fulfilled" ? yearsResult.value : [];

  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <DocumentsClient
        initialDocuments={initialDocuments}
        initialYears={initialYears}
        initialTotal={documentsResult.status === "fulfilled" ? documentsResult.value.total : 0}
        initialError={documentsResult.status === "rejected" || yearsResult.status === "rejected"}
      />
    </main>
  );
}
