// NOTA: Plantilla base de Términos y Condiciones para una agencia de viajes en
// Colombia. Debe ser revisada y ajustada por un abogado antes de operar, y
// completar los datos reales (NIT, RNT, dirección, correos) en lib/data.ts.
import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { InfoHeader, Prose } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Términos y condiciones · Vuela Fácil Travel",
  description: "Condiciones de uso y contratación de los servicios turísticos de Vuela Fácil Travel.",
};

export default function TerminosPage() {
  return (
    <article>
      <InfoHeader eyebrow="Legal" title="Términos y condiciones" />
      <p className="text-navy/45 text-[13px] -mt-4 mb-2">Última actualización: junio de 2026</p>

      <Prose>
        <h2>1. Identificación del prestador</h2>
        <p>
          Este sitio es operado por <strong>{NEGOCIO.razonSocial}</strong> (en adelante, “la Agencia”
          o “Vuela Fácil”), identificada con NIT {NEGOCIO.nit}, prestador de servicios turísticos
          inscrito en el Registro Nacional de Turismo bajo el <strong>{NEGOCIO.rnt}</strong>, con
          domicilio en {NEGOCIO.direccion}. Contacto: {NEGOCIO.email} · {NEGOCIO.telefonoDisplay}.
        </p>

        <h2>2. Objeto e intermediación</h2>
        <p>
          La Agencia actúa como <strong>intermediaria</strong> entre el viajero y los operadores y
          proveedores de servicios turísticos (aerolíneas, hoteles, cruceros, operadores
          terrestres, aseguradoras, etc.). En consecuencia, la prestación final de cada servicio se
          rige por las condiciones, tarifas y políticas de cada proveedor, que el viajero acepta al
          contratar.
        </p>

        <h2>3. Reservas, cotizaciones y pagos</h2>
        <ul>
          <li>Las cotizaciones están sujetas a disponibilidad y pueden variar hasta el momento del pago.</li>
          <li>
            La reserva se confirma una vez recibido el pago o el abono acordado. Los planes pueden
            requerir un abono inicial para “separar” y el saldo en las fechas pactadas.
          </li>
          <li>Los precios se expresan en pesos colombianos (COP) e incluyen únicamente lo detallado en cada plan.</li>
          <li>
            Los medios de pago, cuotas y financiación disponibles se informan antes de finalizar la
            compra.
          </li>
        </ul>

        <h2>4. Cambios y cancelaciones</h2>
        <p>
          Los cambios, penalidades y reembolsos dependen de las políticas de cada proveedor y se
          informan antes del pago. Consulta nuestra{" "}
          <a href="/reembolsos">Política de cancelación y reembolsos</a>. El derecho de retracto y de
          desistimiento se aplicará conforme a la ley colombiana cuando proceda.
        </p>

        <h2>5. Responsabilidad</h2>
        <p>
          La Agencia responde por sus obligaciones de intermediación con diligencia. No será
          responsable por hechos imputables a los proveedores, fuerza mayor, caso fortuito,
          condiciones climáticas, decisiones de autoridades migratorias o incumplimientos del
          viajero (documentación, presentación a tiempo, etc.). Recomendamos contratar asistencia
          y/o seguro de viaje.
        </p>

        <h2>6. Obligaciones del viajero</h2>
        <ul>
          <li>Suministrar información veraz y completa para la reserva.</li>
          <li>Contar con la documentación exigida (pasaporte, visas, vacunas, formularios).</li>
          <li>Cumplir horarios, normas y condiciones de cada proveedor y destino.</li>
        </ul>

        <h2>7. Prevención y cláusula de turismo responsable</h2>
        <p>
          Rechazamos la explotación sexual de niños, niñas y adolescentes (Ley 679 de 2001 y normas
          concordantes) y cualquier actividad ilícita asociada al turismo. Promovemos el respeto al
          patrimonio cultural y natural del país.
        </p>

        <h2>8. Propiedad intelectual</h2>
        <p>
          Los contenidos del sitio (marca, textos, imágenes, diseño) son propiedad de la Agencia o
          se usan con autorización y no pueden reproducirse sin permiso.
        </p>

        <h2>9. Ley aplicable y jurisdicción</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia
          se someterá a los jueces y autoridades competentes del país.
        </p>

        <h2>10. Datos personales</h2>
        <p>
          El tratamiento de datos personales se rige por nuestra{" "}
          <a href="/privacidad">Política de Privacidad y Tratamiento de Datos</a>, conforme a la Ley
          1581 de 2012.
        </p>
      </Prose>
    </article>
  );
}
