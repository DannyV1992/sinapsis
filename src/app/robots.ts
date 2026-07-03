import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/logo-export"],
      },
    ],
    sitemap: "https://sinapsiscr.com/sitemap.xml",
  };
}
