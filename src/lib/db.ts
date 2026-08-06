import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";

const getMongoUri = () => process.env.MONGODB_URI!;

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
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
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
    throw e;
  }

  return cached.conn;
}
