// components/globo/DestinosMapa2D.tsx
//
// Póster / fallback 2D del globo: un mapa estilizado en SVG con los arcos de
// vuelo desde Pereira, los puntos de cada destino y la ruta del crucero.
// Es DECORATIVO (aria-hidden); la versión accesible e interactiva es la lista
// de <ExploraDestinos>. No usa hooks → server-component puro, sin coste de JS.

import { DESTINOS, RUTAS_CRUCERO } from "@/lib/destinos";
import { COLOR, MAPA_BOUNDS, ORIGEN, colorDestino, proyectar } from "@/lib/geo";

const W = 1000;
const H = 560;

const o = proyectar(ORIGEN.lng, ORIGEN.lat, W, H);

// El póster enmarca Américas + Europa: descarta destinos fuera del encuadre
// (Dubái, Galápagos, etc.) para no dibujar arcos que se salen del marco.
const DESTINOS_MAPA = DESTINOS.filter(
  (d) =>
    d.lng >= MAPA_BOUNDS.minLng &&
    d.lng <= MAPA_BOUNDS.maxLng &&
    d.lat >= MAPA_BOUNDS.minLat &&
    d.lat <= MAPA_BOUNDS.maxLat,
);

/** Arco como curva cuadrática elevada sobre la línea recta origen→destino. */
function arcoPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const lift = Math.min(dist * 0.28, 150);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${(my - lift).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

// Retícula suave (cada 20°) para dar sensación de mapa sin geojson pesado.
const gridLng: number[] = [];
for (let lng = -90; lng <= 0; lng += 20) gridLng.push(lng);
const gridLat: number[] = [];
for (let lat = -10; lat <= 40; lat += 20) gridLat.push(lat);

export function DestinosMapa2D({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="vf-glow" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#13386b" />
          <stop offset="100%" stopColor={COLOR.navy} />
        </radialGradient>
        <linearGradient id="vf-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLOR.coral} />
          <stop offset="100%" stopColor={COLOR.amber} />
        </linearGradient>
      </defs>

      {/* Fondo de marca */}
      <rect x="0" y="0" width={W} height={H} fill="url(#vf-glow)" />

      {/* Retícula tenue */}
      <g stroke={COLOR.ivory} strokeOpacity="0.07" strokeWidth="1">
        {gridLng.map((lng) => {
          const a = proyectar(lng, 46, W, H);
          const b = proyectar(lng, -10, W, H);
          return <line key={`mx${lng}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        {gridLat.map((lat) => {
          const a = proyectar(-92, lat, W, H);
          const b = proyectar(8, lat, W, H);
          return <line key={`my${lat}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
      </g>

      {/* Ruta de crucero (polilínea entre puertos, cerrada) */}
      {RUTAS_CRUCERO.map((r) => {
        const pts = [...r.puertos, r.puertos[0]].map((p) =>
          proyectar(p.lng, p.lat, W, H),
        );
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
        return (
          <g key={r.id}>
            <path d={d} fill="none" stroke={COLOR.amber} strokeWidth="2" strokeDasharray="6 5" strokeOpacity="0.8" />
            {r.puertos.map((p) => {
              const pt = proyectar(p.lng, p.lat, W, H);
              return <circle key={p.nombre} cx={pt.x} cy={pt.y} r="3.5" fill={COLOR.ivory} fillOpacity="0.85" />;
            })}
          </g>
        );
      })}

      {/* Arcos de vuelo origen → destino */}
      {DESTINOS_MAPA.map((dst) => {
        const p = proyectar(dst.lng, dst.lat, W, H);
        return (
          <path
            key={`arc-${dst.id}`}
            d={arcoPath(o.x, o.y, p.x, p.y)}
            fill="none"
            stroke="url(#vf-arc)"
            strokeWidth={dst.destacado ? 2.4 : 1.6}
            strokeOpacity={dst.destacado ? 0.95 : 0.7}
            strokeLinecap="round"
          />
        );
      })}

      {/* Puntos de destino */}
      {DESTINOS_MAPA.map((dst) => {
        const p = proyectar(dst.lng, dst.lat, W, H);
        const c = colorDestino(dst.tipo);
        return (
          <g key={`pt-${dst.id}`}>
            <circle cx={p.x} cy={p.y} r={dst.destacado ? 9 : 7} fill={c} fillOpacity="0.18" />
            <circle cx={p.x} cy={p.y} r={dst.destacado ? 4.5 : 3.5} fill={c} />
          </g>
        );
      })}

      {/* Origen: Pereira, con pulso */}
      <g>
        <circle cx={o.x} cy={o.y} r="6" fill={COLOR.coral} />
        <circle cx={o.x} cy={o.y} r="6" fill="none" stroke={COLOR.coral} strokeWidth="2">
          <animate attributeName="r" from="6" to="22" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <text x={o.x} y={o.y - 16} textAnchor="middle" fill={COLOR.ivory} fontSize="18" fontWeight="600" opacity="0.95">
          Pereira
        </text>
      </g>
    </svg>
  );
}
