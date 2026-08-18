"use client";

/**
 * /register — Trang đăng ký tài khoản Người Dùng Công Khai.
 * Giao diện theo design AXVN (dark navy + gold accent).
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  User,
  Phone,
  Newspaper,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    newsletterSubscribed: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (!form.email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }
    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          newsletterSubscribed: form.newsletterSubscribed,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-AXVN-navy flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
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
              Tạo Tài Khoản
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#06101a] border border-AXVN-gold/15 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-AXVN-ivory font-semibold text-xl mb-1">
            Đăng ký tài khoản
          </h1>
          <p className="text-AXVN-silver/50 text-sm mb-7">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-AXVN-gold hover:text-AXVN-champagne transition-colors font-medium"
            >
              Đăng nhập
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Họ tên */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Họ và tên <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-xl"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-xl"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Điện thoại{" "}
                <span className="text-AXVN-silver/30 font-normal">
                  (tùy chọn)
                </span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  autoComplete="tel"
                  className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-xl"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Mật khẩu <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Ít nhất 8 ký tự"
                  autoComplete="new-password"
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

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-AXVN-silver/70 text-xs font-medium mb-1.5 tracking-wide">
                Xác nhận mật khẩu <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/30" />
                <input
                  name="confirmPassword"
                  type={showCpw ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm pl-10 pr-11 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowCpw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-AXVN-silver/30 hover:text-AXVN-silver transition-colors"
                >
                  {showCpw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Đăng ký bản tin */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                name="newsletterSubscribed"
                type="checkbox"
                checked={form.newsletterSubscribed}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-AXVN-deep text-AXVN-gold focus:ring-AXVN-gold/50 cursor-pointer"
              />
              <span className="text-AXVN-silver/60 text-xs leading-relaxed group-hover:text-AXVN-silver/80 transition-colors flex items-start gap-1.5">
                <Newspaper className="w-3.5 h-3.5 shrink-0 mt-0.5 text-AXVN-silver/40" />
                Tôi muốn nhận thông tin cập nhật và bản tin từ AXVN Tech Holding
              </span>
            </label>

            {/* Lỗi */}
            {error && (
              <p className="text-red-400 text-xs bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2.5 leading-relaxed">
                {error}
              </p>
            )}

            {/* Nút đăng ký */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm uppercase tracking-[0.12em] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                "Tạo Tài Khoản"
              )}
            </button>

            {/* Điều khoản */}
            <p className="text-AXVN-silver/25 text-[11px] text-center leading-relaxed">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link
                href="/terms-of-use"
                className="text-AXVN-gold/50 hover:text-AXVN-gold transition-colors"
              >
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy-policy"
                className="text-AXVN-gold/50 hover:text-AXVN-gold transition-colors"
              >
                Chính sách bảo mật
              </Link>
              .
            </p>
          </form>
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
