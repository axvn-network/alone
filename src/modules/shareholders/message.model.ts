/**
 * src/modules/shareholders/message.model.ts
 * Canonical ShareholderMessage model.
 */
import mongoose, { Schema, Document, Types } from "mongoose";

export type MessageChannel =
  "general" | "finance" | "legal" | "tech" | "governance" | "admin";

export interface IShareholderMessage extends Document {
  channel: MessageChannel;
  sender: Types.ObjectId;
  senderName: string;
  senderRole: string;
  isAdminSender: boolean;
  content: string;
  replyTo: Types.ObjectId | null;
  attachmentUrl: string;
  attachmentName: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ShareholderMessageSchema = new Schema<IShareholderMessage>(
  {
    channel: {
      type: String,
      enum: ["general", "finance", "legal", "tech", "governance", "admin"],
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "Shareholder", required: true },
    senderName: { type: String, default: "" },
    senderRole: { type: String, default: "" },
    isAdminSender: { type: Boolean, default: false },
    content: { type: String, required: true },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "ShareholderMessage",
      default: null,
    },
    attachmentUrl: { type: String, default: "" },
    attachmentName: { type: String, default: "" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Shareholder" }],
  },
  { timestamps: true },
);

ShareholderMessageSchema.index({ channel: 1, createdAt: -1 });

const ShareholderMessage =
  mongoose.models.ShareholderMessage ||
  mongoose.model<IShareholderMessage>(
    "ShareholderMessage",
    ShareholderMessageSchema,
  );

export default ShareholderMessage;
