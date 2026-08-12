"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-gvi-gold/10 border border-gvi-gold/20 flex items-center justify-center mx-auto mb-6 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-gvi-gold" />
        </div>
        <h3
          className="font-semibold text-gvi-navy mb-3 uppercase tracking-[0.06em]"
          style={{ fontSize: "var(--text-h3)" }}
        >
          Yêu Cầu Đã Được Gửi Thành Công
        </h3>
        <p className="text-gvi-navy/60 max-w-md mx-auto leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
          Cảm ơn quý vị đã liên hệ với GVI Tech Holding. Đội ngũ chuyên gia của chúng tôi sẽ phản hồi trong vòng 1–2 ngày làm việc.
        </p>
      </div>
    );
  }

  const inputCls = "w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-gvi-navy/15 text-gvi-navy placeholder:text-gvi-navy/25 focus:outline-none focus-visible:outline-none focus:border-gvi-gold/60 focus:ring-1 focus:ring-gvi-gold/20 transition-colors";
  const labelCls = "block text-gvi-navy/55 text-[11px] font-semibold uppercase tracking-[0.18em] mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
        <div>
          <label className={labelCls}>Họ và Tên <span className="text-gvi-gold">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputCls}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <label className={labelCls}>Địa Chỉ Email <span className="text-gvi-gold">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputCls}
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
        <div>
          <label className={labelCls}>Số Điện Thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputCls}
            placeholder="+84 90 XXX XXXX"
          />
        </div>
        <div>
          <label className={labelCls}>Chủ Đề Liên Hệ <span className="text-gvi-gold">*</span></label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={`${inputCls} appearance-none`}
          >
            <option value="">Chọn chủ đề</option>
            <option value="general">Thắc mắc chung</option>
            <option value="investment">Cơ hội đầu tư</option>
            <option value="partnership">Hợp tác doanh nghiệp</option>
            <option value="media">Báo chí & Truyền thông</option>
            <option value="careers">Cơ hội nghề nghiệp</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Nội Dung <span className="text-gvi-gold">*</span></label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={`${inputCls} resize-none`}
          placeholder="Vui lòng mô tả chi tiết yêu cầu hoặc câu hỏi của quý vị..."
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-9 md:px-11 py-3.5 md:py-4 bg-gvi-gold hover:bg-gvi-champagne active:scale-[0.98] text-gvi-navy font-bold text-xs tracking-[0.18em] uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gvi-gold/15 focus-visible:outline-2 focus-visible:outline-gvi-gold focus-visible:outline-offset-2"
      >
        <Send className="w-4 h-4" />
        Gửi Yêu Cầu Liên Hệ
      </button>
    </form>
  );
}
