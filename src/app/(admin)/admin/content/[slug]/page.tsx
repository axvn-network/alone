"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminSidebar from "@/shared/components/admin/AdminSidebar";
import AdminNavbar from "@/shared/components/admin/AdminNavbar";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye } from "lucide-react";
import RichTextEditor from "@/shared/components/ui/RichTextEditor";
import AiAssistPanel, { PAGE_AI_ACTIONS } from "@/shared/components/ui/AiAssistPanel";
import { useCsrf } from "@/contexts/CsrfContext";

const pageLabels: Record<string, string> = {
  home: "Trang chủ",
  about: "Giới thiệu",
  "investment-focus": "Lĩnh vực đầu tư",
  "our-approach": "Phương pháp tiếp cận",
  "partner-with-us": "Hợp tác đầu tư",
  contact: "Liên hệ",
  "privacy-policy": "Chính sách bảo mật",
  "terms-of-use": "Điều khoản sử dụng",
  "investment-disclaimer": "Miễn trừ trách nhiệm",
};

export default function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { csrfFetch } = useCsrf();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pageDataStr, setPageDataStr] = useState("{}");
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/content?slug=${slug}`)
      .then((r) => r.json())
      .then((res) => {
        const data = res.success ? res.data : res;
        setTitle(data.title || "");
        setContent(data.content || "");
        setPageDataStr(JSON.stringify(data.data || {}, null, 2));
      });
  }, [slug]);

  async function handleSave() {
    let parsedData = {};
    try {
      if (pageDataStr.trim()) {
        parsedData = JSON.parse(pageDataStr);
      }
      setJsonError("");
    } catch {
      setJsonError("Cú pháp JSON cấu hình không hợp lệ. Vui lòng kiểm tra lại.");
      toast.error("Lỗi định dạng JSON");
      return;
    }

    setSaving(true);
    try {
      const res = await csrfFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, content, data: parsedData }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Đã lưu trang thành công");
    } catch {
      toast.error("Lưu trang thất bại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-AXVN-gold/20 selection:text-AXVN-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-AXVN-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-AXVN-navy/50 rounded-full blur-[150px] pointer-events-none" />

        <AdminNavbar title={pageLabels[slug] || slug} />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/admin/content" className="flex items-center gap-1.5 text-AXVN-silver/50 hover:text-AXVN-gold text-xs transition-colors mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-AXVN-gold text-AXVN-navy text-sm font-bold hover:bg-AXVN-champagne transition-colors disabled:opacity-50 rounded-lg cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          <div className="space-y-6">

            {/* AI Assistant — full width banner at top */}
            <div className="bg-[#070e1a] border border-purple-500/20 rounded-xl p-4">
              <AiAssistPanel
                actions={PAGE_AI_ACTIONS}
                formValues={{
                  title,
                  content,
                  page_name: pageLabels[slug] || slug,
                  existing_title: title,
                }}
                lang="vi"
                onApply={(action, result) => {
                  if (action === "page_title") {
                    setTitle(result.trim());
                  } else if (action === "page_content" || action === "page_improve") {
                    setContent(result);
                  } else if (action === "translate_vi_en") {
                    navigator.clipboard.writeText(result);
                    toast.success("Bản dịch đã sao chép vào clipboard");
                  } else {
                    navigator.clipboard.writeText(result);
                    toast.success("Kết quả AI đã sao chép vào clipboard");
                  }
                }}
              />
            </div>

            <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
              <label className="block text-AXVN-silver text-xs font-medium mb-2 tracking-wide">Tiêu đề trang</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-4 py-3 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-lg"
              />
            </div>

            <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-AXVN-silver text-xs font-medium tracking-wide">Biến nội dung cấu trúc (Trường dữ liệu tĩnh)</label>
                <span className="text-[11px] text-AXVN-silver/40">Thay đổi trực tiếp các câu chữ hiển thị trên website</span>
              </div>
              <textarea
                rows={10}
                value={pageDataStr}
                onChange={(e) => setPageDataStr(e.target.value)}
                className="w-full bg-AXVN-deep border border-white/10 text-AXVN-champagne font-mono text-xs p-4 focus:outline-none focus:border-AXVN-gold/50 transition-colors rounded-lg leading-relaxed"
                placeholder="{}"
              />
              {jsonError && <p className="text-red-400 text-xs mt-2">{jsonError}</p>}
            </div>

            <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
              <label className="block text-AXVN-silver text-xs font-medium mb-2 tracking-wide">Nội dung chi tiết (Rich Text)</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-AXVN-gold" />
                <label className="text-AXVN-silver text-xs font-medium tracking-wide">Xem trước nội dung chi tiết</label>
              </div>
              <div className="border border-white/5 p-5 bg-AXVN-deep rounded-lg">
                <div className="prose max-w-none text-AXVN-ivory text-sm" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
