import "server-only";
import { put, list, del } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import type { Analytics, EstadoReserva, Guia, Lead, Paquete, Promo, Reserva, Testimonio } from "./types";
import type { Destino } from "./geo";
import { GUIAS, PAQUETES, PROMO, TESTIMONIOS } from "./data";
import { DESTINOS } from "./destinos";

// ---------------------------------------------------------------------------
// Capa de datos sobre Vercel Blob (diseño "Blob-only", JSON + imágenes).
// - Documentos mutables (paquetes/promo/testimonios) → un JSON por documento,
//   sin sufijo aleatorio y con overwrite, para tener una ruta estable.
// - Leads → un archivo por lead (append-only), así no hay choques de escritura.
// - Si un documento aún no existe en Blob, se usa el valor semilla de lib/data.ts.
//   Solo se persiste cuando el admin guarda por primera vez.
// - El sitio público lee a través de unstable_cache con tags; cada escritura
//   invalida el tag para reflejar los cambios al instante (+ revalidate de respaldo).
// ---------------------------------------------------------------------------

const KEYS = {
  paquetes: "data/packages.json",
  promo: "data/promo.json",
  testimonios: "data/testimonios.json",
  guias: "data/guias.json",
  destinos: "data/destinos.json",
} as const;

const LEADS_PREFIX = "data/leads/";
const RESERVAS_PREFIX = "data/reservas/";

const TAGS = {
  paquetes: "paquetes",
  promo: "promo",
  testimonios: "testimonios",
  guias: "guias",
  destinos: "destinos",
} as const;

const putOpts = {
  access: "public" as const,
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  cacheControlMaxAge: 0,
};

async function readDoc<T>(key: string, fallback: T): Promise<T> {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    const blob = blobs.find((b) => b.pathname === key);
    if (!blob) return fallback;
    // Cache-bust para evitar respuestas obsoletas del CDN tras un overwrite.
    const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function writeDoc<T>(key: string, data: T): Promise<void> {
  await put(key, JSON.stringify(data, null, 2), putOpts);
}

// --- Lecturas frescas (para el panel y las acciones) -----------------------

export const readPaquetes = () => readDoc<Paquete[]>(KEYS.paquetes, PAQUETES);
export const readPromo = () => readDoc<Promo>(KEYS.promo, PROMO);
export const readTestimonios = () => readDoc<Testimonio[]>(KEYS.testimonios, TESTIMONIOS);
export const readGuias = () => readDoc<Guia[]>(KEYS.guias, GUIAS);

// --- Lecturas cacheadas (para el sitio público) ----------------------------

export const getPaquetes = unstable_cache(readPaquetes, ["paquetes"], {
  tags: [TAGS.paquetes],
  revalidate: 300,
});
export const getPromo = unstable_cache(readPromo, ["promo"], {
  tags: [TAGS.promo],
  revalidate: 300,
});
export const getTestimonios = unstable_cache(readTestimonios, ["testimonios"], {
  tags: [TAGS.testimonios],
  revalidate: 300,
});
export const getGuias = unstable_cache(readGuias, ["guias"], {
  tags: [TAGS.guias],
  revalidate: 300,
});

export async function getPaquete(id: string): Promise<Paquete | null> {
  const paquetes = await getPaquetes();
  return paquetes.find((p) => p.id === id) ?? null;
}

/** Solo guías publicadas, ordenadas por fecha (para el sitio público). */
export async function getGuiasPublicadas(): Promise<Guia[]> {
  const guias = await getGuias();
  return guias
    .filter((g) => g.publicada)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getGuia(slug: string): Promise<Guia | null> {
  const guias = await getGuias();
  return guias.find((g) => g.slug === slug) ?? null;
}

// --- Escrituras (invalidan el tag para refrescar el sitio público) ---------

export async function savePaquetes(paquetes: Paquete[]): Promise<void> {
  await writeDoc(KEYS.paquetes, paquetes);
  revalidateTag(TAGS.paquetes);
}

export async function savePromo(promo: Promo): Promise<void> {
  await writeDoc(KEYS.promo, promo);
  revalidateTag(TAGS.promo);
}

export async function saveTestimonios(testimonios: Testimonio[]): Promise<void> {
  await writeDoc(KEYS.testimonios, testimonios);
  revalidateTag(TAGS.testimonios);
}

export async function saveGuias(guias: Guia[]): Promise<void> {
  await writeDoc(KEYS.guias, guias);
  revalidateTag(TAGS.guias);
}

// --- Destinos (editables desde el panel; alimentan el globo) ---------------

export const readDestinos = () => readDoc<Destino[]>(KEYS.destinos, DESTINOS);

export const getDestinos = unstable_cache(readDestinos, ["destinos"], {
  tags: [TAGS.destinos],
  revalidate: 300,
});

export async function saveDestinos(destinos: Destino[]): Promise<void> {
  await writeDoc(KEYS.destinos, destinos);
  revalidateTag(TAGS.destinos);
}

// --- Leads (un archivo por lead) -------------------------------------------

export async function addLead(input: { email: string; telefono?: string; origen: string }): Promise<Lead> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const lead: Lead = {
    id,
    email: input.email,
    telefono: input.telefono?.trim() || undefined,
    origen: input.origen,
    createdAt: new Date().toISOString(),
  };
  await put(`${LEADS_PREFIX}${id}.json`, JSON.stringify(lead, null, 2), putOpts);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  try {
    const { blobs } = await list({ prefix: LEADS_PREFIX });
    const leads = await Promise.all(
      blobs.map(async (b) => {
        const res = await fetch(`${b.url}?t=${Date.now()}`, { cache: "no-store" });
        return res.ok ? ((await res.json()) as Lead) : null;
      }),
    );
    return leads
      .filter((l): l is Lead => l !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function deleteLead(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${LEADS_PREFIX}${id}` });
  await Promise.all(blobs.map((b) => del(b.url)));
}

// --- Reservas (un archivo por reserva, como los leads) ---------------------

export async function addReserva(input: {
  paqueteId: string;
  destino: string;
  fecha: string;
  viajeros: number;
  totalEstimado: number;
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
}): Promise<Reserva> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const reserva: Reserva = {
    id,
    paqueteId: input.paqueteId,
    destino: input.destino,
    fecha: input.fecha,
    viajeros: input.viajeros,
    totalEstimado: input.totalEstimado,
    nombre: input.nombre,
    telefono: input.telefono,
    email: input.email?.trim() || undefined,
    mensaje: input.mensaje?.trim() || undefined,
    estado: "pendiente",
    createdAt: new Date().toISOString(),
  };
  await put(`${RESERVAS_PREFIX}${id}.json`, JSON.stringify(reserva, null, 2), putOpts);
  return reserva;
}

export async function listReservas(): Promise<Reserva[]> {
  try {
    const { blobs } = await list({ prefix: RESERVAS_PREFIX });
    const reservas = await Promise.all(
      blobs.map(async (b) => {
        const res = await fetch(`${b.url}?t=${Date.now()}`, { cache: "no-store" });
        return res.ok ? ((await res.json()) as Reserva) : null;
      }),
    );
    return reservas
      .filter((r): r is Reserva => r !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function getReserva(id: string): Promise<Reserva | null> {
  const reservas = await listReservas();
  return reservas.find((r) => r.id === id) ?? null;
}

export async function updateReserva(
  id: string,
  patch: { estado?: EstadoReserva; notas?: string },
): Promise<void> {
  const actual = await getReserva(id);
  if (!actual) return;
  const merged: Reserva = {
    ...actual,
    estado: patch.estado ?? actual.estado,
    notas: patch.notas !== undefined ? patch.notas.trim() || undefined : actual.notas,
  };
  await put(`${RESERVAS_PREFIX}${id}.json`, JSON.stringify(merged, null, 2), putOpts);
}

export async function deleteReserva(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${RESERVAS_PREFIX}${id}` });
  await Promise.all(blobs.map((b) => del(b.url)));
}

// --- Analítica de conversión (clics a WhatsApp) ----------------------------

export async function readAnalytics(): Promise<Analytics> {
  return readDoc<Analytics>("data/analytics.json", { whatsapp: {} });
}

export async function trackWhatsApp(ubicacion: string): Promise<void> {
  const a = await readAnalytics();
  if (!a.whatsapp) a.whatsapp = {};
  a.whatsapp[ubicacion] = (a.whatsapp[ubicacion] ?? 0) + 1;
  await writeDoc("data/analytics.json", a);
}

// --- Imágenes --------------------------------------------------------------

export async function uploadImage(file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  const blob = await put(`images/${Date.now()}-${safe}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}
