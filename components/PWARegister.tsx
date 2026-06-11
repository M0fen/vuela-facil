"use client";

import { useEffect } from "react";

/**
 * Registra el service worker (solo en producción y si el navegador lo soporta).
 * Mantiene el sitio instalable y con fallback offline, sin afectar el desarrollo.
 */
export function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falla silenciosa: el sitio funciona igual sin SW.
      });
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
