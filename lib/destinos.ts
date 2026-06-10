// lib/destinos.ts — Datos del globo: destinos y rutas de crucero.
//
// Coordenadas reales (no inventadas). Los destinos con `paqueteId` abren el
// modal del paquete; los que no tienen abren WhatsApp para cotizar. Los
// cruceros se dibujan como ruta entre puertos, no como un punto.

import type { Destino, RutaCrucero } from "./geo";

export const DESTINOS: Destino[] = [
  // --- Con paquete comprable (→ abre el modal) -----------------------------
  {
    id: "san-andres",
    nombre: "San Andrés",
    pais: "Colombia",
    lat: 12.5847,
    lng: -81.7006,
    tipo: "playa",
    paqueteId: "VF-SAI-001",
    destacado: true,
  },
  {
    id: "eje-cafetero",
    nombre: "Eje Cafetero",
    pais: "Colombia",
    lat: 4.6378,
    lng: -75.5703,
    tipo: "naturaleza",
    paqueteId: "VF-EJC-002",
    destacado: true,
  },
  {
    id: "cartagena",
    nombre: "Cartagena",
    pais: "Colombia",
    lat: 10.391,
    lng: -75.4794,
    tipo: "ciudad",
    paqueteId: "VF-CTG-003",
    destacado: true,
  },
  {
    id: "cancun",
    nombre: "Cancún",
    pais: "México",
    lat: 21.1619,
    lng: -86.8515,
    tipo: "internacional",
    paqueteId: "VF-CUN-004",
    destacado: true,
  },
  {
    id: "europa",
    nombre: "Europa",
    pais: "España",
    lat: 40.4168,
    lng: -3.7038,
    tipo: "internacional",
    paqueteId: "VF-EUR-006",
    destacado: true,
  },

  // --- Joyas colombianas (sin paquete aún → WhatsApp "Quiero cotizar …") ---
  {
    id: "guatape",
    nombre: "Guatapé",
    pais: "Colombia",
    lat: 6.2336,
    lng: -75.1636,
    tipo: "naturaleza",
  },
  {
    id: "medellin",
    nombre: "Medellín",
    pais: "Colombia",
    lat: 6.2442,
    lng: -75.5812,
    tipo: "ciudad",
  },
  {
    id: "santa-marta",
    nombre: "Santa Marta / Tayrona",
    pais: "Colombia",
    lat: 11.2408,
    lng: -74.199,
    tipo: "playa",
  },
  {
    id: "amazonas",
    nombre: "Amazonas / Leticia",
    pais: "Colombia",
    lat: -4.215,
    lng: -69.9406,
    tipo: "aventura",
  },
  {
    id: "villa-de-leyva",
    nombre: "Villa de Leyva",
    pais: "Colombia",
    lat: 5.6325,
    lng: -73.5245,
    tipo: "ciudad",
  },
  {
    id: "cano-cristales",
    nombre: "Caño Cristales",
    pais: "Colombia",
    lat: 2.2675,
    lng: -73.7886,
    tipo: "naturaleza",
  },
  {
    id: "providencia",
    nombre: "Providencia",
    pais: "Colombia",
    lat: 13.3487,
    lng: -81.3741,
    tipo: "playa",
  },
  {
    id: "tatacoa",
    nombre: "Desierto de la Tatacoa",
    pais: "Colombia",
    lat: 3.2333,
    lng: -75.1667,
    tipo: "aventura",
  },

  // --- Más Colombia (sin paquete aún → WhatsApp) ---------------------------
  { id: "bogota", nombre: "Bogotá", pais: "Colombia", lat: 4.711, lng: -74.0721, tipo: "ciudad" },
  { id: "cali", nombre: "Cali", pais: "Colombia", lat: 3.4516, lng: -76.532, tipo: "ciudad" },
  { id: "barranquilla", nombre: "Barranquilla", pais: "Colombia", lat: 10.9685, lng: -74.7813, tipo: "ciudad" },
  { id: "nuqui", nombre: "Nuquí", pais: "Colombia", lat: 5.7089, lng: -77.27, tipo: "naturaleza" },
  { id: "capurgana", nombre: "Capurganá", pais: "Colombia", lat: 8.6383, lng: -77.3517, tipo: "playa" },
  { id: "san-gil", nombre: "San Gil", pais: "Colombia", lat: 6.555, lng: -73.133, tipo: "aventura" },
  { id: "mompox", nombre: "Mompox", pais: "Colombia", lat: 9.2417, lng: -74.4258, tipo: "ciudad" },
  { id: "popayan", nombre: "Popayán", pais: "Colombia", lat: 2.4448, lng: -76.6147, tipo: "ciudad" },

  // --- Internacionales (sin paquete aún → WhatsApp) ------------------------
  { id: "punta-cana", nombre: "Punta Cana", pais: "República Dominicana", lat: 18.5601, lng: -68.3725, tipo: "playa" },
  { id: "orlando", nombre: "Orlando", pais: "Estados Unidos", lat: 28.5383, lng: -81.3792, tipo: "internacional" },
  { id: "nueva-york", nombre: "Nueva York", pais: "Estados Unidos", lat: 40.7128, lng: -74.006, tipo: "ciudad" },
  { id: "paris", nombre: "París", pais: "Francia", lat: 48.8566, lng: 2.3522, tipo: "internacional" },
  { id: "roma", nombre: "Roma", pais: "Italia", lat: 41.9028, lng: 12.4964, tipo: "internacional" },
  { id: "cusco", nombre: "Cusco / Machu Picchu", pais: "Perú", lat: -13.532, lng: -71.9675, tipo: "aventura" },
  { id: "galapagos", nombre: "Galápagos", pais: "Ecuador", lat: -0.7437, lng: -90.3136, tipo: "naturaleza" },
  { id: "dubai", nombre: "Dubái", pais: "Emiratos Árabes Unidos", lat: 25.2048, lng: 55.2708, tipo: "internacional" },
];

export const RUTAS_CRUCERO: RutaCrucero[] = [
  {
    id: "crucero-caribe",
    nombre: "Crucero por el Caribe",
    paqueteId: "VF-CRC-005",
    embarque: { nombre: "Cartagena", lat: 10.391, lng: -75.4794 },
    puertos: [
      { nombre: "Cartagena", lat: 10.391, lng: -75.4794 },
      { nombre: "Colón, Panamá", lat: 9.3592, lng: -79.9014 },
      { nombre: "Oranjestad, Aruba", lat: 12.5092, lng: -70.0086 },
      { nombre: "Willemstad, Curazao", lat: 12.1084, lng: -68.9335 },
    ],
  },
];

// --- Países con destinos (para realzarlos en el globo, Módulo A) -----------
// El GeoJSON usa códigos ISO_A3 en inglés; mapeamos desde el `pais` (español).
const ISO_POR_PAIS: Record<string, string> = {
  Colombia: "COL",
  México: "MEX",
  España: "ESP",
  "República Dominicana": "DOM",
  "Estados Unidos": "USA",
  Francia: "FRA",
  Italia: "ITA",
  Perú: "PER",
  Ecuador: "ECU",
  "Emiratos Árabes Unidos": "ARE",
};

/** Set de ISO_A3 de los países que tienen al menos un destino. */
export const PAISES_CON_DESTINOS = new Set(
  DESTINOS.map((d) => ISO_POR_PAIS[d.pais]).filter(Boolean) as string[],
);
