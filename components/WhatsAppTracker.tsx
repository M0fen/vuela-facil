"use client";

import { useEffect } from "react";

/**
 * Mide la conversión real del negocio: cada clic a un enlace de WhatsApp.
 * Usa un listener global y envía el evento con sendBeacon (no bloquea la
 * apertura de WhatsApp). La "ubicación" es la ruta actual, o un data-wa si el
 * enlace lo define para más detalle.
 */
export function WhatsAppTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!a) return;
      const ubicacion = a.getAttribute("data-wa") || window.location.pathname;
      try {
        const body = JSON.stringify({ evento: "whatsapp", ubicacion });
        navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }));
      } catch {
        // sin telemetría si algo falla; nunca rompemos la navegación
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
