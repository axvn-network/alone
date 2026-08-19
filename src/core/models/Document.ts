import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export type DocumentCategory =
  | "financial_report"    // Báo cáo tài chính
  | "annual_report"       // Báo cáo thường niên
  | "disclosure"          // Công bố thông tin
  | "charter"             // Điều lệ / Quy chế nội bộ
  | "shareholder_meeting" // Tài liệu ĐHCĐ / họp HĐQT
  | "governance_report"   // Báo cáo quản trị
  | "press_release"       // Thông cáo báo chí
  | "regulatory_filing";  // Hồ sơ nộp cơ quan quản lý (Bộ Tài Chính, SSC, v.v.)

export interface IDocument extends MongoDocument {
  title: string;
  titleEn?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: "pdf" | "doc" | "xlsx" | "other";
  publishedDate: Date;
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  /** Sub-type for financial reports: consolidated_audited | separate_audited | consolidated | separate | solvency */
  reportType?: string;
  isFeatured: boolean;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, trim: true },
    titleEn: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "financial_report",
        "annual_report",
        "disclosure",
        "charter",
        "shareholder_meeting",
        "governance_report",
        "press_release",
        "regulatory_filing",
      ],
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["pdf", "doc", "xlsx", "other"],
      default: "pdf",
    },
    publishedDate: { type: Date, required: true },
    year: { type: Number, required: true },
    quarter: { type: Number, enum: [1, 2, 3, 4], default: null },
    reportType: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  { timestamps: true },
);

DocumentSchema.index({ category: 1, year: -1, publishedDate: -1 });
DocumentSchema.index({ status: 1, publishedDate: -1 });
DocumentSchema.index({ isFeatured: 1, status: 1 });
DocumentSchema.index({ title: "text", titleEn: "text" });

const DocumentModel =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
