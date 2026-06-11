import type { MetadataRoute } from "next";

// Web App Manifest (PWA). Permite "Agregar a pantalla de inicio" / instalar el
// sitio como app. Los íconos son SVG (servidos desde /public). Para máxima
// compatibilidad en iOS antiguo puedes añadir PNG 192/512 más adelante.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vuela Fácil Travel · Agencia de Viajes en Pereira",
    short_name: "Vuela Fácil",
    description:
      "Viajes a la medida por Colombia y el mundo desde Pereira, con asesoría humana y reserva por WhatsApp.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "es-CO",
    dir: "ltr",
    background_color: "#f7f3ec",
    theme_color: "#0d2c54",
    categories: ["travel", "lifestyle", "shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
