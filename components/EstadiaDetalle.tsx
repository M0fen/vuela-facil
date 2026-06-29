import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/icons";
import { GaleriaPublica } from "@/components/GaleriaPublica";
import { AlojamientoReserva } from "@/components/AlojamientoReserva";
import type { Alojamiento } from "@/lib/types";

/** Página de detalle compartida por Alojamientos y Hoteles. */
export function EstadiaDetalle({
  item: a,
  basePath,
  sectionLabel,
}: {
  item: Alojamiento;
  basePath: string;
  sectionLabel: string;
}) {
  const galeria = a.galeria && a.galeria.length > 0 ? a.galeria : [a.imagen];
  const datos = [
    { icon: Icon.Users, label: `${a.huespedes} huéspedes` },
    { icon: Icon.Home, label: `${a.habitaciones} habitaciones` },
    { icon: Icon.Calendar, label: `${a.camas} camas` },
    { icon: Icon.Compass, label: `${a.banos} baños` },
  ];

  return (
    <div className="bg-ivory min-h-screen">
      <Header />
      <main className="pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
          <Link
            href={basePath}
            className="inline-flex items-center gap-1.5 text-navy/55 hover:text-coral text-[13px] mb-4"
          >
            <Icon.Arrow className="w-4 h-4 rotate-180" /> {sectionLabel}
          </Link>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-navy/70 text-[12px] font-semibold">
              {a.tipo}
            </span>
            {a.etiqueta && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[12px] font-semibold uppercase tracking-wide">
                {a.etiqueta}
              </span>
            )}
          </div>
          <h1 className="font-serif text-navy text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            {a.titulo}
          </h1>
          <p className="text-navy/60 mt-1.5 inline-flex items-center gap-1.5">
            <Icon.Pin className="w-4 h-4 text-coral" /> {a.ubicacion}
          </p>

          {/* Galería con visor (lightbox) */}
          <div className="mt-6">
            <GaleriaPublica images={galeria} alt={a.titulo} variant="grid" />
          </div>

          {/* Contenido + reserva */}
          <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-x-6 gap-y-3 pb-6 border-b border-navy/10">
                {datos.map((d) => (
                  <span key={d.label} className="inline-flex items-center gap-2 text-navy/75 text-[14px]">
                    <d.icon className="w-4 h-4 text-coral" /> {d.label}
                  </span>
                ))}
              </div>

              <section>
                <h2 className="font-serif text-navy text-[22px] mb-3">Sobre este lugar</h2>
                <p className="text-navy/75 leading-relaxed whitespace-pre-line">{a.descripcion}</p>
              </section>

              {a.amenidades.length > 0 && (
                <section>
                  <h2 className="font-serif text-navy text-[22px] mb-4">Lo que ofrece</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {a.amenidades.map((am) => (
                      <span key={am} className="inline-flex items-center gap-2.5 text-navy/75 text-[14px]">
                        <Icon.Check className="w-4 h-4 text-emerald shrink-0" /> {am}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:sticky lg:top-24">
              <AlojamientoReserva
                titulo={a.titulo}
                ubicacion={a.ubicacion}
                precioNoche={a.precioNoche}
                maxHuespedes={a.huespedes}
                minNoches={a.minNoches}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
