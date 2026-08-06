import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import { getSupabase, getSupabaseAdmin } from "./supabase";
import { queryPostgres } from "./postgres";

const getMongoUri = () => process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose ?? { conn: null, promise: null, seeded: false };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function seedAdmin() {
  if (cached.seeded) return;

  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      cached.seeded = true;
      return;
    }

    const email = process.env.ADMIN_EMAIL || "admin@fortressih.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin";

    const hashedPassword = await bcrypt.hash(password, 12);
    await Admin.create({ name, email, password: hashedPassword, role: "superadmin" });

    console.log(`[Seed] Admin user created: ${email}`);
    cached.seeded = true;
  } catch (e) {
    console.warn("[Seed] Admin seed warning:", e);
  }
}

export async function connectDB(): Promise<typeof mongoose | null> {
  // If Supabase environment is set, Supabase is active
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("[DB] Using Supabase Database");
    return null;
  }

  const uri = getMongoUri();
  if (!uri) {
    console.warn("[DB] MONGODB_URI not defined. Operating with Supabase / Mock DB.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    await seedAdmin();
  } catch (e) {
    cached.promise = null;
    console.warn("[DB] MongoDB connection failed, falling back to Supabase/Postgres:", e);
  }

  return cached.conn;
}

export { getSupabase, getSupabaseAdmin, queryPostgres };
