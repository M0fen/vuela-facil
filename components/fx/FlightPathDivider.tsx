"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";

/**
 * Divisor "ruta de vuelo": una línea punteada con dos puntos (origen/destino) y
 * un avión que la recorre cuando entra en pantalla. Minimalista y de marca
 * (la misma metáfora de los arcos del globo). Respeta prefers-reduced-motion.
 */
export function FlightPathDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-drawn");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-drawing");
          obs.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`vf-route relative mx-auto w-full max-w-[1100px] px-5 md:px-8 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 60" className="block w-full h-10 overflow-visible">
        {/* Ruta punteada */}
        <path
          d="M 40 44 Q 600 0 1160 18"
          fill="none"
          stroke="#e8631a"
          strokeWidth="2"
          strokeOpacity="0.35"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        {/* Punto de origen */}
        <circle cx="40" cy="44" r="5" fill="#0d2c54" />
        <circle cx="40" cy="44" r="9" fill="none" stroke="#0d2c54" strokeOpacity="0.25" strokeWidth="2" />
        {/* Punto de destino */}
        <circle cx="1160" cy="18" r="5" fill="#e8631a" />
      </svg>
      {/* Avión que recorre la ruta */}
      <span className="vf-plane absolute text-coral">
        <Icon.Plane className="w-5 h-5 rotate-[28deg]" />
      </span>
    </div>
  );
}
