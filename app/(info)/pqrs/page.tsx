import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { Icon } from "@/components/icons";
import { InfoHeader } from "@/components/info/Prose";
import { PqrsForm } from "@/components/info/PqrsForm";

export const metadata: Metadata = {
  title: "PQRS y contacto · Vuela Fácil Travel",
  description:
    "Peticiones, quejas, reclamos y sugerencias. Escríbenos y te respondemos en los plazos de ley.",
};

export default function PqrsPage() {
  return (
    <article>
      <InfoHeader
        eyebrow="Contacto"
        title="PQRS y contacto"
        intro="Tu opinión nos hace mejores. Radica aquí tu petición, queja, reclamo o sugerencia y te respondemos en los términos de ley."
      />

      <div className="grid md:grid-cols-[1fr_280px] gap-6 items-start">
        <PqrsForm />

        <aside className="rounded-2xl bg-navy text-ivory p-5 space-y-4">
          <h2 className="font-serif text-[20px]">Canales de atención</h2>
          <div className="space-y-3 text-[14px]">
            <div className="flex items-start gap-2.5">
              <Icon.Whatsapp className="w-4 h-4 text-[#25D366] mt-0.5 shrink-0" />
              <span>{NEGOCIO.telefonoDisplay}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Icon.Pin className="w-4 h-4 text-coral mt-0.5 shrink-0" />
              <span>{NEGOCIO.direccion}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Icon.Clock className="w-4 h-4 text-amber mt-0.5 shrink-0" />
              <span>{NEGOCIO.horario}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-amber mt-0.5 shrink-0">@</span>
              <a href={`mailto:${NEGOCIO.email}`} className="hover:underline break-all">
                {NEGOCIO.email}
              </a>
            </div>
          </div>
          <p className="text-ivory/60 text-[12px] leading-relaxed pt-2 border-t border-white/10">
            Si no quedas conforme, puedes acudir a la Superintendencia de Industria y Comercio (SIC).
          </p>
        </aside>
      </div>
    </article>
  );
}
