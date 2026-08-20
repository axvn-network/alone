"use client";

/**
 * src/modules/capital-transactions/components/CapTxActions.tsx
 *
 * Client Component — Modals cho tạo Capital Call và xét duyệt Deposit.
 * Nhận initial data từ Server Component (qua props), gọi Server Actions cho mutations.
 * revalidatePath() trong action tự cập nhật list — không cần manual reload.
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { DollarSign, Send, CheckCircle2, XCircle } from "lucide-react";
import { formatVNDCompact } from "@/core/vn-utils/vn-lib/format";
import { createCapTxAction, updateCapTxStatusAction } from "../actions";
import type { CapitalTx } from "../types";

interface Shareholder {
  _id: string;
  name: string;
  email: string;
}

// ─── Capital Call Modal ────────────────────────────────────────────────────────

interface CapCallModalProps {
  shareholders: Shareholder[];
  onClose: () => void;
}

export function CapCallModal({ shareholders, onClose }: CapCallModalProps) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    shareholderId: "",
    amount: "",
    description: "",
    referenceNo: "",
    adminNote: "",
  });

  const inputCls =
    "w-full px-3 py-2.5 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory text-sm rounded-xl focus:outline-none focus:border-AXVN-gold/40 transition-colors";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Math.round(Number(form.amount));
    if (!form.shareholderId || !amount) {
      toast.error("Chọn cổ đông và nhập số tiền");
      return;
    }

    startTransition(async () => {
      const result = await createCapTxAction({
        shareholderId: form.shareholderId,
        type: "capital_call",
        amount,
        description: form.description,
        referenceNo: form.referenceNo,
        adminNote: form.adminNote,
        proofUrl: "",
      });

      if (!result.success) {
        toast.error(result.message ?? "Tạo thất bại");
        return;
      }
      toast.success("Đã tạo yêu cầu góp vốn");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#03080e] border border-AXVN-gold/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-AXVN-gold/10">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-AXVN-gold" />
            <h2 className="text-AXVN-ivory font-bold">Tạo Capital Call</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-AXVN-silver hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1.5">
              Cổ đông *
            </label>
            <select
              required
              value={form.shareholderId}
              onChange={(e) =>
                setForm((p) => ({ ...p, shareholderId: e.target.value }))
              }
              className={inputCls}
            >
              <option value="">— Chọn cổ đông —</option>
              {shareholders.map((sh) => (
                <option key={sh._id} value={sh._id}>
                  {sh.name} ({sh.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1.5">
                Số tiền (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                placeholder="500000000"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1.5">
                Đợt / Mã
              </label>
              <input
                type="text"
                value={form.referenceNo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, referenceNo: e.target.value }))
                }
                placeholder="DOT-001"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1.5">
              Mô tả
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Góp vốn đợt 1 theo kế hoạch Q1/2025"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1.5">
              Ghi chú nội bộ
            </label>
            <input
              type="text"
              value={form.adminNote}
              onChange={(e) =>
                setForm((p) => ({ ...p, adminNote: e.target.value }))
              }
              placeholder="Thông tin tài khoản ngân hàng nhận chuyển khoản..."
              className={inputCls}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-AXVN-gold text-AXVN-navy font-bold text-sm rounded-xl hover:bg-AXVN-champagne transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {pending ? "Đang tạo..." : "Tạo Capital Call"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-AXVN-gold/20 text-AXVN-silver text-sm rounded-xl hover:bg-AXVN-deep transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Approve / Reject Deposit Modal ───────────────────────────────────────────

interface ReviewModalProps {
  tx: CapitalTx;
  onClose: () => void;
}

export function ReviewModal({ tx, onClose }: ReviewModalProps) {
  const [pending, startTransition] = useTransition();
  const [adminNote, setAdminNote] = useState("");

  function handleAction(status: "confirmed" | "rejected") {
    startTransition(async () => {
      const result = await updateCapTxStatusAction({
        id: tx._id,
        status,
        adminNote,
      });

      if (!result.success) {
        toast.error(result.message ?? "Thất bại");
        return;
      }
      toast.success(
        status === "confirmed"
          ? "Đã xác nhận giao dịch và cộng capitalPaid"
          : "Đã từ chối giao dịch",
      );
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#03080e] border border-AXVN-gold/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-AXVN-gold/10">
          <h2 className="text-AXVN-ivory font-bold text-sm">
            Xét duyệt chuyển khoản
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-AXVN-silver hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-AXVN-navy rounded-xl p-4 text-xs text-AXVN-silver/60 space-y-1">
            <p>
              <span className="text-AXVN-silver/40">Cổ đông:</span>{" "}
              <span className="text-AXVN-ivory">{tx.shareholderName}</span>
            </p>
            <p>
              <span className="text-AXVN-silver/40">Số tiền:</span>{" "}
              <span className="text-AXVN-gold font-bold">
                {formatVNDCompact(tx.amount)} {tx.currency}
              </span>
            </p>
            {tx.referenceNo && (
              <p>
                <span className="text-AXVN-silver/40">Ref:</span>{" "}
                {tx.referenceNo}
              </p>
            )}
            {tx.description && (
              <p>
                <span className="text-AXVN-silver/40">Mô tả:</span>{" "}
                {tx.description}
              </p>
            )}
            {tx.proofUrl && (
              <p>
                <a
                  href={tx.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-AXVN-gold underline"
                >
                  Xem bằng chứng chuyển khoản →
                </a>
              </p>
            )}
          </div>

          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1.5">
              Ghi chú admin
            </label>
            <input
              type="text"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Đã xác minh sao kê tháng 01/2025..."
              className="w-full px-3 py-2.5 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory text-sm rounded-xl focus:outline-none focus:border-AXVN-gold/40 transition-colors"
            />
          </div>

          <p className="text-AXVN-gold/50 text-[11px] leading-relaxed">
            ⚠️ Xác nhận sẽ cộng{" "}
            <strong>{formatVNDCompact(tx.amount)} VNĐ</strong> vào{" "}
            <code>capitalPaid</code> của cổ đông này.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleAction("confirmed")}
              disabled={pending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold rounded-xl hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {pending ? "..." : "Xác nhận"}
            </button>
            <button
              onClick={() => handleAction("rejected")}
              disabled={pending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {pending ? "..." : "Từ chối"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-white/10 text-AXVN-silver/40 text-sm rounded-xl hover:border-white/20 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
