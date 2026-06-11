"use client";

import Image from "next/image";
import { Stars } from "./ui";
import type { Testimonio } from "@/lib/types";
import { useReveal } from "@/hooks/useReveal";

export function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const ref = useReveal<HTMLElement>();
  const promedio = testimonios.length
    ? testimonios.reduce((acc, t) => acc + t.rating, 0) / testimonios.length
    : 0;

  return (
    <section ref={ref} className="reveal py-24 md:py-32 bg-ivory border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-3 text-coral text-[11px] tracking-[0.3em] uppercase font-semibold">
            <span className="w-8 h-px bg-coral" />
            Reseñas reales
            <span className="w-8 h-px bg-coral" />
          </div>
          <h2 className="font-serif text-navy text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-3">
            Historias que <em className="italic text-coral">vuelven en avión</em>.
          </h2>
          <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-navy/8">
            <Stars rating={promedio} />
            <span className="text-navy font-semibold text-[14px]">{promedio.toFixed(1)}</span>
            <span className="text-navy/60 text-[13px]">
              · {testimonios.length} reseñas de viajeros
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonios.map((t) => (
            <figure
              key={t.nombre}
              className="bg-white rounded-3xl p-7 md:p-8 border border-navy/8 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-5">
                <Stars rating={t.rating} />
                <span className="text-navy/70 text-[13px] font-semibold">
                  {t.rating.toFixed(1)}
                </span>
              </div>
              <blockquote className="font-serif text-navy/85 text-[19px] md:text-[21px] leading-[1.45] tracking-[-0.01em] flex-1">
                &ldquo;{t.texto}&rdquo;
              </blockquote>
              <figcaption className="mt-7 pt-6 border-t border-navy/8 flex items-center gap-3">
                <Image
                  src={t.foto}
                  alt={t.nombre}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-navy font-semibold text-[14px]">{t.nombre}</div>
                  <div className="text-navy/55 text-[12px]">
                    {t.ciudad} · viajó a {t.destino}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
