"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { waLink } from "@/lib/utils";
import { estaAbierto } from "@/lib/horario";

export function FloatingWA() {
  // `null` durante el SSR para evitar desajustes de hidratación; el estado real
  // se calcula en el cliente con la hora de Colombia.
  const [abierto, setAbierto] = useState<boolean | null>(null);

  useEffect(() => {
    const actualizar = () => setAbierto(estaAbierto());
    actualizar();
    // Re-evalúa cada minuto por si cruza el horario de apertura/cierre.
    const id = setInterval(actualizar, 60_000);
    return () => clearInterval(id);
  }, []);

  const msg =
    abierto === false
      ? "Hola Vuela Fácil 👋 Vi que están fuera de horario. ¿Me ayudan apenas puedan?"
      : "Hola Vuela Fácil 👋 quiero hablar con un asesor.";

  return (
    <a
      href={waLink(msg)}
      target="_blank"
      rel="noreferrer"
      aria-label={
        abierto === false
          ? "Escribir por WhatsApp (fuera de horario)"
          : "Escribir por WhatsApp (en línea)"
      }
      className="fixed bottom-24 right-5 md:bottom-6 md:right-6 z-50 group"
    >
      {abierto && <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />}
      <span className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(37,211,102,0.6)] hover:scale-105 transition-transform">
        <Icon.Whatsapp className="w-7 h-7" />
        {/* Punto de estado: verde = en línea, ámbar = fuera de horario. */}
        {abierto !== null && (
          <span
            className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              abierto ? "bg-emerald" : "bg-amber"
            }`}
          />
        )}
      </span>
      {/* Etiqueta emergente en desktop. */}
      {abierto !== null && (
        <span className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-white text-navy text-[12px] font-semibold shadow-[0_10px_24px_-10px_rgba(13,44,84,0.4)] opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none">
          {abierto ? "En línea · te respondemos ya" : "Fuera de horario · escríbenos igual"}
        </span>
      )}
    </a>
  );
}
