import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { getActiveShareholder } from "@/modules/auth/sh-auth";
import { taskService } from "@/modules/shareholders";

// GET /api/shareholders/tasks
export async function GET() {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();
    const tasks = await taskService.listForShareholder(String(sh._id), sh.role);
    return successResponse(tasks);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// PATCH /api/shareholders/tasks — mark task in_progress or done
export async function PATCH(req: NextRequest) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    const { taskId, status } = (await req.json()) as {
      taskId: string;
      status: string;
    };
    if (!taskId || !["in_progress", "done"].includes(status)) {
      return errorResponse("Invalid payload");
    }

    if (status === "done") {
      const task = await taskService.markDone(taskId, String(sh._id), sh.role);
      return successResponse(task);
    }

    const task = await taskService.update(taskId, { status: "in_progress" });
    return successResponse(task);
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
