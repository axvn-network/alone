import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { documentService } from "@/services/document.service";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

interface Props {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/documents/[id]
export async function PUT(request: NextRequest, { params }: Props) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const { id } = await params;
    if (!id) return errorResponse("ID is required");
    const body = await request.json();
    const doc = await documentService.update(id, body);
    return successResponse(doc, "Document updated");
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE /api/admin/documents/[id]
export async function DELETE(_request: NextRequest, { params }: Props) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const { id } = await params;
    if (!id) return errorResponse("ID is required");
    await documentService.delete(id);
    return successResponse(null, "Document deleted");
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
