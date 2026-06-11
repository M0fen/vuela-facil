"use client";

import { Icon } from "@/components/icons";
import { formatCOP, waLink } from "@/lib/utils";
import { etiquetaTipo, type Destino, type RutaCrucero } from "@/lib/geo";
import type { Paquete } from "@/lib/types";

// Tablero de salidas split-flap / Solari (estilo aeropuerto real) para móvil.
// Cada destino se compone de fichas por carácter (ámbar sobre negro, con la
// línea de pliegue al centro) que "voltean" al entrar y al cambiar de filtro
// (la sección remonta el tablero con key={filtro}). Tap con plan → modal;
// sin plan → cotiza por WhatsApp.

/** Texto en fichas split-flap. */
function FlapText({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  const chars = text.toUpperCase().slice(0, 18).split("");
  return (
    <span className="inline-flex gap-[2px]" aria-hidden="true">
      {chars.map((c, i) => (
        <span
          key={i}
          className="flap-cell text-[13px]"
          style={{ animationDelay: `${baseDelay + i * 0.025}s` }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

interface Fila {
  id: string;
  nombre: string;
  sub: string;
  precio?: number;
  paqueteId?: string;
  waMsg: string;
}

export function DepartureBoard({
  destinos,
  rutas,
  paqueteById,
  onVerPlan,
  className = "",
}: {
  destinos: Destino[];
  rutas: RutaCrucero[];
  paqueteById: Map<string, Paquete>;
  onVerPlan: (id: string) => void;
  className?: string;
}) {
  const filas: Fila[] = [
    ...destinos.map((d) => ({
      id: d.id,
      nombre: d.nombre,
      sub: `${d.pais} · ${etiquetaTipo[d.tipo]}`,
      precio: d.paqueteId ? paqueteById.get(d.paqueteId)?.precio : undefined,
      paqueteId: d.paqueteId,
      waMsg: `Hola Vuela Fácil, quiero cotizar un viaje a ${d.nombre}.`,
    })),
    ...rutas.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      sub: `Crucero · ${r.embarque.nombre}`,
      precio: r.paqueteId ? paqueteById.get(r.paqueteId)?.precio : undefined,
      paqueteId: r.paqueteId,
      waMsg: `Hola Vuela Fácil, quiero cotizar el ${r.nombre}.`,
    })),
  ];

  return (
    <div className={`flap-board ${className}`}>
      <div className="rounded-xl bg-[#0b0b0c] ring-1 ring-black/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Cabecera ámbar tipo panel de aeropuerto */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-amber to-[#e0962f] text-[#1a1205]">
          <span className="font-mono text-[12px] font-bold tracking-[0.3em] uppercase">
            ✈ Salidas
          </span>
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
            Pereira · PEI
          </span>
        </div>

        {/* Etiquetas de columna */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-black/40 border-b border-white/[0.06]">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#f4c044]/50 uppercase">
            Destino
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#f4c044]/50 uppercase">
            Estado
          </span>
        </div>

        {/* Filas */}
        <ul className="divide-y divide-white/[0.05]">
          {filas.map((f, i) => {
            const conPlan = Boolean(f.paqueteId);
            const baseDelay = Math.min(i, 14) * 0.06;
            const inner = (
              <>
                <span className="min-w-0">
                  <FlapText text={f.nombre} baseDelay={baseDelay} />
                  <span className="block font-mono text-[10px] text-white/35 tracking-wide mt-1.5 truncate uppercase">
                    {f.sub}
                  </span>
                </span>
                <span className="flex flex-col items-end shrink-0 pl-2 gap-1">
                  {f.precio ? (
                    <span className="font-mono text-[11px] text-white/65 tabular-nums">
                      {formatCOP(f.precio)}
                    </span>
                  ) : null}
                  <span
                    className={`font-mono text-[10px] font-bold tracking-[0.18em] uppercase ${
                      conPlan ? "text-emerald-400" : "text-[#f4c044]"
                    }`}
                  >
                    {conPlan ? "▸ Plan listo" : "▸ Cotizar"}
                  </span>
                </span>
              </>
            );

            const rowClass =
              "w-full flex items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:bg-white/[0.06]";

            return (
              <li key={f.id}>
                {conPlan ? (
                  <button type="button" onClick={() => onVerPlan(f.paqueteId!)} className={rowClass} aria-label={`${f.nombre} — ver plan`}>
                    {inner}
                  </button>
                ) : (
                  <a
                    href={waLink(f.waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa="board-cotizar"
                    className={rowClass}
                    aria-label={`${f.nombre} — cotizar por WhatsApp`}
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Pie del panel */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/[0.06] flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
            {filas.length} destinos
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/80 tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulseSoft_1.6s_ease-in-out_infinite]" />
            En vivo
          </span>
        </div>
      </div>
    </div>
  );
}
