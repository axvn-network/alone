import mongoose, { Schema, Document, Types } from "mongoose";

export type MessageChannel = "general" | "tech" | "legal" | "capital" | "meeting" | "announcement";

export interface IShareholderMessage extends Document {
  channel: MessageChannel;
  sender: Types.ObjectId;         // Shareholder._id
  senderName: string;             // denormalized for speed
  senderRole: string;
  isAdminSender: boolean;         // true if sent by admin/tech team
  content: string;
  attachmentUrl: string;
  attachmentName: string;
  replyTo: Types.ObjectId | null;
  readBy: Types.ObjectId[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShareholderMessageSchema = new Schema<IShareholderMessage>(
  {
    channel:        { type: String, enum: ["general", "tech", "legal", "capital", "meeting", "announcement"], default: "general" },
    sender:         { type: Schema.Types.ObjectId, ref: "Shareholder", required: true },
    senderName:     { type: String, required: true },
    senderRole:     { type: String, default: "" },
    isAdminSender:  { type: Boolean, default: false },
    content:        { type: String, required: true },
    attachmentUrl:  { type: String, default: "" },
    attachmentName: { type: String, default: "" },
    replyTo:        { type: Schema.Types.ObjectId, ref: "ShareholderMessage", default: null },
    readBy:         [{ type: Schema.Types.ObjectId, ref: "Shareholder" }],
    pinned:         { type: Boolean, default: false },
  },
  { timestamps: true }
);

ShareholderMessageSchema.index({ channel: 1, createdAt: -1 });
ShareholderMessageSchema.index({ sender: 1 });

const ShareholderMessage =
  mongoose.models.ShareholderMessage ||
  mongoose.model<IShareholderMessage>("ShareholderMessage", ShareholderMessageSchema);

export default ShareholderMessage;
