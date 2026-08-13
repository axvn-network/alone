import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

const CLAUDE_MODEL = "claude-3-5-haiku-20241022";
const CLAUDE_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên biệt cho AXVN Tech Holding — tập đoàn đầu tư công nghệ tập trung vào FinTech, tài sản mã hóa hợp pháp (theo NQ 5/2025/NQ-CP hiệu lực 9/9/2025), AI, EdTech và kinh tế số tại Việt Nam.

Quy tắc bắt buộc:
- Viết nội dung chuyên nghiệp, súc tích, phù hợp với thương hiệu cao cấp
- Ưu tiên ngôn ngữ người dùng yêu cầu (Tiếng Việt hoặc English)
- KHÔNG thêm giải thích, ghi chú hay lời dẫn — chỉ trả về nội dung được yêu cầu
- Tối ưu cho SEO khi tạo tiêu đề hoặc meta description
- Giọng văn: tự tin, am hiểu chuyên môn, đáng tin cậy`;

export async function POST(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    return errorResponse("ANTHROPIC_API_KEY chưa được cấu hình. Vui lòng thêm vào .env.local", 503);
  }

  try {
    const body = await request.json();
    const { action, context } = body as { action: string; context: Record<string, string> };

    if (!action) return errorResponse("action is required");

    const userPrompt = buildPrompt(action, context || {});

    const claudeRes = await fetch(CLAUDE_URL, {
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

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      logger.error(`Claude API error ${claudeRes.status}`, err);
      return errorResponse(`Claude API lỗi: ${claudeRes.status}`, claudeRes.status);
    }

    const data = await claudeRes.json() as {
      content?: { type: string; text: string }[];
    };
    const text = data?.content?.find((b) => b.type === "text")?.text ?? "";

    return successResponse({ text: text.trim() });
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

function buildPrompt(action: string, ctx: Record<string, string>): string {
  const lang = ctx.lang === "en" ? "English" : "Tiếng Việt";

  switch (action) {
    /* ── Blog / Article ────────────────────────────────────────── */
    case "blog_title":
      return `Tạo 3 tiêu đề bài viết chuyên nghiệp bằng ${lang} về chủ đề: "${ctx.topic || ctx.content_preview}".
Mỗi tiêu đề trên một dòng, không đánh số, tối đa 70 ký tự.`;

    case "blog_excerpt":
      return `Viết đoạn tóm tắt (excerpt) 1–2 câu bằng ${lang} cho bài viết:
Tiêu đề: ${ctx.title}
${ctx.content_preview ? `Nội dung sơ lược: ${ctx.content_preview.slice(0, 300)}` : ""}
Yêu cầu: súc tích, hấp dẫn, khoảng 150–200 ký tự, tối ưu SEO.`;

    case "blog_content":
      return `Viết nội dung bài viết đầy đủ bằng ${lang} với định dạng HTML (dùng <h2>, <h3>, <p>, <ul>, <li>, <strong>).
Tiêu đề: ${ctx.title}
Danh mục: ${ctx.category || "Đầu tư & Công nghệ"}
${ctx.excerpt ? `Tóm tắt: ${ctx.excerpt}` : ""}
Yêu cầu: 400–600 từ, chuyên nghiệp, có cấu trúc rõ ràng, liên quan đến lĩnh vực đầu tư tài chính số.`;

    case "blog_improve":
      return `Cải thiện đoạn văn sau cho chuyên nghiệp hơn, bằng ${lang}. Giữ nguyên ý chính, chỉ trả về văn bản đã cải thiện:
"${ctx.selected_text}"`;

    case "blog_continue":
      return `Tiếp tục viết đoạn tiếp theo (2–3 đoạn, bằng ${lang}, định dạng HTML <p>) phù hợp với ngữ cảnh sau:
Tiêu đề bài: ${ctx.title}
Nội dung hiện tại kết thúc bằng: "...${ctx.content_preview?.slice(-200)}"`;

    case "blog_seo_title":
      return `Tạo SEO title tối ưu (tối đa 60 ký tự) bằng ${lang} cho:
Tiêu đề bài: ${ctx.title}
Danh mục: ${ctx.category || ""}
Chỉ trả về một chuỗi duy nhất.`;

    case "blog_seo_desc":
      return `Viết meta description tối ưu SEO (150–160 ký tự) bằng ${lang} cho:
Tiêu đề: ${ctx.title}
Tóm tắt: ${ctx.excerpt || ""}
Chỉ trả về một đoạn văn duy nhất.`;

    case "blog_tags":
      return `Gợi ý 5–8 tags phù hợp cho bài viết, bằng ${lang}.
Tiêu đề: ${ctx.title}
Danh mục: ${ctx.category || ""}
Trả về dưới dạng danh sách phân cách bởi dấu phẩy, không có dấu #.`;

    case "blog_readtime":
      return `Ước tính thời gian đọc cho bài viết có ${ctx.word_count || "500"} từ.
Trả về định dạng như "5 min read" hoặc "3 phút đọc" (theo ${lang}). Chỉ một chuỗi duy nhất.`;

    /* ── Document ───────────────────────────────────────────────── */
    case "doc_title_vi":
      return `Tạo tiêu đề tài liệu tài chính chuyên nghiệp bằng Tiếng Việt cho:
Danh mục: ${ctx.category}
${ctx.hint ? `Gợi ý: ${ctx.hint}` : ""}
Trả về 3 gợi ý tiêu đề, mỗi cái trên một dòng.`;

    case "doc_title_en":
      return `Translate and create a professional English document title for:
Vietnamese title: "${ctx.title_vi}"
Category: ${ctx.category}
Return one clean English title only.`;

    /* ── Content / Page ─────────────────────────────────────────── */
    case "page_title":
      return `Tạo tiêu đề trang web chuyên nghiệp bằng ${lang} cho trang: ${ctx.page_name}
Ngữ cảnh thương hiệu: AXVN Tech Holding — FinTech, tài sản mã hóa, AI, EdTech.
Trả về 1 tiêu đề duy nhất, tối đa 60 ký tự.`;

    case "page_content":
      return `Viết nội dung HTML chuyên nghiệp bằng ${lang} cho trang: ${ctx.page_name}
Dùng <h2>, <p>, <ul>, <li>. Khoảng 200–400 từ.
Ngữ cảnh: ${ctx.existing_title || "AXVN Tech Holding"}.`;

    case "page_improve":
      return `Cải thiện nội dung sau cho trang web chuyên nghiệp hơn, bằng ${lang}. Định dạng HTML. Giữ nguyên cấu trúc:
${ctx.content?.slice(0, 800)}`;

    /* ── General / Translate ────────────────────────────────────── */
    case "translate_vi_en":
      return `Dịch sang tiếng Anh chuyên nghiệp, giữ nguyên định dạng HTML nếu có:
"${ctx.text}"`;

    case "translate_en_vi":
      return `Dịch sang tiếng Việt chuyên nghiệp, giữ nguyên định dạng HTML nếu có:
"${ctx.text}"`;

    case "summarize":
      return `Tóm tắt nội dung sau thành 2–3 câu bằng ${lang}:
"${ctx.text?.slice(0, 1000)}"`;

    default:
      return ctx.custom_prompt || action;
  }
}
