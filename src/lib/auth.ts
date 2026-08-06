import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

let client: MongoClient | null = null;
let authInstance!: ReturnType<typeof betterAuth>;

export async function getAuth() {
  if (!authInstance) {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
    }
    const db = client.db();

    authInstance = betterAuth({
      appName: "Fortress Investment Holdings",
      database: mongodbAdapter(db, { usePlural: true }),
      emailAndPassword: {
        enabled: true,
        disableSignUp: true,
      },
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      secret: process.env.BETTER_AUTH_SECRET || "change-this-secret-in-production",
    }) as ReturnType<typeof betterAuth>;
  }
  return authInstance;
}
