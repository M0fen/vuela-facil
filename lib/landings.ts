import type { Categoria, Paquete } from "./types";

// ---------------------------------------------------------------------------
// LANDINGS COMERCIALES (Fase 3 · SEO a escala)
// Páginas de aterrizaje por temática/categoría pensadas para posicionar en
// Google ("viajes a <X> desde Pereira") y concentrar enlaces internos + CTAs.
// Cada landing alimenta su grid desde PAQUETES por categoría; si aún no hay
// inventario exacto, muestra los mejor calificados como ideas (nunca queda vacía).
// ---------------------------------------------------------------------------

export interface LandingBullet {
  titulo: string;
  desc: string;
}

export interface Landing {
  /** Slug de la URL: /viajes/[slug]. */
  slug: string;
  /** Categorías de PAQUETES que alimentan el grid. */
  categorias: Categoria[];
  /** Imagen hero (local en /public/images). */
  hero: string;
  /** Eyebrow corto sobre el H1. */
  eyebrow: string;
  /** H1 de la página. */
  h1: string;
  /** Título para <title> / Open Graph (incluye marca al renderizar). */
  titulo: string;
  /** Meta description (140–160 car.). */
  metaDescripcion: string;
  /** Párrafo de apertura (copy SEO, 2–3 frases). */
  intro: string;
  /** Diferenciales / qué incluye (3–4). */
  bullets: LandingBullet[];
  /** Preguntas frecuentes específicas (FAQPage JSON-LD). */
  faqs: { q: string; a: string }[];
  /** Mensaje prellenado para el CTA de WhatsApp. */
  ctaMensaje: string;
}

export const LANDINGS: Landing[] = [
  {
    slug: "playa",
    categorias: ["Playa"],
    hero: "/images/cat-playa.jpg",
    eyebrow: "Viajes de playa desde Pereira",
    h1: "Viajes a la playa desde Pereira",
    titulo: "Viajes a la playa desde Pereira · San Andrés, Cartagena y más",
    metaDescripcion:
      "Planes de playa todo incluido desde Pereira: San Andrés, Cartagena y el Caribe. Tiquetes, hotel y traslados con asesoría humana y reserva por WhatsApp.",
    intro:
      "Arena blanca, mar de siete colores y cero estrés de logística. Diseñamos tu escapada de playa desde Pereira con tiquetes, hotel y traslados resueltos, para que solo pienses en descansar.",
    bullets: [
      { titulo: "Todo incluido real", desc: "Tiquetes, hotel, traslados y tours en un solo precio, sin cargos sorpresa." },
      { titulo: "Caribe colombiano e internacional", desc: "Desde San Andrés y Cartagena hasta la Riviera Maya." },
      { titulo: "Salidas desde Pereira", desc: "Conexiones cómodas desde el Eje Cafetero, sin trasnochar por el viaje." },
    ],
    faqs: [
      {
        q: "¿Los planes de playa salen desde Pereira?",
        a: "Sí. Coordinamos las conexiones desde Pereira (y desde Bogotá o Medellín si te queda mejor) e incluimos los traslados al hotel.",
      },
      {
        q: "¿Qué incluyen los paquetes de playa?",
        a: "Por lo general tiquetes ida y vuelta, hotel, traslados aeropuerto–hotel y tours destacados. Cada plan detalla exactamente qué incluye.",
      },
      {
        q: "¿Puedo pagar a cuotas?",
        a: "Sí. Manejamos hasta 12 cuotas y la opción de separar tu viaje con un abono. Te explicamos todo por WhatsApp.",
      },
    ],
    ctaMensaje: "Hola, quiero un plan de playa desde Pereira. ¿Me ayudan a armarlo?",
  },
  {
    slug: "eje-cafetero",
    categorias: ["Eje Cafetero"],
    hero: "/images/cat-eje.jpg",
    eyebrow: "Planes en el Eje Cafetero",
    h1: "Planes turísticos en el Eje Cafetero",
    titulo: "Planes en el Eje Cafetero · Valle de Cocora y tour del café",
    metaDescripcion:
      "Vive el Eje Cafetero como un local: haciendas boutique, tour del café y el Valle de Cocora. Planes a la medida desde Pereira con reserva por WhatsApp.",
    intro:
      "Somos de aquí, y se nota. Te mostramos el Eje Cafetero como solo un local puede hacerlo: haciendas boutique entre cafetales, el tour del café de origen y el imponente Valle de Cocora.",
    bullets: [
      { titulo: "Mirada local", desc: "Rincones que las grandes agencias no te cuentan, con aliados de la región." },
      { titulo: "Haciendas boutique", desc: "Duerme entre cafetales con desayunos gourmet y experiencias auténticas." },
      { titulo: "Logística resuelta", desc: "Traslados, entradas y guía coordinados desde Pereira." },
    ],
    faqs: [
      {
        q: "¿Cuál es la mejor época para el Valle de Cocora?",
        a: "Es verde todo el año, pero diciembre–marzo y julio–agosto regalan los cielos más despejados. Salir temprano evita multitudes.",
      },
      {
        q: "¿Los planes incluyen el tour del café?",
        a: "Sí, nuestros planes insignia incluyen el tour del café de origen en finca, además del Valle de Cocora y alojamiento boutique.",
      },
      {
        q: "¿Sirve para una escapada de fin de semana?",
        a: "Perfecto. Tenemos planes de 3 días · 2 noches con salidas todos los viernes desde Pereira.",
      },
    ],
    ctaMensaje: "Hola, me interesa un plan por el Eje Cafetero. ¿Qué opciones tienen?",
  },
  {
    slug: "cruceros",
    categorias: ["Cruceros"],
    hero: "/images/cat-cru.jpg",
    eyebrow: "Cruceros desde Colombia",
    h1: "Cruceros por el Caribe y el mundo",
    titulo: "Cruceros por el Caribe desde Colombia · Royal Caribbean y más",
    metaDescripcion:
      "Cruceros todo incluido por el Caribe con pensión completa, varios puertos y shows a bordo. Coordinamos vuelos y traslados desde Pereira. Reserva por WhatsApp.",
    intro:
      "Desempaca una sola vez y despierta en un puerto distinto cada día. Coordinamos tu crucero por el Caribe —vuelos al embarque, traslados y documentación— para que solo te subas a disfrutar.",
    bullets: [
      { titulo: "Pensión completa a bordo", desc: "Gastronomía, shows y entretenimiento incluidos durante toda la travesía." },
      { titulo: "Varios puertos en un viaje", desc: "Conoce varios destinos del Caribe sin cambiar de hotel." },
      { titulo: "Vuelos y visados", desc: "Te guiamos con conexiones al puerto y la documentación según el itinerario." },
    ],
    faqs: [
      {
        q: "¿Cuál es la mejor temporada para un crucero por el Caribe?",
        a: "De noviembre a abril el mar está más tranquilo. Conviene reservar con anticipación para asegurar el mejor camarote.",
      },
      {
        q: "¿Necesito pasaporte y visa?",
        a: "Para cruceros internacionales necesitas pasaporte vigente. Según los puertos puede requerirse visa; te asesoramos en cada caso.",
      },
      {
        q: "¿Coordinan el vuelo hasta el puerto de embarque?",
        a: "Sí. Organizamos tu vuelo y los traslados al puerto para que la conexión sea cómoda desde Pereira.",
      },
    ],
    ctaMensaje: "Hola, quiero información sobre cruceros por el Caribe. ¿Me asesoran?",
  },
  {
    slug: "internacional",
    categorias: ["Internacional"],
    hero: "/images/cat-int.jpg",
    eyebrow: "Viajes internacionales",
    h1: "Viajes internacionales desde Pereira",
    titulo: "Viajes internacionales desde Pereira · Cancún, Europa y más",
    metaDescripcion:
      "Viajes internacionales desde Pereira: Cancún, Europa y más, con vuelos, hoteles y asesoría en visados. Planes a la medida con reserva por WhatsApp.",
    intro:
      "Del Caribe mexicano al gran tour europeo. Armamos tu viaje internacional desde Pereira con vuelos, hoteles seleccionados y acompañamiento en visados y documentación de principio a fin.",
    bullets: [
      { titulo: "Asesoría en visados", desc: "Te guiamos con Schengen, documentación y requisitos de cada destino." },
      { titulo: "Hoteles seleccionados", desc: "Alojamientos 4★ y 5★ con buena ubicación y traslados incluidos." },
      { titulo: "Acompañamiento total", desc: "Asistencia por WhatsApp antes y durante el viaje, en español." },
    ],
    faqs: [
      {
        q: "¿Me ayudan con la visa?",
        a: "Sí. Te orientamos en el proceso (por ejemplo la visa Schengen para Europa) y en la documentación necesaria según el destino.",
      },
      {
        q: "¿Los vuelos salen desde Pereira?",
        a: "Coordinamos las conexiones desde Pereira; según el destino puede convenir salir desde Bogotá o Medellín, y te lo planteamos.",
      },
      {
        q: "¿Puedo financiar un viaje internacional?",
        a: "Sí, manejamos cuotas y la opción de separar con un abono. Te armamos un plan de pago por WhatsApp.",
      },
    ],
    ctaMensaje: "Hola, quiero viajar al exterior desde Pereira. ¿Qué destinos manejan?",
  },
  {
    slug: "luna-de-miel",
    categorias: ["Luna de Miel"],
    hero: "/images/cat-lun.jpg",
    eyebrow: "Lunas de miel inolvidables",
    h1: "Lunas de miel a la medida",
    titulo: "Lunas de miel a la medida desde Pereira · romance sin estrés",
    metaDescripcion:
      "Diseñamos tu luna de miel a la medida desde Pereira: playas paradisíacas o ciudades de ensueño, con detalles románticos y todo resuelto. Reserva por WhatsApp.",
    intro:
      "El viaje más importante merece cero estrés. Diseñamos tu luna de miel a la medida —playa paradisíaca o ciudad de ensueño— cuidando cada detalle para que solo se preocupen por disfrutarse.",
    bullets: [
      { titulo: "Detalles románticos", desc: "Cenas, upgrades y sorpresas coordinadas con el hotel cuando es posible." },
      { titulo: "A la medida", desc: "Armamos el itinerario según el estilo de la pareja, sin paquetes genéricos." },
      { titulo: "Todo resuelto", desc: "Vuelos, hotel y traslados listos para que el viaje fluya solo." },
    ],
    faqs: [
      {
        q: "¿Arman lunas de miel personalizadas?",
        a: "Sí, es nuestro fuerte. Partimos del estilo de la pareja y el presupuesto para diseñar un viaje único, no un paquete genérico.",
      },
      {
        q: "¿Qué destinos recomiendan para luna de miel?",
        a: "Depende de lo que busquen: playa todo incluido en el Caribe, o ciudades como las del gran tour europeo. Les damos opciones por WhatsApp.",
      },
      {
        q: "¿Se puede financiar?",
        a: "Claro. Manejamos cuotas y la opción de separar con un abono para que organicen el viaje con tiempo.",
      },
    ],
    ctaMensaje: "Hola, estamos planeando nuestra luna de miel. ¿Nos ayudan a diseñarla?",
  },
  {
    slug: "aventura",
    categorias: ["Aventura"],
    hero: "/images/cat-adv.jpg",
    eyebrow: "Viajes de aventura",
    h1: "Viajes de aventura y naturaleza",
    titulo: "Viajes de aventura desde Pereira · naturaleza y adrenalina",
    metaDescripcion:
      "Planes de aventura y naturaleza desde Pereira: senderismo, paisajes y adrenalina con logística resuelta y asesoría humana. Reserva por WhatsApp.",
    intro:
      "Para quienes viajan a sentir, no solo a mirar. Armamos experiencias de aventura y naturaleza desde Pereira —senderos, paisajes y adrenalina— con la logística y la seguridad resueltas.",
    bullets: [
      { titulo: "Experiencias activas", desc: "Senderismo, miradores y planes en plena naturaleza con aliados locales." },
      { titulo: "Logística y seguridad", desc: "Traslados, guías y entradas coordinados para que solo lleves la mochila." },
      { titulo: "A tu ritmo", desc: "Desde escapadas suaves hasta retos exigentes, según tu nivel." },
    ],
    faqs: [
      {
        q: "¿Qué tan exigentes son los planes de aventura?",
        a: "Hay para todos los niveles. Nos cuentas tu experiencia y armamos un plan acorde, desde caminatas suaves hasta rutas más retadoras.",
      },
      {
        q: "¿Incluyen guía?",
        a: "Sí, trabajamos con guías y aliados locales para que la experiencia sea segura y auténtica.",
      },
      {
        q: "¿Desde dónde salen?",
        a: "Desde Pereira y el Eje Cafetero, una de las mejores zonas del país para aventura y naturaleza.",
      },
    ],
    ctaMensaje: "Hola, busco un plan de aventura/naturaleza. ¿Qué experiencias tienen?",
  },
];

/** Mapa categoría → slug de landing, para enlazar desde las tarjetas de categoría. */
export const CATEGORIA_A_LANDING: Record<Categoria, string> = {
  Playa: "playa",
  "Eje Cafetero": "eje-cafetero",
  Cruceros: "cruceros",
  Internacional: "internacional",
  "Luna de Miel": "luna-de-miel",
  Aventura: "aventura",
};

export function getLanding(slug: string): Landing | undefined {
  return LANDINGS.find((l) => l.slug === slug);
}

/**
 * Resuelve los paquetes de una landing. Si no hay inventario exacto de la
 * categoría, devuelve los mejor calificados como "ideas" (`exactos: false`),
 * para que la página nunca quede vacía.
 */
export function paquetesDeLanding(
  landing: Landing,
  todos: Paquete[],
): { paquetes: Paquete[]; exactos: boolean } {
  const exactos = todos.filter((p) => landing.categorias.includes(p.categoria));
  if (exactos.length > 0) {
    return { paquetes: [...exactos].sort((a, b) => b.calificacion - a.calificacion), exactos: true };
  }
  const ideas = [...todos].sort((a, b) => b.calificacion - a.calificacion).slice(0, 3);
  return { paquetes: ideas, exactos: false };
}
