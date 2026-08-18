/**
 * src/lib/sse-broker.ts
 *
 * In-process Server-Sent Events broker — suitable for PM2 fork mode (single process).
 * Each client holds a ReadableStream controller; the broker pushes events via broadcast().
 *
 * Heartbeat: a single global timer fires for all rooms rather than one timer per connection,
 * preventing O(N) timer overhead when many SSE clients are connected simultaneously.
 *
 * Scale-out: replace with a Redis pub/sub adapter when running in PM2 cluster mode.
 */

export interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

// ─── Room registry ────────────────────────────────────────────────────────────

const rooms = new Map<string, Set<SSEClient>>();

function getRoom(room: string): Set<SSEClient> {
  if (!rooms.has(room)) rooms.set(room, new Set());
  return rooms.get(room)!;
}

// ─── Global heartbeat (one timer for the entire broker) ───────────────────────

const HEARTBEAT_INTERVAL_MS = 25_000; // 25 s — keeps proxies from timing out

const _heartbeatTimer = setInterval(() => {
  const ping = new TextEncoder().encode(": ping\n\n");
  for (const clients of rooms.values()) {
    for (const client of clients) {
      try {
        client.controller.enqueue(ping);
      } catch {
        clients.delete(client);
      }
    }
  }
}, HEARTBEAT_INTERVAL_MS).unref(); // .unref() — does not prevent the process from exiting

// Exported so tests can cancel the timer
export { _heartbeatTimer };

// ─── Public API ───────────────────────────────────────────────────────────────

/** Register a new SSE client in the given room. */
export function addClient(room: string, client: SSEClient): void {
  getRoom(room).add(client);
}

/** Remove an SSE client from its room, and clean up the room if it becomes empty. */
export function removeClient(room: string, client: SSEClient): void {
  getRoom(room).delete(client);
  if (rooms.get(room)?.size === 0) rooms.delete(room);
}

/**
 * Broadcast an SSE event to every client in a room.
 * Silently drops disconnected clients.
 */
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

/**
 * Return the number of connected clients.
 * @param room  When provided, counts only that room. Omit for the global total.
 */
export function clientCount(room?: string): number {
  if (room) return rooms.get(room)?.size ?? 0;
  let total = 0;
  for (const s of rooms.values()) total += s.size;
  return total;
}
