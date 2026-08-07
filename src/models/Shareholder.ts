import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type ShareholderRole = "tech" | "financial" | "tech-company" | "individual" | "legal" | "foreign";
export type ShareholderStatus = "pending" | "active" | "suspended";

export interface IShareholder extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: ShareholderRole;
  status: ShareholderStatus;
  equityPercent: number;       // % cổ phần cam kết
  capitalCommitted: number;    // VNĐ vốn cam kết
  capitalPaid: number;         // VNĐ đã góp thực tế
  notes: string;               // ghi chú nội bộ (admin only)
  avatarUrl: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const ShareholderSchema = new Schema<IShareholder>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true, select: false },
    phone:            { type: String, default: "" },
    role:             { type: String, enum: ["tech", "financial", "tech-company", "individual", "legal", "foreign"], required: true },
    status:           { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    equityPercent:    { type: Number, default: 0 },
    capitalCommitted: { type: Number, default: 0 },
    capitalPaid:      { type: Number, default: 0 },
    notes:            { type: String, default: "" },
    avatarUrl:        { type: String, default: "" },
    lastLogin:        { type: Date, default: null },
  },
  { timestamps: true }
);

ShareholderSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ShareholderSchema as any).pre("save", async function(this: any, next: () => void) {
  if (!this.isModified?.("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

ShareholderSchema.index({ status: 1, role: 1 });

const Shareholder =
  mongoose.models.Shareholder ||
  mongoose.model<IShareholder>("Shareholder", ShareholderSchema);

export default Shareholder;
