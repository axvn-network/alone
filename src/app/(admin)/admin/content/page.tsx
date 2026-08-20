"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/shared/components/admin/AdminSidebar";
import AdminNavbar from "@/shared/components/admin/AdminNavbar";
import { FileText, ChevronRight } from "lucide-react";
import { timeAgo } from "@/utils/time";

interface PageItem {
  slug: string;
  title: string;
  updatedAt: string;
}

export default function ContentList() {
  const [pages, setPages] = useState<PageItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((res) => setPages(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-AXVN-gold/20 selection:text-AXVN-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-AXVN-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-AXVN-navy/50 rounded-full blur-[150px] pointer-events-none" />

        <AdminNavbar title="Quản Lý Nội Dung" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 relative z-10">
          <div className="mb-6">
            <p className="text-AXVN-silver text-sm">
              Quản lý tất cả các trang tĩnh của website
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/admin/content/${page.slug}`}
                className="flex flex-col p-6 bg-[#07111D]/80 backdrop-blur-xl border border-AXVN-gold/10 hover:border-AXVN-gold/30 hover:-translate-y-1 shadow-xl shadow-black/20 transition-all duration-300 group rounded-2xl"
              >
                <div className="w-10 h-10 bg-AXVN-deep flex items-center justify-center rounded-lg mb-4">
                  <FileText className="w-4 h-4 text-AXVN-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-AXVN-ivory group-hover:text-AXVN-gold transition-colors">
                    {page.title}
                  </p>
                  <p className="text-[11px] text-AXVN-silver/40 mt-1">
                    Cập nhật {timeAgo(page.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-AXVN-charcoal">
                  <span className="text-xs text-AXVN-silver/30 group-hover:text-AXVN-gold/60 transition-colors">
                    Chỉnh sửa
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-AXVN-silver/20 group-hover:text-AXVN-gold/50 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
