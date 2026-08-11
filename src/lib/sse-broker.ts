/**
 * src/lib/sse-broker.ts
 *
 * In-process SSE broker — đủ dùng cho single-process (PM2 fork mode).
 * Mỗi client giữ một ReadableStream controller; broker push event bằng send().
 *
 * Heartbeat: dùng MỘT global timer duy nhất thay vì 1 timer/connection.
 * Điều này tránh N timers × N clients khi có nhiều SSE connections.
 *
 * Nếu scale ngang (cluster), thay bằng Redis pub/sub adapter.
 */

export interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

// ─── Namespaced client maps ───────────────────────────────────────────────────

const rooms = new Map<string, Set<SSEClient>>();

function getRoom(room: string): Set<SSEClient> {
  if (!rooms.has(room)) rooms.set(room, new Set());
  return rooms.get(room)!;
}

// ─── Global heartbeat timer (1 timer cho toàn bộ broker) ─────────────────────

const HEARTBEAT_INTERVAL = 25_000; // 25 s

const _heartbeatTimer = setInterval(() => {
  const ping = new TextEncoder().encode(": ping\n\n");
  for (const clients of rooms.values()) {
    for (const client of clients) {
      try { client.controller.enqueue(ping); } catch { clients.delete(client); }
    }
  }
}, HEARTBEAT_INTERVAL).unref(); // .unref() — không giữ process sống khi không có client

// Exported để test có thể stop timer
export { _heartbeatTimer };

// ─── Public API ───────────────────────────────────────────────────────────────

export function addClient(room: string, client: SSEClient): void {
  getRoom(room).add(client);
}

export function removeClient(room: string, client: SSEClient): void {
  getRoom(room).delete(client);
  if (rooms.get(room)?.size === 0) rooms.delete(room);
}

export function broadcast(room: string, event: string, data: unknown): void {
  const clients = rooms.get(room);
  if (!clients?.size) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(payload);
  for (const client of clients) {
    try {
      client.controller.enqueue(encoded);
    } catch {
      clients.delete(client);
    }
  }
}

export function clientCount(room?: string): number {
  if (room) return rooms.get(room)?.size ?? 0;
  let total = 0;
  for (const s of rooms.values()) total += s.size;
  return total;
}
