import type { MetadataRoute } from "next";
import { PAQUETES } from "@/lib/data";

const BASE = "https://vuelafacil.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...PAQUETES.map((p) => ({
      url: `${BASE}/paquetes/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
