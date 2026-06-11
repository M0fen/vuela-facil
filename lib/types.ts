export type Categoria =
  | "Playa"
  | "Eje Cafetero"
  | "Cruceros"
  | "Internacional"
  | "Aventura"
  | "Luna de Miel";

export interface DiaItinerario {
  dia: string;
  titulo: string;
  desc: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Paquete {
  id: string;
  destino: string;
  pais: string;
  imagen: string;
  duracion: string;
  duracionDias: number;
  incluye: string[];
  precio: number;
  /** Precio anterior (opcional). Si es mayor al precio, se muestra tachado + % de ahorro. */
  precioAntes?: number;
  categoria: Categoria;
  calificacion: number;
  reviews: number;
  salidas: string[];
  etiqueta: string | null;
  // --- Campos opcionales para la página de detalle /paquetes/[id] ---
  /** Resumen corto para SEO/Open Graph y encabezado de la página de detalle. */
  resumen?: string;
  /** Galería de fotos (varias). Si falta, se usa [imagen]. */
  galeria?: string[];
  /** Qué NO incluye. Si falta, se usa una lista por defecto. */
  noIncluye?: string[];
  /** Itinerario día a día. Si falta, se genera uno genérico desde duracionDias. */
  itinerario?: DiaItinerario[];
  /** Preguntas frecuentes del paquete. Si falta, se usan las generales. */
  faqs?: FAQ[];
  mejorEpoca?: string;
  comoLlegar?: string;
  /** Consulta para el mapa embebido. Si falta, se usa "destino, pais". */
  mapaQuery?: string;
}

export interface Lead {
  id: string;
  email: string;
  telefono?: string;
  /** De dónde vino el lead (sección/landing). */
  origen: string;
  /** ISO date string. */
  createdAt: string;
}

export type EstadoReserva = "pendiente" | "en_proceso" | "confirmada" | "cancelada";

export interface Reserva {
  id: string;
  paqueteId: string;
  /** Snapshot del destino al momento de reservar (sobrevive si el paquete cambia). */
  destino: string;
  fecha: string;
  viajeros: number;
  totalEstimado: number;
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  estado: EstadoReserva;
  /** Notas internas del asesor (no visibles para el cliente). */
  notas?: string;
  createdAt: string;
}

export interface Analytics {
  /** Clics a WhatsApp por ubicación (ruta o etiqueta). */
  whatsapp: Record<string, number>;
}

export interface Guia {
  id: string;
  slug: string;
  titulo: string;
  /** Destino o tema de la guía (para CTA y relación con paquetes). */
  destino: string;
  resumen: string;
  imagen: string;
  /** Contenido en Markdown. */
  contenido: string;
  etiquetas?: string[];
  /** Si está en false, no aparece en el sitio público (borrador). */
  publicada: boolean;
  /** Paquete relacionado para la CTA (opcional). */
  paqueteId?: string;
  createdAt: string;
}

export interface CategoriaCard {
  id: string;
  nombre: Categoria;
  desc: string;
  img: string;
}

export interface Testimonio {
  nombre: string;
  ciudad: string;
  destino: string;
  foto: string;
  texto: string;
  /** Calificación real del cliente (4.0–5.0). Permite decimales para reflejar variedad honesta. */
  rating: number;
}

/** Datos del negocio para señales de confianza (barra de confianza, footer, SEO, legal). */
export interface Negocio {
  /** Número de Registro Nacional de Turismo. Reemplazar por el RNT real. */
  rnt: string;
  anios: number;
  viajeros: string;
  tiempoRespuesta: string;
  /** Teléfono/WhatsApp en formato legible para mostrar al usuario. */
  telefonoDisplay: string;
  /** URL del perfil de Instagram. */
  instagram: string;
  // --- Datos legales / contacto (para páginas legales y SEO) ---------------
  /** Razón social. */
  razonSocial: string;
  /** Nombre comercial. */
  nombreComercial: string;
  /** NIT. Reemplazar por el real. */
  nit: string;
  /** Afiliación ANATO (texto o número); vacío si no aplica. */
  anato: string;
  /** Dirección física completa. */
  direccion: string;
  /** Ciudad y departamento. */
  ciudad: string;
  /** Correo de contacto general. */
  email: string;
  /** Correo para ejercer derechos de Habeas Data (Ley 1581/2012). */
  emailHabeasData: string;
  /** Horario de atención legible. */
  horario: string;
  /** URL del sitio (sin slash final). */
  web: string;
  /** URL de Facebook; vacío si no hay (se oculta). */
  facebook: string;
}

/** Configuración comercial de financiación (Fase 1). */
export interface Financiacion {
  /** Número de cuotas sin interés a comunicar. */
  cuotas: number;
  /** Porcentaje de abono para "separar" un viaje. */
  abonoPct: number;
  /** Aliados de "compra ahora, paga después". */
  bnpl: string[];
  /** Medios de pago aceptados (para badges/copy). */
  medios: string[];
}

/**
 * Configuración de la promoción del OfferBanner.
 * `promoEnds` debe ser una fecha real (ISO con zona horaria de Colombia, -05:00).
 * Si `activa` es false o `promoEnds` es null/ya pasó, el banner muestra un mensaje
 * perenne SIN cuenta regresiva (nada de relojes falsos que se reinician).
 */
export interface Promo {
  activa: boolean;
  promoEnds: string | null;
  eyebrow: string;
  tituloLinea1: string;
  destacado: string;
  tituloLinea2: string;
  descripcion: string;
  ctaMensaje: string;
}
