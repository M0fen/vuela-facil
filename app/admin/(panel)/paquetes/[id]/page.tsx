import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Paquete } from "@/lib/types";
import { readPaquetes } from "@/lib/store";
import { Icon } from "@/components/icons";
import { savePaqueteAction } from "../../../actions";
import { Field, Area, Select, Card, btnPrimary } from "../../ui";
import { AIGenerate } from "@/components/admin/AIGenerate";
import { GaleriaEditor } from "@/components/admin/GaleriaEditor";

export const dynamic = "force-dynamic";

const CATEGORIAS = ["Playa", "Eje Cafetero", "Cruceros", "Internacional", "Aventura", "Luna de Miel"];

export default async function EditarPaquete({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const esNuevo = id === "nuevo";

  let pkg: Partial<Paquete> = {};
  if (!esNuevo) {
    const paquetes = await readPaquetes();
    const found = paquetes.find((p) => p.id === id);
    if (!found) notFound();
    pkg = found;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/paquetes"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Paquetes
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          {esNuevo ? "Nuevo paquete" : pkg.destino}
        </h1>
      </div>

      <form action={savePaqueteAction} className="space-y-5 max-w-3xl">
        {!esNuevo && <input type="hidden" name="id" value={pkg.id} />}

        <Card title="Información principal" icon={Icon.Pin}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Destino" name="destino" defaultValue={pkg.destino} required />
            <Field label="País" name="pais" defaultValue={pkg.pais} />
            <Select label="Categoría" name="categoria" options={CATEGORIAS} defaultValue={pkg.categoria} />
            <Field label="Etiqueta (opcional)" name="etiqueta" defaultValue={pkg.etiqueta ?? ""} placeholder="Más vendido, Promo del mes…" />
            <Select label="Moneda" name="moneda" options={["COP", "USD", "EUR"]} defaultValue={pkg.moneda ?? "COP"} />
            <Field label="Duración (texto)" name="duracion" defaultValue={pkg.duracion} placeholder="4 días · 3 noches" />
            <Field label="Duración (días)" name="duracionDias" type="number" defaultValue={pkg.duracionDias} />
            <Field label="Precio por persona (COP)" name="precio" type="number" defaultValue={pkg.precio} required />
            <Field
              label="Precio anterior (opcional)"
              name="precioAntes"
              type="number"
              defaultValue={pkg.precioAntes}
              hint="Si es mayor al precio, se muestra tachado con el % de ahorro."
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Calificación" name="calificacion" type="number" defaultValue={pkg.calificacion ?? 4.8} hint="0 a 5" />
              <Field label="N° reseñas" name="reviews" type="number" defaultValue={pkg.reviews ?? 0} />
            </div>
          </div>
        </Card>

        <Card title="Imagen principal" icon={Icon.Compass}>
          <div className="flex items-center gap-4">
            {pkg.imagen && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-ivory shrink-0">
                <Image src={pkg.imagen} alt="" fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input type="hidden" name="imagenActual" value={pkg.imagen ?? ""} />
              <label className="block text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5">
                Subir nueva imagen
              </label>
              <input
                type="file"
                name="imagenArchivo"
                accept="image/*"
                className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
              />
              <p className="text-[11px] text-navy/45 mt-1">
                Si no subes nada, se conserva la imagen actual.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Detalle y contenido" icon={Icon.Sparkle}>
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-coral/8 to-amber/8 border border-coral/15 flex flex-wrap items-center gap-3">
            <span className="text-[12px] text-navy/70">
              Completa arriba destino, país, categoría e incluye, y deja que la IA redacte:
            </span>
            <AIGenerate
              kind="paquete"
              read={["destino", "pais", "categoria", "precio", "duracion", "duracionDias", "incluye"]}
              write={["resumen", "mejorEpoca", "comoLlegar"]}
              label="Redactar textos"
            />
          </div>
          <div className="space-y-4">
            <Area label="Resumen" name="resumen" defaultValue={pkg.resumen} rows={2} hint="Una o dos frases para la página y SEO." />
            <Area label="Qué incluye (una por línea)" name="incluye" defaultValue={pkg.incluye?.join("\n")} />
            <Area label="Próximas salidas (una por línea)" name="salidas" defaultValue={pkg.salidas?.join("\n")} />
            <Area
              label="Itinerario (un día por línea)"
              name="itinerario"
              defaultValue={pkg.itinerario?.map((d) => `${d.dia} | ${d.titulo} | ${d.desc}`).join("\n")}
              rows={6}
              hint="Formato por línea: Día 1 | Título | Descripción. Si lo dejas vacío, se muestra un itinerario genérico por la duración."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Area label="Mejor época" name="mejorEpoca" defaultValue={pkg.mejorEpoca} rows={3} />
              <Area label="Cómo llegar" name="comoLlegar" defaultValue={pkg.comoLlegar} rows={3} />
            </div>
          </div>
        </Card>

        <Card title="Galería" icon={Icon.Compass}>
          <GaleriaEditor existing={pkg.galeria ?? []} />
        </Card>

        <div className="sticky bottom-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur border border-navy/10 shadow-[0_12px_30px_-18px_rgba(13,44,84,0.4)]">
          <button className={`${btnPrimary} px-7 py-3`}>
            <Icon.Check className="w-4 h-4" />
            {esNuevo ? "Crear paquete" : "Guardar cambios"}
          </button>
          <Link href="/admin/paquetes" className="text-navy/55 text-[13px] hover:text-navy px-2">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
