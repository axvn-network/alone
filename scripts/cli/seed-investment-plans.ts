/**
 * scripts/seed-investment-plans.ts
 *
 * Seeds the database with default Investment Partnership Plans
 * aligned to NQ 5/2025/NQ-CP (Nghị quyết thí điểm tổ chức tài chính số)
 *
 * Usage:
 *   npx tsx scripts/seed-investment-plans.ts
 *
 * Requires MONGODB_URI in environment (loads from .env.local automatically).
 */

import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("[ERROR] MONGODB_URI is not set. Please configure your .env.local file.");
  process.exit(1);
}

// ── Inline model (no path aliases in scripts) ─────────────────────────────────
const InvestmentPlanSchema = new mongoose.Schema(
  {
    tier: { type: String, required: true },
    name: { type: String, required: true },
    nameEn: { type: String, required: true },
    tagline: { type: String, default: "" },
    taglineEn: { type: String, default: "" },
    minCommitment: { type: Number, required: true },
    maxCommitment: { type: Number, default: 0 },
    currency: { type: String, default: "VND" },
    duration: { type: String, default: "" },
    durationEn: { type: String, default: "" },
    equityRange: { type: String, default: "" },
    equityRangeEn: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    benefitsEn: { type: [String], default: [] },
    conditions: { type: [String], default: [] },
    conditionsEn: { type: [String], default: [] },
    rights: { type: [String], default: [] },
    obligations: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    shareholderType: { type: String, default: "" },
    highlighted: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    badgeEn: { type: String, default: "" },
    order: { type: Number, default: 0 },
    status: { type: String, default: "draft" },
  },
  { timestamps: true }
);

const InvestmentPlan =
  mongoose.models.InvestmentPlan ||
  mongoose.model("InvestmentPlan", InvestmentPlanSchema);

// ── Seed data ─────────────────────────────────────────────────────────────────
const PLANS = [
  {
    tier: "seed",
    order: 1,
    status: "active",
    name: "Gói Hạt Giống",
    nameEn: "Seed Partnership",
    shareholderType: "Cổ đông Cá nhân",
    tagline: "Dành cho cá nhân muốn tham gia từ giai đoạn đầu — xây dựng nền tảng công nghệ tài chính số đầu tiên tại Việt Nam.",
    taglineEn: "For individuals joining from the ground up — building Vietnam's first digital financial technology platform.",
    minCommitment: 500_000_000,
    maxCommitment: 2_000_000_000,
    equityRange: "0.5% – 2%",
    equityRangeEn: "0.5% – 2%",
    duration: "24 – 36 tháng",
    durationEn: "24 – 36 months",
    highlighted: false,
    badge: "",
    badgeEn: "",
    benefits: [
      "Quyền biểu quyết theo tỷ lệ cổ phần",
      "Nhận cổ tức khi công ty có lợi nhuận",
      "Tham dự Đại hội cổ đông thường niên",
      "Ưu tiên đăng ký mua cổ phần khi tăng vốn",
    ],
    benefitsEn: [
      "Voting rights proportional to equity",
      "Dividends when the company becomes profitable",
      "Annual General Meeting attendance",
      "Pre-emptive rights on new share issuances",
    ],
    conditions: [
      "Công dân Việt Nam từ 18 tuổi trở lên",
      "Có năng lực hành vi dân sự đầy đủ",
      "Không thuộc đối tượng bị cấm góp vốn theo pháp luật",
    ],
    conditionsEn: [
      "Vietnamese citizen aged 18 or above",
      "Full legal capacity",
      "Not prohibited from contributing capital under law",
    ],
    rights: [
      "Nhận thông tin định kỳ về tình hình hoạt động của công ty",
      "Chuyển nhượng cổ phần theo quy định Điều lệ",
      "Ưu tiên mua cổ phần phát hành thêm",
      "Nhận cổ tức theo tỷ lệ cổ phần sở hữu",
      "Kiến nghị với HĐQT và Ban điều hành",
    ],
    obligations: [
      "Góp đủ vốn cam kết đúng hạn",
      "Tuân thủ Điều lệ công ty và nghị quyết ĐHCĐ",
      "Không tiết lộ thông tin bảo mật",
      "Chịu trách nhiệm về các nghĩa vụ tài chính trong phạm vi vốn góp",
    ],
    documents: [
      "CMND/CCCD còn hiệu lực (bản sao công chứng)",
      "Hợp đồng góp vốn (mẫu do công ty cung cấp)",
      "Chứng minh nguồn gốc hợp pháp của vốn (sao kê ngân hàng 3 tháng gần nhất)",
    ],
  },
  {
    tier: "growth",
    order: 2,
    status: "active",
    name: "Gói Tăng Trưởng",
    nameEn: "Growth Partnership",
    shareholderType: "Cổ đông Cá nhân / DN Nhỏ",
    tagline: "Phù hợp cho cá nhân chuyên nghiệp và doanh nghiệp nhỏ muốn tham gia giai đoạn triển khai thực tế.",
    taglineEn: "Ideal for professionals and small businesses joining during the deployment phase.",
    minCommitment: 2_000_000_000,
    maxCommitment: 5_000_000_000,
    equityRange: "2% – 5%",
    equityRangeEn: "2% – 5%",
    duration: "24 – 36 tháng",
    durationEn: "24 – 36 months",
    highlighted: true,
    badge: "Phổ Biến",
    badgeEn: "Popular",
    benefits: [
      "Quyền biểu quyết theo tỷ lệ cổ phần",
      "Nhận cổ tức ưu tiên theo thoả thuận",
      "Tham dự và đề xuất nghị quyết tại ĐHCĐ",
      "Tiếp cận báo cáo tài chính hàng quý",
      "Ưu tiên đăng ký mua cổ phần khi tăng vốn",
    ],
    benefitsEn: [
      "Voting rights proportional to equity",
      "Priority dividends as agreed",
      "Attendance and resolution proposals at AGM",
      "Access to quarterly financial reports",
      "Pre-emptive rights on new share issuances",
    ],
    conditions: [
      "Cá nhân hoặc doanh nghiệp có tư cách pháp nhân hợp lệ",
      "Không thuộc đối tượng bị cấm góp vốn theo pháp luật",
      "Cam kết không rút vốn trước thời hạn tối thiểu",
    ],
    conditionsEn: [
      "Individual or legally registered business entity",
      "Not prohibited from contributing capital under law",
      "Commitment not to withdraw capital before minimum period",
    ],
    rights: [
      "Đề cử thành viên HĐQT khi sở hữu từ 5% cổ phần",
      "Yêu cầu triệu tập ĐHCĐ bất thường khi cần thiết",
      "Tiếp cận sổ sách kế toán theo quy định",
      "Nhận cổ tức và tài sản còn lại khi giải thể",
      "Chuyển nhượng cổ phần sau kỳ hạn cam kết",
    ],
    obligations: [
      "Góp đủ vốn cam kết đúng hạn",
      "Tuân thủ Điều lệ công ty và nghị quyết ĐHCĐ",
      "Không tiết lộ thông tin bảo mật",
      "Không tham gia vào hoạt động cạnh tranh trực tiếp",
      "Chịu trách nhiệm về các nghĩa vụ tài chính trong phạm vi vốn góp",
    ],
    documents: [
      "CMND/CCCD hoặc Giấy ĐKDN còn hiệu lực (bản sao công chứng)",
      "Hợp đồng góp vốn (mẫu do công ty cung cấp)",
      "Chứng minh nguồn gốc hợp pháp của vốn (sao kê ngân hàng 6 tháng)",
      "Văn bản cam kết không vi phạm quy định nội bộ",
    ],
  },
  {
    tier: "expansion",
    order: 3,
    status: "active",
    name: "Gói Mở Rộng",
    nameEn: "Expansion Partnership",
    shareholderType: "Cổ đông Tổ chức",
    tagline: "Dành cho tổ chức và doanh nghiệp muốn tham gia giai đoạn mở rộng thị trường và scale nền tảng.",
    taglineEn: "For organizations joining during the market expansion and platform scaling phase.",
    minCommitment: 5_000_000_000,
    maxCommitment: 20_000_000_000,
    equityRange: "5% – 10%",
    equityRangeEn: "5% – 10%",
    duration: "36 – 48 tháng",
    durationEn: "36 – 48 months",
    highlighted: false,
    badge: "",
    badgeEn: "",
    benefits: [
      "Quyền đề cử thành viên HĐQT",
      "Nhận báo cáo tài chính hàng tháng",
      "Ưu tiên trong các hợp đồng hợp tác kinh doanh",
      "Quyền phủ quyết các quyết định chiến lược lớn",
      "Hưởng chính sách cổ tức ưu đãi",
    ],
    benefitsEn: [
      "Right to nominate board members",
      "Monthly financial reports",
      "Priority in business partnership contracts",
      "Veto rights on major strategic decisions",
      "Preferential dividend policy",
    ],
    conditions: [
      "Doanh nghiệp có tư cách pháp nhân tại Việt Nam",
      "Kinh doanh có lãi ít nhất 1 năm liền trước",
      "BCTC năm gần nhất được kiểm toán chấp thuận",
      "Không thuộc đối tượng bị cấm góp vốn theo pháp luật",
    ],
    conditionsEn: [
      "Legally registered business entity in Vietnam",
      "Profitable for at least the preceding year",
      "Most recent annual financial statements with clean audit opinion",
      "Not prohibited from contributing capital under law",
    ],
    rights: [
      "Đề cử thành viên HĐQT độc lập",
      "Quyền mua cổ phần ưu tiên khi tăng vốn",
      "Tham gia vào các quyết định chiến lược trọng yếu",
      "Nhận báo cáo quản trị và tài chính định kỳ",
      "Chuyển nhượng hoặc chuyển giao cổ phần sau thời gian cam kết",
    ],
    obligations: [
      "Góp đủ vốn đúng hạn theo lộ trình đã ký",
      "Tuân thủ nghiêm Điều lệ và quyết định của ĐHCĐ, HĐQT",
      "Bảo mật thông tin nội bộ",
      "Không góp vốn vào đối thủ cạnh tranh trực tiếp",
      "Tuân thủ quy định AML/KYC theo pháp luật hiện hành",
    ],
    documents: [
      "Giấy chứng nhận ĐKDN còn hiệu lực (bản sao công chứng)",
      "Báo cáo tài chính 2 năm gần nhất được kiểm toán",
      "Nghị quyết HĐQT/ĐHCĐ chấp thuận tham gia góp vốn",
      "Hợp đồng góp vốn (mẫu do công ty cung cấp)",
      "Văn bản xác nhận nguồn gốc hợp pháp của vốn",
    ],
  },
  {
    tier: "strategic",
    order: 4,
    status: "active",
    name: "Gói Chiến Lược",
    nameEn: "Strategic Partnership",
    shareholderType: "Cổ đông Tổ chức Tài chính",
    tagline: "Dành cho định chế tài chính và đối tác chiến lược muốn đồng hành cùng tầm nhìn dài hạn.",
    taglineEn: "For financial institutions and strategic partners sharing a long-term vision.",
    minCommitment: 20_000_000_000,
    maxCommitment: 100_000_000_000,
    equityRange: "10% – 20%",
    equityRangeEn: "10% – 20%",
    duration: "48 – 60 tháng",
    durationEn: "48 – 60 months",
    highlighted: false,
    badge: "",
    badgeEn: "",
    benefits: [
      "Ghế trong Hội đồng quản trị",
      "Quyền phê duyệt ngân sách và kế hoạch kinh doanh hàng năm",
      "Ưu tiên tiếp cận sản phẩm/dịch vụ mới",
      "Cơ hội hợp tác kinh doanh chiến lược",
      "Hưởng cổ tức ưu đãi và bảo vệ chống pha loãng",
    ],
    benefitsEn: [
      "Board seat",
      "Approval rights on annual budget and business plan",
      "Priority access to new products/services",
      "Strategic business collaboration opportunities",
      "Preferred dividends and anti-dilution protection",
    ],
    conditions: [
      "Là định chế tài chính hoặc doanh nghiệp lớn có tư cách pháp nhân",
      "Kinh doanh có lãi ít nhất 2 năm liền trước",
      "BCTC 2 năm gần nhất được kiểm toán chấp thuận toàn phần",
      "Chỉ góp vốn tại duy nhất 1 tổ chức TSMH được BTC cấp phép (Điều 8, Khoản 4 NQ5/2025)",
    ],
    conditionsEn: [
      "Financial institution or large enterprise with legal entity status",
      "Profitable for at least 2 consecutive preceding years",
      "2 most recent years of financial statements with clean unqualified audit opinion",
      "Equity contribution limited to only 1 BTC-licensed financial organization (Article 8, Clause 4 NQ5/2025)",
    ],
    rights: [
      "Bổ nhiệm thành viên HĐQT theo tỷ lệ cổ phần",
      "Quyền phủ quyết các thay đổi lớn trong Điều lệ",
      "Quyền yêu cầu kiểm toán độc lập bất kỳ lúc nào",
      "Tiếp cận toàn bộ sổ sách và báo cáo nội bộ",
      "Ưu tiên trong mọi vòng gọi vốn tiếp theo",
    ],
    obligations: [
      "Góp đủ vốn đúng lộ trình đã ký kết",
      "Tuân thủ đầy đủ Điều lệ và mọi nghị quyết hợp lệ của HĐQT/ĐHCĐ",
      "Bảo mật tuyệt đối mọi thông tin chiến lược nội bộ",
      "Không tham gia vào doanh nghiệp cạnh tranh trực tiếp trong suốt thời gian cam kết",
      "Tuân thủ đầy đủ quy định KYC/AML theo quy định BTC và NHNN",
    ],
    documents: [
      "Giấy phép hoạt động và ĐKDN (bản sao công chứng)",
      "BCTC kiểm toán 2 năm gần nhất (hợp nhất + riêng lẻ)",
      "Nghị quyết cấp có thẩm quyền chấp thuận góp vốn",
      "Báo cáo xác minh AML/KYC theo yêu cầu của BTC",
      "Hợp đồng cổ đông chiến lược (SHA — Shareholders Agreement)",
      "Văn bản cam kết tuân thủ NQ 05/2025/NQ-CP",
    ],
  },
  {
    tier: "anchor",
    order: 5,
    status: "draft",
    name: "Gói Neo Chiến Lược",
    nameEn: "Anchor Partnership",
    shareholderType: "Cổ đông Neo / Định chế lớn",
    tagline: "Gói đặc biệt dành cho đối tác neo — đóng vai trò định hình chiến lược và dẫn dắt hệ sinh thái tài chính số.",
    taglineEn: "Special package for anchor partners — shaping strategy and leading the digital financial ecosystem.",
    minCommitment: 100_000_000_000,
    maxCommitment: 0,
    equityRange: "Thương lượng > 20%",
    equityRangeEn: "Negotiable > 20%",
    duration: "60+ tháng",
    durationEn: "60+ months",
    highlighted: false,
    badge: "Thương lượng",
    badgeEn: "By Invitation",
    benefits: [
      "Ghế chủ tịch hoặc phó chủ tịch HĐQT",
      "Quyền định hình chiến lược dài hạn",
      "Hưởng cổ tức ưu đãi tối đa",
      "Bảo vệ anti-dilution đầy đủ",
      "Ưu tiên exit trong mọi sự kiện thanh khoản",
    ],
    benefitsEn: [
      "Chairman or Vice-Chairman board seat",
      "Right to shape long-term strategy",
      "Maximum preferred dividends",
      "Full anti-dilution protection",
      "Liquidation preference in all exit events",
    ],
    conditions: [
      "Là định chế tài chính lớn hoặc tập đoàn có kinh nghiệm chứng minh trong ngành Fintech/Tài chính",
      "Kinh doanh có lãi ít nhất 2 năm liền trước",
      "BCTC 2 năm gần nhất được kiểm toán sạch toàn phần",
      "Chỉ góp vốn tại duy nhất 1 tổ chức TSMH được BTC cấp phép",
      "Được Ban lãnh đạo AXVN Tech Holding chấp thuận",
    ],
    conditionsEn: [
      "Large financial institution or conglomerate with proven Fintech/Finance experience",
      "Profitable for at least 2 consecutive years",
      "2 most recent years with clean unqualified audit opinion",
      "Equity contribution limited to only 1 BTC-licensed financial organization",
      "Approved by AXVN Tech Holding leadership",
    ],
    rights: [
      "Bổ nhiệm Chủ tịch/Phó chủ tịch HĐQT",
      "Quyền phủ quyết tất cả các quyết định chiến lược trọng yếu",
      "Quyền yêu cầu thay đổi CEO/CFO khi cần thiết",
      "Tiếp cận toàn bộ thông tin kinh doanh và chiến lược",
      "Ưu tiên tuyệt đối trong mọi sự kiện thanh khoản",
    ],
    obligations: [
      "Góp đủ vốn theo lộ trình cam kết",
      "Dẫn dắt và hỗ trợ chiến lược phát triển hệ sinh thái",
      "Tuân thủ tuyệt đối Điều lệ và Shareholders Agreement",
      "Bảo mật thông tin chiến lược tuyệt đối",
      "Tuân thủ đầy đủ KYC/AML theo tiêu chuẩn quốc tế và quy định BTC/NHNN",
    ],
    documents: [
      "Toàn bộ hồ sơ pháp lý của tổ chức (ĐKDN, Điều lệ nội bộ)",
      "BCTC kiểm toán 2 năm (hợp nhất + riêng lẻ, kiểm toán Big4 ưu tiên)",
      "Nghị quyết cấp cao nhất chấp thuận tham gia",
      "Báo cáo AML/KYC nâng cao theo yêu cầu BTC",
      "Shareholders Agreement (SHA) đàm phán riêng",
      "Văn bản cam kết tuân thủ đầy đủ NQ 05/2025/NQ-CP và các quy định liên quan",
      "Thư bảo đảm từ tổ chức kiểm toán độc lập",
    ],
  },
];

// ── Run ───────────────────────────────────────────────────────────────────────
async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string, { bufferCommands: false });
  console.log("Connected\n");

  const existing = await InvestmentPlan.countDocuments();
  if (existing > 0) {
    console.log(`[!] Found ${existing} existing plans. Skipping seed (use --force to override).`);
    if (!process.argv.includes("--force")) {
      await mongoose.disconnect();
      process.exit(0);
    }
    console.log("[!] --force flag detected. Clearing existing plans...");
    await InvestmentPlan.deleteMany({});
  }

  console.log(`Seeding ${PLANS.length} investment plans...\n`);
  for (const plan of PLANS) {
    await InvestmentPlan.create(plan);
    console.log(`  [+] [${plan.tier}] ${plan.name} (${plan.status})`);
  }

  console.log("\nDone! Investment plans seeded successfully.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[ERROR] Seed failed:", err);
  process.exit(1);
});
