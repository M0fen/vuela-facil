export type Categoria =
  | "Playa"
  | "Eje Cafetero"
  | "Cruceros"
  | "Internacional"
  | "Aventura"
  | "Luna de Miel";

/** Moneda de un precio. COP por defecto en todo el sitio. */
export type Moneda = "COP" | "USD" | "EUR";

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
  /** Paquete "express" de consolidador: la imagen (flyer) ES el contenido.
   *  Oculta las secciones autogeneradas (itinerario, incluye, FAQ, reseñas) que
   *  serían inventadas, y muestra el flyer completo + CTA a WhatsApp. */
  flyer?: boolean;
  /** Moneda del precio. Def. COP. */
  moneda?: Moneda;
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

/** Tipos sugeridos de alojamiento. El operador puede crear otros (texto libre). */
export const TIPOS_ALOJAMIENTO_SUGERIDOS = [
  "Finca",
  "Apartamento",
  "Cabaña",
  "Casa",
  "Glamping",
  "Habitación",
] as const;

/** Sección del producto de estadía (misma estructura, distinta vitrina). */
export type SeccionEstadia = "alojamiento" | "hotel";

/**
 * Alojamiento en arriendo (fincas, apartamentos, cabañas…) u hotel. Producto
 * propio, tipo Airbnb, pero con reserva por WhatsApp (sin pagos ni calendario).
 * El operador lo administra completo desde el panel. `seccion` decide en qué
 * vitrina pública aparece ("Alojamientos" u "Hoteles").
 */
export interface Alojamiento {
  id: string;
  titulo: string;
  /** Categoría/tipo (texto libre; el operador puede crear nuevas). */
  tipo: string;
  /** Vitrina donde se muestra. Por defecto "alojamiento". */
  seccion?: SeccionEstadia;
  /** Municipio/zona legible, ej. "Salento, Quindío". */
  ubicacion: string;
  imagen: string;
  galeria?: string[];
  /** Precio por noche en COP. */
  precioNoche: number;
  /** Precio anterior (opcional). Si es mayor, se muestra tachado + % de ahorro. */
  precioAntes?: number;
  huespedes: number;
  habitaciones: number;
  camas: number;
  banos: number;
  /** Mínimo de noches (opcional). */
  minNoches?: number;
  /** Amenidades (Piscina, WiFi, Cocina, Parqueadero…). */
  amenidades: string[];
  descripcion: string;
  /** Sello opcional para resaltar la tarjeta (ej. "Más reservada"). */
  etiqueta?: string | null;
  /** Si true, aparece en el bloque destacado del inicio. */
  destacado?: boolean;
  /** Si false, no aparece en el sitio público (borrador). */
  publicado: boolean;
  createdAt?: string;
}

/**
 * Parque / atracción (Parque del Café, Panaca, parques temáticos…). Producto de
 * entrada por día — sin noches. Reserva por WhatsApp. El operador lo administra
 * completo desde el panel.
 */
export interface Parque {
  id: string;
  nombre: string;
  /** Tipo/categoría libre (Temático, Natural, Acuático…). */
  tipo: string;
  ubicacion: string;
  imagen: string;
  galeria?: string[];
  /** Precio de la entrada "desde". */
  precioDesde: number;
  precioAntes?: number;
  /** Moneda del precio. Def. COP. */
  moneda?: Moneda;
  /** Horario legible (ej. "Mar–Dom · 9:00 a.m. – 6:00 p.m."). */
  horario?: string;
  /** Qué incluye la entrada (atracciones, shows…). */
  incluye: string[];
  descripcion: string;
  etiqueta?: string | null;
  destacado?: boolean;
  publicado: boolean;
  createdAt?: string;
}

export type EstadoLead = "nuevo" | "contactado" | "cotizado" | "ganado" | "perdido";

export interface Lead {
  id: string;
  email: string;
  telefono?: string;
  /** De dónde vino el lead (sección/landing). */
  origen: string;
  /** Etapa en el pipeline de seguimiento (CRM). */
  estado?: EstadoLead;
  /** Notas internas del asesor. */
  notas?: string;
  /** Nombre de quien lo refirió (programa de referidos), si aplica. */
  referidoPor?: string;
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
  /** Número/identificación del Registro Nacional de Turismo (etiqueta corta). */
  rnt: string;
  /** Fecha de inscripción/vigencia del RNT (texto legible). Vacío si no aplica. */
  rntFecha: string;
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
