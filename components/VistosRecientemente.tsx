"use client";

import { useEffect, useState } from "react";
import { SectionEyebrow } from "./ui";
import { PackageMini } from "./PackageMini";
import type { Paquete } from "@/lib/types";
import { getVistos, VISTOS_EVENT } from "@/lib/vistos";

/**
 * Franja "Vistos recientemente". Lee los IDs guardados en el navegador y los
 * resuelve contra el catálogo. No renderiza nada si no hay historial.
 * `excluir` evita mostrar el paquete que se está viendo en ese momento.
 */
export function VistosRecientemente({
  paquetes,
  excluir,
}: {
  paquetes: Paquete[];
  excluir?: string;
}) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(getVistos());
    sync();
    window.addEventListener(VISTOS_EVENT, sync);
    return () => window.removeEventListener(VISTOS_EVENT, sync);
  }, []);

  const byId = new Map(paquetes.map((p) => [p.id, p]));
  const lista = ids
    .filter((id) => id !== excluir)
    .map((id) => byId.get(id))
    .filter((p): p is Paquete => Boolean(p))
    .slice(0, 4);

  if (lista.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20 border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="mb-7">
          <SectionEyebrow>Sigue donde quedaste</SectionEyebrow>
          <h2 className="font-serif text-navy text-[26px] md:text-[36px] leading-[1.05] tracking-[-0.02em] mt-3">
            Vistos recientemente
          </h2>
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
