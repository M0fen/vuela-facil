"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "./icons";

/**
 * Galería pública con visor (lightbox) a pantalla completa: el cliente ve las
 * fotos bien en PC y móvil, navega con flechas/teclado y amplía flyers altos
 * (la imagen se muestra completa, con scroll si hace falta).
 *
 * - variant "grid": cuadrícula (primera foto grande). Para fincas/hoteles/parques.
 * - variant "flyer": una sola imagen completa (object-contain), tipo afiche.
 */
export function GaleriaPublica({
  images,
  alt,
  variant = "grid",
}: {
  images: string[];
  alt: string;
  variant?: "grid" | "flyer";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  const cerrar = useCallback(() => setOpen(null), []);
  const ir = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)),
    [n],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, cerrar, ir]);

  if (n === 0) return null;

  return (
    <>
      {variant === "flyer" ? (
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="group relative block w-full rounded-2xl overflow-hidden border border-navy/10 bg-white cursor-zoom-in"
          aria-label="Ampliar imagen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={alt} className="w-full h-auto block" loading="eager" />
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-navy text-[12px] font-semibold shadow-lg">
            <Icon.Search className="w-3.5 h-3.5" /> Ver imagen completa
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <button
              type="button"
              key={src + i}
              onClick={() => setOpen(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`group relative rounded-2xl overflow-hidden bg-white cursor-zoom-in ${
                i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} — foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 overflow-auto overscroll-contain"
          onClick={cerrar}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            onClick={cerrar}
            aria-label="Cerrar"
            className="fixed top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/95 text-navy flex items-center justify-center shadow-lg hover:bg-white"
          >
            <Icon.Close className="w-5 h-5" />
          </button>

          {n > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  ir(-1);
                }}
                aria-label="Anterior"
                className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 text-navy flex items-center justify-center shadow-lg hover:bg-white"
              >
                <Icon.Arrow className="w-5 h-5 rotate-180" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  ir(1);
                }}
                aria-label="Siguiente"
                className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 text-navy flex items-center justify-center shadow-lg hover:bg-white"
              >
                <Icon.Arrow className="w-5 h-5" />
              </button>
              <div className="fixed top-5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/90 text-navy text-[12px] font-semibold shadow">
                {open + 1} / {n}
              </div>
            </>
          )}

          <div className="min-h-full flex items-start justify-center p-4 py-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[open]}
              alt={`${alt} — foto ${open + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="w-auto max-w-full md:max-w-4xl h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
