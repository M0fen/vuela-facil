import { PageHeader } from "../ui";
import { renderMarkdown } from "@/lib/markdown";
import { TUTORIAL_OPERADOR } from "@/lib/tutorial-operador";
import { AsistenteOperador } from "@/components/admin/AsistenteOperador";

export const metadata = { title: "Ayuda · Panel Vuela Fácil" };

// Ayuda del operador: asistente Lía interno (responde dudas del panel) + el
// manual completo. El tutorial se renderiza con marked (GFM: tablas y listas).
export default function AyudaAdmin() {
  const html = renderMarkdown(TUTORIAL_OPERADOR);
  return (
    <div>
      <PageHeader
        title="Ayuda y tutorial"
        subtitle="Pregúntale a Lía o consulta el manual paso a paso. No necesitas saber de tecnología."
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <article className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5 md:p-8 order-2 lg:order-1">
          <div className="guia-content" dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        <div className="order-1 lg:order-2 lg:sticky lg:top-4">
          <AsistenteOperador />
          <p className="text-[11px] text-navy/45 mt-2 px-1 leading-snug">
            Lía responde con base en este manual. Para datos legales, pagos o cambios técnicos,
            contacta a quien administra el sitio.
          </p>
        </div>
      </div>
    </div>
  );
}
