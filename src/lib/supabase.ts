import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminClient) return supabaseAdminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-service-key";

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

export interface SupabaseUser {
  id?: string;
  user_id: string;
  email: string;
  username: string;
  password?: string;
  full_name: string;
  phone_number?: string;
  balance: number;
  role: "superadmin" | "admin" | "agent" | "support" | "user";
  status: "active" | "inactive" | "suspended";
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseTransaction {
  id?: string;
  transaction_id: string;
  user_id: string;
  transaction_type: "recharge" | "withdraw" | "order" | "adjustment";
  payment_method: "momo" | "bank" | "usdt" | "telco";
  amount: number;
  fee?: number;
  balance_after: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  reference_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseOrder {
  id?: string;
  order_id: string;
  user_id: string;
  title: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export default getSupabase;
