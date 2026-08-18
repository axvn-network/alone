import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
  lastLogin: Date | null;
  /** TOTP secret (AES or base32) — not returned by default */
  mfaSecret: string | null;
  /** True once admin has verified the TOTP setup */
  mfaEnabled: boolean;
  /** When true, login flow requires TOTP after password */
  mfaRequiredForLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    lastLogin: { type: Date, default: null },
    mfaSecret: { type: String, select: false, default: null },
    mfaEnabled: { type: Boolean, default: false },
    mfaRequiredForLogin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
