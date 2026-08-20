import mongoose, { Schema, Document } from "mongoose";

const SEVEN_YEARS_S = 7 * 365 * 24 * 60 * 60;
const ONE_YEAR_S = 365 * 24 * 60 * 60;

/**
 * Actions involving capital or shareholder data are subject to
 * the 7-year accounting record retention requirement under
 * Luật Kế toán 88/2015/QH13, Article 41.
 * All other audit events default to a 1-year retention window.
 */
const LONG_RETAIN_PREFIXES = [
  "capital.",
  "shareholder.",
  "admin.login.",
  "investment_plan.",
  "document.",
];

function calcRetainUntilSecs(action: string): number {
  const isLong = LONG_RETAIN_PREFIXES.some((p) => action.startsWith(p));
  return isLong ? SEVEN_YEARS_S : ONE_YEAR_S;
}

export interface IAuditLog extends Document {
  actor: { id: string; name: string; email: string };
  action: string;
  target: { collection: string; id: string };
  delta: Record<string, unknown>;
  ip: string;
  userAgent: string;
  /** UTC timestamp until which this document must be retained */
  retainUntil: Date;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: {
      id: { type: String, required: true },
      name: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    action: { type: String, required: true, index: true },
    target: {
      collection: { type: String, required: true },
      id: { type: String, required: true },
    },
    delta: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    retainUntil: {
      type: Date,
      default: function (this: { action?: string }) {
        const secs = calcRetainUntilSecs(this.action || "");
        return new Date(Date.now() + secs * 1000);
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

AuditLogSchema.index({ "actor.id": 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ "target.collection": 1, "target.id": 1 });
// TTL: MongoDB removes the document when retainUntil passes.
// capital.* / shareholder.* / investment_plan.* / document.* → 7 years
// All other actions → 1 year
AuditLogSchema.index({ retainUntil: 1 }, { expireAfterSeconds: 0 });

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
