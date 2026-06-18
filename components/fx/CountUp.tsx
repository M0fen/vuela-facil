"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Conteo animado de una cifra al entrar en pantalla. Recibe el texto tal cual
 * (ej: "+18.500", "12 años", "100%"): conserva prefijo/sufijo y formatea los
 * miles con punto. Respeta prefers-reduced-motion (muestra el valor final).
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [texto, setTexto] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Separa prefijo (símbolos), número y sufijo del texto recibido.
    const m = value.match(/^(\D*?)([\d.,]+)(.*)$/s);
    if (!m) {
      setTexto(value);
      return;
    }
    const prefijo = m[1];
    const objetivo = Number(m[2].replace(/[.,]/g, ""));
    const sufijo = m[3];
    if (!Number.isFinite(objetivo) || objetivo <= 0) {
      setTexto(value);
      return;
    }

    const fmt = (n: number) => `${prefijo}${Math.round(n).toLocaleString("es-CO")}${sufijo}`;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTexto(fmt(objetivo));
      return;
    }

    setTexto(fmt(0));
    let raf = 0;
    let inicio = 0;
    const dur = 1400;
    const animar = (t: number) => {
      if (!inicio) inicio = t;
      const p = Math.min(1, (t - inicio) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setTexto(fmt(objetivo * eased));
      if (p < 1) raf = requestAnimationFrame(animar);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          raf = requestAnimationFrame(animar);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {texto}
    </span>
  );
}
