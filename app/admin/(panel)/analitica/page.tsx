import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { readAnalytics, listLeads, listReservas } from "@/lib/store";
import { formatCOP } from "@/lib/utils";
import type { EstadoLead, EstadoReserva } from "@/lib/types";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

// Etiqueta legible para cada página donde se tocó WhatsApp.
function etiquetaPagina(ubicacion: string): string {
  if (ubicacion === "/") return "Página de inicio";
  if (ubicacion === "/guias") return "Blog de guías";
  if (ubicacion.startsWith("/guias/")) return `Guía: ${ubicacion.replace("/guias/", "")}`;
  if (ubicacion.startsWith("/paquetes/")) return `Paquete: ${ubicacion.replace("/paquetes/", "")}`;
  if (ubicacion.startsWith("/viajes/")) return `Categoría: ${ubicacion.replace("/viajes/", "")}`;
  return ubicacion;
}

const hace7dias = Date.now() - 7 * 24 * 60 * 60 * 1000;
const enUltimos7 = (iso: string) => {
  const t = Date.parse(iso);
  return !Number.isNaN(t) && t >= hace7dias;
};

// Etapas del embudo de leads, en orden y con su significado en palabras simples.
const ETAPAS: { key: EstadoLead; label: string; ayuda: string; color: string; barra: string }[] = [
  { key: "nuevo", label: "Nuevos (sin contactar)", ayuda: "Escríbeles hoy", color: "text-coral", barra: "bg-coral" },
  { key: "contactado", label: "Contactados", ayuda: "Ya les escribiste", color: "text-sky", barra: "bg-sky" },
  { key: "cotizado", label: "Cotizados", ayuda: "Les pasaste precio", color: "text-amber", barra: "bg-amber" },
  { key: "ganado", label: "Ganados (venta)", ayuda: "¡Cerraste!", color: "text-emerald", barra: "bg-emerald" },
  { key: "perdido", label: "Perdidos", ayuda: "No avanzaron", color: "text-navy/40", barra: "bg-navy/25" },
];

const RESERVA_ESTADOS: { key: EstadoReserva; label: string; dot: string }[] = [
  { key: "pendiente", label: "Pendientes", dot: "bg-coral" },
  { key: "en_proceso", label: "En proceso", dot: "bg-amber" },
  { key: "confirmada", label: "Confirmadas", dot: "bg-emerald" },
  { key: "cancelada", label: "Canceladas", dot: "bg-navy/25" },
];

// --- Tarjeta de número grande (KPI) con explicación en una línea -------------
function Kpi({
  icon,
  valor,
  titulo,
  ayuda,
  destacado = false,
}: {
  icon: ReactNode;
  valor: ReactNode;
  titulo: string;
  ayuda: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 md:p-5 ${
        destacado ? "bg-coral/5 border-coral/30" : "bg-white border-navy/8"
      } shadow-[0_1px_0_rgba(13,44,84,0.04)]`}
    >
      <div className="flex items-center gap-2 text-navy/55 text-[12px] font-medium">
        <span className={destacado ? "text-coral" : "text-navy/40"}>{icon}</span>
        {titulo}
      </div>
      <div className="mt-1.5 font-serif text-[30px] leading-none text-navy">{valor}</div>
      <div className="mt-1.5 text-[11.5px] text-navy/50 leading-snug">{ayuda}</div>
    </div>
  );
}

export default async function AnaliticaAdmin() {
  const [analytics, leads, reservas] = await Promise.all([
    readAnalytics(),
    listLeads(),
    listReservas(),
  ]);

  // --- Clics a WhatsApp (interés) ---
  const filasWa = Object.entries(analytics.whatsapp ?? {}).sort((a, b) => b[1] - a[1]);
  const totalWa = filasWa.reduce((acc, [, n]) => acc + n, 0);
  const maxWa = filasWa[0]?.[1] ?? 1;

  // --- Leads por etapa ---
  const cont = (e: EstadoLead) => leads.filter((l) => (l.estado ?? "nuevo") === e).length;
  const totalLeads = leads.length;
  const nuevos = cont("nuevo");
  const ganados = cont("ganado");
  const cerrados = ganados + cont("perdido");
  const maxEtapa = Math.max(1, ...ETAPAS.map((e) => cont(e.key)));
  const tasa = cerrados > 0 ? Math.round((ganados / cerrados) * 100) : null;
  const leadsSemana = leads.filter((l) => enUltimos7(l.createdAt)).length;

  // --- Reservas ---
  const contR = (e: EstadoReserva) => reservas.filter((r) => r.estado === e).length;
  const reservasPendientes = contR("pendiente");
  const valorConfirmado = reservas
    .filter((r) => r.estado === "confirmada")
    .reduce((acc, r) => acc + (r.totalEstimado || 0), 0);
  const reservasSemana = reservas.filter((r) => enUltimos7(r.createdAt)).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analítica"
        subtitle="Cómo va tu negocio de un vistazo: cuánta gente se interesa, en qué etapa están tus clientes y cuántas ventas cierras."
      />

      {/* Resumen rápido: los 4 números que importan */}
      <section>
        <h2 className="text-[13px] font-semibold text-navy/70 mb-3">Lo que debes mirar primero</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            icon={<Icon.Users className="w-4 h-4" />}
            valor={nuevos}
            titulo="Leads sin atender"
            ayuda={nuevos > 0 ? "👉 Escríbeles hoy, antes de que se enfríen." : "Vas al día. ¡Bien!"}
            destacado={nuevos > 0}
          />
          <Kpi
            icon={<Icon.Calendar className="w-4 h-4" />}
            valor={reservasPendientes}
            titulo="Reservas pendientes"
            ayuda={
              reservasPendientes > 0 ? "Solicitudes por confirmar o cotizar." : "Sin reservas en espera."
            }
            destacado={reservasPendientes > 0}
          />
          <Kpi
            icon={<Icon.Whatsapp className="w-4 h-4" />}
            valor={totalWa}
            titulo="Interés (clics WhatsApp)"
            ayuda="Veces que tocaron un botón de WhatsApp en el sitio."
          />
          <Kpi
            icon={<Icon.Award className="w-4 h-4" />}
            valor={ganados}
            titulo="Clientes ganados"
            ayuda={tasa !== null ? `${tasa}% de los leads cerrados terminaron en venta.` : "Aún sin ventas registradas."}
          />
        </div>
        <p className="mt-3 text-[12px] text-navy/45">
          Últimos 7 días: <strong className="text-navy/70">{leadsSemana}</strong> leads nuevos ·{" "}
          <strong className="text-navy/70">{reservasSemana}</strong> reservas.
        </p>
      </section>

      {/* Embudo de leads */}
      <section>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h2 className="text-[13px] font-semibold text-navy/70">Tus clientes, por etapa</h2>
          <span className="text-[12px] text-navy/45">{totalLeads} leads en total</span>
        </div>
        <p className="text-[12px] text-navy/50 mb-4 max-w-2xl">
          Así avanza la gente: de interesada a venta. Si muchos se quedan en <strong>“Nuevos”</strong>,
          te falta contactarlos. Mueve cada cliente de etapa desde la sección <strong>Leads</strong>.
        </p>

        {totalLeads === 0 ? (
          <EmptyCard texto="Aún no tienes leads. Aparecerán cuando alguien deje sus datos en el formulario o en el chat con Lía." />
        ) : (
          <div className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5 md:p-6 space-y-4">
            {ETAPAS.map((e) => {
              const n = cont(e.key);
              const pct = totalLeads ? Math.round((n / totalLeads) * 100) : 0;
              return (
                <div key={e.key}>
                  <div className="flex items-center justify-between text-[13px] mb-1">
                    <span className="text-navy font-medium">
                      {e.label} <span className={`text-[11px] ${e.color}`}>· {e.ayuda}</span>
                    </span>
                    <span className="text-navy/60 shrink-0 ml-3">
                      {n} <span className="text-navy/35">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-navy/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${e.barra}`}
                      style={{ width: `${n === 0 ? 0 : Math.max(5, (n / maxEtapa) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reservas por estado */}
      <section>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h2 className="text-[13px] font-semibold text-navy/70">Reservas</h2>
          {valorConfirmado > 0 && (
            <span className="text-[12px] text-emerald font-semibold">
              {formatCOP(valorConfirmado)} confirmados
            </span>
          )}
        </div>
        <p className="text-[12px] text-navy/50 mb-4 max-w-2xl">
          Solicitudes que la gente envió desde un paquete. Muévelas en la sección{" "}
          <strong>Reservas</strong>.
        </p>
        {reservas.length === 0 ? (
          <EmptyCard texto="Aún no hay reservas. Llegarán cuando alguien reserve un paquete desde el sitio." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RESERVA_ESTADOS.map((e) => (
              <div key={e.key} className="bg-white rounded-2xl border border-navy/8 p-4">
                <div className="flex items-center gap-2 text-[12px] text-navy/55">
                  <span className={`w-2 h-2 rounded-full ${e.dot}`} /> {e.label}
                </div>
                <div className="mt-1 font-serif text-[24px] text-navy leading-none">
                  {contR(e.key)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Páginas que generan más interés */}
      <section>
        <h2 className="text-[13px] font-semibold text-navy/70 mb-1">
          ¿Qué despierta más interés?
        </h2>
        <p className="text-[12px] text-navy/50 mb-4 max-w-2xl">
          Dónde la gente toca el botón de WhatsApp. Te dice qué paquetes y páginas atraen más —
          conviene reforzar esos (mejores fotos, ofertas, guías).
        </p>
        {filasWa.length === 0 ? (
          <EmptyCard texto="Aún no hay clics registrados. Aparecerán cuando los visitantes usen los botones de WhatsApp." />
        ) : (
          <div className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5 md:p-6 space-y-4">
            {filasWa.map(([ubicacion, n]) => (
              <div key={ubicacion}>
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <span className="text-navy font-medium truncate">{etiquetaPagina(ubicacion)}</span>
                  <span className="text-navy/60 shrink-0 ml-3">
                    {n} <span className="text-navy/35">({Math.round((n / totalWa) * 100)}%)</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-navy/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-coral to-amber"
                    style={{ width: `${Math.max(4, (n / maxWa) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cómo leer esto */}
      <div className="rounded-2xl border border-navy/10 bg-navy/[0.02] p-4 text-[12px] text-navy/55 leading-relaxed">
        <strong className="text-navy/70">Cómo leer esto:</strong> el <em>interés</em> (clics a
        WhatsApp) se convierte en <em>leads</em>; tú los vas moviendo por etapas hasta cerrar la{" "}
        <em>venta</em>. Lo más importante es atender rápido los <strong>“Nuevos”</strong>. Para
        vistas y orígenes de tráfico (Google, Instagram…), revisa la pestaña{" "}
        <strong>Analytics</strong> en tu panel de Vercel.
      </div>
    </div>
  );
}

function EmptyCard({ texto }: { texto: string }) {
  return (
    <div className="text-center py-12 rounded-2xl bg-white border border-dashed border-navy/15">
      <span className="inline-flex w-11 h-11 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-3">
        <Icon.Chart className="w-5 h-5" />
      </span>
      <p className="text-navy/55 text-[13px] max-w-md mx-auto px-4">{texto}</p>
    </div>
  );
}
