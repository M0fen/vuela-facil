import Link from "next/link";
import { Icon } from "@/components/icons";
import { readDestinos } from "@/lib/store";
import { etiquetaTipo } from "@/lib/geo";
import { deleteDestinoAction } from "../../actions";
import { PageHeader, ErrorBanner, btnPrimary, btnDanger } from "../ui";

export const dynamic = "force-dynamic";

export default async function DestinosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const destinos = await readDestinos();

  return (
    <div>
      <ErrorBanner show={!!error} />
      <PageHeader
        title="Destinos del globo"
        subtitle={`${destinos.length} ${destinos.length === 1 ? "destino" : "destinos"} en el globo y el rail`}
        action={
          <Link href="/admin/destinos/nuevo" className={btnPrimary}>
            <Icon.Pin className="w-4 h-4" /> Nuevo destino
          </Link>
        }
      />

      <div className="space-y-2.5">
        {destinos.map((d) => (
          <div
            key={d.id}
            className="group flex items-center gap-4 p-3 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04)] hover:border-coral/30 transition-all"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral/15 to-amber/10 text-coral flex items-center justify-center shrink-0">
              <Icon.Pin className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-navy text-[17px] truncate">{d.nombre}</span>
                {d.destacado && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[10px] font-semibold uppercase tracking-wide">
                    Destacado
                  </span>
                )}
                {d.paqueteId ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald/10 text-emerald-700 border border-emerald/25 text-[10px] font-semibold">
                    Con plan
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-navy/5 text-navy/55 border border-navy/10 text-[10px] font-semibold">
                    Cotización
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[12px] text-navy/55">
                <span className="px-2 py-0.5 rounded-full bg-navy/5 border border-navy/10 capitalize">
                  {etiquetaTipo[d.tipo]}
                </span>
                <span>{d.pais}</span>
                <span className="text-navy/35">
                  {d.lat.toFixed(2)}, {d.lng.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/destinos/${d.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-navy/15 text-navy text-[12px] font-semibold hover:bg-navy hover:text-white transition-colors"
              >
                Editar
              </Link>
              <form action={deleteDestinoAction}>
                <input type="hidden" name="id" value={d.id} />
                <button className={btnDanger} title="Eliminar destino">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
        {destinos.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
            <p className="text-navy/50 text-[14px]">Aún no hay destinos.</p>
            <Link href="/admin/destinos/nuevo" className={`${btnPrimary} mt-4`}>
              Crear el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
