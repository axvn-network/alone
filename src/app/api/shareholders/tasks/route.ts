import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ShareholderTask from "@/models/ShareholderTask";
import Shareholder from "@/models/Shareholder";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { cookies } from "next/headers";
import { parseShareholderToken, SH_COOKIE } from "@/lib/sh-session";

async function getShareholderFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SH_COOKIE)?.value;
  if (!raw) return null;
  const parsed = parseShareholderToken(raw);
  if (!parsed) return null;
  await connectDB();
  const sh = await Shareholder.findById(parsed.id).lean();
  if (!sh || sh.status !== "active") return null;
  return sh;
}

// GET /api/shareholders/tasks
export async function GET() {
  try {
    const sh = await getShareholderFromCookie();
    if (!sh) return unauthorizedResponse();
    const tasks = await ShareholderTask.find({
      $or: [
        { assignedTo: sh._id },
        { assignedRoles: sh.role },
        { assignedRoles: [] },
      ],
    }).sort({ order: 1, createdAt: 1 }).lean();
    return successResponse(tasks);
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}

// PATCH /api/shareholders/tasks — mark task done/in_progress
export async function PATCH(req: NextRequest) {
  try {
    const sh = await getShareholderFromCookie();
    if (!sh) return unauthorizedResponse();
    const { taskId, status } = await req.json() as { taskId: string; status: string };
    if (!taskId || !["in_progress", "done"].includes(status)) return serverErrorResponse("Invalid payload");
    const update: Record<string, unknown> = { status };
    if (status === "done") { update.completedAt = new Date(); update.completedBy = sh._id; }
    const task = await ShareholderTask.findOneAndUpdate(
      { _id: taskId, $or: [{ assignedTo: sh._id }, { assignedRoles: sh.role }] },
      update, { new: true }
    );
    if (!task) return serverErrorResponse("Task not found or access denied");
    return successResponse(task);
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}
