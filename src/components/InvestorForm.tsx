"use client";

import { useState, FormEvent } from "react";
import {
  PieChart,
  Target,
  Briefcase,
  Building2,
  Send,
  CheckCircle2,
  Upload,
} from "lucide-react";

const enquiryTypes = [
  {
    id: "diversified",
    label: "Đầu Tư Phân Bổ Đa Ngành",
    icon: PieChart,
    description: "Xây dựng danh mục đầu tư cân bằng trên nhiều lĩnh vực thông qua một đối tác duy nhất.",
  },
  {
    id: "sector-specific",
    label: "Đầu Tư Vào Lĩnh Vực Cụ Thể",
    icon: Target,
    description: "Tập trung nguồn vốn vào lĩnh vực bạn hiểu rõ và tin tưởng nhất.",
  },
  {
    id: "direct",
    label: "Đầu Tư Trực Tiếp Vào Dự Án",
    icon: Briefcase,
    description: "Trực tiếp nắm giữ cổ phần hoặc vị thế trong doanh nghiệp, tài sản chọn lọc.",
  },
  {
    id: "institutional",
    label: "Đầu Tư Định Chế & Family Office",
    icon: Building2,
    description: "Cấu trúc khoản đầu tư quy mô lớn với cơ chế quản trị và báo cáo chuyên biệt.",
  },
];

export default function InvestorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    company: "",
    investorType: "",
    investmentRange: "",
    investmentPeriod: "",
    riskProfile: "",
    preferredSectors: "",
    objectives: "",
    fileName: "",
    enquiryType: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, fileName: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/partner-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-fortress-gold/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-fortress-gold" />
        </div>
        <h3 className="text-2xl font-bold text-fortress-ivory mb-3">
          Cảm ơn bạn, {formData.firstName}
        </h3>
        <p className="text-fortress-silver max-w-md mx-auto">
          Yêu cầu hợp tác đầu tư của bạn đã được ghi nhận. Đội ngũ chuyên gia đầu tư của chúng tôi sẽ thẩm định và phản hồi trong vòng 2-3 ngày làm việc — bảo mật tuyệt đối.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Enquiry Type Selection */}
      <div>
        <label className="block text-fortress-ivory font-medium mb-4 text-sm">
          Loại Hình Yêu Cầu Đầu Tư *
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          {enquiryTypes.map((type) => (
            <label
              key={type.id}
              className={`flex items-start gap-4 p-4 border cursor-pointer transition-all duration-300 ${
                formData.enquiryType === type.id
                  ? "border-fortress-gold/50 bg-fortress-gold/5"
                  : "border-fortress-gold/10 bg-fortress-deep/50 hover:border-fortress-gold/25"
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
                className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                  formData.enquiryType === type.id
                    ? "bg-fortress-gold/20"
                    : "bg-white/5"
                }`}
              >
                <type.icon
                  className={`w-5 h-5 ${
                    formData.enquiryType === type.id
                      ? "text-fortress-gold"
                      : "text-fortress-silver"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`font-medium text-sm ${
                    formData.enquiryType === type.id
                      ? "text-fortress-gold"
                      : "text-fortress-ivory"
                  }`}
                >
                  {type.label}
                </p>
                <p className="text-fortress-silver text-xs mt-1">
                  {type.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Họ *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
            placeholder="Nguyễn"
          />
        </div>
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Tên *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
            placeholder="Văn A"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Địa chỉ Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
            placeholder="nguyenvana@company.com"
          />
        </div>
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
            placeholder="+84 90 XXX XXXX"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Quốc gia cư trú
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
            placeholder="Việt Nam / UAE"
          />
        </div>
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Công ty / Tổ chức / Family Office
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
            placeholder="Tên tổ chức / doanh nghiệp"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Phân loại nhà đầu tư
          </label>
          <select
            name="investorType"
            value={formData.investorType}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory focus:outline-none focus:border-fortress-gold/50 transition-colors appearance-none rounded-sm"
          >
            <option value="">Chọn loại nhà đầu tư</option>
            <option value="private">Nhà đầu tư cá nhân</option>
            <option value="hnwi">Cá nhân có tài sản lớn (HNWI)</option>
            <option value="family-office">Family Office</option>
            <option value="corporate">Doanh nghiệp đầu tư</option>
            <option value="financial-institution">Định chế tài chính</option>
            <option value="institutional">Quỹ đầu tư định chế</option>
          </select>
        </div>
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Quy mô vốn đầu tư dự kiến
          </label>
          <select
            name="investmentRange"
            value={formData.investmentRange}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory focus:outline-none focus:border-fortress-gold/50 transition-colors appearance-none rounded-sm"
          >
            <option value="">Chọn quy mô vốn</option>
            <option value="below-500k">Dưới 3 tỷ VNĐ (AED 500k)</option>
            <option value="500k-1m">3 - 6 tỷ VNĐ</option>
            <option value="1m-5m">6 - 30 tỷ VNĐ</option>
            <option value="5m-10m">30 - 60 tỷ VNĐ</option>
            <option value="10m-25m">60 - 150 tỷ VNĐ</option>
            <option value="25m+">Trên 150 tỷ VNĐ</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Thời hạn đầu tư kỳ vọng
          </label>
          <select
            name="investmentPeriod"
            value={formData.investmentPeriod}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory focus:outline-none focus:border-fortress-gold/50 transition-colors appearance-none rounded-sm"
          >
            <option value="">Chọn thời hạn</option>
            <option value="1-3">1 – 3 năm</option>
            <option value="3-5">3 – 5 năm</option>
            <option value="5-10">5 – 10 năm</option>
            <option value="10+">Trên 10 năm</option>
          </select>
        </div>
        <div>
          <label className="block text-fortress-silver text-sm mb-2">
            Khẩu vị rủi ro
          </label>
          <select
            name="riskProfile"
            value={formData.riskProfile}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory focus:outline-none focus:border-fortress-gold/50 transition-colors appearance-none rounded-sm"
          >
            <option value="">Chọn khẩu vị rủi ro</option>
            <option value="conservative">Thận trọng (An toàn vốn)</option>
            <option value="moderate">Cân bằng</option>
            <option value="growth">Ưu tiên tăng trưởng</option>
            <option value="higher-risk">Lợi nhuận cao / Rủi ro cao</option>
          </select>
        </div>
      </div>

      {/* Preferred Sectors */}
      <div>
        <label className="block text-fortress-silver text-sm mb-2">
          Lĩnh vực đầu tư quan tâm
        </label>
        <input
          type="text"
          name="preferredSectors"
          value={formData.preferredSectors}
          onChange={handleChange}
          className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors rounded-sm"
          placeholder="Bất động sản, Mua bán doanh nghiệp, Công nghệ AI, Khách sạn..."
        />
      </div>

      {/* Investment Objectives */}
      <div>
        <label className="block text-fortress-silver text-sm mb-2">
          Tóm tắt mục tiêu đầu tư *
        </label>
        <textarea
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors resize-none rounded-sm"
          placeholder="Mô tả tóm tắt về mục tiêu đầu tư, kỳ vọng lợi nhuận, thời hạn và các yêu cầu cụ thể khác."
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-fortress-silver text-sm mb-2">
          Tài liệu kèm theo (Tùy chọn)
        </label>
        <label className="flex items-center gap-3 px-5 py-3.5 bg-fortress-navy border border-dashed border-fortress-gold/20 text-fortress-silver hover:border-fortress-gold/40 transition-colors cursor-pointer rounded-sm">
          <Upload className="w-5 h-5 text-fortress-gold/60" />
          <span className="text-sm">
            {formData.fileName || "Tải lên hồ sơ năng lực, đề xuất dự án hoặc tài liệu liên quan (PDF, DOCX, PPTX)."}
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.pptx,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-sm hover:shadow-2xl hover:shadow-fortress-gold/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 rounded-sm"
        >
          <Send className="w-4 h-4" />
          Gửi Đề Xuất Đầu Tư
        </button>
        <p className="text-fortress-silver/40 text-xs mt-4">
          Mọi thông tin đề xuất đầu tư đều được bảo mật nghiêm ngặt. Việc đánh giá cơ hội sẽ tuân thủ quy trình thẩm định độc lập và các quy định pháp luật hiện hành.
        </p>
      </div>
    </form>
  );
}

