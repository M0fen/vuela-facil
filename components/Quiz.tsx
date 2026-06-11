"use client";

import { useMemo, useState } from "react";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { PackageMini } from "./PackageMini";
import type { Categoria, Paquete } from "@/lib/types";

type Estilo = {
  id: string;
  label: string;
  desc: string;
  icon: keyof typeof Icon;
  cats: Categoria[];
};

const ESTILOS: Estilo[] = [
  { id: "playa", label: "Playa y mar", desc: "Sol, arena y descanso", icon: "Pin", cats: ["Playa"] },
  { id: "aventura", label: "Aventura y naturaleza", desc: "Café, montañas y mar", icon: "Compass", cats: ["Eje Cafetero", "Cruceros"] },
  { id: "cultura", label: "Cultura e historia", desc: "Ciudades y patrimonio", icon: "Globe", cats: ["Internacional", "Eje Cafetero"] },
  { id: "luna", label: "Luna de miel", desc: "Romántico para dos", icon: "Sparkle", cats: ["Playa", "Cruceros", "Internacional"] },
  { id: "familia", label: "En familia", desc: "Planes para todos", icon: "Users", cats: ["Playa", "Eje Cafetero"] },
];

export function Quiz({ paquetes }: { paquetes: Paquete[] }) {
  const [sel, setSel] = useState<string | null>(null);

  const recomendados = useMemo(() => {
    if (!sel) return [];
    const estilo = ESTILOS.find((e) => e.id === sel);
    if (!estilo) return [];
    const match = paquetes
      .filter((p) => estilo.cats.includes(p.categoria))
      .sort((a, b) => b.calificacion - a.calificacion);
    const base = match.length > 0 ? match : [...paquetes].sort((a, b) => b.calificacion - a.calificacion);
    return base.slice(0, 3);
  }, [sel, paquetes]);

  return (
    <section className="bg-white py-14 md:py-28 border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex justify-center">
            <SectionEyebrow>Encuentra tu viaje ideal</SectionEyebrow>
          </div>
          <h2 className="font-serif text-navy text-[32px] md:text-[46px] leading-[1.05] tracking-[-0.02em] mt-3">
            ¿Qué tipo de <em className="italic text-coral">viajero</em> eres?
          </h2>
          <p className="text-navy/60 mt-3">
            Elige lo que más te emociona y te mostramos los planes que mejor van contigo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto">
          {ESTILOS.map((e) => {
            const Ico = Icon[e.icon];
            const activo = sel === e.id;
            return (
              <button
                key={e.id}
                onClick={() => setSel(activo ? null : e.id)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  activo
                    ? "border-coral bg-coral/5 shadow-[0_18px_40px_-24px_rgba(232,99,26,0.6)]"
                    : "border-navy/10 bg-white hover:border-navy/30"
                }`}
              >
                <span
                  className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-3 ${
                    activo ? "bg-gradient-to-br from-coral to-amber text-white" : "bg-navy/5 text-coral"
                  }`}
                >
                  <Ico className="w-5 h-5" />
                </span>
                <div className="font-semibold text-navy text-[14px] leading-tight">{e.label}</div>
                <div className="text-navy/50 text-[12px] mt-0.5">{e.desc}</div>
              </button>
            );
          })}
        </div>

        {sel && (
          <div className="mt-10 animate-[fadeIn_.4s_ease-out]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-navy text-[22px]">Para ti recomendamos</h3>
              <button
                onClick={() => setSel(null)}
                className="text-[13px] text-navy/55 hover:text-coral font-medium"
              >
                Reiniciar
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {recomendados.map((p) => (
                <PackageMini key={p.id} p={p} />
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="#paquetes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-navy/15 text-navy font-semibold text-[14px] hover:bg-navy hover:text-white transition-colors"
              >
                Ver todos los paquetes <Icon.Arrow className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
