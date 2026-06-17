import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { readGuias } from "@/lib/store";
import { deleteGuiaAction } from "../../actions";
import { PageHeader, ErrorBanner, btnPrimary, btnDanger } from "../ui";

export const dynamic = "force-dynamic";

export default async function GuiasAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const guias = await readGuias();

  return (
    <div>
      <ErrorBanner show={!!error} />
      <PageHeader
        title="Guías"
        subtitle={`${guias.length} ${guias.length === 1 ? "guía" : "guías"} · ${
          guias.filter((g) => g.publicada).length
        } publicadas`}
        action={
          <Link href="/admin/guias/nueva" className={btnPrimary}>
            <Icon.Globe className="w-4 h-4" /> Nueva guía
          </Link>
        }
      />

      <div className="space-y-3">
        {guias.map((g) => (
          <div
            key={g.id}
            className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04)] hover:border-coral/30 transition-all"
          >
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-ivory">
              <Image src={g.imagen} alt={g.titulo} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-navy text-[15px] line-clamp-1">{g.titulo}</span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
                    g.publicada
                      ? "bg-emerald/10 text-emerald-700 border-emerald/30"
                      : "bg-navy/5 text-navy/50 border-navy/15"
                  }`}
                >
                  {g.publicada ? "Publicada" : "Borrador"}
                </span>
              </div>
              <div className="text-navy/45 text-[11px] font-mono mt-0.5">/guias/{g.slug}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/guias/${g.id}`}
                className="px-3.5 py-2 rounded-full border border-navy/15 text-navy text-[12px] font-semibold hover:bg-navy hover:text-white transition-colors"
              >
                Editar
              </Link>
              <form action={deleteGuiaAction}>
                <input type="hidden" name="id" value={g.id} />
                <button className={btnDanger}>Eliminar</button>
              </form>
            </div>
          </div>
        ))}
        {guias.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-navy/15">
            <p className="text-navy/50 text-[14px]">Aún no hay guías.</p>
            <Link href="/admin/guias/nueva" className={`${btnPrimary} mt-4`}>
              Crear la primera
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
