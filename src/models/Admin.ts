import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
  lastLogin: Date | null;
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
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
