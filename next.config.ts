import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// ── Security headers ───────────────────────────────────────────────────────────
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "X-Frame-Options",          value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "X-XSS-Protection",         value: "1; mode=block" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + GTM/GA + Meta Pixel + Cloudflare Insights
      // 'unsafe-eval' is needed by React DevTools in development only
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net https://static.cloudflareinsights.com`,
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' data: https://fonts.gstatic.com",
      // Images: self + Cloudinary + data URIs + GTM pixel
      "img-src 'self' data: blob: https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com",
      // Media (video/audio)
      "media-src 'self' blob:",
      // Connections: self + analytics + Gemini API + Cloudflare beacon
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.anthropic.com https://cloudflareinsights.com",
      // Frames: same origin only
      "frame-src 'none'",
      // Form actions: same origin only
      "form-action 'self'",
      // Base URI
      "base-uri 'self'",
      // Object/embed
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // ── Deployment ──────────────────────────────────────────────────────────────
  output: "standalone",

  // ── Performance ──────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,

  // ── Server-side native modules (bypass webpack bundling) ─────────────────────
  serverExternalPackages: ["cloudinary", "mongoose", "bcryptjs", "nodemailer"],

  // ── Images ───────────────────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    minimumCacheTTL: 3600,
  },

  // ── Production console stripping ──────────────────────────────────────────────
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ── Security + cache headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // API routes — no caching by default
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

};

export default nextConfig;
