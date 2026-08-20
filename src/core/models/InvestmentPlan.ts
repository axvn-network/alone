import mongoose, { Schema, Document } from "mongoose";

/**
 * Gói Hợp Tác Đầu Tư B2B — Partnership Investment Plans
 *
 * Mô hình kinh doanh: B2B — không phải sản phẩm tài chính bán lẻ.
 * Đây là các gói hợp tác cùng xây dựng nền tảng giao dịch tài sản mã hóa
 * hướng đến đủ điều kiện được Bộ Tài chính cấp phép theo NQ 5/2025/NQ-CP.
 *
 * Vốn điều lệ tối thiểu yêu cầu: 10.000 tỷ VNĐ (QĐ 96/QĐ-BTC, 20/01/2026).
 * Không một tổ chức đơn lẻ nào đáp ứng được một mình — đó là lý do
 * mô hình hợp tác theo gói tồn tại.
 */

export type PlanTier =
  | "seed"       // Hạt Giống — xây dựng & thử nghiệm (từ 200 triệu)
  | "growth"     // Tăng Trưởng — triển khai thực tế (từ 1 tỷ)
  | "expansion"  // Mở Rộng — scale thị trường (từ 3 tỷ)
  | "strategic"  // Chiến Lược — đối tác định chế (từ 10 tỷ)
  | "anchor";    // Neo Chiến Lược — cổ đông neo (từ 50 tỷ)

export type PlanStatus = "active" | "draft" | "closed";

export interface IInvestmentPlan extends Document {
  tier: PlanTier;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  /** Cam kết tối thiểu — số nguyên đơn vị VNĐ */
  minCommitment: number;
  /** Cam kết tối đa — 0 = không giới hạn */
  maxCommitment: number;
  currency: string;
  duration: string;
  durationEn: string;
  equityRange: string;
  equityRangeEn: string;
  /** Phần trăm cổ phần tối thiểu được bảo đảm (%) */
  minimumEquity: number;
  benefits: string[];
  benefitsEn: string[];
  conditions: string[];
  conditionsEn: string[];
  rights: string[];
  obligations: string[];
  documents: string[];
  /** Loại cổ đông tương ứng trong Điều lệ (e.g. "Cổ đông sáng lập") */
  shareholderType: string;
  highlighted: boolean;
  badge: string;
  badgeEn: string;
  order: number;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentPlanSchema = new Schema<IInvestmentPlan>(
  {
    tier: {
      type: String,
      enum: ["seed", "growth", "expansion", "strategic", "anchor"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    taglineEn: { type: String, default: "" },
    minCommitment: { type: Number, required: true, min: 0 },
    maxCommitment: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "VND" },
    duration: { type: String, default: "" },
    durationEn: { type: String, default: "" },
    equityRange: { type: String, default: "" },
    equityRangeEn: { type: String, default: "" },
    minimumEquity: { type: Number, default: 0, min: 0, max: 100 },
    benefits: { type: [String], default: [] },
    benefitsEn: { type: [String], default: [] },
    conditions: { type: [String], default: [] },
    conditionsEn: { type: [String], default: [] },
    rights: { type: [String], default: [] },
    obligations: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    shareholderType: { type: String, default: "" },
    highlighted: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    badgeEn: { type: String, default: "" },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "draft", "closed"],
      default: "draft",
    },
  },
  { timestamps: true },
);

InvestmentPlanSchema.index({ status: 1, order: 1 });
InvestmentPlanSchema.index({ tier: 1, status: 1 });

const InvestmentPlan =
  mongoose.models.InvestmentPlan ||
  mongoose.model<IInvestmentPlan>("InvestmentPlan", InvestmentPlanSchema);

export default InvestmentPlan;
