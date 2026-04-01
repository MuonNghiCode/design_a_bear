import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/*", "/story", "/connect"],
        disallow: [
          "/admin",
          "/admin/*",
          "/staff",
          "/staff/*",
          "/auth",
          "/checkout",
          "/success",
          "/profile",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
