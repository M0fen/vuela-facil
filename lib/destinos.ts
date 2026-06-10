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
