import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { queryLogs } from "@/modules/audit-log";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET /api/admin/audit-log?page=1&limit=50&action=&actorId=&collection=&from=&to=
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const url = req.nextUrl;

    const result = await queryLogs({
      page:       Math.max(1, parseInt(url.searchParams.get("page")  || "1")),
      limit:      Math.min(100, parseInt(url.searchParams.get("limit") || "50")),
      action:     url.searchParams.get("action")     || undefined,
      actorId:    url.searchParams.get("actorId")    || undefined,
      collection: url.searchParams.get("collection") || undefined,
      from:       url.searchParams.get("from")       || undefined,
      to:         url.searchParams.get("to")         || undefined,
    });

    return successResponse(result);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
