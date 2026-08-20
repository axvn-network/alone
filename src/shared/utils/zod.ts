/**
 * src/shared/utils/zod.ts
 *
 * Shared Zod utility helpers.
 * Kept here so that modules can use formatZodErrors without cross-module imports.
 */

import { z } from "zod";

/**
 * Converts a ZodError into a flat `{ field: string[] }` map
 * compatible with the ApiResponse `errors` field.
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!formatted[path]) formatted[path] = [];
    formatted[path].push(issue.message);
  }
  return formatted;
}
