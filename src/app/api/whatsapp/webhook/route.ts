import { NextRequest, NextResponse } from "next/server";

/**
 * WhatsApp Business Cloud API — Webhook
 *
 * Tích hợp từ nurmandev/whatsapp-bot (Diploy pattern):
 *  - Webhook verification (GET)
 *  - Auto-reply với interactive list/button menus
 *  - State tracking per sender (in-memory, stateless across restarts)
 *  - Hỗ trợ text + button_reply + list_reply
 *
 * Setup:
 *  1. WHATSAPP_VERIFY_TOKEN, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID trong .env.local
 *  2. Đăng ký webhook: https://<domain>/api/whatsapp/webhook
 *  3. Subscribe events: messages
 */

const VERIFY_TOKEN   = process.env.WHATSAPP_VERIFY_TOKEN   || "fortress_webhook_2025";
const ACCESS_TOKEN   = process.env.WHATSAPP_ACCESS_TOKEN   || "";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const WA_API_VERSION  = process.env.WHATSAPP_API_VERSION    || "v20.0";
const SITE_URL        = process.env.NEXT_PUBLIC_SITE_URL    || "https://fortressih.com";

// ── In-memory conversation state (resets on server restart — acceptable for webhook bot) ──
type ConvState = {
  step: "menu" | "plans" | "plan_detail" | "contact" | "nq5";
  lastPlan?: string;
  ts: number;
};
const convState = new Map<string, ConvState>();

function getState(from: string): ConvState {
  const s = convState.get(from);
  // Expire after 30 minutes of inactivity
  if (!s || Date.now() - s.ts > 30 * 60 * 1000) {
    return { step: "menu", ts: Date.now() };
  }
  return { ...s, ts: Date.now() };
}
function setState(from: string, update: Partial<ConvState>) {
  const cur = getState(from);
  convState.set(from, { ...cur, ...update, ts: Date.now() });
}

// ── GET: Webhook Verification ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WA Webhook] Verified ✅");
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ── POST: Incoming messages ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const entry  = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value  = change?.value;

    // Ignore non-message events (status updates, etc.)
    if (!value?.messages?.length) {
      return NextResponse.json({ status: "no_message" });
    }

    const msg     = value.messages[0];
    const from    = msg.from as string;
    const msgType = msg.type as string;

    // Parse incoming text or button/list interaction
    let incomingText = "";
    let interactiveId = "";

    if (msgType === "text") {
      incomingText = (msg.text?.body as string || "").toLowerCase().trim();
    } else if (msgType === "interactive") {
      interactiveId =
        msg.interactive?.button_reply?.id ||
        msg.interactive?.list_reply?.id   ||
        "";
      incomingText = interactiveId.toLowerCase();
    }

    const state = getState(from);
    const response = await buildResponse(from, state, incomingText, interactiveId);

    if (response && ACCESS_TOKEN && PHONE_NUMBER_ID) {
      await sendWAMessage(from, response);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[WA Webhook] Error:", err);
    return NextResponse.json({ status: "error" }, { status: 200 }); // always 200 to WA
  }
}

// ── Build response based on state + incoming text ─────────────────────────

type WAMessage =
  | { type: "text";        text: { body: string; preview_url?: boolean } }
  | { type: "interactive"; interactive: InteractiveMenu };

interface InteractiveMenu {
  type: "button" | "list";
  body: { text: string };
  footer?: { text: string };
  action: {
    // for "button"
    buttons?: Array<{ type: "reply"; reply: { id: string; title: string } }>;
    // for "list"
    button?: string;
    sections?: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>;
  };
}

async function buildResponse(
  from: string,
  state: ConvState,
  text: string,
  id: string
): Promise<WAMessage | null> {
  // ── Greeting / reset ──────────────────────────────────────────────────────
  if (/^(xin chào|hello|hi|chào|hey|start|bắt đầu|menu|back|quay lại|restart)/.test(text) || !text) {
    setState(from, { step: "menu" });
    return buildMainMenu();
  }

  // ── Interactive button/list IDs ────────────────────────────────────────────
  if (id === "btn_plans" || /(gói|plan|đầu tư|hợp tác|invest|cổ đông)/.test(text)) {
    setState(from, { step: "plans" });
    return buildPlansMenu();
  }

  if (id === "btn_nq5" || /(nq5|nghị quyết|nq-cp|2025|cấp phép|pilot|thí điểm)/.test(text)) {
    setState(from, { step: "nq5" });
    return buildNQ5Message();
  }

  if (id === "btn_contact" || /(liên hệ|contact|tư vấn|gặp|meet|talk|email|số điện thoại)/.test(text)) {
    setState(from, { step: "contact" });
    return buildContactMessage();
  }

  if (id === "btn_about" || /(về chúng tôi|about|fortress|giới thiệu)/.test(text)) {
    return buildAboutMessage();
  }

  // ── Plan detail selections ─────────────────────────────────────────────────
  if (id.startsWith("plan_")) {
    const planKey = id.replace("plan_", "");
    setState(from, { step: "plan_detail", lastPlan: planKey });
    return buildPlanDetail(planKey);
  }

  // ── Context-aware follow-up ────────────────────────────────────────────────
  if (state.step === "plans") {
    // If user types a number while in plans menu
    const num = parseInt(text, 10);
    if (num >= 1 && num <= 4) {
      const keys = ["individual", "institution", "anchor", "foreign"];
      const planKey = keys[num - 1];
      setState(from, { step: "plan_detail", lastPlan: planKey });
      return buildPlanDetail(planKey);
    }
  }

  // ── Fallback: show main menu ───────────────────────────────────────────────
  setState(from, { step: "menu" });
  return buildMainMenu();
}

// ── Message builders ──────────────────────────────────────────────────────

function buildMainMenu(): WAMessage {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `👋 *Chào mừng đến với Fortress Investment Holdings!*\n\nChúng tôi đang xây dựng nền tảng *Tài Sản Mã Hóa (TSMH)* đầu tiên được nhà nước cấp phép tại Việt Nam theo *Nghị quyết 05/2025/NQ-CP*.\n\nHiện chúng tôi đang tuyển *cổ đông chiến lược* để cùng xây dựng dự án. Chọn thông tin bạn quan tâm:`,
      },
      footer: { text: "Fortress Investment Holdings · fortressih.com" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "btn_plans",   title: "💼 Hạng Mục Hợp Tác" } },
          { type: "reply", reply: { id: "btn_nq5",     title: "📜 Nghị Quyết 05" } },
          { type: "reply", reply: { id: "btn_contact", title: "📞 Liên Hệ Ngay" } },
        ],
      },
    },
  };
}

function buildPlansMenu(): WAMessage {
  return {
    type: "interactive",
    interactive: {
      type: "list",
      body: {
        text: `💼 *Các Gói Cổ Đông Hợp Tác — Dự Án TSMH*\n\nĐây là các gói *góp vốn xây dựng* nền tảng TSMH được cấp phép — *không phải sản phẩm đầu tư tài chính*. Bạn trở thành cổ đông, có quyền biểu quyết và hưởng lợi từ hoạt động kinh doanh.\n\nChọn loại cổ đông để xem chi tiết quyền & nghĩa vụ:`,
      },
      footer: { text: "Theo Điều 8 NQ 05/2025/NQ-CP · Vốn điều lệ tối thiểu 10.000 tỷ VNĐ" },
      action: {
        button: "Xem Hạng Mục Hợp Tác",
        sections: [
          {
            title: "Loại Cổ Đông",
            rows: [
              {
                id:          "plan_individual",
                title:       "👤 Cổ Đông Cá Nhân",
                description: "Từ 100 triệu VNĐ · ≤35% VĐL · Quyền biểu quyết ĐHCĐ",
              },
              {
                id:          "plan_institution",
                title:       "🏛️ Tổ Chức Tài Chính / CN",
                description: "Từ 1.000 tỷ VNĐ · >35% bắt buộc · Ghế HĐQT",
              },
              {
                id:          "plan_anchor",
                title:       "⚓ Cổ Đông Neo Chiến Lược",
                description: "Từ 3.000 tỷ VNĐ · Ưu tiên cấp phép · Veto quyền",
              },
              {
                id:          "plan_foreign",
                title:       "🌐 Nhà Đầu Tư Nước Ngoài",
                description: "Tối đa 49% VĐL · Cần IRC + IICA · Góp vốn gián tiếp",
              },
            ],
          },
        ],
      },
    },
  };
}

const PLAN_DETAILS: Record<string, {
  icon: string; name: string; min: string; equity: string;
  rights: string[]; obligations: string[]; docs: string[];
}> = {
  individual: {
    icon: "👤", name: "Cổ Đông Cá Nhân",
    min: "từ 100 triệu VNĐ",
    equity: "≤35% VĐL (nhóm cá nhân tổng)",
    rights: [
      "Tham dự & biểu quyết tại ĐHCĐ",
      "Nhận cổ tức theo tỷ lệ sở hữu",
      "Nhận thông tin tài chính định kỳ",
      "Ưu tiên mua cổ phần phát hành mới",
    ],
    obligations: [
      "Góp đủ vốn cam kết đúng hạn",
      "Tuân thủ Điều lệ & NQ nội bộ",
      "Không chuyển nhượng cổ phần tự do trong 24 tháng đầu",
    ],
    docs: [
      "CMND/CCCD bản công chứng",
      "Giấy xác nhận số dư tài khoản",
      "Hợp đồng góp vốn có công chứng",
    ],
  },
  institution: {
    icon: "🏛️", name: "Tổ Chức Tài Chính / Công Nghệ",
    min: "từ 1.000 tỷ VNĐ",
    equity: ">35% bắt buộc (≥2 tổ chức)",
    rights: [
      "Ghế trong Hội Đồng Quản Trị",
      "Quyền phủ quyết các quyết định chiến lược lớn",
      "Ưu tiên số 1 trong phân bổ cổ phần",
      "Ưu tiên hợp tác vận hành sau khi được cấp phép",
    ],
    obligations: [
      "Kinh doanh có lãi 2 năm liên tiếp trước khi góp vốn",
      "BCTC 2 năm được kiểm toán chấp thuận toàn phần",
      "Chỉ góp vốn tại DUY NHẤT 1 tổ chức TSMH được BTC cấp phép",
      "Cam kết hỗ trợ kỹ thuật/nghiệp vụ theo lĩnh vực chuyên môn",
    ],
    docs: [
      "Giấy phép hoạt động ngân hàng/chứng khoán/quỹ",
      "BCTC 2 năm gần nhất đã kiểm toán",
      "Nghị quyết HĐQT phê duyệt góp vốn",
      "Văn bản cam kết không góp vốn tổ chức TSMH khác",
    ],
  },
  anchor: {
    icon: "⚓", name: "Cổ Đông Neo Chiến Lược",
    min: "từ 3.000 tỷ VNĐ",
    equity: "Tỷ lệ đặc biệt · veto quyền",
    rights: [
      "Quyền phủ quyết (veto) đối với các quyết định trọng yếu",
      "Ưu tiên tuyệt đối trong toàn bộ quá trình xin cấp phép",
      "Tham gia trực tiếp thiết kế mô hình kinh doanh & quản trị",
      "Quyền mua trước khi tăng vốn (anti-dilution)",
    ],
    obligations: [
      "Tất cả nghĩa vụ của Tổ Chức Tài Chính/CN",
      "Cam kết dài hạn tối thiểu 5 năm kể từ ngày được cấp phép",
      "Cung cấp ít nhất 1 nhân sự cấp cao cho Ban Điều Hành",
    ],
    docs: [
      "Tất cả hồ sơ của Tổ Chức Tài Chính/CN",
      "Cam kết chiến lược dài hạn (LOI) công chứng",
      "Hồ sơ năng lực kỹ thuật & tài chính tổng hợp",
    ],
  },
  foreign: {
    icon: "🌐", name: "Nhà Đầu Tư Nước Ngoài",
    min: "Theo năng lực · Tối đa 49% VĐL",
    equity: "≤49% VĐL (tổng nhóm nước ngoài)",
    rights: [
      "Các quyền cổ đông thông thường theo Luật Doanh Nghiệp VN",
      "Chuyển lợi nhuận về nước theo quy định",
      "Bảo hộ đầu tư theo hiệp định song phương",
    ],
    obligations: [
      "Mở tài khoản vốn đầu tư gián tiếp (IICA) tại ngân hàng VN",
      "Đăng ký góp vốn tại Sở KHĐT theo Luật Đầu Tư",
      "Cung cấp thông tin UBO (cơ cấu sở hữu thực hưởng)",
      "Tuân thủ giới hạn 49% VĐL theo Điều 8 NQ 05/2025",
    ],
    docs: [
      "Giấy chứng nhận đăng ký đầu tư (IRC)",
      "Xác nhận mở tài khoản IICA",
      "Hồ sơ UBO đầy đủ (cơ cấu sở hữu tới cổ đông cuối cùng)",
      "Văn bản pháp lý theo quốc gia gốc (apostille nếu cần)",
    ],
  },
};

function buildPlanDetail(planKey: string): WAMessage {
  const plan = PLAN_DETAILS[planKey];
  if (!plan) return buildPlansMenu();

  const rightsText  = plan.rights.map((r, i) => `  ${i + 1}. ${r}`).join("\n");
  const obligText   = plan.obligations.map((o, i) => `  ⚠️ ${o}`).join("\n");
  const docsText    = plan.docs.map((d) => `  📄 ${d}`).join("\n");

  const text = `${plan.icon} *${plan.name}*\n💰 Vốn góp: ${plan.min}\n📊 Cổ phần: ${plan.equity}\n\n*✅ Quyền Lợi:*\n${rightsText}\n\n*⚠️ Nghĩa Vụ:*\n${obligText}\n\n*📋 Hồ Sơ Cần Có:*\n${docsText}\n\n🔗 Chi tiết đầy đủ: ${SITE_URL}/invest-with-fortress/plans`;

  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text },
      footer: { text: "Căn cứ: NQ 05/2025/NQ-CP · QĐ 96/QĐ-BTC" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "btn_contact", title: "📞 Đăng Ký Ngay" } },
          { type: "reply", reply: { id: "btn_plans",   title: "🔙 Xem Gói Khác" } },
          { type: "reply", reply: { id: "btn_nq5",     title: "📜 Về NQ 05" } },
        ],
      },
    },
  };
}

function buildNQ5Message(): WAMessage {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `📜 *Nghị Quyết 05/2025/NQ-CP — Thí Điểm Tài Sản Mã Hóa Việt Nam*\n\n*Hiệu lực:* 09/09/2025\n*Cơ quan cấp phép:* Bộ Tài Chính (BTC)\n*Nhận hồ sơ từ:* 20/01/2026\n\n*Điều kiện cốt lõi (Điều 8):*\n  📌 Vốn điều lệ tối thiểu: *10.000 tỷ VNĐ*\n  📌 ≥65% từ tổ chức (bắt buộc)\n  📌 >35% từ ≥2 tổ chức TC/CN được cấp phép\n  📌 ≤49% nhà đầu tư nước ngoài\n  📌 Đạt tiêu chuẩn CNTT cấp độ 4\n\n*Cơ hội:* Chưa có tổ chức nào được cấp phép. Fortress đang ở giai đoạn *tích lũy vốn & tuyển cổ đông* — đây là thời điểm tốt nhất để tham gia với định giá tốt nhất.`,
      },
      footer: { text: "Nguồn: Nghị quyết 05/2025/NQ-CP chính thức" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "btn_plans",   title: "💼 Xem Hạng Mục Hợp Tác" } },
          { type: "reply", reply: { id: "btn_contact", title: "📞 Liên Hệ Tư Vấn" } },
          { type: "reply", reply: { id: "btn_about",   title: "🏰 Về Fortress" } },
        ],
      },
    },
  };
}

function buildContactMessage(): WAMessage {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `📞 *Liên Hệ Fortress Investment Holdings*\n\n🌐 Website: ${SITE_URL}/contact\n📋 Đăng ký hợp tác: ${SITE_URL}/invest-with-fortress\n📧 Email: info@fortressih.com\n\nĐội ngũ chuyên gia sẽ phản hồi trong *2–3 ngày làm việc*.\n🔒 Mọi thông tin được bảo mật tuyệt đối.\n\nHoặc gửi trực tiếp *số điện thoại* và *tên* của bạn, chúng tôi sẽ liên hệ lại ngay!`,
      },
      footer: { text: "Fortress Investment Holdings · Dubai, UAE" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "btn_plans", title: "💼 Xem Hạng Mục Hợp Tác" } },
          { type: "reply", reply: { id: "btn_nq5",   title: "📜 Về NQ 05" } },
          { type: "reply", reply: { id: "btn_about", title: "🏰 Về Fortress" } },
        ],
      },
    },
  };
}

function buildAboutMessage(): WAMessage {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `🏰 *Fortress Investment Holdings*\n\nTập đoàn đầu tư công nghệ có trụ sở tại *Dubai, UAE* — chuyên đầu tư vào FinTech, tài sản mã hóa hợp pháp, AI và kinh tế số tại Việt Nam & Đông Nam Á.\n\n*Sứ mệnh:* Hiện đại hóa nền tài chính Việt Nam, xây dựng hạ tầng số tương đương eCNY của Trung Quốc — nhưng phù hợp đặc thù VN.\n\n*Trọng tâm dự án:*\n  🔑 Nền tảng giao dịch tài sản mã hóa (TSMH) được cấp phép\n  🔑 Hạ tầng FinTech & thanh toán số\n  🔑 Công nghệ AI & blockchain\n  🔑 EdTech & kinh tế số\n\n🌐 ${SITE_URL}/about`,
      },
      footer: { text: "fortressih.com" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "btn_plans",   title: "💼 Hạng Mục Hợp Tác" } },
          { type: "reply", reply: { id: "btn_nq5",     title: "📜 Nghị Quyết 05" } },
          { type: "reply", reply: { id: "btn_contact", title: "📞 Liên Hệ" } },
        ],
      },
    },
  };
}

// ── Send via WhatsApp Cloud API ────────────────────────────────────────────

async function sendWAMessage(to: string, message: WAMessage) {
  const url = `https://graph.facebook.com/${WA_API_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    recipient_type:    "individual",
    to,
    ...message,
  };

  const res = await fetch(url, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[WA Webhook] Send failed:", err);
  }
}
