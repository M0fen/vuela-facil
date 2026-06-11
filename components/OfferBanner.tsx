"use client";

import { useEffect, useState } from "react";
import type { Promo } from "@/lib/types";
import { waLink } from "@/lib/utils";

/**
 * Banner de oferta con escasez REAL: la cuenta regresiva se ata a
 * `promo.promoEnds` (fecha verdadera, configurable en lib/data.ts).
 * Si la promo no está activa, no tiene fecha, o esa fecha ya pasó, el banner
 * muestra un mensaje perenne SIN reloj (nada de countdowns falsos que reinician).
 */
export function OfferBanner({ promo }: { promo: Promo }) {
  const target =
    promo.activa && promo.promoEnds ? new Date(promo.promoEnds).getTime() : null;

  // El countdown solo tiene sentido si hay una fecha futura configurada.
  const hasCountdown = target !== null;

  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (target === null) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);

  // Antes de que el efecto corra (SSR / primer render) `remaining` es null:
  // tratamos la promo como vigente para evitar parpadeo. Solo marcamos vencida
  // cuando el cliente confirma que el tiempo llegó a 0.
  const expired = remaining === 0;
  const mostrarReloj = hasCountdown && !expired;

  const s = Math.floor((remaining ?? 0) / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-[#102f5a] to-navy" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(244,169,60,0.4), transparent 50%), radial-gradient(circle at 85% 60%, rgba(232,99,26,0.45), transparent 55%)",
        }}
      />
      <div className="relative max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-20 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 text-amber text-[11px] tracking-[0.3em] uppercase font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            {mostrarReloj ? promo.eyebrow : "Acompañamiento humano todo el año"}
          </div>
          <h2 className="font-serif text-white text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">
            {promo.tituloLinea1} <em className="italic text-amber">{promo.destacado}</em>
            <br />
            <span className="text-white/85">{promo.tituloLinea2}</span>
          </h2>
          <p className="text-white/75 mt-4 max-w-xl">{promo.descripcion}</p>
        </div>
        <div className="md:col-span-5">
          <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8">
            {mostrarReloj ? (
              <>
                <div className="text-white/70 text-[11px] uppercase tracking-[0.25em] mb-4">
                  La promoción termina en
                </div>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {(
                    [
                      ["DÍAS", d],
                      ["HRS", h],
                      ["MIN", m],
                      ["SEG", sec],
                    ] as const
                  ).map(([l, v]) => (
                    <div
                      key={l}
                      className="text-center bg-white/5 border border-white/10 rounded-2xl py-3"
                    >
                      <div className="font-serif text-white text-[28px] md:text-[36px] leading-none">
                        {String(v).padStart(2, "0")}
                      </div>
                      <div className="text-white/60 text-[10px] tracking-[0.2em] mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mb-6">
                <div className="text-white/70 text-[11px] uppercase tracking-[0.25em] mb-3">
                  Sin letra pequeña
                </div>
                <p className="text-white/85 text-[15px] leading-relaxed">
                  Te armamos el plan a tu medida y presupuesto, con asesoría humana en
                  Pereira y reserva 100% por WhatsApp. Escríbenos cuando quieras.
                </p>
              </div>
            )}
            <a
              href={waLink(promo.ctaMensaje)}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center px-6 py-4 rounded-full bg-gradient-to-r from-coral to-amber text-white font-semibold tracking-wide hover:shadow-[0_20px_40px_-10px_rgba(232,99,26,0.6)] transition-shadow"
            >
              {mostrarReloj ? "Asegurar mi cupo por WhatsApp" : "Cotizar mi viaje por WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
