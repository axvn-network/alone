"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

const links = [
  { label: "Tổng quan",          hrefKey: "Dashboard",         icon: LayoutDashboard, href: "/admin" },
  { label: "Visual Editor",      hrefKey: "Visual Editor",     icon: Layers,          href: "/admin/visual-editor" },
  { label: "Cổ Đông Portal",     hrefKey: "Shareholders",      icon: Users,           href: "/admin/shareholders" },
  { label: "Quản lý nội dung",   hrefKey: "Content",           icon: FileText,        href: "/admin/content" },
  { label: "Bài viết & Tin tức", hrefKey: "Blog Posts",        icon: Newspaper,       href: "/admin/blog" },
  { label: "Tài liệu & CBTT",    hrefKey: "Documents",         icon: FolderOpen,      href: "/admin/documents" },
  { label: "Hạng Mục Hợp Tác",  hrefKey: "Investment Plans",  icon: Handshake,       href: "/admin/investment-plans" },
  { label: "Yêu cầu hợp tác",   hrefKey: "Enquiries",         icon: MessageCircle,   href: "/admin/enquiries" },
  { label: "Nhật ký hoạt động",  hrefKey: "Audit Log",         icon: ClipboardList,   href: "/admin/audit-log" },
  { label: "Cài đặt hệ thống",  hrefKey: "Settings",          icon: Settings,        href: "/admin/settings" },
];

interface AdminSidebarProps {
  active: string;
}

interface AdminInfo {
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export default function AdminSidebar({ active }: AdminSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin-session")
      .then((r) => r.json())
      .then((d) => { if (d.success) setAdminInfo(d.data); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/admin-logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/admin-login");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-40 md:hidden bg-gvi-navy border border-gvi-charcoal p-2 text-gvi-silver hover:text-gvi-champagne shadow-sm rounded-md"
        aria-label="Open menu"
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
        className={`fixed md:sticky top-0 left-0 z-40 w-64 bg-[#03080e]/95 backdrop-blur-xl flex flex-col shrink-0 h-screen transition-transform duration-300 md:translate-x-0 border-r border-gvi-gold/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gvi-gold/10">
          <div className="flex items-center justify-between">
            <Image src="/large-logo.png" alt="GVI Tech Holding" width={200} height={56} className="h-10 w-auto object-contain brightness-110 drop-shadow-md" />
            <button
              onClick={() => setOpen(false)}
              className="md:hidden text-gvi-silver hover:text-gvi-champagne transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin info */}
        {adminInfo && (
          <div className="px-4 py-3 border-b border-gvi-gold/8 mx-2 my-2 rounded-xl bg-gvi-gold/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gvi-gold/20 flex items-center justify-center shrink-0">
                <span className="text-gvi-gold text-xs font-bold">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-gvi-ivory text-xs font-semibold truncate">{adminInfo.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-gvi-gold/70 shrink-0" />
                  <span className="text-gvi-gold/70 text-[10px] font-medium">
                    {adminInfo.role === "superadmin" ? "Superadmin" : "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1.5 overflow-auto">
          {links.map((link) => {
            const isActive = link.label === active || link.hrefKey === active;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 rounded-xl relative group overflow-hidden ${
                  isActive
                    ? "text-gvi-gold font-medium bg-gradient-to-r from-gvi-gold/10 to-transparent border border-gvi-gold/10 shadow-sm"
                    : "text-gvi-silver hover:text-gvi-ivory hover:bg-gvi-gold/5"
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-gvi-champagne to-gvi-gold rounded-r-full shadow-[0_0_8px_rgba(201,162,74,0.6)]" />}
                <link.icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-gvi-gold"}`} />
                <span className="tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gvi-gold/10">
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gvi-silver/60 hover:text-gvi-champagne transition-all duration-300 hover:bg-gvi-gold/5 rounded-xl group"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-wide">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
