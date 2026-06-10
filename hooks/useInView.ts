"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observa cuándo un elemento entra/sale del viewport.
 * - `entered`: pegajoso — se vuelve true al acercarse (rootMargin) y NO regresa.
 *   Sirve para montar el globo una sola vez, antes de que se vea (sin jank).
 * - `inView`: vivo — refleja la visibilidad actual, para pausar el render del
 *   globo cuando está fuera de pantalla.
 */
export function useInView<T extends Element = HTMLDivElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setInView(e.isIntersecting);
          if (e.isIntersecting) setEntered(true);
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, entered, inView };
}
