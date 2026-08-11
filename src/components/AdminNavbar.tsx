"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

interface AdminNavbarProps {
  title: string;
}

export default function AdminNavbar({ title }: AdminNavbarProps) {
  return (
    <div className="bg-[#03080e]/80 backdrop-blur-xl border-b border-gvi-gold/10 sticky top-0 z-30 shadow-sm shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pl-14 md:pl-6">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gvi-ivory to-gvi-silver tracking-tight">{title}</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/settings" className="p-2.5 text-gvi-silver/70 hover:text-gvi-gold transition-all duration-300 rounded-xl hover:bg-gvi-gold/10 hover:rotate-90">
              <Settings className="w-4 h-4" />
            </Link>
            <div className="pl-4 border-l border-gvi-charcoal flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gvi-gold to-[#a17e33] rounded-full flex items-center justify-center shadow-lg shadow-gvi-gold/20">
                <span className="text-[11px] font-bold text-gvi-navy">A</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-gvi-ivory">Quản trị viên</span>
                <span className="text-[10px] text-gvi-silver/60">Hệ thống</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
