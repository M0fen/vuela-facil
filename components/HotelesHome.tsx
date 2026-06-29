import Link from "next/link";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { AlojamientoCard } from "./Alojamientos";
import type { Alojamiento } from "@/lib/types";

/** Bloque destacado de hoteles en el inicio. */
export function HotelesHome({ hoteles }: { hoteles: Alojamiento[] }) {
  const destacados = hoteles.filter((a) => a.destacado).slice(0, 3);
  const lista = destacados.length > 0 ? destacados : hoteles.slice(0, 3);
  if (lista.length === 0) return null;

  return (
    <section id="hoteles" className="bg-ivory py-14 md:py-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <SectionEyebrow>Hoteles</SectionEyebrow>
            <h2 className="font-serif text-navy text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-3">
              Hoteles con <em className="italic text-coral">la mejor ubicación</em>.
            </h2>
            <p className="mt-4 text-navy/65 max-w-lg">
              Hoteles seleccionados en Pereira, el Eje Cafetero y más. Reserva fácil por WhatsApp.
            </p>
          </div>
          <Link
            href="/hoteles"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy/15 text-navy font-semibold hover:bg-navy hover:text-white transition-colors shrink-0"
          >
            Ver todos <Icon.Arrow className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {lista.map((a) => (
            <AlojamientoCard key={a.id} a={a} basePath="/hoteles" />
          ))}
        </div>
      </div>
    </section>
  );
}
