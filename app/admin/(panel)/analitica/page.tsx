import { Icon } from "@/components/icons";
import { readAnalytics } from "@/lib/store";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

function etiqueta(ubicacion: string): string {
  if (ubicacion === "/") return "Inicio";
  if (ubicacion === "/guias") return "Guías (índice)";
  if (ubicacion.startsWith("/guias/")) return `Guía: ${ubicacion.replace("/guias/", "")}`;
  if (ubicacion.startsWith("/paquetes/")) return `Paquete: ${ubicacion.replace("/paquetes/", "")}`;
  return ubicacion;
}

export default async function AnaliticaAdmin() {
  const analytics = await readAnalytics();
  const filas = Object.entries(analytics.whatsapp ?? {}).sort((a, b) => b[1] - a[1]);
  const total = filas.reduce((acc, [, n]) => acc + n, 0);
  const max = filas[0]?.[1] ?? 1;

  return (
    <div>
      <PageHeader
        title="Analítica"
        subtitle="Clics a WhatsApp por página — qué está convirtiendo."
        action={
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-navy/10 text-navy font-semibold text-[13px]">
            <Icon.Whatsapp className="w-4 h-4 text-[#25D366]" /> {total} clics totales
          </span>
        }
      />

      <p className="text-[12px] text-navy/45 mb-5">
        Para vistas, sesiones y orígenes de tráfico, revisa la pestaña <strong>Analytics</strong> en
        tu panel de Vercel.
      </p>

      {filas.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-3">
            <Icon.Chart className="w-6 h-6" />
          </span>
          <p className="text-navy/55 text-[14px]">
            Aún no hay clics registrados. Aparecerán aquí cuando los visitantes usen los botones de
            WhatsApp.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5 md:p-6 space-y-4">
          {filas.map(([ubicacion, n]) => (
            <div key={ubicacion}>
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="text-navy font-medium truncate">{etiqueta(ubicacion)}</span>
                <span className="text-navy/60 shrink-0 ml-3">
                  {n} <span className="text-navy/35">({Math.round((n / total) * 100)}%)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-navy/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-coral to-amber"
                  style={{ width: `${Math.max(4, (n / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
