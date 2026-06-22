// ---------------------------------------------------------------------------
// URL pública del sitio — fuente única de verdad para SEO, sitemap, JSON-LD,
// Open Graph y los enlaces de retorno de pago.
//
// Apunta al dominio real del negocio. Si algún día cambia, basta con definir
// NEXT_PUBLIC_SITE_URL en Vercel (tiene prioridad) y TODO el sitio se actualiza
// solo, sin tocar código.
// ---------------------------------------------------------------------------
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vuelafaciltravel.com"
).replace(/\/$/, "");
