/**
 * src/app/api/auth/route.ts
 *
 * API xác thực cho Người Dùng Công Khai (Public User).
 *
 * ── Các endpoint ──────────────────────────────────────────────────────────────
 *
 *   POST /api/auth
 *     Body: { action: "register" | "login" | "logout" | "me", ...data }
 *
 *   action: "register"
 *     Body: { name, email, password, phone?, newsletterSubscribed? }
 *     → Tạo tài khoản mới, ghi cookie session
 *     → 201 nếu thành công, 400 nếu email đã tồn tại
 *
 *   action: "login"
 *     Body: { email, password }
 *     → Xác thực, ghi cookie session, cập nhật lastLogin
 *     → 200 nếu thành công, 401 nếu sai thông tin
 *
 *   action: "logout"
 *     Body: {} — chỉ cần action
 *     → Xóa cookie session
 *
 *   GET /api/auth
 *     → Trả về thông tin người dùng từ session hiện tại
 *     → 200 nếu có session hợp lệ, 401 nếu không
 *
 *   DELETE /api/auth
 *     → Đăng xuất (xóa cookie)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Bảo mật:
 *   - Không trả về password trong response
 *   - Rate limit: 5 lần đăng ký / 5 lần đăng nhập per IP per phút (progressive lockout)
 *   - Mật khẩu được hash bcrypt với cost factor 12
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/core/database";
import { PublicUser } from "@/modules/public-users";
import {
  makePublicUserToken,
  parsePublicUserToken,
  PUB_COOKIE,
  PUB_MAX_AGE,
} from "@/core/rbac/rbac-lib/public-session";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { rateLimit, clearRateLimit } from "@/utils/rate-limit";
import { logger } from "@/shared/utils/logger";

// ─── Kiểu dữ liệu request ─────────────────────────────────────────────────────

interface RegisterBody {
  action: "register";
  name: string;
  email: string;
  password: string;
  phone?: string;
  newsletterSubscribed?: boolean;
}

interface LoginBody {
  action: "login";
  email: string;
  password: string;
}

interface LogoutBody {
  action: "logout";
}

type AuthBody = RegisterBody | LoginBody | LogoutBody;

// ─── Helper: shape trả về sau khi xác thực ────────────────────────────────────

function safeUser(doc: {
  _id: { toString(): string };
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  newsletterSubscribed: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    emailVerified: doc.emailVerified,
    newsletterSubscribed: doc.newsletterSubscribed,
    lastLogin: doc.lastLogin,
    createdAt: doc.createdAt,
    role: "public" as const, // Vai trò cố định cho Public User
  };
}

// ─── Helper: ghi cookie session ───────────────────────────────────────────────

async function writeSessionCookie(id: string, email: string): Promise<void> {
  const token = makePublicUserToken(id, email);
  const cookieStore = await cookies();
  cookieStore.set(PUB_COOKIE, token, {
    httpOnly: true, // Ngăn JavaScript đọc cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only trong production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: PUB_MAX_AGE, // 7 ngày
  });
}

// ─── Helper: xóa cookie session ──────────────────────────────────────────────

async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PUB_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

// ─── POST /api/auth ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Rate limiting per IP ───────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    const body = (await req.json()) as AuthBody;
    const { action } = body;

    // Apply rate-limit for mutating actions only (register + login)
    if (action === "register" || action === "login") {
      const rateLimitKey = `pub-auth-${action}:${ip}`;
      const limit = rateLimit(rateLimitKey, 5, 60_000);
      if (!limit.allowed) {
        const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
        logger.warn(`[auth/${action}] Rate-limit hit`, { ip });
        return NextResponse.json(
          { success: false, message: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Reset": String(limit.resetAt),
            },
          },
        );
      }
    }

    await connectDB();

    // ── Đăng ký tài khoản mới ─────────────────────────────────────────────
    if (action === "register") {
      const {
        name,
        email,
        password,
        phone = "",
        newsletterSubscribed = false,
      } = body as RegisterBody;

      // Kiểm tra dữ liệu đầu vào
      if (!name?.trim()) return errorResponse("Vui lòng nhập họ tên.");
      if (!email?.trim()) return errorResponse("Vui lòng nhập địa chỉ email.");
      if (!password || password.length < 8)
        return errorResponse("Mật khẩu phải có ít nhất 8 ký tự.");

      // Kiểm tra email đã tồn tại chưa
      const existing = await PublicUser.findOne({
        email: email.toLowerCase().trim(),
      });
      if (existing) {
        return errorResponse("Địa chỉ email này đã được đăng ký.");
      }

      // Tạo tài khoản
      const user = await PublicUser.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // Schema middleware sẽ hash tự động
        phone: phone.trim(),
        newsletterSubscribed,
        emailVerified: false, // Mặc định chưa xác thực email
        isActive: true,
      });

      // Ghi cookie session ngay sau khi đăng ký
      await writeSessionCookie(user._id.toString(), user.email);

      return successResponse(
        safeUser(user.toObject()),
        "Đăng ký thành công!",
        201,
      );
    }

    // ── Đăng nhập ─────────────────────────────────────────────────────────
    if (action === "login") {
      const { email, password } = body as LoginBody;

      if (!email || !password) {
        return unauthorizedResponse("Vui lòng nhập email và mật khẩu.");
      }

      // Tìm người dùng — cần select password (select: false trong schema)
      const user = await PublicUser.findOne({
        email: email.toLowerCase().trim(),
        isActive: true,
      }).select("+password");

      if (!user) {
        // Thông báo chung để tránh user enumeration
        return unauthorizedResponse("Email hoặc mật khẩu không chính xác.");
      }

      // Xác minh mật khẩu
      const passwordOk = await user.comparePassword(password);
      if (!passwordOk) {
        return unauthorizedResponse("Email hoặc mật khẩu không chính xác.");
      }

      // Cập nhật lần đăng nhập cuối
      await PublicUser.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      // Ghi cookie session
      await writeSessionCookie(user._id.toString(), user.email);

      // Xóa rate-limit sau đăng nhập thành công
      clearRateLimit(`pub-auth-login:${ip}`);

      return successResponse(
        safeUser(user.toObject()),
        "Đăng nhập thành công!",
      );
    }

    // ── Đăng xuất ─────────────────────────────────────────────────────────
    if (action === "logout") {
      await clearSessionCookie();
      return successResponse({ ok: true }, "Đã đăng xuất.");
    }

    return errorResponse("Hành động không hợp lệ.");
  } catch (e: unknown) {
    const { message } = handleError(e);
    // Xử lý lỗi duplicate key (MongoDB)
    if (message.includes("duplicate") || message.includes("E11000")) {
      return errorResponse("Địa chỉ email này đã được đăng ký.");
    }
    return serverErrorResponse(message);
  }
}

// ─── GET /api/auth — lấy thông tin phiên hiện tại ─────────────────────────────

export async function GET() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(PUB_COOKIE)?.value;

    if (!raw) {
      return unauthorizedResponse("Bạn chưa đăng nhập.");
    }

    const parsed = parsePublicUserToken(raw);
    if (!parsed) {
      // Token hết hạn hoặc bị giả mạo — xóa cookie rác
      await clearSessionCookie();
      return unauthorizedResponse(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      );
    }

    await connectDB();
    const user = await PublicUser.findById(parsed.id).lean();

    if (!user || !user.isActive) {
      await clearSessionCookie();
      return unauthorizedResponse(
        "Tài khoản không tồn tại hoặc đã bị vô hiệu hoá.",
      );
    }

    return successResponse(safeUser(user as Parameters<typeof safeUser>[0]));
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}

// ─── DELETE /api/auth — đăng xuất ─────────────────────────────────────────────

export async function DELETE() {
  await clearSessionCookie();
  return successResponse({ ok: true }, "Đã đăng xuất.");
}
