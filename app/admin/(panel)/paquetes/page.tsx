import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { readPaquetes } from "@/lib/store";
import { formatCOP, descuentoPct } from "@/lib/utils";
import { deletePaqueteAction } from "../../actions";
import { PageHeader, ErrorBanner, btnPrimary, btnGhost, btnDanger } from "../ui";

export const dynamic = "force-dynamic";

export default async function PaquetesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const paquetes = await readPaquetes();

  return (
    <div>
      <ErrorBanner show={!!error} />
      <PageHeader
        title="Paquetes"
        subtitle={`${paquetes.length} ${paquetes.length === 1 ? "destino publicado" : "destinos publicados"}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/paquetes/express" className={btnGhost}>
              <Icon.Sparkle className="w-4 h-4" /> Express (flyer)
            </Link>
            <Link href="/admin/paquetes/nuevo" className={btnPrimary}>
              <Icon.Plane className="w-4 h-4" /> Nuevo paquete
            </Link>
          </div>
        }
      />

      <div className="space-y-3">
        {paquetes.map((p) => {
          const desc = descuentoPct(p.precio, p.precioAntes);
          return (
            <div
              key={p.id}
              className="group flex items-center gap-4 p-3 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04)] hover:border-coral/30 hover:shadow-[0_12px_30px_-24px_rgba(13,44,84,0.4)] transition-all"
            >
              <div
                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 ${
                  p.flyer ? "bg-navy/5" : "bg-ivory"
                }`}
              >
                <Image
                  src={p.imagen}
                  alt={p.destino}
                  fill
                  sizes="80px"
                  className={p.flyer ? "object-contain p-1" : "object-cover"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-navy text-[17px] truncate">{p.destino}</span>
                  {p.etiqueta && (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[10px] font-semibold uppercase tracking-wide">
                      {p.etiqueta}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-navy/55">
                  <span className="px-2 py-0.5 rounded-full bg-navy/5 border border-navy/10">
                    {p.categoria}
                  </span>
                  {p.flyer ? (
                    <span className="inline-flex items-center gap-1 text-coral font-semibold">
                      <Icon.Sparkle className="w-3 h-3" /> Consolidador
                    </span>
                  ) : (
                    p.reviews > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Icon.Star className="w-3 h-3 text-amber" /> {p.calificacion} ({p.reviews})
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-semibold text-navy text-[15px]">{formatCOP(p.precio)}</span>
                  {desc && (
                    <>
                      <span className="text-[12px] text-navy/40 line-through">
                        {formatCOP(p.precioAntes!)}
                      </span>
                      <span className="text-[10px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full">
                        −{desc}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <Link
                  href={`/admin/paquetes/${p.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-navy/15 text-navy text-[12px] font-semibold hover:bg-navy hover:text-white transition-colors"
                >
                  Editar
                </Link>
                <form action={deletePaqueteAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className={`${btnDanger} w-full`} title="Eliminar paquete">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {paquetes.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
            <p className="text-navy/50 text-[14px]">Aún no hay paquetes.</p>
            <Link href="/admin/paquetes/nuevo" className={`${btnPrimary} mt-4`}>
              Crear el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
