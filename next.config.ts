import type { NextConfig } from "next";
import { env } from "./src/core/env";

// Ensure env is loaded
console.log(`[Env] Running in ${env.NODE_ENV} mode`);

const isDev = env.NODE_ENV !== "production";

// ── Security headers ───────────────────────────────────────────────────────────
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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

  // ── Turbopack root — prevent "ignored package-lock.json" warning ─────────────
  // The project lives at /var/lkvip/langding/ inside a parent workspace.
  // Without this, Turbopack scans /var/lkvip/ and warns about the outer lock-file.
  turbopack: {
    root: __dirname,
  },

  // ── Redirects — short URLs → canonical routes (308 Permanent) ──────────────
  async redirects() {
    return [
      // ── Short public URLs → canonical /content/* ──────────────────────────
      { source: "/about",                 destination: "/content/about",                permanent: true },
      { source: "/architecture",          destination: "/content/architecture",         permanent: true },
      { source: "/compliance",            destination: "/content/compliance",           permanent: true },
      { source: "/contact",               destination: "/content/contact",              permanent: true },
      { source: "/documents",             destination: "/content/documents",            permanent: true },
      { source: "/governance",            destination: "/content/governance",           permanent: true },
      { source: "/insights",              destination: "/content/insights",             permanent: true },
      { source: "/insights/:slug",        destination: "/content/insights/:slug",       permanent: true },
      { source: "/investment-disclaimer", destination: "/content/investment-disclaimer", permanent: true },
      { source: "/investment-focus",      destination: "/content/investment-focus",     permanent: true },
      { source: "/ip-tech",               destination: "/content/ip-tech",              permanent: true },
      { source: "/kpis",                  destination: "/content/kpis",                 permanent: true },
      { source: "/our-approach",          destination: "/content/our-approach",         permanent: true },
      { source: "/privacy-policy",        destination: "/content/privacy-policy",       permanent: true },
      { source: "/project-dashboard",     destination: "/content/project-dashboard",    permanent: true },
      { source: "/risks",                 destination: "/content/risks",                permanent: true },
      { source: "/roadmap",               destination: "/content/roadmap",              permanent: true },
      { source: "/strategy",              destination: "/content/strategy",             permanent: true },
      { source: "/strategy-documents",    destination: "/content/strategy-documents",   permanent: true },
      { source: "/terms-of-use",          destination: "/content/terms-of-use",         permanent: true },
      // ── Invest-with-axvn short → portal canonical ────────────────────────
      { source: "/invest-with-axvn",       destination: "/portals/invest-with-axvn",        permanent: true },
      { source: "/invest-with-axvn/plans", destination: "/portals/invest-with-axvn/plans",  permanent: true },
      // ── Legacy auth path ─────────────────────────────────────────────────
      { source: "/auth/admin-login",       destination: "/admin-login",                     permanent: true },
    ];
  },


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
