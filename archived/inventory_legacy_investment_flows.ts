/**
 * Read-only inventory for the legacy investment-plan runtime and database data.
 *
 * Usage: npm run inventory:legacy-investment
 * The script never mutates MongoDB. It identifies collection presence/counts and
 * documents using public-facing plan fields before a future retirement decision.
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
const collections = ["investmentplans", "enquiries", "shareholders"];

async function run() {
  if (!uri) {
    console.log(JSON.stringify({
      status: "skipped",
      mutation: false,
      reason: "MONGODB_URI is not configured; no database connection was opened.",
      code_references: {
        components: ["src/app/invest-with-fortress/plans/InvestmentPlansClient.tsx", "src/app/invest-with-fortress/plans/RoleSelector.tsx"],
        public_api: "/api/investment-plans",
        admin_api: "/api/admin/investment-plans",
      },
    }, null, 2));
    return;
  }

  await mongoose.connect(uri, { bufferCommands: false });
  try {
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB database handle is unavailable");
    const available = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name));
    const report: Record<string, unknown> = {};

    for (const collection of collections) {
      if (!available.has(collection)) {
        report[collection] = { exists: false, document_count: 0 };
        continue;
      }

      const handle = db.collection(collection);
      const documentCount = await handle.countDocuments();
      if (collection === "investmentplans") {
        const activeCount = await handle.countDocuments({ status: "active" });
        const sample = await handle.find({}, { projection: { _id: 1, name: 1, status: 1, tier: 1, minCommitment: 1, equityRange: 1 } }).limit(10).toArray();
        report[collection] = { exists: true, document_count: documentCount, active_count: activeCount, sample };
      } else if (collection === "enquiries") {
        const legacyOpportunityCount = await handle.countDocuments({ type: "Investment Opportunity" });
        report[collection] = { exists: true, document_count: documentCount, investment_opportunity_count: legacyOpportunityCount };
      } else {
        report[collection] = { exists: true, document_count: documentCount };
      }
    }

    console.log(JSON.stringify({
      status: "ok",
      mutation: false,
      purpose: "Inventory only. Do not remove public API, models, or legacy components until owners approve data retention, export, admin workflow replacement, and route compatibility.",
      code_references: {
        components: ["src/app/invest-with-fortress/plans/InvestmentPlansClient.tsx", "src/app/invest-with-fortress/plans/RoleSelector.tsx"],
        public_api: "/api/investment-plans",
        admin_api: "/api/admin/investment-plans",
        model: "src/models/InvestmentPlan.ts",
      },
      collections: report,
    }, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(async (error) => {
  console.error(JSON.stringify({ status: "error", mutation: false, message: error instanceof Error ? error.message : String(error) }, null, 2));
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
