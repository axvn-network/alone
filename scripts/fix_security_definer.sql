-- ===================================================
-- SUPABASE SECURITY FIX: REVOKE PUBLIC EXECUTE ON SECURITY DEFINER
-- ===================================================

-- 1. Switch rls_auto_enable function to SECURITY INVOKER
ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;

-- 2. Revoke execute privileges from public, anon, and authenticated roles
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- 3. Grant execute strictly to service_role and postgres
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO postgres;
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;
