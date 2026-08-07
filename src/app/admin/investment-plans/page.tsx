"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { useCsrf } from "@/contexts/CsrfContext";

interface Plan {
  _id: string;
  tier: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  minCommitment: number;
  maxCommitment: number;
  currency: string;
  equityRange: string;
  equityRangeEn: string;
  duration: string;
  durationEn: string;
  benefits: string[];
  benefitsEn: string[];
  conditions: string[];
  conditionsEn: string[];
  rights: string[];
  obligations: string[];
  documents: string[];
  shareholderType: string;
  highlighted: boolean;
  badge: string;
  badgeEn: string;
  order: number;
  status: "active" | "draft" | "closed";
}

const TIER_LABELS: Record<string, string> = {
  seed:      "🌱 Hạt Giống",
  growth:    "🚀 Tăng Trưởng",
  expansion: "📈 Mở Rộng",
  strategic: "🏛️ Chiến Lược",
  anchor:    "⚓ Neo Chiến Lược",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  draft:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  closed: "bg-red-500/15 text-red-400 border-red-500/30",
};

function formatVND(n: number) {
  if (n === 0) return "Không giới hạn";
  if (n >= 1e9) return `${(n / 1e9).toLocaleString("vi-VN")} tỷ`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString("vi-VN")} triệu`;
  return n.toLocaleString("vi-VN");
}

const EMPTY: Partial<Plan> = {
  tier: "seed", name: "", nameEn: "", tagline: "", taglineEn: "",
  minCommitment: 500000000, maxCommitment: 0, currency: "VND",
  equityRange: "", equityRangeEn: "", duration: "", durationEn: "",
  benefits: [], benefitsEn: [], conditions: [], conditionsEn: [],
  rights: [], obligations: [], documents: [],
  shareholderType: "",
  highlighted: false, badge: "", badgeEn: "", order: 1, status: "draft",
};

type TextArrayField = "benefits" | "benefitsEn" | "conditions" | "conditionsEn" | "rights" | "obligations" | "documents";

export default function InvestmentPlansAdmin() {
  const { csrfFetch } = useCsrf();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"basic" | "content" | "en">("basic");

  function load() {
    setLoading(true);
    fetch("/api/admin/investment-plans")
      .then((r) => r.json())
      .then((res) => { setPlans(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/investment-plans" : `/api/admin/investment-plans/${editing._id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await csrfFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(isNew ? "Đã tạo gói mới" : "Đã cập nhật gói");
      setEditing(null);
      load();
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xóa gói "${name}"?`)) return;
    try {
      const res = await csrfFetch(`/api/admin/investment-plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Đã xóa hạng mục hợp tác");
      load();
    } catch {
      toast.error("Xóa thất bại");
    }
  }

  async function toggleStatus(plan: Plan) {
    const next = plan.status === "active" ? "draft" : "active";
    try {
      await csrfFetch(`/api/admin/investment-plans/${plan._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      toast.success(next === "active" ? "Đã kích hoạt" : "Đã ẩn gói");
      load();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  }

  const set = (field: keyof Plan, value: unknown) =>
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev);

  const setArr = (field: TextArrayField, raw: string) =>
    set(field, raw.split("\n").map((s) => s.trim()).filter(Boolean));

  function openNew() {
    setEditing({ ...EMPTY });
    setIsNew(true);
    setTab("basic");
  }

  function openEdit(plan: Plan) {
    setEditing({ ...plan });
    setIsNew(false);
    setTab("basic");
  }

  const inputCls = "w-full px-3 py-2.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory text-sm rounded-lg focus:outline-none focus:border-fortress-gold/50";
  const labelCls = "block text-fortress-silver/70 text-xs mb-1.5";
  const areaCls = `${inputCls} resize-none`;

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-fortress-gold/20 font-sans">
      <AdminSidebar active="Investment Plans" />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <AdminNavbar title="Hạng Mục Hợp Tác Đầu Tư" />

        <div className="p-5 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-fortress-ivory font-bold text-xl">Quản Lý Hạng Mục Hợp Tác</h1>
              <p className="text-fortress-silver/60 text-xs mt-1">
                {plans.filter((p) => p.status === "active").length} gói đang hoạt động · {plans.length} tổng cộng
              </p>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2.5 bg-fortress-gold text-fortress-navy text-sm font-bold rounded-xl hover:bg-fortress-champagne transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm Gói Mới
            </button>
          </div>

          {/* Plans table */}
          {loading ? (
            <div className="text-fortress-silver text-center py-20">Đang tải...</div>
          ) : (
            <div className="bg-fortress-navy border border-fortress-gold/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-fortress-gold/10 text-fortress-silver/60 text-[11px] uppercase tracking-widest">
                    <th className="text-left p-4">Gói</th>
                    <th className="text-left p-4 hidden md:table-cell">Tối thiểu</th>
                    <th className="text-left p-4 hidden lg:table-cell">Cổ phần</th>
                    <th className="text-left p-4">Trạng thái</th>
                    <th className="text-right p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id} className="border-b border-fortress-gold/5 hover:bg-fortress-deep/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {plan.highlighted && <Star className="w-3 h-3 text-fortress-gold shrink-0" />}
                          <div>
                            <p className="font-medium text-fortress-ivory text-sm">{plan.name}</p>
                            <p className="text-fortress-silver/50 text-[11px] font-mono">{TIER_LABELS[plan.tier] || plan.tier}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-fortress-silver text-xs">{formatVND(plan.minCommitment)} VNĐ</td>
                      <td className="p-4 hidden lg:table-cell text-fortress-silver text-xs">{plan.equityRange}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-semibold rounded-full border ${STATUS_STYLES[plan.status]}`}>
                          {plan.status === "active" ? "Hoạt động" : plan.status === "draft" ? "Nháp" : "Đóng"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleStatus(plan)}
                            className="p-2 text-fortress-silver/60 hover:text-fortress-champagne transition-colors rounded-lg hover:bg-fortress-charcoal"
                            title={plan.status === "active" ? "Ẩn gói" : "Kích hoạt"}
                          >
                            {plan.status === "active" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEdit(plan)}
                            className="p-2 text-fortress-silver/60 hover:text-fortress-champagne transition-colors rounded-lg hover:bg-fortress-charcoal"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id, plan.name)}
                            className="p-2 text-fortress-silver/60 hover:text-red-400 transition-colors rounded-lg hover:bg-fortress-charcoal"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {plans.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-16 text-fortress-silver/40">Chưa có gói nào. Nhấn &quot;Thêm Gói Mới&quot; để bắt đầu.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col bg-[#07111D] border border-fortress-gold/20 rounded-2xl shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-fortress-gold/10 shrink-0">
              <h2 className="text-fortress-ivory font-bold">{isNew ? "Thêm Gói Mới" : `Chỉnh sửa: ${editing.name}`}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-fortress-silver hover:text-white transition-colors">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-fortress-gold/10 shrink-0">
              {([
                { key: "basic", label: "Thông tin cơ bản" },
                { key: "content", label: "Nội dung (VI)" },
                { key: "en", label: "English (EN)" },
              ] as const).map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === t.key
                      ? "border-fortress-gold text-fortress-gold"
                      : "border-transparent text-fortress-silver/60 hover:text-fortress-ivory"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* ── Tab: basic ─────────────────────────────────────── */}
              {tab === "basic" && (
                <>
                  {/* Tier + Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Tier *</label>
                      <select value={editing.tier} onChange={(e) => set("tier", e.target.value)} className={inputCls}>
                        {Object.entries(TIER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Trạng thái</label>
                      <select value={editing.status} onChange={(e) => set("status", e.target.value as Plan["status"])} className={inputCls}>
                        <option value="draft">Nháp</option>
                        <option value="active">Hoạt động</option>
                        <option value="closed">Đóng</option>
                      </select>
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Tên (VI) *</label>
                      <input value={editing.name || ""} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tên (EN) *</label>
                      <input value={editing.nameEn || ""} onChange={(e) => set("nameEn", e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  {/* Loại cổ đông */}
                  <div>
                    <label className={labelCls}>Loại cổ đông (shareholderType)</label>
                    <input value={editing.shareholderType || ""} onChange={(e) => set("shareholderType", e.target.value)} placeholder="VD: Cổ đông Cá nhân" className={inputCls} />
                  </div>

                  {/* Commitment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Cam kết tối thiểu (VNĐ) *</label>
                      <input type="number" value={editing.minCommitment || 0} onChange={(e) => set("minCommitment", Number(e.target.value))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tối đa (0 = không giới hạn)</label>
                      <input type="number" value={editing.maxCommitment || 0} onChange={(e) => set("maxCommitment", Number(e.target.value))} className={inputCls} />
                    </div>
                  </div>

                  {/* Equity + Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Cổ phần (VI)</label>
                      <input value={editing.equityRange || ""} onChange={(e) => set("equityRange", e.target.value)} placeholder="VD: 2% – 5% cổ phần" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Thời hạn (VI)</label>
                      <input value={editing.duration || ""} onChange={(e) => set("duration", e.target.value)} placeholder="VD: 24 – 36 tháng" className={inputCls} />
                    </div>
                  </div>

                  {/* Badge + Order + Highlighted */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Badge (VI)</label>
                      <input value={editing.badge || ""} onChange={(e) => set("badge", e.target.value)} placeholder="VD: Phổ Biến Nhất" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Thứ tự</label>
                      <input type="number" value={editing.order || 1} onChange={(e) => set("order", Number(e.target.value))} className={inputCls} />
                    </div>
                    <div className="flex flex-col justify-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editing.highlighted || false} onChange={(e) => set("highlighted", e.target.checked)} className="w-4 h-4 accent-fortress-gold" />
                        <span className="text-fortress-silver/70 text-xs">Nổi bật (highlighted)</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* ── Tab: content (VI) ──────────────────────────── */}
              {tab === "content" && (
                <>
                  <div>
                    <label className={labelCls}>Tagline (VI)</label>
                    <input value={editing.tagline || ""} onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Quyền lợi / Benefits VI (mỗi dòng = 1 mục)</label>
                    <textarea rows={5} value={(editing.benefits || []).join("\n")} onChange={(e) => setArr("benefits", e.target.value)} className={areaCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Điều kiện / Conditions VI (mỗi dòng = 1 mục)</label>
                    <textarea rows={4} value={(editing.conditions || []).join("\n")} onChange={(e) => setArr("conditions", e.target.value)} className={areaCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Quyền cổ đông / Rights VI (mỗi dòng = 1 mục)</label>
                    <textarea rows={5} value={(editing.rights || []).join("\n")} onChange={(e) => setArr("rights", e.target.value)} className={areaCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Nghĩa vụ / Obligations VI (mỗi dòng = 1 mục)</label>
                    <textarea rows={4} value={(editing.obligations || []).join("\n")} onChange={(e) => setArr("obligations", e.target.value)} className={areaCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Hồ sơ cần chuẩn bị / Documents (mỗi dòng = 1 mục)</label>
                    <textarea rows={4} value={(editing.documents || []).join("\n")} onChange={(e) => setArr("documents", e.target.value)} className={areaCls} />
                  </div>
                </>
              )}

              {/* ── Tab: English ─────────────────────────────────── */}
              {tab === "en" && (
                <>
                  <div>
                    <label className={labelCls}>Tagline (EN)</label>
                    <input value={editing.taglineEn || ""} onChange={(e) => set("taglineEn", e.target.value)} className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Cổ phần (EN)</label>
                      <input value={editing.equityRangeEn || ""} onChange={(e) => set("equityRangeEn", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Thời hạn (EN)</label>
                      <input value={editing.durationEn || ""} onChange={(e) => set("durationEn", e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Badge (EN)</label>
                    <input value={editing.badgeEn || ""} onChange={(e) => set("badgeEn", e.target.value)} className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Benefits EN (mỗi dòng = 1 mục)</label>
                    <textarea rows={5} value={(editing.benefitsEn || []).join("\n")} onChange={(e) => setArr("benefitsEn", e.target.value)} className={areaCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Conditions EN (mỗi dòng = 1 mục)</label>
                    <textarea rows={4} value={(editing.conditionsEn || []).join("\n")} onChange={(e) => setArr("conditionsEn", e.target.value)} className={areaCls} />
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-fortress-gold/10 flex gap-3 shrink-0">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 bg-fortress-gold text-fortress-navy font-bold text-sm rounded-xl hover:bg-fortress-champagne transition-colors disabled:opacity-50">
                {saving ? "Đang lưu..." : isNew ? "Tạo Gói" : "Lưu Thay Đổi"}
              </button>
              <button onClick={() => setEditing(null)}
                className="px-5 py-3 border border-fortress-gold/20 text-fortress-silver text-sm rounded-xl hover:bg-fortress-deep transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
