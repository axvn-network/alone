import { getCurrentUser } from "@/core/security/auth-utils";
import { successResponse, unauthorizedResponse } from "@/utils/api-response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  return successResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
