/**
 * src/modules/capital-transactions/service.ts
 *
 * Business logic core cho giao dịch vốn cổ đông.
 *
 * Luồng chính:
 *   1. Admin tạo capital_call  → status: pending
 *   2. Cổ đông gửi deposit     → status: pending, proofUrl đính kèm
 *   3. Admin confirm deposit   → status: confirmed, capitalPaid += amount (atomic)
 *   4. Admin reject deposit    → status: rejected
 *
 * Mutation cập nhật Shareholder.capitalPaid thực hiện trong Mongoose session
 * để đảm bảo tính nhất quán dữ liệu.
 */

import { connectDB } from "@/core/database";
import Shareholder from "@/core/models/Shareholder";
import { Types } from "mongoose";
import { paginate } from "@/utils/pagination";
import CapitalTransaction from "./model";
import type {
  CapTxQuery,
  CreateCapTxDto,
  UpdateCapTxDto,
  CapTxListResult,
  CapTxStats,
  CapitalTx,
} from "./types";

// ─── Serialiser ───────────────────────────────────────────────────────────────

function toSafe(doc: Record<string, unknown>): CapitalTx {
  return {
    _id:              String(doc._id),
    shareholderId:    String(doc.shareholderId),
    shareholderName:  String(doc.shareholderName  ?? ""),
    shareholderEmail: String(doc.shareholderEmail ?? ""),
    type:             doc.type             as CapitalTx["type"],
    status:           doc.status           as CapitalTx["status"],
    amount:           doc.amount           as number,
    currency:         String(doc.currency  ?? "VND"),
    description:      String(doc.description ?? ""),
    referenceNo:      String(doc.referenceNo  ?? ""),
    proofUrl:         String(doc.proofUrl     ?? ""),
    adminNote:        String(doc.adminNote    ?? ""),
    processedBy:      doc.processedBy ? String(doc.processedBy) : null,
    processedAt:      doc.processedAt instanceof Date
                        ? doc.processedAt.toISOString()
                        : (doc.processedAt as string | null) ?? null,
    createdAt:        doc.createdAt instanceof Date
                        ? doc.createdAt.toISOString()
                        : String(doc.createdAt),
    updatedAt:        doc.updatedAt instanceof Date
                        ? doc.updatedAt.toISOString()
                        : String(doc.updatedAt),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách giao dịch vốn với phân trang và lọc.
 */
export async function list(query: CapTxQuery = {}): Promise<CapTxListResult> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (query.shareholderId) filter.shareholderId = new Types.ObjectId(query.shareholderId);
  if (query.type)          filter.type          = query.type;
  if (query.status)        filter.status        = query.status;

  const { page, limit, skip } = paginate(query, { limit: 20, maxLimit: 100 });

  const [docs, total] = await Promise.all([
    CapitalTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CapitalTransaction.countDocuments(filter),
  ]);

  return { docs: docs.map((d) => toSafe(d as Record<string, unknown>)), total, page, limit };
}

/**
 * Admin tạo capital_call hoặc giao dịch thủ công.
 * Tự động snap name/email từ Shareholder để tránh populate.
 */
export async function create(data: CreateCapTxDto): Promise<CapitalTx> {
  await connectDB();

  const sh = await Shareholder.findById(data.shareholderId).lean();
  if (!sh) throw new Error("Cổ đông không tồn tại");

  const doc = await CapitalTransaction.create({
    shareholderId:    new Types.ObjectId(data.shareholderId),
    shareholderName:  sh.name,
    shareholderEmail: sh.email,
    type:             data.type,
    status:           "pending",
    amount:           Math.round(data.amount),
    description:      data.description ?? "",
    referenceNo:      data.referenceNo  ?? "",
    adminNote:        data.adminNote    ?? "",
    proofUrl:         data.proofUrl     ?? "",
  });

  return toSafe(doc.toObject() as Record<string, unknown>);
}

/**
 * Admin cập nhật trạng thái (confirmed / rejected / cancelled).
 * Khi confirmed → cộng amount vào Shareholder.capitalPaid (atomic session).
 */
export async function updateStatus(data: UpdateCapTxDto): Promise<CapitalTx> {
  await connectDB();

  const tx = await CapitalTransaction.findById(data.id);
  if (!tx) throw new Error("Giao dịch không tồn tại");
  if (tx.status !== "pending") {
    throw new Error("Chỉ có thể cập nhật trạng thái giao dịch đang chờ xử lý");
  }

  const session = await CapitalTransaction.startSession();
  try {
    session.startTransaction();

    tx.status      = data.status;
    tx.adminNote   = data.adminNote ?? tx.adminNote;
    tx.processedBy = new Types.ObjectId(data.processedBy);
    tx.processedAt = new Date();
    await tx.save({ session });

    if (data.status === "confirmed") {
      await Shareholder.findByIdAndUpdate(
        tx.shareholderId,
        { $inc: { capitalPaid: tx.amount } },
        { session }
      );
    }

    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }

  return toSafe(tx.toObject() as Record<string, unknown>);
}

/**
 * Cổ đông gửi deposit: tạo giao dịch type=deposit với proofUrl.
 */
export async function submitDeposit(
  shareholderId: string,
  amount:        number,
  proofUrl:      string,
  description?:  string
): Promise<CapitalTx> {
  return create({ shareholderId, type: "deposit", amount, proofUrl, description });
}

/**
 * Dashboard stats — tổng hợp cho admin trang chủ.
 */
export async function getStats(): Promise<CapTxStats> {
  await connectDB();

  const [totalPending, totalConfirmed, totalRejected, pendingAgg, confirmedAgg] =
    await Promise.all([
      CapitalTransaction.countDocuments({ status: "pending" }),
      CapitalTransaction.countDocuments({ status: "confirmed" }),
      CapitalTransaction.countDocuments({ status: "rejected" }),
      CapitalTransaction.aggregate([
        { $match: { status: "pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      CapitalTransaction.aggregate([
        { $match: { status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  return {
    totalPending,
    totalConfirmed,
    totalRejected,
    pendingAmount:   pendingAgg[0]?.total   ?? 0,
    confirmedAmount: confirmedAgg[0]?.total ?? 0,
  };
}
