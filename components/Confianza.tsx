"use client";

import { Icon } from "./icons";
import { useReveal } from "@/hooks/useReveal";

const ITEMS = [
  { icon: Icon.Award, n: "12", l: "años de experiencia", sub: "Operando desde 2014" },
  { icon: Icon.Users, n: "+18.500", l: "viajeros felices", sub: "Colombia y Latinoamérica" },
  { icon: Icon.Shield, n: "RNT", l: "registro vigente", sub: "Operador autorizado" },
  { icon: Icon.Globe, n: "+40", l: "destinos activos", sub: "5 continentes" },
];

const ALIADOS = [
  "Avianca",
  "LATAM",
  "Wingo",
  "Royal Caribbean",
  "Decameron",
  "Iberostar",
  "Marriott",
  "AssistCard",
];

const PAGOS = ["Visa", "Mastercard", "AmEx", "PSE", "Nequi", "Daviplata", "Addi"];

export function Confianza() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="nosotros" ref={ref} className="reveal py-24 md:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {ITEMS.map(({ icon: I, n, l, sub }) => (
            <div
              key={l}
              className="p-5 md:p-7 rounded-3xl bg-ivory border border-navy/8 hover:border-coral/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral/15 to-amber/10 flex items-center justify-center mb-5 text-coral">
                <I className="w-6 h-6" />
              </div>
              <div className="font-serif text-navy text-[30px] md:text-[36px] leading-none">{n}</div>
              <div className="text-navy/80 font-semibold mt-1 text-[14px] md:text-[15px]">{l}</div>
              <div className="text-navy/55 text-[12px] md:text-[13px] mt-1">{sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-10 border-t border-navy/8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-navy/50 font-semibold mb-1">
                Aliados estratégicos
              </div>
              <div className="font-serif text-navy text-[22px] md:text-[26px]">
                Operamos con marcas líderes del sector
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3 items-center">
              {ALIADOS.map((a) => (
                <div
                  key={a}
                  className="text-navy/45 font-serif italic text-[16px] md:text-[20px] tracking-wide hover:text-navy/80 transition-colors"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2 md:gap-3 text-[12px] text-navy/60">
            <span className="font-semibold text-navy/80">Métodos de pago:</span>
            {PAGOS.map((p) => (
              <span key={p} className="px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
