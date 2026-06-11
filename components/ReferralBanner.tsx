"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { waLink } from "@/lib/utils";
import { useReferido } from "@/lib/referido";

const DISMISS_KEY = "vf:ref:cerrado";

/**
 * Aviso discreto para quien llega con un enlace de referido (?ref=). Lo saluda
 * por el nombre de quien lo refirió y ofrece reclamar su beneficio por WhatsApp.
 * Se oculta al cerrarlo (por sesión) y nunca aparece en el panel admin.
 */
export function ReferralBanner() {
  const ref = useReferido();
  const pathname = usePathname();
  const [cerrado, setCerrado] = useState(true);

  useEffect(() => {
    try {
      setCerrado(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setCerrado(false);
    }
  }, []);

  if (!ref || cerrado || pathname?.startsWith("/admin")) return null;

  const cerrar = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignorar */
    }
    setCerrado(true);
  };

  const msg = `Hola Vuela Fácil 👋 Vengo recomendado por ${ref.nombre}. Quiero reclamar mi beneficio de bienvenida ✈️`;

  return (
    <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-navy/10 shadow-[0_18px_40px_-18px_rgba(13,44,84,0.45)]">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral/15 to-amber/10 text-coral flex items-center justify-center shrink-0">
          <Icon.Sparkle className="w-4 h-4" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-navy text-[13px] font-semibold leading-tight">
            Vienes recomendado por {ref.nombre}
          </div>
          <div className="text-navy/55 text-[12px] leading-tight">Tienes un beneficio de bienvenida.</div>
        </div>
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noreferrer"
          data-wa="referido-banner"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] text-white text-[12px] font-semibold hover:bg-[#1ebe57] transition-colors shrink-0"
        >
          <Icon.Whatsapp className="w-4 h-4" /> Reclamar
        </a>
        <button
          onClick={cerrar}
          aria-label="Cerrar"
          className="text-navy/40 hover:text-navy transition-colors shrink-0"
        >
          <Icon.Close className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
