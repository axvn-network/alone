/**
 * /api/shareholders/documents — Documents for shareholders
 *
 * GET → published documents (shareholder or admin session required)
 */
import { NextRequest } from "next/server";
import { connectDB } from "@/core/database";
import { DocumentModel } from "@/modules/documents";
import { getActiveShareholder } from "@/modules/auth/sh-auth";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export async function GET(req: NextRequest) {
  const sh = await getActiveShareholder();
  const admin = !sh ? await getCurrentUser() : null;
  if (!sh && !admin) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || undefined;
    const yearStr = searchParams.get("year");
    const year = yearStr ? parseInt(yearStr) : undefined;

    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = category;
    if (year) filter.year = year;

    const docs = await DocumentModel.find(filter)
      .sort({ year: -1, publishedDate: -1 })
      .select("-__v")
      .lean();

    const years = await DocumentModel.distinct("year", { status: "published" });

    return successResponse({
      documents: docs,
      years: (years as number[]).sort((a, b) => b - a),
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
