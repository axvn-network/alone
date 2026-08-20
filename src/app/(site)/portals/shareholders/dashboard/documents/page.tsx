"use client";

/**
 * /portals/shareholders/dashboard/documents
 *
 * Trang tài liệu dành cho Cổ Đông.
 * Hiển thị danh sách tài liệu đã xuất bản, phân loại theo danh mục và năm.
 * Cổ đông có thể tải xuống từng tài liệu.
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Download,
  FolderOpen,
  RefreshCw,
  ChevronLeft,
  Filter,
  ExternalLink,
  FileSpreadsheet,
  File,
} from "lucide-react";

interface DocumentItem {
  _id: string;
  title: string;
  titleEn?: string;
  category: string;
  fileUrl: string;
  fileType: "pdf" | "doc" | "xlsx" | "other";
  publishedDate: string;
  year: number;
  quarter?: number;
  isFeatured: boolean;
}

// Tên danh mục tiếng Việt
const CATEGORY_LABELS: Record<string, string> = {
  financial_report: "Báo cáo tài chính",
  disclosure: "Công bố thông tin",
  charter: "Điều lệ & Quy chế",
  shareholder_meeting: "Họp Đại hội cổ đông",
  annual_report: "Báo cáo thường niên",
  governance_report: "Báo cáo quản trị",
  press_release: "Thông cáo báo chí",
  regulatory_filing: "Hồ sơ pháp lý / Nộp cơ quan",
};

// Icon theo loại file
function FileIcon({ type }: { type: string }) {
  if (type === "xlsx")
    return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
  if (type === "pdf") return <FileText className="w-4 h-4 text-red-400" />;
  return <File className="w-4 h-4 text-AXVN-silver/50" />;
}

export default function ShareholderDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");

  const fetchDocs = useCallback(
    async (category = "", year = "") => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (year) params.set("year", year);

        const res = await fetch(`/api/shareholders/documents?${params}`, {
          credentials: "include",
        });
        if (res.status === 401) {
          router.push("/portals/shareholders/login");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setDocuments(data.data.documents);
          setYears(data.data.years);
        }
      } catch {
        setError("Không thể tải danh sách tài liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    void fetchDocs();
  }, [fetchDocs]);

  function handleFilter(cat: string, yr: string) {
    setSelectedCategory(cat);
    setSelectedYear(yr);
    void fetchDocs(cat, yr);
  }

  // Nhóm tài liệu theo năm để dễ đọc
  const grouped = documents.reduce<Record<number, DocumentItem[]>>(
    (acc, doc) => {
      if (!acc[doc.year]) acc[doc.year] = [];
      acc[doc.year].push(doc);
      return acc;
    },
    {},
  );
  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-AXVN-navy text-AXVN-ivory font-sans">
      {/* Header */}
      <div className="bg-[#06101a]/90 border-b border-AXVN-gold/10 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/portals/shareholders/dashboard"
            className="flex items-center gap-2 text-AXVN-silver/60 hover:text-AXVN-gold transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại
          </Link>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-AXVN-gold" />
            <h1 className="text-sm font-semibold text-AXVN-ivory">
              Tài Liệu & Báo Cáo
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Bộ lọc */}
        <div className="bg-[#06101a] border border-AXVN-gold/10 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-AXVN-silver/50 text-xs font-medium">
            <Filter className="w-3.5 h-3.5" /> Lọc:
          </div>

          {/* Danh mục */}
          <select
            value={selectedCategory}
            onChange={(e) => handleFilter(e.target.value, selectedYear)}
            className="bg-[#0c1a28] border border-white/10 text-AXVN-ivory text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-AXVN-gold/50 transition-colors"
          >
            <option value="" className="bg-[#06101a]">
              — Tất cả danh mục —
            </option>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val} className="bg-[#06101a]">
                {label}
              </option>
            ))}
          </select>

          {/* Năm */}
          <select
            value={selectedYear}
            onChange={(e) => handleFilter(selectedCategory, e.target.value)}
            className="bg-[#0c1a28] border border-white/10 text-AXVN-ivory text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-AXVN-gold/50 transition-colors"
          >
            <option value="" className="bg-[#06101a]">
              — Tất cả năm —
            </option>
            {years.map((y) => (
              <option key={y} value={String(y)} className="bg-[#06101a]">
                {y}
              </option>
            ))}
          </select>

          {/* Reset */}
          {(selectedCategory || selectedYear) && (
            <button
              onClick={() => handleFilter("", "")}
              className="text-xs text-AXVN-silver/40 hover:text-AXVN-gold transition-colors underline underline-offset-2"
            >
              Xóa bộ lọc
            </button>
          )}

          <button
            onClick={() => void fetchDocs()}
            disabled={loading}
            className="ml-auto p-2 border border-white/10 text-AXVN-silver/40 rounded-xl hover:border-AXVN-gold/30 transition-colors disabled:opacity-40"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-6 h-6 text-AXVN-gold animate-spin" />
          </div>
        )}

        {/* Rỗng */}
        {!loading && documents.length === 0 && (
          <div className="text-center py-20">
            <FolderOpen className="w-10 h-10 text-AXVN-silver/20 mx-auto mb-4" />
            <p className="text-AXVN-silver/40 text-sm">
              Chưa có tài liệu nào được công bố.
            </p>
          </div>
        )}

        {/* Danh sách tài liệu nhóm theo năm */}
        {!loading &&
          sortedYears.map((year) => (
            <div key={year} className="mb-8">
              <h2 className="text-AXVN-gold text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-AXVN-gold rounded-full" />
                Năm {year}
              </h2>

              <div className="bg-[#06101a] border border-AXVN-gold/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                {grouped[year].map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors group"
                  >
                    {/* Icon loại file */}
                    <div className="w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center shrink-0">
                      <FileIcon type={doc.fileType} />
                    </div>

                    {/* Thông tin */}
                    <div className="flex-1 min-w-0">
                      <p className="text-AXVN-ivory text-sm font-medium truncate">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-AXVN-gold/8 border border-AXVN-gold/15 text-AXVN-gold/70 font-medium">
                          {CATEGORY_LABELS[doc.category] || doc.category}
                        </span>
                        {doc.quarter && (
                          <span className="text-AXVN-silver/30 text-xs">
                            Q{doc.quarter}
                          </span>
                        )}
                        <span className="text-AXVN-silver/25 text-[11px]">
                          {new Date(doc.publishedDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Nút tải xuống */}
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-1.5 px-3 py-2 bg-AXVN-gold/8 border border-AXVN-gold/20 text-AXVN-gold text-xs font-medium rounded-xl hover:bg-AXVN-gold/15 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tải xuống</span>
                    </a>

                    {/* Xem trực tuyến */}
                    {doc.fileType === "pdf" && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-white/10 text-AXVN-silver/40 rounded-xl hover:text-AXVN-ivory hover:border-white/20 transition-colors shrink-0"
                        title="Xem trực tuyến"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
