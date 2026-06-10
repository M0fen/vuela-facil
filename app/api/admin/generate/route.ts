import OpenAI from "openai";
import { requireAdmin } from "@/app/admin/guard";
import { formatCOP } from "@/lib/utils";

// Generación de textos para el panel con DeepSeek (modo JSON). Protegida por la
// cookie de admin (este endpoint NO pasa por el middleware de /admin/*).
export const runtime = "nodejs";
export const maxDuration = 30;

type PaqueteInput = {
  destino?: string;
  pais?: string;
  categoria?: string;
  precio?: string | number;
  duracion?: string;
  duracionDias?: string | number;
  incluye?: string;
};

type TestimonioInput = {
  nombre?: string;
  ciudad?: string;
  destino?: string;
  rating?: string | number;
  notas?: string;
};

type GuiaInput = {
  titulo?: string;
  destino?: string;
  etiquetas?: string;
};

function promptPaquete(input: PaqueteInput): { system: string; user: string } {
  const precio = Number(input.precio) || 0;
  return {
    system:
      "Eres redactor de viajes de Vuela Fácil Travel (Pereira, Colombia). Escribes copy de marketing preciso, cálido y en español de Colombia para paquetes reales. No inventes datos que contradigan lo dado (precio, duración, qué incluye). Devuelve EXCLUSIVAMENTE un objeto JSON.",
    user: `Genera contenido para este paquete y devuelve un JSON con las claves exactas "resumen", "mejorEpoca" y "comoLlegar".
- "resumen": 1-2 frases atractivas para encabezado y SEO.
- "mejorEpoca": 2-3 frases sobre la mejor temporada para viajar a ${input.destino}.
- "comoLlegar": 2-3 frases sobre cómo llegar / logística desde Colombia (vuelos, traslados, documentación si aplica).

Datos del paquete:
- Destino: ${input.destino} (${input.pais})
- Categoría: ${input.categoria}
- Duración: ${input.duracion}
- Precio por persona: ${formatCOP(precio)}
- Incluye: ${input.incluye?.replace(/\n/g, ", ")}`,
  };
}

function promptTestimonio(input: TestimonioInput): { system: string; user: string } {
  return {
    system:
      "Redactas reseñas de clientes para Vuela Fácil Travel a partir de NOTAS REALES que aporta el operador. Regla absoluta: no inventes hechos, lugares ni detalles que no estén en las notas; solo redacta con naturalidad lo que el cliente realmente vivió. Primera persona, tono cálido y colombiano, 2-3 frases. Devuelve EXCLUSIVAMENTE un objeto JSON.",
    user: `Redacta el texto de una reseña en primera persona y devuelve un JSON con la clave exacta "texto".
Basándote SOLO en estas notas reales del cliente (no agregues hechos nuevos):
"${input.notas || ""}"

Contexto (no inventar más allá de esto):
- Cliente: ${input.nombre} (${input.ciudad})
- Destino: ${input.destino}
- Calificación: ${input.rating}/5`,
  };
}

function promptGuia(input: GuiaInput): { system: string; user: string } {
  return {
    system:
      "Eres redactor de contenido de viajes de Vuela Fácil Travel (Pereira, Colombia). Escribes guías locales, útiles y auténticas en español de Colombia, con joyas escondidas y consejos reales (sin inventar datos imposibles). Devuelve EXCLUSIVAMENTE un objeto JSON.",
    user: `Escribe una guía de viaje y devuelve un JSON con las claves exactas "resumen" y "contenido".
- "resumen": 1-2 frases atractivas para la tarjeta y SEO.
- "contenido": el cuerpo en *Markdown* (usa ## para secciones, listas con -, **negritas** y alguna > cita). 250-400 palabras, tono cálido y experto local. No incluyas el título principal (H1).

Tema/Título: ${input.titulo || input.destino}
Destino: ${input.destino}
Etiquetas: ${input.etiquetas || ""}`,
  };
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Falta DEEPSEEK_API_KEY." }, { status: 500 });
  }

  let kind: string;
  let input: PaqueteInput & TestimonioInput & GuiaInput;
  try {
    const body = await req.json();
    kind = String(body?.kind ?? "");
    input = body?.input ?? {};
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  if (kind === "testimonio" && !input.notas?.trim()) {
    return Response.json(
      { error: "Escribe primero las notas reales del cliente para redactar la reseña." },
      { status: 400 },
    );
  }
  if (kind === "paquete" && !input.destino?.trim()) {
    return Response.json({ error: "Indica al menos el destino." }, { status: 400 });
  }
  if (kind === "guia" && !input.titulo?.trim() && !input.destino?.trim()) {
    return Response.json({ error: "Indica un título o destino para la guía." }, { status: 400 });
  }

  const { system, user } =
    kind === "testimonio"
      ? promptTestimonio(input)
      : kind === "guia"
        ? promptGuia(input)
        : promptPaquete(input);

  const client = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: kind === "testimonio" ? 0.6 : 0.8,
      max_tokens: kind === "guia" ? 1800 : 600,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const data = JSON.parse(raw);
    return Response.json({ data });
  } catch {
    return Response.json(
      { error: "No se pudo generar el texto. Intenta de nuevo." },
      { status: 502 },
    );
  }
}
