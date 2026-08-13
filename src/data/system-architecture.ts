/**
 * src/data/system-architecture.ts
 *
 * Single source of truth cho sơ đồ kiến trúc hệ sinh thái AXVN Tech Holding.
 * ProjectEcosystem.tsx và ArchitectureDiagram.tsx đều import từ đây.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type NodeSize = "lg" | "md" | "sm";
export type NodeRole = "hub" | "regulator" | "institutional" | "tech" | "legal" | "retail" | "foreign";

export interface ArchNode {
  id: string;
  label: string;
  sub: string;
  role: NodeRole;
  /** Tailwind bg class */
  color: string;
  /** Tailwind border class */
  border: string;
  /** Tailwind text-color class */
  textColor: string;
  size: NodeSize;
  /** Vị trí trong SVG viewBox (0–100 scale) */
  pos: { x: number; y: number };
}

export interface ArchConnection {
  from: string;
  to: string;
  label: string;
}

export interface ArchLegendItem {
  color: string;
  label: string;
}

// ─── Nodes ───────────────────────────────────────────────────────────────────

export const ARCH_NODES: readonly ArchNode[] = [
  {
    id: "AXVN",
    label: "AXVN TECH HOLDING",
    sub: "Điều phối · Pháp lý · Chiến lược",
    role: "hub",
    color: "bg-AXVN-gold/15",
    border: "border-AXVN-gold/60",
    textColor: "text-AXVN-gold",
    size: "lg",
    pos: { x: 50, y: 44 },
  },
  {
    id: "btc",
    label: "BỘ TÀI CHÍNH",
    sub: "Cấp phép · Giám sát · Pháp chế",
    role: "regulator",
    color: "bg-blue-500/10",
    border: "border-blue-400/50",
    textColor: "text-blue-300",
    size: "md",
    pos: { x: 50, y: 8 },
  },
  {
    id: "institution",
    label: "TỔ CHỨC TÀI CHÍNH",
    sub: "Ngân hàng · CTCK · Quỹ · Bảo hiểm",
    role: "institutional",
    color: "bg-emerald-500/10",
    border: "border-emerald-400/40",
    textColor: "text-emerald-300",
    size: "md",
    pos: { x: 15, y: 22 },
  },
  {
    id: "tech",
    label: "ĐỐI TÁC CÔNG NGHỆ",
    sub: "Xây hệ thống · CNTT cấp 4 · Điều kiện cấp phép",
    role: "tech",
    color: "bg-purple-500/10",
    border: "border-purple-400/40",
    textColor: "text-purple-300",
    size: "md",
    pos: { x: 85, y: 22 },
  },
  {
    id: "legal",
    label: "PHÁP LÝ & TUÂN THỦ",
    sub: "AML · KYC · Quy trình nghiệp vụ",
    role: "legal",
    color: "bg-amber-500/10",
    border: "border-amber-400/40",
    textColor: "text-amber-300",
    size: "sm",
    pos: { x: 15, y: 68 },
  },
  {
    id: "individual",
    label: "CÁ NHÂN / TỔ CHỨC NHỎ",
    sub: "Cổ đông phổ thông · ≤35% tổng vốn",
    role: "retail",
    color: "bg-sky-500/10",
    border: "border-sky-400/40",
    textColor: "text-sky-300",
    size: "sm",
    pos: { x: 50, y: 82 },
  },
  {
    id: "foreign",
    label: "NHÀ ĐẦU TƯ NƯỚC NGOÀI",
    sub: "Tối đa 49% · IRC · IICA",
    role: "foreign",
    color: "bg-rose-500/10",
    border: "border-rose-400/40",
    textColor: "text-rose-300",
    size: "sm",
    pos: { x: 85, y: 68 },
  },
] as const;

// ─── Connections ─────────────────────────────────────────────────────────────

export const ARCH_CONNECTIONS: readonly ArchConnection[] = [
  { from: "AXVN", to: "btc", label: "Nộp hồ sơ xin cấp phép" },
  { from: "AXVN", to: "institution", label: "Kết nạp cổ đông tổ chức" },
  { from: "AXVN", to: "tech", label: "Triển khai hạ tầng" },
  { from: "AXVN", to: "legal", label: "Xây dựng quy trình" },
  { from: "AXVN", to: "individual", label: "Mở đăng ký góp vốn" },
  { from: "AXVN", to: "foreign", label: "Kết nối quốc tế" },
] as const;

// ─── Legend ──────────────────────────────────────────────────────────────────

export const ARCH_LEGEND: readonly ArchLegendItem[] = [
  { color: "bg-AXVN-gold/40", label: "Điều phối trung tâm" },
  { color: "bg-blue-400/40", label: "Cơ quan quản lý" },
  { color: "bg-emerald-400/40", label: "Cổ đông bắt buộc (>35%)" },
  { color: "bg-purple-400/40", label: "Đối tác kỹ thuật" },
  { color: "bg-sky-400/40", label: "Cổ đông phổ thông" },
  { color: "bg-rose-400/40", label: "Nước ngoài (≤49%)" },
] as const;
