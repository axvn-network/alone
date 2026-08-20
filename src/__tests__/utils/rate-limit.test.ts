/**
 * Unit tests — In-process rate limiter
 *
 * Chạy: npx vitest run src/__tests__/utils/rate-limit.test.ts
 */

import { describe, it, expect, beforeEach } from "vitest";

// Inline pure rate-limit logic để test mà không phụ thuộc timer
interface RateRecord {
  count: number;
  resetAt: number;
  violations: number;
}

const store = new Map<string, RateRecord>();

function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
  _now = Date.now(),
): { allowed: boolean; remaining: number; resetAt: number; locked: boolean } {
  const rec = store.get(key);
  if (!rec || _now > rec.resetAt) {
    store.set(key, { count: 1, resetAt: _now + windowMs, violations: rec?.violations ?? 0 });
    return { allowed: true, remaining: limit - 1, resetAt: _now + windowMs, locked: false };
  }
  if (rec.count < limit) {
    rec.count++;
    return { allowed: true, remaining: limit - rec.count, resetAt: rec.resetAt, locked: false };
  }
  rec.violations++;
  const lockoutMs = Math.min(windowMs * Math.pow(2, rec.violations - 1), 24 * 60 * 60 * 1000);
  rec.resetAt = _now + lockoutMs;
  return { allowed: false, remaining: 0, resetAt: rec.resetAt, locked: true };
}

function clearRateLimit(key: string) { store.delete(key); }

// ─────────────────────────────────────────────────────────────────────────────

describe("rateLimit", () => {
  beforeEach(() => store.clear());

  it("allows first request", () => {
    const r = rateLimit("ip:1.2.3.4", 3, 60_000);
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(2);
  });

  it("allows up to limit requests", () => {
    for (let i = 0; i < 3; i++) rateLimit("ip:1.2.3.4", 3, 60_000);
    const r = rateLimit("ip:1.2.3.4", 3, 60_000);
    expect(r.allowed).toBe(false);
    expect(r.locked).toBe(true);
  });

  it("decrements remaining correctly", () => {
    const r1 = rateLimit("ip:2.2.2.2", 5, 60_000);
    const r2 = rateLimit("ip:2.2.2.2", 5, 60_000);
    expect(r1.remaining).toBe(4);
    expect(r2.remaining).toBe(3);
  });

  it("resets after window expires", () => {
    const now = Date.now();
    for (let i = 0; i < 5; i++) rateLimit("ip:3.3.3.3", 5, 60_000, now);
    const blocked = rateLimit("ip:3.3.3.3", 5, 60_000, now);
    expect(blocked.allowed).toBe(false);
    // After window expires
    const after = now + 70_000;
    const reset = rateLimit("ip:3.3.3.3", 5, 60_000, after);
    expect(reset.allowed).toBe(true);
  });

  it("applies progressive lockout doubling", () => {
    const now = Date.now();
    const windowMs = 10_000;
    for (let i = 0; i < 5; i++) rateLimit("ip:4.4.4.4", 5, windowMs, now);
    // 1st violation → lockout = windowMs * 2^0 = 10s
    const r1 = rateLimit("ip:4.4.4.4", 5, windowMs, now);
    expect(r1.resetAt - now).toBeCloseTo(windowMs, -2);
    // 2nd violation → lockout = windowMs * 2^1 = 20s
    const r2 = rateLimit("ip:4.4.4.4", 5, windowMs, now);
    expect(r2.resetAt - now).toBeCloseTo(windowMs * 2, -2);
  });

  it("isolates keys independently", () => {
    for (let i = 0; i < 5; i++) rateLimit("ip:5.5.5.5", 5, 60_000);
    const blocked = rateLimit("ip:5.5.5.5", 5, 60_000);
    const other = rateLimit("ip:6.6.6.6", 5, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(other.allowed).toBe(true);
  });

  it("clearRateLimit resets the key", () => {
    for (let i = 0; i < 5; i++) rateLimit("ip:7.7.7.7", 5, 60_000);
    clearRateLimit("ip:7.7.7.7");
    const r = rateLimit("ip:7.7.7.7", 5, 60_000);
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(4);
  });
});
