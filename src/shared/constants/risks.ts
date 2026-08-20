export interface RiskItem {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  probability: number; // 1-5
  impact: number; // 1-5
}

export const RISKS: RiskItem[] = [
  {
    id: "R01",
    title: "Từ chối giấy phép VASP",
    severity: "CRITICAL",
    probability: 3,
    impact: 5,
  },
  {
    id: "R02",
    title: "Thay đổi quy định pháp lý",
    severity: "CRITICAL",
    probability: 4,
    impact: 4,
  },
  {
    id: "R03",
    title: "Tấn công bảo mật / hack",
    severity: "HIGH",
    probability: 2,
    impact: 5,
  },
  {
    id: "R07",
    title: "Key person risk",
    severity: "HIGH",
    probability: 3,
    impact: 4,
  },
];
