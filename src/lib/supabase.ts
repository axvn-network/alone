import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSsrClient } from "@supabase/ssr";
import { cookies } from "next/headers";

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qawgducimlnketpfitjb.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_jkFjVSnGYPO6EV84NHQzuA_LfJ9KPjw";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminClient) return supabaseAdminClient;

  supabaseAdminClient = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createSsrClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
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
