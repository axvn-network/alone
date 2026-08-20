"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, ChevronDown } from "lucide-react";
import RoleAssessmentQuiz, {
  type QuizResult,
} from "@/shared/components/blocks/RoleAssessmentQuiz";
import type { ShareholderRole } from "@/modules/shareholders";

// ─── Constants ────────────────────────────────────────────────────────────────

const CAPITAL_RANGES = [
  { value: "", label: "Chưa xác định" },
  { value: "duoi-3ty", label: "< 3 tỷ VNĐ" },
  { value: "3ty-6ty", label: "3 – 6 tỷ VNĐ" },
  { value: "6ty-30ty", label: "6 – 30 tỷ VNĐ" },
  { value: "30ty-60ty", label: "30 – 60 tỷ VNĐ" },
  { value: "60ty-150ty", label: "60 – 150 tỷ VNĐ" },
  { value: "tren-150ty", label: "> 150 tỷ VNĐ" },
];

const ROLE_LABELS: Record<ShareholderRole, string> = {
  tech: "Đối Tác Công Nghệ",
  financial: "Cổ Đông Tài Chính",
  "tech-company": "Doanh Nghiệp Công Nghệ",
  individual: "Nhà Đầu Tư Cá Nhân Chiến Lược",
  legal: "Chuyên Gia Pháp Lý",
  foreign: "Đối Tác Quốc Tế",
};

const ALL_ROLES = Object.entries(ROLE_LABELS) as [ShareholderRole, string][];

const INVESTMENT_PLANS = [
  { value: "", label: "Chưa chọn — tôi muốn tìm hiểu thêm" },
  { value: "Hạng Mục Hạt Giống", label: "Hạt Giống — từ 500 triệu VNĐ" },
  { value: "Hạng Mục Tăng Trưởng", label: "Tăng Trưởng — từ 2 tỷ VNĐ" },
  { value: "Hạng Mục Mở Rộng", label: "Mở Rộng — từ 5 tỷ VNĐ" },
  { value: "Hạng Mục Chiến Lược", label: "Chiến Lược — từ 15 tỷ VNĐ" },
  { value: "Hạng Mục Neo Chiến Lược", label: "Neo Chiến Lược — từ 50 tỷ VNĐ" },
];

// ─── Component ────────────────────────────────────────────────────────────────

type Phase = "quiz" | "form" | "done";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  linkedinUrl: string;
  desiredRole: ShareholderRole;
  capitalRange: string;
  motivation: string;
  capabilities: string;
  investmentPlan: string;
  consentGiven: boolean;
}

const initForm = (suggestedRole: ShareholderRole): FormState => ({
  fullName: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  linkedinUrl: "",
  desiredRole: suggestedRole,
  capitalRange: "",
  motivation: "",
  capabilities: "",
  investmentPlan: "",
  consentGiven: false,
});

export default function PartnerApplicationFlow() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [form, setForm] = useState<FormState>(initForm("individual"));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function onQuizComplete(result: QuizResult) {
    setQuizResult(result);
    setForm(initForm(result.suggestedRole));
    setPhase("form");
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.consentGiven) {
      setError(
        "Bạn phải đồng ý với chính sách xử lý dữ liệu cá nhân để tiếp tục.",
      );
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        quizAnswers: quizResult?.answers ?? {},
        assessmentScore: quizResult?.assessmentScore ?? {
          technical: 0,
          financial: 0,
          legal: 0,
          strategic: 0,
          network: 0,
        },
        suggestedRole: quizResult?.suggestedRole ?? form.desiredRole,
        consentTimestamp: new Date().toISOString(),
      };
      const res = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Gửi đơn thất bại. Vui lòng thử lại.");
      }
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-AXVN-gold/10 border border-AXVN-gold/25 flex items-center justify-center mx-auto mb-6 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-AXVN-gold" />
        </div>
        <h3 className="text-xl font-bold text-AXVN-ivory mb-3">
          Đơn đăng ký đã được gửi{form.fullName ? `, ${form.fullName}` : ""}!
        </h3>
        <p className="text-AXVN-silver/75 max-w-md mx-auto text-sm leading-relaxed">
          Đội ngũ AXVN Tech Holding sẽ xem xét đơn và phản hồi trong vòng{" "}
          <strong className="text-AXVN-ivory">2–5 ngày làm việc</strong>. Chúng
          tôi sẽ liên hệ qua email{" "}
          <span className="text-AXVN-gold">{form.email}</span>.
        </p>
        <p className="text-AXVN-silver/45 text-xs mt-4">
          Không có bot, không mẫu tự động — người thật đọc và người thật trả
          lời.
        </p>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────
  if (phase === "quiz") {
    return <RoleAssessmentQuiz onComplete={onQuizComplete} />;
  }

  // ── Form đăng ký ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Kết quả quiz — hiển thị gợi ý */}
      {quizResult && (
        <div className="flex items-center gap-3 p-4 bg-AXVN-gold/6 border border-AXVN-gold/25 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-AXVN-gold shrink-0" />
          <div>
            <p className="text-AXVN-ivory text-sm font-semibold">
              Vai trò được đề xuất:{" "}
              <span className="text-AXVN-gold">
                {ROLE_LABELS[quizResult.suggestedRole]}
              </span>
            </p>
            <p className="text-AXVN-silver/60 text-xs mt-0.5">
              Bạn có thể thay đổi bên dưới nếu muốn.
            </p>
          </div>
        </div>
      )}

      {/* Thông tin cá nhân */}
      <div>
        <p className="text-AXVN-silver/70 text-xs uppercase tracking-widest mb-4 font-semibold">
          Thông Tin Liên Hệ
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Họ và tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm text-sm"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm text-sm"
              placeholder="+84 90 XXX XXXX"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-AXVN-silver text-xs mb-1.5">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm text-sm"
            placeholder="email@company.com"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Công ty / Tổ chức
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm text-sm"
              placeholder="Tên công ty"
            />
          </div>
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Chức vụ
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm text-sm"
              placeholder="Giám đốc / CTO / ..."
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-AXVN-silver text-xs mb-1.5">
            LinkedIn (nếu có)
          </label>
          <input
            type="url"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-sm text-sm"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      {/* Vai trò & Vốn */}
      <div>
        <p className="text-AXVN-silver/70 text-xs uppercase tracking-widest mb-4 font-semibold">
          Vai Trò & Cam Kết Vốn
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Vai trò mong muốn *
            </label>
            <div className="relative">
              <select
                name="desiredRole"
                value={form.desiredRole}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory focus:outline-none focus:border-AXVN-gold/50 transition-colors appearance-none rounded-sm text-sm"
              >
                {ALL_ROLES.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/50 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Quy mô vốn dự kiến
            </label>
            <div className="relative">
              <select
                name="capitalRange"
                value={form.capitalRange}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory focus:outline-none focus:border-AXVN-gold/50 transition-colors appearance-none rounded-sm text-sm"
              >
                {CAPITAL_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/50 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-AXVN-silver text-xs mb-1.5">
            Hạng mục hợp tác quan tâm
          </label>
          <div className="relative">
            <select
              name="investmentPlan"
              value={form.investmentPlan}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory focus:outline-none focus:border-AXVN-gold/50 transition-colors appearance-none rounded-sm text-sm"
            >
              {INVESTMENT_PLANS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-AXVN-silver/50 pointer-events-none" />
          </div>
          <p className="text-AXVN-silver/40 text-xs mt-1">
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
      </div>

      {/* Lý do & Năng lực */}
      <div>
        <p className="text-AXVN-silver/70 text-xs uppercase tracking-widest mb-4 font-semibold">
          Năng Lực & Động Cơ
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Tại sao bạn muốn tham gia AXVN Tech Holding? *
            </label>
            <textarea
              name="motivation"
              value={form.motivation}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors resize-none rounded-sm text-sm"
              placeholder="Chia sẻ ngắn gọn: bạn thấy cơ hội gì và tại sao đây là thời điểm phù hợp với bạn."
            />
          </div>
          <div>
            <label className="block text-AXVN-silver text-xs mb-1.5">
              Bạn có thể đóng góp gì vào dự án? *
            </label>
            <textarea
              name="capabilities"
              value={form.capabilities}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-AXVN-gold/50 transition-colors resize-none rounded-sm text-sm"
              placeholder="Năng lực kỹ thuật, tài chính, mạng lưới quan hệ, pháp lý — bất kỳ điều gì bạn thấy có giá trị."
            />
          </div>
        </div>
      </div>

      {/* Consent — NĐ 13/2023 */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="consentGiven"
            checked={form.consentGiven}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 accent-AXVN-gold rounded shrink-0"
          />
          <span className="text-AXVN-silver/70 text-xs leading-relaxed group-hover:text-AXVN-silver transition-colors">
            Tôi đồng ý cho AXVN Tech Holding xử lý thông tin cá nhân của tôi để
            xem xét đơn đăng ký này, theo đúng quy định tại{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-AXVN-gold/80 underline hover:text-AXVN-gold"
            >
              Chính Sách Bảo Vệ Dữ Liệu Cá Nhân
            </a>{" "}
            và Nghị Định 13/2023/NĐ-CP. *
          </span>
        </label>
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-400/8 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setPhase("quiz")}
          className="px-5 py-3.5 border border-AXVN-gold/15 text-AXVN-silver text-sm hover:border-AXVN-gold/35 hover:text-AXVN-ivory transition-all rounded-sm"
        >
          ← Xem lại quiz
        </button>
        <button
          type="submit"
          disabled={submitting || !form.consentGiven}
          className="flex-1 px-8 py-3.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-AXVN-navy/30 border-t-AXVN-navy rounded-full animate-spin" />
              Đang gửi...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Nộp Đơn Đăng Ký
            </>
          )}
        </button>
      </div>
      <p className="text-AXVN-silver/40 text-xs">
        Không có ràng buộc hay nghĩa vụ tài chính ở bước này — đây chỉ là đơn
        bày tỏ quan tâm để chúng tôi liên hệ và trao đổi thêm.
      </p>
    </form>
  );
}
