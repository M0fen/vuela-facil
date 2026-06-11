"use client";

import { useState } from "react";
import { waLink } from "@/lib/utils";
import { Icon } from "@/components/icons";

const TIPOS = ["Petición", "Queja", "Reclamo", "Sugerencia", "Felicitación"];

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-navy/15 outline-none focus:border-coral focus:ring-2 focus:ring-coral/15 text-navy text-[14px] placeholder:text-navy/40";

export function PqrsForm() {
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const valido = nombre.trim().length > 1 && mensaje.trim().length > 4;

  const enviar = () => {
    if (!valido) return;
    const msg = `*PQRS · ${tipo}*
Nombre: ${nombre.trim()}
Contacto: ${contacto.trim() || "—"}

${mensaje.trim()}`;
    window.open(waLink(msg), "_blank", "noopener");
  };

  return (
    <div className="rounded-2xl bg-white border border-navy/8 p-5 md:p-6">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Tipo de solicitud</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputCls}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Tu nombre</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputCls} placeholder="Nombre y apellido" />
        </label>
      </div>
      <label className="block mt-3">
        <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Correo o teléfono</span>
        <input value={contacto} onChange={(e) => setContacto(e.target.value)} className={inputCls} placeholder="Para responderte" />
      </label>
      <label className="block mt-3">
        <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Cuéntanos</span>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          className={`${inputCls} resize-y`}
          placeholder="Describe tu petición, queja, reclamo o sugerencia."
        />
      </label>
      <button
        onClick={enviar}
        disabled={!valido}
        className="mt-4 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon.Whatsapp className="w-5 h-5" /> Enviar por WhatsApp
      </button>
    </div>
  );
}
