"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FileText, Plus, Trash2, Search, RefreshCw,
  AlertTriangle, X, ExternalLink, Edit3, Download,
  Upload, Link2, CheckCircle2, Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AiAssistPanel, { DOC_AI_ACTIONS } from "@/components/shared/AiAssistPanel";
import { useCsrf } from "@/contexts/CsrfContext";

type DocumentCategory =
  | "financial_report"
  | "disclosure"
  | "charter"
  | "shareholder_meeting"
  | "annual_report"
  | "governance_report";

interface DocItem {
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
  isFeatured: boolean;
  status: "published" | "draft";
}

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  financial_report: "Báo cáo tài chính",
  disclosure: "Công bố thông tin",
  charter: "Điều lệ & Quy chế",
  shareholder_meeting: "Đại hội cổ đông",
  annual_report: "Báo cáo thường niên",
  governance_report: "Báo cáo quản trị",
};

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [DocumentCategory, string][];

const REPORT_TYPES = [
  { value: "", label: "— Không có —" },
  { value: "consolidated_audited", label: "Báo Cáo Hợp Nhất Kiểm Toán/Soát Xét" },
  { value: "separate_audited", label: "Báo Cáo Riêng Kiểm Toán/Soát Xét" },
  { value: "consolidated", label: "Báo Cáo Hợp Nhất" },
  { value: "separate", label: "Báo Cáo Riêng" },
  { value: "solvency", label: "Báo cáo tỷ lệ ATTC" },
];

const FILE_TYPES = ["pdf", "doc", "xlsx", "other"];
const QUARTERS = [1, 2, 3, 4] as const;

/* ── Form state ─────────────────────────────────────────────── */
const defaultForm = (): Partial<DocItem> => ({
  title: "",
  titleEn: "",
  category: "annual_report",
  fileUrl: "",
  fileType: "pdf",
  publishedDate: new Date().toISOString().slice(0, 10),
  year: new Date().getFullYear(),
  quarter: undefined,
  reportType: "",
  isFeatured: false,
  status: "published",
});

/* ── Delete Modal ────────────────────────────────────────────── */
function DeleteModal({ doc, onConfirm, onCancel, loading }: {
  doc: DocItem; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#07111D] border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 text-gvi-silver/40 hover:text-gvi-ivory transition-colors rounded-lg hover:bg-white/5">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gvi-ivory mb-1">Xóa tài liệu?</h2>
        <p className="text-gvi-silver/50 text-sm mb-5 leading-relaxed">
          Xóa vĩnh viễn <span className="text-gvi-ivory font-semibold">&ldquo;{doc.title}&rdquo;</span>. Không thể hoàn tác.
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 border border-white/10 text-gvi-silver/70 text-sm font-semibold hover:border-white/20 hover:text-gvi-ivory transition-all rounded-xl">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-500/90 hover:bg-red-500 text-white text-sm font-bold transition-all rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {loading ? "Đang xóa…" : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Document Form Modal ─────────────────────────────────────── */
function DocFormModal({ initial, onSave, onCancel, saving }: {
  initial: Partial<DocItem>;
  onSave: (data: Partial<DocItem>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { csrfFetch } = useCsrf();
  const [form, setForm] = useState<Partial<DocItem>>(initial);
  const set = (k: keyof DocItem, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  // File upload state
  const [fileTab, setFileTab] = useState<"upload" | "url">(initial.fileUrl ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(file: File) {
    if (!file) return;
    const MAX = 50 * 1024 * 1024;
    const ALLOWED = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg", "image/png", "image/webp",
    ];
    if (!ALLOWED.includes(file.type)) {
      toast.error("Loại file không hỗ trợ. Chấp nhận: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG");
      return;
    }
    if (file.size > MAX) {
      toast.error("File quá lớn. Tối đa 50MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Fake progress for UX
    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + Math.random() * 15, 85));
    }, 300);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await csrfFetch("/api/admin/documents/upload", { method: "POST", body: fd });
      const data = await res.json();
      clearInterval(interval);
      if (!res.ok || !data.success) {
        toast.error(data.message || "Upload thất bại");
        setUploadProgress(0);
        return;
      }
      setUploadProgress(100);
      set("fileUrl", data.data.url);
      setUploadedFileName(file.name);
      // auto-detect fileType
      if (file.type === "application/pdf") set("fileType", "pdf");
      else if (file.type.includes("word")) set("fileType", "doc");
      else if (file.type.includes("excel") || file.type.includes("spreadsheet")) set("fileType", "xlsx");
      else set("fileType", "other");
      toast.success("Tải file lên thành công!");
    } catch {
      clearInterval(interval);
      setUploadProgress(0);
      toast.error("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#07111D] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8">
        <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 text-gvi-silver/40 hover:text-gvi-ivory transition-colors rounded-lg hover:bg-white/5">
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-gvi-ivory mb-5">
          {initial._id ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
              Tên tài liệu (Tiếng Việt) *
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => set("title", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gvi-ivory placeholder:text-gvi-silver/30 focus:outline-none focus:border-gvi-gold/40"
              placeholder="Tên tài liệu..."
            />
          </div>

          {/* Title EN */}
          <div>
            <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
              Tên tài liệu (English)
            </label>
            <input
              type="text"
              value={form.titleEn || ""}
              onChange={(e) => set("titleEn", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gvi-ivory placeholder:text-gvi-silver/30 focus:outline-none focus:border-gvi-gold/40"
              placeholder="Document title in English..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
              Danh mục *
            </label>
            <select
              value={form.category || ""}
              onChange={(e) => set("category", e.target.value as DocumentCategory)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
            >
              {CATEGORIES.map(([k, v]) => (
                <option key={k} value={k} className="bg-[#07111D]">{v}</option>
              ))}
            </select>
          </div>

          {/* File — Tab switch: Upload vs URL */}
          <div>
            <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
              File tài liệu *
            </label>

            {/* Tab selector */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 mb-3">
              <button
                type="button"
                onClick={() => setFileTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold transition-colors ${
                  fileTab === "upload"
                    ? "bg-gvi-gold/20 text-gvi-gold border-r border-gvi-gold/20"
                    : "text-gvi-silver/50 hover:text-gvi-silver border-r border-white/10"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Tải file lên
              </button>
              <button
                type="button"
                onClick={() => setFileTab("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold transition-colors ${
                  fileTab === "url"
                    ? "bg-gvi-gold/20 text-gvi-gold"
                    : "text-gvi-silver/50 hover:text-gvi-silver"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Nhập URL
              </button>
            </div>

            {/* Upload tab */}
            {fileTab === "upload" && (
              <div>
                {/* Drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                    dragOver
                      ? "border-gvi-gold bg-gvi-gold/5"
                      : uploading
                        ? "border-white/10 bg-white/3 cursor-not-allowed"
                        : form.fileUrl && uploadedFileName
                          ? "border-green-500/40 bg-green-500/5"
                          : "border-white/15 hover:border-gvi-gold/40 hover:bg-white/3"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Loader2 className="w-8 h-8 text-gvi-gold animate-spin" />
                      <p className="text-xs text-gvi-silver/70">Đang tải lên…</p>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-gvi-gold h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gvi-silver/50">{Math.round(uploadProgress)}%</p>
                    </div>
                  ) : form.fileUrl && uploadedFileName ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                      <p className="text-sm font-semibold text-green-400">Tải lên thành công</p>
                      <p className="text-xs text-gvi-silver/60 text-center break-all max-w-xs">{uploadedFileName}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); set("fileUrl", ""); setUploadedFileName(""); setUploadProgress(0); }}
                        className="text-[10px] text-red-400/70 hover:text-red-400 mt-1"
                      >
                        Xóa và chọn lại
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gvi-silver/40" />
                      <p className="text-sm text-gvi-silver/70 font-medium text-center">
                        Kéo thả file vào đây<br />
                        <span className="text-gvi-silver/40">hoặc nhấn để chọn file</span>
                      </p>
                      <p className="text-[10px] text-gvi-silver/30 text-center">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG · Tối đa 50MB
                      </p>
                    </>
                  )}
                </div>

                {/* Hidden file input — accepts mobile camera too */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                    e.target.value = "";
                  }}
                />
              </div>
            )}

            {/* URL tab */}
            {fileTab === "url" && (
              <input
                type="text"
                value={form.fileUrl || ""}
                onChange={(e) => set("fileUrl", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gvi-ivory placeholder:text-gvi-silver/30 focus:outline-none focus:border-gvi-gold/40"
                placeholder="https://example.com/file.pdf"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* File type */}
            <div>
              <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
                Loại file
              </label>
              <select
                value={form.fileType || "pdf"}
                onChange={(e) => set("fileType", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
              >
                {FILE_TYPES.map((ft) => (
                  <option key={ft} value={ft} className="bg-[#07111D]">{ft.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
                Trạng thái
              </label>
              <select
                value={form.status || "published"}
                onChange={(e) => set("status", e.target.value as "published" | "draft")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
              >
                <option value="published" className="bg-[#07111D]">Công bố</option>
                <option value="draft" className="bg-[#07111D]">Bản nháp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Published date */}
            <div>
              <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
                Ngày công bố *
              </label>
              <input
                type="date"
                value={form.publishedDate ? form.publishedDate.slice(0, 10) : ""}
                onChange={(e) => set("publishedDate", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
                Năm *
              </label>
              <input
                type="number"
                value={form.year || ""}
                onChange={(e) => set("year", parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
                min={2000} max={2099}
              />
            </div>
          </div>

          {/* Quarter (only for financial_report) */}
          {form.category === "financial_report" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
                  Quý
                </label>
                <select
                  value={form.quarter || ""}
                  onChange={(e) => set("quarter", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
                >
                  <option value="" className="bg-[#07111D]">— Chọn quý —</option>
                  {QUARTERS.map((q) => (
                    <option key={q} value={q} className="bg-[#07111D]">Quý {q}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gvi-silver/60 uppercase tracking-wide mb-1.5 block">
                  Loại báo cáo
                </label>
                <select
                  value={form.reportType || ""}
                  onChange={(e) => set("reportType", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gvi-ivory focus:outline-none focus:border-gvi-gold/40"
                >
                  {REPORT_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value} className="bg-[#07111D]">{rt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Featured */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              className="w-4 h-4 accent-gvi-gold"
            />
            <span className="text-sm text-gvi-silver/70">⭐ Nổi bật</span>
          </label>

          {/* AI Assistant */}
          <div className="pt-1">
            <AiAssistPanel
              actions={DOC_AI_ACTIONS}
              formValues={{
                title_vi: form.title || "",
                category: CATEGORY_LABELS[form.category as DocumentCategory] || form.category || "",
                hint: form.titleEn || "",
              }}
              lang="vi"
              onApply={(action, result) => {
                if (action === "doc_title_vi") {
                  const first = result.split("\n")[0].replace(/^[-•*\d.]\s*/, "").trim();
                  set("title", first);
                } else if (action === "doc_title_en" || action === "translate_vi_en") {
                  set("titleEn", result.trim());
                } else {
                  navigator.clipboard.writeText(result);
                }
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-6">
          <button onClick={onCancel} disabled={saving} className="flex-1 py-2.5 border border-white/10 text-gvi-silver/70 text-sm font-semibold hover:border-white/20 hover:text-gvi-ivory transition-all rounded-xl">
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex-1 py-2.5 bg-gvi-gold hover:bg-gvi-champagne text-gvi-navy text-sm font-bold transition-all rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-gvi-navy/30 border-t-gvi-navy rounded-full animate-spin" /> : null}
            {saving ? "Đang lưu…" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function AdminDocumentsPage() {
  const { csrfFetch } = useCsrf();
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<DocumentCategory | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<DocItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formTarget, setFormTarget] = useState<Partial<DocItem> | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/documents")
      .then((r) => r.json())
      .then((res) => { setDocs(Array.isArray(res.data?.documents) ? res.data.documents : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await csrfFetch(`/api/admin/documents/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại");
      toast.success("Đã xóa tài liệu");
      load();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }

  async function handleSave(data: Partial<DocItem>) {
    if (!data.title || !data.fileUrl || !data.year || !data.publishedDate) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!data._id;
      const url = isEdit ? `/api/admin/documents/${data._id}` : "/api/admin/documents";
      const method = isEdit ? "PUT" : "POST";
      const res = await csrfFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Lưu thất bại");
      toast.success(isEdit ? "Cập nhật thành công" : "Thêm tài liệu thành công");
      setFormTarget(null);
      load();
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  const filtered = docs.filter((d) => {
    const matchCat = filterCat === "all" || d.category === filterCat;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || (d.titleEn || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function fmtDate(iso: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-gvi-gold/20 selection:text-gvi-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gvi-gold/4 rounded-full blur-[140px] pointer-events-none" />

        <AdminNavbar title="Tài Liệu & Công Bố Thông Tin" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gvi-ivory">Quản lý tài liệu</h1>
              <p className="text-gvi-silver/50 text-xs sm:text-sm mt-0.5">Báo cáo, công bố thông tin, điều lệ và đại hội cổ đông</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-2.5 border border-white/10 text-gvi-silver/50 hover:text-gvi-gold hover:border-gvi-gold/30 transition-all rounded-lg">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFormTarget(defaultForm())}
                className="flex items-center gap-2 px-4 py-2.5 bg-gvi-gold text-gvi-navy text-sm font-bold hover:bg-gvi-champagne transition-all rounded-lg shadow-lg shadow-gvi-gold/10"
              >
                <Plus className="w-4 h-4" /> Thêm tài liệu
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden shadow-2xl shadow-black/30">
            {/* Toolbar */}
            <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gvi-silver/40" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-gvi-ivory text-sm rounded-lg placeholder:text-gvi-silver/30 focus:outline-none focus:border-gvi-gold/40"
                />
              </div>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setFilterCat("all")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filterCat === "all" ? "bg-gvi-gold text-gvi-navy shadow" : "text-gvi-silver/50 hover:text-gvi-ivory"}`}
                >
                  Tất cả ({docs.length})
                </button>
                {CATEGORIES.map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setFilterCat(k)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${filterCat === k ? "bg-gvi-gold text-gvi-navy shadow" : "text-gvi-silver/50 hover:text-gvi-ivory"}`}
                  >
                    {v} ({docs.filter((d) => d.category === k).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-12 bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-gvi-silver/20" />
                </div>
                <p className="text-gvi-ivory/60 font-medium mb-1">Không có tài liệu nào</p>
                <p className="text-gvi-silver/30 text-sm mb-5">Thêm tài liệu đầu tiên để bắt đầu.</p>
                <button
                  onClick={() => setFormTarget(defaultForm())}
                  className="px-4 py-2 bg-gvi-gold text-gvi-navy text-sm font-bold hover:bg-gvi-champagne transition-all rounded-lg"
                >
                  Thêm tài liệu
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-wider">Tên tài liệu</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-wider hidden sm:table-cell">Danh mục</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-wider hidden md:table-cell">Năm</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-wider hidden lg:table-cell">Ngày công bố</th>
                      <th className="text-center px-4 py-3 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-wider hidden sm:table-cell">Trạng thái</th>
                      <th className="text-right px-4 py-3 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((doc) => (
                      <tr key={doc._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {doc.isFeatured && <span className="text-[#C9A24A] text-xs shrink-0">⭐</span>}
                            <div className="min-w-0">
                              <p className="font-medium text-gvi-ivory truncate max-w-[200px] sm:max-w-[280px] group-hover:text-gvi-gold transition-colors">
                                {doc.title}
                              </p>
                              <p className="text-[10px] text-gvi-silver/30 mt-0.5 uppercase">{doc.fileType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-gvi-gold/10 text-gvi-gold border border-gvi-gold/20 rounded-full">
                            {CATEGORY_LABELS[doc.category]}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gvi-silver/50 text-sm hidden md:table-cell">{doc.year}{doc.quarter ? ` Q${doc.quarter}` : ""}</td>
                        <td className="px-4 py-4 text-gvi-silver/50 text-sm hidden lg:table-cell">{doc.publishedDate ? fmtDate(doc.publishedDate) : "—"}</td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 border rounded-full ${
                            doc.status === "published"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}>
                            {doc.status === "published" ? "Công bố" : "Bản nháp"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gvi-silver/30 hover:text-gvi-ivory transition-colors rounded-lg hover:bg-white/5" title="Xem">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button onClick={() => setFormTarget({ ...doc })} className="p-1.5 text-gvi-silver/30 hover:text-gvi-gold transition-colors rounded-lg hover:bg-gvi-gold/10" title="Sửa">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget(doc)} className="p-1.5 text-gvi-silver/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10" title="Xóa">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer count */}
            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-white/5">
                <p className="text-xs text-gvi-silver/30">
                  Hiển thị <span className="text-gvi-ivory font-medium">{filtered.length}</span> / <span className="text-gvi-ivory font-medium">{docs.length}</span> tài liệu
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {deleteTarget && (
        <DeleteModal doc={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />
      )}
      {formTarget && (
        <DocFormModal initial={formTarget} onSave={handleSave} onCancel={() => setFormTarget(null)} saving={saving} />
      )}

      {/* Preview link */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="/documents"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#07111D] border border-gvi-gold/30 text-gvi-gold text-xs font-semibold rounded-xl hover:bg-gvi-gold/10 transition-all shadow-xl"
        >
          <Download className="w-3.5 h-3.5" /> Xem trang công bố
        </a>
      </div>
    </div>
  );
}
