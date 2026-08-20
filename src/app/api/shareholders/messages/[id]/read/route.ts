/**
 * POST /api/shareholders/messages/[id]/read
 * Mark a specific message as read by the current shareholder.
 */
import { NextRequest } from "next/server";
import { ShareholderMessage } from "@/modules/shareholders";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { getActiveShareholder } from "@/modules/auth/sh-auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();
    const { id } = await params;
    await ShareholderMessage.findByIdAndUpdate(id, {
      $addToSet: { readBy: sh._id },
    });
    return successResponse({ ok: true });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
