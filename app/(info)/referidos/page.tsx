import type { Metadata } from "next";
import { REFERIDOS, CLUB, NEGOCIO } from "@/lib/data";
import { waLink } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { InfoHeader } from "@/components/info/Prose";
import { ReferidoGenerador } from "@/components/info/ReferidoGenerador";

export const metadata: Metadata = {
  title: "Refiere y gana · Club Vuela Fácil",
  description:
    "Invita a tus amigos a viajar con Vuela Fácil: ellos reciben un descuento de bienvenida y tú un bono para tu próximo viaje. Sin apps ni puntos: tu asesor te reconoce.",
  alternates: { canonical: "/referidos" },
};

export default function ReferidosPage() {
  return (
    <article>
      <InfoHeader
        eyebrow="Refiere y gana"
        title="Trae a un amigo. Ganan los dos."
        intro={`Tu amigo recibe ${REFERIDOS.beneficioAmigo} y tú ${REFERIDOS.beneficioReferente}. Sin formularios eternos ni apps: todo por WhatsApp.`}
      />

      {/* Generador de enlace */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="font-serif text-navy text-[24px] mb-3">Comparte en 10 segundos</h2>
          <p className="text-navy/70 text-[15px] leading-relaxed">
            Genera tu enlace personal y compártelo por WhatsApp. Cuando tu amigo nos escriba
            mencionando tu nombre, activamos su beneficio de bienvenida.
          </p>
        </div>
        <ReferidoGenerador />
      </div>

      {/* Cómo funciona */}
      <h2 className="font-serif text-navy text-[24px] mt-12 mb-4">Cómo funciona</h2>
      <ol className="space-y-3">
        {REFERIDOS.pasos.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-coral text-white text-[13px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="text-navy/75 text-[15px] pt-0.5">{p}</span>
          </li>
        ))}
      </ol>

      {/* Club Vuela Fácil (fidelización) */}
      <section className="mt-14">
        <div className="inline-flex items-center gap-3 text-coral text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
          <span className="w-8 h-px bg-coral" />
          Fidelización
        </div>
        <h2 className="font-serif text-navy text-[26px] md:text-[30px] leading-tight">{CLUB.nombre}</h2>
        <p className="text-navy/65 mt-3 max-w-2xl text-[15px] leading-relaxed">{CLUB.intro}</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {CLUB.beneficios.map((b) => (
            <div key={b.titulo} className="rounded-2xl bg-white border border-navy/8 p-5 flex gap-3">
              <span className="w-9 h-9 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                <Icon.Check className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-navy text-[15px]">{b.titulo}</h3>
                <p className="text-navy/60 text-[13px] mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-navy p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-ivory text-[22px] leading-tight">¿Quién será tu primer referido?</h2>
          <p className="text-ivory/75 text-[14px] mt-1">
            Escríbenos y te contamos los beneficios vigentes. Respuesta en {NEGOCIO.tiempoRespuesta}.
          </p>
        </div>
        <a
          href={waLink("Hola Vuela Fácil 👋 Quiero referir a alguien y conocer los beneficios del programa.")}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="referidos"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors shrink-0"
        >
          <Icon.Whatsapp className="w-5 h-5" /> Hablar con un asesor
        </a>
      </div>
    </article>
  );
}
