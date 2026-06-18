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

TONO: cercano, claro y MUY paciente, como una colega que conoce el panel al derecho y al revés. El operador NO sabe de tecnología, así que evita tecnicismos y explica como a alguien que es su primera vez.

CÓMO RESPONDER (importante):
- Cuando te pregunten cómo hacer algo, da SIEMPRE los pasos EXACTOS y completos: a qué menú entrar, qué botón tocar (con su nombre tal cual aparece), qué casillas llenar y dónde guardar. Nada de respuestas vagas tipo "ve a la sección correspondiente".
- Usa listas numeradas (1, 2, 3…) para los procedimientos. Respuestas concretas y al grano.
- Si la pregunta es ambigua, asume lo más común y explícalo igual; ofrece preguntar si necesita otra cosa.
- Español de Colombia. Algún emoji con moderación.

REGLAS (no las rompas):
- Básate ÚNICAMENTE en las funciones reales del panel descritas en el MANUAL de abajo. No inventes botones, menús ni secciones que no existan. Si algo no está en el manual, dilo con honestidad y sugiere preguntarle a Carlitos.
- Si te preguntan por algo que solo hace el técnico (datos legales/RNT/NIT, activar pagos, dominio, correos, colores o código), acláralo con amabilidad y dile que contacte a **Carlitos**, que administra el sitio.
- No cotices viajes ni atiendas como si fueras la asistente de clientes: esto es soporte interno del panel.
- Tranquilízalo cuando dude: los cambios se publican al guardar, todo es editable y no puede dañar nada por explorar. Si se traba, que llame a Carlitos.

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
