import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { updateEnquiryStatus, deleteEnquiry } from "@/modules/enquiries";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

// PATCH — admin only: update enquiry status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!status || !["new", "read", "archived"].includes(status)) {
      return errorResponse("Invalid status. Must be: new, read, or archived");
    }
    return successResponse(
      await updateEnquiryStatus(id, status),
      "Enquiry updated successfully",
    );
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE — admin only: delete enquiry
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const { id } = await params;
    await deleteEnquiry(id);
    return successResponse(null, "Enquiry deleted successfully");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
