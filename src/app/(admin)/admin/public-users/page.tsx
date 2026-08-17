"use client";

/**
 * /admin/public-users — Quản lý Người Dùng Công Khai.
 *
 * Tính năng:
 *   - Xem danh sách tất cả public user
 *   - Lọc theo trạng thái xác thực email, đăng ký bản tin
 *   - Vô hiệu hoá / kích hoạt tài khoản
 *   - Xem chi tiết người dùng
 *   - Xóa tài khoản (superadmin only)
 */

import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/app/(admin)/components/AdminSidebar";
import AdminNavbar from "@/app/(admin)/components/AdminNavbar";
import { useAdminSession } from "@/contexts/AdminSessionContext";
import { useCsrf } from "@/contexts/CsrfContext";
import { toast } from "sonner";
import {
  Users,
  RefreshCw,
  Search,
  Mail,
  MailCheck,
  Newspaper,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Clock,
} from "lucide-react";
import { timeAgo } from "@/utils/time";

interface PublicUserItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  newsletterSubscribed: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
}

export default function PublicUsersPage() {
  const { adminInfo } = useAdminSession();
  const { csrfFetch } = useCsrf();

  const [users, setUsers] = useState<PublicUserItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const isSuperAdmin = adminInfo?.role === "superadmin";

  const fetchUsers = useCallback(async (p = 1, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (q) params.set("search", q);
      const res = await fetch(`/api/admin/public-users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setMeta(data.data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Chỉ fetch khi mount — việc tìm kiếm xử lý qua form submit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void fetchUsers(1); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    void fetchUsers(1, search);
  }

  async function toggleActive(id: string, current: boolean, name: string) {
    const res = await csrfFetch("/api/admin/public-users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !current }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`Đã ${!current ? "kích hoạt" : "vô hiệu hoá"} tài khoản "${name}".`);
      void fetchUsers(page);
    } else {
      toast.error(data.message ?? "Thao tác thất bại.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xóa vĩnh viễn tài khoản "${name}"? Không thể hoàn tác.`)) return;
    const res = await csrfFetch(`/api/admin/public-users?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Đã xóa tài khoản.");
      void fetchUsers(page);
    } else {
      toast.error(data.message ?? "Xóa thất bại.");
    }
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <AdminNavbar title="Người Dùng Công Khai" />

        <div className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-AXVN-ivory font-semibold">Người Dùng Công Khai</h2>
                <p className="text-AXVN-silver/40 text-xs">{meta.total.toLocaleString("vi-VN")} tài khoản đã đăng ký</p>
              </div>
            </div>

            {/* Tìm kiếm */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-AXVN-silver/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm tên hoặc email..."
                  className="pl-9 pr-4 py-2 bg-[#07111D] border border-white/10 text-AXVN-ivory text-xs rounded-xl w-56 focus:outline-none focus:border-AXVN-gold/40 transition-colors"
                />
              </div>
              <button type="submit"
                className="px-3 py-2 bg-AXVN-gold/10 border border-AXVN-gold/20 text-AXVN-gold text-xs font-medium rounded-xl hover:bg-AXVN-gold/20 transition-colors">
                Tìm
              </button>
              <button type="button" onClick={() => void fetchUsers(page)} disabled={loading}
                className="p-2 border border-white/10 text-AXVN-silver/40 rounded-xl hover:border-white/20 transition-colors disabled:opacity-40">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </form>
          </div>

          {/* Bảng */}
          <div className="bg-[#07111D]/70 border border-white/6 rounded-2xl overflow-hidden">
            {loading && users.length === 0 ? (
              <div className="flex justify-center py-20">
                <RefreshCw className="w-5 h-5 text-AXVN-gold animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center py-16 text-AXVN-silver/40 text-sm">Chưa có người dùng nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6 text-AXVN-silver/40 text-[11px] uppercase tracking-widest">
                      <th className="text-left px-4 py-3">Người dùng</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Liên hệ</th>
                      <th className="text-left px-4 py-3">Trạng thái</th>
                      <th className="text-left px-4 py-3 hidden lg:table-cell">Đăng ký</th>
                      <th className="text-right px-4 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-300 text-xs font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-AXVN-ivory text-xs font-medium">{u.name}</p>
                              <p className="text-AXVN-silver/40 text-[11px]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-AXVN-silver/50 text-xs">{u.phone || "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium w-fit
                              ${u.emailVerified ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"}`}>
                              {u.emailVerified ? <MailCheck className="w-2.5 h-2.5" /> : <Mail className="w-2.5 h-2.5" />}
                              {u.emailVerified ? "Email xác thực" : "Chưa xác thực"}
                            </span>
                            {u.newsletterSubscribed && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium w-fit bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Newspaper className="w-2.5 h-2.5" /> Bản tin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-AXVN-silver/40 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(u.createdAt)}
                          </p>
                          {u.lastLogin && (
                            <p className="text-AXVN-silver/25 text-[11px] mt-0.5">
                              Đăng nhập {timeAgo(u.lastLogin)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => toggleActive(u._id, u.isActive, u.name)}
                              title={u.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                              className={`p-1.5 rounded-lg border transition-all ${u.isActive ? "text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10" : "text-AXVN-silver/30 border-white/10 hover:border-white/20"}`}>
                              {u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            {isSuperAdmin && (
                              <button
                                onClick={() => handleDelete(u._id, u.name)}
                                title="Xóa tài khoản"
                                className="p-1.5 rounded-lg border border-transparent text-AXVN-silver/30 hover:text-red-400 hover:border-red-500/20 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Phân trang */}
          {meta.pages > 1 && (
            <div className="flex items-center justify-between mt-4 text-xs text-AXVN-silver/40">
              <p>Trang {meta.page}/{meta.pages} · {meta.total.toLocaleString("vi-VN")} người dùng</p>
              <div className="flex gap-2">
                <button onClick={() => { setPage((p) => Math.max(1, p - 1)); void fetchUsers(Math.max(1, page - 1)); }}
                  disabled={page <= 1}
                  className="px-3 py-1.5 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 disabled:opacity-30 transition-colors">
                  ← Trước
                </button>
                <button onClick={() => { setPage((p) => Math.min(meta.pages, p + 1)); void fetchUsers(Math.min(meta.pages, page + 1)); }}
                  disabled={page >= meta.pages}
                  className="px-3 py-1.5 border border-AXVN-gold/20 rounded-lg hover:border-AXVN-gold/40 disabled:opacity-30 transition-colors">
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
