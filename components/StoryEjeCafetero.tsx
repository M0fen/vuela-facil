"use client";

import Image from "next/image";
import { Icon } from "./icons";
import { IMG } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";
import { waLink } from "@/lib/utils";

export function StoryEjeCafetero() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal relative py-24 md:py-36 overflow-hidden bg-white">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="md:col-span-7 relative order-2 md:order-1">
          <div className="relative rounded-[32px] overflow-hidden aspect-[5/6] md:aspect-[4/5]">
            <Image
              src={IMG.story1}
              alt="Eje Cafetero — Valle de Cocora"
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-[11px] tracking-[0.3em] uppercase opacity-80">
                Salento · Quindío
              </div>
              <div className="font-serif text-[24px] md:text-[28px] mt-1">
                Valle de Cocora al amanecer
              </div>
            </div>
          </div>
          <div className="hidden md:block absolute -bottom-12 -right-6 w-56 h-56 rounded-[28px] overflow-hidden border-8 border-white shadow-2xl">
            <Image src={IMG.story2} alt="Café" fill sizes="224px" className="object-cover" />
          </div>
        </div>
        <div className="md:col-span-5 order-1 md:order-2">
          <div className="inline-flex items-center gap-3 text-coral text-[11px] tracking-[0.3em] uppercase font-semibold">
            <span className="w-8 h-px bg-coral" />
            Destino estrella
          </div>
          <h2 className="font-serif text-navy text-[36px] md:text-[56px] leading-[1.02] tracking-[-0.025em] mt-3">
            El Eje Cafetero <em className="italic text-coral">no se visita</em>: se respira.
          </h2>
          <p className="mt-6 text-navy/70 text-[16px] md:text-[17px] leading-[1.7]">
            Desde Pereira diseñamos rutas íntimas por nuestra propia tierra. Despertar entre palmas
            de cera, recorrer fincas cafeteras centenarias, almorzar trucha a la orilla del río,
            dormir en haciendas boutique con vista a la cordillera.
          </p>
          <p className="mt-4 text-navy/70 text-[16px] md:text-[17px] leading-[1.7]">
            Es el viaje que mejor sabemos contar — porque <em className="italic">aquí vivimos</em>.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {(
              [
                ["6", "fincas aliadas"],
                ["3", "rutas curadas"],
                ["★ 4.9", "calificación"],
              ] as const
            ).map(([n, l]) => (
              <div key={l} className="border-l-2 border-coral/40 pl-3">
                <div className="font-serif text-navy text-[22px] leading-tight">{n}</div>
                <div className="text-navy/55 text-[12px] mt-1">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#paquetes"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-navy text-white text-[14px] font-semibold hover:bg-navy/90 transition-colors"
            >
              Ver rutas del Eje <Icon.Arrow className="w-4 h-4" />
            </a>
            <a
              href={waLink("Quiero diseñar una experiencia personalizada en el Eje Cafetero.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-navy/15 text-navy text-[14px] font-semibold hover:border-navy transition-colors"
            >
              <Icon.Whatsapp className="w-4 h-4" /> Diseñar a la medida
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
