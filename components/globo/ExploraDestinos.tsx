"use client";

// components/globo/ExploraDestinos.tsx
//
// Sección "Explora el mundo desde Pereira" — orquestador del globo v3.
// Mantiene el estado único (filtro, origen, destino activo, selección) y lo
// reparte al globo (presentación) y al rail (precisión + accesibilidad + SEO).
//
// Sincronía bidireccional: hover/focus en el rail → resalta el punto y vuela
// hacia él; hover en el globo → resalta el ítem del rail. Clic → tarjeta de
// destino con CTAs (plan / WhatsApp). Reduced-motion / sin WebGL → mapa 2D.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useUI } from "@/lib/ui-context";
import { formatCOP, waLink } from "@/lib/utils";
import { RUTAS_CRUCERO, ISO_POR_PAIS } from "@/lib/destinos";
import {
  type ComandoGlobo,
  type Destino,
  type RutaCrucero,
  type TipoDestino,
  ORIGENES,
  colorDestino,
  etiquetaTipo,
} from "@/lib/geo";
import type { Paquete } from "@/lib/types";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionEyebrow, Stars } from "@/components/ui";
import { Icon } from "@/components/icons";
import { DestinosMapa2D } from "./DestinosMapa2D";

const DestinosGlobe = dynamic(() => import("./DestinosGlobe"), { ssr: false, loading: () => null });

function soportaWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

type Filtro = "todos" | TipoDestino | "cruceros";
type Seleccion =
  | { tipo: "destino"; destino: Destino }
  | { tipo: "crucero"; ruta: RutaCrucero }
  | null;

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "playa", label: "Playa" },
  { id: "naturaleza", label: "Naturaleza" },
  { id: "ciudad", label: "Ciudad" },
  { id: "aventura", label: "Aventura" },
  { id: "internacional", label: "Internacional" },
  { id: "cruceros", label: "Cruceros" },
];

const TIPOS_LEYENDA: TipoDestino[] = ["playa", "naturaleza", "ciudad", "aventura", "internacional"];

export function ExploraDestinos({
  paquetes,
  destinos: todosLosDestinos,
}: {
  paquetes: Paquete[];
  destinos: Destino[];
}) {
  const { openPackage } = useUI();
  const reduced = useReducedMotion();
  const { ref, entered, inView } = useInView<HTMLDivElement>("200px");

  const [puedeGlobo, setPuedeGlobo] = useState(false);
  const [globoListo, setGloboListo] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [origenId, setOrigenId] = useState("pereira");
  const [activoId, setActivoId] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<Seleccion>(null);
  const [comando, setComando] = useState<ComandoGlobo | null>(null);
  const comandoNonce = useRef(0);

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

  // --- Datos derivados -----------------------------------------------------
  const origen = useMemo(() => ORIGENES.find((o) => o.id === origenId) ?? ORIGENES[0], [origenId]);
  const paqueteById = useMemo(() => new Map(paquetes.map((p) => [p.id, p])), [paquetes]);

  const destinosFiltrados = useMemo(() => {
    if (filtro === "todos") return todosLosDestinos;
    if (filtro === "cruceros") return [];
    return todosLosDestinos.filter((d) => d.tipo === filtro);
  }, [filtro, todosLosDestinos]);

  const rutasFiltradas = useMemo(
    () => (filtro === "todos" || filtro === "cruceros" ? RUTAS_CRUCERO : []),
    [filtro],
  );

  // Países (ISO_A3) con al menos un destino → el globo los realza.
  const paisesConDestinos = useMemo(
    () => new Set(todosLosDestinos.map((d) => ISO_POR_PAIS[d.pais]).filter(Boolean) as string[]),
    [todosLosDestinos],
  );

  const avionId = seleccion
    ? seleccion.tipo === "destino"
      ? seleccion.destino.id
      : seleccion.ruta.id
    : activoId;

  // --- Comandos al globo ---------------------------------------------------
  const enviar = useCallback((c: ComandoGlobo) => {
    comandoNonce.current += 1;
    setComando(c);
  }, []);

  const hoverDestino = useCallback(
    (d: Destino) => {
      setActivoId(d.id);
      enviar({ kind: "fly", lat: d.lat, lng: d.lng, alt: 1.8 });
    },
    [enviar],
  );

  const seleccionarDestino = useCallback(
    (d: Destino, volar = true) => {
      setSeleccion({ tipo: "destino", destino: d });
      setActivoId(d.id);
      if (volar) enviar({ kind: "fly", lat: d.lat, lng: d.lng, alt: 0.7 });
    },
    [enviar],
  );

  const seleccionarCrucero = useCallback(
    (r: RutaCrucero, volar = true) => {
      setSeleccion({ tipo: "crucero", ruta: r });
      setActivoId(null);
      if (volar) enviar({ kind: "fly", lat: r.embarque.lat, lng: r.embarque.lng, alt: 0.9 });
    },
    [enviar],
  );

  // Desde el globo (el marcador ya se zambulló → no re-volamos)
  const seleccionarDesdeGlobo = useCallback(
    (refId: string) => {
      const d = todosLosDestinos.find((x) => x.id === refId);
      if (d) {
        setSeleccion({ tipo: "destino", destino: d });
        setActivoId(d.id);
        return;
      }
      const r = RUTAS_CRUCERO.find((x) => x.id === refId);
      if (r) {
        setSeleccion({ tipo: "crucero", ruta: r });
        setActivoId(null);
      }
    },
    [todosLosDestinos],
  );

  const cerrarTarjeta = useCallback(() => {
    setSeleccion(null);
    setActivoId(null);
    enviar({ kind: "reset" });
  }, [enviar]);

  const cambiarFiltro = useCallback((f: Filtro) => {
    setFiltro(f);
    setSeleccion(null);
    setActivoId(null);
  }, []);

  const verColombia = useCallback(() => {
    setSeleccion(null);
    enviar({ kind: "colombia" });
  }, [enviar]);

  return (
    <section id="explora" className="bg-navy py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <SectionEyebrow>Tu próximo destino</SectionEyebrow>
          <h2 className="font-serif text-ivory text-[30px] md:text-[46px] leading-[1.04] tracking-[-0.02em] mt-3">
            Explora el mundo desde Pereira
          </h2>
          <p className="text-ivory/85 mt-3 md:text-lg">
            Cada destino es un vuelo que sale de casa. Tócalo en el globo o en la lista:
            te mostramos el plan o lo cotizamos por WhatsApp al instante.
          </p>
        </div>

        {/* Controles: filtros + volar desde + ver Colombia */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar destinos por tipo">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => cambiarFiltro(f.id)}
                aria-pressed={filtro === f.id}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                  filtro === f.id
                    ? "bg-coral border-coral text-white"
                    : "border-ivory/20 text-ivory/75 hover:border-ivory/50 hover:text-ivory"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex rounded-full border border-ivory/20 p-1"
              role="group"
              aria-label="Origen del vuelo"
            >
              <span className="px-2 text-[12px] text-ivory/70 self-center">Volar desde</span>
              {ORIGENES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOrigenId(o.id)}
                  aria-pressed={origenId === o.id}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    origenId === o.id ? "bg-ivory text-navy" : "text-ivory/70 hover:text-ivory"
                  }`}
                >
                  {o.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Globo + rail */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
          <div
            ref={ref}
            className="relative rounded-3xl overflow-hidden ring-1 ring-ivory/10 shadow-2xl shadow-black/30 aspect-[1000/620] lg:aspect-[1000/680]"
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
                <DestinosGlobe
                  destinos={destinosFiltrados}
                  rutas={rutasFiltradas}
                  origen={origen}
                  paisesConDestinos={paisesConDestinos}
                  activoId={activoId}
                  comando={comando}
                  comandoNonce={comandoNonce.current}
                  avionId={avionId}
                  pausado={seleccion !== null}
                  inView={inView}
                  onReady={() => setGloboListo(true)}
                  onHover={setActivoId}
                  onSelect={seleccionarDesdeGlobo}
                />
              </div>
            )}

            {/* Botón Ver Colombia (cuando el globo está listo) */}
            {puedeGlobo && globoListo && (
              <button
                type="button"
                onClick={verColombia}
                className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory/95 text-navy text-[12px] font-semibold shadow-lg hover:bg-white transition-colors"
              >
                <Icon.Pin className="w-3.5 h-3.5 text-coral" /> Ver destinos en Colombia
              </button>
            )}

            <p className="absolute bottom-3 left-0 right-0 text-center text-ivory/70 text-[11px] tracking-wide pointer-events-none">
              {!puedeGlobo
                ? "Toca un destino en la lista"
                : globoListo
                  ? "Gira y acércate · toca un destino para ver su plan"
                  : "Cargando el globo…"}
            </p>

            {/* Tarjeta de destino (Fase 4) */}
            {seleccion && (
              <TarjetaDestino
                seleccion={seleccion}
                paquete={
                  seleccion.tipo === "destino"
                    ? seleccion.destino.paqueteId
                      ? paqueteById.get(seleccion.destino.paqueteId) ?? null
                      : null
                    : seleccion.ruta.paqueteId
                      ? paqueteById.get(seleccion.ruta.paqueteId) ?? null
                      : null
                }
                onVerPlan={openPackage}
                onCerrar={cerrarTarjeta}
              />
            )}
          </div>

          {/* Rail sincronizado (versión accesible + SEO) */}
          <div className="lg:max-h-[680px] lg:overflow-y-auto lg:pr-1">
            <h3 className="text-ivory/80 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              {destinosFiltrados.length + rutasFiltradas.length} destinos
            </h3>
            <ul className="flex gap-3 overflow-x-auto pb-2 snap-x lg:flex-col lg:overflow-x-visible lg:overflow-y-visible">
              {destinosFiltrados.map((d) => (
                <li key={d.id} className="shrink-0 w-[210px] snap-start lg:w-auto">
                  <RailCard
                    activo={activoId === d.id}
                    color={colorDestino(d.tipo)}
                    tipoLabel={etiquetaTipo[d.tipo]}
                    nombre={d.nombre}
                    pais={d.pais}
                    cta={d.paqueteId ? "Ver plan" : "Cotizar"}
                    conPlan={!!d.paqueteId}
                    onHover={() => hoverDestino(d)}
                    onLeave={() => setActivoId(null)}
                    onClick={() => seleccionarDestino(d)}
                  />
                </li>
              ))}
              {rutasFiltradas.map((r) => (
                <li key={r.id} className="shrink-0 w-[210px] snap-start lg:w-auto">
                  <RailCard
                    activo={false}
                    color="#f4a93c"
                    tipoLabel="Crucero"
                    nombre={r.nombre}
                    pais={`Embarque en ${r.embarque.nombre}`}
                    cta={r.paqueteId ? "Ver plan" : "Cotizar"}
                    conPlan={!!r.paqueteId}
                    onHover={() => enviar({ kind: "fly", lat: r.embarque.lat, lng: r.embarque.lng, alt: 1.8 })}
                    onLeave={() => setActivoId(null)}
                    onClick={() => seleccionarCrucero(r)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Leyenda de tipos (accesibilidad: color + etiqueta) */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          {TIPOS_LEYENDA.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-[12px] text-ivory/70">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorDestino(t) }} />
              {etiquetaTipo[t]}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ivory/70">
            <span className="w-2.5 h-2.5 rounded-full bg-amber" /> Crucero
          </span>
        </div>
      </div>
    </section>
  );
}

// --- Tarjeta de rail (sincronizada) ----------------------------------------
function RailCard({
  activo,
  color,
  tipoLabel,
  nombre,
  pais,
  cta,
  conPlan,
  onHover,
  onLeave,
  onClick,
}: {
  activo: boolean;
  color: string;
  tipoLabel: string;
  nombre: string;
  pais: string;
  cta: string;
  conPlan: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className={`group w-full text-left rounded-2xl border bg-white/[0.06] hover:bg-white/[0.1] transition p-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/70 ${
        activo ? "border-coral bg-white/[0.12]" : "border-ivory/12"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {tipoLabel}
        </span>
        {conPlan && (
          <span className="text-[9px] uppercase tracking-[0.15em] text-coral font-bold">Plan listo</span>
        )}
      </div>
      <div className="font-serif text-ivory text-[17px] leading-tight mt-1.5">{nombre}</div>
      <div className="text-ivory/70 text-[12px]">{pais}</div>
      <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-coral">
        {cta}
        <Icon.Arrow className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

// --- Tarjeta de destino (Fase 4) -------------------------------------------
function TarjetaDestino({
  seleccion,
  paquete,
  onVerPlan,
  onCerrar,
}: {
  seleccion: NonNullable<Seleccion>;
  paquete: Paquete | null;
  onVerPlan: (id: string) => void;
  onCerrar: () => void;
}) {
  const nombre = seleccion.tipo === "destino" ? seleccion.destino.nombre : seleccion.ruta.nombre;
  const pais = seleccion.tipo === "destino" ? seleccion.destino.pais : "Caribe";
  const color =
    seleccion.tipo === "destino" ? colorDestino(seleccion.destino.tipo) : "#f4a93c";
  const tipoLabel =
    seleccion.tipo === "destino" ? etiquetaTipo[seleccion.destino.tipo] : "Crucero";
  const waMsg = `Hola Vuela Fácil, quiero cotizar ${
    seleccion.tipo === "crucero" ? `el ${nombre}` : `un viaje a ${nombre}`
  }.`;
  const destinoSel = seleccion.tipo === "destino" ? seleccion.destino : null;

  return (
    <div className="absolute z-20 bottom-3 left-3 right-3 sm:right-auto sm:w-[340px] animate-[slideUp_.3s_cubic-bezier(.2,.7,.2,1)]">
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 text-navy hover:bg-white shadow flex items-center justify-center"
        >
          <Icon.Close className="w-4 h-4" />
        </button>

        {paquete ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={paquete.imagen} alt={nombre} className="w-full h-32 object-cover" loading="lazy" />
            <div className="p-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                {tipoLabel}
              </span>
              <h4 className="font-serif text-navy text-[20px] leading-tight mt-1">{nombre}</h4>
              <div className="text-navy/55 text-[12px]">{pais}</div>
              <div className="mt-2.5 flex items-center gap-3 text-[12px] text-navy/70">
                <span className="inline-flex items-center gap-1">
                  <Icon.Clock className="w-3.5 h-3.5 text-coral" /> {paquete.duracion}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Stars rating={paquete.calificacion} className="w-3.5 h-3.5" /> {paquete.calificacion}
                </span>
              </div>
              <div className="mt-2 text-navy/60 text-[12px]">
                desde{" "}
                <span className="font-serif text-navy text-[20px]">{formatCOP(paquete.precio)}</span>{" "}
                por persona
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onVerPlan(paquete.id)}
                  className="flex-1 px-3 py-2.5 rounded-full bg-navy text-white text-[13px] font-semibold hover:bg-navy/90 transition-colors"
                >
                  Ver plan completo
                </button>
                <a
                  href={waLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa="explora-globo"
                  aria-label="Cotizar por WhatsApp"
                  className="px-3 py-2.5 rounded-full bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1ebe57] transition-colors inline-flex items-center"
                >
                  <Icon.Whatsapp className="w-4 h-4" />
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4">
            {destinoSel?.imagen ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={destinoSel.imagen} alt={nombre} className="w-full h-28 object-cover -mx-4 -mt-4 mb-3 max-w-[calc(100%+2rem)]" loading="lazy" />
                <h4 className="font-serif text-navy text-[20px] leading-tight">{nombre}</h4>
              </>
            ) : (
              <div
                className="h-20 -mx-4 -mt-4 mb-3 flex items-end p-4"
                style={{ background: `linear-gradient(135deg, ${color}, #0d2c54)` }}
              >
                <h4 className="font-serif text-white text-[20px] leading-tight">{nombre}</h4>
              </div>
            )}
            <div className="text-navy/55 text-[12px] -mt-1">{pais}</div>
            <p className="text-navy/70 text-[13px] mt-2 leading-relaxed">
              {destinoSel?.descripcionCorta ||
                `Aún no publicamos un plan para ${nombre}, ¡pero te lo armamos a tu medida!`}
            </p>
            <a
              href={waLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              data-wa="explora-globo"
              className="mt-3 w-full px-3 py-2.5 rounded-full bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1ebe57] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Icon.Whatsapp className="w-4 h-4" /> Cotizar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
