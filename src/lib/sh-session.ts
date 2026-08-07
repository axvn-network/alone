import { createHmac, randomBytes } from "crypto";

const COOKIE = "sh_session";
const MAX_AGE = 8 * 60 * 60; // 8h
const SECRET = () => process.env.SESSION_SECRET || "dev-fallback-secret-at-least-32-chars!";

export { COOKIE as SH_COOKIE };

export function makeShareholderToken(id: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ id, email, exp, nonce: randomBytes(8).toString("hex") })).toString("base64url");
  const sig = createHmac("sha256", SECRET()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function parseShareholderToken(raw: string): { id: string; email: string } | null {
  try {
    const dot = raw.lastIndexOf(".");
    if (dot === -1) return null;
    const payload = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);
    const expected = createHmac("sha256", SECRET()).update(payload).digest("hex");
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.exp || Date.now() / 1000 > data.exp) return null;
    return { id: data.id, email: data.email };
  } catch { return null; }
}
