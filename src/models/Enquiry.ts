import mongoose, { Schema, Document } from "mongoose";

export type EnquiryType =
  | "Contact"
  | "Investment Opportunity"
  | "Business Acquisition"
  | "Joint Venture"
  | "Strategic Partnership";

export type EnquiryStatus = "new" | "read" | "archived";

export interface IEnquiry extends Document {
  type: EnquiryType;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  document: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    type: {
      type: String,
      enum: ["Contact", "Investment Opportunity", "Business Acquisition", "Joint Venture", "Strategic Partnership"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    document: { type: String, default: "" },
    status: { type: String, enum: ["new", "read", "archived"], default: "new" },
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ type: 1 });

const Enquiry = mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
