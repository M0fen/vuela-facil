"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { formatCOP, waLink, descuentoPct } from "@/lib/utils";
import { FINANCIACION } from "@/lib/data";
import { useUI, type Filtro } from "@/lib/ui-context";
import type { Paquete } from "@/lib/types";

const FILTROS: Filtro[] = ["Todos", "Playa", "Eje Cafetero", "Cruceros", "Internacional"];

function PackageCard({ p }: { p: Paquete }) {
  const { openPackage } = useUI();
  const msg = `Hola Vuela Fácil 👋 Quiero información del paquete *${p.destino}* (${p.duracion}) — ref ${p.id}.`;

  return (
    <article
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a,button")) return;
        openPackage(p.id);
      }}
      className="group bg-white rounded-3xl overflow-hidden border border-navy/8 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(13,44,84,0.35)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={p.imagen}
          alt={p.destino}
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
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-navy text-[12px] font-semibold flex items-center gap-1">
          <Icon.Star className="w-3.5 h-3.5 text-amber" /> {p.calificacion}
          <span className="text-navy/50 font-normal">({p.reviews})</span>
        </div>
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
          <Icon.Clock className="w-3.5 h-3.5" /> {p.duracion}
          <span className="w-1 h-1 rounded-full bg-navy/30" />
          <span>{p.salidas.length} salidas</span>
        </div>
        <ul className="space-y-1.5 mb-5">
          {p.incluye.slice(0, 4).map((i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-navy/75">
              <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" />
              {i}
            </li>
          ))}
        </ul>
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

export function Paquetes({ paquetes }: { paquetes: Paquete[] }) {
  const { filtro, setFiltro } = useUI();
  const list = filtro === "Todos" ? paquetes : paquetes.filter((p) => p.categoria === filtro);

  return (
    <section id="paquetes" className="bg-ivory py-24 md:py-32 border-y border-navy/5">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
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
            {FILTROS.map((c) => (
              <button
                key={c}
                onClick={() => setFiltro(c)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors border ${
                  filtro === c
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-navy/70 border-navy/10 hover:border-navy/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {list.map((p) => (
            <PackageCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
