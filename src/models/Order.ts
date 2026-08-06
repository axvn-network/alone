import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface IOrder extends Document {
  order_id: string;
  user_id: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  status: OrderStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    order_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
