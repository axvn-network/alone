import { getAuth } from "@/lib/auth";

const DISABLED_PATHS = [
  { method: "PUT", path: "/change-password" },
  { method: "POST", path: "/forgot-password" },
  { method: "POST", path: "/reset-password" },
];

async function handler(request: Request) {
  const url = new URL(request.url);
  const method = request.method;

  const isDisabled = DISABLED_PATHS.some(
    (dp) => dp.method === method && url.pathname.endsWith(dp.path)
  );

  if (isDisabled) {
    return new Response(JSON.stringify({ success: false, message: "This endpoint is disabled" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auth = await getAuth();
  return auth.handler(request);
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
