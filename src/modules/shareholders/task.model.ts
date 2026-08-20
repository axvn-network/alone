/**
 * src/modules/shareholders/task.model.ts
 * Canonical ShareholderTask model.
 */
import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskCategory =
  "legal" | "finance" | "tech" | "governance" | "ops" | "other";

export interface IShareholderTask extends Document {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: Types.ObjectId[];
  assignedRoles: string[];
  dueDate: Date | null;
  completedAt: Date | null;
  completedBy: Types.ObjectId | null;
  milestoneTag: string;
  legalRef: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShareholderTaskSchema = new Schema<IShareholderTask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["legal", "finance", "tech", "governance", "ops", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done", "blocked"],
      default: "todo",
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "Shareholder" }],
    assignedRoles: [{ type: String }],
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: "Shareholder",
      default: null,
    },
    milestoneTag: { type: String, default: "" },
    legalRef: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ShareholderTaskSchema.index({ status: 1, priority: 1 });

const ShareholderTask =
  mongoose.models.ShareholderTask ||
  mongoose.model<IShareholderTask>("ShareholderTask", ShareholderTaskSchema);

export default ShareholderTask;
