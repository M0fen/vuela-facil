import type { NextConfig } from "next";

// Las imágenes base son locales (/public/images). Las que se suben desde el
// panel de administración viven en Vercel Blob; habilitamos ese host para
// next/image.
// Cabeceras de seguridad aplicadas a todo el sitio. No incluimos CSP estricta
// para no romper estilos/scripts inline de Next; HSTS lo añade Vercel.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
