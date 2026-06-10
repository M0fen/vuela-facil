import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { UIProvider } from "@/lib/ui-context";
import { WhatsAppTracker } from "@/components/WhatsAppTracker";
import { NEGOCIO } from "@/lib/data";
import { WHATSAPP_NUMERO } from "@/lib/utils";
import "./globals.css";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Vuela Fácil Travel",
  description:
    "Agencia de viajes en Pereira. Diseñamos viajes a la medida por Colombia y el mundo, con asesoría humana y reserva por WhatsApp.",
  url: "https://vuelafacil.com",
  image: "https://vuelafacil.com/images/logo.jpg",
  telephone: `+${WHATSAPP_NUMERO}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pereira",
    addressRegion: "Risaralda",
    addressCountry: "CO",
  },
  areaServed: "CO",
  priceRange: "$$",
  sameAs: [NEGOCIO.instagram],
};

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vuela Fácil Travel · Agencia de Viajes en Pereira",
  description:
    "Diseñamos viajes a la medida por Colombia y el mundo desde Pereira. Tiquetes, hoteles, paquetes y cruceros con asesoría humana y reserva por WhatsApp.",
  metadataBase: new URL("https://vuelafacil.com"),
  openGraph: {
    title: "Vuela Fácil Travel · Agencia de Viajes en Pereira",
    description:
      "Viajes a la medida por Colombia y el mundo, con asesoría humana en Pereira y reserva por WhatsApp.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <UIProvider>{children}</UIProvider>
        <WhatsAppTracker />
        <Analytics />
      </body>
    </html>
  );
}
