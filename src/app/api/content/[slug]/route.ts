import { NextRequest } from "next/server";
import { getPage } from "@/modules/content";
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

// GET — public: fetch a single page by slug (path param)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    return successResponse(await getPage(slug));
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
