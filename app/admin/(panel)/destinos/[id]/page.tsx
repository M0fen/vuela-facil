import Link from "next/link";
import { notFound } from "next/navigation";
import type { Destino, TipoDestino } from "@/lib/geo";
import { etiquetaTipo } from "@/lib/geo";
import { readDestinos, readPaquetes } from "@/lib/store";
import { Icon } from "@/components/icons";
import { MapPicker } from "@/components/admin/MapPicker";
import { saveDestinoAction } from "../../../actions";
import { Field, Area, Card, btnPrimary } from "../../ui";

export const dynamic = "force-dynamic";

const TIPOS: TipoDestino[] = ["playa", "naturaleza", "ciudad", "aventura", "internacional"];

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-navy/12 bg-white text-navy text-[14px] outline-none focus:border-coral focus:ring-2 focus:ring-coral/15";
const labelCls = "block text-[12px] font-semibold text-navy/55 mb-1.5";

export default async function EditarDestino({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const esNuevo = id === "nuevo";

  let dst: Partial<Destino> = {};
  if (!esNuevo) {
    const destinos = await readDestinos();
    const found = destinos.find((d) => d.id === id);
    if (!found) notFound();
    dst = found;
  }
  const paquetes = await readPaquetes();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/destinos"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Destinos
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          {esNuevo ? "Nuevo destino" : dst.nombre}
        </h1>
      </div>

      <form action={saveDestinoAction} className="space-y-5 max-w-3xl">
        <input type="hidden" name="id" value={esNuevo ? "" : id} />
        <input type="hidden" name="imagenActual" value={dst.imagen ?? ""} />

        <Card title="Datos del destino" icon={Icon.Pin}>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre" name="nombre" defaultValue={dst.nombre} required />
              <Field label="País" name="pais" defaultValue={dst.pais} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className={labelCls}>Tipo</span>
                <select name="tipo" defaultValue={dst.tipo ?? "ciudad"} className={inputCls}>
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {etiquetaTipo[t]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelCls}>Paquete relacionado (opcional)</span>
                <select name="paqueteId" defaultValue={dst.paqueteId ?? ""} className={inputCls}>
                  <option value="">Sin plan (abre cotización por WhatsApp)</option>
                  {paquetes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.destino}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="destacado"
                defaultChecked={dst.destacado}
                className="w-4 h-4 accent-coral"
              />
              <span className="text-[13px] text-navy/75 font-medium">
                Destacado (punto más grande en el globo)
              </span>
            </label>
            <Area
              label="Descripción corta (opcional)"
              name="descripcionCorta"
              defaultValue={dst.descripcionCorta}
              rows={2}
              hint="Aparece en la tarjeta del destino cuando aún no tiene paquete."
            />
            <div>
              <label className={labelCls}>Foto (opcional)</label>
              <input
                type="file"
                name="imagenArchivo"
                accept="image/*"
                className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
              />
            </div>
          </div>
        </Card>

        <Card title="Ubicación en el mapa" icon={Icon.Compass}>
          <MapPicker initialLat={dst.lat} initialLng={dst.lng} />
        </Card>

        <button className={btnPrimary}>
          <Icon.Check className="w-4 h-4" />
          {esNuevo ? "Crear destino" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
