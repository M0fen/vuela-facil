import Link from "next/link";
import { Icon } from "@/components/icons";
import { savePaqueteExpressAction } from "../../../actions";
import { Field, Area, Select, Card, ErrorBanner, btnPrimary } from "../../ui";

export const dynamic = "force-dynamic";

const CATEGORIAS = ["Playa", "Eje Cafetero", "Cruceros", "Internacional", "Aventura", "Luna de Miel"];

// Alta rápida de un paquete a partir del flyer de un consolidador: el operador
// sube la imagen (que ya trae todo el detalle) y solo llena lo esencial.
export default async function NuevoPaqueteExpress({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <ErrorBanner show={!!error} />
      <div className="mb-6">
        <Link
          href="/admin/paquetes"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Paquetes
        </Link>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
          Nuevo paquete express
        </h1>
        <p className="text-navy/55 text-[14px] mt-1.5 max-w-2xl">
          Para ofertas de consolidador donde el flyer ya trae todo. Sube la imagen y
          completa solo lo básico — el resto lo verá el cliente en la imagen y lo
          cotiza por WhatsApp. Más adelante puedes editarlo como un paquete normal.
        </p>
      </div>

      <form action={savePaqueteExpressAction} className="space-y-5 max-w-2xl">
        <Card title="Imagen del flyer" icon={Icon.Compass}>
          <label className="block text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5">
            Sube la imagen del consolidador
          </label>
          <input
            type="file"
            name="imagenArchivo"
            accept="image/*"
            required
            className="text-[13px] text-navy/70 file:mr-3 file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-navy file:text-white file:text-[12px] file:font-semibold"
          />
          <p className="text-[11px] text-navy/45 mt-1.5">
            Se mostrará completa, sin recortar. Idealmente menos de 2 MB.
          </p>
        </Card>

        <Card title="Datos básicos" icon={Icon.Pin}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Destino / título" name="destino" required placeholder="San Andrés todo incluido" />
            <Field label="País" name="pais" placeholder="Colombia" />
            <Select label="Categoría" name="categoria" options={CATEGORIAS} />
            <Field label="Etiqueta" name="etiqueta" placeholder="Consolidador" hint="Por defecto: Consolidador" />
            <Field label="Precio desde" name="precio" type="number" required hint="Solo el número, ej: 1890000" />
            <Select label="Moneda" name="moneda" options={["COP", "USD"]} />
            <Field label="Precio anterior (opcional)" name="precioAntes" type="number" hint="Si es mayor, se muestra tachado." />
          </div>
          <div className="mt-4">
            <Area
              label="Vigencia / salidas (una por línea)"
              name="vigencia"
              rows={2}
              hint="Ej: 'Salidas en julio y agosto 2026' o fechas concretas."
            />
          </div>
          <div className="mt-4">
            <Area
              label="Nota corta (opcional)"
              name="resumen"
              rows={2}
              hint="Una frase para acompañar el flyer. Si la dejas vacía, no pasa nada."
            />
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur border border-navy/10 shadow-[0_12px_30px_-18px_rgba(13,44,84,0.4)]">
          <button className={`${btnPrimary} px-7 py-3`}>
            <Icon.Check className="w-4 h-4" />
            Publicar paquete
          </button>
          <Link href="/admin/paquetes" className="text-navy/55 text-[13px] hover:text-navy px-2">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
