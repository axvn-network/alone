/**
 * src/services/llm.service.ts
 *
 * Claude (Anthropic) backed response generator.
 * Uses ANTHROPIC_API_KEY when available; falls back to a polite error in production.
 */

import { logger } from "@/lib/logger";

const CLAUDE_ENDPOINT = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-3-5-haiku-20241022";

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn của AXVN Tech Holding — một tập đoàn đầu tư công nghệ tập trung vào FinTech, tài sản mã hóa hợp pháp, AI và kinh tế số tại Việt Nam. Trả lời ngắn gọn, chính xác và chuyên nghiệp. Trích dẫn nội dung từ tài liệu nội bộ được cung cấp khi có liên quan. Không bịa đặt thông tin. Nếu không tìm thấy câu trả lời trong tài liệu, nói thẳng điều đó.`;

export async function generateResponse(context: string, query: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    logger.warn("ANTHROPIC_API_KEY is not configured.");
    return "Xin lỗi, tính năng AI tư vấn chưa được kích hoạt. Vui lòng liên hệ đội ngũ AXVN để được hỗ trợ.";
  }

  const userMessage = `Ngữ cảnh tài liệu:\n${context}\n\n---\nCâu hỏi: ${query}\n\nTrả lời:`;

  try {
    const res = await fetch(CLAUDE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      logger.error(`Claude API error ${res.status}: ${errText}`);
      return "Xin lỗi, hiện tại hệ thống AI đang bận. Vui lòng thử lại sau.";
    }

    const data = await res.json() as {
      content?: { type: string; text: string }[];
    };

    const text = data?.content?.find((b) => b.type === "text")?.text?.trim();
    if (!text) {
      logger.warn("Claude returned empty response");
      return "Không tìm thấy thông tin phù hợp với câu hỏi của bạn. Vui lòng liên hệ trực tiếp với đội ngũ AXVN.";
    }

    return text;
  } catch (error) {
    logger.error("Claude generation error:", error);
    return "Xin lỗi, hiện tại tôi không thể xử lý câu hỏi này. Vui lòng thử lại sau.";
  }
}
