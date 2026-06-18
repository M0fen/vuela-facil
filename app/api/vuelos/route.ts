import { precioReferencialVuelo, vuelosActivos } from "@/lib/vuelos";

// Precio referencial de vuelos para el buscador / Lía. Si no hay credenciales,
// responde { activo: false } y el front no muestra nada (UX idéntica a hoy).
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!vuelosActivos()) return Response.json({ activo: false });

  const { searchParams } = new URL(req.url);
  const destino = (searchParams.get("destino") || "").slice(0, 80).trim();
  const origen = (searchParams.get("origen") || "").slice(0, 4).trim() || undefined;
  if (!destino) return Response.json({ activo: true, precio: null });

  const ref = await precioReferencialVuelo(destino, origen);
  return Response.json(
    ref
      ? { activo: true, precio: ref.precio, moneda: ref.moneda, origen: ref.origen }
      : { activo: true, precio: null },
    { headers: { "Cache-Control": "public, max-age=1800" } },
  );
}
