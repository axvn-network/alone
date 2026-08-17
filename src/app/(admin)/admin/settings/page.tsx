"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Trash2,
  Building2,
  MessageCircle,
  Share2,
  FileText,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Mail,
} from "lucide-react";
import AdminSidebar from "@/app/(admin)/components/AdminSidebar";
import AdminNavbar from "@/app/(admin)/components/AdminNavbar";
import { useCsrf } from "@/contexts/CsrfContext";

interface SocialLink {
  platform: string;
  url: string;
}

type ChatButtonType = "whatsapp" | "telegram" | "zalo" | "livechat";

interface ChatButton {
  type: ChatButtonType;
  enabled: boolean;
  value: string;
  messageVi: string;
  messageEn: string;
}

interface SiteSettingsData {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  googleMap: string;
  whatsapp: string;
  socialLinks: SocialLink[];
  footer: string;
  logo: string;
  favicon: string;
  chatButtons: ChatButton[];
}

const socialPlatforms = ["LinkedIn", "Instagram", "Facebook", "X (Twitter)", "YouTube", "TikTok", "Threads"];

const CHAT_TYPES: { type: ChatButtonType; label: string; color: string; hint: string }[] = [
  { type: "whatsapp", label: "WhatsApp", color: "#25D366", hint: "Nhập số điện thoại (chỉ số, không dấu +), VD: 84987654321" },
  { type: "telegram", label: "Telegram", color: "#229ED9", hint: "Nhập username (@ten) hoặc số điện thoại, VD: AXVNtech" },
  { type: "zalo", label: "Zalo", color: "#0068FF", hint: "Nhập số điện thoại Zalo, VD: 0987654321" },
  { type: "livechat", label: "Live Chat", color: "#C9A24A", hint: "Nhập URL đầy đủ của live chat widget, VD: https://..." },
];

const sections = [
  { key: "company", icon: Building2, label: "Thông tin công ty" },
  { key: "chat", icon: MessageCircle, label: "Nút Chat Nổi" },
  { key: "social", icon: Share2, label: "Mạng Xã Hội" },
  { key: "footer", icon: FileText, label: "Nội dung Footer" },
  { key: "media", icon: ImageIcon, label: "Logo & Favicon" },
  { key: "newsletter", icon: Mail, label: "Bản Tin" },
];

const DEFAULT_NEWS = {
  newsTitle: "Đăng Ký Nhận Bản Tin Chuyên Sâu",
  newsDescription: "Cập nhật góc nhìn thị trường, phân tích xu hướng đầu tư và tin tức mới nhất từ AXVN Tech Holding – gửi tới bạn khi có giá trị thực sự.",
  newsBtnText: "ĐĂNG KÝ",
  newsDisclaimer: "Bằng cách đăng ký, bạn đồng ý nhận các thông tin từ AXVN Tech Holding. Bạn có thể hủy đăng ký bất kỳ lúc nào.",
  newsPlaceholder: "Địa chỉ email của bạn",
  newsSuccessTitle: "Cảm ơn bạn đã đăng ký.",
  newsSuccessDesc: "Chúng tôi sẽ gửi tới bạn những góc nhìn chuyên sâu quan trọng nhất.",
};

interface NewsletterData {
  newsTitle: string;
  newsDescription: string;
  newsBtnText: string;
  newsDisclaimer: string;
  newsPlaceholder: string;
  newsSuccessTitle: string;
  newsSuccessDesc: string;
}

export default function SettingsPage() {
  const { csrfFetch } = useCsrf();
  const [data, setData] = useState<SiteSettingsData | null>(null);
  const [newsData, setNewsData] = useState<NewsletterData>(DEFAULT_NEWS);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("company");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const existing: ChatButton[] = res.data.chatButtons ?? [];
          const merged = CHAT_TYPES.map((c) => {
            const found = existing.find((b) => b.type === c.type);
            return found
              ? { ...found, messageVi: found.messageVi ?? "", messageEn: found.messageEn ?? "" }
              : { type: c.type, enabled: false, value: "", messageVi: "", messageEn: "" };
          });
          setData({ ...res.data, chatButtons: merged });
        }
      });
    // Load newsletter content from page "home"
    fetch("/api/admin/content?slug=home")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.data) {
          setNewsData((prev) => ({ ...prev, ...res.data.data }));
        }
      });
  }, []);

  function update<K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) {
    setData((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  function updateChat(type: ChatButtonType, field: keyof ChatButton, value: string | boolean) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chatButtons: prev.chatButtons.map((b) =>
          b.type === type ? { ...b, [field]: value } : b
        ),
      };
    });
  }

  function updateSocial(index: number, field: "platform" | "url", value: string) {
    setData((prev) => {
      if (!prev) return prev;
      const links = [...prev.socialLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, socialLinks: links };
    });
  }

  function addSocial() {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, socialLinks: [...prev.socialLinks, { platform: "", url: "" }] };
    });
  }

  function removeSocial(index: number) {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) };
    });
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await csrfFetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Tải lên thất bại");
      if (result.data?.url) update("logo", result.data.url);
      toast.success("Tải logo lên thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải lên thất bại");
    }
  }

  async function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await csrfFetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Tải lên thất bại");
      if (result.data?.url) update("favicon", result.data.url);
      toast.success("Tải favicon lên thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải lên thất bại");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (activeSection === "newsletter") {
        // Lưu newsletter vào page content "home"
        const res = await csrfFetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: "home", data: newsData }),
        });
        if (!res.ok) throw new Error("Lưu thất bại");
      } else {
        if (!data) return;
        const res = await csrfFetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Lưu thất bại");
      }
      toast.success("Đã lưu thành công");
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  function SectionNav() {
    return (
      <div className="flex gap-1 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors rounded-md ${activeSection === s.key
                ? "text-AXVN-gold bg-AXVN-gold/10 border-b-2 border-AXVN-gold"
                : "text-AXVN-silver hover:text-AXVN-ivory"
              }`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>
    );
  }

  const inputCls = "w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-4 py-3 focus:outline-none focus:border-AXVN-gold/50 rounded-lg";
  const labelCls = "block text-AXVN-silver text-xs font-medium mb-1.5 tracking-wide";

  if (!data) {
    return (
      <div className="min-h-screen bg-[#03080e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-AXVN-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-AXVN-gold/20 selection:text-AXVN-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-AXVN-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-AXVN-navy/50 rounded-full blur-[150px] pointer-events-none" />

        <AdminNavbar title="Cài Đặt" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">Cấu hình chung của website</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-AXVN-gold text-AXVN-navy text-sm font-bold hover:bg-AXVN-champagne transition-colors disabled:opacity-50 rounded-lg"
            >
              <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>

          <div className="md:hidden mb-4 bg-AXVN-navy border border-white/5 rounded-lg">
            <SectionNav />
          </div>

          <div className="flex gap-5">
            {/* Desktop sidebar nav */}
            <div className="hidden md:block w-44 shrink-0">
              <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 rounded-lg sticky top-4">
                <div className="flex flex-col gap-0.5 p-2">
                  {sections.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveSection(s.key)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all rounded-md ${activeSection === s.key
                          ? "text-AXVN-gold bg-AXVN-gold/10 border-l-2 border-AXVN-gold"
                          : "text-AXVN-silver hover:text-AXVN-ivory hover:bg-AXVN-deep border-l-2 border-transparent"
                        }`}
                    >
                      <s.icon className="w-3.5 h-3.5 shrink-0" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-5">
              {/* ── Thông tin công ty ── */}
              {activeSection === "company" && (
                <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <Building2 className="w-5 h-5 text-AXVN-gold" />
                    <h2 className="text-sm font-bold text-AXVN-ivory tracking-wide">Thông tin công ty</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Tên Công Ty</label>
                      <input type="text" value={data.companyName} onChange={(e) => update("companyName", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Số Điện Thoại</label>
                      <input type="text" value={data.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Địa Chỉ Email</label>
                      <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Địa Chỉ Văn Phòng</label>
                      <input type="text" value={data.address} onChange={(e) => update("address", e.target.value)} className={inputCls} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Đường Dẫn Nhúng Google Maps</label>
                      <input type="text" value={data.googleMap} onChange={(e) => update("googleMap", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Nút Chat Nổi ── */}
              {activeSection === "chat" && (
                <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg space-y-4">
                  <div className="flex items-center gap-3 mb-1">
                    <MessageCircle className="w-5 h-5 text-AXVN-gold" />
                    <h2 className="text-sm font-bold text-AXVN-ivory tracking-wide">Nút Chat Nổi</h2>
                  </div>
                  <p className="text-AXVN-silver/50 text-xs mb-4">
                    Bật tối đa 3 kênh. Các nút được hiển thị góc phải màn hình theo thứ tự từ dưới lên.
                  </p>

                  {CHAT_TYPES.map((cfg) => {
                    const btn = data.chatButtons.find((b) => b.type === cfg.type) ?? {
                      type: cfg.type, enabled: false, value: "", messageVi: "", messageEn: "",
                    };
                    const hasMessage = cfg.type === "whatsapp" || cfg.type === "telegram";
                    return (
                      <div
                        key={cfg.type}
                        className={`border rounded-lg p-4 transition-colors ${btn.enabled ? "border-AXVN-gold/30 bg-AXVN-deep/60" : "border-white/5 bg-AXVN-deep/20"}`}
                      >
                        {/* Header row: color dot + label + toggle */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                            <span className="text-AXVN-ivory text-sm font-semibold">{cfg.label}</span>
                            {btn.enabled && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-AXVN-navy" style={{ backgroundColor: cfg.color }}>
                                Đang bật
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => updateChat(cfg.type, "enabled", !btn.enabled)}
                            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                            style={{ color: btn.enabled ? cfg.color : "#8fa0b8" }}
                          >
                            {btn.enabled
                              ? <ToggleRight className="w-5 h-5" />
                              : <ToggleLeft className="w-5 h-5" />
                            }
                            {btn.enabled ? "Bật" : "Tắt"}
                          </button>
                        </div>

                        {btn.enabled && (
                          <div className="space-y-3">
                            <div>
                              <label className={labelCls}>
                                {cfg.type === "livechat" ? "URL Live Chat" : "Số / Username"}
                              </label>
                              <p className="text-AXVN-silver/35 text-[10px] mb-1.5">{cfg.hint}</p>
                              <input
                                type="text"
                                value={btn.value}
                                onChange={(e) => updateChat(cfg.type, "value", e.target.value)}
                                placeholder={cfg.type === "livechat" ? "https://..." : cfg.type === "telegram" ? "AXVNtech" : "971500000000"}
                                className={inputCls}
                              />
                            </div>
                            {hasMessage && (
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className={labelCls}>Tin nhắn mặc định (Tiếng Việt)</label>
                                  <input
                                    type="text"
                                    value={btn.messageVi}
                                    onChange={(e) => updateChat(cfg.type, "messageVi", e.target.value)}
                                    placeholder="Xin chào..."
                                    className={inputCls}
                                  />
                                </div>
                                <div>
                                  <label className={labelCls}>Tin nhắn mặc định (English)</label>
                                  <input
                                    type="text"
                                    value={btn.messageEn}
                                    onChange={(e) => updateChat(cfg.type, "messageEn", e.target.value)}
                                    placeholder="Hello..."
                                    className={inputCls}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Preview */}
                  <div className="mt-2 pt-4 border-t border-white/5">
                    <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest mb-3">Preview thứ tự hiển thị</p>
                    <div className="flex flex-col-reverse gap-2 items-start">
                      {data.chatButtons
                        .filter((b) => b.enabled)
                        .map((btn) => {
                          const c = CHAT_TYPES.find((c) => c.type === btn.type);
                          if (!c) return null;
                          return (
                            <div key={btn.type} className="flex items-center gap-2 text-xs text-AXVN-silver">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: c.color }}>
                                <span className="text-white text-[8px] font-bold">{c.label[0]}</span>
                              </div>
                              <span>{c.label}</span>
                              {btn.value && <span className="text-AXVN-silver/40 truncate max-w-[160px]">{btn.value}</span>}
                            </div>
                          );
                        })}
                      {data.chatButtons.filter((b) => b.enabled).length === 0 && (
                        <p className="text-AXVN-silver/30 text-xs italic">Chưa có kênh nào được bật</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Mạng xã hội ── */}
              {activeSection === "social" && (
                <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <Share2 className="w-5 h-5 text-AXVN-gold" />
                    <h2 className="text-sm font-bold text-AXVN-ivory tracking-wide">Liên kết Mạng Xã Hội</h2>
                  </div>
                  <div className="space-y-2.5">
                    {data.socialLinks.map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          value={link.platform}
                          onChange={(e) => updateSocial(i, "platform", e.target.value)}
                          className="w-40 bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-3 py-3 focus:outline-none focus:border-AXVN-gold/50 rounded-lg"
                        >
                          <option value="">Chọn...</option>
                          {socialPlatforms.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => updateSocial(i, "url", e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-3 py-3 focus:outline-none focus:border-AXVN-gold/50 rounded-lg"
                        />
                        <button onClick={() => removeSocial(i)} className="p-2 text-AXVN-silver/30 hover:text-red-400 transition-colors shrink-0 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addSocial} className="flex items-center gap-1.5 text-xs text-AXVN-gold hover:text-AXVN-champagne transition-colors mt-3 rounded-md">
                      <Plus className="w-3.5 h-3.5" /> Thêm Liên Kết
                    </button>
                  </div>
                </div>
              )}

              {/* ── Footer ── */}
              {activeSection === "footer" && (
                <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <FileText className="w-5 h-5 text-AXVN-gold" />
                    <h2 className="text-sm font-bold text-AXVN-ivory tracking-wide">Nội dung Footer</h2>
                  </div>
                  <div>
                    <label className={labelCls}>Mô tả Footer</label>
                    <textarea
                      value={data.footer}
                      onChange={(e) => update("footer", e.target.value)}
                      rows={4}
                      className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-4 py-3 focus:outline-none focus:border-AXVN-gold/50 resize-none rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* ── Logo & Favicon ── */}
              {activeSection === "media" && (
                <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <ImageIcon className="w-5 h-5 text-AXVN-gold" />
                    <h2 className="text-sm font-bold text-AXVN-ivory tracking-wide">Logo & Favicon</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-AXVN-silver text-xs font-medium mb-2 tracking-wide">Logo</label>
                      {data.logo && (
                        <div className="mb-2 p-4 bg-AXVN-deep border border-white/5 flex items-center justify-center rounded-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary URL: unknown dimensions */}
                          <img src={data.logo} alt="Site logo preview" className="h-12 w-auto object-contain" />
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 px-4 py-3.5 bg-AXVN-deep border border-dashed border-white/10 text-AXVN-silver text-xs hover:border-AXVN-gold/40 cursor-pointer transition-colors rounded-lg">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        {data.logo ? "Đổi Logo" : "Tải Logo Lên"}
                      </label>
                    </div>
                    <div>
                      <label className="block text-AXVN-silver text-xs font-medium mb-2 tracking-wide">Favicon</label>
                      {data.favicon && (
                        <div className="mb-2 p-4 bg-AXVN-deep border border-white/5 flex items-center justify-center rounded-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary URL: unknown dimensions */}
                          <img src={data.favicon} alt="Favicon preview" className="h-10 w-auto object-contain" />
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 px-4 py-3.5 bg-AXVN-deep border border-dashed border-white/10 text-AXVN-silver text-xs hover:border-AXVN-gold/40 cursor-pointer transition-colors rounded-lg">
                        <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                        {data.favicon ? "Đổi Favicon" : "Tải Favicon Lên"}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Bản Tin ── */}
              {activeSection === "newsletter" && (
                <div className="bg-AXVN-navy border-t-2 border-t-AXVN-gold/30 p-5 rounded-lg space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <Mail className="w-5 h-5 text-AXVN-gold" />
                    <h2 className="text-sm font-bold text-AXVN-ivory tracking-wide">Nội Dung Bản Tin</h2>
                  </div>
                  <p className="text-AXVN-silver/50 text-xs">
                    Chỉnh sửa nội dung hiển thị trong phần đăng ký bản tin ở trang chủ.
                  </p>

                  <div>
                    <label className={labelCls}>Tiêu Đề</label>
                    <input
                      type="text"
                      value={newsData.newsTitle}
                      onChange={(e) => setNewsData((p) => ({ ...p, newsTitle: e.target.value }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Mô Tả</label>
                    <textarea
                      value={newsData.newsDescription}
                      onChange={(e) => setNewsData((p) => ({ ...p, newsDescription: e.target.value }))}
                      rows={3}
                      className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-4 py-3 focus:outline-none focus:border-AXVN-gold/50 resize-none rounded-lg"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Placeholder Input Email</label>
                      <input
                        type="text"
                        value={newsData.newsPlaceholder}
                        onChange={(e) => setNewsData((p) => ({ ...p, newsPlaceholder: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Nội Dung Nút Đăng Ký</label>
                      <input
                        type="text"
                        value={newsData.newsBtnText}
                        onChange={(e) => setNewsData((p) => ({ ...p, newsBtnText: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Ghi Chú Bảo Mật (disclaimer)</label>
                    <textarea
                      value={newsData.newsDisclaimer}
                      onChange={(e) => setNewsData((p) => ({ ...p, newsDisclaimer: e.target.value }))}
                      rows={2}
                      className="w-full bg-AXVN-deep border border-white/10 text-AXVN-ivory text-sm px-4 py-3 focus:outline-none focus:border-AXVN-gold/50 resize-none rounded-lg"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest mb-3">Thông báo sau khi đăng ký thành công</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Tiêu Đề Thành Công</label>
                        <input
                          type="text"
                          value={newsData.newsSuccessTitle}
                          onChange={(e) => setNewsData((p) => ({ ...p, newsSuccessTitle: e.target.value }))}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Mô Tả Thành Công</label>
                        <input
                          type="text"
                          value={newsData.newsSuccessDesc}
                          onChange={(e) => setNewsData((p) => ({ ...p, newsSuccessDesc: e.target.value }))}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-AXVN-silver/40 text-[10px] uppercase tracking-widest mb-3">Xem trước</p>
                    <div className="bg-AXVN-deep border border-AXVN-gold/10 rounded-lg p-5 text-center">
                      <p className="text-AXVN-ivory text-sm font-bold mb-2">{newsData.newsTitle || "—"}</p>
                      <p className="text-AXVN-silver/60 text-xs mb-3">{newsData.newsDescription || "—"}</p>
                      <div className="flex max-w-xs mx-auto">
                        <div className="flex-1 px-3 py-2 bg-AXVN-navy border border-AXVN-gold/20 text-AXVN-silver/40 text-xs">
                          {newsData.newsPlaceholder || "—"}
                        </div>
                        <div className="px-4 py-2 bg-AXVN-gold text-AXVN-navy text-xs font-bold">
                          {newsData.newsBtnText || "—"}
                        </div>
                      </div>
                      <p className="text-AXVN-silver/25 text-[10px] mt-3">{newsData.newsDisclaimer || "—"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
