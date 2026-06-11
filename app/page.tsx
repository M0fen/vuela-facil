import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Categorias } from "@/components/Categorias";
import { Paquetes } from "@/components/Paquetes";
import { Quiz } from "@/components/Quiz";
import { RecomendadosTemporada } from "@/components/RecomendadosTemporada";
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
import { getPaquetes, getPromo, getTestimonios, getGuiasPublicadas, getDestinos } from "@/lib/store";
import { pagosActivos } from "@/lib/pagos";

export default async function Home() {
  const [paquetes, promo, testimonios, guias, destinos] = await Promise.all([
    getPaquetes(),
    getPromo(),
    getTestimonios(),
    getGuiasPublicadas(),
    getDestinos(),
  ]);

  return (
    <div className="bg-ivory">
      <Header />
      <main>
        <Hero paquetes={paquetes} />
        <TrustBar />
        <Paquetes paquetes={paquetes} />
        <OfferBanner promo={promo} />
        <ExploraDestinos paquetes={paquetes} destinos={destinos} />
        <Categorias />
        <Testimonios testimonios={testimonios} />
        <Confianza />
        <Quiz paquetes={paquetes} />
        <StoryEjeCafetero />
        <RecomendadosTemporada paquetes={paquetes} />
        <GuiasHome guias={guias} />
        <CapturaContacto />
      </main>
      <Footer />
      <FloatingWA />
      <StickyWhatsApp />
      <AIAssistant />
      <PackageModal paquetes={paquetes} pagosActivos={pagosActivos()} />
    </div>
  );
}
