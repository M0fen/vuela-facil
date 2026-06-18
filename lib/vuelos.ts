import "server-only";
import { unstable_cache } from "next/cache";

// ---------------------------------------------------------------------------
// Precio referencial de vuelos (Nivel 1) — vía API de afiliados (Travelpayouts).
//
// "Listo para credenciales": sin TRAVELPAYOUTS_TOKEN, `vuelosActivos()` es false
// y todo el sitio funciona idéntico (cotización por WhatsApp, sin precios de
// vuelo). Con token, el buscador y Lía pueden mostrar "vuelos desde $X".
//
// IMPORTANTE: los precios son REFERENCIALES (cacheados por el proveedor), no
// tarifas garantizadas. Siempre se muestran rotulados como tal; el precio final
// lo confirma el asesor/consolidador.
//
// Variables (.env.local):
//   TRAVELPAYOUTS_TOKEN        → token de la API de Travelpayouts (requerido)
//   TRAVELPAYOUTS_MARKER       → id de afiliado (opcional, para enlaces con comisión)
//   VUELOS_ORIGEN_DEFAULT      → IATA del origen por defecto (opcional, def. "PEI")
// ---------------------------------------------------------------------------

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const ORIGEN_DEFAULT = (process.env.VUELOS_ORIGEN_DEFAULT || "PEI").toUpperCase();

/** ¿Hay credenciales de la API de vuelos configuradas? */
export function vuelosActivos(): boolean {
  return Boolean(TOKEN);
}

// Mapa destino (texto del catálogo) → IATA. Solo donde un vuelo tiene sentido
// (no para cruceros ni para el Eje Cafetero local). Ampliable a futuro.
const IATA: { match: RegExp; iata: string }[] = [
  { match: /san andr/i, iata: "ADZ" },
  { match: /cartagena/i, iata: "CTG" },
  { match: /canc[uú]n|riviera maya/i, iata: "CUN" },
  { match: /santa marta/i, iata: "SMR" },
  { match: /bogot/i, iata: "BOG" },
  { match: /medell[ií]n/i, iata: "MDE" },
  { match: /punta cana/i, iata: "PUJ" },
  { match: /madrid|europa/i, iata: "MAD" },
  { match: /miami/i, iata: "MIA" },
  { match: /orlando/i, iata: "MCO" },
];

export function iataDeDestino(destino: string): string | null {
  return IATA.find((x) => x.match.test(destino))?.iata ?? null;
}

export interface VueloReferencial {
  precio: number;
  moneda: "COP";
  origen: string;
  destino: string;
}

async function fetchCheapest(origen: string, destino: string): Promise<VueloReferencial | null> {
  if (!TOKEN) return null;
  try {
    const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
    url.searchParams.set("origin", origen);
    url.searchParams.set("destination", destino);
    url.searchParams.set("currency", "cop");
    url.searchParams.set("sorting", "price");
    url.searchParams.set("one_way", "false");
    url.searchParams.set("limit", "1");
    url.searchParams.set("token", TOKEN);

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Array<{ price?: number }> };
    const precio = Number(json?.data?.[0]?.price);
    if (!precio || !Number.isFinite(precio)) return null;
    return { precio, moneda: "COP", origen, destino };
  } catch {
    // Nunca lanza: una falla de la API de vuelos no debe afectar la cotización.
    return null;
  }
}

// Cache por ruta (6 h): los precios referenciales no necesitan ser al segundo,
// y evita golpear la API en cada búsqueda.
const cheapestCached = unstable_cache(
  (origen: string, destino: string) => fetchCheapest(origen, destino),
  ["vuelo-referencial"],
  { revalidate: 21600, tags: ["vuelos"] },
);

/** Precio referencial ida y vuelta más barato hacia un destino del catálogo. */
export async function precioReferencialVuelo(
  destinoTexto: string,
  origen = ORIGEN_DEFAULT,
): Promise<VueloReferencial | null> {
  if (!TOKEN) return null;
  const iata = iataDeDestino(destinoTexto);
  if (!iata || iata === origen.toUpperCase()) return null;
  return cheapestCached(origen.toUpperCase(), iata);
}
