"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { RefreshCw, CheckCircle2, XCircle, Clock, FileSearch, ChevronLeft, ChevronRight, Search, X, Eye } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useCsrf } from "@/contexts/CsrfContext";
import {
  ROLE_LABELS, APPLICATION_STATUS_LABELS as STATUS_LABELS,
  APPLICATION_STATUS_CLS as STATUS_CLS, ADMIN_PAGE_CLS,
} from "@/constants/admin";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  desiredRole: string;
  suggestedRole: string;
  capitalRange: string;
  status: "draft" | "submitted" | "under_review" | "shortlisted" | "approved" | "rejected";
  adminNotes: string;
  assessmentScore: { technical: number; financial: number; legal: number; strategic: number; network: number };
  consentGiven: boolean;
  createdAt: string;
}

const STATUS_OPTS = ["", "submitted", "under_review", "shortlisted", "approved", "rejected"] as const;

export default function PartnerApplicationsPage() {
  const { csrfFetch } = useCsrf();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Application | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      if (filterRole) params.set("role", filterRole);
      const res = await fetch(`/api/admin/partner-applications?${params}`);
      const json = await res.json();
      if (json.success) {
        setApps(json.data.docs || []);
        setTotalPages(json.data.totalPages || 1);
      }
    } catch { toast.error("Không tải được danh sách"); }
    finally { setLoading(false); }
  }, [page, search, filterStatus, filterRole]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    setSaving(true);
    try {
      const res = await csrfFetch(`/api/admin/partner-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(notes !== undefined ? { adminNotes: notes } : {}) }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Cập nhật thành công");
        setSelected(null);
        load();
      } else {
        toast.error(json.message || "Lỗi cập nhật");
      }
    } catch { toast.error("Lỗi kết nối"); }
    finally { setSaving(false); }
  };

  const scoreAvg = (s: Application["assessmentScore"]) =>
    Math.round((s.technical + s.financial + s.legal + s.strategic + s.network) / 5);

  return (
    <div className={ADMIN_PAGE_CLS}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminNavbar title="Đơn Đăng Ký Hợp Tác" />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gvi-silver/40" />
              <input
                className="w-full pl-9 pr-4 py-2 bg-gvi-deep border border-gvi-gold/20 rounded-lg text-sm text-white placeholder-gvi-silver/40 focus:outline-none focus:border-gvi-gold/40"
                placeholder="Tìm tên, email, công ty..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3 h-3" /></button>}
            </div>
            <select
              className="px-3 py-2 bg-gvi-deep border border-gvi-gold/20 rounded-lg text-sm text-gvi-silver focus:outline-none"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            >
              <option value="">Tất cả trạng thái</option>
              {STATUS_OPTS.filter(Boolean).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 bg-gvi-deep border border-gvi-gold/20 rounded-lg text-sm text-gvi-silver focus:outline-none"
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
            >
              <option value="">Tất cả vai trò</option>
              {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <button onClick={load} className="p-2 border border-gvi-gold/20 rounded-lg hover:border-gvi-gold/40 transition-colors">
              <RefreshCw className={`w-4 h-4 text-gvi-silver ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Table */}
          <div className="bg-gvi-deep border border-gvi-gold/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gvi-gold/10">
                <tr className="text-left text-gvi-silver/60 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3">Ứng viên</th>
                  <th className="px-4 py-3 hidden md:table-cell">Vai trò</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Điểm TB</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 hidden md:table-cell">Ngày nộp</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gvi-gold/5">
                {loading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gvi-silver/40">Đang tải...</td></tr>
                ) : apps.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gvi-silver/40"><FileSearch className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>Không có đơn nào</p></td></tr>
                ) : apps.map((app) => (
                  <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{app.fullName}</p>
                      <p className="text-gvi-silver/50 text-xs">{app.email}</p>
                      {app.company && <p className="text-gvi-silver/40 text-xs">{app.company}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs">{ROLE_LABELS[app.desiredRole] || app.desiredRole}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-bold text-gvi-gold">{scoreAvg(app.assessmentScore)}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${STATUS_CLS[app.status] || ""}`}>
                        {STATUS_LABELS[app.status] || app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gvi-silver/50 text-xs">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setSelected(app); setNotesDraft(app.adminNotes || ""); }}
                        className="p-1.5 border border-gvi-gold/20 rounded-lg hover:border-gvi-gold/50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 text-gvi-gold" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 border border-gvi-gold/20 rounded-lg disabled:opacity-30">
                <ChevronLeft className="w-4 h-4 text-gvi-silver" />
              </button>
              <span className="text-gvi-silver/60 text-sm">Trang {page}/{totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 border border-gvi-gold/20 rounded-lg disabled:opacity-30">
                <ChevronRight className="w-4 h-4 text-gvi-silver" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl bg-gvi-deep border border-gvi-gold/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gvi-gold/10 bg-gvi-deep z-10">
              <div>
                <h3 className="font-bold text-white">{selected.fullName}</h3>
                <p className="text-gvi-silver/60 text-xs">{selected.email} · {ROLE_LABELS[selected.desiredRole]}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 border border-gvi-gold/20 rounded-lg hover:border-gvi-gold/50">
                <X className="w-4 h-4 text-gvi-silver" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Scores */}
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(selected.assessmentScore).map(([k, v]) => (
                  <div key={k} className="text-center p-3 bg-white/[0.03] rounded-xl border border-gvi-gold/10">
                    <p className="text-gvi-gold font-bold text-xl">{v}</p>
                    <p className="text-gvi-silver/50 text-xs mt-1 capitalize">{k}</p>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                {selected.company && <p className="text-gvi-silver/70"><span className="text-gvi-silver/40">Tổ chức:</span> {selected.company} {selected.position && `— ${selected.position}`}</p>}
                {selected.capitalRange && <p className="text-gvi-silver/70"><span className="text-gvi-silver/40">Vốn:</span> {selected.capitalRange}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-gvi-silver/50 mb-1">Ghi chú admin</label>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  className="w-full bg-black/20 border border-gvi-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gvi-gold/40 resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["under_review", "shortlisted", "approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    disabled={saving || selected.status === s}
                    onClick={() => updateStatus(selected._id, s, notesDraft)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-40
                      ${s === "approved" ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10" :
                        s === "rejected" ? "border-red-500/50 text-red-400 hover:bg-red-500/10" :
                        "border-gvi-gold/30 text-gvi-gold hover:bg-gvi-gold/10"}`}
                  >
                    {s === "approved" ? <CheckCircle2 className="w-3.5 h-3.5" /> : s === "rejected" ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              {/* Save notes only */}
              <button
                disabled={saving || notesDraft === (selected.adminNotes || "")}
                onClick={() => updateStatus(selected._id, selected.status, notesDraft)}
                className="w-full py-2 text-sm font-medium border border-gvi-gold/30 text-gvi-gold rounded-lg hover:bg-gvi-gold/10 transition-colors disabled:opacity-40"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
