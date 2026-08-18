/**
 * src/modules/ai/service.ts
 *
 * Claude API client — single call, returns plain text.
 * The route at api/admin/ai/route.ts is kept as the HTTP adapter
 * (auth gate + JSON envelope) and delegates entirely to this service.
 */
import { SYSTEM_PROMPT, buildPrompt, type AiContext } from "./prompts";

const CLAUDE_MODEL = "claude-3-5-haiku-20241022";
const CLAUDE_URL = "https://api.anthropic.com/v1/messages";

export interface AiRequest {
  action: string;
  context?: AiContext;
}

export interface AiResult {
  text: string;
}

export class AiConfigError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY chưa được cấu hình. Vui lòng thêm vào .env.local");
    this.name = "AiConfigError";
  }
}

export class AiUpstreamError extends Error {
  constructor(
    public status: number,
    detail: string,
  ) {
    super(`Claude API lỗi: ${status} — ${detail}`);
    this.name = "AiUpstreamError";
  }
}

export async function runAiAction({
  action,
  context = {},
}: AiRequest): Promise<AiResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_anthropic_api_key_here")
    throw new AiConfigError();

  const userPrompt = buildPrompt(action, context);

  const res = await fetch(CLAUDE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) throw new AiUpstreamError(res.status, await res.text());

  const data = (await res.json()) as {
    content?: { type: string; text: string }[];
  };
  const text = data?.content?.find((b) => b.type === "text")?.text ?? "";
  return { text: text.trim() };
}
