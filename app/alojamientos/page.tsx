import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionEyebrow } from "@/components/ui";
import { AlojamientoCard } from "@/components/Alojamientos";
import { getAlojamientosPublicados } from "@/lib/store";
import { waLink } from "@/lib/utils";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Alojamientos · Fincas y estadías · Vuela Fácil Travel",
  description:
    "Arriendo de fincas, cabañas, glamping y apartamentos en el Eje Cafetero y más. Reserva fácil por WhatsApp con la asesoría de Vuela Fácil Travel.",
  alternates: { canonical: "/alojamientos" },
  openGraph: {
    title: "Alojamientos · Fincas y estadías · Vuela Fácil Travel",
    description: "Fincas, cabañas y apartamentos para tu próximo descanso. Reserva por WhatsApp.",
    type: "website",
    locale: "es_CO",
  },
};

export default async function AlojamientosIndex() {
  const items = await getAlojamientosPublicados();

  return (
    <div className="bg-ivory min-h-screen">
      <Header />
      <main className="pt-[72px]">
        <section className="bg-white border-b border-navy/8">
          <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
            <div className="flex justify-center">
              <SectionEyebrow>Alojamientos</SectionEyebrow>
            </div>
            <h1 className="font-serif text-navy text-[40px] md:text-[60px] leading-[1.03] tracking-[-0.02em] mt-3">
              Fincas y estadías
            </h1>
            <p className="text-navy/65 mt-4 max-w-xl mx-auto">
              Fincas, cabañas, glamping y apartamentos en el Eje Cafetero y otros destinos. Reserva
              fácil por WhatsApp, con la asesoría de siempre.
            </p>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-20">
          {items.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl bg-white border border-dashed border-navy/15 max-w-xl mx-auto">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-4">
                <Icon.Home className="w-7 h-7" />
              </span>
              <h2 className="font-serif text-navy text-[24px]">Muy pronto publicaremos nuestros alojamientos</h2>
              <p className="text-navy/60 text-[14px] mt-2">
                ¿Buscas una finca o estadía? Cuéntanos y te ayudamos a encontrarla.
              </p>
              <a
                href={waLink("Hola Vuela Fácil 👋 Estoy buscando un alojamiento (finca/cabaña/apartamento). ¿Me ayudan?")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
              >
                <Icon.Whatsapp className="w-5 h-5" /> Escríbenos
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {items.map((a) => (
                <AlojamientoCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
