"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, Bell } from "lucide-react";

interface AdminNavbarProps {
  title: string;
}

interface AdminInfo {
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export default function AdminNavbar({ title }: AdminNavbarProps) {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => { if (d.success) setAdminInfo(d.data); })
      .catch(() => {});
  }, []);

  const initial = adminInfo?.name?.charAt(0).toUpperCase() ?? "A";
  const displayName = adminInfo?.name ?? "Quản trị viên";
  const roleLabel = adminInfo?.role === "superadmin" ? "Super Admin" : "Admin";

  return (
    <div className="bg-[#03080e]/85 backdrop-blur-xl border-b border-gvi-gold/10 sticky top-0 z-30 shadow-sm shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pl-14 md:pl-6">
        <div className="flex items-center justify-between h-14">

          {/* Tiêu đề trang */}
          <h1 className="text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gvi-ivory to-gvi-silver/70 tracking-tight truncate">
            {title}
          </h1>

          <div className="flex items-center gap-2">
            {/* Bell (placeholder) */}
            <button className="p-2 text-gvi-silver/40 hover:text-gvi-gold transition-colors rounded-lg hover:bg-gvi-gold/8">
              <Bell className="w-4 h-4" />
            </button>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2 text-gvi-silver/40 hover:text-gvi-gold transition-all duration-200 rounded-lg hover:bg-gvi-gold/8 hover:rotate-45"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* User info */}
            <div className="pl-3 ml-1 border-l border-gvi-charcoal/60 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-gvi-gold to-[#a17e33] rounded-full flex items-center justify-center shadow shadow-gvi-gold/20 shrink-0">
                <span className="text-[11px] font-bold text-gvi-navy">{initial}</span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[12px] font-semibold text-gvi-ivory">{displayName}</span>
                <span className="text-[10px] text-gvi-silver/50">{roleLabel}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
