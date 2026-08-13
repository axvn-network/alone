/**
 * src/lib/db.ts
 *
 * Mongoose connection helper with connection caching.
 * On first call seeds a default superadmin if the Admin collection is empty.
 * Every API route / service must call `await connectDB()` before any query.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

const g = globalThis as typeof globalThis & { _mongoose?: MongooseCache };
const cached: MongooseCache = g._mongoose ?? { conn: null, promise: null, seeded: false };
if (!g._mongoose) g._mongoose = cached;

async function seedAdmin() {
  if (cached.seeded) return;
  try {
    const count = await Admin.countDocuments();
    if (count > 0) { cached.seeded = true; return; }

    const email = process.env.ADMIN_EMAIL || "admin@axvn.vn";
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Admin";

    if (!password) return; // No password set — skip seeding

    await Admin.create({ name, email, password: await bcrypt.hash(password, 12), role: "superadmin" });
    cached.seeded = true;
  } catch {
    // Seed errors are non-fatal — primary DB may handle auth separately
  }
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    await seedAdmin();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
