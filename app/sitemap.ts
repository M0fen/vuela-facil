import type { MetadataRoute } from "next";
import { getPaquetes, getGuiasPublicadas } from "@/lib/store";
import { LANDINGS } from "@/lib/landings";
import { SITE_URL as BASE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [paquetes, guias] = await Promise.all([getPaquetes(), getGuiasPublicadas()]);

  const infoPaths = [
    "/nosotros",
    "/financiacion",
    "/referidos",
    "/faq",
    "/pqrs",
    "/terminos",
    "/privacidad",
    "/cookies",
    "/reembolsos",
  ];

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/guias`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...infoPaths.map((p) => ({
      url: `${BASE}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: ["/nosotros", "/financiacion", "/referidos"].includes(p) ? 0.6 : 0.3,
    })),
    ...LANDINGS.map((l) => ({
      url: `${BASE}/viajes/${l.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
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
