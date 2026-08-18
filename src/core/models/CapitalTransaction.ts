/**
 * src/models/CapitalTransaction.ts
 *
 * Giao dịch vốn cổ đông — tương đương deposit log + payment log của appypp.
 *
 * Các loại giao dịch:
 *   - capital_call    : Admin tạo yêu cầu góp vốn cho cổ đông
 *   - deposit         : Cổ đông xác nhận đã chuyển khoản (pending xét duyệt)
 *   - payment_confirm : Admin xác nhận đã nhận vốn
 *   - adjustment      : Điều chỉnh thủ công (cộng/trừ số vốn đã góp)
 *
 * Khi admin confirm một `deposit`, service sẽ cộng amount vào Shareholder.capitalPaid.
 *
 * Quy tắc lưu trữ:
 *   - amount: số nguyên đơn vị VNĐ (không có phân số)
 *   - currency: mặc định "VND"
 *   - shareholderId: ref → Shareholder
 *   - processedBy: ref → Admin (nullable)
 */

import mongoose, { Schema, Document, Types } from "mongoose";

export type CapTxType =
  "capital_call" | "deposit" | "payment_confirm" | "adjustment";
export type CapTxStatus = "pending" | "confirmed" | "rejected" | "cancelled";

export interface ICapitalTransaction extends Document {
  shareholderId: Types.ObjectId;
  /** Snapshot name — tránh populate mỗi lần đọc */
  shareholderName: string;
  /** Snapshot email */
  shareholderEmail: string;
  type: CapTxType;
  status: CapTxStatus;
  /** Số tiền — số nguyên đơn vị VNĐ */
  amount: number;
  currency: string;
  description: string;
  /** Mã đợt góp vốn / reference number */
  referenceNo: string;
  /** URL minh chứng chuyển khoản (Cloudinary hoặc link ngoài) */
  proofUrl: string;
  /** Ghi chú nội bộ admin */
  adminNote: string;
  /** Admin đã duyệt / từ chối */
  processedBy: Types.ObjectId | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CapitalTransactionSchema = new Schema<ICapitalTransaction>(
  {
    shareholderId: {
      type: Schema.Types.ObjectId,
      ref: "Shareholder",
      required: true,
      index: true,
    },
    shareholderName: { type: String, default: "" },
    shareholderEmail: { type: String, default: "" },
    type: {
      type: String,
      enum: ["capital_call", "deposit", "payment_confirm", "adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
    /** Số nguyên VNĐ — validator chặn số thập phân */
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "amount phải là số nguyên VNĐ",
      },
    },
    currency: { type: String, default: "VND" },
    description: { type: String, default: "" },
    referenceNo: { type: String, default: "" },
    proofUrl: { type: String, default: "" },
    adminNote: { type: String, default: "" },
    processedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// ── Indexes ────────────────────────────────────────────────────────────────────
CapitalTransactionSchema.index({ shareholderId: 1, createdAt: -1 });
CapitalTransactionSchema.index({ status: 1, type: 1 });
CapitalTransactionSchema.index({ createdAt: -1 });

const CapitalTransaction =
  mongoose.models.CapitalTransaction ||
  mongoose.model<ICapitalTransaction>(
    "CapitalTransaction",
    CapitalTransactionSchema,
  );

export default CapitalTransaction;
