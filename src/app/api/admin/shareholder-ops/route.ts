import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  taskService,
  meetingService,
  messageService,
} from "@/modules/shareholders";
import { broadcast } from "@/shared/utils/sse-broker";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import type { MessageChannel } from "@/modules/shareholders";

// GET /api/admin/shareholder-ops?type=tasks|meetings|messages&channel=general
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const type = req.nextUrl.searchParams.get("type") || "tasks";
    const channel = (req.nextUrl.searchParams.get("channel") ||
      "general") as MessageChannel;

    if (type === "tasks") {
      const { tasks } = await taskService.list();
      return successResponse(tasks);
    }
    if (type === "meetings") {
      const data = await meetingService.list();
      return successResponse(data);
    }
    if (type === "messages") {
      const msgs = await messageService.list({ channel, limit: 100 });
      return successResponse(msgs);
    }
    return errorResponse("Unknown type");
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// POST /api/admin/shareholder-ops — create task | meeting | admin message
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { type, ...body } = await req.json();

    if (type === "task") {
      const doc = await taskService.create(body);
      return successResponse(doc);
    }
    if (type === "meeting") {
      const doc = await meetingService.create(body);
      return successResponse(doc);
    }
    if (type === "message") {
      const { channel, content } = body as { channel: string; content: string };
      const msg = await messageService.send({
        channel: (channel || "general") as MessageChannel,
        content,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        isAdminSender: true,
      });
      broadcast("admin", "shareholder_message", {
        channel,
        senderName: user.name,
      });
      return successResponse(msg);
    }
    return errorResponse("Unknown type");
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// PUT /api/admin/shareholder-ops — update task or meeting
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { type, _id, ...body } = await req.json();
    if (!_id) return errorResponse("_id required");

    if (type === "task") {
      const doc = await taskService.update(_id, body);
      return successResponse(doc);
    }
    if (type === "meeting") {
      const doc = await meetingService.update(_id, body);
      return successResponse(doc);
    }
    return errorResponse("Unknown type");
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// DELETE /api/admin/shareholder-ops?type=task|meeting&id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const type = req.nextUrl.searchParams.get("type");
    const id   = req.nextUrl.searchParams.get("id");
    if (!id) return errorResponse("id is required");

    if (type === "task") {
      await taskService.remove(id);
      return successResponse({ ok: true }, "Task deleted");
    }
    if (type === "meeting") {
      await meetingService.remove(id);
      return successResponse({ ok: true }, "Meeting deleted");
    }
    return errorResponse("type must be task or meeting");
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
