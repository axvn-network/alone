/**
 * src/modules/audit-log/service.ts
 * AuditLog service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import AuditLog, { type IAuditLog } from "./model";

export interface AuditActor {
  id: string;
  name?: string;
  email?: string;
}

export interface LogAuditOptions {
  actor: AuditActor;
  action: string;
  /** Hỗ trợ cả dạng nested { collection, id } lẫn flat (collection + id trực tiếp) */
  target?: { collection: string; id: string };
  /** Flat shorthand — tương đương target.collection */
  collection?: string;
  /** Flat shorthand — tương đương target.id */
  id?: string;
  delta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export interface AuditQuery {
  /** ID của actor (tương đương actor) */
  actorId?: string;
  actor?: string;
  action?: string;
  collection?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function logAudit(opts: LogAuditOptions): Promise<IAuditLog> {
  await connectDB();
  // Hỗ trợ cả flat (collection + id) lẫn nested (target)
  const target = opts.target ?? {
    collection: opts.collection ?? "",
    id: String(opts.id ?? ""),
  };
  return AuditLog.create({
    actor: {
      id: opts.actor.id,
      name: opts.actor.name ?? "",
      email: opts.actor.email ?? "",
    },
    action: opts.action,
    target,
    delta: opts.delta ?? {},
    ip: opts.ip ?? "",
    userAgent: opts.userAgent ?? "",
  });
}

export async function queryLogs(q: AuditQuery = {}) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  // Hỗ trợ cả actorId (từ API query params) lẫn actor
  const actorFilter = q.actorId ?? q.actor;
  if (actorFilter) filter["actor.id"] = actorFilter;
  if (q.action) filter.action = { $regex: q.action, $options: "i" };
  if (q.collection) filter["target.collection"] = q.collection;
  if (q.from || q.to) {
    filter.createdAt = {};
    if (q.from)
      (filter.createdAt as Record<string, unknown>).$gte = new Date(q.from);
    if (q.to)
      (filter.createdAt as Record<string, unknown>).$lte = new Date(q.to);
  }
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(500, Math.max(1, q.limit ?? 50));
  const [docs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(total / limit);
  return { logs: docs, total, page, limit, totalPages };
}

export async function getLogsByActor(actorId: string, limit = 50) {
  await connectDB();
  return AuditLog.find({ "actor.id": actorId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function deleteExpiredLogs() {
  await connectDB();
  const result = await AuditLog.deleteMany({
    retainUntil: { $lt: new Date() },
  });
  return result.deletedCount;
}
