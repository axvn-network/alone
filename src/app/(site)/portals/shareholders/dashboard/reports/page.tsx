"use client";

/**
 * /portals/shareholders/dashboard/reports
 *
 * Trang báo cáo tiến độ đầu tư dành cho Cổ Đông.
 * Hiển thị:
 *   - Tổng quan kế hoạch đầu tư của cổ đông (vốn cam kết, đã góp, % cổ phần)
 *   - Trạng thái KYC
 *   - Danh sách các gói đầu tư đang mở
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  ChevronLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  DollarSign,
  Percent,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface Me {
  id: string;
  name: string;
  email: string;
  role: string;
  equityPercent: number;
  capitalCommitted: number;
  capitalPaid: number;
  kycStatus?: string;
}

interface InvestmentPlan {
  _id: string;
  tier: string;
  name: string;
  tagline: string;
  minCommitment: number;
  maxCommitment: number;
  equityRange: string;
  duration: string;
  benefits: string[];
  status: string;
}

// Format số tiền VNĐ
function fVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN");
}

// Trạng thái KYC
const KYC_CONFIG: Record<
  string,
  { label: string; cls: string; icon: typeof CheckCircle2 }
> = {
  approved: {
    label: "Đã xác minh",
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Đang xét duyệt",
    cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: Clock,
  },
  not_started: {
    label: "Chưa xác minh",
    cls: "bg-AXVN-silver/10 text-AXVN-silver/60 border-white/10",
    icon: AlertCircle,
  },
  rejected: {
    label: "Từ chối",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: AlertCircle,
  },
};

// Màu tier gói đầu tư
const TIER_COLORS: Record<string, string> = {
  seed: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-300",
  growth: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-300",
  expansion:
    "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-300",
  strategic:
    "from-AXVN-gold/20 to-AXVN-gold/5 border-AXVN-gold/20 text-AXVN-gold",
  anchor: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-300",
};

export default function ShareholderReportsPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        // Lấy thông tin cổ đông
        const meRes = await fetch("/api/shareholders/auth", {
          credentials: "include",
        });
        if (meRes.status === 401) {
          router.push("/portals/shareholders/login");
          return;
        }
        const meData = await meRes.json();
        if (meData.success) setMe(meData.data);

        // Lấy gói đầu tư đang mở
        const plansRes = await fetch("/api/investment-plans");
        const plansData = await plansRes.json();
        if (plansData.success) {
          setPlans(
            (plansData.data as InvestmentPlan[]).filter(
              (p) => p.status === "active",
            ),
          );
        }
      } finally {
        setLoading(false);
      }
    }
    void fetchAll();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-AXVN-navy flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-AXVN-gold animate-spin" />
      </div>
    );
  }

  const kyc =
    KYC_CONFIG[me?.kycStatus ?? "not_started"] ?? KYC_CONFIG.not_started;
  const KycIcon = kyc.icon;

  // Tiến độ vốn góp
  const paidPercent =
    me && me.capitalCommitted > 0
      ? Math.min(100, Math.round((me.capitalPaid / me.capitalCommitted) * 100))
      : 0;

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
            <TrendingUp className="w-4 h-4 text-AXVN-gold" />
            <h1 className="text-sm font-semibold text-AXVN-ivory">
              Báo Cáo Đầu Tư
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* ── Thẻ tổng quan cổ đông ─────────────────────────────────── */}
        {me && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Vốn cam kết */}
            <div className="bg-[#06101a] border border-AXVN-gold/10 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-lg bg-AXVN-gold/10 flex items-center justify-center mb-3">
                <DollarSign className="w-4 h-4 text-AXVN-gold" />
              </div>
              <p className="text-AXVN-ivory font-bold text-lg">
                {fVND(me.capitalCommitted)}
              </p>
              <p className="text-AXVN-silver/50 text-xs mt-0.5">
                Vốn cam kết (VNĐ)
              </p>
            </div>

            {/* Vốn đã góp */}
            <div className="bg-[#06101a] border border-emerald-500/15 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-AXVN-ivory font-bold text-lg">
                {fVND(me.capitalPaid)}
              </p>
              <p className="text-AXVN-silver/50 text-xs mt-0.5">
                Vốn đã góp (VNĐ)
              </p>
            </div>

            {/* Cổ phần */}
            <div className="bg-[#06101a] border border-blue-500/15 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Percent className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-AXVN-ivory font-bold text-lg">
                {me.equityPercent}%
              </p>
              <p className="text-AXVN-silver/50 text-xs mt-0.5">
                Tỷ lệ cổ phần
              </p>
            </div>

            {/* KYC */}
            <div className={`bg-[#06101a] border rounded-2xl p-5 ${kyc.cls}`}>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <KycIcon className="w-4 h-4 shrink-0" />
                <p className="font-semibold text-sm">{kyc.label}</p>
              </div>
              <p className="text-AXVN-silver/50 text-xs mt-0.5">
                Trạng thái KYC
              </p>
            </div>
          </div>
        )}

        {/* ── Thanh tiến độ vốn góp ─────────────────────────────────── */}
        {me && me.capitalCommitted > 0 && (
          <div className="bg-[#06101a] border border-AXVN-gold/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-AXVN-ivory text-sm font-semibold">
                Tiến độ Góp Vốn
              </h2>
              <span className="text-AXVN-gold text-sm font-bold">
                {paidPercent}%
              </span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-AXVN-gold to-AXVN-champagne rounded-full transition-all duration-700"
                style={{ width: `${paidPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-AXVN-silver/40">
              <span>Đã góp: {fVND(me.capitalPaid)} VNĐ</span>
              <span>
                Còn lại: {fVND(me.capitalCommitted - me.capitalPaid)} VNĐ
              </span>
            </div>
          </div>
        )}

        {/* ── Gói đầu tư đang mở ────────────────────────────────────── */}
        {plans.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-AXVN-gold" />
              <h2 className="text-AXVN-ivory text-sm font-semibold">
                Gói Hợp Tác Đang Mở
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const tierCls =
                  TIER_COLORS[plan.tier] ??
                  "from-white/5 to-white/5 border-white/10 text-AXVN-silver";
                return (
                  <div
                    key={plan._id}
                    className={`relative bg-gradient-to-b ${tierCls} border rounded-2xl p-5 overflow-hidden`}
                  >
                    {/* Tier badge */}
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-3 block">
                      {plan.tier}
                    </span>
                    <h3 className="font-semibold text-AXVN-ivory text-sm mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-AXVN-silver/50 text-xs mb-4 leading-relaxed line-clamp-2">
                      {plan.tagline}
                    </p>

                    <div className="space-y-1.5 text-xs text-AXVN-silver/60">
                      <div className="flex justify-between">
                        <span>Vốn tối thiểu</span>
                        <span className="text-AXVN-ivory font-medium">
                          {fVND(plan.minCommitment)} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cổ phần</span>
                        <span className="text-AXVN-ivory font-medium">
                          {plan.equityRange}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thời hạn</span>
                        <span className="text-AXVN-ivory font-medium">
                          {plan.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Ghi chú pháp lý ───────────────────────────────────────── */}
        <div className="bg-[#06101a] border border-white/6 rounded-2xl p-5">
          <p className="text-AXVN-silver/40 text-xs leading-relaxed">
            <span className="font-semibold text-AXVN-silver/60">
              Lưu ý pháp lý:
            </span>{" "}
            Thông tin trong trang này chỉ mang tính tham khảo nội bộ dành cho cổ
            đông đã được xác minh. Không cấu thành lời khuyên đầu tư hay cam kết
            lợi nhuận. Mọi giao dịch vốn góp cần được xác nhận bằng văn bản theo
            đúng quy định pháp luật.
          </p>
        </div>
      </div>
    </div>
  );
}
