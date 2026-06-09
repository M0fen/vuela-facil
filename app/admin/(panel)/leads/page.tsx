import { listLeads } from "@/lib/store";
import { deleteLeadAction } from "../../actions";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-navy text-[26px]">Leads</h1>
        <span className="text-navy/55 text-[13px]">{leads.length} en total</span>
      </div>

      {leads.length === 0 ? (
        <p className="text-navy/50 text-[14px]">
          Aún no hay contactos capturados. Aparecerán aquí cuando alguien use el formulario del sitio.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-navy/55 border-b border-navy/10">
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">WhatsApp</th>
                <th className="px-4 py-3 font-semibold">Origen</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-navy/5 last:border-0">
                  <td className="px-4 py-3 text-navy/70 whitespace-nowrap">{fecha(l.createdAt)}</td>
                  <td className="px-4 py-3 text-navy font-medium">
                    <a href={`mailto:${l.email}`} className="hover:text-coral">
                      {l.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-navy/70">{l.telefono ?? "—"}</td>
                  <td className="px-4 py-3 text-navy/55">{l.origen}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteLeadAction}>
                      <input type="hidden" name="id" value={l.id} />
                      <button className="text-coral/80 hover:text-coral text-[12px] font-semibold">
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
