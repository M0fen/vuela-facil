"use client";

import Image from "next/image";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { CATEGORIAS } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";
import { useUI } from "@/lib/ui-context";

export function Categorias() {
  const ref = useReveal<HTMLElement>();
  const { setFiltro, scrollTo } = useUI();

  return (
    <section
      id="destinos"
      ref={ref}
      className="reveal max-w-[1320px] mx-auto px-5 md:px-8 py-24 md:py-32"
    >
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-14">
        <div className="max-w-2xl">
          <SectionEyebrow>Explora por categoría</SectionEyebrow>
          <h2 className="font-serif text-navy text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-3">
            Elige cómo quieres <em className="italic text-coral">sentir</em> tu próximo viaje.
          </h2>
        </div>
        <a
          href="#paquetes"
          className="hidden md:inline-flex items-center gap-2 text-navy font-medium hover:text-coral transition-colors"
        >
          Ver todos los destinos <Icon.Arrow className="w-4 h-4" />
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {CATEGORIAS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => {
              setFiltro(c.nombre);
              scrollTo("#paquetes");
            }}
            className={`group relative overflow-hidden rounded-2xl md:rounded-[28px] aspect-[4/5] text-left ${
              i === 0 ? "md:col-span-2 md:aspect-[8/5]" : ""
            }`}
          >
            <Image
              src={c.img}
              alt={c.nombre}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-navy/10 group-hover:from-navy/70 transition-colors" />
            <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-white">
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-2">
                {c.desc}
              </div>
              <div className="font-serif text-[22px] md:text-[34px] leading-tight">{c.nombre}</div>
              <div className="mt-3 flex items-center gap-2 text-[12px] font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Ver paquetes <Icon.Arrow className="w-4 h-4" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
