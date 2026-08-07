const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * MongoDB Seed Script — Fortress Investment Holdings
 *
 * Seeds:
 *   - Admin user (from ADMIN_EMAIL / ADMIN_PASSWORD)
 *   - Default Settings document
 *   - Investment Plans (5 tiers: seed / growth / expansion / strategic / anchor)
 *   - Demo enquiries (development only)
 *
 * Usage:
 *   node scripts/seed-mongo.js
 *   node scripts/seed-mongo.js --force   # overwrite existing investment plans
 *
 * Environment:
 *   Requires MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD
 */

require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@fortressih.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "SuperAdmin";
const NODE_ENV = process.env.NODE_ENV || "development";
const FORCE = process.argv.includes("--force");

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env.local");
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error("❌ ADMIN_PASSWORD not set in .env.local");
  process.exit(1);
}

// ── Schemas ──────────────────────────────────────────────────────

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "superadmin" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const EnquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Contact", "Investment Opportunity", "Business Acquisition", "Joint Venture", "Strategic Partnership"],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    subject: String,
    message: { type: String, required: true },
    document: String,
    status: { type: String, enum: ["new", "read", "archived"], default: "new" },
  },
  { timestamps: true }
);

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const InvestmentPlanSchema = new mongoose.Schema(
  {
    tier: {
      type: String,
      enum: ["seed", "growth", "expansion", "strategic", "anchor"],
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    nameEn: { type: String },
    tagline: { type: String },
    taglineEn: { type: String },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number },
    currency: { type: String, default: "USD" },
    annualReturn: { type: String },
    lockupPeriod: { type: String },
    dividendFrequency: { type: String },
    shareholderType: { type: String },
    description: { type: String },
    descriptionEn: { type: String },
    benefits: [{ type: String }],
    benefitsEn: [{ type: String }],
    rights: [{ type: String }],
    rightsEn: [{ type: String }],
    obligations: [{ type: String }],
    obligationsEn: [{ type: String }],
    documents: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
const InvestmentPlan = mongoose.models.InvestmentPlan || mongoose.model("InvestmentPlan", InvestmentPlanSchema);

// ── Demo enquiries ───────────────────────────────────────────────

const demoEnquiries = [
  {
    type: "Contact",
    name: "Ahmed Al Maktoum",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    subject: "General Inquiry",
    message: "Interested in learning more about real estate investment opportunities in Dubai.",
    status: "new",
  },
  {
    type: "Investment Opportunity",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 555 123 4567",
    company: "US Capital Partners",
    subject: "Strategic Partnership",
    message: "We are a US-based private equity firm looking for strategic partnerships in the MENA region.",
    status: "new",
  },
  {
    type: "Joint Venture",
    name: "Lisa Chen",
    email: "lisa@chenholdings.com",
    phone: "+65 9123 4567",
    company: "Chen Holdings Pte Ltd",
    subject: "JV Proposal",
    message: "Proposing a JV for a logistics and distribution center in Dubai South.",
    status: "new",
  },
];

// ── Default settings ─────────────────────────────────────────────

const defaultSettings = [
  { key: "siteName", value: "Fortress Investment Holdings" },
  { key: "siteNameEn", value: "Fortress Investment Holdings" },
  { key: "tagline", value: "Đầu tư bền vững — Tăng trưởng vượt trội" },
  { key: "taglineEn", value: "Sustainable Investment — Superior Growth" },
  { key: "contactEmail", value: "contact@fortressih.com" },
  { key: "contactPhone", value: "+971 4 000 0000" },
  { key: "address", value: "Dubai, United Arab Emirates" },
  { key: "socialFacebook", value: "" },
  { key: "socialLinkedin", value: "" },
  { key: "socialTwitter", value: "" },
  { key: "newsletter_enabled", value: true },
  { key: "newsletter_title", value: "Đăng ký nhận bản tin đầu tư" },
  { key: "newsletter_titleEn", value: "Subscribe to Investment Newsletter" },
  { key: "newsletter_description", value: "Nhận cập nhật thị trường và cơ hội đầu tư mới nhất từ Fortress." },
  { key: "newsletter_descriptionEn", value: "Receive market updates and the latest investment opportunities from Fortress." },
];

// ── Investment Plans ─────────────────────────────────────────────

const investmentPlans = [
  {
    tier: "seed",
    name: "Gói Hạt Giống",
    nameEn: "Seed Package",
    tagline: "Bắt đầu hành trình đầu tư của bạn",
    taglineEn: "Begin your investment journey",
    minAmount: 10000,
    maxAmount: 49999,
    currency: "USD",
    annualReturn: "8% – 10%",
    lockupPeriod: "12 tháng",
    dividendFrequency: "Hàng năm",
    shareholderType: "Cổ đông cá nhân",
    description: "Gói đầu tư dành cho nhà đầu tư mới bắt đầu, với mức vốn tối thiểu thấp và lợi suất ổn định.",
    descriptionEn: "Entry-level investment package for new investors, with low minimum capital and stable returns.",
    benefits: [
      "Lãi suất hàng năm 8–10%",
      "Tham gia đại hội cổ đông thường niên",
      "Báo cáo tài chính hàng quý",
      "Hỗ trợ tư vấn đầu tư cơ bản",
    ],
    benefitsEn: [
      "Annual return 8–10%",
      "Attend annual shareholder meeting",
      "Quarterly financial reports",
      "Basic investment advisory support",
    ],
    rights: ["Quyền nhận cổ tức hàng năm", "Quyền tham dự ĐHCĐ thường niên"],
    rightsEn: ["Right to receive annual dividend", "Right to attend AGM"],
    obligations: ["Không rút vốn trong kỳ hạn 12 tháng", "Tuân thủ điều lệ cổ đông"],
    obligationsEn: ["No capital withdrawal within 12-month term", "Comply with shareholder charter"],
    documents: ["Hợp đồng đầu tư", "Điều lệ cổ đông", "Chính sách cổ tức"],
    isFeatured: false,
    status: "active",
    sortOrder: 1,
  },
  {
    tier: "growth",
    name: "Gói Tăng Trưởng",
    nameEn: "Growth Package",
    tagline: "Tăng tốc danh mục đầu tư của bạn",
    taglineEn: "Accelerate your investment portfolio",
    minAmount: 50000,
    maxAmount: 199999,
    currency: "USD",
    annualReturn: "10% – 13%",
    lockupPeriod: "18 tháng",
    dividendFrequency: "Hàng quý",
    shareholderType: "Cổ đông cá nhân ưu tiên",
    description: "Gói tăng trưởng dành cho nhà đầu tư muốn mở rộng danh mục với lợi suất cao hơn và quyền lợi ưu tiên.",
    descriptionEn: "Growth package for investors looking to expand their portfolio with higher returns and priority benefits.",
    benefits: [
      "Lãi suất hàng năm 10–13%",
      "Cổ tức chi trả hàng quý",
      "Ưu tiên tiếp cận cơ hội đầu tư mới",
      "Báo cáo tài chính hàng tháng",
      "Tư vấn đầu tư cá nhân",
    ],
    benefitsEn: [
      "Annual return 10–13%",
      "Quarterly dividend payments",
      "Priority access to new investment opportunities",
      "Monthly financial reports",
      "Personal investment advisory",
    ],
    rights: [
      "Quyền nhận cổ tức hàng quý",
      "Quyền biểu quyết tại ĐHCĐ",
      "Quyền ưu tiên mua cổ phần phát hành mới",
    ],
    rightsEn: [
      "Right to receive quarterly dividend",
      "Voting rights at AGM",
      "Pre-emptive right on new share issuance",
    ],
    obligations: ["Không rút vốn trong kỳ hạn 18 tháng", "Tuân thủ điều lệ cổ đông", "Thông báo trước 30 ngày khi chuyển nhượng"],
    obligationsEn: ["No capital withdrawal within 18-month term", "Comply with shareholder charter", "30-day notice for share transfer"],
    documents: ["Hợp đồng đầu tư nâng cao", "Điều lệ cổ đông ưu tiên", "Chính sách cổ tức hàng quý"],
    isFeatured: true,
    status: "active",
    sortOrder: 2,
  },
  {
    tier: "expansion",
    name: "Gói Mở Rộng",
    nameEn: "Expansion Package",
    tagline: "Đẩy mạnh tăng trưởng tài sản dài hạn",
    taglineEn: "Drive long-term asset growth",
    minAmount: 200000,
    maxAmount: 499999,
    currency: "USD",
    annualReturn: "13% – 16%",
    lockupPeriod: "24 tháng",
    dividendFrequency: "Hàng quý",
    shareholderType: "Cổ đông tổ chức nhỏ",
    description: "Gói mở rộng cho nhà đầu tư tổ chức nhỏ, cung cấp lợi suất vượt trội cùng quyền lợi độc quyền.",
    descriptionEn: "Expansion package for small institutional investors, providing superior returns with exclusive benefits.",
    benefits: [
      "Lãi suất hàng năm 13–16%",
      "Cổ tức chi trả hàng quý",
      "Quyền truy cập báo cáo chiến lược nội bộ",
      "Được tham gia hội đồng tư vấn",
      "Tư vấn đầu tư ưu tiên 24/7",
    ],
    benefitsEn: [
      "Annual return 13–16%",
      "Quarterly dividend payments",
      "Access to internal strategy reports",
      "Participation in advisory board",
      "Priority 24/7 investment advisory",
    ],
    rights: [
      "Quyền nhận cổ tức hàng quý",
      "Quyền biểu quyết tại ĐHCĐ (tỷ lệ ưu đãi)",
      "Quyền tham gia hội đồng tư vấn",
      "Quyền ưu tiên mua cổ phần phát hành mới",
    ],
    rightsEn: [
      "Right to receive quarterly dividend",
      "Enhanced voting rights at AGM",
      "Right to join advisory board",
      "Pre-emptive right on new share issuance",
    ],
    obligations: ["Không rút vốn trong kỳ hạn 24 tháng", "Tuân thủ điều lệ cổ đông tổ chức", "Thông báo trước 60 ngày khi chuyển nhượng"],
    obligationsEn: ["No capital withdrawal within 24-month term", "Comply with institutional shareholder charter", "60-day notice for share transfer"],
    documents: ["Hợp đồng đầu tư tổ chức", "Điều lệ cổ đông tổ chức", "Chính sách chia sẻ thông tin nội bộ"],
    isFeatured: false,
    status: "active",
    sortOrder: 3,
  },
  {
    tier: "strategic",
    name: "Gói Chiến Lược",
    nameEn: "Strategic Package",
    tagline: "Đối tác chiến lược đồng hành lâu dài",
    taglineEn: "Long-term strategic partnership",
    minAmount: 500000,
    maxAmount: 1999999,
    currency: "USD",
    annualReturn: "16% – 20%",
    lockupPeriod: "36 tháng",
    dividendFrequency: "Hàng tháng",
    shareholderType: "Cổ đông chiến lược",
    description: "Gói chiến lược dành riêng cho các đối tác đầu tư lớn, với lợi suất hàng đầu và quyền đồng quyết định.",
    descriptionEn: "Strategic package exclusively for major investment partners with top-tier returns and co-decision rights.",
    benefits: [
      "Lãi suất hàng năm 16–20%",
      "Cổ tức chi trả hàng tháng",
      "Quyền đồng quyết định chiến lược đầu tư",
      "Tham gia hội đồng quản trị (quan sát viên)",
      "Báo cáo tài chính thời gian thực",
      "Chuyên viên quản lý danh mục riêng",
    ],
    benefitsEn: [
      "Annual return 16–20%",
      "Monthly dividend payments",
      "Co-decision rights on investment strategy",
      "Board participation (observer status)",
      "Real-time financial reporting",
      "Dedicated portfolio manager",
    ],
    rights: [
      "Quyền biểu quyết nâng cao tại ĐHCĐ",
      "Quyền tham dự và quan sát HĐQT",
      "Quyền ưu tiên mua lại cổ phần",
      "Quyền nhận cổ tức hàng tháng",
    ],
    rightsEn: [
      "Enhanced voting rights at AGM",
      "Board attendance and observation rights",
      "Right of first refusal on share buyback",
      "Right to receive monthly dividend",
    ],
    obligations: ["Không rút vốn trong kỳ hạn 36 tháng", "Cam kết không cạnh tranh trong lĩnh vực đầu tư", "Thông báo trước 90 ngày khi chuyển nhượng"],
    obligationsEn: ["No capital withdrawal within 36-month term", "Non-compete commitment in investment domain", "90-day notice for share transfer"],
    documents: ["Hợp đồng đối tác chiến lược", "Thỏa thuận không cạnh tranh (NCA)", "Điều lệ cổ đông chiến lược"],
    isFeatured: true,
    status: "active",
    sortOrder: 4,
  },
  {
    tier: "anchor",
    name: "Gói Neo Đậu",
    nameEn: "Anchor Package",
    tagline: "Nhà đầu tư neo đậu — Nền tảng vững chắc",
    taglineEn: "Anchor investor — Solid foundation",
    minAmount: 2000000,
    maxAmount: null,
    currency: "USD",
    annualReturn: "20%+",
    lockupPeriod: "60 tháng",
    dividendFrequency: "Hàng tháng",
    shareholderType: "Cổ đông neo đậu",
    description: "Gói đặc biệt dành cho nhà đầu tư neo đậu với quy mô vốn từ 2 triệu USD, được hưởng quyền lợi độc quyền tối cao.",
    descriptionEn: "Exclusive package for anchor investors with capital from USD 2M, enjoying the highest exclusive benefits.",
    benefits: [
      "Lãi suất hàng năm 20%+",
      "Cổ tức chi trả hàng tháng",
      "Ghế hội đồng quản trị (nếu đủ điều kiện)",
      "Quyền phủ quyết các quyết định chiến lược lớn",
      "Báo cáo tài chính thời gian thực",
      "Đội ngũ dịch vụ khách hàng VIP riêng",
      "Tiếp cận độc quyền các deal đầu tư trước khi phát hành rộng",
    ],
    benefitsEn: [
      "Annual return 20%+",
      "Monthly dividend payments",
      "Board seat (if qualified)",
      "Veto rights on major strategic decisions",
      "Real-time financial reporting",
      "Dedicated VIP client service team",
      "Exclusive access to pre-release investment deals",
    ],
    rights: [
      "Quyền biểu quyết tối cao tại ĐHCĐ",
      "Quyền tham gia và bỏ phiếu HĐQT",
      "Quyền phủ quyết nghị quyết chiến lược",
      "Quyền ưu tiên tuyệt đối mua cổ phần mới",
      "Quyền nhận cổ tức hàng tháng",
    ],
    rightsEn: [
      "Supreme voting rights at AGM",
      "Board membership and voting rights",
      "Veto rights on strategic resolutions",
      "Absolute pre-emptive right on new shares",
      "Right to receive monthly dividend",
    ],
    obligations: ["Không rút vốn trong kỳ hạn 60 tháng", "Cam kết đồng hành dài hạn với Fortress", "Cam kết không cạnh tranh toàn diện", "Thông báo trước 120 ngày khi chuyển nhượng"],
    obligationsEn: ["No capital withdrawal within 60-month term", "Long-term commitment with Fortress", "Comprehensive non-compete commitment", "120-day notice for share transfer"],
    documents: ["Hợp đồng neo đậu (Anchor Agreement)", "Thỏa thuận HĐQT (nếu có)", "NCA toàn diện", "Điều lệ cổ đông neo đậu"],
    isFeatured: true,
    status: "active",
    sortOrder: 5,
  },
];

// ── Main seed function ────────────────────────────────────────────

async function seed() {
  console.log("[SEED] Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  // ── Admin ──────────────────────────────────────────────────────
  console.log("[SEED] Seeding admin user...");
  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`[SEED] ✓ Admin already exists: ${ADMIN_EMAIL}`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    });
    console.log(`[SEED] ✓ Created admin: ${ADMIN_EMAIL}`);
  }

  // ── Settings ───────────────────────────────────────────────────
  console.log("[SEED] Seeding default settings...");
  let settingsSeedCount = 0;
  for (const s of defaultSettings) {
    const existing = await Settings.findOne({ key: s.key });
    if (!existing) {
      await Settings.create(s);
      settingsSeedCount++;
    }
  }
  if (settingsSeedCount > 0) {
    console.log(`[SEED] ✓ Created ${settingsSeedCount} default settings`);
  } else {
    console.log("[SEED] ✓ Settings already exist — skipped");
  }

  // ── Investment Plans ───────────────────────────────────────────
  console.log("[SEED] Seeding investment plans...");
  const existingPlans = await InvestmentPlan.countDocuments();
  if (existingPlans === 0 || FORCE) {
    if (FORCE && existingPlans > 0) {
      await InvestmentPlan.deleteMany({});
      console.log(`[SEED] ✓ Cleared ${existingPlans} existing plans (--force)`);
    }
    await InvestmentPlan.insertMany(investmentPlans);
    console.log(`[SEED] ✓ Created ${investmentPlans.length} investment plans`);
  } else {
    console.log(`[SEED] ✓ Investment plans already exist (${existingPlans} found) — use --force to overwrite`);
  }

  // ── Demo enquiries (development only) ─────────────────────────
  if (NODE_ENV === "development") {
    console.log("[SEED] Seeding demo enquiries...");
    const existingEnquiries = await Enquiry.countDocuments();
    if (existingEnquiries === 0) {
      await Enquiry.insertMany(demoEnquiries);
      console.log(`[SEED] ✓ Created ${demoEnquiries.length} demo enquiries`);
    } else {
      console.log(`[SEED] ✓ Demo enquiries already exist (${existingEnquiries} found)`);
    }
  } else {
    console.log("[SEED] Skipping demo enquiries (production mode)");
  }

  console.log("[SEED] ✅ Seed complete!");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("[SEED] ❌ Error:", err);
  process.exit(1);
});
