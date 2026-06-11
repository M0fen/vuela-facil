"use client";

import { Icon } from "@/components/icons";
import { formatCOP, waLink } from "@/lib/utils";
import { colorDestino, etiquetaTipo, type Destino, type RutaCrucero } from "@/lib/geo";
import type { Paquete } from "@/lib/types";

// Tablero de salidas tipo aeropuerto (split-flap / Solari) para móvil:
// minimalista, monoespaciado, ámbar sobre navy profundo. Cada fila "voltea" al
// entrar y al cambiar de filtro (la sección lo remonta con `key`). Tappable:
// con plan abre el modal del paquete; sin plan, cotiza por WhatsApp.

interface Fila {
  id: string;
  nombre: string;
  sub: string;
  tipoLabel: string;
  color: string;
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
      tipoLabel: etiquetaTipo[d.tipo],
      color: colorDestino(d.tipo),
      precio: d.paqueteId ? paqueteById.get(d.paqueteId)?.precio : undefined,
      paqueteId: d.paqueteId,
      waMsg: `Hola Vuela Fácil, quiero cotizar un viaje a ${d.nombre}.`,
    })),
    ...rutas.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      sub: `Crucero · embarque en ${r.embarque.nombre}`,
      tipoLabel: "Crucero",
      color: "#f4a93c",
      precio: r.paqueteId ? paqueteById.get(r.paqueteId)?.precio : undefined,
      paqueteId: r.paqueteId,
      waMsg: `Hola Vuela Fácil, quiero cotizar el ${r.nombre}.`,
    })),
  ];

  return (
    <div className={`flap-board ${className}`}>
      <div className="rounded-2xl bg-[#07182f] ring-1 ring-white/10 overflow-hidden shadow-2xl shadow-black/40">
        {/* Cabecera del tablero */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
          <span className="font-mono text-[11px] tracking-[0.3em] text-amber uppercase">Salidas</span>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-ivory/70 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-[pulseSoft_1.6s_ease-in-out_infinite]" />
            Pereira
          </span>
        </div>

        {/* Etiquetas de columna */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/[0.06]">
          <span className="font-mono text-[10px] tracking-[0.2em] text-ivory/40 uppercase">Destino</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-ivory/40 uppercase">Estado</span>
        </div>

        {/* Filas */}
        <ul className="divide-y divide-white/[0.06]">
          {filas.map((f, i) => {
            const conPlan = Boolean(f.paqueteId);
            const inner = (
              <>
                <span className="min-w-0 flex items-start gap-2.5">
                  <span
                    className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[14px] font-semibold tracking-[0.04em] text-amber uppercase truncate">
                      {f.nombre}
                    </span>
                    <span className="block text-[11px] text-ivory/45 truncate">{f.sub}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2.5 shrink-0 pl-2">
                  <span className="text-right">
                    {f.precio ? (
                      <span className="block font-mono text-[12px] text-ivory/80 tabular-nums">
                        {formatCOP(f.precio)}
                      </span>
                    ) : null}
                    <span
                      className={`block font-mono text-[10px] tracking-[0.18em] uppercase ${
                        conPlan ? "text-emerald" : "text-amber"
                      }`}
                    >
                      {conPlan ? "Plan listo" : "Cotizar"}
                    </span>
                  </span>
                  <Icon.Arrow className="w-4 h-4 text-ivory/35" />
                </span>
              </>
            );

            const rowClass =
              "flap-row w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:bg-white/[0.06]";
            const style = { animationDelay: `${Math.min(i, 12) * 0.05}s` };

            return (
              <li key={f.id}>
                {conPlan ? (
                  <button type="button" onClick={() => onVerPlan(f.paqueteId!)} className={rowClass} style={style}>
                    {inner}
                  </button>
                ) : (
                  <a
                    href={waLink(f.waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa="board-cotizar"
                    className={rowClass}
                    style={style}
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
