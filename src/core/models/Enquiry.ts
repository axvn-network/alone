import mongoose, { Schema, Document } from "mongoose";

/**
 * Enquiry — liên hệ + đăng ký hội đồng đầu tư.
 *
 * Lưu ý tuân thủ:
 *   - consentGiven + consentTimestamp: bắt buộc theo Nghị định 13/2023/NĐ-CP
 *     về bảo vệ dữ liệu cá nhân (PDPA).
 *   - ipAddress + userAgent: lưu cho mục đích kiểm toán bảo mật
 *     theo Thông tư 06/2023/TT-BTTTT, giữ ít nhất 12 tháng.
 */

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
  /** Đồng ý xử lý dữ liệu cá nhân — bắt buộc theo NĐ 13/2023/NĐ-CP */
  consentGiven: boolean;
  /** ISO timestamp khi người dùng đồng ý */
  consentTimestamp: string;
  /** IP address của người gửi — lưu cho kiểm toán bảo mật */
  ipAddress: string;
  /** User-Agent string của trình duyệt */
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    type: {
      type: String,
      enum: [
        "Contact",
        "Investment Opportunity",
        "Business Acquisition",
        "Joint Venture",
        "Strategic Partnership",
      ],
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
    consentGiven: { type: Boolean, required: true, default: false },
    consentTimestamp: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ type: 1, createdAt: -1 });
EnquirySchema.index({ email: 1 });
EnquirySchema.index({ name: "text", email: "text", subject: "text", message: "text" });

const Enquiry =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
