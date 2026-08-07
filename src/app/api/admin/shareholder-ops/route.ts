import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ShareholderTask from "@/models/ShareholderTask";
import ShareholderMeeting from "@/models/ShareholderMeeting";
import ShareholderMessage from "@/models/ShareholderMessage";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/utils/api-response";
import { getCurrentUser } from "@/lib/auth-utils";

// GET /api/admin/shareholder-ops?type=tasks|meetings|messages
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    await connectDB();
    const type = req.nextUrl.searchParams.get("type") || "tasks";
    if (type === "tasks") {
      const data = await ShareholderTask.find().sort({ order: 1, createdAt: 1 }).lean();
      return successResponse(data);
    }
    if (type === "meetings") {
      const data = await ShareholderMeeting.find().sort({ scheduledAt: -1 }).lean();
      return successResponse(data);
    }
    if (type === "messages") {
      const channel = req.nextUrl.searchParams.get("channel") || "general";
      const data = await ShareholderMessage.find({ channel }).sort({ createdAt: -1 }).limit(100).lean();
      return successResponse(data.reverse());
    }
    return serverErrorResponse("Unknown type");
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}

// POST /api/admin/shareholder-ops — create task | meeting | admin message
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    await connectDB();
    const { type, ...body } = await req.json();
    if (type === "task") {
      const doc = await ShareholderTask.create(body);
      return successResponse(doc);
    }
    if (type === "meeting") {
      const doc = await ShareholderMeeting.create(body);
      return successResponse(doc);
    }
    if (type === "message") {
      const doc = await ShareholderMessage.create({ ...body, isAdminSender: true, senderName: user.name, senderRole: "admin" });
      return successResponse(doc);
    }
    return serverErrorResponse("Unknown type");
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}

// PUT /api/admin/shareholder-ops — update task or meeting
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    await connectDB();
    const { type, _id, ...body } = await req.json();
    if (type === "task") {
      const doc = await ShareholderTask.findByIdAndUpdate(_id, body, { new: true });
      return successResponse(doc);
    }
    if (type === "meeting") {
      const doc = await ShareholderMeeting.findByIdAndUpdate(_id, body, { new: true });
      return successResponse(doc);
    }
    return serverErrorResponse("Unknown type");
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}

// DELETE /api/admin/shareholder-ops?type=task|meeting&id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();
    await connectDB();
    const type = req.nextUrl.searchParams.get("type");
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return serverErrorResponse("ID required");
    if (type === "task") await ShareholderTask.findByIdAndDelete(id);
    else if (type === "meeting") await ShareholderMeeting.findByIdAndDelete(id);
    return successResponse({ ok: true });
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}
