"use client";

// components/globo/ExploraDestinos.tsx
//
// Sección "Explora el mundo desde Pereira". Decide qué visual mostrar (póster
// 2D ahora; globo WebGL en fases siguientes) y SIEMPRE renderiza debajo una
// lista de destinos navegable por teclado: es la versión accesible y SEO.
//
// Interacción de cada destino:
//   - con paquete  → abre el modal del paquete (useUI.openPackage)
//   - sin paquete  → WhatsApp "Quiero cotizar un viaje a {nombre}"

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUI } from "@/lib/ui-context";
import { waLink } from "@/lib/utils";
import { DESTINOS, RUTAS_CRUCERO } from "@/lib/destinos";
import { type Destino, colorDestino, etiquetaTipo } from "@/lib/geo";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionEyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { DestinosMapa2D } from "./DestinosMapa2D";

// El globo (con three) se descarga lazy y solo en cliente: nunca antes del
// scroll, nunca toca el LCP del hero.
const DestinosGlobe = dynamic(() => import("./DestinosGlobe"), {
  ssr: false,
  loading: () => null,
});

function soportaWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function ChipTipo({ d }: { d: Destino }) {
  const c = colorDestino(d.tipo);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide"
      style={{ color: c }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
      {etiquetaTipo[d.tipo]}
    </span>
  );
}

function DestinoCard({ d, onPaquete }: { d: Destino; onPaquete: (id: string) => void }) {
  const base =
    "group flex flex-col justify-between gap-3 rounded-2xl border border-navy/10 bg-white/70 hover:bg-white hover:border-coral/40 hover:shadow-lg hover:shadow-navy/5 transition p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60";

  const cabecera = (
    <div>
      <div className="flex items-center justify-between gap-2">
        <ChipTipo d={d} />
        {d.destacado && (
          <span className="text-[10px] uppercase tracking-[0.15em] text-coral font-bold">Plan listo</span>
        )}
      </div>
      <h3 className="font-serif text-navy text-lg leading-tight mt-2">{d.nombre}</h3>
      <p className="text-navy/50 text-sm">{d.pais}</p>
    </div>
  );

  const cta = d.paqueteId ? (
    <span className="inline-flex items-center gap-1.5 text-coral text-sm font-semibold">
      Ver plan
      <Icon.Arrow className="w-4 h-4 transition group-hover:translate-x-0.5" />
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
      <Icon.Whatsapp className="w-4 h-4" />
      Cotizar
    </span>
  );

  // Con paquete → botón que abre el modal. Sin paquete → enlace real a WhatsApp
  // (así el WhatsAppTracker registra el clic como conversión).
  if (d.paqueteId) {
    return (
      <button type="button" className={base} onClick={() => onPaquete(d.paqueteId!)}>
        {cabecera}
        {cta}
      </button>
    );
  }
  return (
    <a
      className={base}
      href={waLink(`Hola Vuela Fácil, quiero cotizar un viaje a ${d.nombre}.`)}
      target="_blank"
      rel="noopener noreferrer"
      data-wa="explora-globo"
    >
      {cabecera}
      {cta}
    </a>
  );
}

export function ExploraDestinos() {
  const { openPackage } = useUI();
  const reduced = useReducedMotion();
  const { ref, entered, inView } = useInView<HTMLDivElement>("200px");
  const [puedeGlobo, setPuedeGlobo] = useState(false);
  const [globoListo, setGloboListo] = useState(false);

  // Decide si este dispositivo merece el globo WebGL (escalera de mejora
  // progresiva). Gama muy baja o reduced-motion → se queda con el póster 2D.
  useEffect(() => {
    if (reduced || !soportaWebGL()) {
      setPuedeGlobo(false);
      return;
    }
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
    setPuedeGlobo(!(cores <= 2 || mem <= 2));
  }, [reduced]);

  const montarGlobo = puedeGlobo && entered;

  return (
    <section id="explora" className="bg-navy py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <SectionEyebrow>Tu próximo destino</SectionEyebrow>
          <h2 className="font-serif text-ivory text-[30px] md:text-[46px] leading-[1.04] tracking-[-0.02em] mt-3">
            Explora el mundo desde Pereira
          </h2>
          <p className="text-ivory/65 mt-3 md:text-lg">
            Cada destino es un vuelo que sale de casa. Toca uno y empieza tu viaje:
            te mostramos el plan o lo cotizamos por WhatsApp al instante.
          </p>
        </div>

        {/* Visual: póster 2D de base + globo WebGL encima con crossfade al estar listo.
            La altura está reservada (aspect-ratio) para no causar saltos (CLS). */}
        <div
          ref={ref}
          className="relative mt-10 rounded-3xl overflow-hidden ring-1 ring-ivory/10 shadow-2xl shadow-black/30 aspect-[1000/560]"
        >
          <DestinosMapa2D
            className={`w-full h-full block transition-opacity duration-500 ${
              globoListo ? "opacity-0" : "opacity-100"
            }`}
          />
          {montarGlobo && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                globoListo ? "opacity-100" : "opacity-0"
              }`}
            >
              <DestinosGlobe inView={inView} onReady={() => setGloboListo(true)} />
            </div>
          )}
          {puedeGlobo && (
            <p className="absolute bottom-3 left-0 right-0 text-center text-ivory/45 text-[11px] tracking-wide pointer-events-none">
              {globoListo ? "Gira el globo y toca un destino para volar hasta él" : "Cargando el globo…"}
            </p>
          )}
        </div>

        {/* Lista accesible e interactiva (la versión real para teclado/lectores) */}
        <div className="mt-10">
          <h3 className="text-ivory/80 text-sm uppercase tracking-[0.2em] font-semibold mb-4">
            Destinos
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {DESTINOS.map((d) => (
              <li key={d.id}>
                <DestinoCard d={d} onPaquete={openPackage} />
              </li>
            ))}
          </ul>
        </div>

        {/* Cruceros: rutas entre puertos */}
        <div className="mt-10">
          <h3 className="text-ivory/80 text-sm uppercase tracking-[0.2em] font-semibold mb-4">
            Cruceros
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {RUTAS_CRUCERO.map((r) => {
              const recorrido = r.puertos.map((p) => p.nombre).join(" · ");
              const inner = (
                <>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-amber">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                      Crucero
                    </span>
                    <h4 className="font-serif text-navy text-lg leading-tight mt-2">{r.nombre}</h4>
                    <p className="text-navy/55 text-sm mt-1">Embarque en {r.embarque.nombre} · {recorrido}</p>
                  </div>
                  {r.paqueteId ? (
                    <span className="inline-flex items-center gap-1.5 text-coral text-sm font-semibold shrink-0">
                      Ver plan
                      <Icon.Arrow className="w-4 h-4 transition group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-semibold shrink-0">
                      <Icon.Whatsapp className="w-4 h-4" />
                      Cotizar
                    </span>
                  )}
                </>
              );
              const base =
                "group flex items-center justify-between gap-4 rounded-2xl border border-navy/10 bg-white/70 hover:bg-white hover:border-coral/40 hover:shadow-lg hover:shadow-navy/5 transition p-4 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60";
              return (
                <li key={r.id}>
                  {r.paqueteId ? (
                    <button type="button" className={base} onClick={() => openPackage(r.paqueteId!)}>
                      {inner}
                    </button>
                  ) : (
                    <a
                      className={base}
                      href={waLink(`Hola Vuela Fácil, quiero cotizar el ${r.nombre}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-wa="explora-globo"
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
    </section>
  );
}
