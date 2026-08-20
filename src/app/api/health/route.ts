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
  const ts = new Date().toISOString();
  let dbStatus: "connected" | "disconnected" = "disconnected";
  let dbLatencyMs: number | null = null;

  try {
    const t0 = Date.now();
    const conn = await connectDB();
    if (conn) {
      dbStatus = "connected";
      dbLatencyMs = Date.now() - t0;
    }
  } catch {
    // DB unreachable — trả về 503
  }

  const ok = dbStatus === "connected";

  return Response.json(
    {
      status:    ok ? "ok" : "degraded",
      db:        dbStatus,
      dbLatency: dbLatencyMs !== null ? `${dbLatencyMs}ms` : null,
      uptime:    `${uptime}s`,
      timestamp: ts,
      version:   process.env.npm_package_version ?? "0.1.0",
    },
    { status: ok ? 200 : 503 },
  );
}
