/**
 * src/shared/utils/logger.ts
 *
 * Lightweight structured logger with level control via env.LOG_LEVEL.
 *
 * Usage:
 *   import { logger } from "@/shared/utils/logger";
 *   logger.info("User logged in", { userId, ip });
 *   logger.error("DB connection failed", error);
 *
 * Log levels (in order): debug < info < warn < error
 * Only messages at or above LOG_LEVEL are emitted.
 * Production default: "info" (debug suppressed).
 *
 * Output format:
 *   [LEVEL] message  { ...meta }
 *
 * Note: console.log is stripped from production bundles by next.config.ts
 * compiler.removeConsole — only console.error and console.warn survive.
 * This logger uses console.info / console.warn / console.error directly,
 * so warn + error always reach PM2 logs; info/debug only in development.
 */

import { env } from "@/core/env";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info:  1,
  warn:  2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  const configured = (env.LOG_LEVEL ?? "info") as LogLevel;
  return LEVEL_RANK[level] >= LEVEL_RANK[configured];
}

function fmt(level: string, message: string, _meta: unknown[]): string {
  const ts = new Date().toISOString();
  return `[${ts}] [${level}] ${message}`;
}

export const logger = {
  debug(message: string, ...meta: unknown[]): void {
    if (shouldLog("debug")) console.debug(fmt("DEBUG", message, meta), ...meta);
  },
  info(message: string, ...meta: unknown[]): void {
    if (shouldLog("info")) console.info(fmt("INFO", message, meta), ...meta);
  },
  warn(message: string, ...meta: unknown[]): void {
    if (shouldLog("warn")) console.warn(fmt("WARN", message, meta), ...meta);
  },
  error(message: string, ...meta: unknown[]): void {
    // Always emit errors regardless of LOG_LEVEL — errors must never be silenced
    console.error(fmt("ERROR", message, meta), ...meta);
  },
};
