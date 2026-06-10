import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import type { Paquete } from "@/lib/types";
import { formatCOP, descuentoPct } from "@/lib/utils";

/**
 * Tarjeta compacta y presentacional (sin hooks) que enlaza a la página de
 * detalle. Reutilizable tanto en Server Components (relacionados) como en
 * Client Components (quiz, vistos, recomendados de temporada).
 */
export function PackageMini({ p }: { p: Paquete }) {
  const desc = descuentoPct(p.precio, p.precioAntes);

  return (
    <Link
      href={`/paquetes/${p.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-navy/8 hover:border-navy/20 hover:shadow-[0_24px_50px_-30px_rgba(13,44,84,0.4)] transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.imagen}
          alt={p.destino}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
        {p.etiqueta && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[10px] font-semibold uppercase tracking-wide shadow">
            {p.etiqueta}
          </span>
        )}
        <span className="absolute bottom-3 left-3 text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-1">
          <Icon.Pin className="w-3 h-3" /> {p.pais}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-navy text-[17px] leading-tight group-hover:text-coral transition-colors">
          {p.destino}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-navy/55 mt-1">
          <Icon.Clock className="w-3.5 h-3.5" /> {p.duracion}
          <span className="w-1 h-1 rounded-full bg-navy/30" />
          <span className="inline-flex items-center gap-0.5">
            <Icon.Star className="w-3 h-3 text-amber" /> {p.calificacion}
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-navy/45">Desde</div>
            <div className="font-serif text-[20px] text-navy leading-none">
              {formatCOP(p.precio)}
            </div>
          </div>
          {desc && (
            <span className="text-[10px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full">
              −{desc}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
