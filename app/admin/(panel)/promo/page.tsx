import { readPromo } from "@/lib/store";
import { savePromoAction } from "../../actions";
import { Field, Area, Card } from "../ui";

export const dynamic = "force-dynamic";

export default async function PromoAdmin() {
  const promo = await readPromo();
  // El input datetime-local necesita "YYYY-MM-DDTHH:mm".
  const localValue = promo.promoEnds ? promo.promoEnds.slice(0, 16) : "";

  return (
    <div>
      <h1 className="font-serif text-navy text-[26px] mb-1">Promoción (OfferBanner)</h1>
      <p className="text-navy/55 text-[14px] mb-6">
        Si la promo no está activa o la fecha ya pasó, el banner muestra un mensaje perenne sin reloj.
      </p>

      <form action={savePromoAction} className="space-y-5 max-w-2xl">
        <Card>
          <label className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              name="activa"
              defaultChecked={promo.activa}
              className="w-5 h-5 accent-coral"
            />
            <span className="text-navy font-semibold text-[14px]">Promoción activa</span>
          </label>
          <Field
            label="Fecha y hora de cierre"
            name="promoEnds"
            type="datetime-local"
            defaultValue={localValue}
            hint="Déjalo vacío para un banner perenne sin cuenta regresiva."
          />
        </Card>

        <Card title="Textos del banner">
          <div className="space-y-4">
            <Field label="Etiqueta superior" name="eyebrow" defaultValue={promo.eyebrow} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Título línea 1" name="tituloLinea1" defaultValue={promo.tituloLinea1} />
              <Field label="Destacado" name="destacado" defaultValue={promo.destacado} placeholder="−25%" />
              <Field label="Título línea 2" name="tituloLinea2" defaultValue={promo.tituloLinea2} />
            </div>
            <Area label="Descripción" name="descripcion" defaultValue={promo.descripcion} rows={2} />
            <Area label="Mensaje de WhatsApp (CTA)" name="ctaMensaje" defaultValue={promo.ctaMensaje} rows={2} />
          </div>
        </Card>

        <button className="px-6 py-3 rounded-full bg-coral text-white font-semibold hover:bg-[#cf550f] transition-colors">
          Guardar promoción
        </button>
      </form>
    </div>
  );
}
