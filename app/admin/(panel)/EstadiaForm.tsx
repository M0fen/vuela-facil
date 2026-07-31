import Link from "next/link";
import Image from "next/image";
import type { Alojamiento } from "@/lib/types";
import { Icon } from "@/components/icons";
import { GaleriaEditor } from "@/components/admin/GaleriaEditor";
import { CalculadoraPrecio } from "@/components/admin/CalculadoraPrecio";
import { Field, Area, Card, ErrorBanner, btnPrimary } from "./ui";

const labelCls = "block text-[12px] font-semibold text-navy/55 mb-1.5";
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-navy/12 bg-white text-navy text-[14px] outline-none transition-all focus:border-coral focus:ring-2 focus:ring-coral/15 placeholder:text-navy/30";

/**
 * Formulario compartido para Alojamientos y Hoteles (misma estructura). El
 * `tipo`/categoría es texto libre con sugerencias (el operador puede crear
 * categorías nuevas), y la galería se gestiona con miniaturas.
 */
export function EstadiaForm({
  action,
  item = {},
  esNuevo,
  adminBase,
  noun,
  tipos,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  item?: Partial<Alojamiento>;
  esNuevo: boolean;
  adminBase: string;
  noun: string; // "alojamiento" | "hotel"
  tipos: readonly string[];
  error?: boolean;
}) {
  const listId = `tipos-${noun}`;
  return (
    <div>
      <ErrorBanner show={!!error} />
      <div className="mb-6">
        <Link
          href={adminBase}
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> {noun === "hotel" ? "Hoteles" : "Alojamientos"}
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          {esNuevo ? `Nuevo ${noun}` : item.titulo}
        </h1>
      </div>

      <form action={action} className="space-y-5 max-w-3xl">
        {!esNuevo && <input type="hidden" name="id" value={item.id} />}

        <Card title="Información principal" icon={Icon.Home}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Título" name="titulo" defaultValue={item.titulo} required placeholder={noun === "hotel" ? "Hotel boutique en el centro" : "Finca cafetera con piscina"} />
            <label className="block">
              <span className={labelCls}>Categoría</span>
              <input
                name="tipo"
                defaultValue={item.tipo}
                list={listId}
                placeholder={noun === "hotel" ? "Hotel, Hostal, Resort…" : "Finca, Cabaña, Glamping…"}
                className={inputCls}
              />
              <datalist id={listId}>
                {tipos.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              <span className="block text-[11px] text-navy/45 mt-1">
                Elige una o escribe una nueva (se crea sola).
              </span>
            </label>
            <Field label="Ubicación" name="ubicacion" defaultValue={item.ubicacion} placeholder="Salento, Quindío" required />
            <Field label="Etiqueta (opcional)" name="etiqueta" defaultValue={item.etiqueta ?? ""} placeholder="Más reservada, Romántico…" />
            <Field label="Precio por noche (COP)" name="precioNoche" type="number" defaultValue={item.precioNoche} required hint="Solo el número, ej: 650000" />
            <Field label="Precio anterior (opcional)" name="precioAntes" type="number" defaultValue={item.precioAntes} hint="Si es mayor, se muestra tachado con el % de ahorro." />
          </div>
          <CalculadoraPrecio targetName="precioNoche" className="mt-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <Field label="Huéspedes" name="huespedes" type="number" defaultValue={item.huespedes ?? 2} />
            <Field label="Habitaciones" name="habitaciones" type="number" defaultValue={item.habitaciones ?? 1} />
            <Field label="Camas" name="camas" type="number" defaultValue={item.camas ?? 1} />
            <Field label="Baños" name="banos" type="number" defaultValue={item.banos ?? 1} />
          </div>
          <div className="mt-4 max-w-[200px]">
            <Field label="Mínimo de noches (opcional)" name="minNoches" type="number" defaultValue={item.minNoches} />
          </div>
        </Card>

        <Card title="Imagen principal" icon={Icon.Compass}>
          <div className="flex items-center gap-4">
            {item.imagen && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-ivory shrink-0">
                <Image src={item.imagen} alt="" fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input type="hidden" name="imagenActual" value={item.imagen ?? ""} />
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
            <Area label="Descripción" name="descripcion" defaultValue={item.descripcion} rows={4} hint="Cuenta lo que enamora: entorno, vista, para quién es ideal." />
            <Area
              label="Amenidades (una por línea o separadas por coma)"
              name="amenidades"
              defaultValue={item.amenidades?.join("\n")}
              rows={4}
              hint="Ej: Piscina, WiFi, Cocina equipada, Parqueadero, BBQ, Jacuzzi, Apto mascotas…"
            />
          </div>
        </Card>

        <Card title="Galería" icon={Icon.Compass}>
          <GaleriaEditor existing={item.galeria ?? []} />
        </Card>

        <Card title="Publicación" icon={Icon.Check}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-[14px] text-navy">
              <input type="checkbox" name="publicado" defaultChecked={esNuevo ? true : item.publicado} className="w-4 h-4 accent-coral" />
              Publicado (visible en el sitio). Desmárcalo para dejarlo como borrador.
            </label>
            <label className="flex items-center gap-3 text-[14px] text-navy">
              <input type="checkbox" name="destacado" defaultChecked={item.destacado} className="w-4 h-4 accent-coral" />
              Destacado en el inicio (aparece en el bloque de la página principal).
            </label>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur border border-navy/10 shadow-[0_12px_30px_-18px_rgba(13,44,84,0.4)]">
          <button className={`${btnPrimary} px-7 py-3`}>
            <Icon.Check className="w-4 h-4" />
            {esNuevo ? `Crear ${noun}` : "Guardar cambios"}
          </button>
          <Link href={adminBase} className="text-navy/55 text-[13px] hover:text-navy px-2">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
