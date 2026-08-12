"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  Globe,
  ImageIcon,
  Tag,
  Clock,
  AlertCircle,
  Upload,
  X,
  FileText,
  Settings2,
  Layers,
  AlertTriangle,
  ImageOff,
  ChevronDown,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import RichTextEditor from "@/components/shared/RichTextEditor";
import AiAssistPanel, { BLOG_AI_ACTIONS } from "@/components/shared/AiAssistPanel";
import { useCsrf } from "@/contexts/CsrfContext";

// Danh sách danh mục phải khớp hoàn toàn với CAT_COLORS trong blog/page.tsx
const categories = [
  "Real Estate",
  "Business Acquisitions",
  "Private Equity",
  "AI & Technology",
  "Digital Assets & Blockchain",
  "Hospitality",
  "Trading & Distribution",
  "Market Insights",
  "Company News",
  "Strategic Investment Management",
];

type Tab = "content" | "seo" | "settings";

/* ─── Delete Confirmation Modal ──────────────────────────────── */
function DeleteModal({
  title,
  featuredImage,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  featuredImage: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#07111D] border border-red-500/20 rounded-2xl shadow-2xl shadow-black/60 w-full max-w-md p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-gvi-silver/40 hover:text-gvi-ivory transition-colors rounded-lg hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gvi-ivory mb-1">Xóa Bài Viết?</h2>
        <p className="text-gvi-silver/50 text-sm mb-4 leading-relaxed">
          Thao tác này sẽ xóa vĩnh viễn{" "}
          <span className="text-gvi-ivory font-semibold">&ldquo;{title}&rdquo;</span>.
          Không thể hoàn tác hành động này.
        </p>
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl mb-5">
          <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
            {featuredImage ? (
              <Image src={featuredImage} alt="" fill className="object-cover" sizes="56px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-4 h-4 text-gvi-silver/30" />
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gvi-ivory truncate">{title || "Untitled"}</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-white/10 text-gvi-silver/70 text-sm font-semibold hover:border-white/20 hover:text-gvi-ivory transition-all rounded-xl"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500/90 hover:bg-red-500 text-white text-sm font-bold transition-all rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {loading ? "Đang xóa…" : "Xóa Bài Viết"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Editor Component ──────────────────────────────────── */
export default function ArticleEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { csrfFetch } = useCsrf();
  const isNew = slug === "new";

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [readTime, setReadTime] = useState("5 min read");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [imageUploading, setImageUploading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (isNew) {
      setDataLoaded(true);
      return;
    }
    setDataLoaded(false);
    setLoadError(false);
    fetch(`/api/admin/articles/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to load");
        const a = res.data;
        setTitle(a.title || "");
        setExcerpt(a.excerpt || "");
        setContent(a.content || "");
        setCategory(a.category || "Market Insights");
        setReadTime(a.readTime || "5 min read");
        setTags(a.tags || []);
        setFeaturedImage(a.featuredImage || "");
        setStatus(a.status || "draft");
        setSeoTitle(a.seo?.title || "");
        setSeoDescription(a.seo?.description || "");
        setDataLoaded(true);
      })
      .catch(() => {
        setLoadError(true);
        setDataLoaded(true);
      });
  }, [slug, isNew]);

  function generateSlug(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!title.trim()) { toast.error("Tiêu đề là bắt buộc"); return; }
    setSaving(true);
    const articleSlug = isNew ? generateSlug(title) : slug;
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew
        ? "/api/admin/articles"
        : `/api/admin/articles/${slug}`;
      const res = await csrfFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, excerpt, content, category, readTime, tags,
          featuredImage, status,
          seo: { title: seoTitle || title, description: seoDescription || excerpt },
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Failed to save");
      toast.success(isNew ? "Đã tạo bài viết" : "Đã lưu bài viết");
      if (isNew) {
        const saved = d.data;
        router.push(`/admin/blog/${saved?.slug || articleSlug}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      const res = await csrfFetch(`/api/admin/articles/${slug}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Xóa bài viết thất bại");
      toast.success("Đã xóa bài viết");
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xóa bài viết thất bại");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await csrfFetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      if (data.data?.url) setFeaturedImage(data.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setImageUploading(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "content", label: "Nội Dung", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "seo", label: "SEO", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "settings", label: "Cài Đặt", icon: <Settings2 className="w-3.5 h-3.5" /> },
  ];

  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;

  // Loading skeleton
  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-[#03080e] flex font-sans">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto min-h-screen relative">
          <AdminNavbar title="Loading…" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-4">
            {[200, 120, 400].map((h, i) => (
              <div key={i} className={`bg-[#07111D]/60 border border-white/5 rounded-xl animate-pulse`} style={{ height: h }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-gvi-gold/20 selection:text-gvi-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gvi-gold/4 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-blue-600/4 rounded-full blur-[120px] pointer-events-none" />

        <AdminNavbar title={isNew ? "Tạo Bài Viết Mới" : "Chỉnh Sửa Bài Viết"} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">

          {/* Load error banner */}
          {loadError && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Không tìm thấy bài viết hoặc tải thất bại. <Link href="/admin/blog" className="underline ml-1">Quay lại danh sách</Link>
            </div>
          )}

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 px-3 py-2 border border-white/10 text-gvi-silver/60 hover:text-gvi-gold hover:border-gvi-gold/30 text-xs font-medium transition-all rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gvi-ivory tracking-tight">
                  {isNew ? "Tạo Bài Viết Mới" : "Chỉnh Sửa Bài Viết"}
                </h1>
                <p className="text-gvi-silver/40 text-xs mt-0.5">
                  {isNew ? "Viết và xuất bản bài viết mới" : `/${slug}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Status toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setStatus("draft")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${status === "draft" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-gvi-silver/50 hover:text-gvi-ivory"}`}
                >
                  Bản Nháp
                </button>
                <button
                  onClick={() => setStatus("published")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${status === "published" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-gvi-silver/50 hover:text-gvi-ivory"}`}
                >
                  Xuất Bản
                </button>
              </div>

              {!isNew && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-gvi-silver/60 text-sm hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xóa</span>
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gvi-gold text-gvi-navy text-sm font-bold hover:bg-gvi-champagne transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-gvi-gold/10"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Đang lưu…" : "Lưu"}
              </button>
            </div>
          </div>

          {/* Main layout */}
          <div className="flex gap-5 items-start">

            {/* Left: Editor */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Title field */}
              <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                <label className="block text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest mb-3">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full bg-transparent text-gvi-ivory text-xl font-bold placeholder:text-gvi-silver/20 focus:outline-none border-b border-white/5 pb-3 focus:border-gvi-gold/30 transition-colors"
                />
                {title && (
                  <p className="text-[10px] text-gvi-silver/30 mt-2.5">
                    Slug: <span className="font-mono text-gvi-silver/50">/insights/{isNew ? generateSlug(title) : slug}</span>
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest">Tóm Tắt Bài Viết</label>
                  <span className={`text-[10px] font-medium ${excerpt.length > 200 ? "text-red-400" : "text-gvi-silver/30"}`}>{excerpt.length}/200</span>
                </div>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Mô tả ngắn hiển thị trong card và kết quả tìm kiếm..."
                  rows={3}
                  className="w-full bg-transparent text-gvi-ivory text-sm placeholder:text-gvi-silver/20 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Tabbed panel */}
              <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
                <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 text-xs font-semibold transition-all border-b-2 shrink-0 ${
                          activeTab === t.id
                            ? "border-gvi-gold text-gvi-gold bg-gvi-gold/5"
                            : "border-transparent text-gvi-silver/40 hover:text-gvi-ivory hover:bg-white/5"
                        }`}
                      >
                        {t.icon} {t.label}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center px-2 sm:px-4 gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-gvi-silver/30 border-b-2 border-transparent shrink-0">
                      <span className="whitespace-nowrap">{wordCount} từ</span>
                      <span className="whitespace-nowrap">{charCount} ký tự</span>
                    </div>
                </div>

                <div className="p-5">
                  {activeTab === "content" && (
                    <RichTextEditor value={content} onChange={setContent} />
                  )}

                  {activeTab === "seo" && (
                    <div className="space-y-5">
                      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-blue-400/80 flex items-start gap-2">
                        <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        Kiểm soát cách bài viết hiển thị trên Google. Nếu để trống, hệ thống sẽ dùng tiêu đề và tóm tắt mặc định.
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest">Tiêu Đề SEO</label>
                          <span className={`text-[10px] font-medium ${seoTitle.length > 60 ? "text-red-400" : "text-gvi-silver/30"}`}>{seoTitle.length}/60</span>
                        </div>
                        <input
                          type="text"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          placeholder={title || "Nhập tiêu đề SEO…"}
                          className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-4 py-3 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg placeholder:text-gvi-silver/20"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest">Mô Tả SEO</label>
                          <span className={`text-[10px] font-medium ${seoDescription.length > 160 ? "text-red-400" : "text-gvi-silver/30"}`}>{seoDescription.length}/160</span>
                        </div>
                        <textarea
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          placeholder={excerpt || "Nhập mô tả meta…"}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-4 py-3 focus:outline-none focus:border-gvi-gold/40 transition-colors resize-none rounded-lg placeholder:text-gvi-silver/20"
                        />
                      </div>
                      {(seoTitle || title) && (
                        <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                          <p className="text-[10px] font-bold text-gvi-silver/30 uppercase tracking-widest mb-3">Xem Trước Trên Google</p>
                          <p className="text-blue-400 text-base font-medium leading-snug truncate">{seoTitle || title}</p>
                          <p className="text-green-500/70 text-xs mt-0.5">fortressih.com › insights › {isNew ? generateSlug(title) : slug}</p>
                          <p className="text-gvi-silver/50 text-xs mt-1 line-clamp-2 leading-relaxed">{seoDescription || excerpt || "Chưa có mô tả."}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest mb-2"><Tag className="w-3 h-3" /> Danh Mục</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-4 py-3 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg appearance-none"
                          >
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest mb-2"><Clock className="w-3 h-3" /> Thời Gian Đọc</label>
                          <input
                            type="text"
                            value={readTime}
                            onChange={(e) => setReadTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-4 py-3 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest mb-2"><Tag className="w-3 h-3" /> Thẻ Tags</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1 text-[11px] bg-gvi-gold/10 text-gvi-gold border border-gvi-gold/20 px-2 py-1 rounded">
                              {tag}
                              <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="hover:text-red-400 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && tagInput.trim()) {
                                e.preventDefault();
                                setTags([...tags, tagInput.trim()]);
                                setTagInput("");
                              }
                            }}
                            placeholder="Nhập tag và nhấn Enter"
                            className="flex-1 bg-white/5 border border-white/10 text-gvi-ivory text-sm px-4 py-3 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg placeholder:text-gvi-silver/20"
                          />
                          <button
                            onClick={() => {
                              if (tagInput.trim()) {
                                setTags([...tags, tagInput.trim()]);
                                setTagInput("");
                              }
                            }}
                            className="px-4 py-3 bg-gvi-gold/20 text-gvi-gold text-sm font-semibold border border-gvi-gold/30 rounded-lg hover:bg-gvi-gold/30 transition-colors"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                      <div className="sm:hidden">
                        <label className="block text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest mb-2">Trạng Thái Xuất Bản</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                          className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-4 py-3 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg appearance-none"
                        >
                          <option value="draft">Bản Nháp</option>
                          <option value="published">Xuất Bản</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">

              {/* AI Assistant Panel */}
              <AiAssistPanel
                actions={BLOG_AI_ACTIONS}
                formValues={{
                  title,
                  excerpt,
                  content,
                  category,
                  topic: title,
                  selected_text: "",
                  word_count: String(wordCount),
                }}
                lang="vi"
                onApply={(action, result) => {
                  if (action === "blog_title") {
                    // First line as title
                    setTitle(result.split("\n")[0].replace(/^[-•*\d.]\s*/, "").trim());
                  } else if (action === "blog_excerpt") {
                    setExcerpt(result.slice(0, 200));
                  } else if (action === "blog_content" || action === "blog_continue" || action === "blog_improve") {
                    setContent((prev) => (action === "blog_continue" ? prev + "\n" + result : result));
                  } else if (action === "blog_seo_title") {
                    setSeoTitle(result.slice(0, 60));
                  } else if (action === "blog_seo_desc") {
                    setSeoDescription(result.slice(0, 160));
                  } else if (action === "blog_tags") {
                    const newTags = result.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);
                    setTags((prev) => [...new Set([...prev, ...newTags])]);
                  } else if (action === "blog_readtime") {
                    setReadTime(result.trim());
                  } else {
                    // Generic: copy to clipboard + show toast
                    navigator.clipboard.writeText(result);
                    toast.success("Kết quả AI đã được sao chép vào clipboard");
                  }
                }}
              />

              {/* Publish */}
              <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-gvi-gold" />
                  <h3 className="text-xs font-bold text-gvi-ivory uppercase tracking-widest">Xuất Bản</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === "published" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-sm font-semibold text-gvi-ivory">{status === "published" ? "Đã xuất bản" : "Bản nháp"}</span>
                  </div>
                  <div className="flex gap-2">
                    {(["draft", "published"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all border ${
                          status === s
                            ? s === "published"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "border-white/10 text-gvi-silver/50 hover:border-white/20 hover:text-gvi-ivory"
                        }`}
                      >
                        {s === "draft" ? "Bản Nháp" : "Xuất Bản"}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gvi-gold text-gvi-navy text-sm font-bold hover:bg-gvi-champagne transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "Đang lưu…" : "Lưu Bài Viết"}
                  </button>
                  {!isNew && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 text-gvi-silver/50 text-xs font-medium hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 transition-all rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa Bài Viết
                    </button>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-gvi-gold" />
                  <h3 className="text-xs font-bold text-gvi-ivory uppercase tracking-widest">Ảnh Bìa</h3>
                </div>
                <div className="p-4">
                  {featuredImage ? (
                    <div className="relative group rounded-lg overflow-hidden border border-white/10 h-40">
                      <Image src={featuredImage} alt="" fill className="object-cover" sizes="288px" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors" title="Change image">
                          <Upload className="w-4 h-4 text-white" />
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <button
                          onClick={() => setFeaturedImage("")}
                          className="p-2 bg-white/10 hover:bg-red-500/30 rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 h-36 border border-dashed border-white/10 rounded-lg hover:border-gvi-gold/30 cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/5">
                      {imageUploading ? (
                        <div className="w-6 h-6 border-2 border-gvi-gold/40 border-t-gvi-gold rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gvi-silver/30" />
                          <div className="text-center">
                            <p className="text-xs text-gvi-silver/60 font-medium">Nhấn để tải ảnh lên</p>
                            <p className="text-[10px] text-gvi-silver/30">PNG, JPG, WebP tối đa 5MB</p>
                          </div>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
                    </label>
                  )}
                  {uploadError && (
                    <p className="text-[10px] text-red-400 mt-2">{uploadError}</p>
                  )}
                  {featuredImage && (
                    <p className="text-[10px] text-gvi-silver/30 mt-2 truncate">{featuredImage}</p>
                  )}
                </div>
              </div>

              {/* Category & Read Time */}
              <div className="bg-[#07111D]/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gvi-gold" />
                  <h3 className="text-xs font-bold text-gvi-ivory uppercase tracking-widest">Danh Mục & Thông Tin</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg appearance-none cursor-pointer"
                    >
                      {categories.map((c) => <option key={c} value={c} className="bg-[#07111D] text-gvi-ivory">{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gvi-silver/40 pointer-events-none" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-gvi-silver/40 uppercase tracking-widest mb-2">
                      <Clock className="w-3 h-3" /> Read Time
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-gvi-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Preview link */}
              {!isNew && (
                <Link
                  href={`/insights/${slug}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 py-2.5 border border-white/10 text-gvi-silver/50 text-xs font-medium hover:border-gvi-gold/30 hover:text-gvi-gold transition-all rounded-xl"
                >
                  <Eye className="w-3.5 h-3.5" /> Xem Bài Viết Trực Tiếp
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          title={title}
          featuredImage={featuredImage}
          onConfirm={handleDelete}
          onCancel={() => !deleteLoading && setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
