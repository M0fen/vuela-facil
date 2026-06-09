import Link from "next/link";
import Image from "next/image";
import { readPaquetes } from "@/lib/store";
import { formatCOP } from "@/lib/utils";
import { deletePaqueteAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function PaquetesAdmin() {
  const paquetes = await readPaquetes();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-navy text-[26px]">Paquetes</h1>
        <Link
          href="/admin/paquetes/nuevo"
          className="px-4 py-2.5 rounded-full bg-coral text-white text-[13px] font-semibold hover:bg-[#cf550f] transition-colors"
        >
          + Nuevo paquete
        </Link>
      </div>

      <div className="space-y-3">
        {paquetes.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-navy/10"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-ivory">
              <Image src={p.imagen} alt={p.destino} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-navy text-[15px] truncate">{p.destino}</div>
              <div className="text-navy/55 text-[12px]">
                {p.categoria} · {formatCOP(p.precio)} · {p.calificacion}★ ({p.reviews})
              </div>
              <div className="text-navy/40 text-[11px] font-mono">{p.id}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/paquetes/${p.id}`}
                className="px-3 py-2 rounded-full border border-navy/15 text-navy text-[12px] font-semibold hover:bg-navy hover:text-white transition-colors"
              >
                Editar
              </Link>
              <form action={deletePaqueteAction}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  className="px-3 py-2 rounded-full border border-coral/30 text-coral text-[12px] font-semibold hover:bg-coral hover:text-white transition-colors"
                  title="Eliminar paquete"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
        {paquetes.length === 0 && (
          <p className="text-navy/50 text-[14px]">Aún no hay paquetes. Crea el primero.</p>
        )}
      </div>
    </div>
  );
}
