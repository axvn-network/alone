import { NextRequest } from "next/server";
import { successResponse, serverErrorResponse, unauthorizedResponse, errorResponse, notFoundResponse } from "@/utils/api-response";
import { getCurrentUser } from "@/lib/auth-utils";
import { shareholderService } from "@/services";
import { handleError, NotFoundError } from "@/utils/errors";
import { logAudit } from "@/services/audit.service";

// GET /api/admin/shareholders?search=&role=&status=&kycStatus=
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = req.nextUrl;
    const result = await shareholderService.list({
      search:    searchParams.get("search")    || undefined,
      role:      (searchParams.get("role")     || undefined) as import("@/models/Shareholder").ShareholderRole | undefined,
      status:    (searchParams.get("status")   || undefined) as import("@/models/Shareholder").ShareholderStatus | undefined,
      kycStatus: (searchParams.get("kycStatus")|| undefined) as import("@/models/Shareholder").IShareholder["kycStatus"] | undefined,
    });
    return successResponse(result);
  } catch (e) { return serverErrorResponse(handleError(e).message); }
}

// POST /api/admin/shareholders — create
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const sh = await shareholderService.create(body);

    await logAudit({
      actor:      { id: user.id, name: user.name, email: user.email },
      action:     "shareholder.create",
      collection: "shareholders",
      id:         sh._id as string,
      ip:         req.headers.get("x-forwarded-for") || "",
    });

    return successResponse(sh, "Cổ đông đã được tạo thành công", 201);
  } catch (e) { return serverErrorResponse(handleError(e).message); }
}

// PUT /api/admin/shareholders — update by _id in body
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { _id, ...body } = await req.json();
    if (!_id) return errorResponse("ID required");

    const sh = await shareholderService.update(_id, body);

    await logAudit({
      actor:      { id: user.id, name: user.name, email: user.email },
      action:     "shareholder.update",
      collection: "shareholders",
      id:         _id,
      ip:         req.headers.get("x-forwarded-for") || "",
    });

    return successResponse(sh);
  } catch (e) {
    if (e instanceof NotFoundError) return notFoundResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}

// DELETE /api/admin/shareholders?id=xxx — superadmin only
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    if (user.role !== "superadmin") return errorResponse("Forbidden: superadmin only", 403);

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return serverErrorResponse("ID required");

    await shareholderService.remove(id);

    await logAudit({
      actor:      { id: user.id, name: user.name, email: user.email },
      action:     "shareholder.delete",
      collection: "shareholders",
      id,
      ip:         req.headers.get("x-forwarded-for") || "",
    });

    return successResponse({ ok: true });
  } catch (e) {
    if (e instanceof NotFoundError) return notFoundResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}
