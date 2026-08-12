import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { getActiveShareholder } from "@/lib/sh-auth";
import { shareholderOpsService } from "@/services";

const { meetingService } = shareholderOpsService;

// GET /api/shareholders/meetings
export async function GET() {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();
    const meetings = await meetingService.listForShareholder(String(sh._id), sh.role);
    return successResponse(meetings);
  } catch (e) { return serverErrorResponse(handleError(e).message); }
}
