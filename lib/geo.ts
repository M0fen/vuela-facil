// lib/geo.ts — Tipos, origen y builders de datos para el globo de destinos.
//
// Sin dependencias de three / react-globe.gl: solo produce estructuras planas
// (memoizables) que el componente WebGL consume vía props. Así el fallback 2D
// y la lista accesible comparten EXACTAMENTE los mismos datos y colores.

export type TipoDestino =
  | "playa"
  | "naturaleza"
  | "ciudad"
  | "aventura"
  | "internacional";

export interface Coord {
  nombre: string;
  lat: number;
  lng: number;
}

export interface Destino {
  id: string;
  nombre: string;
  pais: string;
  lat: number;
  lng: number;
  tipo: TipoDestino;
  /** Si hay paquete comprable → abre el modal; si no → WhatsApp de cotización. */
  paqueteId?: string;
  destacado?: boolean;
  /** Foto opcional (para la tarjeta de destinos sin paquete). */
  imagen?: string;
  /** Descripción corta opcional (tarjeta de destinos sin paquete). */
  descripcionCorta?: string;
}

export interface RutaCrucero {
  id: string;
  nombre: string;
  paqueteId?: string;
  embarque: Coord;
  /** Puertos en orden de navegación. */
  puertos: Coord[];
}

/** Pereira: origen por defecto de los vuelos. */
export const ORIGEN: Coord = { nombre: "Pereira", lat: 4.8133, lng: -75.6961 };

/** Orígenes de vuelo seleccionables ("Volar desde"). */
export const ORIGENES: { id: string; nombre: string; lat: number; lng: number }[] = [
  { id: "pereira", nombre: "Pereira", lat: 4.8133, lng: -75.6961 },
  { id: "bogota", nombre: "Bogotá", lat: 4.711, lng: -74.0721 },
  { id: "medellin", nombre: "Medellín", lat: 6.2442, lng: -75.5812 },
];

/** Encuadre para "Ver destinos en Colombia" (separa el racimo). */
export const POV_COLOMBIA = { lat: 4.6, lng: -73.8, altitude: 1.0 } as const;

/** Comando imperativo de cámara que la sección envía al globo. */
export type ComandoGlobo =
  | { kind: "fly"; lat: number; lng: number; alt: number }
  | { kind: "colombia" }
  | { kind: "reset" };

// --- Colores de marca por tipo (tokens de @theme) --------------------------

export const COLOR = {
  navy: "#0d2c54",
  coral: "#e8631a",
  amber: "#f4a93c",
  ivory: "#f7f3ec",
  sky: "#5fb5e6",
  emerald: "#2bb673",
} as const;

export function colorDestino(tipo: TipoDestino): string {
  switch (tipo) {
    case "playa":
      return COLOR.sky;
    case "naturaleza":
      return COLOR.emerald;
    case "ciudad":
      return COLOR.amber;
    case "aventura":
      return COLOR.coral;
    case "internacional":
      return COLOR.coral;
  }
}

export const etiquetaTipo: Record<TipoDestino, string> = {
  playa: "Playa",
  naturaleza: "Naturaleza",
  ciudad: "Ciudad",
  aventura: "Aventura",
  internacional: "Internacional",
};

// --- Builders (estructuras planas para react-globe.gl) ---------------------
// Son funciones puras: la misma entrada produce la misma salida, así el
// componente puede memoizarlas con useMemo y react-globe.gl no reconstruye
// objetos por frame.

export interface ArcoDato {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  /** id del destino o crucero, para el clic. */
  refId: string;
}

export interface PuntoDato {
  /** Clave única estable (para mapear marcador↔DOM sin colisiones). */
  key: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  tipo: "origen" | "destino" | "puerto";
  /** id del destino o del crucero (para clic/highlight); ausente solo en el origen. */
  refId?: string;
  label: string;
  destacado?: boolean;
}

export interface RutaDato {
  /** Polilínea [lat, lng] en orden de navegación, con loop cerrado. */
  coords: [number, number][];
  color: string;
  refId: string;
}

/** Arcos origen→destino (vuelos). El origen es configurable ("Volar desde"). */
export function buildArcos(destinos: Destino[], origen: Coord = ORIGEN): ArcoDato[] {
  return destinos.map((d) => ({
    startLat: origen.lat,
    startLng: origen.lng,
    endLat: d.lat,
    endLng: d.lng,
    color: [COLOR.coral, colorDestino(d.tipo)],
    refId: d.id,
  }));
}

/** Arco origen→embarque para cada crucero (el viaje en avión al puerto). */
export function buildArcosCrucero(rutas: RutaCrucero[], origen: Coord = ORIGEN): ArcoDato[] {
  return rutas.map((r) => ({
    startLat: origen.lat,
    startLng: origen.lng,
    endLat: r.embarque.lat,
    endLng: r.embarque.lng,
    color: [COLOR.coral, COLOR.amber],
    refId: r.id,
  }));
}

/** Puntos: origen, destinos y puertos de crucero. */
export function buildPuntos(
  destinos: Destino[],
  rutas: RutaCrucero[],
  origen: Coord = ORIGEN,
): PuntoDato[] {
  const puntos: PuntoDato[] = [
    {
      key: "origen",
      lat: origen.lat,
      lng: origen.lng,
      size: 0.9,
      color: COLOR.coral,
      tipo: "origen",
      label: origen.nombre,
    },
  ];
  for (const d of destinos) {
    puntos.push({
      key: `d:${d.id}`,
      lat: d.lat,
      lng: d.lng,
      size: d.destacado ? 0.7 : 0.5,
      color: colorDestino(d.tipo),
      tipo: "destino",
      refId: d.id,
      label: d.nombre,
      destacado: d.destacado,
    });
  }
  for (const r of rutas) {
    r.puertos.forEach((p, i) => {
      puntos.push({
        key: `p:${r.id}:${i}`,
        lat: p.lat,
        lng: p.lng,
        size: 0.35,
        color: COLOR.ivory,
        tipo: "puerto",
        refId: r.id, // clic en un puerto → abre el crucero
        label: p.nombre,
      });
    });
  }
  return puntos;
}

/** Rutas de crucero como polilínea cerrada (regresa al puerto de embarque). */
export function buildRutas(rutas: RutaCrucero[]): RutaDato[] {
  return rutas.map((r) => {
    const coords = r.puertos.map((p) => [p.lat, p.lng] as [number, number]);
    if (coords.length > 1) coords.push(coords[0]); // cierra el loop
    return { coords, color: COLOR.amber, refId: r.id };
  });
}

// --- Proyección 2D (equirectangular) para el póster/fallback SVG -----------
// Encuadre que enmarca nuestros destinos (Américas + un punto en Europa).

export const MAPA_BOUNDS = { minLng: -92, maxLng: 8, minLat: -10, maxLat: 46 } as const;

/** Proyecta (lng,lat) a coordenadas SVG dentro de un lienzo width×height. */
export function proyectar(
  lng: number,
  lat: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = MAPA_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return { x, y };
}
