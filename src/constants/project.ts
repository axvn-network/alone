/**
 * Shared project constants — single source of truth used across:
 *   /invest-with-fortress
 *   /invest-with-fortress/plans
 *   /invest-with-fortress/charter
 */

export const CAPITAL_AMOUNT = {
  vnd:   "10.000 tỷ VNĐ",
  usd:   "≈ 400 triệu USD",
  short: "10.000 tỷ",
} as const;

export type PhaseStatus = "done" | "active" | "pending";

export interface TimelinePhase {
  phase: string;
  label: string;
  detail: string;
  status: PhaseStatus;
  date: string;
}

export const PROJECT_TIMELINE: TimelinePhase[] = [
  {
    phase: "01",
    label: "Khung Pháp Lý Ban Hành",
    detail: "NQ 05/2025/NQ-CP: Chính phủ chính thức mở thị trường tài sản mã hóa hợp pháp đầu tiên tại Việt Nam",
    status: "done",
    date: "09/09/2025",
  },
  {
    phase: "02",
    label: "Bộ Tài Chính Mở Cổng Tiếp Nhận Hồ Sơ",
    detail: "QĐ 96/QĐ-BTC — điều kiện cấp phép chính thức, bắt đầu tiếp nhận hồ sơ xin cấp phép",
    status: "done",
    date: "20/01/2026",
  },
  {
    phase: "03",
    label: "Xây Dựng Liên Minh Đối Tác",
    detail: "Tích lũy vốn, kết nạp cổ đông chiến lược, hoàn thiện đội ngũ và cơ cấu quản trị",
    status: "active",
    date: "01/2026 – 09/2026",
  },
  {
    phase: "04",
    label: "Xây Dựng Hạ Tầng Kỹ Thuật",
    detail: "Hệ thống CNTT cấp độ 4, 10 quy trình nghiệp vụ chuẩn hóa, thẩm định Bộ Công An",
    status: "pending",
    date: "Q2–Q3 2026",
  },
  {
    phase: "05",
    label: "Nộp Hồ Sơ Cấp Phép",
    detail: "Một bộ hồ sơ đầy đủ đúng quy định lên Bộ Tài chính — minh bạch và tuân thủ tuyệt đối",
    status: "pending",
    date: "Q4 2026",
  },
  {
    phase: "06",
    label: "Nhận Giấy Phép & Vận Hành Chính Thức",
    detail: "30 ngày thẩm định → hoạt động ngay. Sàn giao dịch tài sản mã hóa hợp pháp đầu tiên tại Việt Nam",
    status: "pending",
    date: "2026–2027",
  },
];

export const CURRENT_PHASE = "03";
export const CURRENT_PHASE_LABEL = "Xây Dựng Liên Minh Đối Tác";
