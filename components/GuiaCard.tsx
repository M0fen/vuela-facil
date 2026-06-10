import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import type { Guia } from "@/lib/types";

export function GuiaCard({ g }: { g: Guia }) {
  return (
    <Link
      href={`/guias/${g.slug}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-navy/8 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(13,44,84,0.35)] transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={g.imagen}
          alt={g.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {g.etiquetas?.[0] && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-navy text-[11px] font-semibold">
            {g.etiquetas[0]}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-navy text-[20px] leading-snug group-hover:text-coral transition-colors">
          {g.titulo}
        </h3>
        <p className="text-navy/65 text-[14px] mt-2 line-clamp-3 flex-1">{g.resumen}</p>
        <span className="inline-flex items-center gap-1.5 text-coral font-semibold text-[13px] mt-4">
          Leer guía <Icon.Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
