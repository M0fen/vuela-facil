import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { InfoHeader, Prose } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Política de cookies · Vuela Fácil Travel",
  description: "Qué cookies usamos en el sitio y cómo gestionarlas.",
};

export default function CookiesPage() {
  return (
    <article>
      <InfoHeader eyebrow="Legal" title="Política de cookies" />
      <p className="text-navy/45 text-[13px] -mt-4 mb-2">Última actualización: junio de 2026</p>

      <Prose>
        <h2>¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos que un sitio guarda en tu dispositivo para recordar
          información y mejorar tu experiencia. También usamos tecnologías similares (almacenamiento
          local) con fines equivalentes.
        </p>

        <h2>Cookies que utilizamos</h2>
        <ul>
          <li>
            <strong>Necesarias:</strong> permiten el funcionamiento básico del sitio (preferencias de
            interfaz, destinos vistos recientemente).
          </li>
          <li>
            <strong>Analíticas:</strong> métricas anónimas de uso (páginas vistas, clics a WhatsApp)
            para entender qué mejorar. No te identifican personalmente.
          </li>
        </ul>
        <p>
          No utilizamos cookies de publicidad de terceros para perfilarte.
        </p>

        <h2>Cómo gestionarlas</h2>
        <p>
          Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Ten en
          cuenta que desactivar algunas puede afectar el funcionamiento del sitio.
        </p>

        <h2>Más información</h2>
        <p>
          Consulta también nuestra <a href="/privacidad">Política de Privacidad</a> o escríbenos a{" "}
          <a href={`mailto:${NEGOCIO.email}`}>{NEGOCIO.email}</a>.
        </p>
      </Prose>
    </article>
  );
}
