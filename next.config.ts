import type { NextConfig } from "next";

// Las imágenes base son locales (/public/images). Las que se suben desde el
// panel de administración viven en Vercel Blob; habilitamos ese host para
// next/image.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
