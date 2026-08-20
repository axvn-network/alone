"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import {
  FileText,
  Download,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileDown,
  BookOpen,
  BarChart2,
  Users,
  Megaphone,
  ScrollText,
  ClipboardList,
} from "lucide-react";
import PageHero from "@/shared/components/blocks/PageHero";

/* ── Types ─────────────────────────────────────────────────── */
export type DocumentCategory =
  | "financial_report"
  | "disclosure"
  | "charter"
  | "shareholder_meeting"
  | "annual_report"
  | "governance_report";

export interface DocItem {
  _id: string;
  title: string;
  titleEn?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: "pdf" | "doc" | "xlsx" | "other";
  publishedDate: string;
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportType?: string;
  isFeatured?: boolean;
}

export interface DocumentsClientProps {
  initialDocuments: DocItem[];
  initialYears: number[];
  initialTotal: number;
  initialError?: boolean;
}

/* ── Config ─────────────────────────────────────────────────── */
const TABS: {
  key: DocumentCategory | "all";
  label: string;
  icon: ReactNode;
}[] = [
  {
    key: "all",
    label: "Tất cả tài liệu",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    key: "annual_report",
    label: "Báo cáo thường niên",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    key: "financial_report",
    label: "Báo cáo tài chính",
    icon: <BarChart2 className="w-4 h-4" />,
  },
  {
    key: "governance_report",
    label: "Báo cáo quản trị",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    key: "disclosure",
    label: "Công bố thông tin",
    icon: <Megaphone className="w-4 h-4" />,
  },
  {
    key: "charter",
    label: "Điều lệ & Quy chế",
    icon: <ScrollText className="w-4 h-4" />,
  },
  {
    key: "shareholder_meeting",
    label: "Đại hội cổ đông",
    icon: <Users className="w-4 h-4" />,
  },
];

const QUARTERS = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];

const REPORT_TYPE_LABELS: Record<string, string> = {
  consolidated_audited: "Báo Cáo Hợp Nhất Kiểm Toán/Soát Xét",
  separate_audited: "Báo Cáo Riêng Kiểm Toán/Soát Xét",
  consolidated: "Báo Cáo Hợp Nhất",
  separate: "Báo Cáo Riêng",
  solvency: "Báo cáo tỷ lệ ATTC",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

/* ── Helpers ─────────────────────────────────────────────────── */
function fmtDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function FileTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    pdf: "bg-red-50 text-red-600 border-red-200",
    doc: "bg-blue-50 text-blue-600 border-blue-200",
    xlsx: "bg-green-50 text-green-600 border-green-200",
    other: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 border rounded uppercase ${map[type] || map.other}`}
    >
      {type}
    </span>
  );
}

/* ── Matrix table for financial_report ─────────────────────── */
function FinancialMatrix({
  docs,
  years,
  selectedYear,
}: {
  docs: DocItem[];
  years: number[];
  selectedYear: number | null;
}) {
  const filteredDocs = selectedYear
    ? docs.filter((d) => d.year === selectedYear)
    : docs;
  const matrixYears = selectedYear ? [selectedYear] : years.slice(0, 5);

  const matrix: Record<string, Record<number, Record<number, DocItem>>> = {};
  for (const rt of Object.keys(REPORT_TYPE_LABELS)) {
    matrix[rt] = {};
    for (const yr of matrixYears) {
      matrix[rt][yr] = {};
      for (let q = 1; q <= 4; q++) {
        const found = filteredDocs.find(
          (d) => d.reportType === rt && d.year === yr && d.quarter === q,
        );
        if (found) matrix[rt][yr][q] = found;
      }
    }
  }

  const hasAny = (rt: string) =>
    matrixYears.some((yr) => Object.values(matrix[rt][yr] || {}).length > 0);
  const totalDocs = Object.values(matrix).reduce(
    (sum, byYr) =>
      sum +
      Object.values(byYr).reduce(
        (s2, byQ) => s2 + Object.values(byQ).length,
        0,
      ),
    0,
  );

  if (totalDocs === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BarChart2 className="w-12 h-12 text-gray-200 mb-4" />
        <p className="text-gray-500 font-medium mb-1">
          Chưa có báo cáo tài chính nào
        </p>
        <p className="text-gray-400 text-sm">Dữ liệu sẽ được cập nhật sớm.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#07111D] text-white">
            <th className="text-left px-4 py-3 font-semibold text-xs whitespace-nowrap min-w-[220px]">
              Loại báo cáo
            </th>
            {matrixYears.map((yr) => (
              <th
                key={yr}
                colSpan={4}
                className="px-2 py-3 text-center font-semibold text-xs border-l border-white/10"
              >
                {yr}
              </th>
            ))}
          </tr>
          <tr className="bg-[#0d1e30] text-gray-400 text-[11px]">
            <th className="px-4 py-2" />
            {matrixYears.map((yr) =>
              QUARTERS.map((q) => (
                <th
                  key={`${yr}-${q}`}
                  className="px-2 py-2 text-center font-medium border-l border-white/5 whitespace-nowrap"
                >
                  {q}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          {Object.entries(REPORT_TYPE_LABELS).map(([rt, label]) => {
            if (!hasAny(rt)) return null;
            return (
              <tr
                key={rt}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800 text-xs leading-snug">
                  {label}
                </td>
                {matrixYears.map((yr) =>
                  ([1, 2, 3, 4] as const).map((q) => {
                    const doc = matrix[rt][yr]?.[q];
                    return (
                      <td
                        key={`${yr}-${q}`}
                        className="px-2 py-3 text-center border-l border-gray-100"
                      >
                        {doc ? (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-[#C9A24A] hover:text-[#07111D] bg-[#C9A24A]/10 hover:bg-[#C9A24A] px-2 py-1 rounded transition-all"
                          >
                            <FileDown className="w-3 h-3" />
                            {doc.fileType.toUpperCase()}
                          </a>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                    );
                  }),
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Generic document list table ─────────────────────────────── */
function DocTable({
  docs,
  total,
  page,
  pageSize,
  onPage,
  search,
  onSearch,
  onPageSize,
}: {
  docs: DocItem[];
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
  search: string;
  onSearch: (s: string) => void;
  onPageSize: (n: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          Hiển thị&nbsp;
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#C9A24A]"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          &nbsp;dữ liệu
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded text-sm w-64 focus:outline-none focus:border-[#C9A24A] placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#07111D] text-white">
              <th className="text-left px-5 py-3 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <ScrollText className="w-3.5 h-3.5 text-[#C9A24A]" /> Tên tài
                  liệu
                </span>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-xs whitespace-nowrap">
                <span className="flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#C9A24A]" /> Tải xuống
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <FileText className="w-10 h-10 text-gray-200" />
                    <p className="font-medium text-gray-500">
                      Không có tài liệu nào phù hợp.
                    </p>
                    <p className="text-xs text-gray-400">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              docs.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded bg-[#07111D]/5 text-[#C9A24A]">
                        <FileDown className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {doc.isFeatured && (
                            <span className="text-[#C9A24A] text-xs shrink-0">
                              ⭐
                            </span>
                          )}
                          <p className="font-medium text-gray-900 leading-snug group-hover:text-[#C9A24A] transition-colors">
                            {doc.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C9A24A]" />{" "}
                          {fmtDate(doc.publishedDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-col items-center gap-1 group/link"
                    >
                      <FileTypeBadge type={doc.fileType} />
                      <span className="text-[10px] text-gray-400 group-hover/link:text-[#C9A24A] transition-colors flex items-center gap-0.5">
                        <Download className="w-2.5 h-2.5" /> Tải xuống
                      </span>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Hiển thị {Math.min((page - 1) * pageSize + 1, total)} tới{" "}
            {Math.min(page * pageSize, total)} của {total} dữ liệu
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPage(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce((acc: (number | "...")[], cur, idx, arr) => {
                if (idx > 0 && cur - (arr[idx - 1] as number) > 1)
                  acc.push("...");
                acc.push(cur);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 py-1 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={`${p}-${i}`}
                    onClick={() => onPage(p as number)}
                    className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                      p === page
                        ? "bg-[#07111D] text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => onPage(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Year selector ───────────────────────────────────────────── */
function YearSelector({
  years,
  selected,
  onChange,
}: {
  years: number[];
  selected: number | null;
  onChange: (y: number | null) => void;
}) {
  if (!years.length) return null;
  return (
    <div className="mb-6">
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1.5 mb-3">
        <Calendar className="w-3 h-3 text-[#C9A24A]" /> Lọc theo năm
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange(null)}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded border transition-all ${
            selected === null
              ? "bg-[#07111D] text-white border-[#07111D]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#C9A24A] hover:text-[#C9A24A]"
          }`}
        >
          Tất cả
        </button>
        {years.map((yr) => (
          <button
            key={yr}
            onClick={() => onChange(yr)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded border transition-all ${
              selected === yr
                ? "bg-[#07111D] text-white border-[#07111D]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#C9A24A] hover:text-[#C9A24A]"
            }`}
          >
            {yr}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main DocumentsClient ─────────────────────────────────────── */
export default function DocumentsClient({
  initialDocuments,
  initialYears,
  initialTotal,
  initialError = false,
}: DocumentsClientProps) {
  const [activeTab, setActiveTab] = useState<DocumentCategory | "all">("all");
  const [docs, setDocs] = useState<DocItem[]>(initialDocuments);
  const [years, setYears] = useState<number[]>(initialYears);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(initialError);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipInitialFetch = useRef(!initialError);

  const fetchDocs = useCallback(
    async (opts: {
      tab: DocumentCategory | "all";
      yr: number | null;
      pg: number;
      ps: number;
      q: string;
    }) => {
      setLoading(true);
      setLoadError(false);
      try {
        const params = new URLSearchParams();
        if (opts.tab !== "all") params.set("category", opts.tab);
        if (opts.yr) params.set("year", String(opts.yr));
        params.set("page", String(opts.pg));
        params.set("limit", String(opts.ps));
        if (opts.q) params.set("search", opts.q);

        const res = await fetch(`/api/documents?${params}`);
        const json = await res.json();
        if (!res.ok || !json.success)
          throw new Error("Unable to load documents");
        setDocs(json.data?.documents || []);
        setTotal(json.data?.total || 0);
        setYears(json.data?.years || []);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchDocs({
        tab: activeTab,
        yr: selectedYear,
        pg: page,
        ps: pageSize,
        q: search,
      });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeTab, selectedYear, page, pageSize, search, fetchDocs]);

  function handleTab(tab: DocumentCategory | "all") {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSelectedYear(null);
  }

  function handleYear(yr: number | null) {
    setSelectedYear(yr);
    setPage(1);
  }

  function handleSearch(s: string) {
    setSearch(s);
    setPage(1);
  }

  function handlePageSize(ps: number) {
    setPageSize(ps);
    setPage(1);
  }

  return (
    <div>
      {/* Hero */}
      <PageHero
        tag="Công bố thông tin"
        heading={
          <>
            Minh Bạch &{" "}
            <span className="font-bold bg-gradient-to-r from-AXVN-gold to-AXVN-champagne bg-clip-text text-transparent">
              Trách Nhiệm
            </span>
          </>
        }
        description="AXVN Tech Holding cam kết công bố đầy đủ, kịp thời và minh bạch mọi thông tin liên quan đến hoạt động kinh doanh, tài chính và quản trị doanh nghiệp."
      />

      <section className="py-12 md:py-16 bg-[#F8F9FB] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          {/* Tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-8">
            <div className="flex gap-1 min-w-max border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                    activeTab === tab.key
                      ? "border-[#C9A24A] text-[#07111D]"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year selector */}
          <YearSelector
            years={years}
            selected={selectedYear}
            onChange={handleYear}
          />

          {loadError && (
            <p className="mb-4 text-sm text-amber-700" role="status">
              Không thể cập nhật dữ liệu mới nhất. Nội dung đang hiển thị có thể
              chưa đầy đủ.
            </p>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-2 border-[#C9A24A]/30 border-t-[#C9A24A] rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Đang tải tài liệu...</p>
            </div>
          ) : activeTab === "financial_report" ? (
            <div className="space-y-8">
              <FinancialMatrix
                docs={docs}
                years={years}
                selectedYear={selectedYear}
              />
            </div>
          ) : (
            <DocTable
              docs={docs}
              total={total}
              page={page}
              pageSize={pageSize}
              onPage={setPage}
              search={search}
              onSearch={handleSearch}
              onPageSize={handlePageSize}
            />
          )}
        </div>
      </section>
    </div>
  );
}
