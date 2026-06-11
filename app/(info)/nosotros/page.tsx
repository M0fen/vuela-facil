import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { waLink } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { InfoHeader, Prose } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Nosotros · Vuela Fácil Travel",
  description:
    "Agencia de viajes en Pereira con asesoría humana. Conoce quiénes somos, nuestro RNT y cómo diseñamos cada viaje a la medida.",
};

const STATS = [
  { n: `${NEGOCIO.anios} años`, l: "acompañando viajeros" },
  { n: NEGOCIO.viajeros, l: "viajeros felices" },
  { n: NEGOCIO.tiempoRespuesta, l: "tiempo de respuesta" },
  { n: "24/7", l: "asistencia en viaje" },
];

export default function NosotrosPage() {
  return (
    <article>
      <InfoHeader
        eyebrow="Quiénes somos"
        title="Hacemos que viajar sea fácil"
        intro={`Somos una agencia de viajes en ${NEGOCIO.ciudad.split("—")[0].trim()}. Diseñamos experiencias por Colombia y el mundo con asesoría humana real y reserva por WhatsApp: sin call centers eternos ni letra menuda.`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {STATS.map((s) => (
          <div key={s.l} className="rounded-2xl bg-white border border-navy/8 p-4 text-center">
            <div className="font-serif text-navy text-[24px] leading-none">{s.n}</div>
            <div className="text-navy/55 text-[12px] mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <Prose>
        <h2>Nuestra historia</h2>
        <p>
          Nacimos en el corazón del Eje Cafetero con una idea simple: que planear un viaje no
          tenga que ser complicado ni impersonal. Conocemos los destinos que vendemos, viajamos a
          ellos y armamos cada plan pensando en personas reales —familias, parejas y amigos— no en
          un carrito de compras anónimo.
        </p>

        <h2 id="equipo">Asesoría humana, de verdad</h2>
        <p>
          Detrás de cada cotización hay un asesor que te responde por WhatsApp, te recomienda según
          tu presupuesto y te acompaña antes, durante y después del viaje. Trabajamos con aliados de
          confianza y aseguramos tu experiencia con asistencia médica internacional y atención 24/7.
        </p>

        <h2>Confianza y legalidad</h2>
        <p>
          Operamos formalmente como prestadores de servicios turísticos en Colombia.
        </p>
        <ul>
          <li>
            <strong>{NEGOCIO.razonSocial}</strong> · NIT {NEGOCIO.nit}
          </li>
          <li>
            <strong>{NEGOCIO.rnt}</strong> — Registro Nacional de Turismo (MinCIT)
          </li>
          {NEGOCIO.anato && <li>{NEGOCIO.anato}</li>}
          <li>{NEGOCIO.direccion}</li>
          <li>{NEGOCIO.horario}</li>
        </ul>
      </Prose>

      <div className="mt-10 rounded-2xl bg-navy p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-ivory text-[22px] leading-tight">¿Listo para tu próximo viaje?</h2>
          <p className="text-ivory/75 text-[14px] mt-1">Te cotizamos sin compromiso por WhatsApp.</p>
        </div>
        <a
          href={waLink("Hola Vuela Fácil, quiero que me asesoren para un viaje ✈️")}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="nosotros"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors shrink-0"
        >
          <Icon.Whatsapp className="w-5 h-5" /> Hablar con un asesor
        </a>
      </div>
    </article>
  );
}
