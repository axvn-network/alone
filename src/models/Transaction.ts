import mongoose, { Schema, Document } from "mongoose";

export type TransactionType = "recharge" | "withdraw" | "order" | "adjustment";
export type PaymentMethod = "momo" | "bank" | "usdt" | "telco";
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";

export interface ITransaction extends Document {
  transaction_id: string;
  user_id: mongoose.Types.ObjectId;
  transaction_type: TransactionType;
  payment_method: PaymentMethod;
  amount: number;
  fee: number;
  balance_after: number;
  status: TransactionStatus;
  reference_code: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transaction_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    transaction_type: {
      type: String,
      enum: ["recharge", "withdraw", "order", "adjustment"],
      required: true,
      index: true,
    },
    payment_method: {
      type: String,
      enum: ["momo", "bank", "usdt", "telco"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, default: 0, min: 0 },
    balance_after: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    reference_code: { type: String, default: "", index: true },
    notes: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
