"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Shield,
  FileText,
  X,
  Sprout,
  Rocket,
  TrendingUp,
  Landmark,
  Anchor,
  User,
  Building2,
  Globe,
} from "lucide-react";

interface Plan {
  _id: string;
  tier: string;
  name: string;
  nameEn: string;
  tagline: string;
  minCommitment: number;
  maxCommitment: number;
  currency: string;
  duration: string;
  equityRange: string;
  benefits: string[];
  conditions: string[];
  rights: string[];
  obligations: string[];
  documents: string[];
  highlighted: boolean;
  badge: string;
  shareholderType: string;
}

const TIER_COLORS: Record<string, string> = {
  seed:        "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  growth:      "from-sky-500/20 to-sky-500/5 border-sky-500/30",
  expansion:   "from-fortress-gold/20 to-fortress-gold/5 border-fortress-gold/40",
  strategic:   "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  anchor:      "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  individual:  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  institution: "from-fortress-gold/20 to-fortress-gold/5 border-fortress-gold/40",
  foreign:     "from-purple-500/20 to-purple-500/5 border-purple-500/30",
};

const TIER_ACCENT: Record<string, string> = {
  seed:        "text-emerald-400",
  growth:      "text-sky-400",
  expansion:   "text-fortress-gold",
  strategic:   "text-blue-400",
  anchor:      "text-purple-400",
  individual:  "text-emerald-400",
  institution: "text-fortress-gold",
  foreign:     "text-purple-400",
};

const TIER_ICON_BG: Record<string, string> = {
  seed:        "bg-emerald-500/15",
  growth:      "bg-sky-500/15",
  expansion:   "bg-fortress-gold/15",
  strategic:   "bg-blue-500/15",
  anchor:      "bg-purple-500/15",
  individual:  "bg-emerald-500/15",
  institution: "bg-fortress-gold/15",
  foreign:     "bg-purple-500/15",
};

type LucideIcon = React.ComponentType<{ className?: string }>;

const TIER_ICON: Record<string, LucideIcon> = {
  seed:        Sprout,
  growth:      Rocket,
  expansion:   TrendingUp,
  strategic:   Landmark,
  anchor:      Anchor,
  individual:  User,
  institution: Building2,
  foreign:     Globe,
};

function TierIcon({ tier, className }: { tier: string; className?: string }) {
  const Icon = TIER_ICON[tier] || Building2;
  return <Icon className={className} />;
}

function formatVND(n: number): string {
  if (n === 0) return "Thương lượng";
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toLocaleString("vi-VN")} nghìn tỷ VNĐ`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString("vi-VN")} tỷ VNĐ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("vi-VN")} triệu VNĐ`;
  return n.toLocaleString("vi-VN") + " VNĐ";
}

export default function InvestmentPlansClient() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [tab, setTab] = useState<"rights" | "obligations" | "documents">("rights");

  useEffect(() => {
    fetch("/api/investment-plans")
      .then((r) => r.json())
      .then((res) => { setPlans(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Reset tab when plan changes
  useEffect(() => { setTab("rights"); }, [selected?._id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 text-fortress-gold animate-spin" />
    </div>
  );

  if (plans.length === 0) return (
    <div className="text-center py-24 text-fortress-silver/50 text-sm">
      Các hạng mục hợp tác đang được cập nhật. Vui lòng quay lại sau.
    </div>
  );

  return (
    <>
      {/* ─── Plan cards ─────────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const accent   = TIER_ACCENT[plan.tier]   || "text-fortress-gold";
          const colors   = TIER_COLORS[plan.tier]   || "from-fortress-gold/10 to-fortress-gold/5 border-fortress-gold/20";
          const iconBg   = TIER_ICON_BG[plan.tier]  || "bg-fortress-gold/15";
          const isActive = selected?._id === plan._id;

          return (
            <div
              key={plan._id}
              onClick={() => setSelected(plan)}
              className={`relative cursor-pointer group flex flex-col rounded-xl border bg-gradient-to-b ${colors} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${isActive ? "ring-2 ring-fortress-gold/60" : ""}`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-fortress-gold text-fortress-navy text-[10px] font-black tracking-[0.15em] uppercase rounded-full shadow-md whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                  <TierIcon tier={plan.tier} className={`w-4 h-4 ${accent}`} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${accent}`}>{plan.name}</p>
                  <p className="text-fortress-silver/40 text-[10px] font-mono uppercase tracking-widest">{plan.nameEn}</p>
                </div>
              </div>

              {/* Shareholder type */}
              <p className="text-fortress-silver/50 text-[10px] uppercase tracking-widest mb-3 font-semibold">{plan.shareholderType}</p>

              {/* Tagline */}
              <p className="text-fortress-ivory/80 text-xs leading-relaxed mb-5 flex-1">{plan.tagline}</p>

              {/* Commitment */}
              <div className="pt-4 border-t border-white/10 mb-4">
                <p className="text-fortress-silver/40 text-[10px] uppercase tracking-widest mb-1">Vốn góp tối thiểu</p>
                <p className={`font-black text-base ${accent}`}>{formatVND(plan.minCommitment)}</p>
                {plan.maxCommitment > 0 && (
                  <p className="text-fortress-silver/30 text-[10px] mt-0.5">Tối đa: {formatVND(plan.maxCommitment)}</p>
                )}
              </div>

              {/* Equity + Duration row */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-black/20 rounded-lg p-2.5">
                  <p className="text-fortress-silver/40 text-[9px] uppercase tracking-wider mb-0.5">Cổ Phần</p>
                  <p className="text-fortress-ivory text-[11px] font-semibold leading-tight">{plan.equityRange}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2.5">
                  <p className="text-fortress-silver/40 text-[9px] uppercase tracking-wider mb-0.5">Thời Hạn</p>
                  <p className="text-fortress-ivory text-[11px] font-semibold leading-tight">{plan.duration}</p>
                </div>
              </div>

              {/* Top 2 rights */}
              <ul className="space-y-1.5 mb-5">
                {(plan.rights || plan.benefits || []).slice(0, 2).map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className={`w-3 h-3 mt-0.5 shrink-0 ${accent}`} />
                    <span className="text-fortress-silver/65 text-[11px] leading-relaxed">{r}</span>
                  </li>
                ))}
                {(plan.rights || plan.benefits || []).length > 2 && (
                  <li className="text-[11px] text-fortress-silver/35 pl-4.5">
                    +{(plan.rights || plan.benefits || []).length - 2} quyền lợi khác...
                  </li>
                )}
              </ul>

              {/* CTA */}
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(plan); }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-all rounded-lg border ${
                  plan.highlighted
                    ? "bg-fortress-gold text-fortress-navy border-fortress-gold hover:bg-fortress-champagne"
                    : `border-current hover:bg-white/5 ${accent}`
                }`}
              >
                Xem Quyền &amp; Nghĩa Vụ <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Detail drawer / modal ────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#06101a] border border-fortress-gold/20 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-fortress-gold/10 bg-[#06101a]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${TIER_ICON_BG[selected.tier] || "bg-fortress-gold/15"} flex items-center justify-center shrink-0`}>
                  <TierIcon tier={selected.tier} className={`w-4 h-4 ${TIER_ACCENT[selected.tier] || "text-fortress-gold"}`} />
                </div>
                <div>
                  <h2 className={`font-black text-lg ${TIER_ACCENT[selected.tier] || "text-fortress-gold"}`}>{selected.name}</h2>
                  <p className="text-fortress-silver/40 text-[10px] font-mono">{selected.shareholderType}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-fortress-silver hover:text-white transition-colors shrink-0"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Key numbers */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Vốn Tối Thiểu", value: formatVND(selected.minCommitment) },
                  { label: "Cổ Phần",       value: selected.equityRange },
                  { label: "Thời Hạn",      value: selected.duration },
                ].map((kv) => (
                  <div key={kv.label} className="bg-black/30 rounded-xl p-3 text-center">
                    <p className="text-fortress-silver/40 text-[9px] uppercase tracking-widest mb-1">{kv.label}</p>
                    <p className={`font-black text-xs ${TIER_ACCENT[selected.tier] || "text-fortress-gold"}`}>{kv.value}</p>
                  </div>
                ))}
              </div>

              {/* Tagline */}
              <p className="text-fortress-ivory/80 text-sm leading-relaxed border-b border-fortress-gold/10 pb-4">{selected.tagline}</p>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-fortress-deep rounded-xl">
                {([
                  { key: "rights",      Icon: Shield,        label: "Quyền Lợi"    },
                  { key: "obligations", Icon: AlertTriangle,  label: "Nghĩa Vụ"     },
                  { key: "documents",   Icon: FileText,       label: "Hồ Sơ Cần Có" },
                ] as const).map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold tracking-wide rounded-lg transition-colors ${
                      tab === t.key
                        ? "bg-fortress-navy text-fortress-ivory shadow-sm"
                        : "text-fortress-silver/60 hover:text-fortress-ivory hover:bg-fortress-charcoal"
                    }`}>
                    <t.Icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {tab === "rights" && (
                <div>
                  <p className="text-fortress-silver/50 text-[10px] uppercase tracking-widest mb-3 font-semibold">Quyền của cổ đông khi tham gia</p>
                  <ul className="space-y-2.5">
                    {(selected.rights || selected.benefits || []).map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 bg-fortress-deep/60 rounded-lg">
                        <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${TIER_ACCENT[selected.tier] || "text-fortress-gold"}`} />
                        <span className="text-fortress-silver/80 text-sm leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "obligations" && (
                <div>
                  <p className="text-fortress-silver/50 text-[10px] uppercase tracking-widest mb-3 font-semibold">Nghĩa vụ bắt buộc theo pháp luật &amp; nội quy công ty</p>
                  <ul className="space-y-2.5">
                    {(selected.obligations || selected.conditions || []).map((o, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                        <span className="text-fortress-silver/80 text-sm leading-relaxed">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "documents" && (
                <div>
                  <p className="text-fortress-silver/50 text-[10px] uppercase tracking-widest mb-3 font-semibold">Hồ sơ cần chuẩn bị theo NQ 05/2025/NQ-CP</p>
                  <ul className="space-y-2">
                    {(selected.documents || []).map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                        <FileText className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                        <span className="text-fortress-silver/80 text-sm leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-fortress-silver/30 text-[10px] mt-3 italic">
                    Căn cứ: Mục 1 Thủ tục xin giấy phép — QĐ 96/QĐ-BTC ngày 20/01/2026
                  </p>
                </div>
              )}

              {/* Cổ đông tổ chức warning */}
              {(selected.tier === "institution" || selected.tier === "anchor") && (
                <div className="p-4 bg-amber-500/8 border border-amber-500/25 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                    <p className="text-amber-300 text-[11px] font-bold">Điều kiện bắt buộc — Điều 8, Khoản 4</p>
                  </div>
                  <p className="text-amber-200/70 text-xs leading-relaxed">
                    Cổ đông tổ chức phải: có tư cách pháp nhân · kinh doanh có lãi 2 năm liền trước ·
                    BCTC 2 năm được kiểm toán chấp thuận toàn phần · chỉ góp vốn tại{" "}
                    <strong className="text-amber-200">DUY NHẤT 1</strong> tổ chức TSMH được BTC cấp phép.
                  </p>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/invest-with-fortress#enquiry"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-sm uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                >
                  Đăng Ký Góp Vốn
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-fortress-gold/25 text-fortress-gold font-semibold text-sm uppercase tracking-wider rounded-xl hover:bg-fortress-gold/5 transition-colors"
                >
                  Hỏi Thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
