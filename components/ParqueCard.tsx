import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { formatMoneda, waLink, descuentoPct } from "@/lib/utils";
import type { Parque } from "@/lib/types";

/** Tarjeta de parque/atracción (entrada por día). */
export function ParqueCard({ p }: { p: Parque }) {
  const desc = descuentoPct(p.precioDesde, p.precioAntes);
  const msg = `Hola Vuela Fácil 👋 Quiero entradas para *${p.nombre}* (${p.ubicacion}). ¿Me cuentas precios y disponibilidad?`;
  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-navy/8 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(13,44,84,0.35)] hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-300 flex flex-col">
      <Link href={`/parques/${p.id}`} className="relative aspect-[5/4] overflow-hidden block">
        <Image
          src={p.imagen}
          alt={p.nombre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-navy text-[11px] font-semibold tracking-wide">
          {p.tipo}
        </div>
        {p.etiqueta && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[11px] font-semibold tracking-wider uppercase shadow-lg">
            {p.etiqueta}
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white text-[11px] uppercase tracking-[0.18em] flex items-center gap-1.5">
          <Icon.Pin className="w-3.5 h-3.5" /> {p.ubicacion}
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-[22px] md:text-[24px] text-navy leading-tight">
          <Link href={`/parques/${p.id}`} className="hover:text-coral transition-colors">
            {p.nombre}
          </Link>
        </h3>
        {p.horario && (
          <div className="flex items-center gap-1.5 text-[12px] text-navy/55 mt-2">
            <Icon.Clock className="w-3.5 h-3.5" /> {p.horario}
          </div>
        )}
        {p.incluye.length > 0 && (
          <ul className="space-y-1.5 mt-4">
            {p.incluye.slice(0, 3).map((i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-navy/75">
                <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" /> {i}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-5 border-t border-navy/8">
          <div className="flex items-end justify-between mb-4">
            <div>
              {desc && (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-navy/40 line-through">{formatMoneda(p.precioAntes!, p.moneda)}</span>
                  <span className="text-[11px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full">−{desc}%</span>
                </div>
              )}
              <div className="text-[11px] uppercase tracking-wider text-navy/50">Entrada desde</div>
              <div className="font-serif text-[26px] text-navy leading-none mt-1">{formatMoneda(p.precioDesde, p.moneda)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/parques/${p.id}`}
              className="px-4 py-3 rounded-full border border-navy/15 text-navy text-[13px] font-semibold text-center hover:bg-navy hover:text-white transition-colors"
            >
              Ver detalle
            </Link>
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noreferrer"
              data-wa="parque-card"
              className="px-4 py-3 rounded-full bg-[#25D366] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1ebe57] transition-colors"
            >
              <Icon.Whatsapp className="w-4 h-4" /> Entradas
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
