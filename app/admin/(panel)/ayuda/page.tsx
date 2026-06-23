import { PageHeader } from "../ui";
import { renderMarkdown } from "@/lib/markdown";
import { TUTORIAL_OPERADOR } from "@/lib/tutorial-operador";

export const metadata = { title: "Ayuda · Panel Vuela Fácil" };

// Ayuda del operador: el manual completo. Las dudas en vivo las responde la Lía
// flotante (siempre visible en el panel). El tutorial se renderiza con marked.
export default function AyudaAdmin() {
  const html = renderMarkdown(TUTORIAL_OPERADOR);
  return (
    <div>
      <PageHeader
        title="Ayuda y tutorial"
        subtitle="Consulta el manual paso a paso, o pregúntale a Lía (botón naranja abajo a la derecha). No necesitas saber de tecnología."
      />

      <article className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5 md:p-8 max-w-3xl">
        <div className="guia-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
