import { NextResponse } from "next/server";
import { generateCsrfToken, CSRF_COOKIE_NAME } from "@/lib/csrf";

/**
 * GET /api/csrf
 *
 * Issues a new CSRF token.
 * - Sets a csrf_token cookie (httpOnly: false so JS can read it for double-submit)
 * - Returns the token in the JSON body
 *
 * The admin frontend should call this once on mount and store the token,
 * then include it as x-csrf-token header on all mutating requests.
 */
export async function GET() {
  const token = generateCsrfToken();

  const response = NextResponse.json({ token });

  // NOT httpOnly — the client JS needs to read this value to set the header
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours — matches token TTL
  });

  return response;
}
