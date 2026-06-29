"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { formatMoneda, waLink } from "@/lib/utils";
import type { Moneda } from "@/lib/types";

/**
 * Widget de compra de entradas a un parque por WhatsApp. El cliente elige fecha
 * y número de personas; armamos el mensaje y abrimos WhatsApp (el asesor confirma
 * precio y disponibilidad).
 */
export function ParqueReserva({
  nombre,
  ubicacion,
  precioDesde,
  moneda = "COP",
}: {
  nombre: string;
  ubicacion: string;
  precioDesde: number;
  moneda?: Moneda;
}) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState(2);

  const estimado = personas * precioDesde;
  const fmtFecha = (s: string) =>
    s ? new Date(s + "T00:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "";

  const msg = [
    `Hola Vuela Fácil 👋 Quiero entradas para *${nombre}* (${ubicacion}).`,
    fecha ? `\n📅 *Fecha:* ${fmtFecha(fecha)}` : "",
    `\n👥 *Personas:* ${personas}`,
    `\n💰 *Estimado:* desde ${formatMoneda(estimado, moneda)} (${personas} × ${formatMoneda(precioDesde, moneda)})`,
    `\n\n¿Me confirmas precio y disponibilidad?`,
  ]
    .filter(Boolean)
    .join("");

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy text-[14px] outline-none focus:border-coral focus:ring-2 focus:ring-coral/15";

  return (
    <div className="rounded-3xl border border-navy/10 bg-white shadow-[0_20px_50px_-30px_rgba(13,44,84,0.4)] p-5 md:p-6">
      <div className="text-[11px] uppercase tracking-wider text-navy/50">Entrada desde</div>
      <div className="font-serif text-[28px] text-navy leading-none mt-1">{formatMoneda(precioDesde, moneda)}</div>
      <div className="text-navy/55 text-[12px] mt-1">por persona</div>

      <label className="block mt-4">
        <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Fecha de visita</span>
        <input type="date" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputCls} />
      </label>

      <label className="block mt-3">
        <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Personas</span>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-navy/15 bg-white">
          <button
            type="button"
            onClick={() => setPersonas((v) => Math.max(1, v - 1))}
            aria-label="Quitar persona"
            className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 text-navy font-bold"
          >
            −
          </button>
          <span className="text-navy font-semibold">
            {personas} {personas === 1 ? "persona" : "personas"}
          </span>
          <button
            type="button"
            onClick={() => setPersonas((v) => Math.min(30, v + 1))}
            aria-label="Agregar persona"
            className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 text-navy font-bold"
          >
            +
          </button>
        </div>
      </label>

      <div className="mt-4 flex items-center justify-between text-[14px] text-navy border-t border-navy/8 pt-3">
        <span className="text-navy/60">Estimado ({personas})</span>
        <span className="font-semibold">desde {formatMoneda(estimado, moneda)}</span>
      </div>

      <a
        href={waLink(msg)}
        target="_blank"
        rel="noreferrer"
        data-wa="parque-reserva"
        className="mt-4 w-full px-5 py-3.5 rounded-full bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1ebe57] transition-colors"
      >
        <Icon.Whatsapp className="w-5 h-5" /> Pedir entradas por WhatsApp
      </a>
      <p className="text-[11px] text-navy/45 text-center mt-2">
        No se cobra nada en línea. Confirmamos precio y disponibilidad por WhatsApp.
      </p>
    </div>
  );
}
