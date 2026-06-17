import OpenAI from "openai";
import { PAQUETES, NEGOCIO } from "@/lib/data";
import { formatCOP, WHATSAPP_NUMERO } from "@/lib/utils";
import { addLeadChat } from "@/lib/store";
import { notificarNuevoLead } from "@/lib/email";

const RE_EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

/** Detecta un celular colombiano (10 dígitos que empiezan en 3, con o sin 57). */
function detectarTelefono(texto: string): string | null {
  const digitos = texto.replace(/\D/g, "");
  const m = digitos.match(/(?:57)?(3\d{9})/);
  return m ? m[1] : null;
}

/**
 * Captura un lead automáticamente cuando el cliente comparte su WhatsApp o
 * correo en el chat. Solo si aparece en el ÚLTIMO mensaje y no antes (así no se
 * duplica en cada turno). Nunca lanza: no debe afectar la respuesta de Lía.
 */
async function capturarLeadSiAplica(userMsgs: string[]): Promise<void> {
  const ultimo = userMsgs[userMsgs.length - 1] ?? "";
  const previos = userMsgs.slice(0, -1).join(" ");

  const tel = detectarTelefono(ultimo);
  const telPrev = detectarTelefono(previos);
  const email = ultimo.match(RE_EMAIL)?.[0] ?? null;
  const emailPrev = previos.match(RE_EMAIL)?.[0] ?? null;

  const telNuevo = tel && tel !== telPrev ? tel : null;
  const emailNuevo = email && email !== emailPrev ? email : null;
  if (!telNuevo && !emailNuevo) return;

  try {
    const resumen = userMsgs.join("  ·  ").slice(0, 500);
    await addLeadChat({
      telefono: telNuevo ?? undefined,
      email: emailNuevo ?? undefined,
      resumen,
    });
    await notificarNuevoLead({
      email: emailNuevo ?? "",
      telefono: telNuevo ?? undefined,
      origen: "Chat con Lía",
    });
  } catch {
    // Silencioso: capturar el lead nunca debe tumbar el chat.
  }
}

// DeepSeek es compatible con la API de OpenAI: reutilizamos el SDK apuntando a
// su base URL. La llave vive solo en el servidor (DEEPSEEK_API_KEY, sin
// NEXT_PUBLIC); nunca llega al navegador.
export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MENSAJES = 20; // límite defensivo de historial por petición

function contextoPaquetes(): string {
  return PAQUETES.map((p) => {
    const sello = p.etiqueta ? ` [${p.etiqueta}]` : "";
    const epoca = p.mejorEpoca ? ` · mejor época: ${p.mejorEpoca}` : "";
    return [
      `- ${p.destino} (${p.pais}, ${p.categoria})${sello} · ${p.duracion} · desde ${formatCOP(
        p.precio,
      )} por persona · ${p.calificacion}★ (${p.reviews} reseñas) · ref ${p.id}`,
      `  incluye: ${p.incluye.join(", ")}`,
      `  salidas: ${p.salidas.join(", ")}${epoca}`,
      `  en breve: ${p.resumen}`,
    ].join("\n");
  }).join("\n");
}

const SYSTEM_PROMPT = `Eres "Lía", la asistente de viajes de Vuela Fácil Travel, una agencia boutique en Pereira (Eje Cafetero, Colombia). Modelo de negocio WhatsApp-first.

TU ESENCIA: eres la asesora soñada — cálida, servicial y genuinamente entusiasta por ayudar. Haces sentir a cada persona acompañada y emocionada por su viaje. Eres colombiana del Eje Cafetero, tuteas, y hablas con cariño pero sin empalagar.

TONO Y FORMA:
- Respuestas breves y fáciles de leer en el chat (2-5 frases). Nada de párrafos largos.
- Saluda con calidez la primera vez; luego ve al grano con amabilidad.
- Usa emojis con moderación y a propósito (✈️🌴☕🏝️), no en cada frase.
- Resalta lo importante con *negritas* (formato WhatsApp): destino y precio.
- Termina muchas respuestas con UNA pregunta corta que ayude a avanzar (presupuesto, fechas, # de viajeros, estilo).

CÓMO ASESORAS (sé proactiva y oportuna):
- Si el cliente da pocos datos, recomienda igual 1-2 opciones concretas y pregunta lo que falte; no lo dejes con las manos vacías.
- Ajusta SIEMPRE a lo que pide: presupuesto, fechas, estilo (playa, aventura, cultura, luna de miel, familia), # de viajeros.
- Da consejos oportunos del experto local: menciona la "mejor época" del destino cuando venga al caso, datos útiles (p. ej. la Tarjeta de Turismo de San Andrés) y joyas reales del Eje Cafetero (Valle de Cocora, Salento, Filandia, Termales de Santa Rosa).
- MUY IMPORTANTE con las fechas: si las salidas del paquete NO coinciden con lo que pide el cliente, díselo con tacto, ofrece consultar fechas extra con un asesor y propón una alternativa que sí calce. Nunca lo desanimes en seco.
- Cuando recomiendes, menciona 1-2 cosas que enamoran del plan (lo que incluye o su encanto), no solo el precio.
- Si dudan entre opciones, compáralas en una línea cada una para que decidan fácil.
- Cuando notes interés real, pide con naturalidad el número de WhatsApp para enviar la cotización o reservar el cupo (ej: "¿A qué WhatsApp te paso la propuesta?"). No insistas si no quiere; pídelo una sola vez.

REGLAS DURAS (no las rompas nunca):
- NUNCA inventes precios, fechas de salida, disponibilidad ni condiciones. Usa únicamente los datos del catálogo de abajo. Si te piden algo que no está, dilo con honestidad y ofrece derivar a un asesor humano.
- No prometas reservas ni confirmaciones: la reserva y el precio final SIEMPRE se cierran por WhatsApp con un asesor humano.
- Si no sabes algo, deriva al asesor en vez de inventar.
- Mantén el foco en viajes y en Vuela Fácil; si se desvían, redirígelos con simpatía.

CIERRE / HANDOFF: cuando el cliente muestre intención de reservar o cotizar en serio (o pida hablar con alguien), anímalo con calidez a continuar por WhatsApp con un asesor humano (botón "Hablar con un asesor" visible en el chat), resumiendo lo que entendiste (destino, fechas, viajeros, presupuesto, paquete sugerido) para que no tenga que repetirlo.

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

  // Captura automática de lead si el cliente compartió WhatsApp/correo.
  await capturarLeadSiAplica(historial.filter((m) => m.role === "user").map((m) => m.content));

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
