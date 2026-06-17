import Link from "next/link";
import { Icon } from "@/components/icons";
import type { EstadoLead } from "@/lib/types";
import { listLeads } from "@/lib/store";
import {
  cambiarEstadoLeadAction,
  guardarNotaLeadAction,
  deleteLeadAction,
} from "../../actions";
import {
  PageHeader,
  EstadoLeadBadge,
  ESTADOS_LEAD,
  ESTADO_LEAD_LABEL,
} from "../ui";

export const dynamic = "force-dynamic";

const FILTROS: { label: string; value: string }[] = [
  { label: "Todos", value: "todos" },
  { label: "Nuevos", value: "nuevo" },
  { label: "Contactados", value: "contactado" },
  { label: "Cotizados", value: "cotizado" },
  { label: "Ganados", value: "ganado" },
  { label: "Perdidos", value: "perdido" },
];

function fecha(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

/** Link directo de WhatsApp al teléfono del lead (no a la agencia). */
function waLeadLink(telefono: string): string {
  const num = telefono.replace(/[^\d]/g, "");
  const con57 = num.length === 10 ? `57${num}` : num;
  const msg = "Hola, te escribo de Vuela Fácil Travel 👋 ¿Seguimos con tu plan de viaje?";
  return `https://wa.me/${con57}?text=${encodeURIComponent(msg)}`;
}

export default async function LeadsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const todos = await listLeads();
  const activo = estado && FILTROS.some((f) => f.value === estado) ? estado : "todos";
  const leads = activo === "todos" ? todos : todos.filter((l) => (l.estado ?? "nuevo") === activo);
  const fromUrl = activo === "todos" ? "/admin/leads" : `/admin/leads?estado=${activo}`;

  const conteo = (e: EstadoLead) => todos.filter((l) => (l.estado ?? "nuevo") === e).length;

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`${todos.length} contactos · ${conteo("nuevo")} sin atender · ${conteo("ganado")} ganados`}
        action={
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-navy/10 text-navy font-semibold text-[13px]">
            <Icon.Users className="w-4 h-4 text-coral" /> {todos.length} en total
          </span>
        }
      />

      <div className="flex gap-2 flex-wrap mb-5">
        {FILTROS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "todos" ? "/admin/leads" : `/admin/leads?estado=${f.value}`}
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

      {leads.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-3">
            <Icon.Users className="w-6 h-6" />
          </span>
          <p className="text-navy/55 text-[14px]">
            No hay contactos en esta vista.
            <br />
            Aparecerán aquí cuando alguien use el formulario del sitio.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => {
            const estadoActual = l.estado ?? "nuevo";
            return (
              <div
                key={l.id}
                className="p-4 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {l.email ? (
                        <a
                          href={`mailto:${l.email}`}
                          className="font-semibold text-navy text-[15px] hover:text-coral break-all"
                        >
                          {l.email}
                        </a>
                      ) : (
                        <span className="font-semibold text-navy text-[15px]">
                          {l.telefono ? `WhatsApp ${l.telefono}` : "Contacto por chat"}
                        </span>
                      )}
                      <EstadoLeadBadge estado={estadoActual} />
                    </div>
                    <div className="text-[12px] text-navy/55 mt-1 flex items-center gap-2 flex-wrap">
                      {l.telefono ? (
                        <a
                          href={waLeadLink(l.telefono)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald font-semibold hover:underline"
                        >
                          <Icon.Whatsapp className="w-3.5 h-3.5" /> {l.telefono}
                        </a>
                      ) : (
                        <span className="text-navy/35">Sin teléfono</span>
                      )}
                      <span className="text-navy/30">·</span>
                      <span className="px-2 py-0.5 rounded-full bg-navy/5 border border-navy/10 text-navy/55 text-[11px]">
                        {l.origen}
                      </span>
                      {l.referidoPor && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-coral/10 border border-coral/25 text-coral text-[11px] font-semibold">
                          <Icon.Sparkle className="w-3 h-3" /> Referido por {l.referidoPor}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-navy/45 whitespace-nowrap">{fecha(l.createdAt)}</div>
                    <form action={deleteLeadAction} className="mt-1">
                      <input type="hidden" name="id" value={l.id} />
                      <button className="text-coral/60 hover:text-coral text-[11px] font-semibold">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-navy/8 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-navy/40 mr-1">Etapa:</span>
                  {ESTADOS_LEAD.map((e) => {
                    const sel = estadoActual === e;
                    return (
                      <form key={e} action={cambiarEstadoLeadAction}>
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="estado" value={e} />
                        <input type="hidden" name="from" value={fromUrl} />
                        <button
                          disabled={sel}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                            sel
                              ? "bg-navy text-white border-navy cursor-default"
                              : "bg-white text-navy/60 border-navy/15 hover:border-navy hover:text-navy"
                          }`}
                        >
                          {ESTADO_LEAD_LABEL[e]}
                        </button>
                      </form>
                    );
                  })}
                </div>

                <form
                  action={guardarNotaLeadAction}
                  className="mt-3 flex items-end gap-2"
                >
                  <input type="hidden" name="id" value={l.id} />
                  <label className="flex-1 block">
                    <span className="block text-[11px] font-semibold text-navy/45 mb-1">Notas internas</span>
                    <textarea
                      name="notas"
                      defaultValue={l.notas ?? ""}
                      rows={2}
                      placeholder="Seguimiento, presupuesto, fechas…"
                      className="w-full px-3 py-2 rounded-xl border border-navy/12 bg-white text-navy text-[13px] outline-none transition-all focus:border-coral focus:ring-2 focus:ring-coral/15 resize-y placeholder:text-navy/30"
                    />
                  </label>
                  <button className="px-3.5 py-2 rounded-xl border border-navy/15 text-navy/75 text-[12px] font-semibold hover:border-navy hover:text-navy transition-colors shrink-0">
                    Guardar
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
