"use client";

import { useEffect, useRef, useState } from "react";

// Núcleo de los 60 fps: arranca en un tier según el dispositivo y lo ajusta en
// runtime midiendo FPS con un promedio por segundo + histéresis (para no
// oscilar). Nunca hace setState por frame: solo cuando el tier cambia (raro).

export type Tier = "alto" | "medio" | "bajo";

const ORDEN: Tier[] = ["bajo", "medio", "alto"];

/** Tier inicial = tope del dispositivo. No se sube por encima de este. */
function tierInicial(): Tier {
  if (typeof navigator === "undefined") return "medio";
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const touch =
    typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

  if (cores >= 8 && mem >= 8 && !touch) return "alto";
  if (cores <= 4 || mem <= 4) return touch ? "bajo" : "medio";
  return "medio";
}

export interface QualityTier {
  tier: Tier;
  /** Tope del dispositivo (no se sube por encima). Estable. */
  cap: Tier;
  dpr: number;
  antialias: boolean;
  efectos: boolean; // atmósfera + rings
  arcosAnimados: boolean;
  autorotar: boolean;
}

function specs(tier: Tier): Omit<QualityTier, "tier" | "cap"> {
  const dprMax = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  switch (tier) {
    case "alto":
      return { dpr: Math.min(dprMax, 2), antialias: true, efectos: true, arcosAnimados: true, autorotar: true };
    case "medio":
      return { dpr: 1.5, antialias: true, efectos: true, arcosAnimados: true, autorotar: true };
    case "bajo":
      return { dpr: 1, antialias: false, efectos: false, arcosAnimados: false, autorotar: false };
  }
}

/**
 * @param active  Solo mide cuando el globo está montado y visible.
 * El `antialias` se fija con el tier inicial (no cambia en runtime: el contexto
 * WebGL se crea una sola vez). El resto se ajusta dinámicamente.
 */
export function useAdaptiveQuality(active: boolean): QualityTier {
  const capRef = useRef<Tier>(tierInicial());
  const [tier, setTier] = useState<Tier>(capRef.current);
  // antialias congelado al primer tier (decisión de creación del contexto)
  const antialiasRef = useRef<boolean>(specs(capRef.current).antialias);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let bajoDesde = 0;
    let altoDesde = 0;

    const loop = (now: number) => {
      frames++;
      const dt = now - last;
      if (dt >= 1000) {
        const fps = (frames * 1000) / dt;
        frames = 0;
        last = now;

        if (fps < 55) {
          if (!bajoDesde) bajoDesde = now;
          altoDesde = 0;
        } else if (fps > 58) {
          if (!altoDesde) altoDesde = now;
          bajoDesde = 0;
        } else {
          bajoDesde = 0;
          altoDesde = 0;
        }

        setTier((t) => {
          const i = ORDEN.indexOf(t);
          if (bajoDesde && now - bajoDesde >= 2000 && i > 0) {
            bajoDesde = 0;
            return ORDEN[i - 1];
          }
          if (altoDesde && now - altoDesde >= 5000 && i < ORDEN.indexOf(capRef.current)) {
            altoDesde = 0;
            return ORDEN[i + 1];
          }
          return t;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const s = specs(tier);
  return { tier, cap: capRef.current, ...s, antialias: antialiasRef.current };
}
