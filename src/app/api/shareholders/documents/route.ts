/**
 * /api/shareholders/documents — Tài liệu dành cho Cổ Đông.
 *
 * GET → Trả về danh sách tài liệu đã xuất bản.
 *       Cổ đông chỉ thấy tài liệu status: "published".
 *       Có thể lọc theo category và year.
 *
 * Quyền: shareholder (active) hoặc admin/superadmin.
 */

import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import DocumentModel from "@/models/Document";
import { getActiveShareholder } from "@/lib/sh-auth";
import { getCurrentUser } from "@/lib/auth-utils";
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export async function GET(req: NextRequest) {
  // Chấp nhận session cổ đông HOẶC session admin
  const sh   = await getActiveShareholder();
  const admin = !sh ? await getCurrentUser() : null;
  if (!sh && !admin) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || undefined;
    const yearStr  = searchParams.get("year");
    const year     = yearStr ? parseInt(yearStr) : undefined;

    // Xây dựng bộ lọc — cổ đông chỉ thấy tài liệu published
    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = category;
    if (year) filter.year = year;

    const docs = await DocumentModel
      .find(filter)
      .sort({ year: -1, publishedDate: -1 })
      .select("-__v")
      .lean();

    // Lấy danh sách năm có tài liệu để dùng cho bộ lọc UI
    const years = await DocumentModel.distinct("year", { status: "published" });

    return successResponse({ documents: docs, years: (years as number[]).sort((a, b) => b - a) });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
