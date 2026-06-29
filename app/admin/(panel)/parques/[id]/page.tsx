import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Parque } from "@/lib/types";
import { readParques } from "@/lib/store";
import { Icon } from "@/components/icons";
import { GaleriaEditor } from "@/components/admin/GaleriaEditor";
import { saveParqueAction } from "../../../actions";
import { Field, Area, Select, Card, ErrorBanner, btnPrimary } from "../../ui";

export const dynamic = "force-dynamic";

const labelCls = "block text-[12px] font-semibold text-navy/55 mb-1.5";
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-navy/12 bg-white text-navy text-[14px] outline-none transition-all focus:border-coral focus:ring-2 focus:ring-coral/15 placeholder:text-navy/30";
const TIPOS = ["Temático", "Natural", "Acuático", "Agroparque", "Aventura", "Ecoparque"];

export default async function EditarParque({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const esNuevo = id === "nuevo";

  let p: Partial<Parque> = {};
  if (!esNuevo) {
    const items = await readParques();
    const found = items.find((x) => x.id === id);
    if (!found) notFound();
    p = found;
  }

  return (
    <div>
      <ErrorBanner show={!!error} />
      <div className="mb-6">
        <Link
          href="/admin/parques"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Parques
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          {esNuevo ? "Nuevo parque" : p.nombre}
        </h1>
      </div>

      <form action={saveParqueAction} className="space-y-5 max-w-3xl">
        {!esNuevo && <input type="hidden" name="id" value={p.id} />}

        <Card title="Información principal" icon={Icon.Sparkle}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre" name="nombre" defaultValue={p.nombre} required placeholder="Parque del Café" />
            <label className="block">
              <span className={labelCls}>Categoría</span>
              <input name="tipo" defaultValue={p.tipo} list="tipos-parque" placeholder="Temático, Natural, Acuático…" className={inputCls} />
              <datalist id="tipos-parque">
                {TIPOS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              <span className="block text-[11px] text-navy/45 mt-1">Elige una o escribe una nueva.</span>
            </label>
            <Field label="Ubicación" name="ubicacion" defaultValue={p.ubicacion} placeholder="Montenegro, Quindío" required />
            <Field label="Etiqueta (opcional)" name="etiqueta" defaultValue={p.etiqueta ?? ""} placeholder="Más vendido, Imperdible…" />
            <Field label="Precio entrada desde" name="precioDesde" type="number" defaultValue={p.precioDesde} required hint="Solo el número, ej: 95000" />
            <Field label="Precio anterior (opcional)" name="precioAntes" type="number" defaultValue={p.precioAntes} hint="Si es mayor, se muestra tachado con el % de ahorro." />
            <Select label="Moneda" name="moneda" options={["COP", "USD", "EUR"]} defaultValue={p.moneda ?? "COP"} />
            <Field label="Horario (opcional)" name="horario" defaultValue={p.horario} placeholder="Mié–Dom · 9:00 a.m. – 6:00 p.m." />
          </div>
        </Card>

        <Card title="Imagen principal" icon={Icon.Compass}>
          <div className="flex items-center gap-4">
            {p.imagen && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-ivory shrink-0">
                <Image src={p.imagen} alt="" fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input type="hidden" name="imagenActual" value={p.imagen ?? ""} />
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

        <Card title="Detalle" icon={Icon.Sparkle}>
          <div className="space-y-4">
            <Area label="Descripción" name="descripcion" defaultValue={p.descripcion} rows={4} hint="Qué es, qué se hace, para quién es ideal." />
            <Area label="Qué incluye la entrada (una por línea)" name="incluye" defaultValue={p.incluye?.join("\n")} rows={4} hint="Ej: Acceso al parque, Atracciones, Shows…" />
          </div>
        </Card>

        <Card title="Galería" icon={Icon.Compass}>
          <GaleriaEditor existing={p.galeria ?? []} />
        </Card>

        <Card title="Publicación" icon={Icon.Check}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-[14px] text-navy">
              <input type="checkbox" name="publicado" defaultChecked={esNuevo ? true : p.publicado} className="w-4 h-4 accent-coral" />
              Publicado (visible en el sitio). Desmárcalo para dejarlo como borrador.
            </label>
            <label className="flex items-center gap-3 text-[14px] text-navy">
              <input type="checkbox" name="destacado" defaultChecked={p.destacado} className="w-4 h-4 accent-coral" />
              Destacado en el inicio.
            </label>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur border border-navy/10 shadow-[0_12px_30px_-18px_rgba(13,44,84,0.4)]">
          <button className={`${btnPrimary} px-7 py-3`}>
            <Icon.Check className="w-4 h-4" />
            {esNuevo ? "Crear parque" : "Guardar cambios"}
          </button>
          <Link href="/admin/parques" className="text-navy/55 text-[13px] hover:text-navy px-2">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
