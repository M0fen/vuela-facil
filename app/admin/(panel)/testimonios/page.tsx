import Image from "next/image";
import type { Testimonio } from "@/lib/types";
import { readTestimonios } from "@/lib/store";
import { Icon } from "@/components/icons";
import { saveTestimonioAction, deleteTestimonioAction } from "../../actions";
import { Field, Area, Card, PageHeader, ErrorBanner, btnPrimary, btnDanger } from "../ui";
import { AIGenerate } from "@/components/admin/AIGenerate";

export const dynamic = "force-dynamic";

function TestimonioForm({ t, index }: { t?: Testimonio; index: number | "nuevo" }) {
  return (
    <form action={saveTestimonioAction} className="space-y-4">
      <input type="hidden" name="index" value={index} />
      <input type="hidden" name="fotoActual" value={t?.foto ?? ""} />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Nombre" name="nombre" defaultValue={t?.nombre} required />
        <Field label="Ciudad" name="ciudad" defaultValue={t?.ciudad} />
        <Field label="Destino" name="destino" defaultValue={t?.destino} />
      </div>
      <Area
        label="Notas reales del cliente (para la IA)"
        name="notas"
        rows={2}
        hint="Qué te contó el cliente (puntos sueltos). La IA lo redacta; no se guarda ni se inventan hechos."
      />
      <div>
        <AIGenerate
          kind="testimonio"
          read={["nombre", "ciudad", "destino", "rating", "notas"]}
          write={["texto"]}
          label="Redactar reseña con IA"
        />
      </div>
      <Area label="Texto de la reseña" name="texto" defaultValue={t?.texto} rows={3} />
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <Field label="Rating (0–5)" name="rating" type="number" defaultValue={t?.rating ?? 5} hint="Admite decimales: 4.8" />
        <div>
          <label className="block text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5">
            Foto (opcional)
          </label>
          <input
            type="file"
            name="fotoArchivo"
            accept="image/*"
            className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
          />
        </div>
      </div>
      <button className={btnPrimary}>
        <Icon.Check className="w-4 h-4" />
        {index === "nuevo" ? "Agregar testimonio" : "Guardar"}
      </button>
    </form>
  );
}

export default async function TestimoniosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const testimonios = await readTestimonios();

  return (
    <div>
      <ErrorBanner show={!!error} />
      <PageHeader
        title="Testimonios"
        subtitle={`${testimonios.length} ${testimonios.length === 1 ? "reseña publicada" : "reseñas publicadas"}`}
      />

      <div className="mb-6">
        <Card title="Agregar testimonio" icon={Icon.Star}>
          <TestimonioForm index="nuevo" />
        </Card>
      </div>

      <div className="space-y-4">
        {testimonios.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-navy/8">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-ivory ring-2 ring-coral/15">
                  <Image src={t.foto} alt={t.nombre} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-navy text-[14px]">{t.nombre}</div>
                  <div className="inline-flex items-center gap-1 text-amber text-[12px]">
                    <Icon.Star className="w-3.5 h-3.5" /> {t.rating.toFixed(1)}
                    <span className="text-navy/45">· {t.ciudad}</span>
                  </div>
                </div>
              </div>
              <form action={deleteTestimonioAction}>
                <input type="hidden" name="index" value={i} />
                <button className={btnDanger}>Eliminar</button>
              </form>
            </div>
            <TestimonioForm t={t} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
