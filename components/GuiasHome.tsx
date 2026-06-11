import Link from "next/link";
import { GuiaCard } from "./GuiaCard";
import { SectionEyebrow } from "./ui";
import { Icon } from "./icons";
import type { Guia } from "@/lib/types";

export function GuiasHome({ guias }: { guias: Guia[] }) {
  if (guias.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-28 border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <SectionEyebrow>Expertos locales</SectionEyebrow>
            <h2 className="font-serif text-navy text-[32px] md:text-[46px] leading-[1.05] tracking-[-0.02em] mt-3">
              Guías para viajar <em className="italic text-coral">como un local</em>.
            </h2>
            <p className="text-navy/60 mt-3">
              Joyas escondidas, mejor época y consejos reales de nuestro equipo en Pereira.
            </p>
          </div>
          <Link
            href="/guias"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy/15 text-navy font-semibold text-[14px] hover:bg-navy hover:text-white transition-colors shrink-0"
          >
            Ver todas las guías <Icon.Arrow className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {guias.slice(0, 3).map((g) => (
            <GuiaCard key={g.id} g={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
