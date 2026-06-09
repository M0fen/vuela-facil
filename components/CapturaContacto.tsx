"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "./icons";
import { IMG } from "@/lib/data";

export function CapturaContacto() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    // TODO: conectar a un Server Action / API que guarde el lead
    // (Supabase, Resend, etc.). Por ahora solo confirma en el cliente.
    if (!email) return;
    setSent(true);
  };

  return (
    <section id="contacto" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={IMG.capt} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/70" />
      </div>
      <div className="relative max-w-[1320px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6 text-white">
          <div className="inline-flex items-center gap-2 text-amber text-[11px] tracking-[0.3em] uppercase font-semibold mb-4">
            <Icon.Sparkle className="w-3.5 h-3.5" />
            Tribu Vuela Fácil
          </div>
          <h2 className="font-serif text-[34px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">
            Recibe ofertas que <em className="italic text-amber">no publicamos</em> en ningún otro
            lado.
          </h2>
          <p className="text-white/75 mt-5 max-w-md">
            Promos relámpago, salidas grupales y descuentos por temporada. Sin spam — máximo un
            correo o WhatsApp por semana.
          </p>
        </div>
        <div className="md:col-span-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]">
            {!sent ? (
              <>
                <div className="font-serif text-navy text-[22px] mb-1">Únete en 30 segundos</div>
                <div className="text-navy/55 text-[13px] mb-6">
                  Te avisamos antes de que se agoten los cupos.
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-navy/15 focus-within:border-coral transition-colors">
                    <Icon.Compass className="w-5 h-5 text-navy/50" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="flex-1 bg-transparent outline-none text-navy placeholder:text-navy/40 text-[14px]"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-navy/15 focus-within:border-coral transition-colors">
                    <Icon.Whatsapp className="w-5 h-5 text-[#25D366]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp (opcional)"
                      className="flex-1 bg-transparent outline-none text-navy placeholder:text-navy/40 text-[14px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[#e8631a] to-[#f4a93c] text-white font-semibold tracking-wide hover:shadow-[0_20px_40px_-10px_rgba(232,99,26,0.6)] transition-shadow"
                  >
                    Quiero las ofertas exclusivas
                  </button>
                  <p className="text-[11px] text-navy/45 text-center">
                    Al continuar aceptas nuestra política de tratamiento de datos.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald/10 flex items-center justify-center mb-4">
                  <Icon.Check className="w-7 h-7 text-emerald" />
                </div>
                <div className="font-serif text-navy text-[24px]">¡Bienvenido a la tribu!</div>
                <div className="text-navy/60 text-[14px] mt-2">
                  Te escribiremos pronto con las próximas salidas 🌴
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
