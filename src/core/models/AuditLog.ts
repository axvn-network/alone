import mongoose, { Schema, Document } from "mongoose";

const SEVEN_YEARS_MS  = 7 * 365 * 24 * 60 * 60 * 1000;
const ONE_YEAR_MS     = 365 * 24 * 60 * 60 * 1000;

// Actions cần giữ lại 7 năm vì liên quan đến vốn / cổ đông
const LONG_RETAIN_PREFIXES = ["capital.", "shareholder.", "admin.login."];

function calcRetainUntil(action: string): Date {
  const isLong = LONG_RETAIN_PREFIXES.some((p) => action.startsWith(p));
  return new Date(Date.now() + (isLong ? SEVEN_YEARS_MS : ONE_YEAR_MS));
}

export interface IAuditLog extends Document {
  actor: { id: string; name: string; email: string };
  action: string;
  target: { collection: string; id: string };
  delta: Record<string, unknown>;
  ip: string;
  retainUntil: Date;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: {
      id:    { type: String, required: true },
      name:  { type: String, default: "" },
      email: { type: String, default: "" },
    },
    action: { type: String, required: true, index: true },
    target: {
      collection: { type: String, required: true },
      id:         { type: String, required: true },
    },
    delta:       { type: Schema.Types.Mixed, default: {} },
    ip:          { type: String, default: "" },
    retainUntil: { type: Date, default: function(this: { action?: string }) {
      return calcRetainUntil(this.action || "");
    }},
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

AuditLogSchema.index({ "actor.id": 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
// TTL: xóa document khi retainUntil đã qua
// capital.*/shareholder.*/admin.login → 7 năm | còn lại → 1 năm
AuditLogSchema.index({ retainUntil: 1 }, { expireAfterSeconds: 0 });

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
