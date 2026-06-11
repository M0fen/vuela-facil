// NOTA: Plantilla base de política de cancelación y reembolsos. Ajustar con un
// abogado y según las condiciones reales de tus proveedores.
import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { waLink } from "@/lib/utils";
import { InfoHeader, Prose } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Cancelaciones y reembolsos · Vuela Fácil Travel",
  description: "Cómo funcionan los cambios, cancelaciones y reembolsos de tus reservas.",
};

export default function ReembolsosPage() {
  return (
    <article>
      <InfoHeader
        eyebrow="Ayuda"
        title="Cancelaciones y reembolsos"
        intro="Queremos que tengas total claridad. Estas son las reglas generales; las condiciones específicas de tu plan siempre se te informan antes de pagar."
      />

      <Prose>
        <h2>Condiciones de cada proveedor</h2>
        <p>
          La mayoría de servicios (vuelos, hoteles, cruceros, tours) tienen políticas propias de
          cambio y cancelación definidas por cada proveedor. Antes de confirmar tu pago te
          indicamos si la tarifa es reembolsable, las penalidades aplicables y los plazos.
        </p>

        <h2>Solicitudes de cambio o cancelación</h2>
        <ul>
          <li>Escríbenos lo antes posible por WhatsApp o al correo {NEGOCIO.email}.</li>
          <li>Gestionamos la solicitud ante los proveedores y te informamos costos o penalidades.</li>
          <li>Los reembolsos, cuando aplican, se realizan al mismo medio de pago y según los tiempos del proveedor y la pasarela.</li>
        </ul>

        <h2>Derecho de retracto y reversión del pago</h2>
        <p>
          Cuando la ley colombiana lo contemple (Estatuto del Consumidor, Ley 1480 de 2011 y normas
          de comercio electrónico), podrás ejercer el derecho de retracto y/o solicitar la reversión
          del pago en los términos y plazos legales. Algunos servicios turísticos con fecha
          específica pueden estar exceptuados del retracto conforme a la ley.
        </p>

        <h2>Gastos no reembolsables</h2>
        <p>
          Cargos administrativos, tarifas no reembolsables, servicios ya prestados y penalidades de
          proveedores pueden descontarse del valor a devolver.
        </p>

        <h2>Recomendación</h2>
        <p>
          Te sugerimos contratar asistencia o seguro de viaje con cobertura de cancelación para
          imprevistos.
        </p>
      </Prose>

      <div className="mt-8">
        <a
          href={waLink("Hola Vuela Fácil, necesito gestionar un cambio o cancelación de mi reserva.")}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="reembolsos"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
        >
          Gestionar mi reserva por WhatsApp
        </a>
      </div>
    </article>
  );
}
