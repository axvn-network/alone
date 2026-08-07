import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus = "pending" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskCategory =
  | "legal"        // Pháp lý
  | "capital"      // Vốn góp
  | "tech"         // Công nghệ
  | "hr"           // Nhân sự
  | "docs"         // Hồ sơ giấy tờ
  | "compliance"   // Tuân thủ / AML
  | "meeting"      // Họp cổ đông
  | "other";

export interface IShareholderTask extends Document {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: Types.ObjectId[];     // Shareholders responsible
  assignedRoles: string[];          // Roles targeted (all in that role)
  dueDate: Date | null;
  completedAt: Date | null;
  completedBy: Types.ObjectId | null;
  milestoneTag: string;             // e.g. "Q2-2026", "Pre-filing"
  legalRef: string;                 // e.g. "Điều 8 NQ5/2025 — Khoản 4"
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShareholderTaskSchema = new Schema<IShareholderTask>(
  {
    title:           { type: String, required: true, trim: true },
    description:     { type: String, default: "" },
    category:        { type: String, enum: ["legal", "capital", "tech", "hr", "docs", "compliance", "meeting", "other"], default: "other" },
    priority:        { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    status:          { type: String, enum: ["pending", "in_progress", "done", "blocked"], default: "pending" },
    assignedTo:      [{ type: Schema.Types.ObjectId, ref: "Shareholder" }],
    assignedRoles:   { type: [String], default: [] },
    dueDate:         { type: Date, default: null },
    completedAt:     { type: Date, default: null },
    completedBy:     { type: Schema.Types.ObjectId, ref: "Shareholder", default: null },
    milestoneTag:    { type: String, default: "" },
    legalRef:        { type: String, default: "" },
    order:           { type: Number, default: 0 },
  },
  { timestamps: true }
);

ShareholderTaskSchema.index({ status: 1, category: 1 });
ShareholderTaskSchema.index({ assignedTo: 1 });
ShareholderTaskSchema.index({ assignedRoles: 1 });

const ShareholderTask =
  mongoose.models.ShareholderTask ||
  mongoose.model<IShareholderTask>("ShareholderTask", ShareholderTaskSchema);

export default ShareholderTask;
