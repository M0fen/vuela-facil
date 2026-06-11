// NOTA: Plantilla base de Política de Tratamiento de Datos (Ley 1581/2012 y
// Decreto 1377/2013). Revisar con un abogado y completar correo/datos reales.
import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { InfoHeader, Prose } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Política de privacidad y tratamiento de datos · Vuela Fácil Travel",
  description:
    "Cómo recolectamos, usamos y protegemos tus datos personales conforme a la Ley 1581 de 2012 (Habeas Data).",
};

export default function PrivacidadPage() {
  return (
    <article>
      <InfoHeader eyebrow="Legal" title="Política de privacidad y tratamiento de datos" />
      <p className="text-navy/45 text-[13px] -mt-4 mb-2">Última actualización: junio de 2026</p>

      <Prose>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          <strong>{NEGOCIO.razonSocial}</strong> (NIT {NEGOCIO.nit}), {NEGOCIO.direccion}. Para
          asuntos de protección de datos: <a href={`mailto:${NEGOCIO.emailHabeasData}`}>{NEGOCIO.emailHabeasData}</a>{" "}
          · {NEGOCIO.telefonoDisplay}.
        </p>

        <h2>2. Marco legal</h2>
        <p>
          Tratamos tus datos conforme a la Constitución Política, la Ley 1581 de 2012, el Decreto
          1377 de 2013 y demás normas concordantes sobre protección de datos personales en Colombia.
        </p>

        <h2>3. Datos que recolectamos</h2>
        <ul>
          <li>Datos de contacto: nombre, teléfono/WhatsApp, correo electrónico, ciudad.</li>
          <li>Datos de viaje: destinos de interés, fechas, número de viajeros, preferencias.</li>
          <li>Datos de navegación: páginas vistas y métricas anónimas para mejorar el sitio.</li>
        </ul>

        <h2>4. Finalidades</h2>
        <ul>
          <li>Atender solicitudes, cotizaciones y reservas.</li>
          <li>Gestionar pagos, confirmaciones y asistencia durante el viaje.</li>
          <li>Enviar información comercial y promociones (solo con tu autorización).</li>
          <li>Cumplir obligaciones legales y contables.</li>
        </ul>

        <h2>5. Autorización</h2>
        <p>
          Al enviarnos tus datos por el sitio o por WhatsApp, autorizas su tratamiento para las
          finalidades anteriores. Puedes revocar la autorización en cualquier momento, salvo
          obligaciones legales o contractuales que lo impidan.
        </p>

        <h2>6. Tus derechos (Habeas Data)</h2>
        <p>Como titular, tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso de tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos cuando proceda.</li>
        </ul>

        <h2>7. Cómo ejercer tus derechos</h2>
        <p>
          Envía tu solicitud a <a href={`mailto:${NEGOCIO.emailHabeasData}`}>{NEGOCIO.emailHabeasData}</a>{" "}
          indicando tu nombre, identificación y la petición concreta. Responderemos en los términos y
          plazos de ley (consultas: 10 días hábiles; reclamos: 15 días hábiles, prorrogables).
        </p>

        <h2>8. Seguridad y conservación</h2>
        <p>
          Adoptamos medidas razonables para proteger tus datos y los conservamos por el tiempo
          necesario para cumplir las finalidades y las obligaciones legales aplicables.
        </p>

        <h2>9. Transferencias a terceros</h2>
        <p>
          Compartimos datos con proveedores turísticos y pasarelas de pago únicamente para ejecutar
          los servicios contratados, bajo deberes de confidencialidad.
        </p>

        <h2>10. Cookies</h2>
        <p>
          El uso de cookies se describe en nuestra <a href="/cookies">Política de Cookies</a>.
        </p>
      </Prose>
    </article>
  );
}
