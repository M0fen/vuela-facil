import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Alojamiento } from "@/lib/types";
import { readAlojamientos } from "@/lib/store";
import { Icon } from "@/components/icons";
import { saveAlojamientoAction } from "../../../actions";
import { Field, Area, Select, Card, ErrorBanner, btnPrimary } from "../../ui";

export const dynamic = "force-dynamic";

const TIPOS = ["Finca", "Apartamento", "Cabaña", "Casa", "Glamping", "Habitación"];

export default async function EditarAlojamiento({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const esNuevo = id === "nuevo";

  let a: Partial<Alojamiento> = {};
  if (!esNuevo) {
    const items = await readAlojamientos();
    const found = items.find((x) => x.id === id);
    if (!found) notFound();
    a = found;
  }

  return (
    <div>
      <ErrorBanner show={!!error} />
      <div className="mb-6">
        <Link
          href="/admin/alojamientos"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Alojamientos
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          {esNuevo ? "Nuevo alojamiento" : a.titulo}
        </h1>
      </div>

      <form action={saveAlojamientoAction} className="space-y-5 max-w-3xl">
        {!esNuevo && <input type="hidden" name="id" value={a.id} />}

        <Card title="Información principal" icon={Icon.Home}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Título" name="titulo" defaultValue={a.titulo} required placeholder="Finca cafetera con piscina" />
            <Select label="Tipo" name="tipo" options={TIPOS} defaultValue={a.tipo} />
            <Field label="Ubicación" name="ubicacion" defaultValue={a.ubicacion} placeholder="Salento, Quindío" required />
            <Field label="Etiqueta (opcional)" name="etiqueta" defaultValue={a.etiqueta ?? ""} placeholder="Más reservada, Romántico…" />
            <Field label="Precio por noche (COP)" name="precioNoche" type="number" defaultValue={a.precioNoche} required hint="Solo el número, ej: 650000" />
            <Field label="Precio anterior (opcional)" name="precioAntes" type="number" defaultValue={a.precioAntes} hint="Si es mayor, se muestra tachado con el % de ahorro." />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <Field label="Huéspedes" name="huespedes" type="number" defaultValue={a.huespedes ?? 2} />
            <Field label="Habitaciones" name="habitaciones" type="number" defaultValue={a.habitaciones ?? 1} />
            <Field label="Camas" name="camas" type="number" defaultValue={a.camas ?? 1} />
            <Field label="Baños" name="banos" type="number" defaultValue={a.banos ?? 1} />
          </div>
          <div className="mt-4 max-w-[200px]">
            <Field label="Mínimo de noches (opcional)" name="minNoches" type="number" defaultValue={a.minNoches} />
          </div>
        </Card>

        <Card title="Imagen principal" icon={Icon.Compass}>
          <div className="flex items-center gap-4">
            {a.imagen && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-ivory shrink-0">
                <Image src={a.imagen} alt="" fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input type="hidden" name="imagenActual" value={a.imagen ?? ""} />
              <label className="block text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5">
                Subir nueva imagen
              </label>
              <input
                type="file"
                name="imagenArchivo"
                accept="image/*"
                className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
              />
              <p className="text-[11px] text-navy/45 mt-1">Si no subes nada, se conserva la imagen actual.</p>
            </div>
          </div>
        </Card>

        <Card title="Detalle y amenidades" icon={Icon.Sparkle}>
          <div className="space-y-4">
            <Area label="Descripción" name="descripcion" defaultValue={a.descripcion} rows={4} hint="Cuenta lo que enamora: entorno, vista, para quién es ideal." />
            <Area
              label="Amenidades (una por línea o separadas por coma)"
              name="amenidades"
              defaultValue={a.amenidades?.join("\n")}
              rows={4}
              hint="Ej: Piscina, WiFi, Cocina equipada, Parqueadero, BBQ, Jacuzzi, Apto mascotas…"
            />
          </div>
        </Card>

        <Card title="Galería" icon={Icon.Compass}>
          <Area
            label="URLs de la galería (una por línea)"
            name="galeria"
            defaultValue={a.galeria?.join("\n")}
            rows={3}
            hint="Se conservan estas y se agregan las que subas abajo."
          />
          <label className="block mt-4 text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5">
            Agregar fotos a la galería
          </label>
          <input
            type="file"
            name="galeriaArchivos"
            accept="image/*"
            multiple
            className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
          />
        </Card>

        <Card title="Publicación" icon={Icon.Check}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-[14px] text-navy">
              <input type="checkbox" name="publicado" defaultChecked={esNuevo ? true : a.publicado} className="w-4 h-4 accent-coral" />
              Publicado (visible en el sitio). Desmárcalo para dejarlo como borrador.
            </label>
            <label className="flex items-center gap-3 text-[14px] text-navy">
              <input type="checkbox" name="destacado" defaultChecked={a.destacado} className="w-4 h-4 accent-coral" />
              Destacado en el inicio (aparece en el bloque de la página principal).
            </label>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur border border-navy/10 shadow-[0_12px_30px_-18px_rgba(13,44,84,0.4)]">
          <button className={`${btnPrimary} px-7 py-3`}>
            <Icon.Check className="w-4 h-4" />
            {esNuevo ? "Crear alojamiento" : "Guardar cambios"}
          </button>
          <Link href="/admin/alojamientos" className="text-navy/55 text-[13px] hover:text-navy px-2">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
