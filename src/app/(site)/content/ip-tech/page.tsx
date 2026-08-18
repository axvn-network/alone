import type { Metadata } from "next";
import { Cpu, Layers, ShieldCheck, Code2 } from "lucide-react";

// Static page — no DB queries. Cached at build time.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "IP & Công Nghệ | AXVN Tech Holding",
  description:
    "Tài sản sở hữu trí tuệ và nền tảng công nghệ của AXVN Tech Holding — hạ tầng số cho tài chính Việt Nam.",
  openGraph: {
    title: "IP & Công Nghệ | AXVN Tech Holding",
    url: "https://axvn.vn/ip-tech",
  },
};

const PILLARS = [
  {
    icon: Code2,
    title: "Core Platform",
    desc: "Nền tảng giao dịch tài sản mã hóa và thanh toán số tuân thủ pháp lý Việt Nam (NQ 05/2025).",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Engine",
    desc: "Bộ công cụ KYC/AML/VASP tự động hóa quy trình tuân thủ theo chuẩn FATF và Luật 14/2022.",
  },
  {
    icon: Layers,
    title: "Smart Contract Layer",
    desc: "Hợp đồng thông minh được kiểm toán bảo mật, triển khai trên EVM-compatible chain.",
  },
  {
    icon: Cpu,
    title: "AI & Analytics",
    desc: "Mô hình phân tích rủi ro, dự báo thị trường và giám sát giao dịch theo thời gian thực.",
  },
];

export default function IPTechPage() {
  return (
    <main className="min-h-screen bg-AXVN-navy text-AXVN-ivory pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-AXVN-gold text-sm tracking-widest uppercase font-medium mb-3">
            Sở Hữu Trí Tuệ & Công Nghệ
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Hạ Tầng Công Nghệ AXVN
          </h1>
          <p className="text-AXVN-silver/70 max-w-2xl mx-auto leading-relaxed">
            AXVN Tech Holding xây dựng tài sản IP và nền tảng công nghệ cốt lõi
            phục vụ hệ sinh thái tài chính số Việt Nam.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-AXVN-deep border border-AXVN-gold/10 rounded-2xl hover:border-AXVN-gold/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-AXVN-gold/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-AXVN-gold" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-AXVN-silver/60 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="p-5 border border-AXVN-gold/20 rounded-xl bg-AXVN-gold/5 text-center">
          <p className="text-AXVN-silver/70 text-sm">
            Chi tiết kỹ thuật và kiến trúc hệ thống được cung cấp theo yêu cầu,
            sau khi hoàn tất quy trình đánh giá đối tác.
          </p>
        </div>
      </div>
    </main>
  );
}
