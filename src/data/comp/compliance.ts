/**
 * src/data/comp/compliance.ts
 */

export interface ComplianceTask {
  id: string;
  taskName: string;
  category: 'Legal' | 'Financial' | 'Technical' | 'Regulatory';
  progress: number;
  deadline: string;
  status: 'Pending' | 'InProgress' | 'Completed';
}

export const COMPLIANCE_TASKS: readonly ComplianceTask[] = [
  {
    id: "COMP-01",
    taskName: "Hoàn thiện hồ sơ Sở KHDT",
    category: "Legal",
    progress: 80,
    deadline: "2026-09-01",
    status: "InProgress"
  },
  {
    id: "COMP-02",
    taskName: "Đăng ký hóa đơn điện tử",
    category: "Financial",
    progress: 100,
    deadline: "2026-08-15",
    status: "Completed"
  }
];
