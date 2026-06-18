"use client";

import { useMemo, type ReactNode } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { formatCOP, waLink, descuentoPct } from "@/lib/utils";
import { FINANCIACION } from "@/lib/data";
import { useUI } from "@/lib/ui-context";
import {
  categoriasConInventario,
  filtrarPaquetes,
  hayFiltros,
  hayPresupuesto,
  PRESUPUESTOS,
} from "@/lib/buscador";
import type { Paquete } from "@/lib/types";

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

function PackageCard({ p, index = 0 }: { p: Paquete; index?: number }) {
  const { openPackage } = useUI();
  const msg = `Hola Vuela Fácil 👋 Quiero información del paquete *${p.destino}* (${p.duracion}) — ref ${p.id}.`;

  // Abre el modal con transición de vista (la foto de la tarjeta "viaja" al
  // modal). Mejora progresiva: sin soporte o con reduced-motion, abre normal.
  const abrir = (article: HTMLElement) => {
    const doc = document as VTDoc;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      openPackage(p.id);
      return;
    }
    const img = article.querySelector<HTMLElement>("[data-pkg-img]");
    img?.style.setProperty("view-transition-name", "vf-pkg-hero");
    const vt = doc.startViewTransition(() => {
      flushSync(() => openPackage(p.id));
      // En el nuevo estado el nombre lo lleva la imagen del modal; lo quitamos de
      // la tarjeta para que no haya dos elementos con el mismo nombre.
      img?.style.removeProperty("view-transition-name");
    });
    vt.finished.finally(() => img?.style.removeProperty("view-transition-name"));
  };

  return (
    <article
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a,button")) return;
        abrir(e.currentTarget);
      }}
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
      className="card-in group bg-white rounded-3xl overflow-hidden border border-navy/8 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(13,44,84,0.35)] hover:-translate-y-1 active:scale-[0.99] transition-[transform,box-shadow,border-color] duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={p.imagen}
          alt={p.destino}
          data-pkg-img
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
        {p.etiqueta && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[11px] font-semibold tracking-wider uppercase shadow-lg">
            {p.etiqueta}
          </div>
        )}
        {p.reviews > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-navy text-[12px] font-semibold flex items-center gap-1">
            <Icon.Star className="w-3.5 h-3.5 text-amber" /> {p.calificacion}
            <span className="text-navy/50 font-normal">({p.reviews})</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Icon.Pin className="w-3.5 h-3.5" /> {p.pais}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h3 className="font-serif text-[22px] md:text-[24px] text-navy leading-tight">
            <Link href={`/paquetes/${p.id}`} className="hover:text-coral transition-colors">
              {p.destino}
            </Link>
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-navy/55 mb-4">
          {p.flyer ? (
            <>
              <Icon.Sparkle className="w-3.5 h-3.5 text-coral" /> Oferta de consolidador
            </>
          ) : (
            <>
              <Icon.Clock className="w-3.5 h-3.5" /> {p.duracion}
              <span className="w-1 h-1 rounded-full bg-navy/30" />
              <span>{p.salidas.length} salidas</span>
            </>
          )}
        </div>
        {p.incluye.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {p.incluye.slice(0, 4).map((i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-navy/75">
                <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-5 border-t border-navy/8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-navy/50">
                Desde por persona
              </div>
              {(() => {
                const desc = descuentoPct(p.precio, p.precioAntes);
                return desc ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] text-navy/40 line-through">
                      {formatCOP(p.precioAntes!)}
                    </span>
                    <span className="text-[11px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full">
                      −{desc}%
                    </span>
                  </div>
                ) : null;
              })()}
              <div className="font-serif text-[26px] text-navy leading-none mt-1">
                {formatCOP(p.precio)}
              </div>
              <div className="text-[11px] text-emerald font-medium mt-0.5">
                o {FINANCIACION.cuotas} cuotas sin interés
              </div>
            </div>
            <div className="text-right text-[11px] text-navy/50">
              ref
              <br />
              <span className="font-mono text-navy/80">{p.id}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openPackage(p.id)}
              className="px-4 py-3 rounded-full border border-navy/15 text-navy text-[13px] font-semibold hover:bg-navy hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            >
              Ver detalle
            </button>
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-full bg-[#25D366] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1ebe57] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40"
            >
              <Icon.Whatsapp className="w-4 h-4" /> Reservar
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Chip de filtro activo, con botón para quitarlo. */
function Chip({ children, onClear }: { children: ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-coral/10 border border-coral/25 text-coral text-[12px] font-semibold">
      {children}
      <button onClick={onClear} aria-label="Quitar filtro" className="w-4 h-4 rounded-full hover:bg-coral/20 flex items-center justify-center">
        <Icon.Close className="w-3 h-3" />
      </button>
    </span>
  );
}

export function Paquetes({ paquetes }: { paquetes: Paquete[] }) {
  const { busqueda, setBusqueda, resetBusqueda } = useUI();
  const filtros = useMemo(() => categoriasConInventario(paquetes), [paquetes]);
  const list = useMemo(() => filtrarPaquetes(paquetes, busqueda), [paquetes, busqueda]);

  const presupuestoLabel = hayPresupuesto(busqueda)
    ? PRESUPUESTOS.find((p) => p.min === busqueda.presupuestoMin && p.max === busqueda.presupuestoMax)?.label
    : null;

  const waVacio = `Hola Vuela Fácil 👋 Busqué un viaje${
    busqueda.destino ? ` a ${busqueda.destino}` : ""
  }${busqueda.categoria !== "Todos" ? ` (${busqueda.categoria})` : ""}${
    presupuestoLabel ? ` con presupuesto ${presupuestoLabel}` : ""
  } y no vi un plan publicado. ¿Me ayudan a armarlo a la medida?`;

  return (
    <section id="paquetes" className="bg-ivory py-14 md:py-32 border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <SectionEyebrow>Paquetes destacados</SectionEyebrow>
            <h2 className="font-serif text-navy text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-3">
              Viajes listos para <em className="italic text-coral">reservar hoy</em>.
            </h2>
            <p className="mt-4 text-navy/65 max-w-lg">
              Precios reales en pesos colombianos. Todos incluyen asesoría humana, RNT y atención
              antes, durante y después del viaje.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filtros.map((c) => (
              <button
                key={c}
                onClick={() => setBusqueda({ categoria: c })}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors border ${
                  busqueda.categoria === c
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-navy/70 border-navy/10 hover:border-navy/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen de búsqueda: conteo + chips de filtros activos */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          <span className="text-navy/70 text-[14px] font-semibold">
            {list.length} {list.length === 1 ? "viaje" : "viajes"}
          </span>
          {busqueda.destino && (
            <Chip onClear={() => setBusqueda({ destino: "" })}>{busqueda.destino}</Chip>
          )}
          {presupuestoLabel && (
            <Chip onClear={() => setBusqueda({ presupuestoMin: 0, presupuestoMax: Infinity })}>
              {presupuestoLabel}
            </Chip>
          )}
          {hayFiltros(busqueda) && (
            <button
              onClick={resetBusqueda}
              className="text-navy/50 hover:text-coral text-[12px] font-semibold underline underline-offset-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {list.length > 0 ? (
          <div
            key={`${busqueda.categoria}|${busqueda.destino}|${busqueda.presupuestoMin}|${busqueda.presupuestoMax}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
          >
            {list.map((p, i) => (
              <PackageCard key={p.id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-3xl bg-white border border-dashed border-navy/15">
            <span className="inline-flex w-14 h-14 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-4">
              <Icon.Compass className="w-7 h-7" />
            </span>
            <h3 className="font-serif text-navy text-[24px]">No hay un plan publicado con esos filtros</h3>
            <p className="text-navy/60 text-[14px] mt-2 max-w-md mx-auto">
              Pero eso no es un “no”: diseñamos viajes a la medida. Cuéntanos qué buscas y te armamos
              una propuesta sin compromiso.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <a
                href={waLink(waVacio)}
                target="_blank"
                rel="noreferrer"
                data-wa="paquetes-vacio"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
              >
                <Icon.Whatsapp className="w-5 h-5" /> Pedir plan a la medida
              </a>
              <button
                onClick={resetBusqueda}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-navy/15 text-navy font-semibold hover:bg-navy hover:text-white transition-colors"
              >
                Ver todos los viajes
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
