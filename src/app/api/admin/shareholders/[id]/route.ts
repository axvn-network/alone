/**
 * /api/admin/shareholders/[id]
 *
 * GET    — fetch single shareholder (safe, no password/nationalId)
 * PUT    — update by path id
 * DELETE — delete (superadmin only)
 */
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { shareholderService } from "@/modules/shareholders";
import { logAudit } from "@/modules/audit-log";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const sh = await shareholderService.getById(id);
    if (!sh) return notFoundResponse("Shareholder not found");
    return successResponse(sh);
  } catch (e) {
    if (e instanceof NotFoundError) return notFoundResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const body = await req.json();
    const { _id: _ignored, ...data } = body as {
      _id?: unknown;
      [k: string]: unknown;
    };
    void _ignored;
    const sh = await shareholderService.update(id, data);

    await logAudit({
      actor: { id: user.id, name: user.name, email: user.email },
      action: "shareholder.update",
      collection: "shareholders",
      id,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
      userAgent: req.headers.get("user-agent") ?? "",
    });

    return successResponse(sh);
  } catch (e) {
    if (e instanceof NotFoundError) return notFoundResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    if (user.role !== "superadmin")
      return errorResponse("Forbidden: superadmin only", 403);

    const { id } = await params;
    await shareholderService.remove(id);

    await logAudit({
      actor: { id: user.id, name: user.name, email: user.email },
      action: "shareholder.delete",
      collection: "shareholders",
      id,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
      userAgent: req.headers.get("user-agent") ?? "",
    });

    return successResponse({ ok: true });
  } catch (e) {
    if (e instanceof NotFoundError) return notFoundResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}
