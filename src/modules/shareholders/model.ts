/**
 * src/modules/shareholders/model.ts
 * Canonical Shareholder model — includes full KYC fields (AML/NĐ 13/2023).
 */
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type ShareholderRole =
  | "tech"
  | "financial"
  | "tech-company"
  | "individual"
  | "legal"
  | "foreign";

export type ShareholderStatus = "pending" | "active" | "suspended";
export type KycStatus = "none" | "not_started" | "pending" | "approved" | "rejected";

export interface IShareholder extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: ShareholderRole;
  status: ShareholderStatus;
  equityPercent: number;
  capitalCommitted: number;
  capitalPaid: number;
  notes: string;
  avatarUrl: string;
  lastLogin: Date | null;

  // ── KYC / AML fields (NĐ 13/2023, FATF) ────────────────────────────────
  kycStatus: KycStatus;
  kycNote: string;
  /** CCCD / Hộ chiếu */
  nationalId: string;
  nationalIdIssuedDate: Date | null;
  nationalIdIssuedPlace: string;
  /** Địa chỉ thường trú */
  permanentAddress: string;
  /** Nguồn gốc vốn (Source of Funds) */
  sourceOfFunds: string;
  /** Politically Exposed Person */
  isPEP: boolean;
  /** Danh sách trừng phạt (OFAC, UN, EU) */
  isSanctioned: boolean;
  /** Thời điểm nộp hồ sơ KYC */
  kycSubmittedAt: Date | null;
  /** Thời điểm admin duyệt/từ chối */
  kycReviewedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

const ShareholderSchema = new Schema<IShareholder>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true, select: false },
    phone:            { type: String, default: "" },
    role:             { type: String, enum: ["tech", "financial", "tech-company", "individual", "legal", "foreign"], required: true },
    status:           { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    equityPercent:    { type: Number, default: 0, min: 0, max: 100 },
    capitalCommitted: { type: Number, default: 0, min: 0 },
    capitalPaid:      { type: Number, default: 0, min: 0 },
    notes:            { type: String, default: "" },
    avatarUrl:        { type: String, default: "" },
    lastLogin:        { type: Date, default: null },

    // KYC
    kycStatus:            { type: String, enum: ["none", "not_started", "pending", "approved", "rejected"], default: "not_started" },
    kycNote:              { type: String, default: "" },
    nationalId:           { type: String, default: "", select: false },
    nationalIdIssuedDate: { type: Date, default: null },
    nationalIdIssuedPlace:{ type: String, default: "" },
    permanentAddress:     { type: String, default: "", select: false },
    sourceOfFunds:        { type: String, default: "" },
    isPEP:                { type: Boolean, default: false },
    isSanctioned:         { type: Boolean, default: false },
    kycSubmittedAt:       { type: Date, default: null },
    kycReviewedAt:        { type: Date, default: null },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
ShareholderSchema.index({ role: 1, status: 1 });
ShareholderSchema.index({ status: 1, createdAt: -1 });
ShareholderSchema.index({ kycStatus: 1 });

// ── Password helpers ──────────────────────────────────────────────────────────
// Mongoose v9 pre-save uses Promise-based middleware (no next() callback needed)
ShareholderSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

ShareholderSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  const hash = this.password as string;
  return bcrypt.compare(candidate, hash);
};

const Shareholder =
  mongoose.models.Shareholder ||
  mongoose.model<IShareholder>("Shareholder", ShareholderSchema);

export default Shareholder;
