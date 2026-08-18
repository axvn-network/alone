/**
 * /api/shareholders/kyc
 *
 * GET  — get current KYC status for logged-in shareholder
 * POST — submit KYC application (transitions status → "pending")
 */
import { NextRequest } from "next/server";
import { connectDB } from "@/core/database";
import { ShareholderModel as Shareholder } from "@/modules/shareholders";
import { getActiveShareholder } from "@/modules/auth/sh-auth";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET — current KYC status
export async function GET() {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    await connectDB();
    const doc = await Shareholder.findById(sh._id)
      .select("kycStatus kycSubmittedAt kycReviewedAt")
      .lean();
    if (!doc) return unauthorizedResponse();

    return successResponse({
      kycStatus: doc.kycStatus ?? "not_started",
      kycSubmittedAt: doc.kycSubmittedAt ?? null,
      kycReviewedAt: doc.kycReviewedAt ?? null,
      isPEP: false,
      isSanctioned: false,
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// POST — submit KYC application
export async function POST(req: NextRequest) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (
      !body.nationalId ||
      typeof body.nationalId !== "string" ||
      body.nationalId.trim().length < 6
    ) {
      return badRequestResponse(
        "Số CCCD/Hộ chiếu không hợp lệ (tối thiểu 6 ký tự)",
      );
    }
    if (
      !body.permanentAddress ||
      typeof body.permanentAddress !== "string" ||
      body.permanentAddress.trim().length < 5
    ) {
      return badRequestResponse("Địa chỉ thường trú không được để trống");
    }
    if (!body.sourceOfFunds || typeof body.sourceOfFunds !== "string") {
      return badRequestResponse("Nguồn gốc vốn không được để trống");
    }

    await connectDB();

    const current = await Shareholder.findById(sh._id)
      .select("kycStatus")
      .lean();
    if (!current) return unauthorizedResponse();

    if (current.kycStatus === "pending" || current.kycStatus === "approved") {
      return badRequestResponse(
        current.kycStatus === "pending"
          ? "Hồ sơ KYC đang được xét duyệt, vui lòng chờ"
          : "KYC của bạn đã được xác minh",
      );
    }

    await Shareholder.findByIdAndUpdate(sh._id, {
      $set: {
        nationalId: String(body.nationalId).trim(),
        nationalIdIssuedDate: body.nationalIdIssuedDate
          ? new Date(String(body.nationalIdIssuedDate))
          : null,
        nationalIdIssuedPlace:
          typeof body.nationalIdIssuedPlace === "string"
            ? body.nationalIdIssuedPlace.trim()
            : "",
        permanentAddress: String(body.permanentAddress).trim(),
        sourceOfFunds: String(body.sourceOfFunds).trim(),
        isPEP: body.isPEP === true,
        isSanctioned: body.isSanctioned === true,
        kycStatus: "pending",
        kycSubmittedAt: new Date(),
      },
    });

    return successResponse({
      kycStatus: "pending",
      submittedAt: new Date().toISOString(),
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
