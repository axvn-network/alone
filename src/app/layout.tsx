import type { Metadata } from "next";
import Script from "next/script";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans } from "next/font/google";
import FloatingChatButtons from "@/components/layout/FloatingChatButtons";
import CustomCursor from "@/components/layout/CustomCursor";
import AnimationProvider from "@/components/layout/AnimationProvider";
import GlobalNavbar from "@/components/layout/GlobalNavbar";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { LangProvider } from "@/contexts/LangContext";
import "./globals.css";

// Analytics IDs — read from env; scripts are NOT injected when value is absent or placeholder
const GA_ID      = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID   = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA_ACTIVE  = !!GA_ID    && GA_ID    !== "G-XXXXXXXXXX";
const FB_ACTIVE  = !!PIXEL_ID && PIXEL_ID !== "XXXXXXXXXXXXXXX" && PIXEL_ID !== "XXXXXXXXXXXXXXXX";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GVI Tech Holding | Tập Đoàn Đầu Tư Hàng Đầu",
    template: "%s | GVI Tech Holding",
  },
  description:
    "GVI Tech Holding là tập đoàn đầu tư đa ngành hàng đầu tại Dubai và quốc tế, chuyên về bất động sản, mua bán doanh nghiệp, private equity, công nghệ AI và dịch vụ khách sạn nghỉ dưỡng.",
  keywords: [
    "tập đoàn đầu tư Dubai",
    "đầu tư bất động sản",
    "quỹ đầu tư tư nhân",
    "mua bán doanh nghiệp M&A",
    "GVI Tech Holding",
    "đầu tư công nghệ AI",
    "hợp tác chiến lược đầu tư",
    "quản lý tài sản cao cấp",
  ],
  authors: [{ name: "GVI Tech Holding" }],
  creator: "GVI Tech Holding",
  publisher: "GVI Tech Holding",
  metadataBase: new URL("https://langding.tc-gaming.live"),
  openGraph: {
    title: "GVI Tech Holding - Vững Chắc Nền Tảng. Đột Phá Tầm Nhìn.",
    description: "Tập đoàn đầu tư chiến lược đa ngành với tầm nhìn bền vững và tiềm lực vững chắc.",
    type: "website",
    locale: "vi_VN",
    siteName: "GVI Tech Holding",
    url: "https://langding.tc-gaming.live",
  },
  twitter: {
    card: "summary_large_image",
    title: "GVI Tech Holding",
    description: "Vững Chắc Nền Tảng. Đột Phá Tầm Nhìn.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://langding.tc-gaming.live",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`dark ${beVietnamPro.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Analytics — only injected when NEXT_PUBLIC_GA_ID is set to a real ID */}
        {GA_ACTIVE && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {/* Meta Pixel — only injected when NEXT_PUBLIC_META_PIXEL_ID is set to a real ID */}
        {FB_ACTIVE && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body
        className="antialiased bg-gvi-navy text-gvi-silver cursor-none"
        style={{
          paddingBottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px))",
        }}
        suppressHydrationWarning
      >
        <style>{`@media (min-width: 768px) { body { padding-bottom: 0 !important; } }`}</style>
        <LangProvider>
          <AnimationProvider>
            <CustomCursor />
            <GlobalNavbar />
            {children}
            <GlobalFooter />
            <FloatingChatButtons />
          </AnimationProvider>
        </LangProvider>
      </body>
    </html>
  );
}

