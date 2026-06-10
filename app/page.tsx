import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Categorias } from "@/components/Categorias";
import { Paquetes } from "@/components/Paquetes";
import { Quiz } from "@/components/Quiz";
import { RecomendadosTemporada } from "@/components/RecomendadosTemporada";
import { VistosRecientemente } from "@/components/VistosRecientemente";
import { GuiasHome } from "@/components/GuiasHome";
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
import { ExploraDestinos } from "@/components/globo/ExploraDestinos";
import { getPaquetes, getPromo, getTestimonios, getGuiasPublicadas } from "@/lib/store";

export default async function Home() {
  const [paquetes, promo, testimonios, guias] = await Promise.all([
    getPaquetes(),
    getPromo(),
    getTestimonios(),
    getGuiasPublicadas(),
  ]);

  return (
    <div className="bg-ivory">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ExploraDestinos />
        <Categorias />
        <Quiz paquetes={paquetes} />
        <Paquetes paquetes={paquetes} />
        <OfferBanner promo={promo} />
        <Confianza />
        <RecomendadosTemporada paquetes={paquetes} />
        <Testimonios testimonios={testimonios} />
        <GuiasHome guias={guias} />
        <VistosRecientemente paquetes={paquetes} />
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
