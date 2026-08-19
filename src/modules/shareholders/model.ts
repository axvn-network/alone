/**
 * src/modules/shareholders/model.ts
 * Canonical Shareholder model.
 */
import mongoose, { Schema, Document } from "mongoose";

export type ShareholderRole =
  | "tech"
  | "financial"
  | "tech-company"
  | "individual"
  | "legal"
  | "foreign";

export type ShareholderStatus = "pending" | "active" | "suspended";

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
  /** KYC fields */
  kycStatus: "none" | "pending" | "approved" | "rejected";
  kycNote: string;
  createdAt: Date;
  updatedAt: Date;
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
    kycStatus:        { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
    kycNote:          { type: String, default: "" },
  },
  { timestamps: true }
);

ShareholderSchema.index({ role: 1, status: 1 });
ShareholderSchema.index({ status: 1, createdAt: -1 });

const Shareholder =
  mongoose.models.Shareholder ||
  mongoose.model<IShareholder>("Shareholder", ShareholderSchema);

export default Shareholder;
