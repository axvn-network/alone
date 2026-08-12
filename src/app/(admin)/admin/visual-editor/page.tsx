"use client";

import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { toast } from "sonner";
import {
  Save, RefreshCw, ChevronDown, ChevronUp, Plus, Trash2, Globe, Eye, EyeOff,
} from "lucide-react";
import { useCsrf } from "@/contexts/CsrfContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "vi" | "en";

interface ListItem {
  [key: string]: string;
}

interface SectionState {
  [key: string]: string | ListItem[];
}

// ─── Small reusable field components ──────────────────────────────────────────

function Field({
  label, hint, value, onChange, multiline = false, rows = 3,
}: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; multiline?: boolean; rows?: number;
}) {
  return (
    <div className="mb-4">
      <label className="block text-gvi-silver text-xs font-medium mb-1.5 tracking-wide">
        {label}
        {hint && <span className="ml-2 text-gvi-silver/40 font-normal normal-case">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#070e1a] border border-white/10 text-gvi-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-gvi-gold/50 transition-colors rounded-lg font-sans leading-relaxed resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#070e1a] border border-white/10 text-gvi-ivory text-sm px-3 py-2.5 focus:outline-none focus:border-gvi-gold/50 transition-colors rounded-lg"
        />
      )}
    </div>
  );
}

function ListEditor({
  label, items, fields, onChange, addLabel = "Thêm mục",
}: {
  label: string;
  items: ListItem[];
  fields: { key: string; label: string; multiline?: boolean }[];
  onChange: (items: ListItem[]) => void;
  addLabel?: string;
}) {
  function update(idx: number, key: string, val: string) {
    const next = items.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange(next);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    const blank: ListItem = {};
    fields.forEach((f) => { blank[f.key] = ""; });
    onChange([...items, blank]);
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gvi-silver text-xs font-medium tracking-wide">{label}</span>
        <button
          onClick={add}
          className="flex items-center gap-1 text-xs text-gvi-gold hover:text-gvi-champagne transition-colors border border-gvi-gold/30 hover:border-gvi-gold/60 px-2.5 py-1 rounded-md"
        >
          <Plus className="w-3 h-3" /> {addLabel}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#070e1a] border border-white/8 rounded-lg p-3 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gvi-gold/50 text-xs font-mono">#{String(idx + 1).padStart(2, "0")}</span>
              <button
                onClick={() => remove(idx)}
                className="text-red-400/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {fields.map((f) => (
              f.multiline ? (
                <div key={f.key} className="mb-2 last:mb-0">
                  <label className="block text-gvi-silver/60 text-xs mb-1">{f.label}</label>
                  <textarea
                    rows={2}
                    value={item[f.key] || ""}
                    onChange={(e) => update(idx, f.key, e.target.value)}
                    className="w-full bg-gvi-deep border border-white/8 text-gvi-ivory text-sm px-3 py-2 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-md font-sans leading-relaxed resize-y"
                  />
                </div>
              ) : (
                <div key={f.key} className="mb-2 last:mb-0">
                  <label className="block text-gvi-silver/60 text-xs mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={item[f.key] || ""}
                    onChange={(e) => update(idx, f.key, e.target.value)}
                    className="w-full bg-gvi-deep border border-white/8 text-gvi-ivory text-sm px-3 py-2 focus:outline-none focus:border-gvi-gold/40 transition-colors rounded-md"
                  />
                </div>
              )
            ))}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-gvi-silver/30 text-xs border border-dashed border-white/10 rounded-lg">
            Chưa có mục nào — nhấn &ldquo;{addLabel}&rdquo; để thêm
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title, badge, children, defaultOpen = false,
}: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-gvi-navy border border-gvi-gold/10 rounded-xl overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gvi-gold/5 transition-colors"
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex items-center gap-3">
          {badge && (
            <span className="text-gvi-gold/60 text-xs font-mono tracking-widest border border-gvi-gold/20 px-2 py-0.5 rounded-sm">
              {badge}
            </span>
          )}
          <span className="text-gvi-ivory text-sm font-medium">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gvi-silver/40" /> : <ChevronDown className="w-4 h-4 text-gvi-silver/40" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-gvi-gold/5">{children}</div>}
    </div>
  );
}

// ─── Lang tab strip ────────────────────────────────────────────────────────────

function LangTabs({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 bg-gvi-deep border border-gvi-gold/10 p-1 rounded-lg w-fit">
      {(["vi", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
            lang === l
              ? "bg-gvi-gold text-gvi-navy shadow-sm"
              : "text-gvi-silver/60 hover:text-gvi-ivory"
          }`}
        >
          <Globe className="w-3 h-3" />
          {l === "vi" ? "Tiếng Việt" : "English"}
        </button>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function VisualEditorPage() {
  const { csrfFetch } = useCsrf();
  const [lang, setLang] = useState<Lang>("vi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Each section key holds bilingual state: { vi: {...}, en: {...} }
  // We store both languages simultaneously so switching tabs doesn't lose data.
  const [data, setData] = useState<{ vi: SectionState; en: SectionState }>({ vi: {}, en: {} });

  // ── Load existing CMS data for both languages ────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      // We only store one merged `data` blob in the Page doc for slug "home".
      // For bilingual, we use key suffixes: _vi / _en
      const res = await fetch("/api/admin/content?slug=home");
      const json = await res.json();
      const raw = (json.success ? json.data?.data : json?.data) || {};

      // Split by _vi / _en suffix into two lang buckets
      const vi: SectionState = {};
      const en: SectionState = {};
      for (const [k, v] of Object.entries(raw)) {
        if (k.endsWith("_en")) {
          en[k.slice(0, -3)] = v as string | ListItem[];
        } else {
          // Default (no suffix) → vi
          vi[k] = v as string | ListItem[];
        }
      }
      setData({ vi, en });
    } catch {
      toast.error("Không tải được dữ liệu trang chủ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Field helpers for current lang ──────────────────────────────────────────
  function get(key: string): string {
    return (data[lang][key] as string) || "";
  }
  function getList(key: string): ListItem[] {
    const v = data[lang][key];
    return Array.isArray(v) ? v : [];
  }
  function set(key: string, value: string | ListItem[]) {
    setData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value },
    }));
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      // Merge vi keys (plain) + en keys (_en suffix) into one flat object
      const merged: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data.vi)) {
        merged[k] = v;
      }
      for (const [k, v] of Object.entries(data.en)) {
        merged[`${k}_en`] = v;
      }

      const res = await csrfFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "home", data: merged }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Đã lưu nội dung trang chủ thành công!");
    } catch {
      toast.error("Lưu nội dung thất bại");
    } finally {
      setSaving(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#03080e] flex selection:bg-gvi-gold/20 selection:text-gvi-champagne font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen relative">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gvi-gold/4 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

        <AdminNavbar title="Visual Editor — Trang chủ" />

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 relative z-10">

          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <LangTabs lang={lang} setLang={setLang} />
              <span className="text-gvi-silver/30 text-xs hidden sm:block">
                {lang === "vi" ? "Chỉnh sửa nội dung Tiếng Việt" : "Editing English content"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gvi-gold/20 text-gvi-silver/60 hover:text-gvi-ivory text-xs rounded-lg transition-colors"
              >
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                Xem trước
              </button>
              <button
                onClick={load}
                className="flex items-center gap-1.5 px-3 py-2 border border-gvi-gold/20 text-gvi-silver/60 hover:text-gvi-ivory text-xs rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tải lại
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-5 py-2 bg-gvi-gold text-gvi-navy text-sm font-bold hover:bg-gvi-champagne transition-colors disabled:opacity-50 rounded-lg shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : "Lưu tất cả"}
              </button>
            </div>
          </div>

          {/* Live preview banner */}
          {showPreview && (
            <div className="mb-5 rounded-xl border border-gvi-gold/20 overflow-hidden">
              <div className="bg-gvi-navy/60 px-4 py-2 flex items-center justify-between border-b border-gvi-gold/10">
                <span className="text-gvi-silver/60 text-xs">Xem trước trang chủ (live)</span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gvi-gold text-xs hover:underline"
                >
                  Mở tab mới ↗
                </a>
              </div>
              <iframe src="/" className="w-full h-[500px] bg-white border-0" title="Live preview" />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24 text-gvi-silver/40 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Đang tải dữ liệu...
            </div>
          ) : (
            <div className="space-y-2">

              {/* ══════════════════════ HERO ══════════════════════ */}
              <SectionCard title="Hero — Màn hình đầu trang" badge="01" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn (eyebrow)" hint="Ví dụ: GVI Tech Holding"
                    value={get("heroSubtitle")} onChange={(v) => set("heroSubtitle", v)} />
                  <Field label="Tiêu đề dòng 1" hint="Dòng trắng (font nhẹ)"
                    value={get("heroTitleLine1")} onChange={(v) => set("heroTitleLine1", v)} />
                  <Field label="Tiêu đề dòng 2 (vàng gradient)" hint="Dòng vàng — in đậm"
                    value={get("heroTitleLine2")} onChange={(v) => set("heroTitleLine2", v)} />
                  <Field label="Nút CTA 1" hint="Nút chính (vàng)"
                    value={get("heroBtn1Text")} onChange={(v) => set("heroBtn1Text", v)} />
                  <Field label="Nút CTA 2" hint="Nút phụ (viền)"
                    value={get("heroBtn2Text")} onChange={(v) => set("heroBtn2Text", v)} />
                </div>
                <Field label="Mô tả Hero" hint="Đoạn văn giới thiệu ngắn dưới tiêu đề" multiline rows={3}
                  value={get("heroDescription")} onChange={(v) => set("heroDescription", v)} />
              </SectionCard>

              {/* ══════════════════════ INTRODUCTION ══════════════════════ */}
              <SectionCard title="Introduction — Giới thiệu" badge="02">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn section" hint="Ví dụ: 01 — Introduction"
                    value={get("introTag")} onChange={(v) => set("introTag", v)} />
                  <Field label="Tiêu đề section"
                    value={get("introTitle")} onChange={(v) => set("introTitle", v)} />
                </div>
                <Field label="Đoạn văn 1" multiline rows={3}
                  value={get("introParagraph1")} onChange={(v) => set("introParagraph1", v)} />
                <Field label="Đoạn văn 2" multiline rows={3}
                  value={get("introParagraph2")} onChange={(v) => set("introParagraph2", v)} />
                <Field label="Đoạn văn 3" multiline rows={3}
                  value={get("introParagraph3")} onChange={(v) => set("introParagraph3", v)} />
              </SectionCard>

              {/* ══════════════════════ WHAT WE DO ══════════════════════ */}
              <SectionCard title="What We Do — Dịch vụ cốt lõi" badge="03">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn section" hint="Ví dụ: 02 — Core Capabilities"
                    value={get("whatTag")} onChange={(v) => set("whatTag", v)} />
                  <Field label="Tiêu đề section"
                    value={get("whatTitle")} onChange={(v) => set("whatTitle", v)} />
                  <Field label="Tagline phụ (vàng)"
                    value={get("whatSubtitle")} onChange={(v) => set("whatSubtitle", v)} />
                </div>
                <Field label="Đoạn mô tả 1" multiline rows={3}
                  value={get("whatDesc1")} onChange={(v) => set("whatDesc1", v)} />
                <Field label="Đoạn mô tả 2" multiline rows={3}
                  value={get("whatDesc2")} onChange={(v) => set("whatDesc2", v)} />
                <ListEditor
                  label="Thẻ Focus (4 thẻ)"
                  items={getList("whatCards")}
                  fields={[
                    { key: "title", label: "Tên thẻ" },
                    { key: "desc", label: "Mô tả", multiline: true },
                  ]}
                  onChange={(v) => set("whatCards", v)}
                  addLabel="Thêm thẻ Focus"
                />
              </SectionCard>

              {/* ══════════════════════ INVESTMENT SECTORS ══════════════════════ */}
              <SectionCard title="Investment Sectors — Lĩnh vực đầu tư" badge="04">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn section" hint="Ví dụ: 03 — Investment Sectors"
                    value={get("sectorsTag")} onChange={(v) => set("sectorsTag", v)} />
                  <Field label="Tiêu đề section"
                    value={get("sectorsTitle")} onChange={(v) => set("sectorsTitle", v)} />
                  <Field label="Nút CTA xem tất cả"
                    value={get("sectorsBtnText")} onChange={(v) => set("sectorsBtnText", v)} />
                </div>
                <Field label="Đoạn mô tả" multiline rows={3}
                  value={get("sectorsDesc")} onChange={(v) => set("sectorsDesc", v)} />
                <ListEditor
                  label="Danh sách lĩnh vực (bento grid — tối đa 9)"
                  items={getList("sectorsList")}
                  fields={[
                    { key: "title", label: "Tên lĩnh vực" },
                    { key: "desc", label: "Mô tả", multiline: true },
                  ]}
                  onChange={(v) => set("sectorsList", v)}
                  addLabel="Thêm lĩnh vực"
                />
              </SectionCard>

              {/* ══════════════════════ WHY CHOOSE US ══════════════════════ */}
              <SectionCard title="Why Choose Us — Tại sao chọn GVI" badge="05">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn section" hint="Ví dụ: 04 — Why Choose GVI Tech Holding"
                    value={get("whyTag")} onChange={(v) => set("whyTag", v)} />
                  <Field label="Tiêu đề section"
                    value={get("whyTitle")} onChange={(v) => set("whyTitle", v)} />
                </div>
                <ListEditor
                  label="Danh sách lợi ích (2 cột — tối đa 6)"
                  items={getList("whyBenefits")}
                  fields={[
                    { key: "title", label: "Tiêu đề lợi ích" },
                    { key: "desc", label: "Mô tả", multiline: true },
                  ]}
                  onChange={(v) => set("whyBenefits", v)}
                  addLabel="Thêm lợi ích"
                />
              </SectionCard>

              {/* ══════════════════════ PHILOSOPHY ══════════════════════ */}
              <SectionCard title="Philosophy — Triết lý & Cam kết" badge="06">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn section" hint="Ví dụ: 05 — Our Approach"
                    value={get("philTag")} onChange={(v) => set("philTag", v)} />
                  <Field label="Tiêu đề section"
                    value={get("philTitle")} onChange={(v) => set("philTitle", v)} />
                </div>
                <Field label="Mô tả section" multiline rows={3}
                  value={get("philDesc")} onChange={(v) => set("philDesc", v)} />
                <Field label="Quote (chữ nghiêng cuối section)" multiline rows={2}
                  value={get("philQuote")} onChange={(v) => set("philQuote", v)} />
                <ListEditor
                  label="Cam kết (3 thẻ)"
                  items={getList("philCommitments")}
                  fields={[
                    { key: "number", label: "Số thứ tự (ví dụ: 01)" },
                    { key: "title", label: "Tiêu đề cam kết" },
                    { key: "desc", label: "Mô tả", multiline: true },
                  ]}
                  onChange={(v) => set("philCommitments", v)}
                  addLabel="Thêm cam kết"
                />
              </SectionCard>

              {/* ══════════════════════ CTA ══════════════════════ */}
              <SectionCard title="Partnership CTA — Kêu gọi hành động" badge="07">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Thẻ nhãn section" hint="Ví dụ: 06 — Partnership"
                    value={get("ctaTag")} onChange={(v) => set("ctaTag", v)} />
                  <Field label="Tiêu đề section"
                    value={get("ctaTitle")} onChange={(v) => set("ctaTitle", v)} />
                  <Field label="Nút CTA 1 (chính — vàng)"
                    value={get("ctaBtn1Text")} onChange={(v) => set("ctaBtn1Text", v)} />
                  <Field label="Nút CTA 2 (phụ — viền)"
                    value={get("ctaBtn2Text")} onChange={(v) => set("ctaBtn2Text", v)} />
                </div>
                <Field label="Đoạn văn 1" multiline rows={3}
                  value={get("ctaParagraph1")} onChange={(v) => set("ctaParagraph1", v)} />
                <Field label="Đoạn văn 2" multiline rows={3}
                  value={get("ctaParagraph2")} onChange={(v) => set("ctaParagraph2", v)} />
              </SectionCard>

              {/* ══════════════════════ NEWSLETTER ══════════════════════ */}
              <SectionCard title="Newsletter — Đăng ký nhận tin" badge="08">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
                  <Field label="Tiêu đề section"
                    value={get("newsTitle")} onChange={(v) => set("newsTitle", v)} />
                  <Field label="Văn bản nút đăng ký"
                    value={get("newsBtnText")} onChange={(v) => set("newsBtnText", v)} />
                  <Field label="Placeholder email"
                    value={get("newsPlaceholder")} onChange={(v) => set("newsPlaceholder", v)} />
                  <Field label="Tiêu đề thành công"
                    value={get("newsSuccessTitle")} onChange={(v) => set("newsSuccessTitle", v)} />
                </div>
                <Field label="Mô tả section" multiline rows={3}
                  value={get("newsDescription")} onChange={(v) => set("newsDescription", v)} />
                <Field label="Disclaimer dưới form" multiline rows={2}
                  value={get("newsDisclaimer")} onChange={(v) => set("newsDisclaimer", v)} />
                <Field label="Nội dung thành công (mô tả)" multiline rows={2}
                  value={get("newsSuccessDesc")} onChange={(v) => set("newsSuccessDesc", v)} />
              </SectionCard>

              {/* ══════════════════════ SAVE BUTTON BOTTOM ══════════════════════ */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gvi-gold text-gvi-navy text-sm font-bold hover:bg-gvi-champagne transition-colors disabled:opacity-50 rounded-xl shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Đang lưu..." : "Lưu tất cả thay đổi"}
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
