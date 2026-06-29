import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/icons";
import { GaleriaPublica } from "@/components/GaleriaPublica";
import { ParqueReserva } from "@/components/ParqueReserva";
import { getParque, getParquesPublicados } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getParque(id);
  if (!p) return { title: "Parque no encontrado · Vuela Fácil Travel" };
  return {
    title: `${p.nombre} · ${p.ubicacion} · Vuela Fácil Travel`,
    description: p.descripcion.slice(0, 160),
    alternates: { canonical: `/parques/${p.id}` },
    openGraph: {
      title: `${p.nombre} · ${p.ubicacion}`,
      description: p.descripcion.slice(0, 160),
      images: p.imagen ? [p.imagen] : undefined,
      type: "website",
      locale: "es_CO",
    },
  };
}

export default async function ParqueDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getParque(id);
  if (!p || !p.publicado) notFound();

  const galeria = p.galeria && p.galeria.length > 0 ? p.galeria : [p.imagen];

  return (
    <div className="bg-ivory min-h-screen">
      <Header />
      <main className="pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
          <Link
            href="/parques"
            className="inline-flex items-center gap-1.5 text-navy/55 hover:text-coral text-[13px] mb-4"
          >
            <Icon.Arrow className="w-4 h-4 rotate-180" /> Parques
          </Link>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-navy/70 text-[12px] font-semibold">
              {p.tipo}
            </span>
            {p.etiqueta && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[12px] font-semibold uppercase tracking-wide">
                {p.etiqueta}
              </span>
            )}
          </div>
          <h1 className="font-serif text-navy text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            {p.nombre}
          </h1>
          <p className="text-navy/60 mt-1.5 inline-flex items-center gap-1.5">
            <Icon.Pin className="w-4 h-4 text-coral" /> {p.ubicacion}
          </p>

          <div className="mt-6">
            <GaleriaPublica images={galeria} alt={p.nombre} variant="grid" />
          </div>

          <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
            <div className="space-y-8">
              {p.horario && (
                <div className="flex flex-wrap gap-x-6 gap-y-3 pb-6 border-b border-navy/10">
                  <span className="inline-flex items-center gap-2 text-navy/75 text-[14px]">
                    <Icon.Clock className="w-4 h-4 text-coral" /> {p.horario}
                  </span>
                </div>
              )}

              <section>
                <h2 className="font-serif text-navy text-[22px] mb-3">Sobre este parque</h2>
                <p className="text-navy/75 leading-relaxed whitespace-pre-line">{p.descripcion}</p>
              </section>

              {p.incluye.length > 0 && (
                <section>
                  <h2 className="font-serif text-navy text-[22px] mb-4">Qué incluye la entrada</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {p.incluye.map((i) => (
                      <span key={i} className="inline-flex items-center gap-2.5 text-navy/75 text-[14px]">
                        <Icon.Check className="w-4 h-4 text-emerald shrink-0" /> {i}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:sticky lg:top-24">
              <ParqueReserva
                nombre={p.nombre}
                ubicacion={p.ubicacion}
                precioDesde={p.precioDesde}
                moneda={p.moneda}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const items = await getParquesPublicados();
  return items.map((p) => ({ id: p.id }));
}
