"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { AsistenteOperador } from "./AsistenteOperador";

/**
 * Lanzador flotante de la Lía del operador, SIEMPRE visible en el panel.
 * Montado en el layout del panel para que el operador la tenga a mano en
 * cualquier sección. Es la única Lía del panel (la de clientes no se muestra aquí).
 */
export function AsistenteOperadorFlotante() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed z-[60] bottom-24 right-3 md:right-6 w-[min(94vw,380px)] animate-[fadeIn_0.15s_ease-out]">
          <AsistenteOperador />
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar a Lía" : "Abrir a Lía, tu apoyo del panel"}
        aria-expanded={open}
        className="fixed z-[60] bottom-5 right-3 md:right-6 inline-flex items-center gap-2.5 pl-3 pr-4 py-3 rounded-full bg-gradient-to-r from-coral to-amber text-white shadow-[0_16px_40px_-12px_rgba(232,99,26,0.7)] hover:brightness-105 active:scale-95 transition-transform"
      >
        {open ? (
          <>
            <Icon.Close className="w-4 h-4" />
            <span className="text-[13px] font-semibold">Cerrar</span>
          </>
        ) : (
          <>
            <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center font-serif text-[15px]">
              L
            </span>
            <span className="text-[13px] font-semibold">Pregúntale a Lía</span>
          </>
        )}
      </button>
    </>
  );
}
