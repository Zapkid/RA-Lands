import type { MetadataRoute } from "next";
import { getPublishedParcels } from "@/lib/parcels-data";
import { parcelPath } from "@/lib/parcels";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

const PAGES = ["", "/about", "/how-it-works", "/properties", "/faq", "/contact", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const parcels = await getPublishedParcels();
  return [
    ...PAGES.map((path) => ({
      url: `${SITE.url}${path}`,
      changeFrequency: path === "/properties" || path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/properties" ? 0.9 : 0.6,
    })),
    ...parcels.map((p) => ({
      url: `${SITE.url}${parcelPath(p.code)}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
