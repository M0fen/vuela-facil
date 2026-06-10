import type { DiaItinerario, FAQ, Paquete } from "./types";
import { formatCOP } from "./utils";

// ---------------------------------------------------------------------------
// Helpers de detalle de paquete. Devuelven el contenido propio del paquete si
// existe en lib/data.ts, o un valor por defecto sensato si no. Así el modal y
// la página /paquetes/[id] comparten la misma fuente (DRY) y el operador puede
// personalizar cualquier campo sin tocar componentes.
// ---------------------------------------------------------------------------

export const galeriaDe = (p: Paquete): string[] =>
  p.galeria && p.galeria.length > 0 ? p.galeria : [p.imagen];

export const resumenDe = (p: Paquete): string =>
  p.resumen ??
  `Vive ${p.destino} (${p.pais}) en un plan de ${p.duracion}, diseñado y acompañado por nuestro equipo en Pereira.`;

export const mapaQueryDe = (p: Paquete): string =>
  p.mapaQuery ?? `${p.destino}, ${p.pais}`;

export const noIncluyeDe = (p: Paquete): string[] =>
  p.noIncluye ?? [
    "Gastos personales y propinas",
    "Tours opcionales no especificados",
    "Impuestos hoteleros locales (si aplican)",
  ];

export function itinerarioDe(p: Paquete): DiaItinerario[] {
  if (p.itinerario && p.itinerario.length > 0) return p.itinerario;
  return [
    {
      dia: "Día 1",
      titulo: "Llegada y bienvenida",
      desc: "Recepción en aeropuerto, traslado al hotel y cóctel de bienvenida al atardecer.",
    },
    {
      dia: "Día 2",
      titulo: "Experiencia local",
      desc: "Tour guiado por los lugares emblemáticos con almuerzo típico incluido.",
    },
    {
      dia: "Día 3",
      titulo: "Día libre + sunset",
      desc: "Disfruta del hotel a tu ritmo y cierra con una cena especial al atardecer.",
    },
    {
      dia: `Día ${p.duracionDias}`,
      titulo: "Regreso",
      desc: "Desayuno, traslado al aeropuerto y vuelo de regreso a casa con recuerdos para toda la vida.",
    },
  ];
}

export function faqsDe(p: Paquete): FAQ[] {
  if (p.faqs && p.faqs.length > 0) return p.faqs;
  return [
    {
      q: "¿El precio es por persona o por el grupo?",
      a: `El precio mostrado (${formatCOP(
        p.precio,
      )}) es por persona, con impuestos y tasas incluidos. El total se confirma por WhatsApp según fechas y número de viajeros.`,
    },
    {
      q: "¿Puedo pagar a cuotas?",
      a: "Sí. Manejamos hasta 12 cuotas sin interés con tarjetas y opciones como Addi y Nequi. Te explicamos las alternativas por WhatsApp.",
    },
    {
      q: "¿Qué pasa si necesito cambiar las fechas?",
      a: "Trabajamos con cancelación flexible según las condiciones de cada proveedor. Cuéntanos tu caso y buscamos la mejor opción para ti.",
    },
    {
      q: "¿Cómo reservo?",
      a: "Escríbenos por WhatsApp con el destino y las fechas; un asesor humano en Pereira te acompaña en todo el proceso, antes, durante y después del viaje.",
    },
  ];
}

/** Mensaje de WhatsApp con el resumen del viaje prellenado para el asesor. */
export function resumenWhatsApp(p: Paquete): string {
  return `✈️ *Vuela Fácil Travel*
_Solicitud de cotización_

Hola, quiero cotizar este plan:

*${p.destino}*
${p.duracion}

• Desde: ${formatCOP(p.precio)} por persona
• Salidas: ${p.salidas.join(", ")}
• Referencia: ${p.id}

Quedo atento(a) a la información. ¡Gracias!`;
}
