import OpenAI from "openai";
import { requireAdmin } from "@/app/admin/guard";
import { TUTORIAL_OPERADOR } from "@/lib/tutorial-operador";

// Asistente interno para el OPERADOR del panel (no para clientes). Protegido por
// la cookie de admin. Usa DeepSeek y se apoya en el manual del operador como
// única fuente de verdad sobre qué se puede hacer en el panel.
export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };
const MAX_MENSAJES = 16;

const SYSTEM_PROMPT = `Eres "Lía", la asistente interna del PANEL de administración de Vuela Fácil Travel. Tu único usuario es el OPERADOR del negocio (no un cliente). Lo ayudas a entender cómo manejar el contenido del sitio: paquetes (normales y express desde flyer), fotos, promo, guías, testimonios, destinos, leads y reservas.

TONO: cercano, claro y paciente, como una colega que conoce el panel al derecho y al revés. El operador NO es técnico, así que evita tecnicismos. Respuestas breves y accionables; usa pasos numerados cuando expliques cómo hacer algo. Español de Colombia. Puedes usar algún emoji con moderación.

REGLAS (no las rompas):
- Básate ÚNICAMENTE en las funciones reales del panel descritas en el MANUAL de abajo. No inventes botones, menús ni secciones que no existan.
- Si te preguntan por algo que solo hace el técnico (datos legales/RNT/NIT, activar pagos, dominio, correos, colores o código), acláralo con amabilidad y sugiere contactar a quien administra el sitio.
- Si no estás segura de algo, dilo con honestidad; nunca inventes.
- No cotices viajes ni atiendas como si fueras la asistente de clientes: esto es soporte interno del panel.
- Cuando ayude, recuérdale que los cambios se publican al guardar y que no puede dañar nada por explorar.

MANUAL DEL OPERADOR (tu fuente de verdad):
${TUTORIAL_OPERADOR}`;

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Falta DEEPSEEK_API_KEY en el entorno." }, { status: 500 });
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

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
      temperature: 0.4,
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
            encoder.encode("\n\nUy, se me cruzó la línea 😅. Intenta de nuevo en un momento."),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "No se pudo conectar con el asistente." }, { status: 502 });
  }
}
