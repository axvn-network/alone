import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { getActiveShareholder } from "@/modules/auth/sh-auth";
import { meetingService } from "@/modules/shareholders";

// GET /api/shareholders/meetings
export async function GET() {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();
    const meetings = await meetingService.listForShareholder(
      String(sh._id),
      sh.role,
    );
    return successResponse(meetings);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
