/**
 * scripts/migrate-db-fields.js
 *
 * Bổ sung các fields còn thiếu trong MongoDB so với Mongoose schema hiện tại.
 *
 * Chạy: node scripts/migrate-db-fields.js
 *
 * Idempotent: chỉ $set nếu field chưa tồn tại ($setOnInsert-like via $exists check).
 */

"use strict";

const path = require("path");
const mongoose = require(path.resolve("node_modules/mongoose"));
require(path.resolve("node_modules/dotenv")).config({ path: path.resolve(".env.local") });

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function updateMissing(collection, filter, fieldsToAdd, label) {
  const result = await collection.updateMany(filter, { $set: fieldsToAdd });
  console.log(`  [${label}] matched=${result.matchedCount} modified=${result.modifiedCount}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("MONGODB_URI not set"); process.exit(1); }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log("\n=== Migration: bổ sung fields còn thiếu ===\n");

  // ── 1. admins ──────────────────────────────────────────────────────────────
  console.log("1. admins");
  const admins = db.collection("admins");

  // isActive thiếu trên admin cũ (admin@fortressih.com)
  await updateMissing(
    admins,
    { isActive: { $exists: false } },
    { isActive: true },
    "isActive missing → true"
  );

  // passwordChangedAt thiếu
  await updateMissing(
    admins,
    { passwordChangedAt: { $exists: false } },
    { passwordChangedAt: null },
    "passwordChangedAt missing → null"
  );

  // ── 2. settings ───────────────────────────────────────────────────────────
  console.log("\n2. settings");
  const settings = db.collection("settings");

  await updateMissing(
    settings,
    { chatButtons: { $exists: false } },
    {
      chatButtons: [
        {
          type: "whatsapp",
          enabled: false,
          value: "",
          messageVi: "Xin chào, tôi muốn tìm hiểu thêm về GVI Tech Holding.",
          messageEn: "Hello, I would like to enquire about GVI Tech Holding.",
          label: "WhatsApp",
          order: 0,
        },
      ],
    },
    "chatButtons missing → default"
  );

  await updateMissing(
    settings,
    { seoDefaults: { $exists: false } },
    {
      seoDefaults: {
        titleSuffix: " | GVI Tech Holding",
        defaultOgImage: "",
        defaultDescription: "",
      },
    },
    "seoDefaults missing → default"
  );

  await updateMissing(
    settings,
    { maintenanceMode: { $exists: false } },
    {
      maintenanceMode: false,
      maintenanceMessage:
        "We are performing scheduled maintenance. Please check back soon.",
    },
    "maintenanceMode missing → false"
  );

  // ── 3. blogs ──────────────────────────────────────────────────────────────
  console.log("\n3. blogs");
  const blogs = db.collection("blogs");

  await updateMissing(blogs, { titleEn:          { $exists: false } }, { titleEn: ""                  }, "titleEn");
  await updateMissing(blogs, { excerptEn:         { $exists: false } }, { excerptEn: ""                }, "excerptEn");
  await updateMissing(blogs, { contentEn:         { $exists: false } }, { contentEn: ""               }, "contentEn");
  await updateMissing(blogs, { featuredImageAlt:  { $exists: false } }, { featuredImageAlt: ""        }, "featuredImageAlt");
  await updateMissing(blogs, { author:            { $exists: false } }, { author: "GVI Tech Holding"  }, "author");
  await updateMissing(blogs, { viewCount:         { $exists: false } }, { viewCount: 0                }, "viewCount");

  // seo sub-doc — ensure all sub-fields exist
  await updateMissing(
    blogs,
    { "seo.canonicalUrl": { $exists: false } },
    { "seo.canonicalUrl": "" },
    "seo.canonicalUrl"
  );
  await updateMissing(
    blogs,
    { "seo.ogImage": { $exists: false } },
    { "seo.ogImage": "" },
    "seo.ogImage"
  );
  await updateMissing(
    blogs,
    { "seo.keywords": { $exists: false } },
    { "seo.keywords": "" },
    "seo.keywords"
  );

  // ── 4. documents ──────────────────────────────────────────────────────────
  console.log("\n4. documents");
  const documents = db.collection("documents");

  await updateMissing(documents, { fileSize:      { $exists: false } }, { fileSize: 0        }, "fileSize");
  await updateMissing(documents, { downloadCount: { $exists: false } }, { downloadCount: 0   }, "downloadCount");
  await updateMissing(documents, { quarter:       { $exists: false } }, { quarter: null       }, "quarter");
  await updateMissing(documents, { language:      { $exists: false } }, { language: "vi"     }, "language");
  await updateMissing(documents, { reportType:    { $exists: false } }, { reportType: ""     }, "reportType");
  await updateMissing(documents, { internalNotes: { $exists: false } }, { internalNotes: "" }, "internalNotes");

  // fileType: đặt thành "pdf" nếu thiếu (mặc định schema)
  await updateMissing(
    documents,
    { fileType: { $exists: false } },
    { fileType: "pdf" },
    "fileType"
  );

  // ── 5. pages ──────────────────────────────────────────────────────────────
  console.log("\n5. pages");
  const pages = db.collection("pages");

  await updateMissing(
    pages,
    { isPublished: { $exists: false } },
    { isPublished: true },
    "isPublished missing → true"
  );

  await updateMissing(
    pages,
    { data: { $exists: false } },
    { data: {} },
    "data missing → {}"
  );

  await updateMissing(
    pages,
    { hero: { $exists: false } },
    { hero: {} },
    "hero missing → {}"
  );

  // ── 6. Verify ─────────────────────────────────────────────────────────────
  console.log("\n=== Verify sau migration ===\n");

  const adminCheck = await db.collection("admins").findOne({ isActive: { $exists: false } });
  console.log("admins without isActive:", adminCheck ? "FOUND (chưa fix)" : "0 ✓");

  const settingsDoc = await settings.findOne({});
  console.log("settings.chatButtons:", Array.isArray(settingsDoc.chatButtons) ? "✓" : "MISSING");
  console.log("settings.seoDefaults:", settingsDoc.seoDefaults ? "✓" : "MISSING");
  console.log("settings.maintenanceMode:", settingsDoc.maintenanceMode !== undefined ? "✓" : "MISSING");

  const blogMissingCount = await blogs.countDocuments({ viewCount: { $exists: false } });
  console.log("blogs without viewCount:", blogMissingCount === 0 ? "0 ✓" : blogMissingCount + " REMAINING");

  const docMissingCount = await documents.countDocuments({ fileSize: { $exists: false } });
  console.log("documents without fileSize:", docMissingCount === 0 ? "0 ✓" : docMissingCount + " REMAINING");

  const pageMissingCount = await pages.countDocuments({ isPublished: { $exists: false } });
  console.log("pages without isPublished:", pageMissingCount === 0 ? "0 ✓" : pageMissingCount + " REMAINING");

  console.log("\nMigration hoàn thành.\n");

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("Migration error:", e.message);
  process.exit(1);
});
