"use client";

import { useState, FormEvent } from "react";
import {
  PieChart,
  Target,
  Briefcase,
  Building2,
  Send,
  CheckCircle2,
} from "lucide-react";

const enquiryTypes = [
  {
    id: "individual",
    label: "Cá Nhân / Nhà Đầu Tư Dài Hạn",
    icon: PieChart,
    description: "Góp vốn, nhận cổ tức, dự ĐHCĐ.",
  },
  {
    id: "org-vn",
    label: "Tổ Chức / Doanh Nghiệp Trong Nước",
    icon: Building2,
    description: "Cổ đông chiến lược, ngân hàng, quỹ, CTCK.",
  },
  {
    id: "tech-legal",
    label: "Đối Tác Công Nghệ / Pháp Lý",
    icon: Target,
    description: "Đóng góp năng lực kỹ thuật, pháp lý — không chỉ vốn.",
  },
  {
    id: "foreign",
    label: "Nhà Đầu Tư / Tổ Chức Nước Ngoài",
    icon: Briefcase,
    description: "Tham gia theo giới hạn 49% theo NQ 05/2025.",
  },
];

const INVESTMENT_RANGES = [
  { value: "duoi-3ty", label: "< 3 tỷ" },
  { value: "3ty-6ty", label: "3 – 6 tỷ" },
  { value: "6ty-30ty", label: "6 – 30 tỷ" },
  { value: "30ty-60ty", label: "30 – 60 tỷ" },
  { value: "60ty-150ty", label: "60 – 150 tỷ" },
  { value: "tren-150ty", label: "> 150 tỷ" },
];

const PARTNERSHIP_PLANS = [
  { value: "", label: "Chưa chọn — tôi muốn tìm hiểu thêm" },
  { value: "Hạng Mục Hạt Giống", label: "Hạt Giống — từ 500 triệu VNĐ" },
  { value: "Hạng Mục Tăng Trưởng", label: "Tăng Trưởng — từ 2 tỷ VNĐ" },
  { value: "Hạng Mục Mở Rộng", label: "Mở Rộng — từ 5 tỷ VNĐ" },
  { value: "Hạng Mục Chiến Lược", label: "Chiến Lược — từ 15 tỷ VNĐ" },
  { value: "Hạng Mục Neo Chiến Lược", label: "Neo Chiến Lược — từ 50 tỷ VNĐ" },
];

export default function InvestorForm({
  defaultPlan = "",
}: {
  defaultPlan?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "",
    investmentRange: "",
    partnershipPlan: defaultPlan,
    objectives: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const enriched = {
      ...formData,
      subject: formData.partnershipPlan
        ? `Gói: ${formData.partnershipPlan}`
        : formData.enquiryType,
      message: [
        formData.partnershipPlan &&
          `[Gói quan tâm: ${formData.partnershipPlan}]`,
        formData.investmentRange && `[Quy mô vốn: ${formData.investmentRange}]`,
        formData.objectives,
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
    await fetch("/api/partner-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-AXVN-gold/10 flex items-center justify-center mx-auto mb-6 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-AXVN-gold" />
        </div>
        <h3 className="text-xl font-bold text-AXVN-ivory mb-3">
          Chúng tôi đã nhận được thông tin
          {formData.name ? `, ${formData.name}` : ""}.
        </h3>
        <p className="text-AXVN-silver/75 max-w-md mx-auto text-sm leading-relaxed">
          Đội ngũ AXVN Tech Holding sẽ phản hồi trong 2–3 ngày làm việc. Không
          có bot, không có mẫu tự động — người thật đọc và người thật trả lời.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Bước 1 — Bạn là ai? */}
      <div>
        <label className="block text-AXVN-ivory font-medium mb-4 text-sm">
          Bạn tham gia với tư cách nào? *
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {enquiryTypes.map((type) => (
            <label
              key={type.id}
              className={`flex items-start gap-3 p-4 border cursor-pointer transition-all duration-200 ${
                formData.enquiryType === type.id
                  ? "border-AXVN-gold/50 bg-AXVN-gold/5"
                  : "border-AXVN-gold/10 bg-AXVN-deep/50 hover:border-AXVN-gold/25"
              }`}
            >
              <input
                type="radio"
                name="enquiryType"
                value={type.id}
                checked={formData.enquiryType === type.id}
                onChange={handleChange}
                required
                className="sr-only"
              />
              <div
                className={`w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  formData.enquiryType === type.id
                    ? "bg-AXVN-gold/20"
                    : "bg-white/5"
                }`}
              >
                <type.icon
                  className={`w-4 h-4 ${
                    formData.enquiryType === type.id
                      ? "text-AXVN-gold"
                      : "text-AXVN-silver"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`font-medium text-sm ${
                    formData.enquiryType === type.id
                      ? "text-AXVN-gold"
                      : "text-AXVN-ivory"
                  }`}
                >
                  {type.label}
                </p>
                <p className="text-AXVN-silver/70 text-xs mt-0.5">
                  {type.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bước 2 — Liên hệ */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-AXVN-silver text-sm mb-2">
            Tên của bạn
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/40 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <label className="block text-AXVN-silver text-sm mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/40 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm"
            placeholder="+84 90 XXX XXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-AXVN-silver text-sm mb-2">
          Địa chỉ Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/40 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm"
          placeholder="email@company.com"
        />
      </div>

      {/* Bước 3 — Quy mô vốn (chips) */}
      <div>
        <label className="block text-AXVN-silver text-sm mb-3">
          Quy mô vốn dự kiến (VNĐ)
        </label>
        <div className="flex flex-wrap gap-2">
          {INVESTMENT_RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  investmentRange:
                    prev.investmentRange === r.value ? "" : r.value,
                }))
              }
              className={`px-4 py-2 text-sm border transition-all duration-150 rounded-sm ${
                formData.investmentRange === r.value
                  ? "border-AXVN-gold/60 bg-AXVN-gold/10 text-AXVN-gold"
                  : "border-AXVN-gold/15 bg-AXVN-deep/40 text-AXVN-silver hover:border-AXVN-gold/35 hover:text-AXVN-ivory"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bước 4 — Gói hợp tác */}
      <div>
        <label className="block text-AXVN-silver text-sm mb-2">
          Hạng mục hợp tác quan tâm
        </label>
        <select
          name="partnershipPlan"
          value={formData.partnershipPlan}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory focus:outline-none focus:border-AXVN-gold/50 transition-colors appearance-none rounded-sm"
        >
          {PARTNERSHIP_PLANS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <p className="text-AXVN-silver/40 text-xs mt-1.5">
          Xem chi tiết:{" "}
          <a
            href="/invest-with-axvn/plans"
            target="_blank"
            className="text-AXVN-gold/70 underline hover:text-AXVN-gold transition-colors"
          >
            /invest-with-axvn/plans
          </a>
        </p>
      </div>

      {/* Bước 5 — Lời nhắn */}
      <div>
        <label className="block text-AXVN-silver text-sm mb-2">
          Bạn muốn nói gì với chúng tôi? *
        </label>
        <textarea
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/40 focus:outline-none focus:border-AXVN-gold/50 transition-colors resize-none rounded-sm"
          placeholder="Chia sẻ ngắn gọn: bạn thấy cơ hội gì, bạn muốn đóng góp gì, và bạn kỳ vọng gì trong dài hạn."
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm hover:shadow-2xl hover:shadow-AXVN-gold/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 rounded-sm"
        >
          <Send className="w-4 h-4" />
          Gửi Thông Tin Kết Nối
        </button>
        <p className="text-AXVN-silver/40 text-xs mt-4">
          Mọi thông tin được bảo mật. Đây không phải cam kết hay hợp đồng — chỉ
          là bước đầu để chúng ta có thể nói chuyện với nhau.
        </p>
      </div>
    </form>
  );
}
