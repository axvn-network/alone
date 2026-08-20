import mongoose, { Schema, Document } from "mongoose";
import type { ShareholderRole } from "../../modules/shareholders/model";

export type PartnerApplicationStatus =
  | "draft" // chưa nộp (quiz xong chưa submit form)
  | "submitted" // đã nộp, chờ xét duyệt
  | "under_review" // admin đang xem xét
  | "shortlisted" // vào danh sách ngắn đàm phán
  | "approved" // chấp thuận
  | "rejected"; // từ chối

/** Điểm quiz theo từng dimension — mỗi dimension 0‑100 */
export interface AssessmentDimensions {
  technical: number; // năng lực kỹ thuật / công nghệ
  financial: number; // năng lực tài chính
  legal: number; // kiến thức pháp lý
  strategic: number; // tư duy chiến lược
  network: number; // mạng lưới quan hệ
}

export interface IPartnerApplication extends Document {
  // ─── Thông tin cá nhân / tổ chức ────────────────────────────────
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  linkedinUrl: string;

  // ─── Quiz đánh giá ───────────────────────────────────────────────
  /** Câu trả lời thô: { q0: "a", q1: "c", ... } */
  quizAnswers: Record<string, string>;
  assessmentScore: AssessmentDimensions;
  /** Vai trò hệ thống gợi ý dựa trên điểm cao nhất */
  suggestedRole: ShareholderRole;

  // ─── Đăng ký chính thức ─────────────────────────────────────────
  /** Vai trò ứng viên mong muốn (có thể khác suggestedRole) */
  desiredRole: ShareholderRole;
  capitalRange: string; // e.g. "3ty-6ty"
  motivation: string; // lý do tham gia
  capabilities: string; // năng lực đóng góp
  investmentPlan: string; // gói hợp tác quan tâm

  // ─── Pháp lý DLCN ───────────────────────────────────────────────
  consentGiven: boolean;
  consentTimestamp: string; // ISO timestamp

  // ─── Admin ──────────────────────────────────────────────────────
  status: PartnerApplicationStatus;
  adminNotes: string; // ghi chú đàm phán nội bộ
  reviewedBy: string; // admin id
  reviewedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const AssessmentDimensionsSchema = new Schema<AssessmentDimensions>(
  {
    technical: { type: Number, default: 0, min: 0, max: 100 },
    financial: { type: Number, default: 0, min: 0, max: 100 },
    legal: { type: Number, default: 0, min: 0, max: 100 },
    strategic: { type: Number, default: 0, min: 0, max: 100 },
    network: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false },
);

const SHAREHOLDER_ROLES = [
  "tech",
  "financial",
  "tech-company",
  "individual",
  "legal",
  "foreign",
] as const;
const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "shortlisted",
  "approved",
  "rejected",
] as const;

const PartnerApplicationSchema = new Schema<IPartnerApplication>(
  {
    // Thông tin
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },

    // Quiz
    quizAnswers: { type: Map, of: String, default: {} },
    assessmentScore: { type: AssessmentDimensionsSchema, default: () => ({}) },
    suggestedRole: { type: String, enum: SHAREHOLDER_ROLES, required: true },

    // Đăng ký
    desiredRole: { type: String, enum: SHAREHOLDER_ROLES, required: true },
    capitalRange: { type: String, default: "" },
    motivation: { type: String, default: "" },
    capabilities: { type: String, default: "" },
    investmentPlan: { type: String, default: "" },

    // DLCN
    consentGiven: { type: Boolean, required: true },
    consentTimestamp: { type: String, required: true },

    // Admin
    status: { type: String, enum: APPLICATION_STATUSES, default: "submitted" },
    adminNotes: { type: String, default: "" },
    reviewedBy: { type: String, default: "" },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

PartnerApplicationSchema.index({ status: 1, desiredRole: 1, createdAt: -1 });
PartnerApplicationSchema.index({ email: 1 });

const PartnerApplication =
  mongoose.models.PartnerApplication ||
  mongoose.model<IPartnerApplication>(
    "PartnerApplication",
    PartnerApplicationSchema,
  );

export default PartnerApplication;
