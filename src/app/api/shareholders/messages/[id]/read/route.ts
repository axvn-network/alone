/**
 * POST /api/shareholders/messages/[id]/read
 * Đánh dấu một tin nhắn cụ thể là đã đọc bởi cổ đông hiện tại.
 */

import { NextRequest } from "next/server";
import { ShareholderMessage } from "@/modules/shareholders";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { getActiveShareholder } from "@/modules/auth/sh-auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
