import { trackWhatsApp } from "@/lib/store";

// Endpoint público de telemetría mínima (clics a WhatsApp). Fire-and-forget.
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.evento === "whatsapp" && typeof body?.ubicacion === "string") {
      await trackWhatsApp(body.ubicacion.slice(0, 120));
    }
  } catch {
    // ignorar cuerpos inválidos
  }
  return new Response(null, { status: 204 });
}
