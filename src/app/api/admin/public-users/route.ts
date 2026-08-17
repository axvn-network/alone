/**
 * /api/admin/public-users — Quản lý tài khoản người dùng công khai.
 *
 * GET    → danh sách public users (phân trang + tìm kiếm)
 * PATCH  → cập nhật trạng thái isActive
 * DELETE → xóa tài khoản (?id=xxx) — superadmin only
 */

import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import PublicUser from "@/models/PublicUser";
import { getCurrentUser } from "@/lib/auth-utils";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
  forbiddenResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// Loại bỏ các trường nhạy cảm trước khi trả về
function safe(doc: Record<string, unknown>) {
  const { password: _pw, verificationToken: _vt, passwordResetToken: _prt, __v: _v, ...rest } = doc;
  void _pw; void _vt; void _prt; void _v;
  return { ...rest, _id: String(rest._id) };
}

// ─── GET — danh sách public users ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("search") || "";

    // Bộ lọc tìm kiếm
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      PublicUser.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PublicUser.countDocuments(filter),
    ]);

    return successResponse({
      users: users.map(safe),
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// ─── PATCH — cập nhật trạng thái isActive ────────────────────────────────────

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const { id, isActive } = await req.json() as { id: string; isActive: boolean };
    if (!id) return errorResponse("ID bắt buộc.");

    const updated = await PublicUser.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).lean();

    if (!updated) return errorResponse("Không tìm thấy người dùng.", 404);

    return successResponse(safe(updated as Record<string, unknown>));
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// ─── DELETE — xóa tài khoản (superadmin only) ────────────────────────────────

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  // Chỉ superadmin mới được xóa tài khoản
  if (user.role !== "superadmin") {
    return forbiddenResponse("Chỉ Siêu Quản Trị Viên mới có thể xóa tài khoản người dùng.");
  }

  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return errorResponse("ID bắt buộc.");

    await PublicUser.findByIdAndDelete(id);
    return successResponse({ ok: true }, "Đã xóa tài khoản.");
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
