"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { useUI } from "@/lib/ui-context";
import { waLink } from "@/lib/utils";

/**
 * Barra inferior sticky SOLO en móvil con la CTA principal a WhatsApp.
 * Complementa al botón flotante: garantiza que la acción de cotizar esté
 * siempre visible mientras el usuario recorre la página en el celular.
 * Aparece tras un pequeño scroll para no tapar el hero de entrada y se oculta
 * cuando el modal de paquete está abierto (ese tiene su propia CTA contextual).
 */
export function StickyWhatsApp() {
  const { activePackageId } = useUI();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 320);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (activePackageId) return null;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-navy/10 shadow-[0_-8px_30px_-12px_rgba(13,44,84,0.35)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={waLink("Hola Vuela Fácil 👋 Quiero cotizar un viaje. ¿Me ayudan?")}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold tracking-wide shadow-[0_12px_24px_-8px_rgba(37,211,102,0.55)] active:scale-[0.99] transition-transform"
        >
          <Icon.Whatsapp className="w-5 h-5" />
          Cotiza gratis por WhatsApp
        </a>
      </div>
    </div>
  );
}
