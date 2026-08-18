"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  ChevronDown,
  RefreshCw,
  Wand2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface AiAction {
  /** unique key, passed to API as `action` */
  key: string;
  label: string;
  /** icon emoji or short label shown in button */
  icon: string;
  /** context fields to pull automatically */
  contextFields?: string[];
}

export interface AiAssistPanelProps {
  /** All available actions for this form */
  actions: AiAction[];
  /** Current form values — used to inject context */
  formValues: Record<string, string>;
  /** Called when user clicks "Apply" on a result */
  onApply: (action: string, result: string) => void;
  /** Language hint passed to API */
  lang?: "vi" | "en";
  /** Additional custom context */
  extraContext?: Record<string, string>;
}

type PanelState = "collapsed" | "open";

export default function AiAssistPanel({
  actions,
  formValues,
  onApply,
  lang = "vi",
  extraContext = {},
}: AiAssistPanelProps) {
  const [state, setState] = useState<PanelState>("collapsed");
  const [selectedAction, setSelectedAction] = useState<AiAction>(actions[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowActions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function run(action: AiAction, prompt?: string) {
    setLoading(true);
    setResult("");

    // Build context from formValues
    const context: Record<string, string> = {
      lang,
      ...extraContext,
      ...Object.fromEntries(
        (action.contextFields || []).map((f) => [f, formValues[f] || ""]),
      ),
    };

    // Strip HTML tags for content_preview
    if (context.content) {
      context.content_preview = context.content
        .replace(/<[^>]*>/g, "")
        .slice(0, 500);
    }

    if (prompt) context.custom_prompt = prompt;

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action.key, context }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "AI lỗi. Thử lại.");
        return;
      }
      setResult(data.data.text);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          }),
        100,
      );
    } catch {
      toast.error("Lỗi kết nối. Thử lại.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Đã sao chép!");
  }

  function handleApply() {
    if (!result) return;
    onApply(selectedAction.key, result);
    toast.success("Đã áp dụng vào form!");
  }

  if (state === "collapsed") {
    return (
      <button
        onClick={() => setState("open")}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-purple-200 text-xs font-semibold rounded-xl transition-all duration-200 group"
        title="Mở AI Assistant"
      >
        <Sparkles className="w-3.5 h-3.5 group-hover:animate-pulse" />
        <span>AI Trợ Lý</span>
      </button>
    );
  }

  return (
    <div className="bg-[#070e1a] border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/15 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-purple-200">AI Trợ Lý</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-mono">
            Gemini
          </span>
        </div>
        <button
          onClick={() => {
            setState("collapsed");
            setResult("");
          }}
          className="p-1 text-purple-400/50 hover:text-purple-300 transition-colors rounded-lg hover:bg-white/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Action selector */}
        <div ref={dropdownRef} className="relative">
          <p className="text-[10px] font-semibold text-purple-400/70 uppercase tracking-wider mb-1.5">
            Chọn tác vụ
          </p>
          <button
            onClick={() => setShowActions(!showActions)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-xl text-sm text-AXVN-ivory transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>{selectedAction.icon}</span>
              <span className="font-medium">{selectedAction.label}</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-purple-400 transition-transform ${showActions ? "rotate-180" : ""}`}
            />
          </button>
          {showActions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#07111D] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl max-h-52 overflow-y-auto">
              {actions.map((a) => (
                <button
                  key={a.key}
                  onClick={() => {
                    setSelectedAction(a);
                    setShowActions(false);
                    setResult("");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                    selectedAction.key === a.key
                      ? "bg-purple-500/10 text-purple-300"
                      : "text-AXVN-silver/80"
                  }`}
                >
                  <span className="text-base">{a.icon}</span>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom prompt (for custom action) */}
        {selectedAction.key === "custom" && (
          <div>
            <p className="text-[10px] font-semibold text-purple-400/70 uppercase tracking-wider mb-1.5">
              Yêu cầu tùy chỉnh
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Nhập yêu cầu của bạn..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-AXVN-ivory placeholder:text-AXVN-silver/30 focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={() =>
            run(
              selectedAction,
              selectedAction.key === "custom" ? customPrompt : undefined,
            )
          }
          disabled={
            loading || (selectedAction.key === "custom" && !customPrompt.trim())
          }
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tạo…
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Tạo với AI
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-purple-400/70 uppercase tracking-wider">
                Kết quả
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    run(
                      selectedAction,
                      selectedAction.key === "custom"
                        ? customPrompt
                        : undefined,
                    )
                  }
                  className="p-1.5 text-purple-400/60 hover:text-purple-300 hover:bg-white/5 rounded-lg transition-colors"
                  title="Tạo lại"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-purple-400/60 hover:text-purple-300 hover:bg-white/5 rounded-lg transition-colors"
                  title="Sao chép"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-white/5 border border-purple-500/20 rounded-xl p-3 max-h-48 overflow-y-auto">
              <p className="text-xs text-AXVN-silver/90 leading-relaxed whitespace-pre-wrap">
                {result}
              </p>
            </div>
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 py-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 text-xs font-bold rounded-xl transition-all"
            >
              <Send className="w-3 h-3" />
              Áp dụng vào form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Pre-built action sets for each form ─────────────────────── */
export const BLOG_AI_ACTIONS: AiAction[] = [
  {
    key: "blog_title",
    icon: "✍️",
    label: "Gợi ý tiêu đề",
    contextFields: ["topic", "content", "category"],
  },
  {
    key: "blog_excerpt",
    icon: "📝",
    label: "Viết tóm tắt",
    contextFields: ["title", "content"],
  },
  {
    key: "blog_content",
    icon: "📄",
    label: "Viết nội dung",
    contextFields: ["title", "excerpt", "category"],
  },
  {
    key: "blog_continue",
    icon: "▶️",
    label: "Tiếp tục viết",
    contextFields: ["title", "content"],
  },
  {
    key: "blog_improve",
    icon: "✨",
    label: "Cải thiện văn phong",
    contextFields: ["selected_text", "content"],
  },
  {
    key: "blog_seo_title",
    icon: "🔍",
    label: "Tạo SEO title",
    contextFields: ["title", "category"],
  },
  {
    key: "blog_seo_desc",
    icon: "📊",
    label: "Tạo meta description",
    contextFields: ["title", "excerpt"],
  },
  {
    key: "blog_tags",
    icon: "🏷️",
    label: "Gợi ý tags",
    contextFields: ["title", "category", "content"],
  },
  {
    key: "translate_vi_en",
    icon: "🌐",
    label: "Dịch → English",
    contextFields: ["title"],
  },
  {
    key: "summarize",
    icon: "📋",
    label: "Tóm tắt nội dung",
    contextFields: ["content"],
  },
  { key: "custom", icon: "💬", label: "Yêu cầu tùy chỉnh", contextFields: [] },
];

export const DOC_AI_ACTIONS: AiAction[] = [
  {
    key: "doc_title_vi",
    icon: "✍️",
    label: "Gợi ý tên VN",
    contextFields: ["category", "hint"],
  },
  {
    key: "doc_title_en",
    icon: "🌐",
    label: "Dịch tên → English",
    contextFields: ["title_vi", "category"],
  },
  {
    key: "translate_vi_en",
    icon: "🔄",
    label: "Dịch văn bản",
    contextFields: ["title"],
  },
  { key: "custom", icon: "💬", label: "Yêu cầu tùy chỉnh", contextFields: [] },
];

export const PAGE_AI_ACTIONS: AiAction[] = [
  {
    key: "page_title",
    icon: "✍️",
    label: "Gợi ý tiêu đề",
    contextFields: ["page_name", "title"],
  },
  {
    key: "page_content",
    icon: "📄",
    label: "Viết nội dung",
    contextFields: ["page_name", "title"],
  },
  {
    key: "page_improve",
    icon: "✨",
    label: "Cải thiện nội dung",
    contextFields: ["content"],
  },
  {
    key: "translate_vi_en",
    icon: "🌐",
    label: "Dịch → English",
    contextFields: ["content"],
  },
  {
    key: "summarize",
    icon: "📋",
    label: "Tóm tắt",
    contextFields: ["content"],
  },
  { key: "custom", icon: "💬", label: "Yêu cầu tùy chỉnh", contextFields: [] },
];
