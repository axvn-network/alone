/**
 * GET /api/shareholders/messages/sse
 *
 * SSE stream cho shareholder message channels.
 * Mỗi cổ đông subscribe vào room "sh-messages-{channel}".
 *
 * Query: ?channel=general (default)
 */

import { NextRequest } from "next/server";
import { addClient, removeClient } from "@/shared/utils/sse-broker";
import { getActiveShareholder } from "@/modules/auth/sh-auth";
import { randomUUID } from "crypto";

// Heartbeat được xử lý bởi global timer trong sse-broker.ts — không cần timer riêng ở đây.

export async function GET(req: NextRequest) {
  const sh = await getActiveShareholder();
  if (!sh) {
    return new Response("Unauthorized", { status: 401 });
  }

  const channel = req.nextUrl.searchParams.get("channel") || "general";
  const room    = `sh-messages-${channel}`;
  const id      = randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      const client = { id, controller };
      addClient(room, client);

      const hello = new TextEncoder().encode(
        `event: connected\ndata: ${JSON.stringify({ clientId: id, channel })}\n\n`
      );
      controller.enqueue(hello);

      // Cleanup when client disconnects — heartbeat handled globally
      const cleanup = () => {
        removeClient(room, client);
        try { controller.close(); } catch { /* already closed */ }
      };
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
