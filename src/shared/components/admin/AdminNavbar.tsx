"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useAdminSession } from "@/contexts/AdminSessionContext";

interface AdminNavbarProps {
  title: string;
}

export default function AdminNavbar({ title }: AdminNavbarProps) {
  const { adminInfo } = useAdminSession();

  const initial = adminInfo?.name?.charAt(0).toUpperCase() ?? "A";
  const displayName = adminInfo?.name ?? "Quản trị viên";
  const roleLabel = adminInfo?.role === "superadmin" ? "Super Admin" : "Admin";

  return (
    <div className="bg-[#03080e]/85 backdrop-blur-xl border-b border-AXVN-gold/10 sticky top-0 z-30 shadow-sm shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pl-14 md:pl-6">
        <div className="flex items-center justify-between h-14">
          {/* Page title */}
          <h1 className="text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-AXVN-ivory to-AXVN-silver/70 tracking-tight truncate">
            {title}
          </h1>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2 text-AXVN-silver/40 hover:text-AXVN-gold transition-all duration-200 rounded-lg hover:bg-AXVN-gold/8 hover:rotate-45"
              title="Cài đặt"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* User info */}
            <div className="pl-3 ml-1 border-l border-AXVN-charcoal/60 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-AXVN-gold to-[#a17e33] rounded-full flex items-center justify-center shadow shadow-AXVN-gold/20 shrink-0">
                <span className="text-[11px] font-bold text-AXVN-navy">
                  {initial}
                </span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[12px] font-semibold text-AXVN-ivory">
                  {displayName}
                </span>
                <span className="text-[10px] text-AXVN-silver/50">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
