import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import { NEGOCIO } from "@/lib/data";

// Imagen de previsualización (Open Graph + Twitter) que se ve al compartir el
// enlace en WhatsApp, Facebook, etc. Se genera en el build con el LOGO REAL +
// los colores de marca. Next la enlaza como og:image y twitter:image.
export const alt = "Vuela Fácil Travel · Agencia de viajes en Pereira";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Logo real embebido como data URI (se lee en el build).
const logoData = readFileSync(join(process.cwd(), "public/images/logo.jpg")).toString("base64");
const logoSrc = `data:image/jpeg;base64,${logoData}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d2c54 0%, #123c70 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          color: "#f7f3ec",
        }}
      >
        {/* Marca con el logo real */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Vuela Fácil Travel"
            width={84}
            height={84}
            style={{ width: 84, height: 84, borderRadius: 999, background: "#fff", objectFit: "cover" }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            Vuela Fácil Travel
          </div>
        </div>

        {/* Titular */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            Viajes a la medida por Colombia y el mundo
          </div>
          <div style={{ fontSize: 34, color: "#f4a93c", fontWeight: 500 }}>
            Asesoría humana en Pereira · Reserva por WhatsApp
          </div>
        </div>

        {/* Pie con señales de confianza */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 26, color: "#cfdcec" }}>
          <span>{NEGOCIO.rnt}</span>
          <span style={{ color: "#5fb5e6" }}>•</span>
          <span>{NEGOCIO.anios} años de experiencia</span>
          <span style={{ color: "#5fb5e6" }}>•</span>
          <span>{NEGOCIO.telefonoDisplay}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
