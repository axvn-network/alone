import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin-login", "/portals/shareholders/", "/api/"],
      },
    ],
    sitemap: "https://langding.tc-gaming.live/sitemap.xml",
  };
}
