import type { Metadata } from "next";
import { BookOpen, FileText, ShieldAlert } from "lucide-react";
import PageHero from "@/shared/components/blocks/PageHero";
import { Section } from "@/shared/components/ui/Primitives";
import StrategyNotice from "@/shared/components/blocks/StrategyNotice";
import { getStrategicDocumentSummaries } from "@/shared/constants/strategic-documents";

export const metadata: Metadata = {
  title: "Tài Liệu Chiến Lược",
  description:
    "Tóm tắt tài liệu chiến lược, pháp lý và vận hành của AXVN Tech Holding.",
};

const GROUP_LABEL = {
  STRATEGY: "Chiến lược",
  LEGAL: "Pháp lý & vận hành",
} as const;

export default function StrategyDocumentsPage() {
  const documents = getStrategicDocumentSummaries();
  const groups = (["STRATEGY", "LEGAL"] as const).map((group) => ({
    group,
    documents: documents.filter((document) => document.group === group),
  }));

  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        tag="Thư Viện Tham Chiếu"
        heading="Tài Liệu Chiến Lược"
        description="Tóm tắt công khai từ bộ tài liệu AXVN; không bao gồm toàn văn tài liệu nội bộ, corpus retrieval hoặc dữ liệu vector."
      />
      <Section>
        <StrategyNotice className="mx-auto mb-10 max-w-4xl" />
        <div className="mx-auto max-w-4xl rounded-sm border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <ShieldAlert
            className="mr-2 inline h-4 w-4 text-amber-700"
            aria-hidden="true"
          />
          Một số nguồn gốc có phân loại nội bộ. Trang này chỉ hiển thị metadata
          và tóm tắt; không cung cấp liên kết tải xuống hay đường dẫn kho nội
          bộ.
        </div>
        {groups.map(({ group, documents: groupDocuments }) => (
          <section key={group} className="mx-auto mt-14 max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-AXVN-gold" />
              <p aria-hidden="true" className="text-2xl font-semibold text-AXVN-navy">{GROUP_LABEL[group]}</p>
              <span className="text-sm text-AXVN-charcoal/50">
                {groupDocuments.length} tài liệu
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {groupDocuments.map((document) => (
                <article
                  key={document.slug}
                  className="rounded-xl border border-AXVN-gold/15 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-AXVN-gold" />
                    <div>
                      <h3 className="font-semibold text-AXVN-navy">
                        {document.title}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wider text-AXVN-charcoal/45">
                        {document.documentType} · {document.date}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-AXVN-charcoal/70">
                    {document.summary}
                  </p>
                  <span className="mt-5 inline-block rounded-full border border-AXVN-gold/20 bg-AXVN-gold/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-AXVN-gold">
                    {document.classification === "confidential"
                      ? "Tóm tắt từ nguồn nội bộ"
                      : "Tài liệu tham chiếu"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </Section>
    </main>
  );
}
