import "server-only";
import { createHash } from "crypto";
import { SITE_URL as SITE } from "./site";

// ---------------------------------------------------------------------------
// Capa de pagos — Wompi (PSE, tarjetas, Nequi, Bancolombia).
//
// Está TODO listo para producción: en cuanto se configuren las credenciales en
// las variables de entorno, el pago online se activa solo. Sin credenciales,
// `pagosActivos()` devuelve false y el sitio sigue funcionando 100% por
// WhatsApp (sin botones de pago), exactamente como hoy.
//
// Variables (ver .env.example):
//   NEXT_PUBLIC_WOMPI_PUBLIC_KEY  → llave pública (publicable) de Wompi
//   WOMPI_INTEGRITY_SECRET        → secreto de integridad (firma del checkout)
//   WOMPI_EVENTS_SECRET           → secreto de eventos (validación del webhook)
//   NEXT_PUBLIC_SITE_URL          → dominio para el redirect de retorno
// ---------------------------------------------------------------------------

const PK = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
const INTEGRITY = process.env.WOMPI_INTEGRITY_SECRET;
const EVENTS = process.env.WOMPI_EVENTS_SECRET;

/** ¿Hay credenciales de pago configuradas? */
export function pagosActivos(): boolean {
  return Boolean(PK && INTEGRITY);
}

export function siteUrl(path = ""): string {
  return `${SITE.replace(/\/$/, "")}${path}`;
}

/**
 * URL del checkout web de Wompi con la firma de integridad. Devuelve null si
 * aún no hay credenciales (el llamador hace fallback a WhatsApp).
 */
export function urlCheckoutWompi(args: {
  referencia: string;
  montoCents: number;
  redirectUrl: string;
}): string | null {
  if (!PK || !INTEGRITY) return null;
  const currency = "COP";
  const firma = createHash("sha256")
    .update(`${args.referencia}${args.montoCents}${currency}${INTEGRITY}`)
    .digest("hex");
  const qs = [
    `public-key=${encodeURIComponent(PK)}`,
    `currency=${currency}`,
    `amount-in-cents=${args.montoCents}`,
    `reference=${encodeURIComponent(args.referencia)}`,
    `redirect-url=${encodeURIComponent(args.redirectUrl)}`,
    `signature:integrity=${firma}`,
  ].join("&");
  return `https://checkout.wompi.co/p/?${qs}`;
}

// --- Webhook -----------------------------------------------------------------

export interface WompiEvento {
  event?: string;
  timestamp?: number | string;
  signature?: { properties?: string[]; checksum?: string };
  data?: {
    transaction?: { id?: string; status?: string; reference?: string; amount_in_cents?: number };
  };
}

function leerRuta(data: unknown, ruta: string): string {
  let cur: unknown = data;
  for (const k of ruta.split(".")) {
    if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k];
    } else {
      return "";
    }
  }
  return cur == null ? "" : String(cur);
}

/** Valida el checksum del evento de Wompi (integridad del webhook). */
export function validarEventoWompi(evento: WompiEvento): boolean {
  if (!EVENTS) return false;
  const props = evento.signature?.properties ?? [];
  const checksum = evento.signature?.checksum ?? "";
  if (!props.length || !checksum) return false;
  let cadena = "";
  for (const ruta of props) cadena += leerRuta(evento.data, ruta);
  cadena += `${evento.timestamp ?? ""}${EVENTS}`;
  const calc = createHash("sha256").update(cadena).digest("hex");
  return calc.toLowerCase() === String(checksum).toLowerCase();
}
