/**
 * src/core/database/db.ts
 *
 * Mongoose connection helper with per-process caching.
 *
 * Connection options are sized for a PM2-cluster Node.js deployment (2–4 workers).
 * Each worker keeps its own pool: maxPoolSize 10, minPoolSize 2.
 *
 * On first connection the function seeds a default superadmin if the Admin
 * collection is empty and ADMIN_EMAIL + ADMIN_PASSWORD are set.
 *
 * Every API route / server action must call `await connectDB()` before
 * issuing any Mongoose query.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/modules/auth/model";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
  seeded: false,
};
global._mongooseCache = cached;

// ─── Default superadmin seed ─────────────────────────────────────────────────

async function seedAdmin(): Promise<void> {
  if (cached.seeded) return;
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      cached.seeded = true;
      return;
    }

    const email = process.env.ADMIN_EMAIL || "admin@axvn.vn";
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "AXVN Admin";

    if (!password) return; // Skip seed if no password is configured

    await Admin.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: "superadmin",
    });

    cached.seeded = true;
  } catch {
    // Seed errors are non-fatal — the instance may already be seeded
    // by another worker in the cluster.
  }
}

// ─── Connection ───────────────────────────────────────────────────────────────

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      connectTimeoutMS: 10_000,         // Abort connection attempts after 10s
      serverSelectionTimeoutMS: 10_000, // Give up on server discovery after 10s
      socketTimeoutMS: 45_000,          // Close idle sockets after 45s
      maxPoolSize: 10,                  // Max concurrent connections per worker
      minPoolSize: 2,                   // Keep 2 warm connections alive
      heartbeatFrequencyMS: 10_000,     // Check connection health every 10s
      retryWrites: true,
      retryReads: true,
    });
  }

  try {
    cached.conn = await cached.promise;
    await seedAdmin();
  } catch (err) {
    cached.promise = null; // Allow retry on next call
    throw err;
  }

  return cached.conn;
}

// ─── Health check ─────────────────────────────────────────────────────────────

/**
 * Returns true if the Mongoose connection is currently established.
 * Used by GET /api/health.
 */
export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
