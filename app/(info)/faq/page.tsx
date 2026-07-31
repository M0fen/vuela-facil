import type { Metadata } from "next";
import { FINANCIACION, NEGOCIO } from "@/lib/data";
import { waLink } from "@/lib/utils";
import { InfoHeader } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Preguntas frecuentes · Vuela Fácil Travel",
  description:
    "Resolvemos tus dudas sobre reservas, pagos, financiación, equipaje, cancelaciones y asistencia en viaje.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cómo reservo un viaje?",
    a: "Eliges tu plan en el sitio y nos escribes por WhatsApp con un clic. Un asesor confirma disponibilidad, fechas y precio final, y te guía en el pago. Sin formularios eternos ni call centers.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: `Aceptamos ${FINANCIACION.medios.join(", ")}${
      FINANCIACION.bnpl.length > 0 ? ` y financiación con ${FINANCIACION.bnpl.join(" y ")}` : ""
    }. Puedes diferir a ${FINANCIACION.cuotas} cuotas sin interés o separar tu viaje abonando el ${FINANCIACION.abonoPct}%.`,
  },
  {
    q: "¿Puedo pagar a cuotas o financiar mi viaje?",
    a: `Sí. Ofrecemos hasta ${FINANCIACION.cuotas} cuotas sin interés${
      FINANCIACION.bnpl.length > 0 ? ` y financiación con ${FINANCIACION.bnpl.join(" y ")}` : ""
    } para que viajes ahora y pagues después. Consulta los detalles en la página de Financiación.`,
  },
  {
    q: "¿El precio incluye todo?",
    a: "Cada plan detalla qué incluye y qué no. En general cubrimos alojamiento, traslados y los servicios indicados; los gastos personales, tours opcionales y propinas no están incluidos salvo que se especifique.",
  },
  {
    q: "¿Qué pasa si necesito cancelar o cambiar fechas?",
    a: "Depende de las condiciones de cada proveedor (aerolíneas, hoteles, cruceros). Te explicamos las políticas antes de pagar y gestionamos cambios o reembolsos según corresponda. Revisa nuestra Política de cancelación y reembolsos.",
  },
  {
    q: "¿Incluyen seguro de asistencia médica?",
    a: "Sí, incluimos o te ofrecemos asistencia médica internacional según el destino, además de atención por WhatsApp 24/7 durante tu viaje.",
  },
  {
    q: "¿Necesito visa o requisitos especiales?",
    a: "Para destinos internacionales te informamos los requisitos (pasaporte vigente, visas, vacunas, formularios migratorios) según tu nacionalidad y te ayudamos a prepararlos.",
  },
  {
    q: "¿Atienden fuera de Pereira?",
    a: "Sí. Aunque estamos en Pereira, atendemos a viajeros de todo el país de forma 100% remota por WhatsApp, y diseñamos salidas desde distintas ciudades.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InfoHeader
        eyebrow="Ayuda"
        title="Preguntas frecuentes"
        intro="Lo que más nos preguntan. Si no encuentras tu respuesta, escríbenos por WhatsApp y te ayudamos al instante."
      />

      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl bg-white border border-navy/8 p-5 open:border-coral/30 transition-colors"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-serif text-navy text-[18px]">
              {f.q}
              <span className="text-coral text-2xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="text-navy/70 text-[15px] leading-relaxed mt-3">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="text-navy/60 text-[14px] mt-8">
        ¿Otra duda?{" "}
        <a
          href={waLink("Hola Vuela Fácil, tengo una pregunta 👋")}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="faq"
          className="text-coral font-semibold hover:underline"
        >
          Escríbenos por WhatsApp
        </a>{" "}
        o llámanos al {NEGOCIO.telefonoDisplay}.
      </p>
    </article>
  );
}
