/**
 * /api/admin/admins — admin account management (superadmin only)
 *
 * GET    → list admins
 * POST   → create admin (superadmin only)
 * PUT    → update admin (body: { _id, ...fields })
 * DELETE → delete admin (?id=xxx) — cannot delete self
 */
import { NextRequest } from "next/server";
import { connectDB } from "@/core/database";
import { AdminModel as Admin } from "@/modules/auth";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  errorResponse,
  notFoundResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

function safe(doc: Record<string, unknown>) {
  const { password: _pw, ...rest } = doc;
  void _pw;
  return { ...rest, _id: String(rest._id) };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  try {
    await connectDB();
    const admins = await Admin.find({}).sort({ createdAt: -1 }).lean();
    return successResponse(admins.map(safe));
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  if (user.role !== "superadmin")
    return errorResponse("Forbidden: superadmin only", 403);
  try {
    await connectDB();
    const { name, email, password, role } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };
    if (!name || !email || !password)
      return errorResponse("name, email, password required");
    const hashed = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: role === "superadmin" ? "superadmin" : "admin",
    });
    return successResponse(safe(admin.toObject()), "Admin created", 201);
  } catch (e: unknown) {
    const { message } = handleError(e);
    if (message.includes("duplicate") || message.includes("Duplicate"))
      return errorResponse("Email đã tồn tại");
    return serverErrorResponse(message);
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  try {
    await connectDB();
    const { _id, password, ...rest } = (await req.json()) as {
      _id: string;
      password?: string;
      [k: string]: unknown;
    };
    if (!_id) return errorResponse("_id required");
    const update: Record<string, unknown> = { ...rest };
    if (password) update.password = await bcrypt.hash(password as string, 12);
    delete update._id;
    const admin = await Admin.findByIdAndUpdate(
      _id,
      { $set: update },
      { new: true },
    ).lean();
    if (!admin) return notFoundResponse("Admin not found");
    return successResponse(safe(admin as Record<string, unknown>));
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  if (user.role !== "superadmin")
    return errorResponse("Forbidden: superadmin only", 403);
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return errorResponse("id required");
    if (id === user.id)
      return errorResponse("Không thể xóa tài khoản đang đăng nhập");
    await Admin.findByIdAndDelete(id);
    return successResponse({ ok: true }, "Admin deleted");
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
