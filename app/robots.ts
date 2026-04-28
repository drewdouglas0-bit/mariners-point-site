import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/cancel"],
    },
    sitemap: "https://mariners-point-site-fsrg.vercel.app/sitemap.xml",
  };
}
