import { connectDB } from "@/lib/db";
import ShareholderMeeting from "@/models/ShareholderMeeting";
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

// GET /api/shareholders/meetings
export async function GET() {
  try {
    const sh = await getShareholderFromCookie();
    if (!sh) return unauthorizedResponse();
    const meetings = await ShareholderMeeting.find({
      $or: [
        { invitedRoles: sh.role },
        { invitedRoles: [] },
        { attendees: sh._id },
      ],
    }).sort({ scheduledAt: -1 }).lean();
    return successResponse(meetings);
  } catch (e) { return serverErrorResponse(e instanceof Error ? e.message : "Error"); }
}
