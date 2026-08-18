"use client";

/**
 * src/modules/capital-transactions/components/CapTxTable.tsx
 *
 * Client Component — Bảng danh sách + phân trang + bộ lọc.
 * State filter/page là local; thay đổi trigger router.push() để Server Component
 * re-render với searchParams mới — không cần fetch() thủ công.
 */

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { formatVNDCompact } from "@/core/vn-utils/vn-lib/format";
import { TX_TYPE_LABEL, CAPITAL_TX_STATUS_CONFIG } from "@/constants/admin";
import { CapCallModal, ReviewModal } from "./CapTxActions";
import type { CapitalTx } from "../types";

interface Shareholder { _id: string; name: string; email: string }

interface CapTxTableProps {
  txs:          CapitalTx[];
  total:        number;
  page:         number;
  totalPages:   number;
  shareholders: Shareholder[];
}

export function CapTxTable({ txs, total, page, totalPages, shareholders }: CapTxTableProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [showCallForm, setShowCallForm] = useState(false);
  const [reviewTx, setReviewTx]         = useState<CapitalTx | null>(null);

  function push(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(params)) {
      if (v) next.set(k, v); else next.delete(k);
    }
    router.push(`?${next.toString()}`);
  }

  const filterStatus = searchParams.get("status") ?? "";
  const filterType   = searchParams.get("type")   ?? "";

  const inputCls =
    "px-3 py-2 bg-[#03080e] border border-white/10 text-AXVN-ivory text-xs rounded-xl focus:outline-none focus:border-AXVN-gold/40 transition-colors";

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-AXVN-ivory font-bold text-xl">Quản Lý Giao Dịch Vốn</h1>
          <p className="text-AXVN-silver/50 text-xs mt-1">{total} giao dịch</p>
        </div>
        <button
          onClick={() => setShowCallForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-AXVN-gold text-AXVN-navy text-sm font-bold rounded-xl hover:bg-AXVN-champagne transition-colors">
          <Plus className="w-4 h-4" /> Tạo Capital Call
        </button>
      </div>

      {/* ── Bộ lọc ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center bg-[#03080e] border border-white/6 rounded-2xl px-4 py-3">
        <Search className="w-3.5 h-3.5 text-AXVN-silver/30" />
        <select
          value={filterType}
          onChange={(e) => push({ type: e.target.value, page: "1" })}
          className={inputCls}>
          <option value="">— Tất cả loại —</option>
          <option value="capital_call">Yêu cầu góp vốn</option>
          <option value="deposit">Chuyển khoản</option>
          <option value="payment_confirm">Xác nhận nhận vốn</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => push({ status: e.target.value, page: "1" })}
          className={inputCls}>
          <option value="">— Tất cả trạng thái —</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="rejected">Từ chối</option>
        </select>
        <button
          onClick={() => push({ type: "", status: "", page: "1" })}
          className="text-xs text-AXVN-silver/40 hover:text-AXVN-gold underline underline-offset-2 transition-colors ml-auto">
          Xóa lọc
        </button>
        <button
          onClick={() => router.refresh()}
          className="p-2 border border-white/10 text-AXVN-silver/30 rounded-xl hover:border-AXVN-gold/30 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Bảng ───────────────────────────────────────────────────── */}
      <div className="bg-[#03080e] border border-AXVN-gold/10 rounded-2xl overflow-hidden">
        {txs.length === 0 ? (
          <p className="text-center text-AXVN-silver/40 py-16 text-sm">Chưa có giao dịch nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-AXVN-gold/10 text-AXVN-silver/50 text-[11px] uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Cổ đông</th>
                  <th className="text-left px-4 py-3">Loại</th>
                  <th className="text-right px-4 py-3">Số tiền</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Ngày</th>
                  <th className="text-right px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => {
                  const cfg     = CAPITAL_TX_STATUS_CONFIG[tx.status] ?? CAPITAL_TX_STATUS_CONFIG.pending;
                  const CfgIcon = cfg.icon;
                  return (
                    <tr key={tx._id} className="border-b border-AXVN-gold/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-AXVN-ivory text-xs font-medium">{tx.shareholderName}</p>
                        <p className="text-AXVN-silver/40 text-[11px]">{tx.shareholderEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-AXVN-silver/60 text-xs">
                        {TX_TYPE_LABEL[tx.type] || tx.type}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-AXVN-ivory text-xs font-bold">
                          {formatVNDCompact(tx.amount)}
                        </span>
                        <span className="text-AXVN-silver/30 text-[10px] ml-1">{tx.currency}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cfg.cls}`}>
                          <CfgIcon className="w-2.5 h-2.5" />{cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-AXVN-silver/40 text-[11px]">
                        {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {tx.type === "deposit" && tx.status === "pending" && (
                          <button
                            onClick={() => setReviewTx(tx)}
                            className="text-xs px-2.5 py-1.5 border border-AXVN-gold/30 text-AXVN-gold rounded-lg hover:bg-AXVN-gold/10 transition-colors">
                            Xét duyệt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Phân trang ─────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-AXVN-silver/40">
          <span>Trang {page}/{totalPages} · {total} giao dịch</span>
          <div className="flex gap-2">
            <button
              onClick={() => push({ page: String(page - 1) })}
              disabled={page <= 1}
              className="p-1.5 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => push({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className="p-1.5 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────── */}
      {showCallForm && (
        <CapCallModal
          shareholders={shareholders}
          onClose={() => setShowCallForm(false)}
        />
      )}
      {reviewTx && (
        <ReviewModal
          tx={reviewTx}
          onClose={() => setReviewTx(null)}
        />
      )}
    </>
  );
}
