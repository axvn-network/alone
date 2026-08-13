"use client";

import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { ClipboardList, RefreshCw, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { timeAgo } from "@/utils/time";

interface AuditEntry {
  _id: string;
  actor: { id: string; name: string; email: string };
  action: string;
  target: { collection: string; id: string };
  ip: string;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  update: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delete: "bg-red-500/10 text-red-400 border-red-500/20",
  approve: "bg-AXVN-gold/10 text-AXVN-gold border-AXVN-gold/20",
  reject: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  login: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function actionColor(action: string) {
  const keyword = Object.keys(ACTION_COLORS).find((k) => action.toLowerCase().includes(k));
  return keyword ? ACTION_COLORS[keyword] : "bg-AXVN-deep text-AXVN-silver/60 border-white/10";
}

const COLLECTIONS = [
  "", "shareholders", "blogs", "documents", "enquiries",
  "investment_plans", "settings", "admins", "partner_applications", "pages",
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [action, setAction] = useState("");
  const [actorId, setActorId] = useState("");
  const [collection, setCollection] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const limit = 50;

  const fetchLogs = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (action) params.set("action", action);
      if (actorId) params.set("actorId", actorId);
      if (collection) params.set("collection", collection);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`/api/admin/audit-log?${params}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data.logs || []);
        setTotal(data.data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [action, actorId, collection, from, to]);

  // When filters change: reset to page 1 and fetch (single effect)
  useEffect(() => {
    setPage(1);
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, actorId, collection, from, to]);

  // When page changes (via pagination buttons): fetch new page
  useEffect(() => { fetchLogs(page); }, [page, fetchLogs]);

  function clearFilters() {
    setAction(""); setActorId(""); setCollection(""); setFrom(""); setTo("");
  }

  const hasFilters = !!(action || actorId || collection || from || to);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#03080e] flex font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <AdminNavbar title="Nhật Ký Hoạt Động" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-AXVN-gold/10 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-AXVN-gold" />
              </div>
              <div>
                <h2 className="text-AXVN-ivory font-semibold">Nhật ký hành động quản trị</h2>
                <p className="text-AXVN-silver/50 text-xs">{total.toLocaleString("vi-VN")} bản ghi · tự xóa sau 365 ngày</p>
              </div>
            </div>
            <button
              onClick={() => fetchLogs(page)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-AXVN-gold/20 text-AXVN-silver rounded-xl hover:border-AXVN-gold/40 hover:text-AXVN-ivory transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Làm mới
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-4 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-AXVN-silver/50 text-xs font-semibold uppercase tracking-wider">Bộ lọc</p>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-AXVN-silver/40 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" /> Xóa bộ lọc
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Action search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-AXVN-silver/30" />
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="Hành động (vd: shareholder.kyc)"
                  className="w-full pl-8 pr-3 py-2 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/40"
                />
              </div>

              {/* Actor ID */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-AXVN-silver/30" />
                <input
                  type="text"
                  value={actorId}
                  onChange={(e) => setActorId(e.target.value)}
                  placeholder="ID quản trị viên"
                  className="w-full pl-8 pr-3 py-2 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/40"
                />
              </div>

              {/* Collection */}
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg focus:outline-none focus:border-AXVN-gold/40"
              >
                {COLLECTIONS.map((c) => (
                  <option key={c} value={c} className="bg-[#07111D]">
                    {c ? c : "— Tất cả collection —"}
                  </option>
                ))}
              </select>

              {/* Date range */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="flex-1 py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg focus:outline-none focus:border-AXVN-gold/40"
                  title="Từ ngày"
                />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-1 py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg focus:outline-none focus:border-AXVN-gold/40"
                  title="Đến ngày"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl overflow-hidden">
            {loading && logs.length === 0 ? (
              <div className="flex justify-center py-20">
                <RefreshCw className="w-6 h-6 text-AXVN-gold animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-AXVN-silver/40 text-sm">
                {hasFilters ? "Không tìm thấy bản ghi nào với bộ lọc hiện tại." : "Chưa có nhật ký nào."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-AXVN-gold/10 text-AXVN-silver/50 text-[11px] uppercase tracking-widest">
                      <th className="text-left px-4 py-3">Thời gian</th>
                      <th className="text-left px-4 py-3">Quản trị viên</th>
                      <th className="text-left px-4 py-3">Hành động</th>
                      <th className="text-left px-4 py-3">Đối tượng</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id} className="border-b border-AXVN-gold/5 hover:bg-AXVN-navy/30 transition-colors">
                        <td className="px-4 py-3 text-AXVN-silver/50 text-xs whitespace-nowrap">
                          {timeAgo(log.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-AXVN-ivory text-xs font-medium">{log.actor.name || "—"}</p>
                          <p className="text-AXVN-silver/40 text-[10px]">{log.actor.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-mono font-semibold px-2 py-1 border rounded-lg ${actionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-AXVN-silver/70 text-xs">{log.target.collection}</p>
                          <p className="text-AXVN-silver/30 text-[10px] font-mono truncate max-w-[120px]">
                            {log.target.id}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-AXVN-silver/40 text-xs font-mono hidden md:table-cell">
                          {log.ip || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-AXVN-silver/50">
              <p>Trang {page} / {totalPages} · {total.toLocaleString("vi-VN")} bản ghi</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 text-AXVN-silver" />
                </button>
                {/* Page numbers — show up to 5 around current */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs rounded-lg border transition-colors ${p === page
                          ? "bg-AXVN-gold text-AXVN-navy border-AXVN-gold font-bold"
                          : "border-AXVN-gold/20 text-AXVN-silver/60 hover:border-AXVN-gold/40 hover:text-AXVN-ivory"
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 text-AXVN-silver" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
