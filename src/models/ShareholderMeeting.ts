import mongoose, { Schema, Document, Types } from "mongoose";

export type MeetingStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type MeetingType = "general" | "emergency" | "technical" | "legal" | "progress";

export interface IVoteOption {
  label: string;
  votes: Types.ObjectId[];   // Shareholder IDs who chose this
}

export interface IAgendaItem {
  order: number;
  title: string;
  description: string;
  voteOptions: IVoteOption[];
  resolved: boolean;
  resolution: string;   // outcome text
}

export interface IShareholderMeeting extends Document {
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  scheduledAt: Date;
  completedAt: Date | null;
  location: string;           // "online" or address
  meetingLink: string;        // Zoom/Google Meet URL
  agenda: IAgendaItem[];
  minutes: string;            // Biên bản họp (rich text)
  attendees: Types.ObjectId[];
  invitedRoles: string[];     // which roles are invited
  attachmentUrl: string;
  attachmentName: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoteOptionSchema = new Schema<IVoteOption>({ label: String, votes: [Schema.Types.ObjectId] }, { _id: false });
const AgendaItemSchema = new Schema<IAgendaItem>(
  {
    order:       { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    voteOptions: { type: [VoteOptionSchema], default: [] },
    resolved:    { type: Boolean, default: false },
    resolution:  { type: String, default: "" },
  },
  { _id: false }
);

const ShareholderMeetingSchema = new Schema<IShareholderMeeting>(
  {
    title:          { type: String, required: true },
    type:           { type: String, enum: ["general", "emergency", "technical", "legal", "progress"], default: "general" },
    status:         { type: String, enum: ["scheduled", "in_progress", "completed", "cancelled"], default: "scheduled" },
    scheduledAt:    { type: Date, required: true },
    completedAt:    { type: Date, default: null },
    location:       { type: String, default: "online" },
    meetingLink:    { type: String, default: "" },
    agenda:         { type: [AgendaItemSchema], default: [] },
    minutes:        { type: String, default: "" },
    attendees:      [{ type: Schema.Types.ObjectId, ref: "Shareholder" }],
    invitedRoles:   { type: [String], default: [] },
    attachmentUrl:  { type: String, default: "" },
    attachmentName: { type: String, default: "" },
  },
  { timestamps: true }
);

ShareholderMeetingSchema.index({ scheduledAt: -1 });
ShareholderMeetingSchema.index({ status: 1 });

const ShareholderMeeting =
  mongoose.models.ShareholderMeeting ||
  mongoose.model<IShareholderMeeting>("ShareholderMeeting", ShareholderMeetingSchema);

export default ShareholderMeeting;
