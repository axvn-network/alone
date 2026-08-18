import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export type DocumentCategory =
  | "financial_report"
  | "disclosure"
  | "charter"
  | "shareholder_meeting"
  | "annual_report"
  | "governance_report";

export interface IDocument extends MongoDocument {
  title: string;
  titleEn?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: "pdf" | "doc" | "xlsx" | "other";
  publishedDate: Date;
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportType?: string;   // e.g. "consolidated_audited", "separate_audited", "consolidated", "separate", "solvency"
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
        "disclosure",
        "charter",
        "shareholder_meeting",
        "annual_report",
        "governance_report",
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
    status: { type: String, enum: ["published", "draft"], default: "published" },
  },
  { timestamps: true }
);

DocumentSchema.index({ category: 1, year: -1, publishedDate: -1 });
DocumentSchema.index({ status: 1 });

const DocumentModel =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
