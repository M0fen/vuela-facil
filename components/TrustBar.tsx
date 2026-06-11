import { Icon } from "./icons";
import { NEGOCIO, MEDIOS_PAGO } from "@/lib/data";

/**
 * Barra de confianza discreta, justo debajo del hero. Reúne señales reales
 * (RNT, trayectoria, volumen de viajeros, tiempo de respuesta y medios de pago)
 * integradas al diseño, no pegadas como adorno. Presentacional → server component.
 */
const ITEMS = [
  { icon: Icon.Shield, label: NEGOCIO.rnt, sub: "Operador autorizado" },
  { icon: Icon.Award, label: `${NEGOCIO.anios} años`, sub: "de experiencia" },
  { icon: Icon.Users, label: `${NEGOCIO.viajeros} viajeros`, sub: "felices" },
  { icon: Icon.Clock, label: `Respuesta ${NEGOCIO.tiempoRespuesta}`, sub: "por WhatsApp" },
];

export function TrustBar() {
  return (
    <section aria-label="Garantías y confianza" className="bg-white border-b border-navy/8">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-4 md:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 lg:flex lg:items-center lg:gap-8">
            {ITEMS.map(({ icon: I, label, sub }) => (
              <li key={label} className="flex items-center gap-2.5">
                <span className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-coral/15 to-amber/10 text-coral flex items-center justify-center">
                  <I className="w-[18px] h-[18px]" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[13px] font-semibold text-navy">{label}</span>
                  <span className="block text-[11px] text-navy/65">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 lg:shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-navy/55 font-semibold mr-1">
              Pagos
            </span>
            {MEDIOS_PAGO.map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 rounded-full bg-navy/5 border border-navy/10 text-[11px] text-navy/60"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
