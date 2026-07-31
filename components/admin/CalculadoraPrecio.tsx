"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

/**
 * Ayuda para fijar el precio de venta a partir del costo real y el margen que
 * el operador quiere ganar (precio = costo × (1 + margen/100)). No guarda nada
 * por sí sola: al pulsar "Usar este precio" escribe el valor en el input de
 * precio del propio formulario (buscado por `name` dentro del mismo <form>).
 */
export function CalculadoraPrecio({
  targetName,
  className = "",
}: {
  /** name del input de precio a completar, dentro del mismo formulario. */
  targetName: string;
  className?: string;
}) {
  const [costo, setCosto] = useState("");
  const [margen, setMargen] = useState("20");
  const [aplicado, setAplicado] = useState(false);

  const costoNum = Number(costo.replace(/[^\d]/g, "")) || 0;
  const margenNum = Number(margen) || 0;
  const sugerido = costoNum > 0 ? Math.round(costoNum * (1 + margenNum / 100)) : 0;
  const ganancia = sugerido - costoNum;

  const usar = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    const input = form?.querySelector<HTMLInputElement>(`input[name="${targetName}"]`);
    if (input && sugerido > 0) {
      input.value = String(sugerido);
      input.focus();
      setAplicado(true);
      setTimeout(() => setAplicado(false), 1500);
    }
  };

  return (
    <div className={`rounded-xl border border-navy/10 bg-ivory/60 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon.Sparkle className="w-4 h-4 text-coral" />
        <span className="text-[13px] font-semibold text-navy">Calculadora de precio</span>
      </div>
      <p className="text-[11px] text-navy/50 mb-3">
        Escribe tu costo real y el margen que quieres ganar; te sugerimos el precio de venta.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-[11px] font-semibold text-navy/55 mb-1">Costo real</span>
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            placeholder="Ej: 500000"
            className="w-full px-3 py-2 rounded-lg border border-navy/15 bg-white text-navy text-[13px] outline-none focus:border-coral focus:ring-2 focus:ring-coral/15"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-semibold text-navy/55 mb-1">Margen sobre el costo (%)</span>
          <input
            type="number"
            value={margen}
            onChange={(e) => setMargen(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-navy/15 bg-white text-navy text-[13px] outline-none focus:border-coral focus:ring-2 focus:ring-coral/15"
          />
        </label>
      </div>
      {costoNum > 0 && (
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[13px] leading-tight">
            <span className="text-navy/60">Precio sugerido: </span>
            <span className="font-semibold text-navy">{fmt(sugerido)}</span>
            <span className="text-navy/45 text-[11px]"> · ganancia {fmt(ganancia)}</span>
          </div>
          <button
            type="button"
            onClick={usar}
            className="px-3 py-1.5 rounded-full bg-navy text-white text-[12px] font-semibold hover:bg-navy/90 transition-colors"
          >
            {aplicado ? "¡Aplicado! ✓" : "Usar este precio →"}
          </button>
        </div>
      )}
    </div>
  );
}
