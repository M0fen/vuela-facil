import { Icon } from "@/components/icons";
import { readPromo } from "@/lib/store";
import { savePromoAction } from "../../actions";
import { Field, Area, Card, PageHeader, btnPrimary } from "../ui";

export const dynamic = "force-dynamic";

export default async function PromoAdmin() {
  const promo = await readPromo();
  // El input datetime-local necesita "YYYY-MM-DDTHH:mm".
  const localValue = promo.promoEnds ? promo.promoEnds.slice(0, 16) : "";

  return (
    <div>
      <PageHeader
        title="Promoción"
        subtitle="Si la promo no está activa o la fecha ya pasó, el banner muestra un mensaje perenne sin reloj."
      />

      <form action={savePromoAction} className="space-y-5 max-w-2xl">
        <Card title="Estado y vigencia" icon={Icon.Clock}>
          <label className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-ivory border border-navy/8 cursor-pointer">
            <input
              type="checkbox"
              name="activa"
              defaultChecked={promo.activa}
              className="w-5 h-5 accent-coral"
            />
            <span className="text-navy font-semibold text-[14px]">Promoción activa</span>
            <span className="text-navy/45 text-[12px]">— enciende el banner de oferta</span>
          </label>
          <Field
            label="Fecha y hora de cierre"
            name="promoEnds"
            type="datetime-local"
            defaultValue={localValue}
            hint="Déjalo vacío para un banner perenne sin cuenta regresiva."
          />
        </Card>

        <Card title="Textos del banner" icon={Icon.Sparkle}>
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

        <button className={`${btnPrimary} px-7 py-3`}>
          <Icon.Check className="w-4 h-4" /> Guardar promoción
        </button>
      </form>
    </div>
  );
}
