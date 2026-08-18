/**
 * rate-limit.ts — In-process rate limiter with lockout support.
 *
 * Suitable for Next.js PM2 cluster: each worker tracks its own window.
 * This is sufficient for blocking burst attacks on a single worker.
 * For cross-worker accuracy, upgrade to a Redis-backed solution.
 *
 * Features:
 *   - Sliding-window counter per key
 *   - Progressive lockout: after maxLockouts the window doubles each time
 *   - Automatic stale-entry cleanup every 5 min
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  /** true when the key is currently locked out */
  locked: boolean;
}

interface RateRecord {
  count: number;
  resetAt: number;
  /** how many times the window limit was reached (for progressive lockout) */
  violations: number;
}

const store = new Map<string, RateRecord>();

// Auto-clean stale entries every 5 minutes to prevent memory growth
setInterval(
  () => {
    const now = Date.now();
    for (const [key, rec] of store) {
      if (now > rec.resetAt) store.delete(key);
    }
  },
  5 * 60 * 1000,
).unref();

/**
 * @param key       Unique key (e.g. `login:127.0.0.1`)
 * @param limit     Max requests per window (default: 5)
 * @param windowMs  Window size in ms (default: 60 000)
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const rec = store.get(key);

  // First request or window expired
  if (!rec || now > rec.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
      violations: rec?.violations ?? 0,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
      locked: false,
    };
  }

  // Within window and under limit
  if (rec.count < limit) {
    rec.count++;
    return {
      allowed: true,
      remaining: limit - rec.count,
      resetAt: rec.resetAt,
      locked: false,
    };
  }

  // Limit reached — record violation, apply progressive lockout window
  rec.violations++;
  // Each violation doubles the lockout window (capped at 24 h)
  const lockoutMs = Math.min(
    windowMs * Math.pow(2, rec.violations - 1),
    24 * 60 * 60 * 1000,
  );
  rec.resetAt = now + lockoutMs;

  return { allowed: false, remaining: 0, resetAt: rec.resetAt, locked: true };
}

/** Clear a rate-limit key (e.g. on successful login to reset failed attempts) */
export function clearRateLimit(key: string): void {
  store.delete(key);
}
