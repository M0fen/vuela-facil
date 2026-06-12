// ---------------------------------------------------------------------------
// URL pública del sitio — fuente única de verdad para SEO, sitemap, JSON-LD,
// Open Graph y los enlaces de retorno de pago.
//
// Hoy apunta al dominio real de Vercel. Cuando se compre el dominio definitivo
// (p. ej. vuelafacil.com), basta con definir NEXT_PUBLIC_SITE_URL en Vercel y
// TODO el sitio se actualiza solo, sin tocar código.
// ---------------------------------------------------------------------------
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vuela-facil.vercel.app"
).replace(/\/$/, "");
