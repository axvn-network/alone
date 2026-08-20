"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  FolderOpen,
  Layers,
  Handshake,
  Users,
  UserCog,
  ShieldCheck,
  ClipboardList,
  FileSearch2,
  Crown,
} from "lucide-react";
import { useAdminSession } from "@/contexts/AdminSessionContext";

// ── Link dùng chung cho tất cả admin ─────────────────────────────────────────
const COMMON_LINKS = [
  { label: "Tổng Quan", icon: LayoutDashboard, href: "/admin" },
  { label: "Visual Editor", icon: Layers, href: "/admin/visual-editor" },
  { label: "Cổ Đông Portal", icon: Users, href: "/admin/shareholders" },
  { label: "Người Dùng Công Khai", icon: UserCog, href: "/admin/public-users" },
  { label: "Quản Lý Nội Dung", icon: FileText, href: "/admin/content" },
  { label: "Bài Viết & Tin Tức", icon: Newspaper, href: "/admin/blog" },
  { label: "Tài Liệu & CBTT", icon: FolderOpen, href: "/admin/documents" },
  {
    label: "Hạng Mục Hợp Tác",
    icon: Handshake,
    href: "/admin/investment-plans",
  },
  {
    label: "Đơn Đăng Ký",
    icon: FileSearch2,
    href: "/admin/partner-applications",
  },
  { label: "Yêu Cầu", icon: MessageCircle, href: "/admin/enquiries" },
  { label: "Nhật Ký", icon: ClipboardList, href: "/admin/audit-log" },
  { label: "Cài Đặt", icon: Settings, href: "/admin/settings" },
];

// ── Link chỉ dành cho Siêu Quản Trị Viên ─────────────────────────────────────
const SUPERADMIN_ONLY_LINKS = [
  { label: "Quản Lý Admin", icon: Crown, href: "/admin/admins" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { adminInfo } = useAdminSession();

  // Tổng hợp link theo vai trò
  const links = [
    ...COMMON_LINKS,
    ...(adminInfo?.role === "superadmin" ? SUPERADMIN_ONLY_LINKS : []),
  ];

  async function handleLogout() {
    setOpen(false);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.push("/admin-login");
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-40 md:hidden bg-AXVN-navy border border-AXVN-charcoal p-2 text-AXVN-silver hover:text-AXVN-champagne shadow-sm rounded-md"
        aria-label="Mở menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-60 bg-[#03080e]/98 backdrop-blur-xl flex flex-col shrink-0 h-screen transition-transform duration-300 md:translate-x-0 border-r border-AXVN-gold/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-AXVN-gold/10 flex items-center justify-between">
          <Link href="/admin" onClick={() => setOpen(false)}>
            <Image
              src="/large-logo.png"
              alt="AXVN Tech Holding"
              width={160}
              height={48}
              className="h-9 w-auto object-contain brightness-110 drop-shadow-md"
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-AXVN-silver hover:text-AXVN-champagne transition-colors p-1"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin info */}
        {adminInfo && (
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-AXVN-gold/8 border border-AXVN-gold/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-AXVN-gold to-[#a17e33] flex items-center justify-center shrink-0 shadow shadow-AXVN-gold/20">
                <span className="text-AXVN-navy text-xs font-bold">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-AXVN-ivory text-xs font-semibold truncate leading-tight">
                  {adminInfo.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 shrink-0 text-AXVN-gold/60" />
                  <span
                    className={`text-[10px] font-medium ${adminInfo.role === "superadmin" ? "text-AXVN-gold/80" : "text-AXVN-silver/60"}`}
                  >
                    {adminInfo.role === "superadmin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] transition-all duration-200 rounded-xl relative group ${
                  active
                    ? "text-AXVN-gold font-semibold bg-gradient-to-r from-AXVN-gold/12 to-transparent border border-AXVN-gold/15"
                    : "text-AXVN-silver/70 hover:text-AXVN-ivory hover:bg-white/4"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-AXVN-champagne to-AXVN-gold rounded-r-full shadow-[0_0_6px_rgba(201,162,74,0.5)]" />
                )}
                <link.icon
                  className={`w-4 h-4 shrink-0 transition-all duration-200 ${active ? "text-AXVN-gold" : "group-hover:text-AXVN-gold/70"}`}
                />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-AXVN-gold/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-AXVN-silver/50 hover:text-red-400/80 transition-all duration-200 hover:bg-red-500/6 rounded-xl group"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
