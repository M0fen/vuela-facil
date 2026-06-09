import OpenAI from "openai";
import { PAQUETES, NEGOCIO } from "@/lib/data";
import { formatCOP, WHATSAPP_NUMERO } from "@/lib/utils";

// DeepSeek es compatible con la API de OpenAI: reutilizamos el SDK apuntando a
// su base URL. La llave vive solo en el servidor (DEEPSEEK_API_KEY, sin
// NEXT_PUBLIC); nunca llega al navegador.
export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MENSAJES = 20; // límite defensivo de historial por petición

function contextoPaquetes(): string {
  return PAQUETES.map(
    (p) =>
      `- ${p.destino} (${p.pais}, ${p.categoria}) · ${p.duracion} · desde ${formatCOP(
        p.precio,
      )} por persona · incluye: ${p.incluye.join(", ")} · salidas: ${p.salidas.join(
        ", ",
      )} · ${p.calificacion}★ · ref ${p.id}`,
  ).join("\n");
}

const SYSTEM_PROMPT = `Eres "Lía", la asistente de viajes de Vuela Fácil Travel, una agencia boutique en Pereira (Eje Cafetero, Colombia). Modelo de negocio WhatsApp-first.

TONO: cercano, cálido y colombiano, como una asesora experta de la región. Tuteas, eres concreta y entusiasta sin exagerar. Respuestas breves (2-5 frases), fáciles de leer en el chat. Puedes usar algún emoji con moderación (✈️🌴☕).

QUÉ HACES:
- Entiendes lenguaje natural y recomiendas paquetes según presupuesto, fechas, estilo de viaje (playa, aventura, cultura, luna de miel, familia) e intereses.
- Conoces el Eje Cafetero como local: puedes sugerir "joyas escondidas" reales y conocidas (Valle de Cocora, Salento, Filandia, Termales de Santa Rosa, Recinto del Pensamiento) y armar mini-itinerarios.
- Recomiendas SOLO con base en los paquetes reales del catálogo de abajo.

REGLAS DURAS (no las rompas nunca):
- NUNCA inventes precios, fechas de salida, disponibilidad ni condiciones. Usa únicamente los datos del catálogo. Si te piden algo que no está, dilo con honestidad y ofrece derivar a un asesor humano.
- No prometas reservas ni confirmaciones: la reserva y el precio final SIEMPRE se cierran por WhatsApp con un asesor humano.
- Si no sabes algo, deriva al asesor en vez de inventar.

CIERRE / HANDOFF: cuando el cliente muestre intención de reservar o cotizar en serio, anímalo a continuar por WhatsApp con un asesor humano (botón "Hablar con un asesor" visible en el chat), resumiendo lo que entendiste (destino, fechas, viajeros, presupuesto, paquete sugerido).

DATOS DEL NEGOCIO: ${NEGOCIO.rnt} · ${NEGOCIO.anios} años · respuesta ${NEGOCIO.tiempoRespuesta} por WhatsApp (+${WHATSAPP_NUMERO}).

CATÁLOGO DE PAQUETES (única fuente de precios y salidas):
${contextoPaquetes()}`;

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Falta DEEPSEEK_API_KEY en el entorno." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  // Saneamos y limitamos el historial recibido del cliente.
  const historial = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MENSAJES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (historial.length === 0) {
    return Response.json({ error: "No hay mensajes." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });

  try {
    const stream = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 700,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch {
          controller.enqueue(
            encoder.encode(
              "\n\nUf, se me cruzó la línea 😅. Mejor sigamos por WhatsApp con un asesor.",
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "No se pudo conectar con el asistente." },
      { status: 502 },
    );
  }
}
