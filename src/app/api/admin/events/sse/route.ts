/**
 * GET /api/admin/events/sse
 *
 * Server-Sent Events stream cho admin dashboard.
 * Admin nhận real-time notifications khi có enquiry mới, v.v.
 *
 * Rooms: "admin"
 */

import { getCurrentUser } from "@/core/security/auth-utils";
import { addClient, removeClient } from "@/shared/utils/sse-broker";
import { unauthorizedResponse } from "@/utils/api-response";
import { randomUUID } from "crypto";

// Heartbeat được xử lý bởi global timer trong sse-broker.ts — không cần timer riêng ở đây.

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  const id = randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      const client = { id, controller };
      addClient("admin", client);

      // Send initial connection event
      const hello = new TextEncoder().encode(
        `event: connected\ndata: ${JSON.stringify({ clientId: id })}\n\n`
      );
      controller.enqueue(hello);

      // Cleanup when client disconnects — heartbeat handled globally
      const cleanup = () => {
        removeClient("admin", client);
        try { controller.close(); } catch { /* already closed */ }
      };

      // Store cleanup on controller for signal handler
      (controller as unknown as Record<string, unknown>)._cleanup = cleanup;
    },
    cancel(controller) {
      const c = controller as unknown as Record<string, unknown>;
      if (typeof c._cleanup === "function") (c._cleanup as () => void)();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
