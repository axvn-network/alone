"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import {
  Newspaper,
  MessageCircle,
  TrendingUp,
  PlusCircle,
  Edit3,
  ArrowRight,
  Activity,
  ChevronRight,
  FileText,
  BarChart3,
  Users,
  Handshake,
} from "lucide-react";
import { timeAgo } from "@/utils/time";

interface ActivityItem {
  id: string;
  type: "contact" | "submission";
  title: string;
  description: string;
  time: string;
}

interface Stats {
  blogPosts: number;
  totalContacts: number;
  totalSubmissions: number;
  totalShareholders: number;
  totalPlans: number;
  newEnquiries: number;
  activities: ActivityItem[];
}

const statCards = [
  { key: "blogPosts" as const, label: "Bài Viết", icon: Newspaper },
  { key: "totalContacts" as const, label: "Yêu Cầu Liên Hệ", icon: MessageCircle },
  { key: "totalSubmissions" as const, label: "Đề Xuất Đầu Tư", icon: TrendingUp },
  { key: "totalShareholders" as const, label: "Cổ Đông Hoạt Động", icon: Users },
  { key: "totalPlans" as const, label: "Gói Đầu Tư", icon: Handshake },
];

const quickActions = [
  { label: "Tạo Bài Viết", icon: PlusCircle, href: "/admin/blog/new" },
  { label: "Thêm Tài Liệu", icon: FileText, href: "/admin/documents" },
  { label: "Xem Yêu Cầu", icon: MessageCircle, href: "/admin/enquiries" },
  { label: "Quản Lý Nội Dung", icon: Edit3, href: "/admin/content" },
  { label: "Hạng Mục Hợp Tác", icon: Handshake, href: "/admin/investment-plans" },
  { label: "Cổ Đông Portal", icon: Users, href: "/admin/shareholders" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch(() => {/* non-fatal */});
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#03080e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gvi-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-gvi-gold/20 selection:text-gvi-champagne font-sans">
      <AdminSidebar active="Dashboard" />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gvi-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gvi-navy/50 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10">
          <AdminNavbar title="Tổng quan hệ thống" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            {/* Header section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gvi-ivory tracking-tight mb-2">Chào mừng trở lại, Quản trị viên</h2>
              <p className="text-sm text-gvi-silver/70 font-light">Dưới đây là tình hình hoạt động của nền tảng hôm nay.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {statCards.map((card) => (
                <div
                  key={card.key}
                  className="group relative bg-[#07111D]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gvi-gold/10 hover:border-gvi-gold/30 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-black/40"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gvi-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gvi-deep/80 border border-gvi-gold/10 flex items-center justify-center group-hover:bg-[#0b1b2e] transition-colors duration-300">
                        <card.icon className="w-4 h-4 text-gvi-gold group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gvi-ivory to-gvi-silver tracking-tight">
                        {stats[card.key]}
                      </p>
                      <p className="text-[10px] text-gvi-silver/50 mt-1.5 font-medium leading-tight">{card.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 relative bg-[#07111D]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gvi-charcoal/80 shadow-2xl shadow-black/20 flex flex-col">
                <div className="p-6 border-b border-gvi-charcoal/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gvi-deep flex items-center justify-center">
                      <Activity className="w-4 h-4 text-gvi-gold" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gvi-ivory">Hoạt động gần đây</h2>
                      <p className="text-xs text-gvi-silver/60">Cập nhật mới nhất từ nền tảng</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 flex-1">
                  {stats.activities.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 opacity-50">
                      <Activity className="w-8 h-8 text-gvi-silver/30 mb-3" />
                      <p className="text-gvi-silver text-sm">Không có hoạt động gần đây</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {stats.activities.slice(0, 5).map((a) => (
                        <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gvi-deep/50 transition-colors cursor-pointer group">
                          <div className="w-10 h-10 rounded-full bg-[#040A13] border border-gvi-charcoal flex items-center justify-center shrink-0 group-hover:border-gvi-gold/30 transition-colors">
                            {a.type === "contact" ? <MessageCircle className="w-4 h-4 text-gvi-champagne" /> : <TrendingUp className="w-4 h-4 text-gvi-champagne" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-gvi-gold/80 bg-gvi-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">{a.type}</span>
                              <p className="text-gvi-ivory text-sm font-medium truncate">{a.title}</p>
                            </div>
                            <p className="text-gvi-silver/60 text-xs truncate capitalize">{a.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gvi-silver/40 font-medium whitespace-nowrap">{timeAgo(a.time)}</span>
                            <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center group-hover:bg-gvi-charcoal transition-colors">
                              <ChevronRight className="w-4 h-4 text-gvi-silver/30 group-hover:text-gvi-gold transition-colors" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {stats.newEnquiries > 0 && (
                    <div className="p-3 border-t border-gvi-charcoal/50">
                      <Link
                        href="/admin/enquiries"
                        className="flex items-center justify-center gap-2 text-xs text-gvi-gold hover:text-gvi-champagne transition-colors font-medium"
                      >
                        <span className="w-5 h-5 bg-gvi-gold rounded-full text-gvi-navy text-[10px] font-bold flex items-center justify-center">{stats.newEnquiries}</span>
                        yêu cầu chưa đọc — Xem tất cả
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="relative bg-[#07111D]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gvi-charcoal/80 shadow-2xl shadow-black/20 flex flex-col">
                <div className="p-6 border-b border-gvi-charcoal/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gvi-deep flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-gvi-gold" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gvi-ivory">Thao tác nhanh</h2>
                    <p className="text-xs text-gvi-silver/60">Các tác vụ phổ biến</p>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col gap-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center justify-between p-4 bg-gvi-deep/30 border border-gvi-charcoal/50 rounded-xl hover:bg-[#0b1b2e] hover:border-gvi-gold/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gvi-navy flex items-center justify-center shadow-inner shadow-black/50 group-hover:bg-[#050C16] transition-colors">
                          <action.icon className="w-4 h-4 text-gvi-silver group-hover:text-gvi-gold transition-colors duration-300" />
                        </div>
                        <span className="text-sm font-medium text-gvi-silver group-hover:text-gvi-ivory transition-colors">{action.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gvi-silver/30 group-hover:text-gvi-gold transition-all duration-300 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
