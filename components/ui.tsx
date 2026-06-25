import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { IMG } from "@/lib/data";
import { Icon } from "./icons";

/**
 * Estrellas con relleno fraccionario honesto: un 4.8 se ve distinto a un 5.0.
 * Dibuja 5 estrellas grises de fondo y superpone 5 ámbar recortadas al % real.
 */
export function Stars({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${rating.toFixed(1)} de 5 estrellas`}
    >
      <span className="flex text-navy/15">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon.Star key={i} className={className} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex overflow-hidden text-amber"
        style={{ width: `${pct}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon.Star key={i} className={`${className} shrink-0`} />
        ))}
      </span>
    </span>
  );
}

export function Logo({ light = false, size = 44 }: { light?: boolean; size?: number }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Vuela Fácil Travel · Inicio">
      <span className="vf-logo relative inline-flex shrink-0 rounded-full" style={{ width: size, height: size }}>
        <Image
          src={IMG.logo}
          alt="Vuela Fácil Travel"
          width={size}
          height={size}
          priority
          className="rounded-full shadow-sm ring-1 ring-black/5 bg-white object-cover"
        />
        <span className="vf-logo-shine" aria-hidden="true" />
      </span>
      <div className="leading-tight">
        <div
          className={`font-serif text-[18px] tracking-tight ${light ? "text-white" : "text-navy"}`}
        >
          Vuela <span className="text-coral italic">Fácil</span>
        </div>
        <div
          className={`text-[10px] tracking-[0.3em] font-medium ${light ? "text-white/70" : "text-navy/60"}`}
        >
          TRAVEL · PEREIRA
        </div>
      </div>
    </Link>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 text-coral text-[11px] tracking-[0.3em] uppercase font-semibold">
      <span className="w-8 h-px bg-coral" />
      {children}
    </div>
  );
}
