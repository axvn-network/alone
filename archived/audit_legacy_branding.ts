/**
 * Read-only audit for legacy public-brand strings in MongoDB content.
 *
 * Usage: npm run audit:brand
 * Requires MONGODB_URI in .env.local or the environment. This script never
 * updates, deletes, or otherwise mutates database documents.
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
const terms = ["fortress", "fortressih", "fortressih.com"];
const pattern = new RegExp(terms.map(escapeRegExp).join("|"), "i");
const collectionNames = ["settings", "pages", "blogs", "documents", "investmentplans"];

type Match = {
  collection: string;
  id: string;
  paths: string[];
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchingPaths(value: unknown, path = "", found: string[] = []): string[] {
  if (typeof value === "string") {
    if (pattern.test(value)) found.push(path || "$");
    return found;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => matchingPaths(item, `${path}[${index}]`, found));
    return found;
  }

  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
      matchingPaths(item, path ? `${path}.${key}` : key, found);
    });
  }

  return found;
}

async function run() {
  if (!uri) {
    console.log(JSON.stringify({
      status: "skipped",
      reason: "MONGODB_URI is not configured; no database connection was opened.",
      mutation: false,
    }, null, 2));
    return;
  }

  await mongoose.connect(uri, { bufferCommands: false });
  try {
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB database handle is unavailable");

    const available = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name));
    const matches: Match[] = [];

    for (const collection of collectionNames) {
      if (!available.has(collection)) continue;
      const docs = await db.collection(collection).find({}).toArray();
      for (const document of docs) {
        const paths = matchingPaths(document);
        if (paths.length > 0) {
          matches.push({ collection, id: String(document._id), paths });
        }
      }
    }

    console.log(JSON.stringify({
      status: "ok",
      mutation: false,
      terms,
      collections_checked: collectionNames.filter((name) => available.has(name)),
      records_with_legacy_branding: matches.length,
      matches,
    }, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(async (error) => {
  console.error(JSON.stringify({
    status: "error",
    mutation: false,
    message: error instanceof Error ? error.message : String(error),
  }, null, 2));
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
