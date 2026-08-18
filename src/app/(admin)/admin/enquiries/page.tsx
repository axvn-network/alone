"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Download,
  Trash2,
  CheckCheck,
  Mail,
  Phone,
  Building2,
  TrendingUp,
} from "lucide-react";
import AdminSidebar from "@/shared/components/admin/AdminSidebar";
import AdminNavbar from "@/shared/components/admin/AdminNavbar";
import { timeAgo } from "@/utils/time";
import { useCsrf } from "@/contexts/CsrfContext";

interface EnquiryItem {
  id: string;
  type: "contact" | "submission";
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  details: {
    phone?: string;
    company?: string;
    document?: string;
    enquiryType?: string;
    investmentRange?: string;
    fileName?: string;
  };
}

function EnquiriesContent() {
  const { csrfFetch } = useCsrf();
  const searchParams = useSearchParams();
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [selected, setSelected] = useState<EnquiryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "contact" | "submission">(() => {
    const t = searchParams.get("type");
    return (t === "contact" || t === "submission") ? t : "all";
  });

  function load() {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((res) => setEnquiries(Array.isArray(res.data) ? res.data : []));
  }

  useEffect(load, []);

  async function handleMarkRead(id: string) {
    try {
      const res = await csrfFetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Đã đánh dấu là đã đọc");
      load();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa yêu cầu này?")) return;
    try {
      const res = await csrfFetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Đã xóa yêu cầu");
      setSelected(null);
      load();
    } catch {
      toast.error("Xóa thất bại");
    }
  }

  const filtered = enquiries.filter((e) => filter === "all" || e.type === filter);
  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-AXVN-gold/20 selection:text-AXVN-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        <AdminNavbar title="Yêu Cầu Hợp Tác" />
        <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-64px)] relative z-10">
          <div className={`w-full md:w-[420px] border-b md:border-b-0 md:border-r border-AXVN-gold/10 flex flex-col bg-[#07111D]/80 backdrop-blur-xl ${selected ? "hidden md:flex" : ""}`}>
            <div className="p-4 border-b border-AXVN-gold/10">
              <div className="flex items-center justify-between mb-3">
                {unread > 0 && <span className="text-[10px] bg-AXVN-gold/15 text-AXVN-gold font-bold px-2 py-0.5 rounded-full tracking-wide">{unread} chưa đọc</span>}
              </div>
              <div className="flex gap-1 p-1 bg-AXVN-deep rounded-lg">
                {(["all", "contact", "submission"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors tracking-wide rounded-md ${filter === f ? "bg-AXVN-navy text-AXVN-ivory shadow-sm" : "text-AXVN-silver/60 hover:text-AXVN-ivory hover:bg-AXVN-gold/5"}`}>
                    {f === "all" ? "Tất cả" : f === "contact" ? "Liên hệ" : "Đề xuất"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto space-y-0.5 p-2">
              {filtered.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className={`w-full text-left p-3 transition-all rounded-lg ${selected?.id === e.id ? "bg-AXVN-gold/10 border-l-2 border-AXVN-gold" : "hover:bg-AXVN-deep/40 border-l-2 border-transparent"} ${!e.read ? "border-AXVN-gold" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${selected?.id === e.id ? "font-semibold text-AXVN-ivory" : !e.read ? "font-semibold text-AXVN-ivory" : "font-medium text-AXVN-silver/80"}`}>{e.name}</p>
                    <span className="text-[10px] text-AXVN-silver/50 whitespace-nowrap">{timeAgo(e.createdAt)}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${selected?.id === e.id ? "text-AXVN-silver/70" : "text-AXVN-silver/50"}`}>{e.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase tracking-wider ${selected?.id === e.id ? "text-AXVN-gold/70" : "text-AXVN-silver/40"}`}>{e.type}</span>
                    {!e.read && <span className="w-1.5 h-1.5 bg-AXVN-gold rounded-full" />}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center text-AXVN-silver/50 text-xs py-10">Không tìm thấy yêu cầu nào</p>}
            </div>
          </div>

          <div className={`flex-1 p-5 md:p-8 overflow-auto bg-[#03080e] ${!selected ? "hidden md:flex md:items-center md:justify-center" : ""}`}>
            {selected ? (
              <div className="max-w-2xl mx-auto space-y-6 w-full">
                <button onClick={() => setSelected(null)} className="md:hidden flex items-center gap-1.5 text-AXVN-silver hover:text-AXVN-ivory text-xs transition-colors mb-3 rounded-md">
                  <svg className="w-3.5 h-3.5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  Quay lại danh sách
                </button>

                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-AXVN-ivory tracking-tight">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-AXVN-gold text-sm hover:text-AXVN-champagne inline-flex items-center gap-1.5 mt-1">
                      <Mail className="w-4 h-4" /> {selected.email}
                    </a>
                    <p className="text-AXVN-silver/70 text-xs mt-3 capitalize flex items-center gap-2">
                      <span className="px-2 py-1 bg-AXVN-deep border border-AXVN-gold/20 rounded-md text-AXVN-silver/80 text-[10px] font-medium tracking-wide">{selected.type}</span>
                      {selected.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-AXVN-deep border border-AXVN-gold/10 rounded-lg p-1">
                    {!selected.read && (
                      <button onClick={() => handleMarkRead(selected.id)} className="p-2 text-AXVN-silver/60 hover:text-AXVN-gold transition-colors rounded-md hover:bg-AXVN-gold/5" title="Đánh dấu đã đọc">
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected.id)} className="p-2 text-AXVN-silver/60 hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selected.details?.phone && (
                    <div className="flex items-center gap-2 text-xs text-AXVN-silver/70 bg-AXVN-deep border border-AXVN-gold/10 rounded-lg px-3 py-2">
                      <Phone className="w-3.5 h-3.5 text-AXVN-gold" />
                      <span className="text-AXVN-ivory font-medium">{selected.details.phone}</span>
                    </div>
                  )}
                  {selected.details?.company && (
                    <div className="flex items-center gap-2 text-xs text-AXVN-silver/70 bg-AXVN-deep border border-AXVN-gold/10 rounded-lg px-3 py-2">
                      <Building2 className="w-3.5 h-3.5 text-AXVN-gold" />
                      <span className="text-AXVN-ivory font-medium">{selected.details.company}</span>
                    </div>
                  )}
                  {selected.details?.enquiryType && selected.type === "submission" && (
                    <div className="flex items-center gap-2 text-xs text-AXVN-silver/70 bg-AXVN-deep border border-AXVN-gold/10 rounded-lg px-3 py-2">
                      <TrendingUp className="w-3.5 h-3.5 text-AXVN-gold" />
                      <span className="text-AXVN-ivory font-medium">{selected.details.enquiryType}</span>
                    </div>
                  )}
                </div>

                <div className="bg-AXVN-deep/60 border border-AXVN-gold/10 rounded-xl p-6">
                  <p className="text-AXVN-silver/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {selected.details?.document && (
                  <a
                    href={selected.details.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl hover:border-AXVN-gold/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-AXVN-navy flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4 text-AXVN-gold" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-AXVN-ivory">Xem tài liệu đính kèm</span>
                      <span className="block text-xs text-AXVN-silver/60 mt-0.5">Mở trong tab mới</span>
                    </div>
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center max-w-sm mx-auto">
                <div className="w-16 h-16 bg-AXVN-deep border border-AXVN-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-AXVN-gold/40" />
                </div>
                <h3 className="text-AXVN-ivory font-medium mb-1">Chưa chọn yêu cầu nào</h3>
                <p className="text-AXVN-silver/60 text-sm">Chọn một yêu cầu từ danh sách để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#03080e] flex items-center justify-center"><div className="w-8 h-8 border-2 border-AXVN-gold border-t-transparent animate-spin rounded-full" /></div>}>
      <EnquiriesContent />
    </Suspense>
  );
}
