import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "superadmin" | "admin" | "agent" | "support" | "user";
export type UserStatus = "active" | "inactive" | "suspended";

export interface IUser extends Document {
  user_id: string;
  email: string;
  username: string;
  password?: string;
  full_name: string;
  phone_number?: string;
  balance: number;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true, trim: true },
    phone_number: { type: String, default: "" },
    balance: { type: Number, default: 0, min: 0, index: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "agent", "support", "user"],
      default: "user",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
