"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { useUI } from "@/lib/ui-context";
import { waLink } from "@/lib/utils";
import { ABRIR_ASISTENTE } from "./AIAssistant";

/**
 * Barra inferior sticky SOLO en móvil. Refleja la unificación: la IA (Lía) es la
 * acción principal y el contacto con un asesor por WhatsApp está siempre al lado.
 * Aparece tras un pequeño scroll y se oculta con el modal de paquete abierto.
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

  const abrirLia = () => window.dispatchEvent(new Event(ABRIR_ASISTENTE));

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-navy/10 shadow-[0_-8px_30px_-12px_rgba(13,44,84,0.35)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5">
        <button
          onClick={abrirLia}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-coral to-amber text-white font-semibold tracking-wide shadow-[0_12px_24px_-8px_rgba(232,99,26,0.55)] active:scale-[0.99] transition-transform"
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-serif text-[13px]">
            L
          </span>
          Pregúntale a Lía
        </button>
        <a
          href={waLink("Hola Vuela Fácil 👋 Quiero hablar con un asesor.")}
          target="_blank"
          rel="noreferrer"
          data-wa="sticky-asesor"
          aria-label="Hablar con un asesor por WhatsApp"
          className="shrink-0 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(37,211,102,0.55)] active:scale-95 transition-transform"
        >
          <Icon.Whatsapp className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
