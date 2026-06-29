import Link from "next/link";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { ParqueCard } from "./ParqueCard";
import type { Parque } from "@/lib/types";

/** Bloque destacado de parques/atracciones en el inicio. */
export function ParquesHome({ parques }: { parques: Parque[] }) {
  const destacados = parques.filter((p) => p.destacado).slice(0, 3);
  const lista = destacados.length > 0 ? destacados : parques.slice(0, 3);
  if (lista.length === 0) return null;

  return (
    <section id="parques" className="bg-white py-14 md:py-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <SectionEyebrow>Parques</SectionEyebrow>
            <h2 className="font-serif text-navy text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-3">
              Parques y atracciones <em className="italic text-coral">del Eje Cafetero</em>.
            </h2>
            <p className="mt-4 text-navy/65 max-w-lg">
              Te conseguimos las entradas a los parques temáticos y atracciones. Reserva por WhatsApp.
            </p>
          </div>
          <Link
            href="/parques"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy/15 text-navy font-semibold hover:bg-navy hover:text-white transition-colors shrink-0"
          >
            Ver todos <Icon.Arrow className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {lista.map((p) => (
            <ParqueCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
