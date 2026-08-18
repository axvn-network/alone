"use client";

/**
 * src/app/(admin)/admin/audit-log/AuditLogClient.tsx
 * Client Component — Filter bar + pagination for audit log.
 * Initial data from Server Component; filter changes trigger router.push(searchParams).
 */

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList, RefreshCw, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { timeAgo } from "@/utils/time";
import type { IAuditLog } from "@/modules/audit-log";

const ACTION_COLORS: Record<string, string> = {
  create:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  update:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delete:  "bg-red-500/10 text-red-400 border-red-500/20",
  approve: "bg-AXVN-gold/10 text-AXVN-gold border-AXVN-gold/20",
  reject:  "bg-orange-500/10 text-orange-400 border-orange-500/20",
  login:   "bg-purple-500/10 text-purple-400 border-purple-500/20",
};
function actionColor(action: string) {
  const k = Object.keys(ACTION_COLORS).find((k) => action.toLowerCase().includes(k));
  return k ? ACTION_COLORS[k] : "bg-AXVN-deep text-AXVN-silver/60 border-white/10";
}

const COLLECTIONS = [
  "", "shareholders", "blogs", "documents", "enquiries",
  "investment_plans", "settings", "admins", "partner_applications", "pages",
];

interface Props {
  logs:       IAuditLog[];
  total:      number;
  page:       number;
  totalPages: number;
}

export function AuditLogClient({ logs, total, page, totalPages }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [action,     setAction]     = useState(searchParams.get("action")     ?? "");
  const [actorId,    setActorId]    = useState(searchParams.get("actorId")    ?? "");
  const [collection, setCollection] = useState(searchParams.get("collection") ?? "");
  const [from,       setFrom]       = useState(searchParams.get("from")       ?? "");
  const [to,         setTo]         = useState(searchParams.get("to")         ?? "");

  function push(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(params)) {
      if (v) next.set(k, v); else next.delete(k);
    }
    startTransition(() => router.push(`?${next.toString()}`));
  }

  function applyFilters() {
    push({ action, actorId, collection, from, to, page: "1" });
  }
  function clearFilters() {
    setAction(""); setActorId(""); setCollection(""); setFrom(""); setTo("");
    push({ action: "", actorId: "", collection: "", from: "", to: "", page: "1" });
  }

  const hasFilters = !!(action || actorId || collection || from || to);

  const inputCls = "w-full py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg focus:outline-none focus:border-AXVN-gold/40";

  return (
    <>
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
        <button onClick={() => router.refresh()}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-AXVN-gold/20 text-AXVN-silver rounded-xl hover:border-AXVN-gold/40 hover:text-AXVN-ivory transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-AXVN-silver/30" />
            <input type="text" value={action} onChange={(e) => setAction(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Hành động (vd: shareholder.kyc)"
              className="w-full pl-8 pr-3 py-2 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/40" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-AXVN-silver/30" />
            <input type="text" value={actorId} onChange={(e) => setActorId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="ID quản trị viên"
              className="w-full pl-8 pr-3 py-2 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/40" />
          </div>
          <select value={collection} onChange={(e) => { setCollection(e.target.value); push({ collection: e.target.value, page: "1" }); }}
            className={inputCls}>
            {COLLECTIONS.map((c) => (
              <option key={c} value={c} className="bg-[#07111D]">{c ? c : "— Tất cả collection —"}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              onBlur={applyFilters} className="flex-1 py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg focus:outline-none focus:border-AXVN-gold/40" title="Từ ngày" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              onBlur={applyFilters} className="flex-1 py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-lg focus:outline-none focus:border-AXVN-gold/40" title="Đến ngày" />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={applyFilters}
            className="text-xs px-4 py-1.5 bg-AXVN-gold/10 border border-AXVN-gold/20 text-AXVN-gold rounded-lg hover:bg-AXVN-gold/20 transition-colors">
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl overflow-hidden">
        {logs.length === 0 ? (
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
                  <tr key={String(log._id)} className="border-b border-AXVN-gold/5 hover:bg-AXVN-navy/30 transition-colors">
                    <td className="px-4 py-3 text-AXVN-silver/50 text-xs whitespace-nowrap">
                      {timeAgo(String(log.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-AXVN-ivory text-xs font-medium">{log.actor?.name || "—"}</p>
                      <p className="text-AXVN-silver/40 text-[10px]">{log.actor?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-mono font-semibold px-2 py-1 border rounded-lg ${actionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-AXVN-silver/70 text-xs">{log.target?.collection}</p>
                      <p className="text-AXVN-silver/30 text-[10px] font-mono truncate max-w-[120px]">{log.target?.id}</p>
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
            <button onClick={() => push({ page: String(page - 1) })} disabled={page <= 1}
              className="p-2 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 transition-colors disabled:opacity-30">
              <ChevronLeft className="w-4 h-4 text-AXVN-silver" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              return (
                <button key={p} onClick={() => push({ page: String(p) })}
                  className={`w-8 h-8 text-xs rounded-lg border transition-colors ${p === page ? "bg-AXVN-gold text-AXVN-navy border-AXVN-gold font-bold" : "border-AXVN-gold/20 text-AXVN-silver/60 hover:border-AXVN-gold/40 hover:text-AXVN-ivory"}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => push({ page: String(page + 1) })} disabled={page >= totalPages}
              className="p-2 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 transition-colors disabled:opacity-30">
              <ChevronRight className="w-4 h-4 text-AXVN-silver" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
