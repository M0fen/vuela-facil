import Link from "next/link";
import { Icon } from "@/components/icons";
import type { EstadoReserva } from "@/lib/types";
import { listReservas } from "@/lib/store";
import { formatCOP } from "@/lib/utils";
import { cambiarEstadoReservaAction } from "../../actions";
import { PageHeader, EstadoBadge, ESTADOS, ESTADO_LABEL } from "../ui";

export const dynamic = "force-dynamic";

const FILTROS: { label: string; value: string }[] = [
  { label: "Todas", value: "todas" },
  { label: "Pendientes", value: "pendiente" },
  { label: "En proceso", value: "en_proceso" },
  { label: "Confirmadas", value: "confirmada" },
  { label: "Canceladas", value: "cancelada" },
];

function fechaCorta(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

export default async function ReservasAdmin({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const todas = await listReservas();
  const activo = estado && FILTROS.some((f) => f.value === estado) ? estado : "todas";
  const reservas = activo === "todas" ? todas : todas.filter((r) => r.estado === activo);
  const fromUrl = activo === "todas" ? "/admin/reservas" : `/admin/reservas?estado=${activo}`;

  const conteo = (e: EstadoReserva) => todas.filter((r) => r.estado === e).length;

  return (
    <div>
      <PageHeader
        title="Reservas"
        subtitle={`${todas.length} solicitudes · ${conteo("pendiente")} pendientes`}
        action={
          <a
            href="/api/admin/reservas/export"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-navy/15 text-navy/75 text-[13px] font-semibold hover:border-navy hover:text-navy transition-colors"
          >
            <Icon.Arrow className="w-4 h-4 rotate-90" /> Exportar CSV
          </a>
        }
      />

      <div className="flex gap-2 flex-wrap mb-5">
        {FILTROS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "todas" ? "/admin/reservas" : `/admin/reservas?estado=${f.value}`}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
              activo === f.value
                ? "bg-navy text-white border-navy"
                : "bg-white text-navy/70 border-navy/10 hover:border-navy/40"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {reservas.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-3">
            <Icon.Calendar className="w-6 h-6" />
          </span>
          <p className="text-navy/55 text-[14px]">No hay reservas en esta vista.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservas.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-navy text-[16px]">{r.destino}</span>
                    <EstadoBadge estado={r.estado} />
                  </div>
                  <div className="text-[12px] text-navy/55 mt-1">
                    {r.nombre} · {r.telefono} · {r.viajeros}{" "}
                    {r.viajeros === 1 ? "viajero" : "viajeros"} · salida {r.fecha}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-navy text-[14px]">
                    {formatCOP(r.totalEstimado)}
                  </div>
                  <div className="text-[11px] text-navy/45">{fechaCorta(r.createdAt)}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-navy/8 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-navy/40 mr-1">Marcar:</span>
                  {ESTADOS.map((e) => {
                    const activoEstado = r.estado === e;
                    return (
                      <form key={e} action={cambiarEstadoReservaAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="estado" value={e} />
                        <input type="hidden" name="from" value={fromUrl} />
                        <button
                          disabled={activoEstado}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                            activoEstado
                              ? "bg-navy text-white border-navy cursor-default"
                              : "bg-white text-navy/60 border-navy/15 hover:border-navy hover:text-navy"
                          }`}
                        >
                          {ESTADO_LABEL[e]}
                        </button>
                      </form>
                    );
                  })}
                </div>
                <Link
                  href={`/admin/reservas/${r.id}`}
                  className="inline-flex items-center gap-1 text-coral text-[12px] font-semibold hover:gap-2 transition-all"
                >
                  Ver detalle <Icon.Arrow className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
