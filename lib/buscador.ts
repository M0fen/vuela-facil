import type { Categoria, Paquete } from "./types";

// ---------------------------------------------------------------------------
// Lógica del buscador, compartida por el Hero (conteo en vivo) y la sección de
// Paquetes (lista filtrada). Una sola fuente de verdad para que ambos coincidan.
// Filtramos SOLO por lo que podemos honrar de verdad con el catálogo real:
// categoría, destino y presupuesto. Viajeros y mes son informativos y viajan a
// la cotización de WhatsApp (no recortan la grilla, para no mostrar resultados
// vacíos por algo que igual ajustamos a mano).
// ---------------------------------------------------------------------------

export type Filtro = "Todos" | Categoria;

export interface Busqueda {
  categoria: Filtro;
  /** Texto de destino real (nombre de paquete o país); "" = cualquiera. */
  destino: string;
  /** Rango de presupuesto por persona, en COP. max Infinity = sin tope. */
  presupuestoMin: number;
  presupuestoMax: number;
  /** true = mostrar solo ofertas express de consolidador (paquetes con flyer). */
  soloConsolidador: boolean;
  /** Informativos (van a la cotización, no filtran la grilla). */
  viajeros: number;
  mes: string;
}

export const BUSQUEDA_INICIAL: Busqueda = {
  categoria: "Todos",
  destino: "",
  presupuestoMin: 0,
  presupuestoMax: Infinity,
  soloConsolidador: false,
  viajeros: 2,
  mes: "",
};

/** Rangos de presupuesto para el desplegable. */
export const PRESUPUESTOS: { label: string; min: number; max: number }[] = [
  { label: "Hasta $2.000.000", min: 0, max: 2_000_000 },
  { label: "$2 – 4 millones", min: 2_000_000, max: 4_000_000 },
  { label: "$4 – 8 millones", min: 4_000_000, max: 8_000_000 },
  { label: "Más de $8 millones", min: 8_000_000, max: Infinity },
];

/** Categorías que SÍ tienen inventario (para las pestañas del buscador). */
export function categoriasConInventario(paquetes: Paquete[]): Filtro[] {
  const presentes = new Set<Categoria>(paquetes.map((p) => p.categoria));
  const orden: Categoria[] = ["Playa", "Eje Cafetero", "Internacional", "Cruceros", "Aventura", "Luna de Miel"];
  return ["Todos", ...orden.filter((c) => presentes.has(c))];
}

/** Lista de destinos reales del catálogo (para el desplegable de destino). */
export function destinosDisponibles(paquetes: Paquete[]): string[] {
  return Array.from(new Set(paquetes.map((p) => p.destino))).sort((a, b) => a.localeCompare(b));
}

/** ¿Hay al menos una oferta de consolidador? (para mostrar el chip de filtro). */
export function hayConsolidadores(paquetes: Paquete[]): boolean {
  return paquetes.some((p) => p.flyer);
}

export function hayPresupuesto(b: Busqueda): boolean {
  return b.presupuestoMin > 0 || b.presupuestoMax !== Infinity;
}

/** ¿Hay algún filtro activo respecto al estado inicial? */
export function hayFiltros(b: Busqueda): boolean {
  return b.categoria !== "Todos" || b.destino !== "" || hayPresupuesto(b) || b.soloConsolidador;
}

/** Aplica el filtro real (categoría + destino + presupuesto + consolidador). */
export function filtrarPaquetes(paquetes: Paquete[], b: Busqueda): Paquete[] {
  return paquetes.filter((p) => {
    if (b.soloConsolidador && !p.flyer) return false;
    if (b.categoria !== "Todos" && p.categoria !== b.categoria) return false;
    if (b.destino && !`${p.destino} ${p.pais}`.toLowerCase().includes(b.destino.toLowerCase())) {
      return false;
    }
    if (p.precio < b.presupuestoMin || p.precio > b.presupuestoMax) return false;
    return true;
  });
}
