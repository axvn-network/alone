"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "Contact" as "Contact" | "Scheduling",
    desiredDate: "",
    desiredTime: "",
    consentGiven: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ... handleSubmit update would be needed here for new fields, but for now I'll just structure the form.

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.consentGiven) {
      setError(
        "Bạn phải đồng ý với chính sách xử lý dữ liệu cá nhân để tiếp tục.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "Contact",
          consentGiven: true as const,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-AXVN-gold/10 border border-AXVN-gold/20 flex items-center justify-center mx-auto mb-6 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-AXVN-gold" />
        </div>
        <h3
          className="font-semibold text-AXVN-navy mb-3 uppercase tracking-[0.06em]"
          style={{ fontSize: "var(--text-h3)" }}
        >
          Yêu Cầu Đã Được Gửi Thành Công
        </h3>
        <p
          className="text-AXVN-navy/60 max-w-md mx-auto leading-[1.8]"
          style={{ fontSize: "var(--text-body)" }}
        >
          Cảm ơn quý vị đã liên hệ với AXVN Tech Holding. Đội ngũ chuyên gia của
          chúng tôi sẽ phản hồi trong vòng 1–2 ngày làm việc.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 md:px-5 py-3 md:py-3.5 bg-AXVN-ivory border border-AXVN-navy/20 text-AXVN-navy placeholder:text-AXVN-silver focus:outline-none focus-visible:outline-none focus:border-AXVN-gold focus:ring-2 focus:ring-AXVN-gold/20 hover:border-AXVN-navy/30 transition-all duration-200 rounded-lg";
  const labelCls =
    "block text-AXVN-navy text-[11px] font-semibold uppercase tracking-[0.18em] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      {/* Type Selector */}
      <div className="flex gap-4 p-1 bg-AXVN-ivory border border-AXVN-navy/10 rounded-lg">
        <button
          type="button"
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
            formData.type === "Contact"
              ? "bg-AXVN-gold text-AXVN-navy rounded shadow"
              : "text-AXVN-silver"
          }`}
          onClick={() => setFormData((prev) => ({ ...prev, type: "Contact" }))}
        >
          Liên Hệ
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
            formData.type === "Scheduling"
              ? "bg-AXVN-gold text-AXVN-navy rounded shadow"
              : "text-AXVN-silver"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, type: "Scheduling" }))
          }
        >
          Đặt Lịch
        </button>
      </div>

      {formData.type === "Scheduling" && (
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className={labelCls}>
              Ngày Mong Muốn <span className="text-AXVN-gold">*</span>
            </label>
            <input
              type="date"
              name="desiredDate"
              value={formData.desiredDate}
              onChange={handleChange}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              Khung Giờ <span className="text-AXVN-gold">*</span>
            </label>
            <select
              name="desiredTime"
              value={formData.desiredTime}
              onChange={handleChange}
              required
              className={`${inputCls} appearance-none`}
            >
              <option value="">Chọn giờ</option>
              <option value="morning">Sáng (08:30 - 12:00)</option>
              <option value="afternoon">Chiều (13:30 - 17:30)</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
        {/* ... (Họ Tên, Email) ... */}
        {/* Added above via previous replace, need to make sure this fits */}
        <div>
          <label className={labelCls}>
            Họ và Tên <span className="text-AXVN-gold">*</span>
          </label>
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
          <label className={labelCls}>
            Địa Chỉ Email <span className="text-AXVN-gold">*</span>
          </label>
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
          <label className={labelCls}>
            Chủ Đề Liên Hệ <span className="text-AXVN-gold">*</span>
          </label>
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
        <label className={labelCls}>
          Nội Dung <span className="text-AXVN-gold">*</span>
        </label>
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

      {/* Consent checkbox */}
      <div className="flex items-start gap-3 p-4 bg-AXVN-navy/5 border border-AXVN-navy/10 rounded-lg">
        <input
          type="checkbox"
          id="consentGiven"
          name="consentGiven"
          checked={formData.consentGiven}
          onChange={handleChange}
          className="mt-0.5 w-4 h-4 accent-AXVN-gold cursor-pointer shrink-0"
          required
        />
        <label
          htmlFor="consentGiven"
          className="text-AXVN-navy text-xs leading-relaxed cursor-pointer"
        >
          <span className="text-AXVN-gold font-semibold">*</span> Tôi đồng ý để
          AXVN Tech Holding xử lý thông tin cá nhân của tôi nhằm mục đích phản
          hồi yêu cầu liên hệ này theo{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            className="text-AXVN-navy underline hover:text-AXVN-gold transition-colors"
          >
            Chính sách Bảo mật
          </a>{" "}
          và quy định tại Nghị định 13/2023/NĐ-CP.
        </label>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !formData.consentGiven}
        className="w-full sm:w-auto px-9 md:px-11 py-3.5 md:py-4 bg-AXVN-gold hover:bg-AXVN-champagne active:scale-[0.98] text-AXVN-navy font-bold text-xs tracking-[0.18em] uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-AXVN-gold/15 focus-visible:outline-2 focus-visible:outline-AXVN-gold focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Gửi Yêu Cầu Liên Hệ
          </>
        )}
      </button>
    </form>
  );
}
