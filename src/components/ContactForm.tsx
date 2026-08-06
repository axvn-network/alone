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
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-fortress-gold/10 flex items-center justify-center mx-auto mb-6 rounded-2xl">
          <CheckCircle2 className="w-10 h-10 text-fortress-gold" />
        </div>
        <h3 className="text-2xl font-bold text-fortress-navy mb-3">
          Đã Gửi Yêu Cầu Thành Công
        </h3>
        <p className="text-fortress-navy/60 max-w-md mx-auto">
          Cảm ơn bạn đã liên hệ với Fortress. Đội ngũ chuyên gia của chúng tôi sẽ phản hồi trong vòng 1-2 ngày làm việc.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-fortress-navy/70 text-sm mb-2">
            Họ và Tên *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-fortress-navy/20 text-fortress-navy placeholder:text-fortress-navy/30 focus:outline-none focus:border-fortress-gold transition-colors rounded-xl"
            placeholder="Nhập họ và tên đầy đủ"
          />
        </div>
        <div>
          <label className="block text-fortress-navy/70 text-sm mb-2">
            Địa chỉ Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-fortress-navy/20 text-fortress-navy placeholder:text-fortress-navy/30 focus:outline-none focus:border-fortress-gold transition-colors rounded-xl"
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-fortress-navy/70 text-sm mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-fortress-navy/20 text-fortress-navy placeholder:text-fortress-navy/30 focus:outline-none focus:border-fortress-gold transition-colors rounded-xl"
            placeholder="+84 90 XXX XXXX"
          />
        </div>
        <div>
          <label className="block text-fortress-navy/70 text-sm mb-2">
            Chủ đề liên hệ *
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-fortress-navy/20 text-fortress-navy focus:outline-none focus:border-fortress-gold transition-colors appearance-none rounded-xl"
          >
            <option value="">Chọn chủ đề liên hệ</option>
            <option value="general">Thắc mắc chung</option>
            <option value="investment">Cơ hội đầu tư</option>
            <option value="partnership">Hợp tác doanh nghiệp</option>
            <option value="media">Báo chí & Truyền thông</option>
            <option value="careers">Cơ hội nghề nghiệp</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-fortress-navy/70 text-sm mb-2">
          Nội dung lời nhắn *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-fortress-navy/20 text-fortress-navy placeholder:text-fortress-navy/30 focus:outline-none focus:border-fortress-gold transition-colors resize-none rounded-xl"
          placeholder="Nhập chi tiết yêu cầu hoặc câu hỏi của bạn..."
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-fortress-gold text-fortress-navy font-bold text-sm hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl"
      >
        <Send className="w-4 h-4" />
        Gửi Yêu Cầu Liên Hệ
      </button>
    </form>
  );
}
