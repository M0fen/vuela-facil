"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Alojamiento, Categoria, EstadoLead, EstadoReserva, Guia, Paquete, Promo, TipoAlojamiento, Testimonio } from "@/lib/types";
import type { Destino, TipoDestino } from "@/lib/geo";
import {
  readPaquetes,
  savePaquetes,
  readAlojamientos,
  saveAlojamientos,
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

const TIPOS_ALOJAMIENTO: TipoAlojamiento[] = [
  "Finca",
  "Apartamento",
  "Cabaña",
  "Casa",
  "Glamping",
  "Habitación",
];

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
    moneda: ((m) => (m === "USD" || m === "COP" ? m : previo?.moneda))(str(formData, "moneda")),
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
    moneda: str(formData, "moneda") === "USD" ? "USD" : "COP",
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

export async function duplicarPaqueteAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  let ok = true;
  try {
    const paquetes = await readPaquetes();
    const i = paquetes.findIndex((p) => p.id === id);
    if (i >= 0) {
      const copia: Paquete = {
        ...paquetes[i],
        id: `vf-${slug(paquetes[i].destino) || "paquete"}-${Date.now().toString(36)}`,
        destino: `${paquetes[i].destino} (copia)`,
      };
      const nuevos = [...paquetes];
      nuevos.splice(i + 1, 0, copia);
      await savePaquetes(nuevos);
      revalidatePath("/");
    }
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/paquetes" : "/admin/paquetes?error=1");
}

export async function moverPaqueteAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const dir = str(formData, "dir");
  let ok = true;
  try {
    const paquetes = await readPaquetes();
    const i = paquetes.findIndex((p) => p.id === id);
    const j = dir === "subir" ? i - 1 : i + 1;
    if (i >= 0 && j >= 0 && j < paquetes.length) {
      const nuevos = [...paquetes];
      [nuevos[i], nuevos[j]] = [nuevos[j], nuevos[i]];
      await savePaquetes(nuevos);
      revalidatePath("/");
    }
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/paquetes" : "/admin/paquetes?error=1");
}

// --- Alojamientos (arriendo) -----------------------------------------------

export async function saveAlojamientoAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const items = await readAlojamientos();
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

  const tipoRaw = str(formData, "tipo") as TipoAlojamiento;
  const tipo = TIPOS_ALOJAMIENTO.includes(tipoRaw) ? tipoRaw : "Finca";

  const titulo = str(formData, "titulo");
  const id = esNuevo ? `al-${slug(titulo) || Date.now().toString(36)}` : idActual;

  // Amenidades: una por línea o separadas por coma.
  const amenidades = String(formData.get("amenidades") ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const datos: Alojamiento = {
    id,
    titulo,
    tipo,
    ubicacion: str(formData, "ubicacion"),
    imagen: imagen || "/images/cat-eje.jpg",
    galeria: galeria.length > 0 ? galeria : undefined,
    precioNoche: int(formData, "precioNoche"),
    precioAntes: int(formData, "precioAntes") || undefined,
    huespedes: int(formData, "huespedes"),
    habitaciones: int(formData, "habitaciones"),
    camas: int(formData, "camas"),
    banos: int(formData, "banos"),
    minNoches: int(formData, "minNoches") || undefined,
    amenidades,
    descripcion: str(formData, "descripcion"),
    etiqueta: str(formData, "etiqueta") || null,
    destacado: formData.get("destacado") === "on",
    publicado: formData.get("publicado") === "on",
    createdAt: items.find((a) => a.id === id)?.createdAt ?? new Date().toISOString(),
  };

  const previo = items.find((a) => a.id === id);
  const nuevos = previo
    ? items.map((a) => (a.id === id ? datos : a))
    : [...items, datos];

  let ok = true;
  try {
    await saveAlojamientos(nuevos);
    revalidatePath("/");
    revalidatePath("/alojamientos");
    revalidatePath(`/alojamientos/${id}`);
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/alojamientos" : "/admin/alojamientos?error=1");
}

export async function deleteAlojamientoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  let ok = true;
  try {
    const items = await readAlojamientos();
    await saveAlojamientos(items.filter((a) => a.id !== id));
    revalidatePath("/");
    revalidatePath("/alojamientos");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/alojamientos" : "/admin/alojamientos?error=1");
}

export async function duplicarAlojamientoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  let ok = true;
  try {
    const items = await readAlojamientos();
    const i = items.findIndex((a) => a.id === id);
    if (i >= 0) {
      const copia: Alojamiento = {
        ...items[i],
        id: `al-${slug(items[i].titulo) || "alojamiento"}-${Date.now().toString(36)}`,
        titulo: `${items[i].titulo} (copia)`,
        publicado: false, // la copia nace como borrador
        createdAt: new Date().toISOString(),
      };
      const nuevos = [...items];
      nuevos.splice(i + 1, 0, copia);
      await saveAlojamientos(nuevos);
      revalidatePath("/");
      revalidatePath("/alojamientos");
    }
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/alojamientos" : "/admin/alojamientos?error=1");
}

export async function moverAlojamientoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const dir = str(formData, "dir");
  let ok = true;
  try {
    const items = await readAlojamientos();
    const i = items.findIndex((a) => a.id === id);
    const j = dir === "subir" ? i - 1 : i + 1;
    if (i >= 0 && j >= 0 && j < items.length) {
      const nuevos = [...items];
      [nuevos[i], nuevos[j]] = [nuevos[j], nuevos[i]];
      await saveAlojamientos(nuevos);
      revalidatePath("/");
      revalidatePath("/alojamientos");
    }
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/alojamientos" : "/admin/alojamientos?error=1");
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
  let ok = true;
  try {
    await saveGuias(nuevas);
    revalidatePath("/guias");
    revalidatePath(`/guias/${slugFinal}`);
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/guias" : "/admin/guias?error=1");
}

export async function deleteGuiaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  let ok = true;
  try {
    const guias = await readGuias();
    await saveGuias(guias.filter((g) => g.id !== id));
    revalidatePath("/guias");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/guias" : "/admin/guias?error=1");
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
  let ok = true;
  try {
    await saveDestinos(nuevos);
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/destinos" : "/admin/destinos?error=1");
}

export async function deleteDestinoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  let ok = true;
  try {
    const destinos = await readDestinos();
    await saveDestinos(destinos.filter((d) => d.id !== id));
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/destinos" : "/admin/destinos?error=1");
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
  let ok = true;
  try {
    await savePromo(promo);
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/promo" : "/admin/promo?error=1");
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
  let ok = true;
  try {
    await saveTestimonios(nuevos);
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/testimonios" : "/admin/testimonios?error=1");
}

export async function deleteTestimonioAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const i = Number(str(formData, "index"));
  let ok = true;
  try {
    const testimonios = await readTestimonios();
    await saveTestimonios(testimonios.filter((_, idx) => idx !== i));
    revalidatePath("/");
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/testimonios" : "/admin/testimonios?error=1");
}

// --- Leads (CRM) -----------------------------------------------------------

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  let ok = true;
  try {
    await deleteLead(str(formData, "id"));
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/leads" : "/admin/leads?error=1");
}

/** Cambio rápido de etapa del lead desde la lista. */
export async function cambiarEstadoLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const estadoRaw = str(formData, "estado") as EstadoLead;
  const from = str(formData, "from");
  const dest = from.startsWith("/admin/leads") ? from : "/admin/leads";
  let ok = true;
  if (ESTADOS_LEAD.includes(estadoRaw)) {
    try {
      await updateLead(id, { estado: estadoRaw });
    } catch {
      ok = false;
    }
  }
  redirect(ok ? dest : `${dest}${dest.includes("?") ? "&" : "?"}error=1`);
}

/** Guarda las notas internas del lead. */
export async function guardarNotaLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  let ok = true;
  try {
    await updateLead(str(formData, "id"), { notas: str(formData, "notas") });
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/leads" : "/admin/leads?error=1");
}

// --- Reservas --------------------------------------------------------------

export async function updateReservaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const estadoRaw = str(formData, "estado") as EstadoReserva;
  const estado = ESTADOS_RESERVA.includes(estadoRaw) ? estadoRaw : undefined;
  let ok = true;
  try {
    await updateReserva(id, { estado, notas: str(formData, "notas") });
  } catch {
    ok = false;
  }
  redirect(ok ? `/admin/reservas/${id}` : `/admin/reservas/${id}?error=1`);
}

export async function deleteReservaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  let ok = true;
  try {
    await deleteReserva(str(formData, "id"));
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/reservas" : "/admin/reservas?error=1");
}

/** Cambio rápido de estado desde la lista (sin tocar las notas). */
export async function cambiarEstadoReservaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const estadoRaw = str(formData, "estado") as EstadoReserva;
  const from = str(formData, "from");
  const dest = from.startsWith("/admin/reservas") ? from : "/admin/reservas";
  let ok = true;
  if (ESTADOS_RESERVA.includes(estadoRaw)) {
    try {
      await updateReserva(id, { estado: estadoRaw });
    } catch {
      ok = false;
    }
  }
  redirect(ok ? dest : `${dest}${dest.includes("?") ? "&" : "?"}error=1`);
}
