import type { Metadata } from "next";
import { FINANCIACION, NEGOCIO } from "@/lib/data";
import { waLink } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { InfoHeader } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Financiación y formas de pago · Vuela Fácil Travel",
  description: `Viaja ahora y paga después: hasta ${FINANCIACION.cuotas} cuotas sin interés y separa tu viaje con el ${FINANCIACION.abonoPct}%. PSE, tarjetas y Nequi.`,
};

const OPCIONES = [
  {
    icon: Icon.Wallet,
    titulo: `${FINANCIACION.cuotas} cuotas sin interés`,
    desc: "Difiere tu viaje con tu tarjeta de crédito y paga cómodo, sin intereses adicionales.",
  },
  {
    icon: Icon.Calendar,
    titulo: `Separa con el ${FINANCIACION.abonoPct}%`,
    desc: `Asegura tu cupo abonando solo el ${FINANCIACION.abonoPct}% y paga el saldo antes de viajar.`,
  },
];

const PASOS = [
  "Elige tu plan y escríbenos por WhatsApp.",
  "Te confirmamos precio final y opciones de pago.",
  "Separas tu cupo o pagas en cuotas, como prefieras.",
  "¡Listo! Te acompañamos hasta el regreso.",
];

export default function FinanciacionPage() {
  return (
    <article>
      <InfoHeader
        eyebrow="Financiación"
        title="Viaja ahora, paga después"
        intro="Tu próximo viaje no tiene que esperar. Te damos varias formas de pagarlo a tu ritmo, sin letra menuda."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {OPCIONES.map((o) => (
          <div key={o.titulo} className="rounded-2xl bg-white border border-navy/8 p-5">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral/15 to-amber/10 text-coral flex items-center justify-center">
              <o.icon className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-navy text-[19px] mt-3 leading-tight">{o.titulo}</h2>
            <p className="text-navy/65 text-[14px] mt-1.5 leading-relaxed">{o.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-navy/8 p-5 md:p-6">
        <div className="text-[11px] tracking-[0.2em] uppercase text-navy/50 font-semibold mb-3">
          Medios de pago
        </div>
        <div className="flex flex-wrap gap-2">
          {["VISA", "Mastercard", "AmEx", ...FINANCIACION.medios, ...FINANCIACION.bnpl].map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 rounded-lg bg-navy/5 border border-navy/10 text-navy/70 text-[12px] font-semibold"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <h2 className="font-serif text-navy text-[24px] mt-12 mb-4">Cómo funciona</h2>
      <ol className="space-y-3">
        {PASOS.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-coral text-white text-[13px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="text-navy/75 text-[15px] pt-0.5">{p}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl bg-navy p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-ivory text-[22px] leading-tight">Cotiza y elige cómo pagar</h2>
          <p className="text-ivory/75 text-[14px] mt-1">Sin compromiso. Te respondemos en {NEGOCIO.tiempoRespuesta}.</p>
        </div>
        <a
          href={waLink("Hola Vuela Fácil, quiero saber las opciones de financiación para un viaje 💳")}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="financiacion"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors shrink-0"
        >
          <Icon.Whatsapp className="w-5 h-5" /> Hablar con un asesor
        </a>
      </div>
    </article>
  );
}
