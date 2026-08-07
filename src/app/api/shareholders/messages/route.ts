import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ShareholderMessage from "@/models/ShareholderMessage";
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

// GET /api/shareholders/messages?channel=general
export async function GET(req: NextRequest) {
  try {
    const sh = await getShareholderFromCookie();
    if (!sh) return unauthorizedResponse();
    const channel = req.nextUrl.searchParams.get("channel") || "general";
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
    const messages = await ShareholderMessage.find({ channel })
      .sort({ createdAt: -1 }).limit(limit).lean();
    await ShareholderMessage.updateMany(
      { channel, readBy: { $ne: sh._id } },
      { $addToSet: { readBy: sh._id } }
    );
    return successResponse(messages.reverse());
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}

// POST /api/shareholders/messages
export async function POST(req: NextRequest) {
  try {
    const sh = await getShareholderFromCookie();
    if (!sh) return unauthorizedResponse();
    const { channel, content, replyTo } = await req.json() as { channel: string; content: string; replyTo?: string };
    if (!content?.trim()) return serverErrorResponse("Content required");
    const msg = await ShareholderMessage.create({
      channel: channel || "general", sender: sh._id, senderName: sh.name,
      senderRole: sh.role, isAdminSender: false, content: content.trim(),
      replyTo: replyTo || null, readBy: [sh._id],
    });
    return successResponse(msg);
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}
