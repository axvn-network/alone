/**
 * /api/shareholders/kyc
 *
 * GET   — lấy trạng thái KYC hiện tại của cổ đông
 * POST  — cổ đông nộp hồ sơ KYC (chuyển trạng thái → "pending")
 *
 * Các field được gửi lên:
 *   nationalId, nationalIdIssuedDate, nationalIdIssuedPlace,
 *   permanentAddress, sourceOfFunds, isPEP, isSanctioned
 *
 * nationalId có select:false nên service phải cẩn thận.
 * Ở đây ta lưu vào DB nhưng KHÔNG trả về nationalId trong response.
 */

import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Shareholder from "@/models/Shareholder";
import { getActiveShareholder } from "@/lib/sh-auth";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from "@/utils/api-response";

// GET — trạng thái KYC hiện tại
export async function GET() {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    await connectDB();
    const doc = await Shareholder.findById(sh._id)
      .select("kycStatus kycSubmittedAt kycApprovedAt nationalIdIssuedDate nationalIdIssuedPlace permanentAddress sourceOfFunds isPEP isSanctioned")
      .lean();
    if (!doc) return unauthorizedResponse();

    return successResponse({
      kycStatus:            doc.kycStatus,
      kycSubmittedAt:       doc.kycSubmittedAt ?? null,
      kycApprovedAt:        doc.kycApprovedAt  ?? null,
      nationalIdIssuedDate: doc.nationalIdIssuedDate ?? null,
      nationalIdIssuedPlace: doc.nationalIdIssuedPlace ?? "",
      permanentAddress:     doc.permanentAddress ?? "",
      sourceOfFunds:        doc.sourceOfFunds   ?? "",
      isPEP:                doc.isPEP            ?? false,
      isSanctioned:         doc.isSanctioned    ?? false,
    });
  } catch (e) {
    return serverErrorResponse(e instanceof Error ? e.message : "Error");
  }
}

// POST — nộp hồ sơ KYC
export async function POST(req: NextRequest) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;

    // Validate required fields
    if (!body.nationalId || typeof body.nationalId !== "string" || body.nationalId.trim().length < 6) {
      return badRequestResponse("Số CCCD/Hộ chiếu không hợp lệ (tối thiểu 6 ký tự)");
    }
    if (!body.permanentAddress || typeof body.permanentAddress !== "string" || body.permanentAddress.trim().length < 5) {
      return badRequestResponse("Địa chỉ thường trú không được để trống");
    }
    if (!body.sourceOfFunds || typeof body.sourceOfFunds !== "string") {
      return badRequestResponse("Nguồn gốc vốn không được để trống");
    }

    await connectDB();

    // Chỉ cho phép nộp khi chưa có KYC hoặc bị từ chối
    const current = await Shareholder.findById(sh._id).select("kycStatus").lean();
    if (!current) return unauthorizedResponse();

    if (current.kycStatus === "pending" || current.kycStatus === "approved") {
      return badRequestResponse(
        current.kycStatus === "pending"
          ? "Hồ sơ KYC đang được xét duyệt, vui lòng chờ"
          : "KYC của bạn đã được xác minh"
      );
    }

    await Shareholder.findByIdAndUpdate(sh._id, {
      $set: {
        nationalId:            String(body.nationalId).trim(),
        nationalIdIssuedDate:  body.nationalIdIssuedDate ? new Date(String(body.nationalIdIssuedDate)) : null,
        nationalIdIssuedPlace: typeof body.nationalIdIssuedPlace === "string" ? body.nationalIdIssuedPlace.trim() : "",
        permanentAddress:      String(body.permanentAddress).trim(),
        sourceOfFunds:         String(body.sourceOfFunds).trim(),
        isPEP:                 body.isPEP === true,
        isSanctioned:          body.isSanctioned === true,
        kycStatus:             "pending",
        kycSubmittedAt:        new Date(),
      },
    });

    return successResponse({ kycStatus: "pending", submittedAt: new Date().toISOString() });
  } catch (e) {
    return serverErrorResponse(e instanceof Error ? e.message : "Error");
  }
}
