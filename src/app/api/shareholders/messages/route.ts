import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { getActiveShareholder } from "@/modules/auth/sh-auth";
import { messageService } from "@/modules/shareholders";
import type { MessageChannel } from "@/modules/shareholders";

// GET /api/shareholders/messages?channel=general&limit=50
export async function GET(req: NextRequest) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    const channel = (req.nextUrl.searchParams.get("channel") ||
      "general") as MessageChannel;
    const limit = Math.min(
      200,
      parseInt(req.nextUrl.searchParams.get("limit") || "50") || 50,
    );

    const messages = await messageService.list({ channel, limit });
    await messageService.markRead(channel, String(sh._id));

    return successResponse(messages);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// POST /api/shareholders/messages
export async function POST(req: NextRequest) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    const { channel, content, replyTo } = (await req.json()) as {
      channel: string;
      content: string;
      replyTo?: string;
    };
    if (!content?.trim()) return errorResponse("Content required");

    const msg = await messageService.send({
      channel: (channel || "general") as MessageChannel,
      content,
      senderId: String(sh._id),
      senderName: sh.name,
      senderRole: sh.role,
      isAdminSender: false,
      replyTo: replyTo || null,
    });

    return successResponse(msg);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
