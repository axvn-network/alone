/**
 * GET /api/health
 *
 * Health check endpoint cho uptime monitoring (UptimeRobot, Pingdom, etc.)
 * và load balancer health probes.
 *
 * Trả về:
 *   200 { status: "ok", db: "connected", uptime: <seconds> }
 *   503 { status: "degraded", db: "disconnected", uptime: <seconds> }
 *
 * Không yêu cầu auth — endpoint public.
 * Không trả về thông tin nhạy cảm (no env, no version, no stack trace).
 */

import { connectDB } from "@/core/database";

export const dynamic = "force-dynamic"; // không cache health check

export async function GET() {
  const uptime = Math.floor(process.uptime());
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    const conn = await connectDB();
    if (conn) dbStatus = "connected";
  } catch {
    // DB unreachable — trả về 503
  }

  const status = dbStatus === "connected" ? "ok" : "degraded";
  const httpStatus = dbStatus === "connected" ? 200 : 503;

  return Response.json({ status, db: dbStatus, uptime }, { status: httpStatus });
}
