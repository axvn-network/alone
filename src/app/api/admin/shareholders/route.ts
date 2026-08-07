import { NextRequest } from "next/server";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { getCurrentUser } from "@/lib/auth-utils";
import { shareholderService } from "@/services";
import { handleError, NotFoundError } from "@/utils/errors";

// GET /api/admin/shareholders
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    const list = await shareholderService.list();
    return successResponse(list);
  } catch (e) { return serverErrorResponse(handleError(e).message); }
}

// POST /api/admin/shareholders — create
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    const body = await req.json();
    const sh = await shareholderService.create(body);
    return successResponse(sh, "Cổ đông đã được tạo thành công", 201);
  } catch (e) { return serverErrorResponse(handleError(e).message); }
}

// PUT /api/admin/shareholders — update by _id in body
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    const { _id, ...body } = await req.json();
    if (!_id) return serverErrorResponse("ID required");
    const sh = await shareholderService.update(_id, body);
    return successResponse(sh);
  } catch (e) {
    if (e instanceof NotFoundError) return serverErrorResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}

// DELETE /api/admin/shareholders?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return serverErrorResponse("ID required");
    await shareholderService.remove(id);
    return successResponse({ ok: true });
  } catch (e) {
    if (e instanceof NotFoundError) return serverErrorResponse(e.message);
    return serverErrorResponse(handleError(e).message);
  }
}
