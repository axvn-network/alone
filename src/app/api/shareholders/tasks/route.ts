import { NextRequest } from "next/server";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { getActiveShareholder } from "@/lib/sh-auth";
import { shareholderOpsService } from "@/services";

const { taskService } = shareholderOpsService;

// GET /api/shareholders/tasks
export async function GET() {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();
    const tasks = await taskService.listForShareholder(String(sh._id), sh.role);
    return successResponse(tasks);
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}

// PATCH /api/shareholders/tasks — mark task in_progress or done
export async function PATCH(req: NextRequest) {
  try {
    const sh = await getActiveShareholder();
    if (!sh) return unauthorizedResponse();

    const { taskId, status } = await req.json() as { taskId: string; status: string };
    if (!taskId || !["in_progress", "done"].includes(status)) {
      return serverErrorResponse("Invalid payload");
    }

    if (status === "done") {
      const task = await taskService.markDone(taskId, String(sh._id), sh.role);
      return successResponse(task);
    }

    // in_progress
    const task = await taskService.update(taskId, { status: "in_progress" });
    return successResponse(task);
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}
