"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Icon } from "./icons";
import { IMG } from "@/lib/data";
import { submitLead, type LeadState } from "@/app/lead-actions";
import { useReferido } from "@/lib/referido";

export function CapturaContacto() {
  const [state, formAction, pending] = useActionState<LeadState, FormData>(submitLead, {
    ok: false,
  });
  const sent = state.ok;
  const referido = useReferido();

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
          <div className="mt-6 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/90 text-[13px]">
              <Icon.Sparkle className="w-4 h-4 text-amber" />
              De regalo: nuestra{" "}
              <a href="/guias" className="underline font-semibold hover:text-amber">
                guía del Eje Cafetero
              </a>
            </div>
            <a
              href="/referidos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-white text-[13px] font-semibold hover:bg-[#25D366]/25 transition-colors"
            >
              <Icon.Whatsapp className="w-4 h-4 text-[#25D366]" />
              Refiere y ganan los dos
            </a>
          </div>
        </div>
        <div className="md:col-span-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]">
            {!sent ? (
              <>
                <div className="font-serif text-navy text-[22px] mb-1">Únete en 30 segundos</div>
                <div className="text-navy/55 text-[13px] mb-6">
                  Te avisamos antes de que se agoten los cupos.
                </div>
                <form action={formAction} className="space-y-3">
                  <input type="hidden" name="referidoPor" value={referido?.nombre ?? ""} />
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-navy/15 focus-within:border-coral transition-colors">
                    <Icon.Compass className="w-5 h-5 text-navy/50" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="tu@correo.com"
                      className="flex-1 bg-transparent outline-none text-navy placeholder:text-navy/40 text-[14px]"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-navy/15 focus-within:border-coral transition-colors">
                    <Icon.Whatsapp className="w-5 h-5 text-[#25D366]" />
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="WhatsApp (opcional)"
                      className="flex-1 bg-transparent outline-none text-navy placeholder:text-navy/40 text-[14px]"
                    />
                  </div>
                  {state.error && (
                    <p className="text-[12px] text-coral text-center">{state.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-coral to-amber text-white font-semibold tracking-wide hover:shadow-[0_20px_40px_-10px_rgba(232,99,26,0.6)] transition-shadow disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
                  >
                    {pending ? "Enviando…" : "Quiero las ofertas exclusivas"}
                  </button>
                  <p className="text-[11px] text-navy/55 text-center">
                    Al continuar aceptas nuestra{" "}
                    <a href="/privacidad" className="underline hover:text-coral">
                      política de tratamiento de datos
                    </a>
                    .
                  </p>
                </form>
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
                <a
                  href="/guias"
                  className="inline-flex items-center gap-1.5 mt-4 text-coral font-semibold text-[13px] hover:gap-2.5 transition-all"
                >
                  Mientras tanto, lee tu guía de regalo <Icon.Arrow className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
