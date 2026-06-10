import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Convierte Markdown a HTML. El contenido lo escribe solo el operador
 * autenticado desde el panel, así que confiamos en la fuente.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md ?? "", { async: false }) as string;
}
