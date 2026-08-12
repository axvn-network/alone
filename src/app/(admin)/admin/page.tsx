"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminSession } from "@/contexts/AdminSessionContext";
import {
  Newspaper,
  MessageCircle,
  TrendingUp,
  PlusCircle,
  Edit3,
  ArrowRight,
  Activity,
  FileText,
  BarChart3,
  Users,
  Handshake,
  Clock,
  ChevronRight,
  Inbox,
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
  {
    key: "blogPosts"         as const,
    label: "Bài Viết",
    sub: "Đã xuất bản",
    icon: Newspaper,
    href: "/admin/blog",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
  },
  {
    key: "totalContacts"     as const,
    label: "Liên Hệ",
    sub: "Yêu cầu nhận được",
    icon: MessageCircle,
    href: "/admin/enquiries",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
  {
    key: "totalSubmissions"  as const,
    label: "Đề Xuất",
    sub: "Hợp tác đầu tư",
    icon: TrendingUp,
    href: "/admin/enquiries?type=submission",
    color: "from-gvi-gold/20 to-gvi-gold/5",
    iconColor: "text-gvi-gold",
    borderColor: "border-gvi-gold/20",
  },
  {
    key: "totalShareholders" as const,
    label: "Cổ Đông",
    sub: "Đang hoạt động",
    icon: Users,
    href: "/admin/shareholders",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
  },
  {
    key: "totalPlans"        as const,
    label: "Hạng Mục",
    sub: "Hợp tác hiện có",
    icon: Handshake,
    href: "/admin/investment-plans",
    color: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
  },
];

const quickActions = [
  { label: "Tạo Bài Viết Mới",    icon: PlusCircle,  href: "/admin/blog/new",           color: "text-blue-400" },
  { label: "Thêm Tài Liệu",        icon: FileText,    href: "/admin/documents",           color: "text-gvi-gold" },
  { label: "Xem Yêu Cầu",          icon: Inbox,       href: "/admin/enquiries",           color: "text-emerald-400" },
  { label: "Quản Lý Nội Dung",     icon: Edit3,       href: "/admin/content",             color: "text-purple-400" },
  { label: "Hạng Mục Hợp Tác",     icon: Handshake,   href: "/admin/investment-plans",    color: "text-orange-400" },
  { label: "Cổ Đông Portal",        icon: Users,       href: "/admin/shareholders",        color: "text-pink-400" },
];

export default function AdminDashboard() {
  const { adminInfo: admin }  = useAdminSession();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((res) => { if (res.success) setStats(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="min-h-screen bg-[#03080e] flex font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminNavbar title="Tổng Quan" />

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* ── Greeting ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gvi-ivory">
                {greeting()}{admin?.name ? `, ${admin.name}` : ""} 👋
              </h2>
              <p className="text-sm text-gvi-silver/50 mt-1">
                {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            {stats && stats.newEnquiries > 0 && (
              <Link
                href="/admin/enquiries"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gvi-gold/10 border border-gvi-gold/30 text-gvi-gold text-sm font-semibold rounded-xl hover:bg-gvi-gold/20 transition-colors"
              >
                <span className="w-5 h-5 bg-gvi-gold rounded-full text-gvi-navy text-[10px] font-bold flex items-center justify-center shrink-0">
                  {stats.newEnquiries}
                </span>
                yêu cầu chưa đọc
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* ── Stat Cards ───────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-28 bg-[#07111D]/60 rounded-2xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {statCards.map((card) => (
                <Link
                  key={card.key}
                  href={card.href}
                  className={`group relative bg-[#07111D]/70 backdrop-blur-xl rounded-2xl border ${card.borderColor} hover:border-opacity-60 hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                >
                  {/* top gradient strip */}
                  <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${card.color}`} />
                  <div className="p-5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                      <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <p className="text-2xl font-extrabold text-gvi-ivory tracking-tight">
                      {stats ? stats[card.key] : "—"}
                    </p>
                    <p className="text-[11px] font-semibold text-gvi-ivory/80 mt-0.5">{card.label}</p>
                    <p className="text-[10px] text-gvi-silver/40 mt-0.5 truncate">{card.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── Main two-column section ───────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Activity — 2/3 width */}
            <div className="lg:col-span-2 bg-[#07111D]/70 backdrop-blur-xl rounded-2xl border border-white/6 flex flex-col overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gvi-gold/10 border border-gvi-gold/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-gvi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gvi-ivory">Hoạt Động Gần Đây</h3>
                    <p className="text-[11px] text-gvi-silver/40">Cập nhật mới nhất từ hệ thống</p>
                  </div>
                </div>
                <Link
                  href="/admin/enquiries"
                  className="text-[11px] text-gvi-gold/70 hover:text-gvi-gold flex items-center gap-1 transition-colors"
                >
                  Xem tất cả <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* list */}
              <div className="flex-1 divide-y divide-white/4">
                {!stats || stats.activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Activity className="w-8 h-8 text-gvi-silver/20 mb-3" />
                    <p className="text-sm text-gvi-silver/40">Chưa có hoạt động nào</p>
                  </div>
                ) : (
                  stats.activities.slice(0, 6).map((a) => (
                    <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors group">
                      {/* icon */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        a.type === "contact"
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-gvi-gold/10 border border-gvi-gold/20"
                      }`}>
                        {a.type === "contact"
                          ? <MessageCircle className="w-4 h-4 text-emerald-400" />
                          : <TrendingUp className="w-4 h-4 text-gvi-gold" />}
                      </div>

                      {/* text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gvi-ivory truncate">{a.title}</p>
                        <p className="text-xs text-gvi-silver/50 truncate mt-0.5">{a.description}</p>
                      </div>

                      {/* badge + time */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          a.type === "contact"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-gvi-gold/10 text-gvi-gold"
                        }`}>
                          {a.type === "contact" ? "Liên hệ" : "Đề xuất"}
                        </span>
                        <span className="text-[11px] text-gvi-silver/35 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{timeAgo(a.time)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions — 1/3 width */}
            <div className="bg-[#07111D]/70 backdrop-blur-xl rounded-2xl border border-white/6 flex flex-col overflow-hidden">
              {/* header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
                <div className="w-8 h-8 rounded-lg bg-gvi-gold/10 border border-gvi-gold/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-gvi-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gvi-ivory">Thao Tác Nhanh</h3>
                  <p className="text-[11px] text-gvi-silver/40">Các tác vụ thường dùng</p>
                </div>
              </div>

              {/* actions */}
              <div className="flex-1 p-4 flex flex-col gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 hover:border-gvi-gold/20 hover:bg-gvi-gold/4 transition-all duration-200 group"
                  >
                    <action.icon className={`w-4 h-4 ${action.color} shrink-0`} />
                    <span className="text-[13px] font-medium text-gvi-silver group-hover:text-gvi-ivory transition-colors flex-1">
                      {action.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gvi-silver/25 group-hover:text-gvi-gold group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
