"use client";

import { useMemo, useState } from "react";
import { BookOpenText, FileText, Search } from "lucide-react";

export interface ExplorerDocument {
  id: string;
  group: string;
  title: string;
  summary: string;
  href: string;
}

interface DocumentExplorerProps {
  documents: readonly ExplorerDocument[];
}

export default function DocumentExplorer({ documents }: DocumentExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("Tất cả");
  const groups = ["Tất cả", ...new Set(documents.map((document) => document.group))];
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return documents.filter((document) => {
      const groupMatches = activeGroup === "Tất cả" || document.group === activeGroup;
      const textMatches = !normalized || `${document.title} ${document.summary}`.toLocaleLowerCase("vi").includes(normalized);
      return groupMatches && textMatches;
    });
  }, [activeGroup, documents, query]);

  return (
    <section className="border border-gvi-gold/15 bg-white" aria-labelledby="document-explorer-title">
      <div className="border-b border-gvi-gold/15 p-5 sm:p-7">
        <p className="section-tag">Document explorer</p>
        <h2 id="document-explorer-title" className="mt-2 text-2xl font-semibold text-gvi-navy">Tìm theo chủ đề, không cần đọc tuần tự</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gvi-charcoal/70">Chỉ mục điều hướng đến các tóm tắt công khai. Nội dung gốc và dữ liệu retrieval vẫn được bảo vệ.</p>
      </div>
      <div className="grid lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="border-b border-gvi-gold/15 bg-gvi-navy p-4 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gvi-silver/60">Nhóm nội dung</p>
          <div className="flex gap-2 overflow-x-auto lg:flex-col" role="tablist" aria-label="Nhóm tài liệu">
            {groups.map((group) => (
              <button key={group} type="button" role="tab" aria-selected={activeGroup === group} onClick={() => setActiveGroup(group)} className={`shrink-0 border px-3 py-2 text-left text-xs transition-colors ${activeGroup === group ? "border-gvi-gold bg-gvi-gold text-gvi-navy" : "border-white/10 text-gvi-silver hover:border-gvi-gold/50"}`}>
                {group}
              </button>
            ))}
          </div>
        </aside>
        <div className="p-5 sm:p-7">
          <label className="flex items-center gap-2 border border-gvi-gold/25 px-3 py-2 text-gvi-charcoal/50 focus-within:border-gvi-gold">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Tìm tài liệu</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm chủ đề hoặc tài liệu" className="w-full bg-transparent text-sm text-gvi-charcoal outline-none placeholder:text-gvi-charcoal/40" />
          </label>
          <p className="mt-4 text-xs text-gvi-charcoal/55">{results.length} kết quả phù hợp</p>
          <ul className="mt-4 divide-y divide-gvi-gold/15">
            {results.map((document) => (
              <li key={document.id}>
                <a href={document.href} className="group flex gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gvi-gold">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gvi-gold" aria-hidden="true" />
                  <span><span className="block text-xs font-semibold uppercase tracking-wider text-gvi-gold">{document.group}</span><span className="mt-1 block text-sm font-semibold text-gvi-navy group-hover:text-gvi-gold">{document.title}</span><span className="mt-1 block text-sm leading-relaxed text-gvi-charcoal/65">{document.summary}</span></span>
                </a>
              </li>
            ))}
          </ul>
          {!results.length && <p className="mt-6 flex items-center gap-2 text-sm text-gvi-charcoal/60"><BookOpenText className="h-4 w-4 text-gvi-gold" aria-hidden="true" />Không có tóm tắt phù hợp.</p>}
        </div>
      </div>
    </section>
  );
}
