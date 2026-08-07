const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * MongoDB Seed Script — Fortress Investment Holdings
 * 
 * Seeds:
 *   - Admin user (from ADMIN_EMAIL / ADMIN_PASSWORD)
 *   - Demo enquiries (development only)
 * 
 * Usage:
 *   node scripts/seed-mongo.js
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

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env.local");
  process.exit(1);
}

if (!ADMIN_PASSWORD) {
  console.error("❌ ADMIN_PASSWORD not set in .env.local");
  process.exit(1);
}

// ── Admin Schema ────────────────────────────────────────────────
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

// ── Enquiry Schema ──────────────────────────────────────────────
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

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

// ── Seed data ───────────────────────────────────────────────────
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

// ── Main seed function ──────────────────────────────────────────
async function seed() {
  console.log("[SEED] Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

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

  // Only seed demo data in development
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
    console.log("[SEED] Skipping demo data (production mode)");
  }

  console.log("[SEED] ✅ Seed complete!");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("[SEED] ❌ Error:", err);
  process.exit(1);
});
