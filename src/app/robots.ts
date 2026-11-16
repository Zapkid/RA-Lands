import type { MetadataRoute } from "next";
import { ADMIN_PATH } from "@/lib/admin";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [ADMIN_PATH, "/auth/", "/api/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
