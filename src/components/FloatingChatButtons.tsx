"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import type { IChatButton } from "@/models/Settings";

/* ── SVG icons ──────────────────────────────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6" fill="white" aria-hidden="true">
    <path d="M16.003 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.357.638 4.663 1.848 6.674L2.667 29.333l6.825-1.792A13.27 13.27 0 0 0 16.003 29.333C23.362 29.333 29.333 23.362 29.333 16S23.362 2.667 16.003 2.667zm0 24.267a11.01 11.01 0 0 1-5.615-1.538l-.402-.24-4.05 1.063 1.082-3.944-.263-.414A10.994 10.994 0 0 1 5.003 16c0-6.065 4.934-11 11-11s11 4.935 11 11-4.934 11-11 11zm6.03-8.23c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.524-.165-.745.165-.22.33-.854 1.073-1.047 1.294-.193.22-.385.248-.715.083-.33-.165-1.393-.514-2.653-1.637-.981-.874-1.643-1.953-1.836-2.283-.193-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.745-1.794-1.02-2.457-.269-.645-.543-.557-.745-.568l-.634-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.753s1.183 3.194 1.348 3.414c.165.22 2.328 3.555 5.642 4.987.788.34 1.403.543 1.882.695.791.252 1.511.216 2.08.131.635-.094 1.953-.798 2.229-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const ZaloIcon = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6" fill="white" aria-hidden="true">
    <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-3.5 27.5H17V20h3.5v11.5zm-1.75-13a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm14 13h-3.5v-6c0-1.38-.56-2-1.75-2s-1.75.62-1.75 2v6H22V20h3.5v1.5c.7-1.1 1.8-1.75 3.25-1.75 2.35 0 3.75 1.6 3.75 4.5v7.25z" />
  </svg>
);

const LiveChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
  </svg>
);

/* ── Config per type ─────────────────────────────────────────────────────────── */
const CHAT_CONFIG = {
  whatsapp: {
    label: "WhatsApp",
    bg: "bg-[#25D366] hover:bg-[#1ebe5d]",
    ping: "bg-green-500",
    shadow: "shadow-green-500/30",
    Icon: WhatsAppIcon,
    buildHref: (btn: IChatButton, lang: string) => {
      const msg = encodeURIComponent(lang === "vi" ? (btn.messageVi || "") : (btn.messageEn || ""));
      const phone = btn.value.replace(/\D/g, "");
      return `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`;
    },
  },
  telegram: {
    label: "Telegram",
    bg: "bg-[#229ED9] hover:bg-[#1a8fc4]",
    ping: "bg-sky-500",
    shadow: "shadow-sky-500/30",
    Icon: TelegramIcon,
    buildHref: (btn: IChatButton, lang: string) => {
      const msg = encodeURIComponent(lang === "vi" ? (btn.messageVi || "") : (btn.messageEn || ""));
      const val = btn.value.replace(/^@/, "");
      // username → t.me/username; phone number → direct link with text
      if (/^\d+$/.test(val)) return `https://t.me/+${val}`;
      return `https://t.me/${val}${msg ? `?text=${msg}` : ""}`;
    },
  },
  zalo: {
    label: "Zalo",
    bg: "bg-[#0068FF] hover:bg-[#0055cc]",
    ping: "bg-blue-500",
    shadow: "shadow-blue-500/30",
    Icon: ZaloIcon,
    buildHref: (btn: IChatButton) => {
      const phone = btn.value.replace(/\D/g, "");
      return `https://zalo.me/${phone}`;
    },
  },
  livechat: {
    label: "Live Chat",
    bg: "bg-[#C9A24A] hover:bg-[#b8912f]",
    ping: "bg-amber-500",
    shadow: "shadow-amber-500/30",
    Icon: LiveChatIcon,
    buildHref: (btn: IChatButton) => btn.value || "#",
  },
} as const;

/* ── Default fallback (backward-compat với whatsapp cũ) ───────────────────── */
const FALLBACK_BUTTONS: IChatButton[] = [
  {
    type: "whatsapp",
    enabled: true,
    value: "971500000000",
    messageVi: "Xin chào, tôi muốn tìm hiểu thêm về Fortress Investment Holdings.",
    messageEn: "Hello, I would like to enquire about Fortress Investment Holdings.",
  },
];

export default function FloatingChatButtons() {
  const [buttons, setButtons] = useState<IChatButton[]>([]);
  const { lang } = useLang();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const btns: IChatButton[] = data?.data?.chatButtons ?? [];
        if (btns.length > 0) {
          setButtons(btns);
        } else if (data?.data?.whatsapp) {
          // backward-compat: cũ chỉ có field whatsapp
          setButtons([{
            type: "whatsapp",
            enabled: true,
            value: data.data.whatsapp,
            messageVi: "Xin chào, tôi muốn tìm hiểu thêm về Fortress Investment Holdings.",
            messageEn: "Hello, I would like to enquire about Fortress Investment Holdings.",
          }]);
        } else {
          setButtons(FALLBACK_BUTTONS);
        }
      })
      .catch(() => setButtons(FALLBACK_BUTTONS));
  }, []);

  const visible = buttons.filter((b) => b.enabled);
  if (visible.length === 0) return null;

  return (
    <>
      <style>{`
        .chat-btn-group { bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px) + 0.75rem); }
        @media (min-width: 768px) { .chat-btn-group { bottom: 1.5rem; } }
      `}</style>
      <div className="fixed right-4 md:right-6 z-[60] chat-btn-group flex flex-col-reverse gap-3 items-end">
        {visible.map((btn) => {
          const cfg = CHAT_CONFIG[btn.type];
          if (!cfg) return null;
          const href = cfg.buildHref(btn as never, lang);
          const isExternal = href.startsWith("http");
          return (
            <a
              key={btn.type}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={`Chat qua ${cfg.label}`}
              className="group relative"
            >
              {/* Tooltip label */}
              <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#07111D]/90 backdrop-blur-sm text-fortress-ivory text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {cfg.label}
              </span>
              {/* Ping ring */}
              <div className={`absolute inset-0 ${cfg.ping} animate-ping opacity-20 rounded-full`} />
              {/* Button */}
              <div className={`relative w-12 h-12 md:w-14 md:h-14 ${cfg.bg} flex items-center justify-center shadow-lg ${cfg.shadow} transition-all duration-300 hover:scale-110 active:scale-95 rounded-full`}>
                <cfg.Icon />
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
