/**
 * src/utils/sanitize.ts — Input sanitization helpers.
 *
 * Strips dangerous HTML/script patterns from user-supplied strings
 * before they are stored in the database or sent in emails.
 *
 * This is a defence-in-depth measure on top of Zod validation.
 * It does NOT replace output encoding when rendering in templates.
 */

/** Characters/patterns that indicate injection attempts */
const SCRIPT_PATTERN =
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const NULL_BYTE_PATTERN = /\0/g;
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Strip all HTML tags and dangerous characters from a string.
 * Use for text fields that should never contain markup.
 */
export function stripHtml(value: string): string {
  if (typeof value !== "string") return "";
  return value
    .replace(SCRIPT_PATTERN, "")
    .replace(HTML_TAG_PATTERN, "")
    .replace(NULL_BYTE_PATTERN, "")
    .replace(CONTROL_CHAR_PATTERN, "")
    .trim();
}

/**
 * Sanitize a plain-text field: strip HTML + collapse whitespace.
 * Suitable for: name, company, subject, phone.
 */
export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").slice(0, 2000);
}

/**
 * Sanitize a longer message field: strip script tags but allow newlines.
 * Suitable for: message body, description.
 */
export function sanitizeMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(SCRIPT_PATTERN, "")
    .replace(NULL_BYTE_PATTERN, "")
    .replace(CONTROL_CHAR_PATTERN, "")
    .trim()
    .slice(0, 10_000);
}

/**
 * Sanitize an email: lowercase + strip everything except valid email chars.
 */
export function sanitizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._%+\-@]/g, "")
    .slice(0, 254);
}

/**
 * Recursively sanitize all string values in a plain object.
 * Used as a last-resort sweep before database writes.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const val = result[key];
    if (typeof val === "string") {
      (result as Record<string, unknown>)[key] = stripHtml(val);
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        val as Record<string, unknown>
      );
    }
  }
  return result;
}
