import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/components/CustomCursor";
import AnimationProvider from "@/components/AnimationProvider";
import GlobalNavbar from "@/components/GlobalNavbar";
import GlobalFooter from "@/components/GlobalFooter";
import { LangProvider } from "@/contexts/LangContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fortress Investment Holdings | Tập Đoàn Đầu Tư Hàng Đầu",
    template: "%s | Fortress Investment Holdings",
  },
  description:
    "Fortress Investment Holdings là tập đoàn đầu tư đa ngành hàng đầu tại Dubai và quốc tế, chuyên về bất động sản, mua bán doanh nghiệp, private equity, công nghệ AI và dịch vụ khách sạn nghỉ dưỡng.",
  keywords: [
    "tập đoàn đầu tư Dubai",
    "đầu tư bất động sản",
    "quỹ đầu tư tư nhân",
    "mua bán doanh nghiệp M&A",
    "Fortress Investment Holdings",
    "đầu tư công nghệ AI",
    "hợp tác chiến lược đầu tư",
    "quản lý tài sản cao cấp",
  ],
  authors: [{ name: "Fortress Investment Holdings" }],
  creator: "Fortress Investment Holdings",
  publisher: "Fortress Investment Holdings",
  metadataBase: new URL("https://fortressih.com"),
  openGraph: {
    title: "Fortress Investment Holdings - Vững Chắc Nền Tảng. Đột Phá Tầm Nhìn.",
    description: "Tập đoàn đầu tư chiến lược đa ngành với tầm nhìn bền vững và tiềm lực vững chắc.",
    type: "website",
    locale: "vi_VN",
    siteName: "Fortress Investment Holdings",
    url: "https://fortressih.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortress Investment Holdings",
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
    canonical: "https://fortressih.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`dark ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        {/* Meta Pixel */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'XXXXXXXXXXXXXXX');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body
        className="antialiased bg-fortress-navy text-fortress-silver cursor-none pb-[72px] md:pb-0"
        suppressHydrationWarning
      >
        <LangProvider>
          <AnimationProvider>
            <CustomCursor />
            <GlobalNavbar />
            {children}
            <GlobalFooter />
            <WhatsAppButton />
          </AnimationProvider>
        </LangProvider>
      </body>
    </html>
  );
}

