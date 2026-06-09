import Image from "next/image";
import type { Testimonio } from "@/lib/types";
import { readTestimonios } from "@/lib/store";
import { saveTestimonioAction, deleteTestimonioAction } from "../../actions";
import { Field, Area, Card } from "../ui";
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
      <button className="px-5 py-2.5 rounded-full bg-coral text-white text-[13px] font-semibold hover:bg-[#cf550f] transition-colors">
        {index === "nuevo" ? "Agregar testimonio" : "Guardar"}
      </button>
    </form>
  );
}

export default async function TestimoniosAdmin() {
  const testimonios = await readTestimonios();

  return (
    <div>
      <h1 className="font-serif text-navy text-[26px] mb-6">Testimonios</h1>

      <div className="mb-6">
        <Card title="Agregar testimonio">
          <TestimonioForm index="nuevo" />
        </Card>
      </div>

      <div className="space-y-4">
        {testimonios.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl border border-navy/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-ivory">
                  <Image src={t.foto} alt={t.nombre} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-navy text-[14px]">{t.nombre}</div>
                  <div className="text-navy/50 text-[12px]">{t.rating.toFixed(1)}★</div>
                </div>
              </div>
              <form action={deleteTestimonioAction}>
                <input type="hidden" name="index" value={i} />
                <button className="px-3 py-2 rounded-full border border-coral/30 text-coral text-[12px] font-semibold hover:bg-coral hover:text-white transition-colors">
                  Eliminar
                </button>
              </form>
            </div>
            <TestimonioForm t={t} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
