"use client";

import { useEffect, useState } from "react";
import { SectionEyebrow } from "./ui";
import { PackageMini } from "./PackageMini";
import type { Categoria, Paquete } from "@/lib/types";

type Temporada = { titulo: string; sub: string; cats: Categoria[] };

function temporadaDe(mes: number): Temporada {
  // mes: 0 = enero … 11 = diciembre (Colombia)
  if ([11, 0, 1, 2].includes(mes))
    return { titulo: "Temporada de sol y playa", sub: "El mejor clima para el Caribe", cats: ["Playa", "Internacional"] };
  if ([3, 4].includes(mes))
    return { titulo: "Escapadas tranquilas", sub: "Menos multitudes, más calma", cats: ["Eje Cafetero", "Cruceros"] };
  if ([5, 6, 7].includes(mes))
    return { titulo: "Vacaciones en familia", sub: "Planes para mitad de año", cats: ["Playa", "Eje Cafetero", "Internacional"] };
  return { titulo: "Aventuras lejos", sub: "Ideal para destinos internacionales", cats: ["Internacional", "Cruceros"] };
}

export function RecomendadosTemporada({ paquetes }: { paquetes: Paquete[] }) {
  const [mes, setMes] = useState<number | null>(null);
  useEffect(() => setMes(new Date().getMonth()), []);

  if (mes === null) return null;

  const t = temporadaDe(mes);
  const match = paquetes
    .filter((p) => t.cats.includes(p.categoria))
    .sort((a, b) => b.calificacion - a.calificacion);
  const lista = (match.length >= 3 ? match : [...paquetes].sort((a, b) => b.calificacion - a.calificacion)).slice(0, 4);

  if (lista.length === 0) return null;

  return (
    <section className="bg-ivory py-20 md:py-24 border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <SectionEyebrow>Recomendado para esta época</SectionEyebrow>
            <h2 className="font-serif text-navy text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.02em] mt-3">
              {t.titulo}
            </h2>
            <p className="text-navy/60 mt-2">{t.sub}.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {lista.map((p) => (
            <PackageMini key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
