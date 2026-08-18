"use client";

/**
 * /login — Trang đăng nhập Người Dùng Công Khai.
 * Giao diện theo design AXVN (dark navy + gold accent).
 */

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Loader2, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message ?? "Email hoặc mật khẩu không chính xác.");
        return;
      }
      const redirectTo = searchParams.get("redirect") ?? "/";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-AXVN-navy flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Nền trang trí */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#C9A24A_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-AXVN-gold/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/large-logo.png"
            alt="AXVN Tech Holding"
            width={180}
            height={50}
            className="h-10 w-auto mx-auto object-contain brightness-110"
          />
          <div className="flex items-center justify-center gap-2 mt-4">
            <User className="w-3.5 h-3.5 text-AXVN-gold" />
            <span className="text-AXVN-gold text-xs font-semibold tracking-widest uppercase">
              Đăng Nhập Tài Khoản
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#06101a] border border-AXVN-gold/15 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-AXVN-ivory font-semibold text-xl mb-1">
            Chào mừng trở lại
          </h1>
          <p className="text-AXVN-silver/50 text-sm mb-7">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-AXVN-gold hover:text-AXVN-champagne transition-colors font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-xl"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm pl-10 pr-11 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-AXVN-silver/30 hover:text-AXVN-silver transition-colors"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Lỗi */}
            {error && (
              <p className="text-red-400 text-xs bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2.5 leading-relaxed">
                {error}
              </p>
            )}

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm uppercase tracking-[0.12em] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...
                </>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>

          <p className="text-AXVN-silver/30 text-xs text-center mt-6 leading-relaxed">
            Tài khoản cổ đông?{" "}
            <Link
              href="/portals/shareholders/login"
              className="text-AXVN-gold/60 hover:text-AXVN-gold transition-colors"
            >
              Vào cổng cổ đông
            </Link>
          </p>
        </div>

        <p className="text-center text-AXVN-silver/20 text-[11px] mt-6">
          <Link
            href="/"
            className="hover:text-AXVN-silver/40 transition-colors"
          >
            ← Quay về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
