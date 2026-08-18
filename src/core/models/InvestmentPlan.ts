import mongoose, { Schema, Document } from "mongoose";

/**
 * Gói Hợp Tác Đầu Tư B2B — Partnership Investment Plans
 *
 * Đây KHÔNG phải sản phẩm tài chính bán lẻ.
 * Đây là các gói hợp tác xây dựng nền tảng công nghệ tài chính số
 * hướng đến việc đạt đủ điều kiện được nhà nước cấp phép (NQ 5/2025/NQ-CP)
 * và giúp hiện đại hóa nền tài chính Việt Nam.
 */

export type PlanTier =
  | "seed"        // Gói Hạt Giống — xây dựng & thử nghiệm
  | "growth"      // Gói Tăng Trưởng — triển khai thực tế
  | "expansion"   // Gói Mở Rộng — scale thị trường
  | "strategic"   // Gói Chiến Lược — đối tác định chế
  | "anchor";     // Neo Chiến Lược — đối tác neo chính

export type PlanStatus = "active" | "draft" | "closed";

export interface IInvestmentPlan extends Document {
  tier: PlanTier;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  minCommitment: number;  // VNĐ
  maxCommitment: number;  // 0 = unlimited
  currency: string;
  duration: string;
  durationEn: string;
  equityRange: string;
  equityRangeEn: string;
  benefits: string[];
  benefitsEn: string[];
  conditions: string[];
  conditionsEn: string[];
  rights: string[];
  obligations: string[];
  documents: string[];
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
    tier:            { type: String, enum: ["seed", "growth", "expansion", "strategic", "anchor"], required: true },
    name:            { type: String, required: true, trim: true },
    nameEn:          { type: String, required: true, trim: true },
    tagline:         { type: String, default: "" },
    taglineEn:       { type: String, default: "" },
    minCommitment:   { type: Number, required: true },
    maxCommitment:   { type: Number, default: 0 },
    currency:        { type: String, default: "VND" },
    duration:        { type: String, default: "" },
    durationEn:      { type: String, default: "" },
    equityRange:     { type: String, default: "" },
    equityRangeEn:   { type: String, default: "" },
    benefits:        { type: [String], default: [] },
    benefitsEn:      { type: [String], default: [] },
    conditions:      { type: [String], default: [] },
    conditionsEn:    { type: [String], default: [] },
    rights:          { type: [String], default: [] },
    obligations:     { type: [String], default: [] },
    documents:       { type: [String], default: [] },
    shareholderType: { type: String, default: "" },
    highlighted:     { type: Boolean, default: false },
    badge:           { type: String, default: "" },
    badgeEn:         { type: String, default: "" },
    order:           { type: Number, default: 0 },
    status:          { type: String, enum: ["active", "draft", "closed"], default: "draft" },
  },
  { timestamps: true }
);

InvestmentPlanSchema.index({ status: 1, order: 1 });

const InvestmentPlan =
  mongoose.models.InvestmentPlan ||
  mongoose.model<IInvestmentPlan>("InvestmentPlan", InvestmentPlanSchema);

export default InvestmentPlan;
