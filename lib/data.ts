import type { CategoriaCard, Negocio, Paquete, Promo, Testimonio } from "./types";

// ---------------------------------------------------------------------------
// FUENTE ÚNICA DE DATOS
// Todas las imágenes son locales (las 19 originales del prototipo en
// /public/images). Reemplázalas por fotos propias cuando las tengas.
// ---------------------------------------------------------------------------

export const PAQUETES: Paquete[] = [
  {
    id: "VF-SAI-001",
    destino: "San Andrés Isla",
    pais: "Colombia",
    imagen: "/images/pkg-sai.jpg",
    duracion: "4 días · 3 noches",
    duracionDias: 4,
    incluye: ["Tiquetes ida y vuelta", "Hotel 4★ todo incluido", "Traslados aeropuerto", "Tour Johnny Cay"],
    precio: 1890000,
    categoria: "Playa",
    calificacion: 4.9,
    reviews: 218,
    salidas: ["15 Jun", "22 Jun", "06 Jul", "20 Jul"],
    etiqueta: "Más vendido",
    resumen:
      "Mar de siete colores, todo incluido y el tour a Johnny Cay. Cuatro días para desconectarte en el Caribe colombiano sin pensar en nada.",
    galeria: ["/images/pkg-sai.jpg", "/images/cat-playa.jpg", "/images/pkg-ctg.jpg"],
    mejorEpoca:
      "De diciembre a abril hay menos lluvia y el mar de siete colores luce espectacular. Junio y julio son ideales para vacaciones en familia.",
    comoLlegar:
      "Vuelo directo desde Pereira, Bogotá o Medellín (incluido en el paquete). Recuerda la Tarjeta de Turismo, obligatoria para ingresar a la isla.",
  },
  {
    id: "VF-EJC-002",
    destino: "Eje Cafetero Premium",
    pais: "Colombia",
    imagen: "/images/pkg-ejc.jpg",
    duracion: "3 días · 2 noches",
    duracionDias: 3,
    incluye: ["Hacienda boutique", "Tour del café", "Valle de Cocora", "Desayunos gourmet"],
    precio: 1290000,
    categoria: "Eje Cafetero",
    calificacion: 4.8,
    reviews: 312,
    salidas: ["Todos los viernes"],
    etiqueta: "Local insignia",
    resumen:
      "Nuestra tierra como solo la conoce un local: hacienda boutique, tour del café de origen y el imponente Valle de Cocora. El plan insignia de Vuela Fácil.",
    galeria: ["/images/pkg-ejc.jpg", "/images/cat-eje.jpg", "/images/story-1.jpg"],
    mejorEpoca:
      "El Eje Cafetero es verde todo el año. La temporada seca (diciembre–marzo y julio–agosto) regala los cielos más despejados para el Valle de Cocora.",
    comoLlegar:
      "Salida desde Pereira con traslado incluido a la hacienda. Si llegas de otra ciudad, te recibimos en el Aeropuerto Matecaña o en la terminal.",
  },
  {
    id: "VF-CTG-003",
    destino: "Cartagena Histórica",
    pais: "Colombia",
    imagen: "/images/pkg-ctg.jpg",
    duracion: "4 días · 3 noches",
    duracionDias: 4,
    incluye: ["Hotel ciudad amurallada", "City tour", "Islas del Rosario", "Cena en terraza"],
    precio: 1650000,
    categoria: "Playa",
    calificacion: 4.7,
    reviews: 184,
    salidas: ["12 Jun", "26 Jun", "10 Jul"],
    etiqueta: null,
    resumen:
      "La ciudad amurallada, las Islas del Rosario y una cena con vista al atardecer caribeño. Historia, color y mar en un solo viaje.",
    galeria: ["/images/pkg-ctg.jpg", "/images/cat-playa.jpg", "/images/pkg-sai.jpg"],
    mejorEpoca:
      "De diciembre a abril el clima es más seco y fresco para recorrer el centro histórico. Todo el año es cálido, así que lleva ropa ligera y protección solar.",
    comoLlegar:
      "Vuelo a Cartagena con traslado al hotel en la ciudad amurallada (incluido). Conexiones cómodas desde Pereira, Bogotá y Medellín.",
  },
  {
    id: "VF-CUN-004",
    destino: "Cancún Riviera Maya",
    pais: "México",
    imagen: "/images/pkg-cun.jpg",
    duracion: "6 días · 5 noches",
    duracionDias: 6,
    incluye: ["Vuelo directo", "Resort 5★ all inclusive", "Asistencia médica", "Tour Chichén Itzá"],
    precio: 4290000,
    categoria: "Internacional",
    calificacion: 4.9,
    reviews: 401,
    salidas: ["08 Jul", "22 Jul", "12 Ago"],
    etiqueta: "Promo del mes",
    resumen:
      "Resort 5★ all inclusive frente al Caribe mexicano, vuelo directo y el imperdible tour a Chichén Itzá. La Riviera Maya sin complicaciones.",
    galeria: ["/images/pkg-cun.jpg", "/images/cat-int.jpg", "/images/cat-playa.jpg"],
    mejorEpoca:
      "De diciembre a abril el clima es seco y perfecto para playa. Evita septiembre–octubre por la temporada de lluvias y huracanes.",
    comoLlegar:
      "Vuelo directo a Cancún (incluido). Te ayudamos con la documentación: pasaporte vigente y, según el caso, autorización de ingreso a México.",
  },
  {
    id: "VF-CRC-005",
    destino: "Crucero por el Caribe",
    pais: "Caribe",
    imagen: "/images/pkg-crc.jpg",
    duracion: "7 días · 6 noches",
    duracionDias: 7,
    incluye: ["Royal Caribbean", "Pensión completa a bordo", "4 puertos del Caribe", "Show nocturno"],
    precio: 5890000,
    categoria: "Cruceros",
    calificacion: 4.8,
    reviews: 156,
    salidas: ["18 Jul", "15 Ago", "12 Sep"],
    etiqueta: null,
    resumen:
      "Siete días a bordo de Royal Caribbean con pensión completa, cuatro puertos del Caribe y shows cada noche. Desempacas una sola vez.",
    galeria: ["/images/pkg-crc.jpg", "/images/cat-cru.jpg", "/images/cat-int.jpg"],
    mejorEpoca:
      "La temporada de cruceros por el Caribe va de noviembre a abril, con mar tranquilo. Reserva con anticipación para asegurar el mejor camarote.",
    comoLlegar:
      "Coordinamos tu vuelo al puerto de embarque y los traslados. Necesitarás pasaporte vigente; te guiamos con visados según los puertos del itinerario.",
  },
  {
    id: "VF-EUR-006",
    destino: "Europa Clásica",
    pais: "Europa",
    imagen: "/images/pkg-eur.jpg",
    duracion: "12 días · 11 noches",
    duracionDias: 12,
    incluye: ["Madrid · París · Roma", "Hoteles 4★", "Bus turístico", "Guía en español"],
    precio: 12450000,
    categoria: "Internacional",
    calificacion: 5.0,
    reviews: 89,
    salidas: ["20 Sep", "15 Oct"],
    etiqueta: "Edición limitada",
    resumen:
      "Madrid, París y Roma en doce días con hoteles 4★, bus turístico y guía en español. El gran tour europeo, acompañado de principio a fin.",
    galeria: ["/images/pkg-eur.jpg", "/images/cat-int.jpg", "/images/cat-lun.jpg"],
    mejorEpoca:
      "Primavera (abril–junio) y otoño (septiembre–octubre) ofrecen clima agradable y menos multitudes que el verano europeo.",
    comoLlegar:
      "Vuelo internacional a Madrid (incluido) y desplazamientos terrestres entre ciudades. Te asesoramos con la visa Schengen y la documentación.",
    mapaQuery: "Madrid, España",
  },
];

// ---------------------------------------------------------------------------
// NEGOCIO — señales de confianza reales.
// ⚠️ Reemplaza `rnt` por el Registro Nacional de Turismo verdadero de la agencia.
// ---------------------------------------------------------------------------
export const NEGOCIO: Negocio = {
  rnt: "RNT 00000", // ← PLACEHOLDER: poner el RNT real antes de publicar
  anios: 12,
  viajeros: "+18.500",
  tiempoRespuesta: "< 5 min",
  telefonoDisplay: "+57 314 545 2095",
  instagram: "https://www.instagram.com/vuelafaciltravel/",
};

// ---------------------------------------------------------------------------
// PROMO — escasez REAL. El countdown del OfferBanner se ata a `promoEnds`.
// Cuando la promo termine (o `activa = false`), edita esto: el banner pasa solo
// a un mensaje perenne sin reloj. Nunca dejes una fecha falsa que se reinicie.
// ---------------------------------------------------------------------------
export const PROMO: Promo = {
  activa: true,
  promoEnds: "2026-07-15T23:59:59-05:00", // fecha real de cierre de la promo
  eyebrow: "Cupos limitados · salidas julio",
  tituloLinea1: "San Andrés todo incluido",
  destacado: "−25%",
  tituloLinea2: "para las primeras 20 familias.",
  descripcion:
    "Tiquetes directos desde Pereira, Bogotá o Medellín. Hotel 4★ frente al mar, traslados y tour Johnny Cay incluidos.",
  ctaMensaje: "Quiero asegurar uno de los cupos a San Andrés con el descuento del 25%.",
};

export const CATEGORIAS: CategoriaCard[] = [
  { id: "playa", nombre: "Playa", desc: "Caribe sin filtros", img: "/images/cat-playa.jpg" },
  { id: "eje", nombre: "Eje Cafetero", desc: "Nuestra tierra", img: "/images/cat-eje.jpg" },
  { id: "cruceros", nombre: "Cruceros", desc: "Travesías premium", img: "/images/cat-cru.jpg" },
  { id: "internacional", nombre: "Internacional", desc: "El mundo te espera", img: "/images/cat-int.jpg" },
  { id: "aventura", nombre: "Aventura", desc: "Adrenalina natural", img: "/images/cat-adv.jpg" },
  { id: "lunademiel", nombre: "Luna de Miel", desc: "Inolvidable juntos", img: "/images/cat-lun.jpg" },
];

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Mariana Restrepo",
    ciudad: "Manizales",
    destino: "San Andrés",
    foto: "/images/tst-1.jpg",
    texto:
      "La atención de Vuela Fácil fue impecable. Nos resolvieron todo por WhatsApp en minutos y el hotel superó cualquier expectativa. Volveremos sin pensarlo.",
    rating: 5.0,
  },
  {
    nombre: "Camilo Hernández",
    ciudad: "Bogotá",
    destino: "Cancún",
    foto: "/images/tst-2.jpg",
    texto:
      "Reservamos nuestra luna de miel y todo fluyó como en piloto automático. Cero estrés. La asesora nos acompañó hasta el aeropuerto, literal.",
    rating: 4.8,
  },
  {
    nombre: "Lucía Patiño",
    ciudad: "Pereira",
    destino: "Crucero por el Caribe",
    foto: "/images/tst-3.jpg",
    texto:
      "Llevamos a mis papás de aniversario y lloraron de felicidad. Vuela Fácil cuidó cada detalle. Son una agencia para confiar de por vida.",
    rating: 4.9,
  },
];

export const IMG = {
  logo: "/images/logo.jpg",
  hero: "/images/hero.jpg",
  story1: "/images/story-1.jpg",
  story2: "/images/cat-eje.jpg",
  capt: "/images/capt.jpg",
} as const;
