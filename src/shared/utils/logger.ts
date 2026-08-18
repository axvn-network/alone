/**
 * src/lib/logger.ts
 *
 * Lightweight structured logger with level control via env.LOG_LEVEL.
 * Usage: import { logger } from "@/shared/utils/logger";
 *        logger.info("User logged in", { userId });
 */

import { env } from "@/core/env";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const shouldLog = (level: LogLevel) => {
  const configured = env.LOG_LEVEL as LogLevel;
  if (LEVEL_RANK[level] >= LEVEL_RANK[configured]) return true;
  // Always suppress debug in production unless explicitly set
  if (env.NODE_ENV === "production" && configured === "info") {
    return level !== "debug";
  }
  return true;
};

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog("debug")) console.debug(`[DEBUG] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (shouldLog("info")) console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog("warn")) console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    if (shouldLog("error")) console.error(`[ERROR] ${message}`, ...args);
  },
};
