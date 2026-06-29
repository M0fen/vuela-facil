"use client";

import { useState } from "react";

/**
 * Editor de galería para el panel. Muestra MINIATURAS de las fotos actuales (así
 * el operador ve qué hay y puede gestionarlas), permite quitarlas y subir nuevas
 * con vista previa. Las fotos que se conservan se envían como inputs ocultos
 * `galeria`; las nuevas como `galeriaArchivos` (las lee la Server Action).
 */
export function GaleriaEditor({ existing = [] }: { existing?: string[] }) {
  const [kept, setKept] = useState<string[]>(existing);
  const [nuevos, setNuevos] = useState<{ name: string; url: string }[]>([]);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNuevos(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
  };

  return (
    <div>
      <span className="block text-[12px] font-semibold text-navy/55 mb-2">
        Fotos de la galería {kept.length > 0 && <span className="text-navy/40">({kept.length})</span>}
      </span>

      {kept.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {kept.map((url) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden border border-navy/10 bg-ivory"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <input type="hidden" name="galeria" value={url} />
              <button
                type="button"
                onClick={() => setKept((k) => k.filter((u) => u !== url))}
                aria-label="Quitar foto"
                title="Quitar foto"
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/55 text-white text-[15px] leading-none flex items-center justify-center hover:bg-coral transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-navy/45">Aún no hay fotos en la galería.</p>
      )}

      <label className="block mt-4 text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5">
        Agregar fotos
      </label>
      <input
        type="file"
        name="galeriaArchivos"
        accept="image/*"
        multiple
        onChange={onFiles}
        className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
      />

      {nuevos.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] text-emerald font-semibold mb-1.5">
            {nuevos.length} {nuevos.length === 1 ? "foto nueva" : "fotos nuevas"} por subir al guardar:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {nuevos.map((n) => (
              <div key={n.url} className="relative aspect-square rounded-xl overflow-hidden border border-emerald/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.url} alt={n.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
