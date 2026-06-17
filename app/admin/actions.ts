"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Categoria, EstadoLead, EstadoReserva, Guia, Paquete, Promo, Testimonio } from "@/lib/types";
import type { Destino, TipoDestino } from "@/lib/geo";
import {
  readPaquetes,
  savePaquetes,
  readPromo,
  savePromo,
  readTestimonios,
  saveTestimonios,
  readGuias,
  saveGuias,
  readDestinos,
  saveDestinos,
  deleteLead,
  updateLead,
  updateReserva,
  deleteReserva,
  uploadImage,
} from "@/lib/store";
import { requireAdmin } from "./guard";

const ESTADOS_RESERVA: EstadoReserva[] = ["pendiente", "en_proceso", "confirmada", "cancelada"];
const ESTADOS_LEAD: EstadoLead[] = ["nuevo", "contactado", "cotizado", "ganado", "perdido"];

const TIPOS_DESTINO: TipoDestino[] = ["playa", "naturaleza", "ciudad", "aventura", "internacional"];

const CATEGORIAS: Categoria[] = [
  "Playa",
  "Eje Cafetero",
  "Cruceros",
  "Internacional",
  "Aventura",
  "Luna de Miel",
];

// --- helpers ---------------------------------------------------------------

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
// Decimales (calificación, lat, lng): conserva el punto decimal y el signo.
const num = (fd: FormData, k: string) => Number(String(fd.get(k) ?? "0").replace(/[^\d.-]/g, "")) || 0;
// Enteros (precio, reseñas, días…): quita TODO lo que no sea dígito, así
// "1.890.000" o "$1.890.000 COP" (formato colombiano) se leen como 1890000.
const int = (fd: FormData, k: string) => Number(String(fd.get(k) ?? "0").replace(/[^\d]/g, "")) || 0;
const lines = (fd: FormData, k: string) =>
  String(fd.get(k) ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function uploadFiles(files: File[]): Promise<string[]> {
  const valid = files.filter((f) => f && f.size > 0);
  return Promise.all(valid.map((f) => uploadImage(f)));
}

// --- Paquetes --------------------------------------------------------------

export async function savePaqueteAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const paquetes = await readPaquetes();
  const idActual = str(formData, "id");
  const esNuevo = !idActual;

  // Imagen principal: archivo nuevo (si lo hay) o la URL existente.
  let imagen = str(formData, "imagenActual");
  const archivoPrincipal = formData.get("imagenArchivo");
  if (archivoPrincipal instanceof File && archivoPrincipal.size > 0) {
    imagen = await uploadImage(archivoPrincipal);
  }

  // Galería: URLs existentes (textarea) + archivos nuevos.
  const galeriaUrls = lines(formData, "galeria");
  const nuevasFotos = await uploadFiles(formData.getAll("galeriaArchivos") as File[]);
  const galeria = [...galeriaUrls, ...nuevasFotos];

  const categoriaRaw = str(formData, "categoria") as Categoria;
  const categoria = CATEGORIAS.includes(categoriaRaw) ? categoriaRaw : "Internacional";

  const destino = str(formData, "destino");
  const id = esNuevo ? `vf-${slug(destino) || Date.now().toString(36)}` : idActual;

  const datos: Paquete = {
    id,
    destino,
    pais: str(formData, "pais"),
    imagen: imagen || "/images/pkg-ejc.jpg",
    duracion: str(formData, "duracion"),
    duracionDias: int(formData, "duracionDias"),
    incluye: lines(formData, "incluye"),
    precio: int(formData, "precio"),
    precioAntes: int(formData, "precioAntes") || undefined,
    categoria,
    calificacion: num(formData, "calificacion"),
    reviews: int(formData, "reviews"),
    salidas: lines(formData, "salidas"),
    etiqueta: str(formData, "etiqueta") || null,
    resumen: str(formData, "resumen") || undefined,
    galeria: galeria.length > 0 ? galeria : undefined,
    mejorEpoca: str(formData, "mejorEpoca") || undefined,
    comoLlegar: str(formData, "comoLlegar") || undefined,
  };

  // Conserva campos que no edita el formulario (itinerario, faqs, noIncluye…)
  // y la marca `flyer` (un paquete express sigue siendo express tras editarlo).
  const previo = paquetes.find((p) => p.id === id);
  const merged: Paquete = {
    ...previo,
    ...datos,
    flyer: previo?.flyer,
    itinerario: previo?.itinerario,
    faqs: previo?.faqs,
    noIncluye: previo?.noIncluye,
    mapaQuery: previo?.mapaQuery,
  };

  const nuevos = previo
    ? paquetes.map((p) => (p.id === id ? merged : p))
    : [...paquetes, merged];

  let ok = true;
  try {
    await savePaquetes(nuevos);
    revalidatePath("/");
    revalidatePath(`/paquetes/${id}`);
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/paquetes" : "/admin/paquetes?error=1");
}

/**
 * Alta rápida de un paquete "express" desde un flyer de consolidador. El
 * operador sube la imagen y solo llena lo esencial; el flyer es el contenido.
 */
export async function savePaqueteExpressAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const archivo = formData.get("imagenArchivo");
  let imagen = "";
  if (archivo instanceof File && archivo.size > 0) {
    imagen = await uploadImage(archivo);
  }

  const categoriaRaw = str(formData, "categoria") as Categoria;
  const categoria = CATEGORIAS.includes(categoriaRaw) ? categoriaRaw : "Internacional";
  const destino = str(formData, "destino");
  // "Vigencia" libre (ej: "Salidas en julio y agosto") → se muestra como salidas.
  const vigencia = lines(formData, "vigencia");

  const nuevo: Paquete = {
    id: `vf-${slug(destino) || Date.now().toString(36)}`,
    destino,
    pais: str(formData, "pais") || "Colombia",
    imagen: imagen || "/images/pkg-ejc.jpg",
    duracion: str(formData, "duracion"),
    duracionDias: 0,
    incluye: [],
    precio: int(formData, "precio"),
    precioAntes: int(formData, "precioAntes") || undefined,
    categoria,
    calificacion: 0,
    reviews: 0,
    salidas: vigencia,
    etiqueta: str(formData, "etiqueta") || "Consolidador",
    resumen: str(formData, "resumen") || undefined,
    flyer: true,
  };

  let ok = true;
  try {
    const paquetes = await readPaquetes();
    await savePaquetes([...paquetes, nuevo]);
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/paquetes" : "/admin/paquetes/express?error=1");
}

export async function deletePaqueteAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  let ok = true;
  try {
    const paquetes = await readPaquetes();
    await savePaquetes(paquetes.filter((p) => p.id !== id));
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/paquetes" : "/admin/paquetes?error=1");
}

// --- Guías -----------------------------------------------------------------

export async function saveGuiaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const guias = await readGuias();
  const idActual = str(formData, "id");
  const esNueva = !idActual;

  let imagen = str(formData, "imagenActual");
  const archivo = formData.get("imagenArchivo");
  if (archivo instanceof File && archivo.size > 0) {
    imagen = await uploadImage(archivo);
  }

  const titulo = str(formData, "titulo");
  const slugManual = str(formData, "slug");
  const slugFinal = (slugManual || slug(titulo)) || `guia-${Date.now().toString(36)}`;
  const id = esNueva ? `guia-${Date.now().toString(36)}` : idActual;
  const previa = guias.find((g) => g.id === id);

  const guia: Guia = {
    id,
    slug: slugFinal,
    titulo,
    destino: str(formData, "destino"),
    resumen: str(formData, "resumen"),
    imagen: imagen || "/images/story-1.jpg",
    contenido: str(formData, "contenido"),
    etiquetas: str(formData, "etiquetas")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    paqueteId: str(formData, "paqueteId") || undefined,
    publicada: formData.get("publicada") === "on",
    createdAt: previa?.createdAt ?? new Date().toISOString(),
  };

  const nuevas = previa ? guias.map((g) => (g.id === id ? guia : g)) : [...guias, guia];
  await saveGuias(nuevas);
  revalidatePath("/guias");
  revalidatePath(`/guias/${slugFinal}`);
  revalidatePath("/");
  redirect("/admin/guias");
}

export async function deleteGuiaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const guias = await readGuias();
  await saveGuias(guias.filter((g) => g.id !== id));
  revalidatePath("/guias");
  redirect("/admin/guias");
}

// --- Destinos --------------------------------------------------------------

export async function saveDestinoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const destinos = await readDestinos();
  const idActual = str(formData, "id");
  const esNuevo = !idActual;

  let imagen = str(formData, "imagenActual");
  const archivo = formData.get("imagenArchivo");
  if (archivo instanceof File && archivo.size > 0) {
    imagen = await uploadImage(archivo);
  }

  const tipoRaw = str(formData, "tipo") as TipoDestino;
  const tipo = TIPOS_DESTINO.includes(tipoRaw) ? tipoRaw : "ciudad";

  // Validación de coordenadas (rango real).
  const lat = Math.max(-90, Math.min(90, num(formData, "lat")));
  const lng = Math.max(-180, Math.min(180, num(formData, "lng")));

  const nombre = str(formData, "nombre");
  const id = esNuevo ? `dst-${slug(nombre) || Date.now().toString(36)}` : idActual;
  const previo = destinos.find((d) => d.id === id);

  const destino: Destino = {
    id,
    nombre,
    pais: str(formData, "pais"),
    lat,
    lng,
    tipo,
    paqueteId: str(formData, "paqueteId") || undefined,
    destacado: formData.get("destacado") === "on",
    imagen: imagen || undefined,
    descripcionCorta: str(formData, "descripcionCorta") || undefined,
  };

  const nuevos = previo ? destinos.map((d) => (d.id === id ? destino : d)) : [...destinos, destino];
  await saveDestinos(nuevos);
  revalidatePath("/");
  redirect("/admin/destinos");
}

export async function deleteDestinoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const destinos = await readDestinos();
  await saveDestinos(destinos.filter((d) => d.id !== id));
  revalidatePath("/");
  redirect("/admin/destinos");
}

// --- Promo -----------------------------------------------------------------

export async function savePromoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const previa = await readPromo();
  const promo: Promo = {
    activa: formData.get("activa") === "on",
    promoEnds: str(formData, "promoEnds") || null,
    eyebrow: str(formData, "eyebrow") || previa.eyebrow,
    tituloLinea1: str(formData, "tituloLinea1") || previa.tituloLinea1,
    destacado: str(formData, "destacado") || previa.destacado,
    tituloLinea2: str(formData, "tituloLinea2") || previa.tituloLinea2,
    descripcion: str(formData, "descripcion") || previa.descripcion,
    ctaMensaje: str(formData, "ctaMensaje") || previa.ctaMensaje,
  };
  await savePromo(promo);
  revalidatePath("/");
  redirect("/admin/promo");
}

// --- Testimonios -----------------------------------------------------------

export async function saveTestimonioAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const testimonios = await readTestimonios();
  const indexRaw = str(formData, "index");

  let foto = str(formData, "fotoActual");
  const archivo = formData.get("fotoArchivo");
  if (archivo instanceof File && archivo.size > 0) {
    foto = await uploadImage(archivo);
  }

  const t: Testimonio = {
    nombre: str(formData, "nombre"),
    ciudad: str(formData, "ciudad"),
    destino: str(formData, "destino"),
    foto: foto || "/images/tst-1.jpg",
    texto: str(formData, "texto"),
    rating: Math.min(5, Math.max(0, num(formData, "rating"))),
  };

  let nuevos: Testimonio[];
  if (indexRaw === "" || indexRaw === "nuevo") {
    nuevos = [...testimonios, t];
  } else {
    const i = Number(indexRaw);
    nuevos = testimonios.map((orig, idx) => (idx === i ? t : orig));
  }
  await saveTestimonios(nuevos);
  revalidatePath("/");
  redirect("/admin/testimonios");
}

export async function deleteTestimonioAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const i = Number(str(formData, "index"));
  const testimonios = await readTestimonios();
  await saveTestimonios(testimonios.filter((_, idx) => idx !== i));
  revalidatePath("/");
  redirect("/admin/testimonios");
}

// --- Leads (CRM) -----------------------------------------------------------

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await deleteLead(str(formData, "id"));
  redirect("/admin/leads");
}

/** Cambio rápido de etapa del lead desde la lista. */
export async function cambiarEstadoLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const estadoRaw = str(formData, "estado") as EstadoLead;
  if (ESTADOS_LEAD.includes(estadoRaw)) {
    await updateLead(id, { estado: estadoRaw });
  }
  const from = str(formData, "from");
  redirect(from.startsWith("/admin/leads") ? from : "/admin/leads");
}

/** Guarda las notas internas del lead. */
export async function guardarNotaLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await updateLead(str(formData, "id"), { notas: str(formData, "notas") });
  redirect("/admin/leads");
}

// --- Reservas --------------------------------------------------------------

export async function updateReservaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const estadoRaw = str(formData, "estado") as EstadoReserva;
  const estado = ESTADOS_RESERVA.includes(estadoRaw) ? estadoRaw : undefined;
  await updateReserva(id, { estado, notas: str(formData, "notas") });
  redirect(`/admin/reservas/${id}`);
}

export async function deleteReservaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await deleteReserva(str(formData, "id"));
  redirect("/admin/reservas");
}

/** Cambio rápido de estado desde la lista (sin tocar las notas). */
export async function cambiarEstadoReservaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const estadoRaw = str(formData, "estado") as EstadoReserva;
  if (ESTADOS_RESERVA.includes(estadoRaw)) {
    await updateReserva(id, { estado: estadoRaw });
  }
  const from = str(formData, "from");
  redirect(from.startsWith("/admin/reservas") ? from : "/admin/reservas");
}
