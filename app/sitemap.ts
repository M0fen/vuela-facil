import type { MetadataRoute } from "next";
import { getPaquetes, getGuiasPublicadas } from "@/lib/store";

const BASE = "https://vuelafacil.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [paquetes, guias] = await Promise.all([getPaquetes(), getGuiasPublicadas()]);

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/guias`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...paquetes.map((p) => ({
      url: `${BASE}/paquetes/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guias.map((g) => ({
      url: `${BASE}/guias/${g.slug}`,
      lastModified: new Date(g.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
