"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { enlaceReferido } from "@/lib/referido";

/**
 * Generador del enlace de referido: el usuario pone su nombre y obtiene un
 * enlace y un mensaje listos para compartir por WhatsApp. La atribución viaja
 * en el enlace (?ref=) — sin cuentas ni registro.
 */
export function ReferidoGenerador() {
  const [nombre, setNombre] = useState("");
  const [copiado, setCopiado] = useState(false);

  const limpio = nombre.replace(/\s+/g, " ").trim();
  const listo = limpio.length >= 2;
  const enlace = listo ? enlaceReferido(limpio) : "";
  const mensaje = listo
    ? `Te recomiendo Vuela Fácil Travel ✈️ Es la agencia con la que viajo. Diles que vas de parte de ${limpio} y reclama tu descuento de bienvenida. Mira los viajes aquí: ${enlace}`
    : "";

  const compartir = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* el navegador puede bloquear el portapapeles: ignorar */
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-navy/8 p-5 md:p-6">
      <label className="block">
        <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Tu nombre</span>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={40}
          placeholder="Ej: Carolina"
          className="w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy text-[15px] outline-none transition-all focus:border-coral focus:ring-2 focus:ring-coral/15 placeholder:text-navy/30"
        />
      </label>

      {listo && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-ivory border border-navy/10">
            <Icon.Globe className="w-4 h-4 text-navy/45 shrink-0" />
            <span className="text-navy/70 text-[13px] truncate flex-1">{enlace}</span>
            <button
              onClick={copiar}
              className="text-coral text-[12px] font-semibold hover:underline shrink-0"
            >
              {copiado ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
          <a
            href={compartir}
            target="_blank"
            rel="noreferrer"
            data-wa="referido-compartir"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
          >
            <Icon.Whatsapp className="w-5 h-5" /> Compartir por WhatsApp
          </a>
        </div>
      )}

      {!listo && (
        <p className="text-navy/45 text-[12px] mt-3">
          Escribe tu nombre para generar tu enlace y mensaje listos para compartir.
        </p>
      )}
    </div>
  );
}
