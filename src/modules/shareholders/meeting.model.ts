/**
 * src/modules/shareholders/meeting.model.ts
 * Canonical ShareholderMeeting model.
 */
import mongoose, { Schema, Document, Types } from "mongoose";

export type MeetingStatus =
  "scheduled" | "in_progress" | "completed" | "cancelled";
export type MeetingType =
  "annual_general" | "extraordinary" | "board" | "committee" | "informal";

export interface IShareholderMeeting extends Document {
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  scheduledAt: Date;
  location: string;
  meetingLink: string;
  invitedRoles: string[];
  attendees: Types.ObjectId[];
  agenda: {
    order: number;
    title: string;
    description: string;
    voteOptions: { label: string }[];
    resolved: boolean;
    resolution: string;
  }[];
  minutes: string;
  attachmentUrl: string;
  attachmentName: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgendaItemSchema = new Schema(
  {
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    voteOptions: [{ label: { type: String } }],
    resolved: { type: Boolean, default: false },
    resolution: { type: String, default: "" },
  },
  { _id: false },
);

const ShareholderMeetingSchema = new Schema<IShareholderMeeting>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "annual_general",
        "extraordinary",
        "board",
        "committee",
        "informal",
      ],
      default: "board",
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    scheduledAt: { type: Date, required: true },
    location: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    invitedRoles: [{ type: String }],
    attendees: [{ type: Schema.Types.ObjectId, ref: "Shareholder" }],
    agenda: [AgendaItemSchema],
    minutes: { type: String, default: "" },
    attachmentUrl: { type: String, default: "" },
    attachmentName: { type: String, default: "" },
  },
  { timestamps: true },
);

ShareholderMeetingSchema.index({ scheduledAt: -1, status: 1 });

const ShareholderMeeting =
  mongoose.models.ShareholderMeeting ||
  mongoose.model<IShareholderMeeting>(
    "ShareholderMeeting",
    ShareholderMeetingSchema,
  );

export default ShareholderMeeting;
