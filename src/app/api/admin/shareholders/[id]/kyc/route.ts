/**
 * PATCH /api/admin/shareholders/[id]/kyc
 *
 * Body: { action: "approve" | "reject" }
 *
 * Duyệt hoặc từ chối KYC của một cổ đông.
 * Superadmin và admin đều có thể thực hiện.
 * Ghi audit log sau mỗi thao tác.
 */

import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { approveKyc, rejectKyc } from "@/modules/shareholders";
import { logAudit } from "@/modules/audit-log";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    if (!id) return badRequestResponse("Missing shareholder id");

    const body = await req.json().catch(() => ({}));
    const action = body?.action as string | undefined;

    if (action !== "approve" && action !== "reject") {
      return badRequestResponse('action must be "approve" or "reject"');
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";

    let updated: Awaited<ReturnType<typeof approveKyc>>;

    if (action === "approve") {
      updated = await approveKyc(id, user.id);
      await logAudit({
        actor: { id: user.id, name: user.name, email: user.email },
        action:     "shareholder.kyc.approve",
        collection: "shareholders",
        id,
        ip,
      });
    } else {
      updated = await rejectKyc(id);
      await logAudit({
        actor: { id: user.id, name: user.name, email: user.email },
        action:     "shareholder.kyc.reject",
        collection: "shareholders",
        id,
        ip,
      });
    }

    return successResponse(updated);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
