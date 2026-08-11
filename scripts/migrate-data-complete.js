/**
 * scripts/migrate-data-complete.js
 *
 * Hoàn thiện dữ liệu thực tế:
 *  1. Cập nhật Settings (email/phone/address)
 *  2. Cập nhật 5 InvestmentPlans với rights/obligations/documents đầy đủ
 *
 * Chạy: node scripts/migrate-data-complete.js
 * Idempotent: chạy lại an toàn.
 */
"use strict";

const path = require("path");
const mongoose = require(path.resolve("node_modules/mongoose"));
require(path.resolve("node_modules/dotenv")).config({ path: path.resolve(".env.local") });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("MONGODB_URI not set"); process.exit(1); }
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log("\n=== Migrate: hoàn thiện dữ liệu thực tế ===\n");

  // ── 1. Settings ─────────────────────────────────────────────────────────────
  const sr = await db.collection("settings").updateOne(
    {},
    {
      $set: {
        companyName: "GVI Tech Holding",
        email: "info@vnkr.vn",
        phone: "",
        address: "",
        whatsapp: "",
        "seoDefaults.titleSuffix": " | GVI Tech Holding",
        "chatButtons.0.messageVi": "Xin chào, tôi muốn tìm hiểu thêm về GVI Tech Holding.",
        "chatButtons.0.messageEn": "Hello, I would like to enquire about GVI Tech Holding.",
      },
    }
  );
  console.log("Settings updated:", sr.modifiedCount, "doc");

  // ── 2. InvestmentPlans — rights / obligations / documents đầy đủ ────────────
  const planUpdates = [
    {
      tier: "seed",
      rights: [
        "Quyền biểu quyết tại ĐHCĐ theo tỷ lệ cổ phần",
        "Nhận báo cáo quý và thông báo hoạt động định kỳ",
        "Quyền nhận cổ tức khi công ty phân phối lợi nhuận",
        "Quyền chuyển nhượng cổ phần sau thời hạn lock-up (theo Điều lệ)",
      ],
      obligations: [
        "Góp đủ vốn cam kết trong thời hạn thỏa thuận",
        "Hoàn tất KYC và xác minh danh tính đầy đủ",
        "Tuân thủ Điều lệ Công ty và quy định nội bộ",
        "Bảo mật thông tin nội bộ dự án",
      ],
      documents: [
        "CCCD/Hộ chiếu còn hiệu lực (bản sao công chứng)",
        "Giấy xác nhận thu nhập / nguồn vốn hợp pháp",
        "Đơn đăng ký tham gia góp vốn (mẫu do Công ty cấp)",
        "Hợp đồng góp vốn cổ đông ký 2 bên",
      ],
      shareholderType: "Cổ đông cá nhân (Individual Shareholder)",
    },
    {
      tier: "growth",
      rights: [
        "Tất cả quyền lợi Gói Hạt Nhân",
        "Quyền ưu tiên tham gia vòng gọi vốn tiếp theo (Pro-rata Rights)",
        "Tư vấn chiến lược đầu tư chuyên sâu 1-on-1 hàng quý",
        "Tham gia nhóm Telegram/Zalo cổ đông chiến lược",
        "Nhận email cập nhật tiến độ dự án hàng tháng",
      ],
      obligations: [
        "Cam kết không chuyển nhượng cổ phần trong 12 tháng đầu (lock-up)",
        "Góp đủ vốn cam kết đúng kế hoạch",
        "Hoàn tất KYC nâng cao và ký Hợp đồng Cổ đông",
        "Thông báo khi muốn chuyển nhượng để HĐQT xem xét ROFR",
      ],
      documents: [
        "CCCD/Hộ chiếu còn hiệu lực (bản sao công chứng)",
        "Giấy xác nhận thu nhập / nguồn vốn hợp pháp (ngân hàng hoặc cơ quan thuế)",
        "Bản kê khai tài sản (nếu yêu cầu)",
        "Đơn đăng ký tham gia góp vốn",
        "Hợp đồng Cổ đông (Shareholder Agreement) ký 2 bên",
        "Biên bản xác nhận góp vốn từng đợt",
      ],
      shareholderType: "Cổ đông cá nhân / Tổ chức nhỏ",
    },
    {
      tier: "expansion",
      rights: [
        "Tất cả quyền lợi Gói Tăng Trưởng",
        "Chỗ ngồi Tư vấn trong Hội đồng Cố vấn Chiến lược (Advisory Council)",
        "Báo cáo nội bộ hàng tháng (P&L, tiến độ pháp lý, roadmap)",
        "Quyền ưu tiên mua cổ phần mới phát hành (ROFR — Right of First Refusal)",
        "Quyền yêu cầu họp HĐQT theo nghị trình",
      ],
      obligations: [
        "Lock-up 24 tháng; chuyển nhượng cần thông qua HĐQT",
        "Hoàn tất Due Diligence và nộp đầy đủ hồ sơ pháp lý",
        "Ký NDA bảo mật thông tin chiến lược",
        "Báo cáo thay đổi cơ cấu sở hữu thực hưởng (UBO) kịp thời",
      ],
      documents: [
        "CCCD/Hộ chiếu công chứng và bản dịch công chứng (nếu nước ngoài)",
        "Báo cáo tài chính 2 năm gần nhất (nếu là pháp nhân)",
        "Giấy tờ chứng minh nguồn vốn hợp pháp (ngân hàng + thuế)",
        "Hợp đồng Cổ đông nâng cao (bổ sung điều khoản ROFR, Advisory)",
        "Biên bản HĐQT phê duyệt việc nhận cổ đông mới",
        "NDA (Non-Disclosure Agreement)",
      ],
      shareholderType: "Tổ chức / Doanh nghiệp",
    },
    {
      tier: "strategic",
      rights: [
        "Tất cả quyền lợi Gói Mở Rộng",
        "Đề cử thành viên Hội đồng Quản trị (nếu đáp ứng tỷ lệ cổ phần quy định)",
        "Quyền tham gia thẩm định và phê duyệt các dự án M&A, liên doanh",
        "Tiếp cận báo cáo tài chính nội bộ và dự báo kinh doanh chi tiết",
        "Ưu tiên cao nhất trong vòng gọi vốn mở rộng tiếp theo",
      ],
      obligations: [
        "Lock-up 36 tháng; chuyển nhượng phải được ĐHCĐ phê duyệt",
        "Cam kết đồng hành chiến lược dài hạn (không rút vốn đột ngột)",
        "Tuân thủ quy chế quản trị nội bộ và chính sách xung đột lợi ích",
        "Cung cấp hồ sơ UBO đầy đủ theo yêu cầu pháp lý AML",
      ],
      documents: [
        "Giấy ĐKKD + Điều lệ Công ty (pháp nhân) hoặc Hộ chiếu/CCCD (cá nhân)",
        "BCTC 2 năm kiểm toán (pháp nhân)",
        "Hồ sơ UBO (Ultimate Beneficial Owner) đầy đủ",
        "Biên bản họp HĐQT/Đại hội đồng cổ đông phê duyệt đầu tư",
        "Hợp đồng Cổ đông Chiến lược (bổ sung điều khoản Board Nomination)",
        "NDA + Cam kết bảo mật chiến lược",
        "Giấy xác nhận tuân thủ AML/KYC từ ngân hàng đối tác",
      ],
      shareholderType: "Tổ chức tài chính / DN Công nghệ lớn",
    },
    {
      tier: "anchor",
      rights: [
        "Tất cả quyền lợi Gói Chiến Lược",
        "Vai trò Co-Founder được ghi nhận trong hồ sơ công ty và tài liệu pháp lý",
        "Quyền kiểm soát thực chất theo tỷ lệ cổ phần (veto một số quyết định trọng yếu)",
        "Ưu tiên phân phối lợi nhuận (liquidation preference) khi thanh lý",
        "Quyền tham gia đàm phán trực tiếp mọi giao dịch M&A, IPO, niêm yết",
      ],
      obligations: [
        "Cam kết góp vốn đủ và đúng hạn theo Biên bản Ghi nhớ đã ký",
        "Lock-up dài hạn theo thỏa thuận (tối thiểu 48 tháng)",
        "Tham gia tích cực vào HĐQT và các ủy ban chiến lược",
        "Cung cấp nguồn lực hỗ trợ chiến lược (network, công nghệ, nhân lực nếu cam kết)",
      ],
      documents: [
        "Hồ sơ pháp lý đầy đủ (Giấy ĐKKD, Điều lệ, UBO, BCTC 3 năm kiểm toán)",
        "Biên bản thẩm định (Due Diligence Report) 2 chiều",
        "Thỏa thuận MOU (Memorandum of Understanding) giai đoạn đầu",
        "Hợp đồng Cổ đông Anchor (term sheet + SPA đầy đủ)",
        "Biên bản ĐHCĐ bất thường phê duyệt cơ cấu cổ đông Neo",
        "Hồ sơ AML/KYC nâng cao theo yêu cầu FATF",
        "Kế hoạch góp vốn chi tiết theo từng giai đoạn (escrow schedule nếu có)",
        "NDA chiến lược + Cam kết không cạnh tranh (Non-Compete Clause)",
      ],
      shareholderType: "Nhà đầu tư Neo (Anchor Investor / Định chế tài chính lớn)",
    },
  ];

  let updated = 0;
  for (const p of planUpdates) {
    const r = await db.collection("investmentplans").updateOne(
      { tier: p.tier },
      { $set: { rights: p.rights, obligations: p.obligations, documents: p.documents, shareholderType: p.shareholderType } }
    );
    if (r.modifiedCount) updated++;
    console.log(`  plan[${p.tier}]: rights=${p.rights.length} obligations=${p.obligations.length} docs=${p.documents.length} — modified=${r.modifiedCount}`);
  }
  console.log(`InvestmentPlans updated: ${updated}/5`);

  // ── 3. Verify ───────────────────────────────────────────────────────────────
  console.log("\n=== Verify ===");
  const s = await db.collection("settings").findOne({});
  console.log("settings.email:", s.email, "| companyName:", s.companyName);
  const plans = await db.collection("investmentplans").find({}).toArray();
  plans.forEach(p => console.log(`  ${p.tier}: rights=${p.rights?.length} obligations=${p.obligations?.length} documents=${p.documents?.length}`));

  await mongoose.disconnect();
  console.log("\nDone.\n");
}

run().catch(e => { console.error(e.message); process.exit(1); });
