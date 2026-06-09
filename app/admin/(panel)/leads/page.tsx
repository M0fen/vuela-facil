import { Icon } from "@/components/icons";
import { listLeads } from "@/lib/store";
import { deleteLeadAction } from "../../actions";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

function fecha(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function LeadsAdmin() {
  const leads = await listLeads();

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Contactos capturados desde el formulario del sitio."
        action={
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-navy/10 text-navy font-semibold text-[13px]">
            <Icon.Users className="w-4 h-4 text-coral" /> {leads.length} en total
          </span>
        }
      />

      {leads.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-coral/10 text-coral items-center justify-center mb-3">
            <Icon.Users className="w-6 h-6" />
          </span>
          <p className="text-navy/55 text-[14px]">
            Aún no hay contactos capturados.
            <br />
            Aparecerán aquí cuando alguien use el formulario del sitio.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy/8 bg-white shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-navy/50 bg-ivory/60 border-b border-navy/8">
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">WhatsApp</th>
                <th className="px-4 py-3 font-semibold">Origen</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-navy/5 last:border-0 hover:bg-ivory/50 transition-colors">
                  <td className="px-4 py-3 text-navy/65 whitespace-nowrap">{fecha(l.createdAt)}</td>
                  <td className="px-4 py-3 text-navy font-medium">
                    <a href={`mailto:${l.email}`} className="hover:text-coral">
                      {l.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-navy/70">{l.telefono ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-navy/5 border border-navy/10 text-navy/55 text-[11px]">
                      {l.origen}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteLeadAction}>
                      <input type="hidden" name="id" value={l.id} />
                      <button className="text-coral/70 hover:text-coral text-[12px] font-semibold">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
