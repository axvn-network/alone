import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { shareholderService } from "@/modules/shareholders";
import { logAudit } from "@/modules/audit-log";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import type {
  ShareholderRole,
  ShareholderStatus,
  IShareholder,
} from "@/modules/shareholders";

// GET /api/admin/shareholders?search=&role=&status=&kycStatus=
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = req.nextUrl;
    const result = await shareholderService.list({
      search: searchParams.get("search") || undefined,
      role: (searchParams.get("role") || undefined) as
        ShareholderRole | undefined,
      status: (searchParams.get("status") || undefined) as
        ShareholderStatus | undefined,
      kycStatus: (searchParams.get("kycStatus") || undefined) as
        IShareholder["kycStatus"] | undefined,
    });
    return successResponse(result);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// POST /api/admin/shareholders — create
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const sh = await shareholderService.create(body);

    await logAudit({
      actor: { id: user.id, name: user.name, email: user.email },
      action: "shareholder.create",
      collection: "shareholders",
      id: sh._id as string,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
      userAgent: req.headers.get("user-agent") ?? "",
    });

    return successResponse(sh, "Cổ đông đã được tạo thành công", 201);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
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
      actor: { id: user.id, name: user.name, email: user.email },
      action: "shareholder.update",
      collection: "shareholders",
      id: _id,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
      userAgent: req.headers.get("user-agent") ?? "",
    });

    return successResponse(sh);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
