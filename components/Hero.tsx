"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { Icon } from "./icons";
import { CountUp } from "./fx/CountUp";
import { IMG, NEGOCIO } from "@/lib/data";
import { formatCOP, waLink } from "@/lib/utils";
import { useUI } from "@/lib/ui-context";
import {
  PRESUPUESTOS,
  categoriasConInventario,
  destinosDisponibles,
  filtrarPaquetes,
  type Busqueda,
  type Filtro,
} from "@/lib/buscador";
import type { Paquete } from "@/lib/types";

const fieldInput =
  "w-full bg-transparent outline-none text-[14px] text-navy font-medium cursor-pointer";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-01" → "enero 2026"; vacío → "Fechas flexibles". */
function mesLegible(ym: string): string {
  if (!ym) return "Fechas flexibles";
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return ym;
  return `${MESES[m - 1]} ${y}`;
}

function Campo({
  icon: I,
  label,
  className = "",
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`bg-white px-5 py-3.5 flex items-center gap-3 ${className}`}>
      <I className="w-5 h-5 text-coral shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-navy/55 font-semibold">{label}</div>
        {children}
      </div>
    </div>
  );
}

export function Hero({ paquetes }: { paquetes: Paquete[] }) {
  const { setBusqueda, scrollTo } = useUI();

  const tabs = useMemo(() => categoriasConInventario(paquetes), [paquetes]);
  const destinos = useMemo(() => destinosDisponibles(paquetes), [paquetes]);

  const [categoria, setCategoria] = useState<Filtro>("Todos");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [viajeros, setViajeros] = useState(2);
  const [presupuestoIdx, setPresupuestoIdx] = useState(-1); // -1 = cualquiera
  const [vueloDesde, setVueloDesde] = useState<number | null>(null);

  const rango = presupuestoIdx >= 0 ? PRESUPUESTOS[presupuestoIdx] : null;

  // Precio referencial de vuelo al destino elegido (Nivel 1, env-gated en el
  // backend). Si no hay credenciales, /api/vuelos responde sin precio y no se
  // muestra nada: la UX queda idéntica.
  useEffect(() => {
    let cancelado = false;
    setVueloDesde(null);
    if (!destino) return;
    fetch(`/api/vuelos?destino=${encodeURIComponent(destino)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelado && d?.precio) setVueloDesde(d.precio);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [destino]);

  // Búsqueda actual (lo que se aplicará / se cuenta en vivo).
  const busqueda: Busqueda = {
    categoria,
    destino,
    presupuestoMin: rango?.min ?? 0,
    presupuestoMax: rango?.max ?? Infinity,
    soloConsolidador: false,
    viajeros,
    mes: fecha,
  };

  // Conteo en vivo: cuántos planes coinciden con los filtros reales.
  const coincidencias = useMemo(
    () => filtrarPaquetes(paquetes, busqueda).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paquetes, categoria, destino, presupuestoIdx],
  );

  const sinResultados = coincidencias === 0;

  // Pestaña y destino son excluyentes para no producir filtros contradictorios
  // (p. ej. "Playa" + "Cancún"): elegir uno limpia el otro.
  const elegirCategoria = (t: Filtro) => {
    setCategoria(t);
    setDestino("");
  };
  const elegirDestino = (value: string) => {
    setDestino(value);
    if (value) setCategoria("Todos");
  };

  const handleSearch = () => {
    setBusqueda(busqueda);
    scrollTo("#paquetes");
  };

  const waMsg = [
    "🛫 *VUELA FÁCIL TRAVEL*",
    "_Solicitud de cotización_",
    "",
    "¡Hola! Quiero cotizar un viaje 👇",
    "",
    `📍 *Destino:* ${destino || "Aún por decidir"}`,
    `✨ *Estilo:* ${categoria === "Todos" ? "Abierto a opciones" : categoria}`,
    `📅 *Salida:* ${mesLegible(fecha)}`,
    `👥 *Viajeros:* ${viajeros} ${viajeros === 1 ? "viajero" : "viajeros"}`,
    `💰 *Presupuesto:* ${rango ? rango.label : "Por definir"}`,
    ...(vueloDesde ? [`🛫 *Vuelos desde:* ${formatCOP(vueloDesde)} (referencial)`] : []),
    "",
    "¿Me ayudan a armar la mejor opción? 🙌",
  ].join("\n");

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Image src={IMG.hero} alt="Destino aspiracional" fill priority sizes="100vw" className="object-cover hero-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/30 to-navy/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-8 pt-[116px] md:pt-[160px] pb-12 md:pb-16">
        <div className="max-w-3xl">
          <div className="hero-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-white/95 text-[12px] tracking-[0.18em] uppercase mb-6" style={{ animationDelay: "0.05s" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
            Pereira · Eje Cafetero · desde 2022
          </div>
          <h1 className="hero-in font-serif text-white text-[44px] leading-[1.02] md:text-[72px] md:leading-[1.02] tracking-[-0.02em]" style={{ animationDelay: "0.15s" }}>
            El mundo es <em className="italic text-amber">más fácil</em>
            <br />
            cuando alguien <br className="hidden md:block" />
            lo planea por ti.
          </h1>
          <p className="hero-in mt-6 text-white/90 text-[16px] md:text-[18px] max-w-xl leading-relaxed" style={{ animationDelay: "0.28s" }}>
            Diseñamos viajes a la medida por Colombia y el mundo. Tiquetes, hoteles, cruceros y
            experiencias — con asesoría humana en Pereira y reserva 100% por WhatsApp.
          </p>
        </div>

        {/* Buscador real: filtra el catálogo y arma tu cotización por WhatsApp */}
        <div className="hero-in mt-12 md:mt-14" style={{ animationDelay: "0.4s" }}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_30px_80px_-20px_rgba(13,44,84,0.45)] border border-white/40 overflow-hidden">
            <div className="flex border-b border-navy/10 px-3 md:px-5 pt-3 gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => elegirCategoria(t)}
                  aria-pressed={categoria === t}
                  className={`px-4 py-3 text-[13px] md:text-[14px] font-semibold whitespace-nowrap rounded-t-lg transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${
                    categoria === t ? "text-navy" : "text-navy/55 hover:text-navy/80"
                  }`}
                >
                  {t}
                  {categoria === t && (
                    <span className="absolute left-3 right-3 bottom-0 h-[3px] rounded-t-full bg-gradient-to-r from-coral to-amber" />
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-px bg-navy/5">
              <Campo icon={Icon.Pin} label="Destino" className="md:col-span-4">
                <select value={destino} onChange={(e) => elegirDestino(e.target.value)} className={fieldInput} aria-label="Destino">
                  <option value="">¿A dónde sueñas ir?</option>
                  {destinos.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo icon={Icon.Calendar} label="Salida" className="md:col-span-3">
                <input
                  type="month"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  onClick={(e) => {
                    const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                    try {
                      el.showPicker?.();
                    } catch {
                      /* showPicker no disponible: el input sigue siendo usable */
                    }
                  }}
                  className={`${fieldInput} field-date`}
                  aria-label="Mes de salida"
                />
              </Campo>
              <Campo icon={Icon.Users} label="Viajeros" className="md:col-span-2">
                <select value={viajeros} onChange={(e) => setViajeros(Number(e.target.value))} className={fieldInput} aria-label="Número de viajeros">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "viajero" : "viajeros"}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo icon={Icon.Wallet} label="Presupuesto" className="md:col-span-3">
                <select
                  value={presupuestoIdx}
                  onChange={(e) => setPresupuestoIdx(Number(e.target.value))}
                  className={fieldInput}
                  aria-label="Presupuesto por persona"
                >
                  <option value={-1}>Cualquiera</option>
                  {PRESUPUESTOS.map((p, i) => (
                    <option key={p.label} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <div className="bg-white p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 px-2 text-[12px] text-navy/65">
                <span
                  key={coincidencias}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold animate-[fadeIn_0.3s_ease-out] ${
                    sinResultados ? "bg-amber/15 text-[#b8730a]" : "bg-emerald/10 text-emerald-700"
                  }`}
                >
                  <Icon.Search className="w-3.5 h-3.5" />
                  {sinResultados
                    ? "Sin resultados exactos · te lo armamos"
                    : `${coincidencias} ${coincidencias === 1 ? "plan coincide" : "planes coinciden"}`}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/5">
                  <Icon.Sparkle className="w-3.5 h-3.5 text-coral" /> Cuotas sin interés
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/5">
                  <Icon.Shield className="w-3.5 h-3.5 text-navy" /> RNT vigente
                </span>
                {vueloDesde && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky/10 text-[#2b6ea3] font-semibold">
                    <Icon.Plane className="w-3.5 h-3.5" /> Vuelos desde {formatCOP(vueloDesde)}
                    <span className="font-normal text-navy/45">referencial</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <a
                  href={waLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa="hero-buscador"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-4 rounded-full border border-emerald/30 text-[#1f8a5b] text-[13px] font-semibold hover:bg-emerald/5 transition-[colors,transform] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40 shrink-0"
                >
                  <Icon.Whatsapp className="w-4 h-4" /> Cotizar
                </a>
                <button
                  onClick={handleSearch}
                  className="group flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[15px] font-semibold tracking-wide shadow-[0_14px_30px_-10px_rgba(232,99,26,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(232,99,26,0.7)] transition-all active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <Icon.Search className="w-5 h-5" />
                  {sinResultados
                    ? "Cotizar a la medida"
                    : `Ver ${coincidencias} ${coincidencias === 1 ? "viaje" : "viajes"}`}
                  <Icon.Arrow className="w-5 h-5 -mr-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          {/* Precio de referencia para anclar expectativas. */}
          <p className="mt-3 text-white/70 text-[12px] px-1">
            Planes desde {formatCOP(Math.min(...paquetes.map((p) => p.precio)))} por persona · precios reales en COP.
          </p>
        </div>

        <div className="hero-in mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-10 max-w-2xl text-white/90" style={{ animationDelay: "0.55s" }}>
          {(
            [
              [`${NEGOCIO.anios} años`, "diseñando viajes"],
              [NEGOCIO.viajeros, "viajeros felices"],
              ["100%", "por WhatsApp"],
            ] as const
          ).map(([n, l]) => (
            <div key={l}>
              <CountUp value={n} className="block font-serif text-2xl md:text-4xl text-white" />
              <div className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-white/70 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/75 text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-2">
        Descubre
        <span className="w-px h-10 bg-gradient-to-b from-white/80 to-transparent" />
      </div>
    </section>
  );
}
