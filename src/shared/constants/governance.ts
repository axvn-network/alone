/**
 * src/data/gov/governance.ts
 */

export interface GovernanceDocument {
  id: string;
  title: string;
  category: string;
  status: "Draft" | "Approved" | "Archived";
  createdAt: string;
}

export interface Shareholder {
  name: string;
  role: string;
  shares: number;
  percentage: number;
  capitalCommitted: number;
}

export interface Advisor {
  position: string;
  role: string;
  objective: string;
}

export const GOVERNANCE_DOCS: readonly GovernanceDocument[] = [
  {
    id: "AXVN-FL-01",
    title: "Điều lệ Công ty",
    category: "Pháp lý",
    status: "Approved",
    createdAt: "2026-08-03",
  },
  {
    id: "AXVN-FL-02",
    title: "Danh sách Cổ đông sáng lập",
    category: "Cổ đông",
    status: "Approved",
    createdAt: "2026-08-03",
  },
  {
    id: "AXVN-B08",
    title: "Nghị quyết thành lập Hội đồng Cố vấn Pháp lý & Công nghệ",
    category: "Hội đồng",
    status: "Approved",
    createdAt: "2026-08-06",
  },
];

export const SHAREHOLDERS: readonly Shareholder[] = [
  {
    name: "Nhâm Quốc Huân",
    role: "Tổng Giám đốc / Người đại diện pháp luật",
    shares: 105000,
    percentage: 35,
    capitalCommitted: 1050000000,
  },
  {
    name: "Nguyễn Thị Hương",
    role: "Thành viên HĐQT",
    shares: 78000,
    percentage: 26,
    capitalCommitted: 780000000,
  },
  {
    name: "Hoàng Xuân Biên",
    role: "Chủ tịch HĐQT",
    shares: 73500,
    percentage: 24.5,
    capitalCommitted: 735000000,
  },
  {
    name: "Vũ Hoàng Linh",
    role: "Thành viên HĐQT / CTO",
    shares: 43500,
    percentage: 14.5,
    capitalCommitted: 435000000,
  },
];

export const ADVISORS: readonly Advisor[] = [
  {
    position: "Cố vấn Pháp lý Sandbox",
    role: "Tư vấn và phản biện pháp lý",
    objective:
      "Hỗ trợ AXVN Tech tiếp cận cơ quan quản lý nhà nước (NHNN, BTC, Cục BQTG) qua mạng lưới quan hệ.",
  },
  {
    position: "Cố vấn Công nghệ",
    role: "Định hướng giải pháp công nghệ",
    objective:
      "Giám sát kiến trúc hệ thống, Audit Smart Contract bảo đảm an toàn hệ thống.",
  },
];
