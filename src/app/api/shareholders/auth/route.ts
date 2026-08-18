import { NextRequest } from "next/server";
import { connectDB } from "@/core/database";
import { ShareholderModel as Shareholder } from "@/modules/shareholders";
import {
  successResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { cookies } from "next/headers";
import {
  makeShareholderToken,
  parseShareholderToken,
  SH_COOKIE,
} from "@/modules/auth";

// POST /api/shareholders/auth — login
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = (await req.json()) as {
      email: string;
      password: string;
    };
    if (!email || !password) return unauthorizedResponse();

    const sh = await Shareholder.findOne({
      email: email.toLowerCase(),
      status: "active",
    }).select("+password");
    if (!sh) return unauthorizedResponse();

    const ok = await sh.comparePassword(password);
    if (!ok) return unauthorizedResponse();

    await Shareholder.findByIdAndUpdate(sh._id, { lastLogin: new Date() });

    const token = makeShareholderToken(sh._id.toString(), sh.email);
    const cookieStore = await cookies();
    cookieStore.set(SH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return successResponse({
      id: sh._id.toString(),
      name: sh.name,
      email: sh.email,
      role: sh.role,
      equityPercent: sh.equityPercent,
      capitalCommitted: sh.capitalCommitted,
      capitalPaid: sh.capitalPaid,
      kycStatus: sh.kycStatus ?? "not_started",
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// DELETE /api/shareholders/auth — logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(SH_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return successResponse({ ok: true });
}

// GET /api/shareholders/auth — get current session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SH_COOKIE)?.value;
    if (!raw) return notFoundResponse("No session");
    const parsed = parseShareholderToken(raw);
    if (!parsed) return notFoundResponse("Invalid session");

    await connectDB();
    const sh = await Shareholder.findById(parsed.id).lean();
    if (!sh || sh.status !== "active") return unauthorizedResponse();

    return successResponse({
      id: sh._id.toString(),
      name: sh.name,
      email: sh.email,
      role: sh.role,
      equityPercent: sh.equityPercent,
      capitalCommitted: sh.capitalCommitted,
      capitalPaid: sh.capitalPaid,
      kycStatus: sh.kycStatus ?? "not_started",
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
