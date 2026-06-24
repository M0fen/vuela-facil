"use client";

import { useMemo, useState } from "react";
import { Icon } from "./icons";
import { formatCOP, waLink } from "@/lib/utils";

/**
 * Widget de consulta/reserva de un alojamiento por WhatsApp. El cliente elige
 * fechas y # de huéspedes; armamos el mensaje y abrimos WhatsApp (sin pagos ni
 * calendario de disponibilidad: el asesor confirma).
 */
export function AlojamientoReserva({
  titulo,
  ubicacion,
  precioNoche,
  maxHuespedes,
  minNoches,
}: {
  titulo: string;
  ubicacion: string;
  precioNoche: number;
  maxHuespedes: number;
  minNoches?: number;
}) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [huespedes, setHuespedes] = useState(Math.min(2, maxHuespedes) || 1);

  const noches = useMemo(() => {
    if (!entrada || !salida) return 0;
    const d = (Date.parse(salida) - Date.parse(entrada)) / 86_400_000;
    return d > 0 ? Math.round(d) : 0;
  }, [entrada, salida]);

  const total = noches * precioNoche;
  const minOk = !minNoches || noches === 0 || noches >= minNoches;

  const fmt = (s: string) =>
    s ? new Date(s + "T00:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "";

  const msg = [
    `Hola Vuela Fácil 👋 Quiero reservar el alojamiento *${titulo}* (${ubicacion}).`,
    entrada && salida ? `\n📅 *Entrada:* ${fmt(entrada)}\n📅 *Salida:* ${fmt(salida)}` : "",
    noches > 0 ? `\n🌙 *Noches:* ${noches}` : "",
    `\n👥 *Huéspedes:* ${huespedes}`,
    total > 0 ? `\n💰 *Estimado:* ${formatCOP(total)} (${noches} × ${formatCOP(precioNoche)})` : "",
    `\n\n¿Me confirmas disponibilidad?`,
  ]
    .filter(Boolean)
    .join("");

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy text-[14px] outline-none focus:border-coral focus:ring-2 focus:ring-coral/15";

  return (
    <div className="rounded-3xl border border-navy/10 bg-white shadow-[0_20px_50px_-30px_rgba(13,44,84,0.4)] p-5 md:p-6">
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-[28px] text-navy">{formatCOP(precioNoche)}</span>
        <span className="text-navy/55 text-[13px]">/ noche</span>
      </div>
      {minNoches ? (
        <p className="text-[12px] text-navy/50 mt-0.5">Mínimo {minNoches} noches</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 mt-4">
        <label className="block">
          <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Entrada</span>
          <input type="date" min={hoy} value={entrada} onChange={(e) => setEntrada(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Salida</span>
          <input type="date" min={entrada || hoy} value={salida} onChange={(e) => setSalida(e.target.value)} className={inputCls} />
        </label>
      </div>

      <label className="block mt-3">
        <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Huéspedes</span>
        <select value={huespedes} onChange={(e) => setHuespedes(Number(e.target.value))} className={inputCls}>
          {Array.from({ length: Math.max(1, maxHuespedes) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "huésped" : "huéspedes"}
            </option>
          ))}
        </select>
      </label>

      {noches > 0 && (
        <div className="mt-4 flex items-center justify-between text-[14px] text-navy border-t border-navy/8 pt-3">
          <span className="text-navy/60">
            {formatCOP(precioNoche)} × {noches} {noches === 1 ? "noche" : "noches"}
          </span>
          <span className="font-semibold">{formatCOP(total)}</span>
        </div>
      )}

      {!minOk && (
        <p className="text-[12px] text-coral mt-2">La estadía mínima es de {minNoches} noches.</p>
      )}

      <a
        href={waLink(msg)}
        target="_blank"
        rel="noreferrer"
        data-wa="alojamiento-reserva"
        aria-disabled={!minOk}
        className={`mt-4 w-full px-5 py-3.5 rounded-full bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
          minOk ? "hover:bg-[#1ebe57]" : "opacity-50 pointer-events-none"
        }`}
      >
        <Icon.Whatsapp className="w-5 h-5" /> Reservar por WhatsApp
      </a>
      <p className="text-[11px] text-navy/45 text-center mt-2">
        No se cobra nada en línea. Confirmamos disponibilidad y precio final por WhatsApp.
      </p>
    </div>
  );
}
