import { Pool } from "pg";

let pool: Pool | null = null;

export function getPostgresPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.NETLIFY_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Missing NETLIFY_DATABASE_URL, DATABASE_URL, or POSTGRES_URL environment variable.");
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  return pool;
}

export async function queryPostgres(text: string, params?: unknown[]) {
  const p = getPostgresPool();
  const res = await p.query(text, params);
  return res;
}

export async function initPostgresTables() {
  const p = getPostgresPool();
  
  // Create users table
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50) DEFAULT '',
      balance NUMERIC(15, 2) DEFAULT 0.00,
      role VARCHAR(50) DEFAULT 'user',
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create transactions table
  await p.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      transaction_id VARCHAR(100) UNIQUE NOT NULL,
      user_id VARCHAR(100) NOT NULL,
      transaction_type VARCHAR(50) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      amount NUMERIC(15, 2) NOT NULL,
      fee NUMERIC(15, 2) DEFAULT 0.00,
      balance_after NUMERIC(15, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      reference_code VARCHAR(100) DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create orders table
  await p.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(100) UNIQUE NOT NULL,
      user_id VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount NUMERIC(15, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("[Netlify Postgres] Tables initialized successfully.");
}
