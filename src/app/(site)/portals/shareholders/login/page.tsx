"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Loader2, Shield } from "lucide-react";

export default function ShareholderLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shareholders/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError("Email hoặc mật khẩu không đúng. Vui lòng liên hệ admin nếu bạn chưa có tài khoản.");
        setLoading(false);
        return;
      }
      router.push("/portals/shareholders/dashboard");
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gvi-navy flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#C9A24A_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gvi-gold/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/large-logo.png" alt="GVI Tech Holding" width={180} height={50} className="h-10 w-auto mx-auto object-contain brightness-110" />
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-3.5 h-3.5 text-gvi-gold" />
            <span className="text-gvi-gold text-xs font-semibold tracking-widest uppercase">Cổ Đông Portal</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#06101a] border border-gvi-gold/15 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-gvi-ivory font-semibold text-xl mb-1">Đăng nhập</h1>
          <p className="text-gvi-silver/50 text-sm mb-7">Truy cập cổng thông tin cổ đông — dành riêng cho thành viên được chấp thuận.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gvi-silver/70 text-xs font-medium mb-1.5 tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gvi-silver/30" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder="your@email.com"
                  className="w-full bg-gvi-deep border border-white/10 text-gvi-ivory text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gvi-gold/50 transition-colors rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block text-gvi-silver/70 text-xs font-medium mb-1.5 tracking-wide">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gvi-silver/30" />
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="w-full bg-gvi-deep border border-white/10 text-gvi-ivory text-sm pl-10 pr-11 py-3 focus:outline-none focus:border-gvi-gold/50 transition-colors rounded-xl"
                />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gvi-silver/30 hover:text-gvi-silver transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2.5 leading-relaxed">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gvi-gold to-gvi-champagne text-gvi-navy font-bold text-sm uppercase tracking-[0.12em] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...</> : "Đăng Nhập"}
            </button>
          </form>

          <p className="text-gvi-silver/30 text-xs text-center mt-6 leading-relaxed">
            Chưa có tài khoản? Liên hệ đội ngũ GVI Tech Holding để được cấp quyền truy cập.
          </p>
        </div>

        <p className="text-center text-gvi-silver/20 text-[11px] mt-6">
          GVI Tech Holding — Cổ Đông Portal
        </p>
      </div>
    </div>
  );
}
