"use client";

/**
 * /admin/admins — Quản lý tài khoản quản trị viên.
 * Chỉ dành cho Siêu Quản Trị Viên (superadmin).
 *
 * Tính năng:
 *   - Xem danh sách tất cả admin / superadmin
 *   - Tạo admin mới (superadmin only)
 *   - Đổi vai trò admin ↔ superadmin
 *   - Xóa admin (không xóa được chính mình)
 */

import { useEffect, useState } from "react";
import AdminSidebar from "@/app/(admin)/components/AdminSidebar";
import AdminNavbar from "@/app/(admin)/components/AdminNavbar";
import { useAdminSession } from "@/contexts/AdminSessionContext";
import { useCsrf } from "@/contexts/CsrfContext";
import { toast } from "sonner";
import {
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  Crown,
  Edit2,
  X,
  Save,
} from "lucide-react";
import { timeAgo } from "@/utils/time";

interface AdminAccount {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  lastLogin: string | null;
  createdAt: string;
  mfaEnabled: boolean;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
}

const EMPTY_FORM: FormState = { name: "", email: "", password: "", role: "admin" };

export default function AdminsPage() {
  const { adminInfo } = useAdminSession();
  const { csrfFetch } = useCsrf();

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Chặn truy cập nếu không phải superadmin
  const isSuperAdmin = adminInfo?.role === "superadmin";

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.success) setAdmins(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchAdmins(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(a: AdminAccount) {
    setForm({ name: a.name, email: a.email, password: "", role: a.role });
    setEditId(a._id);
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Vui lòng điền đầy đủ họ tên và email.");
      return;
    }
    if (!editId && !form.password) {
      toast.error("Mật khẩu bắt buộc khi tạo tài khoản mới.");
      return;
    }
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId
        ? { _id: editId, name: form.name, role: form.role, ...(form.password ? { password: form.password } : {}) }
        : form;

      const res = await csrfFetch("/api/admin/admins", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }

      toast.success(editId ? "Đã cập nhật tài khoản." : "Đã tạo tài khoản admin mới.");
      setShowModal(false);
      await fetchAdmins();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xóa tài khoản "${name}"? Hành động này không thể hoàn tác.`)) return;
    const res = await csrfFetch(`/api/admin/admins?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Đã xóa tài khoản.");
      await fetchAdmins();
    } else {
      toast.error(data.message ?? "Xóa thất bại.");
    }
  }

  // ── Không phải superadmin → thông báo từ chối ─────────────────────────────
  if (!loading && adminInfo && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#03080e] flex font-sans">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <AdminNavbar title="Quản Lý Admin" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-10 max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-AXVN-ivory font-semibold text-lg mb-2">Quyền truy cập bị từ chối</h2>
              <p className="text-AXVN-silver/50 text-sm leading-relaxed">
                Trang này chỉ dành cho <span className="text-AXVN-gold font-medium">Siêu Quản Trị Viên</span>.
                Liên hệ superadmin để được cấp quyền.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <AdminNavbar title="Quản Lý Admin" />

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Crown className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-AXVN-ivory font-semibold">Tài Khoản Quản Trị</h2>
                <p className="text-AXVN-silver/40 text-xs">{admins.length} tài khoản · Chỉ Siêu Quản Trị mới có thể sửa</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAdmins}
                disabled={loading}
                className="p-2 border border-AXVN-gold/20 text-AXVN-silver rounded-xl hover:border-AXVN-gold/40 transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 bg-AXVN-gold text-AXVN-navy text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Thêm Admin
              </button>
            </div>
          </div>

          {/* Danh sách */}
          <div className="bg-[#07111D]/70 border border-white/6 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-20">
                <RefreshCw className="w-5 h-5 text-AXVN-gold animate-spin" />
              </div>
            ) : admins.length === 0 ? (
              <p className="text-center py-16 text-AXVN-silver/40 text-sm">Chưa có tài khoản admin nào.</p>
            ) : (
              <div className="divide-y divide-white/4">
                {admins.map((a) => (
                  <div key={a._id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm
                      ${a.role === "superadmin" ? "bg-purple-500/15 border border-purple-500/30 text-purple-300" : "bg-AXVN-gold/10 border border-AXVN-gold/20 text-AXVN-gold"}`}>
                      {a.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Thông tin */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-AXVN-ivory text-sm font-medium truncate">{a.name}</p>
                        {a.role === "superadmin"
                          ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/20 text-purple-300 font-semibold uppercase tracking-wider">Superadmin</span>
                          : <span className="text-[10px] px-1.5 py-0.5 rounded bg-AXVN-gold/10 border border-AXVN-gold/20 text-AXVN-gold font-semibold uppercase tracking-wider">Admin</span>
                        }
                        {a.mfaEnabled && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-label="MFA đã bật" />}
                      </div>
                      <p className="text-AXVN-silver/50 text-xs truncate mt-0.5">{a.email}</p>
                    </div>

                    {/* Đăng nhập cuối */}
                    <div className="hidden md:block text-right shrink-0">
                      <p className="text-AXVN-silver/30 text-xs">
                        {a.lastLogin ? `Đăng nhập ${timeAgo(a.lastLogin)}` : "Chưa đăng nhập"}
                      </p>
                      <p className="text-AXVN-silver/20 text-[11px] mt-0.5">
                        Tạo {timeAgo(a.createdAt)}
                      </p>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-2 text-AXVN-silver/40 hover:text-AXVN-ivory border border-transparent hover:border-white/10 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {a._id !== adminInfo?.id && (
                        <button
                          onClick={() => handleDelete(a._id, a.name)}
                          className="p-2 text-AXVN-silver/40 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal tạo / sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#06101a] border border-AXVN-gold/20 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-AXVN-ivory font-semibold">
                {editId ? "Chỉnh Sửa Tài Khoản" : "Tạo Tài Khoản Admin"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-AXVN-silver/40 hover:text-AXVN-ivory transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5">Họ tên</label>
                <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#0c1a28] border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-AXVN-gold/50 transition-colors" />
              </div>

              <div>
                <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5">Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  disabled={!!editId}
                  placeholder="admin@axvn.vn"
                  className="w-full bg-[#0c1a28] border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-AXVN-gold/50 transition-colors disabled:opacity-40" />
              </div>

              <div>
                <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5">
                  Mật khẩu {editId && <span className="text-AXVN-silver/30">(để trống = giữ nguyên)</span>}
                </label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder={editId ? "••••••••" : "Ít nhất 8 ký tự"}
                  className="w-full bg-[#0c1a28] border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-AXVN-gold/50 transition-colors" />
              </div>

              <div>
                <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5">Vai trò</label>
                <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as "admin" | "superadmin" }))}
                  className="w-full bg-[#0c1a28] border border-white/10 text-AXVN-ivory text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-AXVN-gold/50 transition-colors">
                  <option value="admin" className="bg-[#06101a]">Admin — Quản Trị Viên</option>
                  <option value="superadmin" className="bg-[#06101a]">Superadmin — Siêu Quản Trị</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-white/10 text-AXVN-silver text-sm rounded-xl hover:border-white/20 transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-AXVN-gold text-AXVN-navy text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editId ? "Lưu thay đổi" : "Tạo tài khoản"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
