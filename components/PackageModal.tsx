"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { Stars } from "./ui";
import { PAQUETES } from "@/lib/data";
import { itinerarioDe, noIncluyeDe } from "@/lib/paquete-helpers";
import { formatCOP, waLink } from "@/lib/utils";
import { useUI } from "@/lib/ui-context";

export function PackageModal() {
  const { activePackageId, closePackage } = useUI();
  const [selectedDate, setSelectedDate] = useState(0);
  const [travelers, setTravelers] = useState(2);

  const pkg = activePackageId ? PAQUETES.find((p) => p.id === activePackageId) ?? null : null;

  // Reset selección al abrir un paquete distinto + bloquear scroll del body
  useEffect(() => {
    if (pkg) {
      setSelectedDate(0);
      setTravelers(2);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [pkg]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePackage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePackage]);

  if (!pkg) return null;

  const total = pkg.precio * travelers;
  const fechaSel = pkg.salidas[selectedDate] || pkg.salidas[0];
  const waMsg = `Hola Vuela Fácil 👋
Quiero RESERVAR el paquete:
✈️ *${pkg.destino}* (${pkg.duracion})
📅 Salida: ${fechaSel}
👥 Viajeros: ${travelers}
💰 Total estimado: ${formatCOP(total)}
Ref: ${pkg.id}`;

  const itinerario = itinerarioDe(pkg);
  const noIncluye = noIncluyeDe(pkg);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={closePackage}
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm animate-[fadeIn_.25s_ease-out]"
      />
      <div className="relative bg-white w-full md:max-w-[1100px] md:max-h-[92vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:m-6 animate-[slideUp_.35s_cubic-bezier(.2,.7,.2,1)]">
        <button
          onClick={closePackage}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur text-navy hover:bg-white shadow-lg flex items-center justify-center"
        >
          <Icon.Close className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="relative h-[260px] md:h-[340px] overflow-hidden">
            <Image
              src={pkg.imagen}
              alt={pkg.destino}
              fill
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white/80 mb-2">
                <Icon.Pin className="w-3.5 h-3.5" /> {pkg.pais} · {pkg.categoria}
              </div>
              <h2 className="font-serif text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
                {pkg.destino}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                  <Icon.Clock className="w-3.5 h-3.5" /> {pkg.duracion}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                  <Stars rating={pkg.calificacion} className="w-3.5 h-3.5" /> {pkg.calificacion}{" "}
                  <span className="opacity-70">({pkg.reviews} reseñas verificadas)</span>
                </span>
                {pkg.etiqueta && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-coral to-amber text-white font-semibold tracking-wider uppercase text-[10px]">
                    {pkg.etiqueta}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-2 p-6 md:p-8 space-y-8">
              <section>
                <h3 className="font-serif text-navy text-[22px] mb-3">Sobre este viaje</h3>
                <p className="text-navy/70 leading-relaxed text-[15px]">
                  Una experiencia cuidadosamente diseñada por nuestro equipo en Pereira. Te
                  acompañamos desde la elección de la fecha hasta tu regreso, con asistencia humana
                  24/7 antes y durante el viaje.
                </p>
              </section>

              <section>
                <h3 className="font-serif text-navy text-[22px] mb-4">Qué incluye</h3>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {pkg.incluye.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] text-navy/80">
                      <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" /> {i}
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-[14px] text-navy/80">
                    <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" /> Asistencia médica
                    internacional
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-navy/80">
                    <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" /> Atención por
                    WhatsApp 24/7
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-serif text-navy text-[22px] mb-4">Itinerario</h3>
                <ol className="space-y-4">
                  {itinerario.map((it, i) => (
                    <li key={i} className="relative pl-7 border-l-2 border-coral/30 pb-1">
                      <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-coral" />
                      <div className="text-[11px] uppercase tracking-[0.2em] text-coral font-semibold">
                        {it.dia}
                      </div>
                      <div className="font-serif text-navy text-[17px] mt-0.5">{it.titulo}</div>
                      <div className="text-navy/65 text-[14px] mt-1 leading-relaxed">{it.desc}</div>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="font-serif text-navy text-[22px] mb-3">No incluye</h3>
                <ul className="space-y-1.5 text-navy/65 text-[14px]">
                  {noIncluye.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </section>

              <section className="pt-2">
                <Link
                  href={`/paquetes/${pkg.id}`}
                  className="inline-flex items-center gap-1.5 text-coral font-semibold text-[14px] hover:gap-2.5 transition-all"
                >
                  Ver la guía completa del destino
                  <Icon.Arrow className="w-4 h-4" />
                </Link>
              </section>
            </div>

            <aside className="bg-ivory border-t md:border-t-0 md:border-l border-navy/8 p-6 md:p-7">
              <div className="md:sticky md:top-4">
                <div className="text-[11px] uppercase tracking-wider text-navy/50">
                  Precio por persona
                </div>
                <div className="font-serif text-navy text-[34px] leading-none mt-1">
                  {formatCOP(pkg.precio)}
                </div>
                <div className="text-[12px] text-emerald-700 font-medium mt-1">
                  o 12 cuotas sin interés
                </div>
                <div className="text-[11px] text-navy/50 mt-1.5">
                  Impuestos y tasas incluidos · sin cargos sorpresa
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-navy/60 font-semibold">
                      Fecha de salida
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {pkg.salidas.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(i)}
                          className={`px-3 py-2.5 rounded-xl text-[13px] font-medium border transition-colors text-left ${
                            selectedDate === i
                              ? "border-coral bg-white text-navy shadow-sm"
                              : "border-navy/10 bg-white/60 text-navy/65 hover:border-navy/30"
                          }`}
                        >
                          <Icon.Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-coral" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-navy/60 font-semibold">
                      Viajeros
                    </label>
                    <div className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-xl border border-navy/10 bg-white">
                      <button
                        onClick={() => setTravelers((v) => Math.max(1, v - 1))}
                        aria-label="Quitar viajero"
                        className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 text-navy font-bold"
                      >
                        −
                      </button>
                      <div className="text-navy font-semibold">
                        {travelers} {travelers === 1 ? "persona" : "personas"}
                      </div>
                      <button
                        onClick={() => setTravelers((v) => Math.min(12, v + 1))}
                        aria-label="Agregar viajero"
                        className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 text-navy font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy/10 space-y-1.5">
                    <div className="flex justify-between text-[13px] text-navy/70">
                      <span>
                        {formatCOP(pkg.precio)} × {travelers}{" "}
                        {travelers === 1 ? "viajero" : "viajeros"}
                      </span>
                      <span>{formatCOP(total)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] text-navy/70">
                      <span>Impuestos y tasas</span>
                      <span className="text-emerald-700 font-medium">Incluidos</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-navy/10">
                      <span className="text-navy font-semibold">Total estimado</span>
                      <span className="font-serif text-navy text-[24px]">{formatCOP(total)}</span>
                    </div>
                    <p className="text-[11px] text-navy/50 leading-snug pt-1">
                      Total para {travelers} {travelers === 1 ? "viajero" : "viajeros"}. El precio
                      final se confirma por WhatsApp según fechas y disponibilidad; no incluye
                      gastos personales ni tours opcionales.
                    </p>
                  </div>

                  <a
                    href={waLink(waMsg)}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center px-6 py-4 rounded-full bg-[#25D366] text-white font-semibold tracking-wide hover:bg-[#1ebe57] transition-colors shadow-[0_15px_30px_-8px_rgba(37,211,102,0.55)]"
                  >
                    <Icon.Whatsapp className="w-4 h-4 inline -mt-0.5 mr-1.5" />
                    Reservar por WhatsApp
                  </a>
                  <button
                    onClick={closePackage}
                    className="w-full px-6 py-3 rounded-full border border-navy/15 text-navy/70 text-[13px] font-medium hover:border-navy hover:text-navy transition-colors"
                  >
                    Seguir explorando
                  </button>
                  <div className="flex items-center justify-center gap-3 text-[11px] text-navy/55 pt-2">
                    <span className="inline-flex items-center gap-1">
                      <Icon.Shield className="w-3.5 h-3.5 text-emerald" /> Reserva 100% segura
                    </span>
                    <span>·</span>
                    <span>Cancelación flexible</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
