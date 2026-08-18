"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Users, CheckSquare, Calendar,
  Send, Save, X, ChevronDown, ChevronUp, Loader2, MessageSquare,
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/shared/components/admin/AdminSidebar";
import AdminNavbar from "@/shared/components/admin/AdminNavbar";
import { useCsrf } from "@/contexts/CsrfContext";
import {
  ROLE_LABELS, ALL_ROLES, SHAREHOLDER_STATUS_CLS as STATUS_CLS,
  TASK_STATUS_LABELS as TASK_STATUS, PRIORITY_TEXT_CLS as PRIORITY_CLS,
  TASK_CATEGORIES as CATEGORIES, CAT_LABELS,
  MEETING_TYPES, MEETING_TYPE_LABELS, ADMIN_PAGE_CLS,
} from "@/constants/admin";
import { formatVNDCompact } from "@/core/vn-utils/vn-lib/format";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Shareholder { _id: string; name: string; email: string; phone: string; role: string; status: string; equityPercent: number; capitalCommitted: number; capitalPaid: number; notes: string; kycStatus?: string; }
interface Task { _id: string; title: string; description: string; category: string; priority: string; status: string; assignedRoles: string[]; milestoneTag: string; legalRef: string; dueDate: string | null; order: number; }
interface Meeting { _id: string; title: string; type: string; status: string; scheduledAt: string; meetingLink: string; location: string; agenda: { order: number; title: string; description: string; resolved: boolean; resolution: string }[]; minutes: string; invitedRoles: string[]; }

function Card({ title, icon: Icon, count, cls }: { title: string; icon: typeof Users; count: number; cls: string }) {
  return (
    <div className={`p-5 rounded-xl border ${cls}`}>
      <Icon className="w-5 h-5 mb-3 opacity-80" />
      <p className="font-black text-2xl">{count}</p>
      <p className="text-[11px] mt-1 opacity-60">{title}</p>
    </div>
  );
}

// ─── Shareholder Form Modal ────────────────────────────────────────────────────
function ShareholderModal({ sh, onClose, onSave }: { sh: Partial<Shareholder> | null; onClose: () => void; onSave: (d: Partial<Shareholder> & { password?: string }) => Promise<void> }) {
  const isNew = !sh?._id;
  const [form, setForm] = useState<Partial<Shareholder> & { password?: string }>({
    name: "", email: "", phone: "", role: "individual", status: "pending",
    equityPercent: 0, capitalCommitted: 0, capitalPaid: 0, notes: "", password: "",
    ...(sh || {}),
  });
  const [saving, setSaving] = useState(false);
  function set(k: string, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl bg-AXVN-deep border border-AXVN-gold/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-AXVN-gold/10 bg-AXVN-deep z-10">
          <h3 className="text-AXVN-ivory font-semibold">{isNew ? "Thêm cổ đông" : "Cập nhật cổ đông"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-AXVN-silver/40 hover:text-AXVN-ivory" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["name", "Họ tên *", "text"], ["email", "Email *", "email"], ["phone", "Điện thoại", "tel"]].map(([k, l, t]) => (
              <div key={k} className={k === "name" ? "col-span-2" : ""}>
                <label className="block text-AXVN-silver/60 text-xs mb-1">{l}</label>
                <input type={t} required={k === "name" || k === "email"} value={(form as Record<string, unknown>)[k] as string || ""}
                  onChange={(e) => set(k, e.target.value)}
                  className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
              </div>
            ))}
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Vai trò</label>
              <select value={form.role || "individual"} onChange={(e) => set("role", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Trạng thái</label>
              <select value={form.status || "pending"} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                <option value="pending">Chờ xét duyệt</option>
                <option value="active">Đã kích hoạt</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">% Cổ phần</label>
              <input type="number" step="0.01" value={form.equityPercent || 0} onChange={(e) => set("equityPercent", parseFloat(e.target.value))}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Vốn cam kết (VNĐ)</label>
              <input type="number" value={form.capitalCommitted || 0} onChange={(e) => set("capitalCommitted", parseInt(e.target.value))}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Vốn đã góp (VNĐ)</label>
              <input type="number" value={form.capitalPaid || 0} onChange={(e) => set("capitalPaid", parseInt(e.target.value))}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-AXVN-silver/60 text-xs mb-1">{isNew ? "Mật khẩu *" : "Đặt lại mật khẩu (để trống = không đổi)"}</label>
              <input type="password" required={isNew} value={form.password || ""} onChange={(e) => set("password", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg"
                placeholder={isNew ? "Mật khẩu ban đầu" : "Để trống nếu không thay đổi"} />
            </div>
            <div className="col-span-2">
              <label className="block text-AXVN-silver/60 text-xs mb-1">Ghi chú nội bộ</label>
              <textarea rows={2} value={form.notes || ""} onChange={(e) => set("notes", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-AXVN-gold text-AXVN-navy font-bold text-sm rounded-xl hover:bg-AXVN-champagne transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Tạo tài khoản" : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-AXVN-gold/20 text-AXVN-silver text-sm rounded-xl hover:bg-AXVN-gold/5 transition-colors">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Task Form Modal ───────────────────────────────────────────────────────────
function TaskModal({ task, onClose, onSave }: { task: Partial<Task> | null; onClose: () => void; onSave: (d: Partial<Task>) => Promise<void> }) {
  const isNew = !task?._id;
  const [form, setForm] = useState<Partial<Task>>({ title: "", description: "", category: "legal", priority: "medium", status: "pending", assignedRoles: [], milestoneTag: "", legalRef: "", dueDate: null, order: 0, ...(task || {}) });
  const [saving, setSaving] = useState(false);
  function set(k: string, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }
  function toggleRole(r: string) { set("assignedRoles", (form.assignedRoles || []).includes(r) ? (form.assignedRoles || []).filter((x) => x !== r) : [...(form.assignedRoles || []), r]); }
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-AXVN-deep border border-AXVN-gold/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-AXVN-gold/10 bg-AXVN-deep z-10">
          <h3 className="text-AXVN-ivory font-semibold">{isNew ? "Thêm nhiệm vụ" : "Cập nhật nhiệm vụ"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-AXVN-silver/40 hover:text-AXVN-ivory" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1">Tiêu đề *</label>
            <input required value={form.title || ""} onChange={(e) => set("title", e.target.value)}
              className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
          </div>
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1">Mô tả chi tiết</label>
            <textarea rows={3} value={form.description || ""} onChange={(e) => set("description", e.target.value)}
              className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg resize-y" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Danh mục</label>
              <select value={form.category || "legal"} onChange={(e) => set("category", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Độ ưu tiên</label>
              <select value={form.priority || "medium"} onChange={(e) => set("priority", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                <option value="critical">🔴 Cấp bách</option>
                <option value="high">🟠 Cao</option>
                <option value="medium">🟡 Trung bình</option>
                <option value="low">🟢 Thấp</option>
              </select>
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Trạng thái</label>
              <select value={form.status || "pending"} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                {Object.entries(TASK_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Thứ tự hiển thị</label>
              <input type="number" value={form.order || 0} onChange={(e) => set("order", parseInt(e.target.value))}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Milestone</label>
              <input placeholder="VD: Q2-2026" value={form.milestoneTag || ""} onChange={(e) => set("milestoneTag", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Hạn chót</label>
              <input type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ""} onChange={(e) => set("dueDate", e.target.value || null)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-AXVN-silver/60 text-xs mb-1">Căn cứ pháp lý</label>
              <input placeholder="VD: Điều 8 NQ5/2025 — Khoản 5" value={form.legalRef || ""} onChange={(e) => set("legalRef", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-2">Giao cho vai trò (để trống = tất cả)</label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((r) => (
                <button key={r} type="button" onClick={() => toggleRole(r)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${(form.assignedRoles || []).includes(r)
                      ? "bg-AXVN-gold/20 border-AXVN-gold/40 text-AXVN-gold"
                      : "bg-AXVN-deep border-white/10 text-AXVN-silver/60 hover:border-AXVN-gold/20"
                    }`}>
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-AXVN-gold text-AXVN-navy font-bold text-sm rounded-xl hover:bg-AXVN-champagne transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Tạo nhiệm vụ" : "Lưu"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-AXVN-gold/20 text-AXVN-silver text-sm rounded-xl hover:bg-AXVN-gold/5 transition-colors">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Meeting Form Modal ────────────────────────────────────────────────────────
function MeetingModal({ meeting, onClose, onSave }: { meeting: Partial<Meeting> | null; onClose: () => void; onSave: (d: Partial<Meeting>) => Promise<void> }) {
  const isNew = !meeting?._id;
  const [form, setForm] = useState<Partial<Meeting>>({ title: "", type: "general", status: "scheduled", scheduledAt: "", meetingLink: "", location: "online", agenda: [], minutes: "", invitedRoles: [], ...(meeting || {}) });
  const [saving, setSaving] = useState(false);
  function set(k: string, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }
  function toggleRole(r: string) { set("invitedRoles", (form.invitedRoles || []).includes(r) ? (form.invitedRoles || []).filter((x) => x !== r) : [...(form.invitedRoles || []), r]); }
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-AXVN-deep border border-AXVN-gold/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-AXVN-gold/10 bg-AXVN-deep z-10">
          <h3 className="text-AXVN-ivory font-semibold">{isNew ? "Lên lịch họp" : "Cập nhật cuộc họp"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-AXVN-silver/40 hover:text-AXVN-ivory" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1">Tiêu đề cuộc họp *</label>
            <input required value={form.title || ""} onChange={(e) => set("title", e.target.value)}
              className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Loại họp</label>
              <select value={form.type || "general"} onChange={(e) => set("type", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                {MEETING_TYPES.map((t) => <option key={t} value={t}>{MEETING_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-AXVN-silver/60 text-xs mb-1">Trạng thái</label>
              <select value={form.status || "scheduled"} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg">
                <option value="scheduled">Đã lên lịch</option>
                <option value="in_progress">Đang họp</option>
                <option value="completed">Đã kết thúc</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-AXVN-silver/60 text-xs mb-1">Thời gian họp *</label>
              <input type="datetime-local" required value={form.scheduledAt ? new Date(form.scheduledAt).toISOString().slice(0, 16) : ""} onChange={(e) => set("scheduledAt", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-AXVN-silver/60 text-xs mb-1">Link họp (Zoom/Meet)</label>
              <input type="url" placeholder="https://zoom.us/..." value={form.meetingLink || ""} onChange={(e) => set("meetingLink", e.target.value)}
                className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-2">Mời các vai trò (để trống = tất cả)</label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((r) => (
                <button key={r} type="button" onClick={() => toggleRole(r)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${(form.invitedRoles || []).includes(r)
                      ? "bg-AXVN-gold/20 border-AXVN-gold/40 text-AXVN-gold"
                      : "bg-AXVN-deep border-white/10 text-AXVN-silver/60 hover:border-AXVN-gold/20"
                    }`}>
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-AXVN-silver/60 text-xs mb-1">Biên bản / Ghi chú</label>
            <textarea rows={4} value={form.minutes || ""} onChange={(e) => set("minutes", e.target.value)}
              placeholder="Kết quả họp, quyết định, hành động tiếp theo..."
              className="w-full bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-AXVN-gold/50 rounded-lg resize-y" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-AXVN-gold text-AXVN-navy font-bold text-sm rounded-xl hover:bg-AXVN-champagne transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Lên lịch" : "Lưu"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-AXVN-gold/20 text-AXVN-silver text-sm rounded-xl hover:bg-AXVN-gold/5 transition-colors">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── KYC Status config (outside component) ────────────────────────────────────
const KYC_STATUS: Record<string, { label: string; cls: string; icon: typeof ShieldCheck }> = {
  not_started: { label: "Chưa KYC", cls: "text-AXVN-silver/40 bg-AXVN-navy/60 border-AXVN-silver/10", icon: ShieldAlert },
  pending: { label: "Chờ duyệt", cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: ShieldAlert },
  approved: { label: "Đã xác minh", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", icon: ShieldCheck },
  rejected: { label: "Từ chối", cls: "text-red-400 bg-red-500/10 border-red-500/20", icon: ShieldAlert },
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ShareholdersAdmin() {
  const { csrfFetch } = useCsrf();
  const [tab, setTab] = useState<"shareholders" | "tasks" | "meetings" | "messages">("shareholders");
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [adminSession, setAdminSession] = useState<Record<string, unknown> | null>(null);
  const [shSearch, setShSearch] = useState("");
  const [shRoleFilter, setShRoleFilter] = useState("");
  const [shStatusFilter, setShStatusFilter] = useState("");
  const [shKycFilter, setShKycFilter] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [messages, setMessages] = useState<{ _id: string; channel: string; senderName: string; isAdminSender: boolean; content: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [shModal, setShModal] = useState<Partial<Shareholder> | null | false>(false);
  const [taskModal, setTaskModal] = useState<Partial<Task> | null | false>(false);
  const [meetingModal, setMeetingModal] = useState<Partial<Meeting> | null | false>(false);
  const [msgChannel, setMsgChannel] = useState("general");
  const [msgInput, setMsgInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [expandedSh, setExpandedSh] = useState<string | null>(null);
  const [kycLoading, setKycLoading] = useState<string | null>(null);
  const msgBottomRef = useRef<HTMLDivElement>(null);
  const msgSseRef = useRef<EventSource | null>(null);

  const fetchShareholders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (shSearch) params.set("search", shSearch);
    if (shRoleFilter) params.set("role", shRoleFilter);
    if (shStatusFilter) params.set("status", shStatusFilter);
    if (shKycFilter) params.set("kycStatus", shKycFilter);
    const res = await fetch(`/api/admin/shareholders?${params}`);
    const d = await res.json();
    if (d.success) {
      const list = d.data?.shareholders ?? d.data;
      setShareholders(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  }, [shSearch, shRoleFilter, shStatusFilter, shKycFilter]);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/admin/shareholder-ops?type=tasks");
    const d = await res.json();
    if (d.success) setTasks(Array.isArray(d.data) ? d.data : []);
  }, []);

  const fetchMeetings = useCallback(async () => {
    const res = await fetch("/api/admin/shareholder-ops?type=meetings");
    const d = await res.json();
    if (d.success) setMeetings(Array.isArray(d.data) ? d.data : []);
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/admin/shareholder-ops?type=messages&channel=${msgChannel}`);
    const d = await res.json();
    if (d.success) setMessages(Array.isArray(d.data) ? d.data : []);
  }, [msgChannel]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (tab === "messages") {
      msgBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, tab]);

  // SSE live update cho messages tab (admin)
  useEffect(() => {
    if (tab !== "messages") {
      msgSseRef.current?.close();
      msgSseRef.current = null;
      return;
    }
    msgSseRef.current?.close();
    const es = new EventSource(`/api/shareholders/messages/sse?channel=${msgChannel}`);
    msgSseRef.current = es;
    es.addEventListener("message", () => {
      // Reload messages on new incoming message
      fetchMessages();
    });
    es.addEventListener("error", () => { es.close(); });
    return () => { es.close(); msgSseRef.current = null; };
  }, [tab, msgChannel, fetchMessages]);

  useEffect(() => {
    // Lấy thông tin session admin để biết role
    fetch("/api/admin/session").then((r) => r.json()).then((d) => {
      if (d.success) setAdminSession(d.data);
    }).catch(() => { });
    if (tab === "shareholders") fetchShareholders();
    if (tab === "tasks") fetchTasks();
    if (tab === "meetings") fetchMeetings();
    if (tab === "messages") fetchMessages();
  }, [tab, fetchShareholders, fetchTasks, fetchMeetings, fetchMessages]);

  // ── Shareholders CRUD ──────────────────────────────────────────────────────
  async function saveShareholder(form: Partial<Shareholder> & { password?: string }) {
    const method = form._id ? "PUT" : "POST";
    const res = await csrfFetch("/api/admin/shareholders", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (d.success) { toast.success(form._id ? "Đã cập nhật" : "Đã tạo tài khoản"); setShModal(false); fetchShareholders(); }
    else toast.error(d.message || "Lỗi");
  }

  // ── KYC approve / reject ───────────────────────────────────────────────────
  async function handleKyc(id: string, action: "approve" | "reject") {
    setKycLoading(id + action);
    try {
      const res = await csrfFetch(`/api/admin/shareholders/${id}/kyc`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(action === "approve" ? "Đã duyệt KYC ✓" : "Đã từ chối KYC");
        fetchShareholders();
      } else {
        toast.error(d.message || "Lỗi xử lý KYC");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setKycLoading(null);
    }
  }

  async function deleteShareholder(id: string) {
    if (!confirm("Xóa cổ đông này? Hành động không thể hoàn tác.")) return;
    try {
      const res = await csrfFetch(`/api/admin/shareholders?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) { toast.success("Đã xóa cổ đông"); fetchShareholders(); }
      else toast.error(d.message || "Lỗi xóa cổ đông");
    } catch { toast.error("Lỗi kết nối"); }
  }

  // ── Tasks CRUD ────────────────────────────────────────────────────────────
  async function saveTask(form: Partial<Task>) {
    const body = { type: "task", ...form };
    const method = form._id ? "PUT" : "POST";
    const res = await csrfFetch("/api/admin/shareholder-ops", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json();
    if (d.success) { toast.success("Đã lưu"); setTaskModal(false); fetchTasks(); } else toast.error("Lỗi");
  }

  async function deleteTask(id: string) {
    if (!confirm("Xóa nhiệm vụ này?")) return;
    await csrfFetch(`/api/admin/shareholder-ops?type=task&id=${id}`, { method: "DELETE" });
    fetchTasks();
  }

  // ── Meetings CRUD ─────────────────────────────────────────────────────────
  async function saveMeeting(form: Partial<Meeting>) {
    const body = { type: "meeting", ...form };
    const method = form._id ? "PUT" : "POST";
    const res = await csrfFetch("/api/admin/shareholder-ops", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json();
    if (d.success) { toast.success("Đã lưu"); setMeetingModal(false); fetchMeetings(); } else toast.error("Lỗi");
  }

  // ── Admin send message ────────────────────────────────────────────────────
  async function sendAdminMessage() {
    if (!msgInput.trim()) return;
    setSendingMsg(true);
    const res = await csrfFetch("/api/admin/shareholder-ops", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "message", channel: msgChannel, content: msgInput.trim() }),
    });
    const d = await res.json();
    if (d.success) { setMsgInput(""); fetchMessages(); toast.success("Đã gửi"); } else toast.error("Lỗi");
    setSendingMsg(false);
  }

  const active = shareholders.filter((s) => s.status === "active").length;
  const totalEquity = shareholders.reduce((sum, s) => sum + (s.equityPercent || 0), 0);

  return (
    <div className={ADMIN_PAGE_CLS}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-AXVN-gold/4 rounded-full blur-[120px] pointer-events-none" />
        <AdminNavbar title="Quản Lý Cổ Đông Portal" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card title="Tổng cổ đông" icon={Users} count={shareholders.length} cls="bg-AXVN-deep border-AXVN-gold/10 text-AXVN-gold" />
            <Card title="Đã kích hoạt" icon={Users} count={active} cls="bg-emerald-500/8 border-emerald-500/20 text-emerald-400" />
            <Card title="Nhiệm vụ" icon={CheckSquare} count={tasks.length} cls="bg-blue-500/8 border-blue-500/20 text-blue-400" />
            <Card title="Cuộc họp" icon={Calendar} count={meetings.length} cls="bg-purple-500/8 border-purple-500/20 text-purple-400" />
          </div>

          {totalEquity > 0 && (
            <div className="mb-6 p-4 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-AXVN-silver/60 text-xs">Tổng cổ phần đã phân bổ</span>
                  <span className="text-AXVN-gold text-sm font-bold">{totalEquity.toFixed(2)}% / 100%</span>
                </div>
                <div className="h-2 bg-AXVN-navy rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-AXVN-gold to-AXVN-champagne rounded-full" style={{ width: `${Math.min(totalEquity, 100)}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-1 mb-6 w-fit">
            {([
              { key: "shareholders", icon: Users, label: "Cổ Đông" },
              { key: "tasks", icon: CheckSquare, label: "Nhiệm Vụ" },
              { key: "meetings", icon: Calendar, label: "Cuộc Họp" },
              { key: "messages", icon: MessageSquare, label: "Nhắn Tin" },
            ] as const).map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === t.key ? "bg-AXVN-gold text-AXVN-navy" : "text-AXVN-silver/60 hover:text-AXVN-ivory"
                  }`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>

          {/* ── SHAREHOLDERS ── */}
          {tab === "shareholders" && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                <h2 className="text-AXVN-ivory font-semibold shrink-0">Cổ đông ({shareholders.length})</h2>
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-AXVN-silver/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" /></svg>
                  <input value={shSearch} onChange={(e) => setShSearch(e.target.value)}
                    placeholder="Tìm tên hoặc email..."
                    className="w-full pl-8 pr-3 py-2 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-xl placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/40" />
                </div>
                {/* Role filter */}
                <select value={shRoleFilter} onChange={(e) => setShRoleFilter(e.target.value)}
                  className="py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-xl focus:outline-none focus:border-AXVN-gold/40">
                  <option value="">Tất cả vai trò</option>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                {/* Status filter */}
                <select value={shStatusFilter} onChange={(e) => setShStatusFilter(e.target.value)}
                  className="py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-xl focus:outline-none focus:border-AXVN-gold/40">
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đã kích hoạt</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="suspended">Bị khóa</option>
                </select>
                {/* KYC filter */}
                <select value={shKycFilter} onChange={(e) => setShKycFilter(e.target.value)}
                  className="py-2 px-3 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-xs rounded-xl focus:outline-none focus:border-AXVN-gold/40">
                  <option value="">Tất cả KYC</option>
                  <option value="not_started">Chưa KYC</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã xác minh</option>
                  <option value="rejected">Từ chối</option>
                </select>
                <button onClick={() => setShModal({})} className="shrink-0 flex items-center gap-2 px-4 py-2 bg-AXVN-gold text-AXVN-navy text-sm font-bold rounded-xl hover:bg-AXVN-champagne transition-colors">
                  <Plus className="w-4 h-4" /> Thêm
                </button>
              </div>
              {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-AXVN-gold animate-spin" /></div> : (
                <div className="space-y-2">
                  {shareholders.map((sh) => (
                    <div key={sh._id} className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-10 h-10 rounded-xl bg-AXVN-gold/10 flex items-center justify-center text-lg shrink-0">
                          {ROLE_LABELS[sh.role]?.split(" ")[0] || "👤"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-AXVN-ivory font-semibold text-sm">{sh.name}</p>
                            <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${STATUS_CLS[sh.status] || ""}`}>
                              {sh.status === "active" ? "Đang hoạt động" : sh.status === "pending" ? "Chờ duyệt" : "Bị khóa"}
                            </span>
                            <span className="text-AXVN-gold text-xs font-bold">{sh.equityPercent}%</span>
                            {sh.kycStatus && KYC_STATUS[sh.kycStatus] && (() => {
                              const kyc = KYC_STATUS[sh.kycStatus!];
                              const KycIcon = kyc.icon;
                              return (
                                <span className={`flex items-center gap-1 text-[10px] border px-1.5 py-0.5 rounded-full font-semibold ${kyc.cls}`}>
                                  <KycIcon className="w-2.5 h-2.5" />
                                  {kyc.label}
                                </span>
                              );
                            })()}
                          </div>
                          <p className="text-AXVN-silver/50 text-xs">{sh.email} · {ROLE_LABELS[sh.role] || sh.role}</p>
                          {sh.capitalCommitted > 0 && (
                            <p className="text-AXVN-silver/40 text-[10px]">Cam kết: {formatVNDCompact(sh.capitalCommitted)} · Đã góp: {formatVNDCompact(sh.capitalPaid)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setExpandedSh(expandedSh === sh._id ? null : sh._id)}
                            className="text-AXVN-silver/30 hover:text-AXVN-gold transition-colors">
                            {expandedSh === sh._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setShModal(sh)} className="text-AXVN-silver/30 hover:text-AXVN-gold transition-colors"><Pencil className="w-4 h-4" /></button>
                          {adminSession?.role === "superadmin" && (
                            <button onClick={() => deleteShareholder(sh._id)} className="text-AXVN-silver/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </div>
                      {expandedSh === sh._id && (
                        <div className="px-4 pb-4 border-t border-AXVN-gold/8">
                          {sh.notes && (
                            <>
                              <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest mt-3 mb-1">Ghi chú nội bộ</p>
                              <p className="text-AXVN-silver/60 text-xs leading-relaxed">{sh.notes}</p>
                            </>
                          )}
                          {sh.kycStatus && sh.kycStatus !== "not_started" && (
                            <div className="mt-3">
                              <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest mb-2">Trạng thái KYC</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                {(() => {
                                  const kyc = KYC_STATUS[sh.kycStatus!];
                                  const KycIcon = kyc?.icon || ShieldAlert;
                                  return (
                                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg border ${kyc?.cls || ""}`}>
                                      <KycIcon className="w-3 h-3" />
                                      {kyc?.label || sh.kycStatus}
                                    </span>
                                  );
                                })()}
                                {/* KYC action buttons — chỉ hiện khi pending */}
                                {sh.kycStatus === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleKyc(sh._id, "approve")}
                                      disabled={kycLoading === sh._id + "approve"}
                                      className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                                    >
                                      {kycLoading === sh._id + "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                      Duyệt KYC
                                    </button>
                                    <button
                                      onClick={() => handleKyc(sh._id, "reject")}
                                      disabled={kycLoading === sh._id + "reject"}
                                      className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/25 transition-colors disabled:opacity-50"
                                    >
                                      {kycLoading === sh._id + "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                      Từ chối
                                    </button>
                                  </>
                                )}
                                {/* Re-review: từ approved → có thể reject lại */}
                                {sh.kycStatus === "approved" && (
                                  <button
                                    onClick={() => handleKyc(sh._id, "reject")}
                                    disabled={kycLoading === sh._id + "reject"}
                                    className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 bg-red-500/10 text-red-400/70 border border-red-500/20 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                                  >
                                    {kycLoading === sh._id + "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                    Thu hồi KYC
                                  </button>
                                )}
                                {/* Duyệt lại sau khi rejected */}
                                {sh.kycStatus === "rejected" && (
                                  <button
                                    onClick={() => handleKyc(sh._id, "approve")}
                                    disabled={kycLoading === sh._id + "approve"}
                                    className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                                  >
                                    {kycLoading === sh._id + "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                    Duyệt lại
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TASKS ── */}
          {tab === "tasks" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-AXVN-ivory font-semibold">Danh sách nhiệm vụ ({tasks.length})</h2>
                <button onClick={() => setTaskModal({})} className="flex items-center gap-2 px-4 py-2 bg-AXVN-gold text-AXVN-navy text-sm font-bold rounded-xl hover:bg-AXVN-champagne transition-colors">
                  <Plus className="w-4 h-4" /> Thêm nhiệm vụ
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t._id} className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-4 flex items-start gap-4">
                    <div className={`text-xs font-bold ${PRIORITY_CLS[t.priority]}`}>{t.priority.toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-AXVN-ivory text-sm font-semibold">{t.title}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-AXVN-silver/40 text-[10px]">{CAT_LABELS[t.category]}</span>
                        <span className="text-AXVN-silver/40 text-[10px]">{TASK_STATUS[t.status]}</span>
                        {t.milestoneTag && <span className="text-AXVN-gold/50 text-[10px] font-mono">{t.milestoneTag}</span>}
                        {(t.assignedRoles || []).length > 0 && (
                          <span className="text-AXVN-silver/30 text-[10px]">→ {(t.assignedRoles || []).map((r) => ROLE_LABELS[r]?.split(" ").slice(1).join(" ")).join(", ")}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setTaskModal(t)} className="text-AXVN-silver/30 hover:text-AXVN-gold transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteTask(t._id)} className="text-AXVN-silver/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && <div className="text-center py-16 text-AXVN-silver/30 text-sm">Chưa có nhiệm vụ nào.</div>}
              </div>
            </div>
          )}

          {/* ── MEETINGS ── */}
          {tab === "meetings" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-AXVN-ivory font-semibold">Cuộc họp ({meetings.length})</h2>
                <button onClick={() => setMeetingModal({})} className="flex items-center gap-2 px-4 py-2 bg-AXVN-gold text-AXVN-navy text-sm font-bold rounded-xl hover:bg-AXVN-champagne transition-colors">
                  <Plus className="w-4 h-4" /> Lên lịch họp
                </button>
              </div>
              <div className="space-y-2">
                {meetings.map((m) => (
                  <div key={m._id} className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-4 flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-AXVN-gold/60 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-AXVN-ivory text-sm font-semibold">{m.title}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-AXVN-silver/50 text-xs">{new Date(m.scheduledAt).toLocaleString("vi-VN")}</span>
                        <span className="text-AXVN-gold/60 text-[10px]">{MEETING_TYPE_LABELS[m.type]}</span>
                        <span className={`text-[10px] font-semibold ${m.status === "completed" ? "text-emerald-400" : m.status === "in_progress" ? "text-yellow-400" : "text-blue-400"}`}>
                          {m.status === "scheduled" ? "Sắp tới" : m.status === "in_progress" ? "Đang họp" : m.status === "completed" ? "Hoàn thành" : "Đã hủy"}
                        </span>
                      </div>
                      {m.meetingLink && <p className="text-blue-400 text-[10px] mt-1 truncate">{m.meetingLink}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setMeetingModal(m)} className="text-AXVN-silver/30 hover:text-AXVN-gold transition-colors"><Pencil className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {meetings.length === 0 && <div className="text-center py-16 text-AXVN-silver/30 text-sm">Chưa có cuộc họp nào.</div>}
              </div>
            </div>
          )}

          {/* ── MESSAGES (Admin broadcast) ── */}
          {tab === "messages" && (
            <div>
              <h2 className="text-AXVN-ivory font-semibold mb-4">Nhắn tin với cổ đông</h2>
              <div className="flex gap-4 h-[calc(100vh-360px)]">
                {/* Channel selector */}
                <div className="w-48 shrink-0 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-2">
                  <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest px-3 py-2">Kênh liên lạc</p>
                  {[
                    { key: "general", label: "Chung" },
                    { key: "tech", label: "Công Nghệ" },
                    { key: "legal", label: "Pháp Lý" },
                    { key: "capital", label: "Vốn" },
                    { key: "announcement", label: "Thông Báo" },
                  ].map((ch) => (
                    <button key={ch.key} onClick={() => setMsgChannel(ch.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors mb-0.5 ${msgChannel === ch.key
                          ? "bg-AXVN-gold/15 text-AXVN-gold border border-AXVN-gold/20"
                          : "text-AXVN-silver/60 hover:text-AXVN-ivory hover:bg-AXVN-gold/5"
                        }`}>
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      {ch.label}
                    </button>
                  ))}
                </div>
                {/* Message thread */}
                <div className="flex-1 flex flex-col bg-AXVN-deep border border-AXVN-gold/10 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-AXVN-gold/10 flex items-center justify-between">
                    <div>
                      <p className="text-AXVN-ivory text-sm font-semibold">
                        {msgChannel === "general" ? "Chung" : msgChannel === "tech" ? "Công Nghệ" : msgChannel === "legal" ? "Pháp Lý" : msgChannel === "capital" ? "Vốn" : "Thông Báo"}
                      </p>
                      <p className="text-AXVN-silver/40 text-[11px]">{messages.length} tin nhắn</p>
                    </div>
                    <button onClick={fetchMessages} className="text-AXVN-silver/30 hover:text-AXVN-gold transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full text-AXVN-silver/30 text-sm">Chưa có tin nhắn nào.</div>
                    )}
                    {messages.map((msg) => (
                      <div key={msg._id} className={`flex ${msg.isAdminSender ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[72%] flex flex-col ${msg.isAdminSender ? "items-end" : "items-start"}`}>
                          {!msg.isAdminSender && (
                            <p className="text-[10px] text-AXVN-silver/40 mb-1 px-1">{msg.senderName}</p>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isAdminSender
                              ? "bg-AXVN-gold/20 text-AXVN-ivory rounded-tr-sm"
                              : "bg-AXVN-navy text-AXVN-silver/80 rounded-tl-sm"
                            }`}>
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-AXVN-silver/25 mt-1 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={msgBottomRef} />
                  </div>
                  <div className="px-4 py-3 border-t border-AXVN-gold/10 flex gap-2">
                    <input value={msgInput} onChange={(e) => setMsgInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAdminMessage(); } }}
                      placeholder={`Gửi thông báo đến kênh ${msgChannel}...`}
                      className="flex-1 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-4 py-2.5 focus:outline-none focus:border-AXVN-gold/40 rounded-xl transition-colors" />
                    <button onClick={sendAdminMessage} disabled={sendingMsg || !msgInput.trim()}
                      className="p-2.5 bg-AXVN-gold text-AXVN-navy rounded-xl hover:bg-AXVN-champagne transition-colors disabled:opacity-40">
                      {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {shModal !== false && <ShareholderModal sh={shModal} onClose={() => setShModal(false)} onSave={saveShareholder} />}
        {taskModal !== false && <TaskModal task={taskModal} onClose={() => setTaskModal(false)} onSave={saveTask} />}
        {meetingModal !== false && <MeetingModal meeting={meetingModal} onClose={() => setMeetingModal(false)} onSave={saveMeeting} />}
      </main>
    </div>
  );
}
