"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "./icons";
import { Stars } from "./ui";
import type { Paquete } from "@/lib/types";
import { itinerarioDe, noIncluyeDe } from "@/lib/paquete-helpers";
import { formatCOP, formatMoneda, waLink, descuentoPct } from "@/lib/utils";
import { useUI } from "@/lib/ui-context";
import { crearReserva } from "@/app/reserva-actions";
import { iniciarAbono } from "@/app/pago-actions";
import { FinanciacionPerks } from "./Financiacion";
import { FINANCIACION } from "@/lib/data";

export function PackageModal({
  paquetes,
  pagosActivos = false,
}: {
  paquetes: Paquete[];
  pagosActivos?: boolean;
}) {
  const { activePackageId, closePackage } = useUI();
  const [selectedDate, setSelectedDate] = useState(0);
  const [travelers, setTravelers] = useState(2);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [hecho, setHecho] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itinRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLSpanElement>(null);

  const pkg = activePackageId ? paquetes.find((p) => p.id === activePackageId) ?? null : null;

  // Reset selección al abrir un paquete distinto + bloquear scroll del body
  useEffect(() => {
    if (pkg) {
      setSelectedDate(0);
      setTravelers(2);
      setHecho(false);
      setEnviando(false);
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

  // Itinerario: una sola línea que se "llena" a medida que se hace scroll por el
  // modal (progreso del recorrido). Sin re-render de React (toca el DOM directo).
  useEffect(() => {
    const sc = scrollRef.current;
    const itin = itinRef.current;
    const fill = lineFillRef.current;
    if (!sc || !itin || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const scRect = sc.getBoundingClientRect();
      const itRect = itin.getBoundingClientRect();
      const linea = scRect.top + scRect.height * 0.45; // punto de referencia
      const prog = (linea - itRect.top) / Math.max(1, itRect.height);
      fill.style.height = `${Math.max(0, Math.min(1, prog)) * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    sc.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      sc.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pkg]);

  if (!pkg) return null;

  const fmt = (n: number) => formatMoneda(n, pkg.moneda);
  const total = pkg.precio * travelers;
  const fechaSel = pkg.salidas[selectedDate] || pkg.salidas[0];
  const waMsg = [
    "🛫 *VUELA FÁCIL TRAVEL*",
    "_Solicitud de reserva_",
    "",
    "¡Hola! Quiero reservar este plan 👇",
    "",
    `📍 *Destino:* ${pkg.destino}`,
    `📅 *Salida:* ${fechaSel}`,
    `🕒 *Duración:* ${pkg.duracion}`,
    `👥 *Viajeros:* ${travelers}`,
    `💰 *Total estimado:* ${fmt(total)}`,
    `🔖 *Referencia:* ${pkg.id}`,
    ...(nombre.trim() ? [`🙋 *Cliente:* ${nombre.trim()}`] : []),
    "",
    "Quedo atento(a) a la confirmación. ¡Gracias! 🙌",
  ].join("\n");

  const puedeReservar = nombre.trim().length > 1 && telefono.trim().length >= 7;

  const reservar = async () => {
    if (!puedeReservar || enviando) return;
    setEnviando(true);
    try {
      await crearReserva({
        paqueteId: pkg.id,
        destino: pkg.destino,
        fecha: fechaSel,
        viajeros: travelers,
        totalEstimado: total,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
      });
    } catch {
      // No bloqueamos el handoff a WhatsApp si falla el guardado.
    }
    setEnviando(false);
    setHecho(true);
    window.open(waLink(waMsg), "_blank", "noopener");
  };

  // Desde la barra fija móvil: si faltan datos, lleva al formulario; si no, reserva.
  const reservarDesdeBarra = () => {
    if (puedeReservar) {
      reservar();
    } else {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => nombreRef.current?.focus(), 350);
    }
  };

  const abonoMonto = Math.round((total * FINANCIACION.abonoPct) / 100);

  const separarOnline = async () => {
    if (!puedeReservar || enviando) return;
    setEnviando(true);
    const res = await iniciarAbono({
      paqueteId: pkg.id,
      destino: pkg.destino,
      fecha: fechaSel,
      viajeros: travelers,
      totalEstimado: total,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
    });
    if (res.ok && res.url) {
      window.location.href = res.url; // → checkout de Wompi
      return;
    }
    // Sin pasarela configurada o error → no bloqueamos: caemos a WhatsApp.
    setEnviando(false);
    setHecho(true);
    window.open(waLink(waMsg), "_blank", "noopener");
  };

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
      <div className="relative bg-white w-full h-[100dvh] md:h-auto md:max-w-[1100px] md:max-h-[92vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:m-6 animate-[slideUp_.35s_cubic-bezier(.2,.7,.2,1)]">
        <button
          onClick={closePackage}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur text-navy hover:bg-white shadow-lg flex items-center justify-center"
        >
          <Icon.Close className="w-5 h-5" />
        </button>

        <div ref={scrollRef} className="overflow-y-auto overscroll-contain flex-1 min-h-0">
          <div
            className={`relative h-[200px] sm:h-[260px] md:h-[340px] overflow-hidden ${pkg.flyer ? "bg-navy cursor-zoom-in" : ""}`}
            onClick={pkg.flyer ? () => setLightbox(true) : undefined}
            role={pkg.flyer ? "button" : undefined}
            aria-label={pkg.flyer ? "Ampliar imagen del plan" : undefined}
          >
            <Image
              src={pkg.imagen}
              alt={pkg.destino}
              fill
              sizes="(max-width: 768px) 100vw, 1100px"
              className={pkg.flyer ? "object-contain" : "object-cover"}
              style={{ viewTransitionName: "vf-pkg-hero" } as CSSProperties}
            />
            {pkg.flyer && (
              <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-navy text-[12px] font-semibold shadow-lg pointer-events-none">
                <Icon.Search className="w-3.5 h-3.5" /> Ver imagen completa
              </span>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent ${pkg.flyer ? "pointer-events-none" : ""}`} />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white/80 mb-2">
                <Icon.Pin className="w-3.5 h-3.5" /> {pkg.pais} · {pkg.categoria}
              </div>
              <h2 className="font-serif text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
                {pkg.destino}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
                {pkg.duracion && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                    <Icon.Clock className="w-3.5 h-3.5" /> {pkg.duracion}
                  </span>
                )}
                {pkg.reviews > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                    <Stars rating={pkg.calificacion} className="w-3.5 h-3.5" /> {pkg.calificacion}{" "}
                    <span className="opacity-70">({pkg.reviews} reseñas de viajeros)</span>
                  </span>
                )}
                {pkg.etiqueta && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-coral to-amber text-white font-semibold tracking-wider uppercase text-[10px]">
                    {pkg.etiqueta}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-2 p-5 md:p-8 space-y-7 md:space-y-9">
              {pkg.flyer ? (
                <section>
                  {pkg.resumen && (
                    <p className="text-navy/70 leading-relaxed text-[15px] mb-3">{pkg.resumen}</p>
                  )}
                  <p className="flex items-start gap-2 text-navy/65 text-[14px] leading-relaxed">
                    <Icon.Sparkle className="w-4 h-4 mt-0.5 text-coral shrink-0" />
                    Plan de un aliado consolidador. Los detalles completos están en la imagen;
                    cotiza por WhatsApp y te confirmamos disponibilidad y el precio final.
                  </p>
                </section>
              ) : (<>
              <section>
                <h3 className="font-serif text-navy text-[22px] mb-3">Sobre este viaje</h3>
                <p className="text-navy/70 leading-relaxed text-[15px]">
                  {pkg.resumen ||
                    "Una experiencia cuidadosamente diseñada por nuestro equipo en Pereira. Te acompañamos desde la elección de la fecha hasta tu regreso, con asistencia humana 24/7 antes y durante el viaje."}
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
                <h3 className="font-serif text-navy text-[22px] mb-5">Itinerario</h3>
                <div ref={itinRef} className="relative">
                  {/* Riel: una sola línea continua + relleno que avanza con el scroll */}
                  <span
                    className="absolute left-[6px] top-1.5 bottom-2 w-[2px] rounded bg-coral/15"
                    aria-hidden="true"
                  />
                  <span
                    ref={lineFillRef}
                    className="absolute left-[6px] top-1.5 w-[2px] rounded bg-coral"
                    style={{ height: 0 }}
                    aria-hidden="true"
                  />
                  <ol className="space-y-5">
                    {itinerario.map((it, i) => (
                      <li key={i} className="relative pl-7">
                        <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-coral ring-4 ring-white" />
                        <div className="text-[11px] uppercase tracking-[0.2em] text-coral font-semibold">
                          {it.dia}
                        </div>
                        <div className="font-serif text-navy text-[17px] mt-0.5">{it.titulo}</div>
                        <div className="text-navy/65 text-[14px] mt-1 leading-relaxed">{it.desc}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <section>
                <h3 className="font-serif text-navy text-[22px] mb-3">No incluye</h3>
                <ul className="space-y-1.5 text-navy/65 text-[14px]">
                  {noIncluye.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </section>
              </>)}

              <section className="pt-5 border-t border-navy/8">
                <Link
                  href={`/paquetes/${pkg.id}`}
                  className="inline-flex items-center gap-1.5 text-coral font-semibold text-[14px] hover:gap-2.5 transition-all"
                >
                  Ver la guía completa del destino
                  <Icon.Arrow className="w-4 h-4" />
                </Link>
              </section>
            </div>

            <aside className="bg-ivory border-t md:border-t-0 md:border-l border-navy/8 p-5 md:p-7">
              <div className="md:sticky md:top-4">
                <div className="text-[11px] uppercase tracking-wider text-navy/50">
                  {pkg.flyer ? "Precio referencial · desde" : "Precio por persona"}
                </div>
                {(() => {
                  const desc = descuentoPct(pkg.precio, pkg.precioAntes);
                  return desc ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[15px] text-navy/40 line-through">
                        {fmt(pkg.precioAntes!)}
                      </span>
                      <span className="text-[11px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full">
                        Ahorra {desc}%
                      </span>
                    </div>
                  ) : null;
                })()}
                <div className="font-serif text-navy text-[34px] leading-none mt-1">
                  {fmt(pkg.precio)}
                </div>
                <FinanciacionPerks className="mt-2.5" />
                <div className="text-[11px] text-navy/50 mt-2">
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
                        {fmt(pkg.precio)} × {travelers}{" "}
                        {travelers === 1 ? "viajero" : "viajeros"}
                      </span>
                      <span>{fmt(total)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] text-navy/70">
                      <span>Impuestos y tasas</span>
                      <span className="text-emerald font-medium">Incluidos</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-navy/10">
                      <span className="text-navy font-semibold">Total estimado</span>
                      <span className="font-serif text-navy text-[24px]">{fmt(total)}</span>
                    </div>
                    <p className="text-[11px] text-navy/50 leading-snug pt-1">
                      Total para {travelers} {travelers === 1 ? "viajero" : "viajeros"}. El precio
                      final se confirma por WhatsApp según fechas y disponibilidad; no incluye
                      gastos personales ni tours opcionales.
                    </p>
                  </div>

                  {hecho ? (
                    <div className="text-center py-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald/10 flex items-center justify-center mb-2">
                        <Icon.Check className="w-6 h-6 text-emerald" />
                      </div>
                      <div className="font-serif text-navy text-[18px]">¡Reserva registrada!</div>
                      <p className="text-navy/60 text-[13px] mt-1">
                        Te abrimos WhatsApp para confirmar con un asesor. Si no se abrió,{" "}
                        <a
                          href={waLink(waMsg)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-coral font-semibold underline"
                        >
                          toca aquí
                        </a>
                        .
                      </p>
                      <button
                        onClick={closePackage}
                        className="mt-4 w-full px-6 py-3 rounded-full border border-navy/15 text-navy/70 text-[13px] font-medium hover:border-navy hover:text-navy transition-colors"
                      >
                        Seguir explorando
                      </button>
                    </div>
                  ) : (
                    <>
                      <div ref={formRef} className="space-y-2 scroll-mt-4">
                        <input
                          ref={nombreRef}
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full px-4 py-3 rounded-xl border border-navy/15 outline-none focus:border-coral text-navy text-[14px] placeholder:text-navy/40"
                        />
                        <input
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          type="tel"
                          inputMode="tel"
                          placeholder="Tu WhatsApp"
                          className="w-full px-4 py-3 rounded-xl border border-navy/15 outline-none focus:border-coral text-navy text-[14px] placeholder:text-navy/40"
                        />
                      </div>
                      {pagosActivos && !pkg.flyer && (
                        <button
                          onClick={separarOnline}
                          disabled={!puedeReservar || enviando}
                          className="block w-full text-center px-6 py-3.5 rounded-full bg-navy text-white font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Separa con {formatCOP(abonoMonto)} ({FINANCIACION.abonoPct}%) · pago en línea
                        </button>
                      )}
                      <button
                        onClick={reservar}
                        disabled={!puedeReservar || enviando}
                        className="block w-full text-center px-6 py-4 rounded-full bg-[#25D366] text-white font-semibold tracking-wide hover:bg-[#1ebe57] transition-colors shadow-[0_15px_30px_-8px_rgba(37,211,102,0.55)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon.Whatsapp className="w-4 h-4 inline -mt-0.5 mr-1.5" />
                        {enviando ? "Registrando…" : "Reservar por WhatsApp"}
                      </button>
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
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Barra fija de acción (solo móvil): el CTA de reserva siempre alcanzable */}
        {!hecho && (
          <div className="md:hidden shrink-0 border-t border-navy/10 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3">
            <div className="leading-tight shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-navy/50">Total</div>
              <div className="font-serif text-navy text-[20px]">{fmt(total)}</div>
            </div>
            <button
              onClick={reservarDesdeBarra}
              disabled={enviando}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full bg-[#25D366] text-white font-semibold tracking-wide shadow-[0_12px_24px_-8px_rgba(37,211,102,0.55)] disabled:opacity-50 transition-colors"
            >
              <Icon.Whatsapp className="w-4 h-4" />
              {enviando ? "Registrando…" : "Reservar"}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox del flyer: imagen a pantalla completa, legible y con scroll. */}
      {pkg.flyer && lightbox && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 overflow-auto overscroll-contain"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-label="Imagen del plan"
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Cerrar imagen"
            className="fixed top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 text-navy flex items-center justify-center shadow-lg"
          >
            <Icon.Close className="w-5 h-5" />
          </button>
          <div className="min-h-full flex items-start justify-center p-4 py-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pkg.imagen}
              alt={pkg.destino}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
