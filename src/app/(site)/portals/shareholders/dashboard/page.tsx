"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, CheckSquare, MessageSquare, Users, LogOut,
  CheckCircle2, Clock, AlertCircle, XCircle, Send, ChevronDown,
  Calendar, Video, FileText, ChevronRight, RefreshCw, Loader2,
  FolderOpen, TrendingUp,
} from "lucide-react";
import {
  ROLE_LABELS, PRIORITY_CLS, CAT_LABELS, KYC_STATUS_CONFIG as KYC_STATUS_LABELS,
} from "@/constants/admin";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Me {
  id: string; name: string; email: string; role: string;
  equityPercent: number; capitalCommitted: number; capitalPaid: number;
  kycStatus?: string;
}
interface Task {
  _id: string; title: string; description: string; category: string;
  priority: string; status: string; dueDate: string | null;
  milestoneTag: string; legalRef: string;
}
interface Message {
  _id: string; channel: string; senderName: string; senderRole: string;
  isAdminSender: boolean; content: string; createdAt: string;
}
interface Meeting {
  _id: string; title: string; type: string; status: string;
  scheduledAt: string; meetingLink: string; location: string;
  agenda: { order: number; title: string; description: string; resolved: boolean; resolution: string }[];
  minutes: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  pending: { label: "Chưa bắt đầu", icon: Clock, cls: "text-AXVN-silver/50" },
  in_progress: { label: "Đang làm", icon: RefreshCw, cls: "text-blue-400" },
  done: { label: "Hoàn thành", icon: CheckCircle2, cls: "text-emerald-400" },
  blocked: { label: "Bị chặn", icon: XCircle, cls: "text-red-400" },
};
const CHANNELS = [
  { key: "general", label: "Chung", icon: MessageSquare },
  { key: "tech", label: "Công Nghệ", icon: CheckSquare },
  { key: "legal", label: "Pháp Lý", icon: FileText },
  { key: "capital", label: "Vốn", icon: Users },
  { key: "announcement", label: "Thông Báo", icon: AlertCircle },
];
const MEETING_TYPE: Record<string, string> = {
  general: "Họp Thường Kỳ", emergency: "Họp Khẩn", technical: "Kỹ Thuật",
  legal: "Pháp Lý", progress: "Tiến Độ",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, me, onLogout, unreadCount }: {
  active: string; setActive: (s: string) => void; me: Me | null; onLogout: () => void;
  unreadCount: number;
}) {
  const nav: { key: string; icon: typeof LayoutDashboard; label: string; badge?: number; href?: string }[] = [
    { key: "dashboard",  icon: LayoutDashboard, label: "Tổng Quan" },
    { key: "tasks",      icon: CheckSquare,     label: "Nhiệm Vụ" },
    { key: "messages",   icon: MessageSquare,   label: "Nhắn Tin", badge: unreadCount },
    { key: "meetings",   icon: Users,           label: "Họp Cổ Đông" },
    // Trang riêng — mở bằng Link thay vì đổi tab
    { key: "documents",  icon: FolderOpen,      label: "Tài Liệu",    href: "/portals/shareholders/dashboard/documents" },
    { key: "reports",    icon: TrendingUp,      label: "Báo Cáo ĐT",  href: "/portals/shareholders/dashboard/reports" },
  ];
  return (
    <aside className="w-64 bg-[#03080e]/95 border-r border-AXVN-gold/10 flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-6 border-b border-AXVN-gold/10">
        <Image src="/large-logo.png" alt="AXVN Tech Holding" width={160} height={44} className="h-9 w-auto object-contain brightness-110" />
        <p className="text-AXVN-gold/60 text-[10px] font-semibold tracking-widest uppercase mt-2">Cổ Đông Portal</p>
      </div>
      {me && (
        <div className="px-4 py-3 border-b border-AXVN-gold/8 mx-2 my-2 rounded-xl bg-AXVN-gold/5">
          <p className="text-AXVN-ivory text-sm font-semibold truncate">{me.name}</p>
          <p className="text-AXVN-silver/50 text-[11px]">{ROLE_LABELS[me.role] || me.role}</p>
          <p className="text-AXVN-gold text-xs font-bold mt-1">{me.equityPercent}% cổ phần</p>
          {me.kycStatus && (
            <span className={`mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${KYC_STATUS_LABELS[me.kycStatus]?.cls || ""}`}>
              {KYC_STATUS_LABELS[me.kycStatus]?.label || me.kycStatus}
            </span>
          )}
        </div>
      )}
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {nav.map((item) => {
          // Link ra trang riêng (documents / reports)
          if (item.href) {
            return (
              <Link key={item.key} href={item.href}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 text-AXVN-silver hover:text-AXVN-ivory hover:bg-AXVN-gold/5">
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-3 h-3 text-AXVN-silver/25" />
              </Link>
            );
          }
          // Tab nội bộ
          return (
            <button key={item.key} onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 ${active === item.key
                  ? "text-AXVN-gold font-medium bg-AXVN-gold/10 border border-AXVN-gold/15"
                  : "text-AXVN-silver hover:text-AXVN-ivory hover:bg-AXVN-gold/5"
                }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="text-[10px] font-bold bg-AXVN-gold text-AXVN-navy rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-AXVN-gold/10">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-AXVN-silver/50 hover:text-AXVN-champagne hover:bg-AXVN-gold/5 rounded-xl transition-all">
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────
function DashboardView({ me, tasks, meetings }: { me: Me | null; tasks: Task[]; meetings: Meeting[] }) {
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const blocked = tasks.filter((t) => t.status === "blocked").length;
  const upcoming = meetings.filter((m) => m.status === "scheduled").slice(0, 3);
  const capitalPct = me && me.capitalCommitted > 0 ? Math.round((me.capitalPaid / me.capitalCommitted) * 100) : 0;

  function fVND(n: number) {
    if (n >= 1e12) return `${(n / 1e12).toFixed(1)} nghìn tỷ`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)} tỷ`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(0)} triệu`;
    return n.toLocaleString("vi-VN");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-AXVN-ivory font-semibold text-lg">Xin chào, {me?.name} 👋</h2>
        <p className="text-AXVN-silver/50 text-sm mt-1">Dưới đây là toàn cảnh tiến độ dự án của bạn.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Nhiệm vụ hoàn thành", value: `${done}/${tasks.length}`, icon: CheckCircle2, cls: "text-emerald-400" },
          { label: "Đang thực hiện", value: inProgress.toString(), icon: RefreshCw, cls: "text-blue-400" },
          { label: "Bị chặn / tắc", value: blocked.toString(), icon: XCircle, cls: "text-red-400" },
          { label: "Cổ phần", value: `${me?.equityPercent ?? 0}%`, icon: Users, cls: "text-AXVN-gold" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-5">
            <kpi.icon className={`w-5 h-5 ${kpi.cls} mb-3`} />
            <p className={`font-black text-2xl ${kpi.cls}`}>{kpi.value}</p>
            <p className="text-AXVN-silver/50 text-xs mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Task progress bar */}
      {tasks.length > 0 && (
        <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-AXVN-ivory text-sm font-semibold">Tiến độ nhiệm vụ</p>
            <p className="text-AXVN-gold text-sm font-bold">{Math.round((done / tasks.length) * 100)}%</p>
          </div>
          <div className="h-2 bg-AXVN-navy rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-AXVN-gold to-AXVN-champagne rounded-full transition-all duration-700"
              style={{ width: `${Math.round((done / tasks.length) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Capital progress */}
      {me && me.capitalCommitted > 0 && (
        <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-AXVN-ivory text-sm font-semibold">Tiến độ vốn góp</p>
            <p className="text-AXVN-gold text-sm font-bold">{capitalPct}%</p>
          </div>
          <div className="h-2 bg-AXVN-navy rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
              style={{ width: `${capitalPct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-wider">Cam kết</p>
              <p className="text-AXVN-ivory text-sm font-bold">{fVND(me.capitalCommitted)} VNĐ</p>
            </div>
            <div>
              <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-wider">Đã góp</p>
              <p className="text-emerald-400 text-sm font-bold">{fVND(me.capitalPaid)} VNĐ</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming meetings */}
      {upcoming.length > 0 && (
        <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-5">
          <p className="text-AXVN-ivory text-sm font-semibold mb-4">Cuộc họp sắp tới</p>
          <div className="space-y-3">
            {upcoming.map((m) => (
              <div key={m._id} className="flex items-start gap-3 p-3 bg-AXVN-navy/60 rounded-lg">
                <Calendar className="w-4 h-4 text-AXVN-gold shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-AXVN-ivory text-sm font-medium truncate">{m.title}</p>
                  <p className="text-AXVN-silver/50 text-xs">{new Date(m.scheduledAt).toLocaleString("vi-VN")}</p>
                </div>
                {m.meetingLink && (
                  <a href={m.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 shrink-0">
                    <Video className="w-3 h-3" /> Tham gia
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tasks View ────────────────────────────────────────────────────────────────
function TasksView({ tasks, onUpdate }: { tasks: Task[]; onUpdate: () => void }) {
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const grouped = filtered.reduce<Record<string, Task[]>>((acc, t) => {
    const tag = t.milestoneTag || "Không có milestone";
    acc[tag] = acc[tag] ? [...acc[tag], t] : [t];
    return acc;
  }, {});

  async function updateStatus(taskId: string, status: string) {
    setUpdating(taskId);
    try {
      await fetch("/api/shareholders/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });
      onUpdate();
    } finally {
      setUpdating(null);
    }
  }

  const statusFilters = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chưa bắt đầu" },
    { key: "in_progress", label: "Đang làm" },
    { key: "done", label: "Hoàn thành" },
    { key: "blocked", label: "Bị chặn" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-AXVN-ivory font-semibold text-lg">Danh sách nhiệm vụ</h2>
        <div className="flex gap-1 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-1 overflow-x-auto">
          {statusFilters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${filter === f.key ? "bg-AXVN-gold text-AXVN-navy" : "text-AXVN-silver/60 hover:text-AXVN-ivory"
                }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-20 text-AXVN-silver/30 text-sm">Không có nhiệm vụ nào.</div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([milestone, mileTasks]) => (
          <div key={milestone}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-AXVN-gold/40" />
              <span className="text-AXVN-gold/70 text-[11px] font-mono tracking-widest uppercase">{milestone}</span>
              <div className="flex-1 h-px bg-AXVN-gold/10" />
              <span className="text-AXVN-silver/30 text-[10px]">
                {mileTasks.filter((t) => t.status === "done").length}/{mileTasks.length} xong
              </span>
            </div>
            <div className="space-y-2">
              {mileTasks.map((task) => {
                const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div key={task._id}
                    className={`bg-AXVN-deep border rounded-xl p-4 transition-all ${task.status === "done" ? "border-emerald-500/15 opacity-75" : "border-AXVN-gold/10"
                      }`}>
                    <div className="flex items-start gap-3">
                      <StatusIcon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.cls}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className={`font-semibold text-sm ${task.status === "done" ? "line-through text-AXVN-silver/40" : "text-AXVN-ivory"}`}>
                            {task.title}
                          </p>
                          <span className={`text-[10px] border px-1.5 py-0.5 rounded font-semibold ${PRIORITY_CLS[task.priority]}`}>
                            {task.priority === "critical" ? "Cấp bách" : task.priority === "high" ? "Cao" : task.priority === "medium" ? "TB" : "Thấp"}
                          </span>
                          <span className="text-[10px] text-AXVN-silver/30 bg-AXVN-navy/60 px-1.5 py-0.5 rounded">
                            {CAT_LABELS[task.category] || task.category}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-AXVN-silver/55 text-xs leading-relaxed mb-2">{task.description}</p>
                        )}
                        {task.legalRef && (
                          <p className="text-AXVN-gold/50 text-[10px]">📋 {task.legalRef}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-AXVN-silver/30 text-[10px] mt-1">
                            ⏱ Hạn: {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>
                      {task.status !== "done" && (
                        <div className="flex gap-1.5 shrink-0">
                          {task.status === "pending" && (
                            <button onClick={() => updateStatus(task._id, "in_progress")} disabled={!!updating}
                              className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/25 transition-colors disabled:opacity-50">
                              {updating === task._id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Bắt đầu"}
                            </button>
                          )}
                          {task.status === "in_progress" && (
                            <button onClick={() => updateStatus(task._id, "done")} disabled={!!updating}
                              className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/25 transition-colors disabled:opacity-50">
                              {updating === task._id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Hoàn thành ✓"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Messages View ─────────────────────────────────────────────────────────────
function MessagesView({ me, onRead }: { me: Me | null; onRead: () => void }) {
  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sseRef = useRef<EventSource | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shareholders/messages?channel=${channel}`);
      const data = await res.json();
      if (data.success) setMessages(Array.isArray(data.data) ? data.data : []);
      onRead();
    } finally { setLoading(false); }
  }, [channel, onRead]);

  // SSE: nhận tin nhắn mới realtime cho channel đang active
  useEffect(() => {
    load();
    sseRef.current?.close();
    const es = new EventSource(`/api/shareholders/messages/sse?channel=${channel}`);
    sseRef.current = es;
    es.addEventListener("message", (evt) => {
      try {
        const msg = JSON.parse(evt.data) as Message;
        setMessages((prev) => {
          // tránh duplicate
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        onRead();
      } catch { /* ignore parse error */ }
    });
    es.addEventListener("error", () => { es.close(); });
    return () => { es.close(); sseRef.current = null; };
  }, [channel, load, onRead]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/shareholders/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, content: input.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === data.data._id)) return prev;
          return [...prev, data.data];
        });
        setInput("");
      }
    } finally { setSending(false); }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-140px)]">
      {/* Channel list */}
      <div className="w-48 shrink-0 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl p-2">
        <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest px-3 py-2">Kênh liên lạc</p>
        {CHANNELS.map((ch) => (
          <button key={ch.key} onClick={() => setChannel(ch.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors mb-0.5 ${channel === ch.key
                ? "bg-AXVN-gold/15 text-AXVN-gold border border-AXVN-gold/20"
                : "text-AXVN-silver/60 hover:text-AXVN-ivory hover:bg-AXVN-gold/5"
              }`}>
            <ch.icon className="w-3.5 h-3.5 shrink-0" />
            {ch.label}
          </button>
        ))}
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col bg-AXVN-deep border border-AXVN-gold/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-AXVN-gold/10 flex items-center justify-between">
          <div>
            <p className="text-AXVN-ivory text-sm font-semibold">
              {CHANNELS.find((c) => c.key === channel)?.label || channel}
            </p>
            <p className="text-AXVN-silver/40 text-[11px]">{messages.length} tin nhắn</p>
          </div>
          <button onClick={load} className="text-AXVN-silver/30 hover:text-AXVN-gold transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-AXVN-gold animate-spin" /></div>}
          {messages.map((msg) => {
            const isMine = msg.senderName === me?.name;
            return (
              <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                  {!isMine && (
                    <p className="text-[10px] text-AXVN-silver/40 mb-1 px-1">
                      {msg.senderName} · {msg.isAdminSender ? "🔧 Admin" : ROLE_LABELS[msg.senderRole] || msg.senderRole}
                    </p>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
                      ? "bg-AXVN-gold/20 text-AXVN-ivory rounded-tr-sm"
                      : msg.isAdminSender
                        ? "bg-blue-500/15 border border-blue-500/20 text-AXVN-ivory rounded-tl-sm"
                        : "bg-AXVN-navy text-AXVN-silver/80 rounded-tl-sm"
                    }`}>
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-AXVN-silver/25 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-3 border-t border-AXVN-gold/10 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Nhập tin nhắn... (Enter để gửi)"
            className="flex-1 bg-AXVN-navy border border-white/10 text-AXVN-ivory text-sm px-4 py-2.5 focus:outline-none focus:border-AXVN-gold/40 rounded-xl transition-colors" />
          <button onClick={sendMessage} disabled={sending || !input.trim()}
            className="p-2.5 bg-AXVN-gold text-AXVN-navy rounded-xl hover:bg-AXVN-champagne transition-colors disabled:opacity-40">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Meetings View ─────────────────────────────────────────────────────────────
function MeetingsView({ meetings }: { meetings: Meeting[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (meetings.length === 0) {
    return <div className="text-center py-24 text-AXVN-silver/30 text-sm">Chưa có cuộc họp nào được lên lịch.</div>;
  }

  return (
    <div>
      <h2 className="text-AXVN-ivory font-semibold text-lg mb-6">Họp Cổ Đông</h2>
      <div className="space-y-3">
        {meetings.map((m) => (
          <div key={m._id} className={`border rounded-xl overflow-hidden transition-all ${m.status === "completed" ? "border-AXVN-gold/8 opacity-75" : "border-AXVN-gold/15"
            }`}>
            <button className="w-full flex items-center gap-4 p-5 bg-AXVN-deep hover:bg-AXVN-navy/60 transition-colors text-left"
              onClick={() => setOpen(open === m._id ? null : m._id)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.status === "scheduled" ? "bg-blue-500/15 text-blue-400" :
                  m.status === "in_progress" ? "bg-AXVN-gold/15 text-AXVN-gold" :
                    m.status === "completed" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-AXVN-ivory text-sm font-semibold truncate">{m.title}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-AXVN-silver/50 text-xs">{new Date(m.scheduledAt).toLocaleString("vi-VN")}</span>
                  <span className="text-AXVN-gold/60 text-[10px] uppercase tracking-wider">{MEETING_TYPE[m.type] || m.type}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.status === "scheduled" ? "bg-blue-500/15 text-blue-400" :
                      m.status === "completed" ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-500/15 text-yellow-400"
                    }`}>
                    {m.status === "scheduled" ? "Sắp diễn ra" : m.status === "completed" ? "Đã hoàn thành" : "Đang diễn ra"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {m.meetingLink && m.status !== "completed" && (
                  <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-lg text-[11px] font-semibold hover:bg-blue-500/25 transition-colors">
                    <Video className="w-3 h-3" /> Tham gia
                  </a>
                )}
                {open === m._id ? <ChevronDown className="w-4 h-4 text-AXVN-silver/30" /> : <ChevronRight className="w-4 h-4 text-AXVN-silver/30" />}
              </div>
            </button>

            {open === m._id && (
              <div className="px-5 pb-5 bg-AXVN-navy/30 border-t border-AXVN-gold/8">
                {/* Agenda */}
                {m.agenda.length > 0 && (
                  <div className="mt-4">
                    <p className="text-AXVN-silver/50 text-[10px] uppercase tracking-widest mb-3">Chương trình họp</p>
                    <div className="space-y-2">
                      {m.agenda.map((item) => (
                        <div key={item.order} className={`flex gap-3 p-3 rounded-lg border ${item.resolved ? "bg-emerald-500/5 border-emerald-500/15" : "bg-AXVN-deep border-AXVN-gold/8"
                          }`}>
                          <span className="text-AXVN-gold/50 text-xs font-mono font-bold shrink-0">{String(item.order).padStart(2, "0")}</span>
                          <div>
                            <p className={`text-sm font-medium ${item.resolved ? "text-emerald-400" : "text-AXVN-ivory"}`}>{item.title}</p>
                            {item.description && <p className="text-AXVN-silver/50 text-xs mt-0.5">{item.description}</p>}
                            {item.resolved && item.resolution && (
                              <p className="text-emerald-400/70 text-xs mt-1">✓ Kết quả: {item.resolution}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Minutes */}
                {m.minutes && (
                  <div className="mt-4">
                    <p className="text-AXVN-silver/50 text-[10px] uppercase tracking-widest mb-2">Biên bản họp</p>
                    <div className="bg-AXVN-deep border border-AXVN-gold/8 rounded-lg p-4">
                      <p className="text-AXVN-silver/70 text-sm leading-relaxed whitespace-pre-wrap">{m.minutes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function ShareholderDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [active, setActive] = useState("dashboard");
  const [bootLoading, setBootLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  // SSE refs per channel for background notification
  const sseRefs = useRef<EventSource[]>([]);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/shareholders/tasks");
    const d = await res.json();
    if (d.success) setTasks(Array.isArray(d.data) ? d.data : []);
  }, []);

  const fetchMeetings = useCallback(async () => {
    const res = await fetch("/api/shareholders/meetings");
    const d = await res.json();
    if (d.success) setMeetings(Array.isArray(d.data) ? d.data : []);
  }, []);

  // Lấy unread count từ server khi load
  const refreshUnread = useCallback(async () => {
    setUnreadCount(0);
  }, []);

  // Background SSE: khi không ở tab messages, lắng nghe tất cả channel để tăng unread
  useEffect(() => {
    if (!me || active === "messages") {
      // Đóng tất cả SSE background khi ở tab messages
      sseRefs.current.forEach((es) => es.close());
      sseRefs.current = [];
      return;
    }

    // Subscribe tất cả channel để nhận thông báo
    const channels = CHANNELS.map((ch) => ch.key);
    sseRefs.current.forEach((es) => es.close());
    sseRefs.current = channels.map((ch) => {
      const es = new EventSource(`/api/shareholders/messages/sse?channel=${ch}`);
      es.addEventListener("message", () => {
        setUnreadCount((c) => c + 1);
      });
      es.addEventListener("error", () => { es.close(); });
      return es;
    });

    return () => {
      sseRefs.current.forEach((es) => es.close());
      sseRefs.current = [];
    };
  }, [me, active]);

  // Reset unread khi chuyển sang messages tab
  const handleSetActive = useCallback((tab: string) => {
    if (tab === "messages") setUnreadCount(0);
    setActive(tab);
  }, []);

  useEffect(() => {
    async function boot() {
      try {
        const res = await fetch("/api/shareholders/auth");
        const d = await res.json();
        if (!d.success) { router.replace("/shareholders/login"); return; }
        setMe(d.data);
        await Promise.all([fetchTasks(), fetchMeetings()]);
      } catch { router.replace("/shareholders/login"); }
      finally { setBootLoading(false); }
    }
    boot();
  }, [router, fetchTasks, fetchMeetings]);

  async function logout() {
    sseRefs.current.forEach((es) => es.close());
    await fetch("/api/shareholders/auth", { method: "DELETE" });
    router.replace("/shareholders/login");
  }

  if (bootLoading) {
    return (
      <div className="min-h-screen bg-[#03080e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-AXVN-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-AXVN-gold/20 font-sans">
      <Sidebar active={active} setActive={handleSetActive} me={me} onLogout={logout} unreadCount={unreadCount} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {active === "dashboard" && <DashboardView me={me} tasks={tasks} meetings={meetings} />}
          {active === "tasks" && <TasksView tasks={tasks} onUpdate={fetchTasks} />}
          {active === "messages" && <MessagesView me={me} onRead={refreshUnread} />}
          {active === "meetings" && <MeetingsView meetings={meetings} />}
        </div>
      </main>
    </div>
  );
}
