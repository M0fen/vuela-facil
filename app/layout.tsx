import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { UIProvider } from "@/lib/ui-context";
import { WhatsAppTracker } from "@/components/WhatsAppTracker";
import { PWARegister } from "@/components/PWARegister";
import { ReferralBanner } from "@/components/ReferralBanner";
import { AIAssistant } from "@/components/AIAssistant";
import { NEGOCIO, TESTIMONIOS } from "@/lib/data";
import { WHATSAPP_NUMERO } from "@/lib/utils";
import "./globals.css";

// Calificación agregada honesta, derivada de los testimonios reales.
const ratingPromedio =
  Math.round((TESTIMONIOS.reduce((s, t) => s + t.rating, 0) / TESTIMONIOS.length) * 10) / 10;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: NEGOCIO.razonSocial,
  alternateName: NEGOCIO.nombreComercial,
  description:
    "Agencia de viajes en Pereira. Diseñamos viajes a la medida por Colombia y el mundo, con asesoría humana y reserva por WhatsApp.",
  url: NEGOCIO.web,
  image: `${NEGOCIO.web}/images/logo.jpg`,
  telephone: `+${WHATSAPP_NUMERO}`,
  email: NEGOCIO.email,
  taxID: NEGOCIO.nit,
  address: {
    "@type": "PostalAddress",
    streetAddress: NEGOCIO.direccion,
    addressLocality: "Pereira",
    addressRegion: "Risaralda",
    addressCountry: "CO",
  },
  areaServed: "CO",
  priceRange: "$$",
  openingHours: "Mo-Sa 08:00-20:00",
  identifier: { "@type": "PropertyValue", name: "RNT", value: NEGOCIO.rnt },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: ratingPromedio,
    reviewCount: TESTIMONIOS.length,
    bestRating: 5,
    worstRating: 1,
  },
  sameAs: [NEGOCIO.instagram, NEGOCIO.facebook].filter(Boolean),
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vuela Fácil",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
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
  themeColor: "#0d2c54",
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
        <AIAssistant />
        <ReferralBanner />
        <WhatsAppTracker />
        <PWARegister />
        <Analytics />
      </body>
    </html>
  );
}
