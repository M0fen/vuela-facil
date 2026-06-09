import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Categorias } from "@/components/Categorias";
import { Paquetes } from "@/components/Paquetes";
import { OfferBanner } from "@/components/OfferBanner";
import { Confianza } from "@/components/Confianza";
import { Testimonios } from "@/components/Testimonios";
import { StoryEjeCafetero } from "@/components/StoryEjeCafetero";
import { CapturaContacto } from "@/components/CapturaContacto";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { AIAssistant } from "@/components/AIAssistant";
import { PackageModal } from "@/components/PackageModal";
import { getPaquetes, getPromo, getTestimonios } from "@/lib/store";

export default async function Home() {
  const [paquetes, promo, testimonios] = await Promise.all([
    getPaquetes(),
    getPromo(),
    getTestimonios(),
  ]);

  return (
    <div className="bg-ivory">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Categorias />
        <Paquetes paquetes={paquetes} />
        <OfferBanner promo={promo} />
        <Confianza />
        <Testimonios testimonios={testimonios} />
        <StoryEjeCafetero />
        <CapturaContacto />
      </main>
      <Footer />
      <FloatingWA />
      <StickyWhatsApp />
      <AIAssistant />
      <PackageModal paquetes={paquetes} />
    </div>
  );
}
