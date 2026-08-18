/**
 * src/modules/investor/model.ts
 * Mongoose schema — Investor
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IInvestorDoc extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  capitalCommitted: number;
  status: "pending" | "active" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const InvestorSchema = new Schema<IInvestorDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    capitalCommitted: { type: Number, required: true },
    status: { type: String, enum: ["pending", "active", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Investor =
  mongoose.models.Investor ||
  mongoose.model<IInvestorDoc>("Investor", InvestorSchema);

export default Investor;
