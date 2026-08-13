"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import type { ShareholderRole } from "@/models/Shareholder";
import type { AssessmentDimensions } from "@/models/PartnerApplication";

// ─── Dữ liệu câu hỏi ────────────────────────────────────────────────────────

type Dimension = keyof AssessmentDimensions;

interface QuizOption {
  value: string;
  label: string;
  scores: Partial<Record<Dimension, number>>;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  // ── Nhóm 1: Nền tảng kỹ thuật (technical) ──────────────────────────────
  {
    id: "q0",
    question: "Bạn có kinh nghiệm làm việc với công nghệ blockchain hoặc hạ tầng fintech không?",
    options: [
      { value: "a", label: "Trực tiếp phát triển / vận hành hệ thống blockchain", scores: { technical: 30 } },
      { value: "b", label: "Quản lý dự án hoặc sản phẩm công nghệ tài chính", scores: { technical: 20, strategic: 10 } },
      { value: "c", label: "Hiểu biết về công nghệ nhưng không trực tiếp làm", scores: { technical: 10, strategic: 5 } },
      { value: "d", label: "Chưa có kinh nghiệm liên quan trực tiếp", scores: { financial: 5 } },
    ],
  },
  {
    id: "q1",
    question: "Trình độ chuyên môn bảo mật thông tin của bạn?",
    options: [
      { value: "a", label: "Chứng chỉ chuyên ngành (CISSP, CEH, OSCP hoặc tương đương)", scores: { technical: 30 } },
      { value: "b", label: "Kinh nghiệm thực tế quản lý hệ thống an toàn thông tin", scores: { technical: 20 } },
      { value: "c", label: "Hiểu biết cơ bản, chưa có chứng chỉ chuyên sâu", scores: { technical: 5 } },
      { value: "d", label: "Không liên quan trực tiếp đến bảo mật thông tin", scores: { financial: 5, network: 5 } },
    ],
  },
  {
    id: "q2",
    question: "Nếu tham gia AXVN Tech Holding, bạn có thể đóng góp năng lực kỹ thuật cụ thể nào?",
    options: [
      { value: "a", label: "Kiến trúc hệ thống, smart contract, infrastructure cấp enterprise", scores: { technical: 25 } },
      { value: "b", label: "Phát triển backend / API / security cho ứng dụng tài chính", scores: { technical: 20 } },
      { value: "c", label: "Quản lý đội ngũ kỹ thuật và lập trình viên", scores: { technical: 10, strategic: 15 } },
      { value: "d", label: "Hỗ trợ tài chính, pháp lý hoặc quan hệ — không phải kỹ thuật", scores: { financial: 10, legal: 10, network: 10 } },
    ],
  },
  // ── Nhóm 2: Năng lực tài chính (financial) ────────────────────────────
  {
    id: "q3",
    question: "Bạn có kinh nghiệm trong lĩnh vực tài chính, ngân hàng hoặc chứng khoán không?",
    options: [
      { value: "a", label: "≥5 năm tại tổ chức tài chính (ngân hàng, quỹ, CTCK)", scores: { financial: 30 } },
      { value: "b", label: "Kinh doanh tài chính / đầu tư cá nhân dài hạn", scores: { financial: 20 } },
      { value: "c", label: "Kế toán / quản lý tài chính doanh nghiệp", scores: { financial: 15, strategic: 5 } },
      { value: "d", label: "Không có nền tảng chuyên sâu về tài chính", scores: { technical: 10, legal: 5 } },
    ],
  },
  {
    id: "q4",
    question: "Khả năng cam kết vốn ban đầu của bạn / tổ chức bạn đại diện ở mức nào?",
    options: [
      { value: "a", label: "> 50 tỷ VNĐ — cổ đông chiến lược neo", scores: { financial: 30 } },
      { value: "b", label: "15 – 50 tỷ VNĐ — gói chiến lược", scores: { financial: 25 } },
      { value: "c", label: "3 – 15 tỷ VNĐ — gói tăng trưởng / mở rộng", scores: { financial: 15 } },
      { value: "d", label: "< 3 tỷ VNĐ — hoặc đóng góp phi tài chính là chính", scores: { technical: 10, legal: 10, network: 10 } },
    ],
  },
  {
    id: "q5",
    question: "Bạn từng quản lý quỹ đầu tư, danh mục tài sản, hoặc thẩm định giá trị doanh nghiệp chưa?",
    options: [
      { value: "a", label: "Có — thực tế quản lý danh mục > 100 tỷ", scores: { financial: 30 } },
      { value: "b", label: "Có — quy mô nhỏ hơn hoặc trong nội bộ doanh nghiệp", scores: { financial: 20 } },
      { value: "c", label: "Có tham gia nhưng không phụ trách chính", scores: { financial: 10, strategic: 5 } },
      { value: "d", label: "Chưa — mảng tài chính không phải điểm mạnh", scores: { technical: 10, legal: 5 } },
    ],
  },
  // ── Nhóm 3: Kiến thức pháp lý (legal) ──────────────────────────────────
  {
    id: "q6",
    question: "Mức độ hiểu biết của bạn về NQ 05/2025/NQ-CP và khung pháp lý tài sản mã hóa Việt Nam?",
    options: [
      { value: "a", label: "Đọc và nghiên cứu toàn bộ văn bản, hiểu rõ điều kiện cấp phép", scores: { legal: 30 } },
      { value: "b", label: "Biết tổng quan, nắm điểm chính về điều kiện doanh nghiệp", scores: { legal: 20, strategic: 5 } },
      { value: "c", label: "Nghe qua, chưa đọc trực tiếp văn bản pháp quy", scores: { legal: 5 } },
      { value: "d", label: "Chưa tìm hiểu — muốn học thêm nếu tham gia", scores: { financial: 5, technical: 5 } },
    ],
  },
  {
    id: "q7",
    question: "Bạn có kinh nghiệm pháp lý doanh nghiệp, M&A, hoặc quản trị nội bộ công ty không?",
    options: [
      { value: "a", label: "Luật sư doanh nghiệp / hành nghề pháp lý chuyên sâu", scores: { legal: 30 } },
      { value: "b", label: "Từng tham gia M&A, IPO, hoặc soạn thảo hợp đồng đầu tư", scores: { legal: 20, financial: 10 } },
      { value: "c", label: "Quản lý điều lệ, nội quy nội bộ doanh nghiệp", scores: { legal: 15, strategic: 5 } },
      { value: "d", label: "Không có nền tảng pháp lý chuyên nghiệp", scores: { technical: 10, network: 5 } },
    ],
  },
  {
    id: "q8",
    question: "Bạn có kinh nghiệm làm việc với cơ quan quản lý nhà nước (Bộ Tài chính, NHNN, Bộ Công An) không?",
    options: [
      { value: "a", label: "Thường xuyên — đại diện doanh nghiệp làm việc trực tiếp", scores: { legal: 25, network: 15 } },
      { value: "b", label: "Đã từng tham gia nộp hồ sơ hoặc xin cấp phép", scores: { legal: 20, network: 5 } },
      { value: "c", label: "Hiểu quy trình nhưng chưa trực tiếp thực hiện", scores: { legal: 10 } },
      { value: "d", label: "Chưa có kinh nghiệm làm việc với cơ quan nhà nước", scores: { financial: 5, technical: 5 } },
    ],
  },
  // ── Nhóm 4: Tư duy chiến lược (strategic) ───────────────────────────────
  {
    id: "q9",
    question: "Bạn đánh giá tiềm năng thị trường tài sản mã hóa Việt Nam trong 5 năm tới như thế nào?",
    options: [
      { value: "a", label: "Rất lớn — đây là cơ hội 10 năm có một, tôi sẵn sàng đặt cược dài hạn", scores: { strategic: 25, financial: 5 } },
      { value: "b", label: "Tốt — có tiềm năng nhưng cần quản lý rủi ro cẩn thận", scores: { strategic: 20, financial: 10 } },
      { value: "c", label: "Trung bình — phụ thuộc nhiều vào cách triển khai pháp lý", scores: { strategic: 10, legal: 10 } },
      { value: "d", label: "Còn quá sớm để đánh giá — tôi muốn tham gia vì lý do khác", scores: { strategic: 5, network: 10 } },
    ],
  },
  {
    id: "q10",
    question: "Trong một công ty startup giai đoạn đầu, bạn có xu hướng đóng vai trò gì?",
    options: [
      { value: "a", label: "Người xây dựng chiến lược và điều phối nguồn lực tổng thể", scores: { strategic: 30 } },
      { value: "b", label: "Chuyên gia kỹ thuật hoặc sản phẩm — tập trung vào việc xây dựng", scores: { technical: 20, strategic: 10 } },
      { value: "c", label: "Người mở cửa — kết nối đối tác, khách hàng, nhà đầu tư", scores: { network: 25, strategic: 5 } },
      { value: "d", label: "Người bảo đảm pháp lý và tài chính — tuân thủ và ổn định", scores: { legal: 20, financial: 10 } },
    ],
  },
  // ── Nhóm 5: Mạng lưới quan hệ (network) ────────────────────────────────
  {
    id: "q11",
    question: "Mạng lưới quan hệ doanh nghiệp của bạn mạnh nhất ở lĩnh vực nào?",
    options: [
      { value: "a", label: "Tài chính: ngân hàng, quỹ đầu tư, công ty chứng khoán", scores: { network: 25, financial: 5 } },
      { value: "b", label: "Công nghệ: startup, BigTech, công ty phần mềm", scores: { network: 25, technical: 5 } },
      { value: "c", label: "Pháp lý & nhà nước: văn phòng luật sư, cơ quan quản lý", scores: { network: 20, legal: 10 } },
      { value: "d", label: "Quốc tế: đối tác nước ngoài, tổ chức quốc tế, VCs nước ngoài", scores: { network: 30 } },
    ],
  },
  {
    id: "q12",
    question: "Bạn có thể mang đến mối quan hệ với đối tác chiến lược tiềm năng nào?",
    options: [
      { value: "a", label: "Tổ chức tài chính muốn làm cổ đông chiến lược (ngân hàng, quỹ)", scores: { network: 30, financial: 10 } },
      { value: "b", label: "Công ty công nghệ / fintech muốn hợp tác hoặc mua cổ phần", scores: { network: 25, technical: 5 } },
      { value: "c", label: "Nhà đầu tư cá nhân uy tín trong ngành", scores: { network: 20 } },
      { value: "d", label: "Tôi tham gia với tư cách cá nhân, chưa có mối giới thiệu cụ thể", scores: { strategic: 5, technical: 5 } },
    ],
  },
  {
    id: "q13",
    question: "Bạn có thể cam kết tham gia chủ động vào hoạt động của AXVN Tech Holding ở mức độ nào?",
    options: [
      { value: "a", label: "Toàn thời gian — sẵn sàng tham gia ban điều hành hoặc hội đồng quản trị", scores: { strategic: 25, network: 10 } },
      { value: "b", label: "Bán thời gian — cố vấn chuyên môn, tham gia họp định kỳ", scores: { strategic: 15, network: 10 } },
      { value: "c", label: "Cổ đông tài chính — góp vốn và theo dõi tiến độ định kỳ", scores: { financial: 20 } },
      { value: "d", label: "Đối tác dự án — hợp tác theo từng giai đoạn cụ thể", scores: { network: 15, strategic: 5 } },
    ],
  },
  {
    id: "q14",
    question: "Điều gì thu hút bạn nhất khi cân nhắc tham gia AXVN Tech Holding?",
    options: [
      { value: "a", label: "Cơ hội xây dựng hệ thống công nghệ từ đầu, đúng tiêu chuẩn", scores: { technical: 20, strategic: 10 } },
      { value: "b", label: "Tiên phong trong thị trường được cấp phép chính thức tại Việt Nam", scores: { strategic: 20, financial: 10 } },
      { value: "c", label: "Đóng góp vào khung pháp lý và quản trị minh bạch cho ngành", scores: { legal: 20, strategic: 10 } },
      { value: "d", label: "Xây dựng mạng lưới đối tác tài chính / công nghệ đẳng cấp", scores: { network: 25, financial: 5 } },
    ],
  },
];

// ─── Logic tính điểm → gợi ý vai trò ────────────────────────────────────────

function computeScores(
  answers: Record<string, string>
): AssessmentDimensions {
  const scores: AssessmentDimensions = {
    technical: 0, financial: 0, legal: 0, strategic: 0, network: 0,
  };
  for (const q of QUESTIONS) {
    const selectedValue = answers[q.id];
    if (!selectedValue) continue;
    const option = q.options.find((o) => o.value === selectedValue);
    if (!option) continue;
    for (const [dim, pts] of Object.entries(option.scores)) {
      scores[dim as Dimension] += pts as number;
    }
  }
  // Chuẩn hóa về 0-100 (max có thể đạt = 30×3 = 90 ~ 100)
  const maxPossible = 90;
  for (const k of Object.keys(scores) as Dimension[]) {
    scores[k] = Math.min(100, Math.round((scores[k] / maxPossible) * 100));
  }
  return scores;
}

const ROLE_MAPPING: Record<Dimension, ShareholderRole> = {
  technical: "tech",
  financial: "financial",
  legal: "legal",
  strategic: "individual",
  network: "foreign",
};

function suggestRole(scores: AssessmentDimensions): ShareholderRole {
  let topDim: Dimension = "strategic";
  let topScore = -1;
  for (const [dim, score] of Object.entries(scores) as [Dimension, number][]) {
    if (score > topScore) { topScore = score; topDim = dim; }
  }
  return ROLE_MAPPING[topDim];
}

const ROLE_LABELS: Record<ShareholderRole, string> = {
  tech: "Đối Tác Công Nghệ",
  financial: "Cổ Đông Tài Chính",
  "tech-company": "Doanh Nghiệp Công Nghệ",
  individual: "Nhà Đầu Tư Cá Nhân Chiến Lược",
  legal: "Chuyên Gia Pháp Lý",
  foreign: "Đối Tác Quốc Tế",
};

const DIM_LABELS: Record<Dimension, string> = {
  technical: "Kỹ Thuật",
  financial: "Tài Chính",
  legal: "Pháp Lý",
  strategic: "Chiến Lược",
  network: "Mạng Lưới",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface QuizResult {
  answers: Record<string, string>;
  assessmentScore: AssessmentDimensions;
  suggestedRole: ShareholderRole;
}

interface RoleAssessmentQuizProps {
  onComplete: (result: QuizResult) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoleAssessmentQuiz({ onComplete }: RoleAssessmentQuizProps) {
  const [step, setStep] = useState(0);   // 0 = intro, 1-15 = câu hỏi, 16 = kết quả
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const totalQuestions = QUESTIONS.length;

  function handleAnswer(qId: string, value: string) {
    const updated = { ...answers, [qId]: value };
    setAnswers(updated);
    if (step < totalQuestions) {
      setStep(step + 1);
    } else {
      finishQuiz(updated);
    }
  }

  function finishQuiz(finalAnswers: Record<string, string>) {
    const scores = computeScores(finalAnswers);
    const role = suggestRole(scores);
    const r: QuizResult = { answers: finalAnswers, assessmentScore: scores, suggestedRole: role };
    setResult(r);
    setStep(totalQuestions + 1);
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-AXVN-gold/10 border border-AXVN-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-AXVN-gold font-bold text-xl">?</span>
        </div>
        <h3 className="text-AXVN-ivory font-bold text-lg mb-3">Đánh Giá Vai Trò Phù Hợp</h3>
        <p className="text-AXVN-silver/75 text-sm leading-relaxed max-w-md mx-auto mb-6">
          15 câu hỏi ngắn giúp hệ thống gợi ý vai trò cổ đông phù hợp nhất với năng lực của bạn.
          Không có câu trả lời đúng sai — chỉ là để hiểu bạn tốt hơn.
        </p>
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm hover:opacity-90 transition-opacity rounded-sm"
        >
          Bắt Đầu Đánh Giá
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-AXVN-silver/40 text-xs mt-3">Khoảng 3–5 phút · Hoàn toàn bảo mật</p>
      </div>
    );
  }

  // ── Kết quả ──────────────────────────────────────────────────────────────
  if (step === totalQuestions + 1 && result) {
    const dims = Object.entries(result.assessmentScore) as [Dimension, number][];
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle2 className="w-10 h-10 text-AXVN-gold mx-auto mb-3" />
          <h3 className="text-AXVN-ivory font-bold text-lg mb-1">Kết Quả Đánh Giá</h3>
          <p className="text-AXVN-silver/70 text-sm">Dựa trên câu trả lời của bạn, hệ thống gợi ý:</p>
        </div>

        <div className="bg-AXVN-gold/8 border border-AXVN-gold/30 rounded-xl p-5 text-center">
          <p className="text-AXVN-silver/60 text-xs tracking-widest uppercase mb-1">Vai Trò Đề Xuất</p>
          <p className="text-AXVN-gold font-bold text-xl">{ROLE_LABELS[result.suggestedRole]}</p>
        </div>

        {/* Biểu đồ điểm theo dimension */}
        <div className="space-y-3">
          {dims.sort(([, a], [, b]) => b - a).map(([dim, score]) => (
            <div key={dim}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-AXVN-silver text-xs font-medium">{DIM_LABELS[dim]}</span>
                <span className="text-AXVN-gold text-xs font-mono">{score}</span>
              </div>
              <div className="h-1.5 bg-AXVN-deep rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-AXVN-gold to-AXVN-champagne rounded-full transition-all duration-700"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { setStep(0); setAnswers({}); setResult(null); }}
            className="flex-1 py-3 border border-AXVN-gold/20 text-AXVN-silver text-sm hover:border-AXVN-gold/40 hover:text-AXVN-ivory transition-all rounded-sm"
          >
            Làm Lại
          </button>
          <button
            onClick={() => onComplete(result)}
            className="flex-[2] py-3 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm hover:opacity-90 transition-opacity rounded-sm flex items-center justify-center gap-2"
          >
            Tiếp Tục Đăng Ký
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Câu hỏi ──────────────────────────────────────────────────────────────
  const qIndex = step - 1;
  const q = QUESTIONS[qIndex];
  const progress = Math.round((qIndex / totalQuestions) * 100);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-AXVN-silver/60 text-xs">Câu {step}/{totalQuestions}</span>
          <span className="text-AXVN-gold text-xs font-mono">{progress}%</span>
        </div>
        <div className="h-1 bg-AXVN-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-AXVN-gold to-AXVN-champagne rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Câu hỏi */}
      <div>
        <p className="text-AXVN-ivory font-semibold text-sm leading-relaxed">{q.question}</p>
      </div>

      {/* Lựa chọn */}
      <div className="space-y-2.5">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(q.id, opt.value)}
            className={`w-full text-left p-4 border transition-all duration-150 rounded-sm ${answers[q.id] === opt.value
                ? "border-AXVN-gold/60 bg-AXVN-gold/8 text-AXVN-ivory"
                : "border-AXVN-gold/10 bg-AXVN-deep/40 text-AXVN-silver hover:border-AXVN-gold/30 hover:text-AXVN-ivory"
              }`}
          >
            <div className="flex items-start gap-3">
              <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5 ${answers[q.id] === opt.value
                  ? "bg-AXVN-gold border-AXVN-gold text-AXVN-navy"
                  : "border-AXVN-gold/20 text-AXVN-silver/50"
                }`}>
                {opt.value.toUpperCase()}
              </span>
              <span className="text-sm leading-relaxed">{opt.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Nav */}
      {qIndex > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-1.5 text-AXVN-silver/50 hover:text-AXVN-silver text-xs transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Câu trước
        </button>
      )}
    </div>
  );
}
