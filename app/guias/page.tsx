import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GuiaCard } from "@/components/GuiaCard";
import { SectionEyebrow } from "@/components/ui";
import { getGuiasPublicadas } from "@/lib/store";

export const metadata: Metadata = {
  title: "Guías de viaje · Vuela Fácil Travel",
  description:
    "Guías locales del Eje Cafetero, San Andrés, Cartagena y más: joyas escondidas, mejor época y consejos de expertos en Pereira.",
  alternates: { canonical: "/guias" },
  openGraph: {
    title: "Guías de viaje · Vuela Fácil Travel",
    description: "Joyas escondidas y consejos locales para tu próximo viaje por Colombia y el mundo.",
    type: "website",
    locale: "es_CO",
  },
};

export default async function GuiasIndex() {
  const guias = await getGuiasPublicadas();

  return (
    <div className="bg-ivory min-h-screen">
      <Header />
      <main className="pt-[72px]">
        <section className="bg-white border-b border-navy/8">
          <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
            <div className="flex justify-center">
              <SectionEyebrow>Blog de viajes</SectionEyebrow>
            </div>
            <h1 className="font-serif text-navy text-[40px] md:text-[60px] leading-[1.03] tracking-[-0.02em] mt-3">
              Guías de viaje
            </h1>
            <p className="text-navy/65 mt-4 max-w-xl mx-auto">
              Joyas escondidas, mejor época y consejos de quienes conocen cada destino. Hechas por
              nuestro equipo local en Pereira.
            </p>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-20">
          {guias.length === 0 ? (
            <p className="text-center text-navy/55">Muy pronto publicaremos nuestras guías. ✈️</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {guias.map((g) => (
                <GuiaCard key={g.id} g={g} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
