/**
 * Unit tests — sanitizeText input cleaner
 *
 * Chạy: npx vitest run src/__tests__/utils/sanitize.test.ts
 */

import { describe, it, expect } from "vitest";

// Inline logic for unit testing without Next.js dependencies
function sanitizeText(input: string, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/[<>"'`]/g, "")          // strip dangerous chars
    .replace(/javascript:/gi, "")     // strip js: protocol
    .replace(/on\w+\s*=/gi, "")       // strip event handlers
    .trim()
    .slice(0, maxLength);
}

describe("sanitizeText", () => {
  it("passes plain text unchanged", () => {
    expect(sanitizeText("Hello World")).toBe("Hello World");
  });

  it("strips HTML tags", () => {
    expect(sanitizeText("<script>alert(1)</script>")).toBe("alert(1)");
  });

  it("strips nested tags", () => {
    expect(sanitizeText("<b><i>text</i></b>")).toBe("text");
  });

  it("strips javascript: protocol", () => {
    expect(sanitizeText("javascript:alert(1)")).toBe("alert(1)");
  });

  it("strips inline event handlers", () => {
    expect(sanitizeText("onclick=doEvil()")).toBe("doEvil()");
    expect(sanitizeText("onload=x()")).toBe("x()");
  });

  it("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });

  it("respects maxLength", () => {
    const long = "a".repeat(200);
    expect(sanitizeText(long, 50).length).toBe(50);
  });

  it("returns empty string for non-string input", () => {
    // @ts-expect-error -- testing runtime safety: null input
    expect(sanitizeText(null)).toBe("");
    // @ts-expect-error -- testing runtime safety: undefined input
    expect(sanitizeText(undefined)).toBe("");
    // @ts-expect-error -- testing runtime safety: number input
    expect(sanitizeText(123)).toBe("");
  });

  it("preserves Vietnamese characters", () => {
    const vn = "Nguyễn Văn Hùng — Hà Nội";
    expect(sanitizeText(vn)).toBe(vn);
  });

  it("handles XSS vector with quotes", () => {
    expect(sanitizeText(`"><img src=x onerror=alert(1)>`)).not.toContain("<");
    expect(sanitizeText(`"><img src=x onerror=alert(1)>`)).not.toContain(">");
  });
});
