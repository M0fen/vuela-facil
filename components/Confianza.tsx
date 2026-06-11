"use client";

import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { NEGOCIO, MEDIOS_PAGO } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

// Diferenciadores (NO repetimos las cifras de la TrustBar: aquí va el "por qué").
const VALORES = [
  {
    icon: Icon.Shield,
    titulo: "Operador autorizado",
    desc: "Registro Nacional de Turismo vigente. Viajas con respaldo legal, no con un improvisado.",
  },
  {
    icon: Icon.Users,
    titulo: "Asesoría humana real",
    desc: "Una persona que te conoce y responde — no un bot — antes, durante y después del viaje.",
  },
  {
    icon: Icon.Wallet,
    titulo: "Precios sin sorpresas",
    desc: "Lo que cotizamos es lo que pagas: impuestos y tasas incluidos, sin cargos de última hora.",
  },
  {
    icon: Icon.Clock,
    titulo: "Acompañamiento 24/7",
    desc: `Te respondemos en ${NEGOCIO.tiempoRespuesta} por WhatsApp y te cubrimos si algo cambia en ruta.`,
  },
];

// Marcas con las que se reserva habitualmente (aerolíneas, cruceros, cadenas y
// asistencia). No implica alianza comercial formal.
const MARCAS = [
  "Avianca",
  "LATAM",
  "Wingo",
  "Royal Caribbean",
  "Decameron",
  "Iberostar",
  "AssistCard",
];

export function Confianza() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="nosotros" ref={ref} className="reveal py-14 md:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <SectionEyebrow>Por qué Vuela Fácil</SectionEyebrow>
          <h2 className="font-serif text-navy text-[34px] md:text-[48px] leading-[1.05] tracking-[-0.02em] mt-3">
            Una agencia para <em className="italic text-coral">confiar de por vida</em>.
          </h2>
          <p className="text-navy/65 mt-4 text-[15px] md:text-[16px] leading-relaxed">
            No vendemos tiquetes sueltos: diseñamos la experiencia completa y respondemos por ella.
            Esto es lo que nos hace diferentes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {VALORES.map(({ icon: I, titulo, desc }) => (
            <div
              key={titulo}
              className="p-5 md:p-7 rounded-3xl bg-ivory border border-navy/8 hover:border-coral/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral/15 to-amber/10 flex items-center justify-center mb-5 text-coral">
                <I className="w-6 h-6" />
              </div>
              <div className="font-serif text-navy text-[20px] md:text-[22px] leading-tight">{titulo}</div>
              <div className="text-navy/65 text-[13px] md:text-[14px] mt-2 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-navy/8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-navy/55 font-semibold mb-1">
                Aerolíneas y cadenas
              </div>
              <div className="font-serif text-navy text-[22px] md:text-[26px]">
                Reservamos con las marcas que ya conoces
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3 items-center">
              {MARCAS.map((a) => (
                <div
                  key={a}
                  className="text-navy/55 font-serif italic text-[16px] md:text-[20px] tracking-wide hover:text-navy/80 transition-colors"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2 md:gap-3 text-[12px] text-navy/65">
            <span className="font-semibold text-navy/80">Métodos de pago:</span>
            {MEDIOS_PAGO.map((p) => (
              <span key={p} className="px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
