/**
 * src/constants/admin.ts
 *
 * Single source of truth for shared label maps and style classes used across
 * the admin panel AND the shareholder portal.  Import from here rather than
 * re-defining in each page.
 *
 * Usage:
 *   import { ROLE_LABELS, PRIORITY_CLS } from "@/constants/admin";
 */

// ─── Partner / Shareholder roles ──────────────────────────────────────────────
export const ROLE_LABELS: Record<string, string> = {
  tech:           "💻 Công Nghệ",
  financial:      "🏦 Tài Chính Tổ Chức",
  "tech-company": "🚀 DN Công Nghệ",
  individual:     "👤 Cá Nhân",
  legal:          "⚖️ Pháp Lý",
  foreign:        "🌐 Nước Ngoài",
};

export const ALL_ROLES = Object.keys(ROLE_LABELS) as Array<keyof typeof ROLE_LABELS>;

// ─── Shareholder account status ───────────────────────────────────────────────
export const SHAREHOLDER_STATUS_CLS: Record<string, string> = {
  active:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  suspended: "bg-red-500/15 text-red-400 border-red-500/30",
};

// ─── Partner application status ───────────────────────────────────────────────
export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  draft:        "Nháp",
  submitted:    "Đã nộp",
  under_review: "Đang xét",
  shortlisted:  "Vào danh sách ngắn",
  approved:     "Chấp thuận",
  rejected:     "Từ chối",
};

export const APPLICATION_STATUS_CLS: Record<string, string> = {
  draft:        "bg-gray-500/15 text-gray-400 border-gray-500/30",
  submitted:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  under_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  shortlisted:  "bg-purple-500/15 text-purple-400 border-purple-500/30",
  approved:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected:     "bg-red-500/15 text-red-400 border-red-500/30",
};

// ─── Task priority ─────────────────────────────────────────────────────────────
export const PRIORITY_CLS: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high:     "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  low:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

/** Icon-only priority color (no background) — used in table cells */
export const PRIORITY_TEXT_CLS: Record<string, string> = {
  critical: "text-red-400",
  high:     "text-orange-400",
  medium:   "text-yellow-400",
  low:      "text-emerald-400",
};

// ─── Task status ──────────────────────────────────────────────────────────────
export const TASK_STATUS_LABELS: Record<string, string> = {
  pending:     "Chưa bắt đầu",
  in_progress: "Đang làm",
  done:        "Hoàn thành",
  blocked:     "Bị chặn",
};

// ─── Task / action categories ─────────────────────────────────────────────────
export const TASK_CATEGORIES = [
  "legal", "capital", "tech", "hr", "docs", "compliance", "meeting", "other",
] as const;

export const CAT_LABELS: Record<string, string> = {
  legal:      "Pháp Lý",
  capital:    "Vốn Góp",
  tech:       "Công Nghệ",
  hr:         "Nhân Sự",
  docs:       "Hồ Sơ",
  compliance: "Tuân Thủ",
  meeting:    "Họp",
  other:      "Khác",
};

// ─── Meeting types ────────────────────────────────────────────────────────────
export const MEETING_TYPES = [
  "general", "emergency", "technical", "legal", "progress",
] as const;

export const MEETING_TYPE_LABELS: Record<string, string> = {
  general:   "Thường kỳ",
  emergency: "Khẩn",
  technical: "Kỹ thuật",
  legal:     "Pháp lý",
  progress:  "Tiến độ",
};

// ─── KYC status ───────────────────────────────────────────────────────────────
export const KYC_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  not_started: { label: "KYC: Chưa bắt đầu", cls: "text-gvi-silver/40 bg-gvi-navy/60" },
  pending:     { label: "KYC: Chờ xét duyệt", cls: "text-yellow-400 bg-yellow-500/10" },
  approved:    { label: "KYC: Đã xác minh ✓", cls: "text-emerald-400 bg-emerald-500/10" },
  rejected:    { label: "KYC: Bị từ chối",   cls: "text-red-400 bg-red-500/10" },
};

// ─── Investment plan tiers ────────────────────────────────────────────────────
export const TIER_LABELS: Record<string, string> = {
  seed:      "🌱 Hạt Giống",
  growth:    "🚀 Tăng Trưởng",
  expansion: "📈 Mở Rộng",
  strategic: "🏛️ Chiến Lược",
  anchor:    "⚓ Neo Chiến Lược",
};

export const PLAN_STATUS_CLS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  draft:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  closed: "bg-red-500/15 text-red-400 border-red-500/30",
};

// ─── Standard admin page root className ──────────────────────────────────────
/** Use on every admin page's outermost <div> */
export const ADMIN_PAGE_CLS =
  "min-h-screen bg-[#03080e] flex selection:bg-gvi-gold/20 selection:text-gvi-champagne font-sans";
