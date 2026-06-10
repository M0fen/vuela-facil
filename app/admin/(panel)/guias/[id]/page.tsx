import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Guia } from "@/lib/types";
import { readGuias, readPaquetes } from "@/lib/store";
import { Icon } from "@/components/icons";
import { AIGenerate } from "@/components/admin/AIGenerate";
import { saveGuiaAction } from "../../../actions";
import { Field, Area, Card, btnPrimary } from "../../ui";

export const dynamic = "force-dynamic";

export default async function EditarGuia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const esNueva = id === "nueva";

  let g: Partial<Guia> = {};
  if (!esNueva) {
    const guias = await readGuias();
    const found = guias.find((x) => x.id === id);
    if (!found) notFound();
    g = found;
  }
  const paquetes = await readPaquetes();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/guias"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Guías
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          {esNueva ? "Nueva guía" : g.titulo}
        </h1>
      </div>

      <form action={saveGuiaAction} className="space-y-5 max-w-3xl">
        {!esNueva && <input type="hidden" name="id" value={g.id} />}

        <Card title="Información" icon={Icon.Globe}>
          <div className="space-y-4">
            <Field label="Título" name="titulo" defaultValue={g.titulo} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Slug (URL)" name="slug" defaultValue={g.slug} placeholder="se genera del título" hint="Déjalo vacío para autogenerarlo." />
              <Field label="Destino / tema" name="destino" defaultValue={g.destino} />
            </div>
            <Field label="Etiquetas (separadas por coma)" name="etiquetas" defaultValue={g.etiquetas?.join(", ")} placeholder="Eje Cafetero, Naturaleza" />
            <label className="block">
              <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">
                Paquete relacionado (CTA)
              </span>
              <select
                name="paqueteId"
                defaultValue={g.paqueteId ?? ""}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy/12 bg-white text-navy text-[14px] outline-none focus:border-coral"
              >
                <option value="">— Ninguno —</option>
                {paquetes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.destino}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <Card title="Imagen de portada" icon={Icon.Compass}>
          <div className="flex items-center gap-4">
            {g.imagen && (
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-ivory shrink-0">
                <Image src={g.imagen} alt="" fill sizes="112px" className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input type="hidden" name="imagenActual" value={g.imagen ?? ""} />
              <input
                type="file"
                name="imagenArchivo"
                accept="image/*"
                className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
              />
              <p className="text-[11px] text-navy/45 mt-1">Si no subes nada, se conserva la actual.</p>
            </div>
          </div>
        </Card>

        <Card title="Contenido" icon={Icon.Sparkle}>
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-coral/8 to-amber/8 border border-coral/15 flex flex-wrap items-center gap-3">
            <span className="text-[12px] text-navy/70">
              Pon el título y destino arriba, y deja que la IA escriba el borrador:
            </span>
            <AIGenerate
              kind="guia"
              read={["titulo", "destino", "etiquetas"]}
              write={["resumen", "contenido"]}
              label="Redactar con IA"
            />
          </div>
          <div className="space-y-4">
            <Area label="Resumen" name="resumen" defaultValue={g.resumen} rows={2} hint="Para la tarjeta y SEO." />
            <Area
              label="Contenido (Markdown)"
              name="contenido"
              defaultValue={g.contenido}
              rows={14}
              hint="Usa ## para secciones, - para listas, **negrita** y > para citas."
            />
          </div>
        </Card>

        <Card title="Publicación" icon={Icon.Shield}>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-ivory border border-navy/8 cursor-pointer">
            <input type="checkbox" name="publicada" defaultChecked={g.publicada ?? false} className="w-5 h-5 accent-coral" />
            <span className="text-navy font-semibold text-[14px]">Publicada</span>
            <span className="text-navy/45 text-[12px]">— visible en el sitio cuando está activa</span>
          </label>
        </Card>

        <div className="sticky bottom-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur border border-navy/10 shadow-[0_12px_30px_-18px_rgba(13,44,84,0.4)]">
          <button className={`${btnPrimary} px-7 py-3`}>
            <Icon.Check className="w-4 h-4" /> {esNueva ? "Crear guía" : "Guardar cambios"}
          </button>
          <Link href="/admin/guias" className="text-navy/55 text-[13px] hover:text-navy px-2">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
