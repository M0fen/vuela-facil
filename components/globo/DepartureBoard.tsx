"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { formatCOP, waLink } from "@/lib/utils";
import { etiquetaTipo, type Destino, type RutaCrucero } from "@/lib/geo";
import type { Paquete } from "@/lib/types";

// Tablero de salidas split-flap / Solari (estilo aeropuerto real) para móvil.
// Cada destino se compone de fichas por carácter (ámbar sobre negro) con un
// pliegue mecánico vertical real: dos mitades de fondo + dos solapas que giran
// en la costura central. Al entrar y al cambiar de filtro voltean; además, un
// latido vivo: cada cierto tiempo una ficha al azar vuelve a girar.
// Tap con plan → modal; sin plan → cotiza por WhatsApp.

const VISIBLES = 7; // filas mostradas antes de "Ver más"

/** Una ficha split-flap: dos mitades de fondo + dos solapas que pliegan en la
 *  costura central. Al (re)montarse reproduce el giro vertical una vez. */
function FlapChar({ ch, delay }: { ch: string; delay: number }) {
  const c = ch === " " ? " " : ch;
  return (
    <span className="flap text-[13px]" style={{ "--d": `${delay}s` } as React.CSSProperties}>
      <span className="flap-half flap-top">
        <b>{c}</b>
      </span>
      <span className="flap-half flap-bottom">
        <b>{c}</b>
      </span>
      <span className="flap-leaf flap-leaf-top">
        <b>{c}</b>
      </span>
      <span className="flap-leaf flap-leaf-bottom">
        <b>{c}</b>
      </span>
    </span>
  );
}

/** Texto en fichas split-flap. La ficha en `flipCol` re-gira cuando cambia `nonce`. */
function FlapText({
  text,
  baseDelay = 0,
  flipCol = -1,
  nonce = 0,
}: {
  text: string;
  baseDelay?: number;
  flipCol?: number;
  nonce?: number;
}) {
  const chars = text.toUpperCase().slice(0, 18).split("");
  return (
    <span className="flex flex-wrap gap-[2px]" aria-hidden="true">
      {chars.map((c, i) => (
        <FlapChar
          // Al cambiar la key, React remonta la ficha y vuelve a girar.
          key={i === flipCol ? `${i}-${nonce}` : i}
          ch={c}
          delay={i === flipCol ? 0 : baseDelay + i * 0.03}
        />
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
  const [expandido, setExpandido] = useState(false);
  // Latido del panel: ficha (fila, columna) que vuelve a girar, con un nonce que
  // fuerza el remontaje. Se reinicia al cambiar de filtro (la sección remonta con key).
  const [flip, setFlip] = useState({ row: -1, col: -1, nonce: 0 });
  const nonceRef = useRef(0);

  const filas: Fila[] = useMemo(
    () => [
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
    ],
    [destinos, rutas, paqueteById],
  );

  const visibles = expandido ? filas : filas.slice(0, VISIBLES);
  const ocultas = filas.length - visibles.length;

  // Latido: cada ~2.4 s una ficha al azar (de las visibles) vuelve a girar.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (visibles.length === 0) return;

    const id = setInterval(() => {
      const row = Math.floor(Math.random() * visibles.length);
      const largo = Math.min(visibles[row].nombre.length, 18);
      if (largo === 0) return;
      const col = Math.floor(Math.random() * largo);
      nonceRef.current += 1;
      setFlip({ row, col, nonce: nonceRef.current });
    }, 2400);

    return () => clearInterval(id);
  }, [visibles.length]);

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
          {visibles.map((f, i) => {
            const conPlan = Boolean(f.paqueteId);
            const baseDelay = Math.min(i, 14) * 0.06;
            const inner = (
              <>
                <span className="min-w-0 flex-1">
                  <FlapText
                    text={f.nombre}
                    baseDelay={baseDelay}
                    flipCol={flip.row === i ? flip.col : -1}
                    nonce={flip.nonce}
                  />
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

        {/* Ver más / menos */}
        {filas.length > VISIBLES && (
          <button
            type="button"
            onClick={() => setExpandido((v) => !v)}
            className="w-full px-4 py-2.5 bg-black/50 hover:bg-black/30 transition-colors border-t border-white/[0.06] flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-[#f4c044]"
          >
            {expandido ? (
              <>
                <Icon.ChevronDown className="w-3.5 h-3.5 rotate-180" /> Ver menos
              </>
            ) : (
              <>
                <Icon.ChevronDown className="w-3.5 h-3.5" /> Ver {ocultas} destinos más
              </>
            )}
          </button>
        )}

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
