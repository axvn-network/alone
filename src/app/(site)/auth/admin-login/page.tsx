import { redirect } from "next/navigation";

/**
 * Legacy / alternate path — /auth/admin-login → /admin-login
 * Preserves the ?redirect= query param so the final login page can still
 * forward the user to their intended destination after authentication.
 */
export default function AuthAdminLoginRedirect({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectTo = searchParams?.redirect;
  const dest = redirectTo
    ? `/admin-login?redirect=${encodeURIComponent(String(redirectTo))}`
    : "/admin-login";
  redirect(dest);
}
