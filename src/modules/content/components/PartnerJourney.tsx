"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Globe, Cpu, ChevronRight, CheckCircle, Server, Shield, GitBranch, Layers } from "lucide-react";

// Note: TECH_BREAKDOWN shows what the tech-partner role entails — visible to all partners
// so they understand what that role covers in the project ecosystem

interface Question {
  id: string;
  label: string;
  question: string;
  options: {
    value: string;
    label: string;
    detail: string;
    icon: React.ComponentType<{ className?: string }>;
    result?: {
      role: string;
      group: string;
      minCapital: string;
      maxEquity: string;
      highlight: string;
      color: string;
      nextHref: string;
    };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "who",
    label: "Câu 1 — Tôi Là Ai",
    question: "Bạn đại diện cho ai khi tham gia dự án này?",
    options: [
      {
        value: "individual",
        label: "Cá nhân",
        detail: "Nhà đầu tư cá nhân, không đại diện tổ chức",
        icon: User,
      },
      {
        value: "org-vn",
        label: "Tổ chức trong nước",
        detail: "Doanh nghiệp, quỹ, ngân hàng, CTCK Việt Nam",
        icon: Building2,
      },
      {
        value: "org-foreign",
        label: "Tổ chức / Cá nhân nước ngoài",
        detail: "Có quốc tịch hoặc pháp nhân ngoài Việt Nam",
        icon: Globe,
      },
      {
        value: "tech",
        label: "Đối tác công nghệ / Chuyên gia",
        detail: "Đóng góp bằng năng lực kỹ thuật, pháp lý, không chỉ vốn",
        icon: Cpu,
      },
    ],
  },
  {
    id: "what",
    label: "Câu 2 — Tôi Góp Gì",
    question: "Bạn chủ yếu đóng góp điều gì vào dự án?",
    options: [
      {
        value: "capital-small",
        label: "Vốn tài chính (nhỏ)",
        detail: "100 triệu – 5 tỷ VNĐ",
        icon: User,
      },
      {
        value: "capital-medium",
        label: "Vốn tài chính (trung bình)",
        detail: "5 tỷ – 50 tỷ VNĐ",
        icon: Building2,
      },
      {
        value: "capital-large",
        label: "Vốn tài chính (lớn)",
        detail: "Trên 50 tỷ VNĐ hoặc tổ chức tài chính",
        icon: Building2,
      },
      {
        value: "expertise",
        label: "Năng lực / Hạ tầng",
        detail: "Công nghệ, pháp lý, bảo mật, quy trình",
        icon: Cpu,
      },
    ],
  },
  {
    id: "where",
    label: "Câu 3 — Tôi Ở Đâu",
    question: "Bạn muốn đóng vai trò gì trong cơ cấu cổ đông?",
    options: [
      {
        value: "minority",
        label: "Cổ đông thiểu số",
        detail: "Góp vốn, nhận cổ tức, dự ĐHCĐ — không tham gia điều hành",
        icon: User,
        result: {
          role: "Cổ Đông Cá Nhân / Tổ Chức Nhỏ",
          group: "Nhóm ≤35% theo Điều 8, Khoản 4",
          minCapital: "Từ 100 triệu VNĐ",
          maxEquity: "Theo tỷ lệ góp trong nhóm ≤35%",
          highlight: "Phù hợp nhất với cá nhân và tổ chức nhỏ muốn tham gia lịch sử",
          color: "text-sky-300",
          nextHref: "/invest-with-axvn/plans#roles",
        },
      },
      {
        value: "strategic",
        label: "Cổ đông chiến lược / Tổ chức",
        detail: "Nắm vốn lớn, tham gia HĐQT, định hướng chiến lược",
        icon: Building2,
        result: {
          role: "Tổ Chức Tài Chính / Công Nghệ",
          group: "Nhóm bắt buộc >35% (≥2 tổ chức) theo Điều 8, Khoản 4",
          minCapital: "Từ 500 tỷ VNĐ trở lên",
          maxEquity: "Tỷ lệ tương ứng trong nhóm >35%",
          highlight: "Điều kiện bắt buộc: lãi 2 năm liền, BCTC kiểm toán TP, chỉ 1 sàn TSMH",
          color: "text-emerald-300",
          nextHref: "/invest-with-axvn/plans#roles",
        },
      },
      {
        value: "foreign",
        label: "Nhà đầu tư nước ngoài",
        detail: "Tham gia theo diện nước ngoài — giới hạn tổng 49%",
        icon: Globe,
        result: {
          role: "Nhà Đầu Tư Nước Ngoài",
          group: "Nhóm ≤49% theo Điều 8, Khoản 4",
          minCapital: "Thương lượng trực tiếp",
          maxEquity: "≤49% tổng VĐL (giới hạn tuyệt đối)",
          highlight: "Cần IRC + tài khoản IICA + thủ tục góp vốn tại Sở KHĐT",
          color: "text-rose-300",
          nextHref: "/invest-with-axvn/plans#roles",
        },
      },
      {
        value: "tech-partner",
        label: "Đối tác công nghệ — Xây hệ thống",
        detail: "Xây dựng hạ tầng kỹ thuật, bảo mật, platform giao dịch",
        icon: Cpu,
        result: {
          role: "Đối Tác Công Nghệ — Người Xây Hệ Thống",
          group: "Vai trò kỹ thuật cốt lõi · Cổ phần hoán đổi theo định giá IP / sản phẩm",
          minCapital: "Góp bằng hệ thống & IP — không yêu cầu tiền mặt tối thiểu",
          maxEquity: "15–25% (hoán đổi IP + năng lực đội ngũ)",
          highlight: "Đây là vai trò QUAN TRỌNG NHẤT trong dự án. Không có hạ tầng CNTT cấp 4, không có giấy phép. Bạn là người biến dự án thành thực tế.",
          color: "text-purple-300",
          nextHref: "/invest-with-axvn/plans#roles",
        },
      },
    ],
  },
  {
    id: "get",
    label: "Câu 4 — Tôi Nhận Gì",
    question: "Điều quan trọng nhất bạn kỳ vọng nhận được là gì?",
    options: [
      {
        value: "dividend",
        label: "Cổ tức dài hạn",
        detail: "Thu nhập định kỳ từ lợi nhuận khi sàn vận hành",
        icon: ChevronRight,
      },
      {
        value: "equity-growth",
        label: "Tăng giá trị cổ phần",
        detail: "Giá trị cổ phần tăng khi sàn được cấp phép và phát triển",
        icon: ChevronRight,
      },
      {
        value: "influence",
        label: "Vai trò & ảnh hưởng chiến lược",
        detail: "Tham gia HĐQT, định hướng sản phẩm và chiến lược",
        icon: ChevronRight,
      },
      {
        value: "pioneer",
        label: "Vị thế tiên phong lịch sử",
        detail: "Là một phần của dự án định hình tài chính số Việt Nam",
        icon: ChevronRight,
      },
    ],
  },
];

const FINAL_MESSAGE = {
  title: "Bạn Đã Trả Lời 4 Câu Hỏi Cốt Lõi",
  desc: "Bước tiếp theo: xem phần Phân Vai Đối Tác bên dưới để hiểu chi tiết quyền lợi, nghĩa vụ và hồ sơ cần chuẩn bị cho vai trò phù hợp với bạn.",
};

// What a tech-builder partner builds — shown as a visual breakdown
const TECH_BREAKDOWN = [
  { icon: Server, label: "Matching Engine", detail: "Khớp lệnh mua/bán real-time · độ trễ <10ms" },
  { icon: Shield, label: "Bảo Mật CNTT Cấp 4", detail: "Chuẩn Bộ Công An · ISMS · Pen test · DR/BCP" },
  { icon: GitBranch, label: "10 Quy Trình Nghiệp Vụ", detail: "AML, KYC, Custody, Settlement, CBTT, Rủi ro..." },
  { icon: Layers, label: "Custody Wallet & KYC", detail: "Lưu ký TSMH · xác minh danh tính người dùng" },
];

export default function PartnerJourney() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedResult, setSelectedResult] = useState<NonNullable<Question["options"][0]["result"]> | null>(null);
  const [done, setDone] = useState(false);

  const currentQ = QUESTIONS[step];

  const handleSelect = (value: string, result?: Question["options"][0]["result"]) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    // If this option has a result card (step 3 = "where"), store it
    if (result) setSelectedResult(result);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 220);
    } else {
      setTimeout(() => setDone(true), 220);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setSelectedResult(null);
    setDone(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {QUESTIONS.map((q, i) => (
          <div
            key={q.id}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < step ? "bg-AXVN-gold" :
                i === step ? "bg-AXVN-gold/50" :
                  "bg-AXVN-silver/15"
              }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-AXVN-gold/60 text-[10px] font-mono font-bold tracking-widest uppercase">
                {currentQ.label}
              </span>
              <div className="flex-1 h-px bg-AXVN-gold/10" />
              <span className="text-AXVN-silver/55 text-[10px] font-mono">
                {step + 1}/{QUESTIONS.length}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-AXVN-ivory font-semibold text-lg mb-6 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value, opt.result)}
                    className={`group flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${isSelected
                        ? "bg-AXVN-gold/10 border-AXVN-gold/50"
                        : "bg-AXVN-deep border-AXVN-silver/10 hover:border-AXVN-gold/30 hover:bg-AXVN-gold/5"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-AXVN-gold/20" : "bg-white/5 group-hover:bg-AXVN-gold/10"
                      }`}>
                      <Icon className={`w-4 h-4 transition-colors ${isSelected ? "text-AXVN-gold" : "text-AXVN-silver/60 group-hover:text-AXVN-gold/70"
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm transition-colors ${isSelected ? "text-AXVN-gold" : "text-AXVN-ivory"
                        }`}>
                        {opt.label}
                      </p>
                      <p className="text-AXVN-silver/70 text-xs mt-0.5 leading-relaxed">
                        {opt.detail}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-AXVN-gold shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Back */}
            {step > 0 && (
              <button
                onClick={() => { setStep(step - 1); }}
                className="mt-5 text-AXVN-silver/40 text-xs hover:text-AXVN-silver/70 transition-colors flex items-center gap-1"
              >
                ← Quay lại câu trước
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            {/* Done header */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/8 border border-emerald-400/20 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-emerald-300 font-bold text-sm">{FINAL_MESSAGE.title}</p>
                <p className="text-AXVN-silver/60 text-xs mt-0.5 leading-relaxed">{FINAL_MESSAGE.desc}</p>
              </div>
            </div>

            {/* Summary of answers */}
            <div className="grid sm:grid-cols-2 gap-3">
              {QUESTIONS.map((q) => {
                const selected = q.options.find(o => o.value === answers[q.id]);
                if (!selected) return null;
                return (
                  <div key={q.id} className="p-3.5 bg-AXVN-deep border border-AXVN-gold/10 rounded-xl">
                    <p className="text-AXVN-gold/50 text-[10px] font-mono uppercase tracking-widest mb-1.5">{q.label}</p>
                    <p className="text-AXVN-ivory text-sm font-semibold leading-tight">{selected.label}</p>
                    <p className="text-AXVN-silver/65 text-[11px] mt-0.5">{selected.detail}</p>
                  </div>
                );
              })}
            </div>

            {/* Role card if available */}
            {selectedResult && (
              <div className="p-5 bg-AXVN-navy border border-AXVN-gold/20 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-AXVN-gold animate-pulse" />
                  <p className="text-AXVN-gold/70 text-[10px] font-mono uppercase tracking-widest">Vai trò phù hợp nhất</p>
                </div>
                <p className={`font-black text-base ${selectedResult.color}`}>{selectedResult.role}</p>
                <p className="text-AXVN-silver/70 text-xs">{selectedResult.group}</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-AXVN-deep rounded-lg p-2.5">
                    <p className="text-AXVN-silver/60 text-[9px] uppercase tracking-widest mb-0.5">Vốn tối thiểu</p>
                    <p className={`font-bold text-xs ${selectedResult.color}`}>{selectedResult.minCapital}</p>
                  </div>
                  <div className="bg-AXVN-deep rounded-lg p-2.5">
                    <p className="text-AXVN-silver/60 text-[9px] uppercase tracking-widest mb-0.5">Cổ phần</p>
                    <p className={`font-bold text-xs ${selectedResult.color}`}>{selectedResult.maxEquity}</p>
                  </div>
                </div>
                <p className="text-AXVN-silver/75 text-xs leading-relaxed italic border-t border-AXVN-gold/10 pt-3">
                  {selectedResult.highlight}
                </p>

                {/* Tech breakdown — only for tech-partner path */}
                {answers["where"] === "tech-partner" && (
                  <div className="pt-2 space-y-2">
                    <p className="text-purple-300/80 text-[10px] font-mono uppercase tracking-widest">Bạn cần xây dựng</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {TECH_BREAKDOWN.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex items-start gap-2.5 bg-purple-500/5 border border-purple-500/15 rounded-lg p-2.5">
                            <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-AXVN-ivory text-[11px] font-semibold leading-tight">{item.label}</p>
                              <p className="text-AXVN-silver/65 text-[10px] mt-0.5 leading-snug">{item.detail}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <a
                  href={selectedResult.nextHref}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${selectedResult.color} hover:opacity-80 transition-opacity`}
                >
                  Xem chi tiết vai trò này <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#roles"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
              >
                Xem Phân Vai Đối Tác Bên Dưới
              </a>
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-AXVN-silver/20 text-AXVN-silver/60 text-xs uppercase tracking-wider rounded-xl hover:border-AXVN-gold/30 hover:text-AXVN-silver transition-colors"
              >
                Làm Lại Từ Đầu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
