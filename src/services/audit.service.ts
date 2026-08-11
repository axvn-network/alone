/**
 * src/services/audit.service.ts
 *
 * Thin helper — ghi một dòng vào AuditLog từ bất kỳ route handler nào.
 * Không throw: lỗi audit không được làm fail request chính.
 *
 * Usage:
 *   import { logAudit } from "@/services/audit.service";
 *   await logAudit({ actor, action: "blog.create", collection: "blogs", id: post.slug, ip });
 */

import { connectDB } from "@/lib/db";
import AuditLog, { IAuditLog } from "@/models/AuditLog";

export interface AuditActor {
  id: string;
  name?: string;
  email?: string;
}

export interface LogAuditOptions {
  actor: AuditActor;
  /** dot-notation action, e.g. "blog.create", "shareholder.delete" */
  action: string;
  /** MongoDB collection name */
  collection: string;
  /** document _id or slug */
  id: string;
  /** optional diff snapshot */
  delta?: Record<string, unknown>;
  ip?: string;
}

export interface AuditQuery {
  action?: string;
  actorId?: string;
  collection?: string;
  from?: string;    // ISO date
  to?: string;      // ISO date
  page?: number;
  limit?: number;
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function logAudit(opts: LogAuditOptions): Promise<void> {
  try {
    await connectDB();
    await AuditLog.create({
      actor: {
        id:    opts.actor.id,
        name:  opts.actor.name  ?? "",
        email: opts.actor.email ?? "",
      },
      action: opts.action,
      target: {
        collection: opts.collection,
        id:         opts.id,
      },
      delta: opts.delta ?? {},
      ip:    opts.ip    ?? "",
    });
  } catch {
    // Audit log failures are non-fatal
  }
}

// ─── Read (admin query) ───────────────────────────────────────────────────────

export async function queryLogs(query: AuditQuery = {}): Promise<{
  logs: IAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (query.action)     filter.action           = { $regex: query.action, $options: "i" };
  if (query.actorId)    filter["actor.id"]       = query.actorId;
  if (query.collection) filter["target.collection"] = query.collection;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) (filter.createdAt as Record<string, unknown>).$gte = new Date(query.from);
    if (query.to)   (filter.createdAt as Record<string, unknown>).$lte = new Date(query.to);
  }

  const page  = Math.max(1, query.page  || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 50));

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean() as unknown as IAuditLog[],
    AuditLog.countDocuments(filter),
  ]);

  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getLogsByActor(actorId: string, limit = 20): Promise<IAuditLog[]> {
  await connectDB();
  return AuditLog.find({ "actor.id": actorId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() as unknown as IAuditLog[];
}

export async function deleteExpiredLogs(): Promise<number> {
  await connectDB();
  const result = await AuditLog.deleteMany({ retainUntil: { $lt: new Date() } });
  return result.deletedCount ?? 0;
}
