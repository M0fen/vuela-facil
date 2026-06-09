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

/** Datos del negocio para señales de confianza (barra de confianza, footer, SEO). */
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
