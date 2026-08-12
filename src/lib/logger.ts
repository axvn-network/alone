/**
 * src/lib/logger.ts
 *
 * Lightweight structured logger with level control via env.LOG_LEVEL.
 * Usage: import { logger } from "@/lib/logger";
 *        logger.info("User logged in", { userId });
 */

import { env } from "./env";

type LogLevel = "debug" | "info" | "warn" | "error";

const shouldLog = (level: LogLevel) => {
  if (env.NODE_ENV === "production") {
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
