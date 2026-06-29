import type { Alojamiento, CategoriaCard, Financiacion, Guia, Negocio, Paquete, Parque, Promo, Testimonio } from "./types";
import { SITE_URL } from "./site";

// Mientras NO existan reseñas reales verificadas, no emitimos datos
// estructurados de calificaciones/opiniones (evita marcado de reseñas falsas:
// riesgo ante la SIC y penalización de Google). Cuando cargues testimonios
// reales de clientes, pon esto en `true`.
export const RESENAS_VERIFICADAS = false;

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
// ALOJAMIENTOS — arriendo de fincas/cabañas/apartamentos (producto propio).
// Estos son ejemplos semilla; el operador los edita/crea desde el panel.
// Imágenes locales por ahora (reemplazar por fotos reales de cada propiedad).
// ---------------------------------------------------------------------------
export const ALOJAMIENTOS: Alojamiento[] = [
  {
    id: "al-finca-cafetera-salento",
    titulo: "Finca cafetera con piscina",
    tipo: "Finca",
    ubicacion: "Salento, Quindío",
    imagen: "/images/cat-eje.jpg",
    galeria: ["/images/cat-eje.jpg", "/images/story-1.jpg", "/images/pkg-ejc.jpg"],
    precioNoche: 650000,
    huespedes: 10,
    habitaciones: 4,
    camas: 6,
    banos: 3,
    minNoches: 2,
    amenidades: ["Piscina", "WiFi", "Cocina equipada", "Parqueadero", "BBQ", "Zona niños", "Vista a la montaña"],
    descripcion:
      "Finca tradicional rodeada de cafetales, a 10 minutos de Salento. Amplios corredores, piscina privada y zona de fogata. Ideal para familias y grupos que buscan desconectarse en el Eje Cafetero.",
    etiqueta: "Más reservada",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-15T12:00:00.000Z",
  },
  {
    id: "al-apto-armenia-centro",
    titulo: "Apartamento moderno en Armenia",
    tipo: "Apartamento",
    ubicacion: "Armenia, Quindío",
    imagen: "/images/pkg-ejc.jpg",
    galeria: ["/images/pkg-ejc.jpg", "/images/cat-eje.jpg"],
    precioNoche: 220000,
    huespedes: 4,
    habitaciones: 2,
    camas: 2,
    banos: 2,
    minNoches: 1,
    amenidades: ["WiFi", "Cocina equipada", "Parqueadero", "Aire acondicionado", "Ascensor"],
    descripcion:
      "Apartamento cómodo y bien ubicado en Armenia, cerca de centros comerciales y restaurantes. Perfecto para viajes cortos, parejas o viajeros de negocios.",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-10T12:00:00.000Z",
  },
  {
    id: "al-glamping-filandia",
    titulo: "Glamping con vista al valle",
    tipo: "Glamping",
    ubicacion: "Filandia, Quindío",
    imagen: "/images/story-1.jpg",
    galeria: ["/images/story-1.jpg", "/images/cat-eje.jpg"],
    precioNoche: 380000,
    huespedes: 2,
    habitaciones: 1,
    camas: 1,
    banos: 1,
    minNoches: 1,
    amenidades: ["WiFi", "Jacuzzi", "Desayuno", "Vista al valle", "Apto mascotas"],
    descripcion:
      "Domo glamping para parejas con jacuzzi privado y vista al valle de Filandia. Una experiencia íntima en plena naturaleza del Eje Cafetero.",
    etiqueta: "Romántico",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-05T12:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// HOTELES — misma estructura que un alojamiento, pero en su propia vitrina.
// (Reemplazar por hoteles reales con sus fotos.)
// ---------------------------------------------------------------------------
export const HOTELES: Alojamiento[] = [
  {
    id: "ho-boutique-pereira",
    titulo: "Hotel boutique en el centro de Pereira",
    tipo: "Hotel boutique",
    seccion: "hotel",
    ubicacion: "Pereira, Risaralda",
    imagen: "/images/pkg-ejc.jpg",
    galeria: ["/images/pkg-ejc.jpg", "/images/cat-eje.jpg"],
    precioNoche: 290000,
    huespedes: 2,
    habitaciones: 1,
    camas: 1,
    banos: 1,
    amenidades: ["WiFi", "Desayuno incluido", "Aire acondicionado", "Recepción 24h", "Parqueadero"],
    descripcion:
      "Hotel boutique a pasos del centro de Pereira, ideal para viajes de negocios o escapadas. Habitaciones cómodas, desayuno incluido y atención cercana.",
    etiqueta: "Céntrico",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "ho-campestre-eje",
    titulo: "Hotel campestre con piscina",
    tipo: "Hotel campestre",
    seccion: "hotel",
    ubicacion: "Montenegro, Quindío",
    imagen: "/images/cat-eje.jpg",
    galeria: ["/images/cat-eje.jpg", "/images/story-1.jpg"],
    precioNoche: 420000,
    huespedes: 4,
    habitaciones: 2,
    camas: 3,
    banos: 2,
    amenidades: ["Piscina", "WiFi", "Restaurante", "Zona BBQ", "Parqueadero", "Apto familias"],
    descripcion:
      "Hotel campestre en el corazón del Eje Cafetero, con piscina, restaurante y amplias zonas verdes. Perfecto para descansar en familia cerca de los parques temáticos.",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-18T12:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// PARQUES — entradas/pases del día (Parque del Café, Panaca, parques temáticos).
// Producto de entrada por día (sin noches). Reemplazar por datos reales.
// ---------------------------------------------------------------------------
export const PARQUES: Parque[] = [
  {
    id: "pq-parque-del-cafe",
    nombre: "Parque del Café",
    tipo: "Temático",
    ubicacion: "Montenegro, Quindío",
    imagen: "/images/cat-eje.jpg",
    galeria: ["/images/cat-eje.jpg", "/images/story-1.jpg"],
    precioDesde: 95000,
    horario: "Mié–Dom · 9:00 a.m. – 6:00 p.m.",
    incluye: ["Acceso al parque", "Atracciones mecánicas", "Shows culturales", "Teleférico"],
    descripcion:
      "El parque temático más emblemático del Eje Cafetero: atracciones mecánicas, espectáculos sobre la cultura cafetera, teleférico y mucho más. Pasaporte de un día para toda la familia.",
    etiqueta: "Más vendido",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-22T12:00:00.000Z",
  },
  {
    id: "pq-panaca",
    nombre: "PANACA",
    tipo: "Agroparque",
    ubicacion: "Quimbaya, Quindío",
    imagen: "/images/story-1.jpg",
    galeria: ["/images/story-1.jpg", "/images/cat-eje.jpg"],
    precioDesde: 90000,
    horario: "Mié–Dom · 9:00 a.m. – 5:00 p.m.",
    incluye: ["Acceso al agroparque", "Estaciones temáticas", "Shows con animales"],
    descripcion:
      "El parque de la naturaleza y los animales domésticos más grande del mundo. Estaciones temáticas, shows ecuestres y contacto con animales. Una experiencia ideal para niños y grandes.",
    destacado: true,
    publicado: true,
    createdAt: "2026-01-21T12:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// NEGOCIO — señales de confianza reales.
// ⚠️ Reemplaza `rnt` por el Registro Nacional de Turismo verdadero de la agencia.
// ---------------------------------------------------------------------------
export const NEGOCIO: Negocio = {
  rnt: "RNT 286644",
  rntFecha: "20 de abril de 2026", // fecha de inscripción/vigencia del RNT
  anios: 4,
  viajeros: "+2.900",
  tiempoRespuesta: "< 5 min",
  telefonoDisplay: "+57 311 449 4224",
  instagram: "https://www.instagram.com/vuelafaciltravel/",
  // --- Datos legales / contacto ---
  razonSocial: "Vuela Fácil Travel S.A.S.",
  nombreComercial: "Vuela Fácil Travel",
  nit: "902057889-8",
  anato: "", // afiliación ANATO si aplica (ej. "Afiliado ANATO N.º 0000")
  direccion: "Cra. 14 #20-35, Pereira, Risaralda",
  ciudad: "Pereira, Risaralda — Colombia",
  email: "hola@vuelafacil.com", // ← PLACEHOLDER: confirmar correo real
  emailHabeasData: "datos@vuelafacil.com", // ← PLACEHOLDER: correo Habeas Data
  horario: "Lunes a sábado, 8:00 a.m. – 8:00 p.m.",
  web: SITE_URL,
  facebook: "", // vacío → se oculta el ícono de Facebook
};

/**
 * Financiación comercial (Fase 1). Es solo mensajería/copy; los flujos de pago
 * online se activan al configurar las credenciales (ver lib/pagos.ts).
 */
export const FINANCIACION: Financiacion = {
  cuotas: 12,
  abonoPct: 30,
  bnpl: ["Addi"],
  medios: ["PSE", "Tarjetas", "Nequi", "Bancolombia"],
};

/** Métodos de pago aceptados. Fuente única para los badges de todo el sitio. */
export const MEDIOS_PAGO = ["Visa", "Mastercard", "AmEx", "PSE", "Nequi", "Daviplata", "Addi"] as const;

// ---------------------------------------------------------------------------
// REFERIDOS y FIDELIZACIÓN (Fase 5). Programa "gana–gana" gestionado por el
// asesor, sin apps ni cuentas: la atribución viaja en el enlace/mensaje de
// WhatsApp. ⚠️ Los montos exactos del beneficio los define el negocio (ver
// PENDIENTES); aquí el copy es general a propósito para no prometer cifras.
// ---------------------------------------------------------------------------
export const REFERIDOS = {
  /** Beneficio para quien llega referido (su primer viaje). */
  beneficioAmigo: "un descuento de bienvenida en tu primer viaje",
  /** Beneficio para quien refiere, cuando su amigo viaja. */
  beneficioReferente: "un bono para tu próximo viaje",
  pasos: [
    "Comparte tu enlace (o tu nombre) con quien quieras invitar.",
    "Tu amigo nos escribe por WhatsApp y menciona que lo refieres tú.",
    "Recibe su descuento de bienvenida al reservar su primer viaje.",
    "Cuando viaje, tú recibes tu bono. Sin límite de amigos referidos.",
  ],
} as const;

export const CLUB = {
  nombre: "Club Vuela Fácil",
  intro:
    "No necesitas apps ni acumular puntos: tu asesor te reconoce viaje a viaje. Mientras más viajas con nosotros, mejor te tratamos.",
  beneficios: [
    { titulo: "Asesor dedicado", desc: "Desde tu segundo viaje, la misma persona que ya conoce tus gustos." },
    { titulo: "Prioridad en cupos", desc: "Te avisamos primero en salidas grupales y promos relámpago." },
    { titulo: "Detalle de cumpleaños", desc: "Un beneficio especial en el mes de tu cumpleaños." },
    { titulo: "Viajero frecuente", desc: "Condiciones preferenciales que mejoran viaje a viaje." },
  ],
} as const;

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

// ---------------------------------------------------------------------------
// GUÍAS — contenido local (blog). Semilla; editable desde el panel /admin/guias.
// ---------------------------------------------------------------------------
export const GUIAS: Guia[] = [
  {
    id: "guia-eje-joyas",
    slug: "joyas-escondidas-del-eje-cafetero",
    titulo: "Joyas escondidas del Eje Cafetero que las grandes agencias no te cuentan",
    destino: "Eje Cafetero Premium",
    paqueteId: "VF-EJC-002",
    imagen: "/images/cat-eje.jpg",
    resumen:
      "Más allá del Valle de Cocora: pueblos de colores, miradores secretos y fincas cafeteras donde el tiempo se detiene.",
    etiquetas: ["Eje Cafetero", "Naturaleza", "Café"],
    publicada: true,
    createdAt: "2026-05-20T10:00:00-05:00",
    contenido: `El Eje Cafetero es nuestra casa, y por eso lo mostramos como solo un local puede hacerlo. Aquí van algunas **joyas escondidas** que valen cada minuto.

## Filandia, el mirador del Quindío

Menos turístico que Salento y igual de encantador. Sube a la **Colina Iluminada** para una vista de 360° de la cordillera y piérdete entre sus balcones de colores.

## Valle de Cocora al amanecer

Las palmas de cera más altas del mundo se ven mágicas con la niebla de la mañana. Sal temprano para evitar multitudes y caminar en silencio.

## Una finca cafetera de verdad

Nada como recoger el grano, tostarlo y catarlo con quien lleva generaciones haciéndolo. Te conectamos con haciendas boutique donde duermes entre cafetales.

### Mejor época

Cualquier mes es verde, pero **diciembre–marzo** y **julio–agosto** regalan los cielos más despejados.

> ¿Listo para vivirlo sin preocuparte por la logística? Te armamos el plan completo desde Pereira.`,
  },
  {
    id: "guia-sanandres",
    slug: "san-andres-mas-alla-de-la-playa",
    titulo: "San Andrés más allá de la playa: el mar de siete colores como local",
    destino: "San Andrés Isla",
    paqueteId: "VF-SAI-001",
    imagen: "/images/pkg-sai.jpg",
    resumen:
      "Johnny Cay, Hoyo Soplador y los mejores rincones para snorkel en el mar de siete colores.",
    etiquetas: ["Playa", "Caribe", "San Andrés"],
    publicada: true,
    createdAt: "2026-05-12T10:00:00-05:00",
    contenido: `El **mar de siete colores** es solo el comienzo. San Andrés tiene rincones que la mayoría de turistas se pierde.

## Johnny Cay sin filas

Llega temprano para disfrutar el islote con calma, antes de que lleguen los grupos. Lleva efectivo para un coco frío recién abierto.

## La Piscinita y el Hoyo Soplador

Snorkel entre peces de colores en aguas tranquilas, y la curiosa fuente natural que sopla agua de mar con la marea.

## Sabores isleños

Pide un **rondón**, el guiso típico con leche de coco, pescado y caracol. Una experiencia tan auténtica como el paisaje.

### Tip de local

Recuerda la **Tarjeta de Turismo**, obligatoria para ingresar a la isla; nosotros te ayudamos con todo el papeleo.`,
  },
];

export const IMG = {
  logo: "/images/logo.jpg",
  hero: "/images/hero.jpg",
  story1: "/images/story-1.jpg",
  story2: "/images/cat-eje.jpg",
  capt: "/images/capt.jpg",
} as const;
