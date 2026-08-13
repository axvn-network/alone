/**
 * src/services/llm.service.ts
 *
 * Gemini-backed response generator.
 * Uses GEMINI_API_KEY when available; falls back to a mock response in development.
 */

import { logger } from "@/lib/logger";

export interface LLMResponse {
  answer: string;
  source?: string;
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn của AXVN Tech Holding — một tập đoàn đầu tư công nghệ tập trung vào FinTech, tài sản mã hóa hợp pháp, AI và kinh tế số tại Việt Nam. Trả lời ngắn gọn, chính xác và chuyên nghiệp. Trích dẫn nội dung từ tài liệu nội bộ được cung cấp khi có liên quan. Không bịa đặt thông tin. Nếu không tìm thấy câu trả lời trong tài liệu, nói thẳng điều đó.`;

export async function generateResponse(context: string, query: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY is not configured. Falling back to mock response.");
    return `Xin chào! Đây là phản hồi thử nghiệm. Để kích hoạt AI thực tế, hãy cấu hình GEMINI_API_KEY trong file .env.local.\n\nNgữ cảnh: "${context.substring(0, 100)}..."`;
  }

  const prompt = `${SYSTEM_PROMPT}\n\n---\nNgữ cảnh tài liệu:\n${context}\n---\n\nCâu hỏi: ${query}\n\nTrả lời:`;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 512,
          topP: 0.8,
          topK: 40,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      logger.error(`Gemini API error ${res.status}: ${errText}`);
      return "Xin lỗi, hiện tại hệ thống AI đang bận. Vui lòng thử lại sau.";
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      logger.warn("Gemini returned empty response");
      return "Không tìm thấy thông tin phù hợp với câu hỏi của bạn. Vui lòng liên hệ trực tiếp với đội ngũ AXVN.";
    }

    return text;
  } catch (error) {
    logger.error("Gemini generation error:", error);
    return "Xin lỗi, hiện tại tôi không thể xử lý câu hỏi này. Vui lòng thử lại sau.";
  }
}
