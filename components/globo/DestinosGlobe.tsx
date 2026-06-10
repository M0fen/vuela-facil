"use client";

// components/globo/DestinosGlobe.tsx
//
// Globo WebGL (react-globe.gl) con calidad profesional:
//  - Tierra real (textura + relieve) y fronteras de países (polygonsData).
//  - Marcadores HTML (htmlElementsData): se posan exactos en el lugar, se
//    ocultan tras el globo (htmlElementVisibilityModifier) y son nítidos/legibles.
//  - Desktop: zoom + arrastre; la etiqueta sale al pasar el cursor; la
//    autorotación se pausa al interactuar y se reanuda al soltar.
//  - Móvil: como no hay hover, la etiqueta del destino que queda al frente se
//    revela sola al girar (cálculo de cercanía al centro, throttled).
//  - Clic en un destino → la cámara se zambulle y abre el paquete o WhatsApp.
//  - Disciplina de 60 fps: datos memoizados, cero setState por frame,
//    ResizeObserver con debounce, pausa fuera de viewport, calidad adaptativa.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { useUI } from "@/lib/ui-context";
import { waLink } from "@/lib/utils";
import { DESTINOS, RUTAS_CRUCERO } from "@/lib/destinos";
import {
  type ArcoDato,
  type PuntoDato,
  type RutaDato,
  COLOR,
  ORIGEN,
  buildArcos,
  buildArcosCrucero,
  buildPuntos,
  buildRutas,
} from "@/lib/geo";
import { useAdaptiveQuality } from "@/hooks/useAdaptiveQuality";

const POV_GENERAL = { lat: 8, lng: -75, altitude: 2.2 };
const POV_ZOOM_ALT = 0.62;

const MARKER_CSS = `
.vf-mk{position:relative;transform:translate(-50%,-50%);cursor:pointer;pointer-events:auto;transition:opacity .25s}
.vf-mk-dot{display:block;width:11px;height:11px;border-radius:9999px;background:var(--c);box-shadow:0 0 0 3px rgba(255,255,255,.18),0 0 12px var(--c)}
.vf-mk.destacado .vf-mk-dot{width:15px;height:15px;box-shadow:0 0 0 4px rgba(255,255,255,.24),0 0 18px var(--c)}
.vf-mk.puerto .vf-mk-dot{width:7px;height:7px;box-shadow:0 0 0 2px rgba(255,255,255,.16)}
.vf-mk-label{position:absolute;left:50%;bottom:calc(100% + 7px);transform:translateX(-50%) translateY(4px);white-space:nowrap;background:rgba(13,44,84,.94);color:#f7f3ec;font:600 12px/1.1 Inter,system-ui,sans-serif;letter-spacing:.01em;padding:5px 10px;border-radius:9999px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;box-shadow:0 8px 22px rgba(0,0,0,.42)}
.vf-mk-label::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(13,44,84,.94)}
.vf-mk:hover .vf-mk-label,.vf-mk.activo .vf-mk-label,.vf-mk.origen .vf-mk-label{opacity:1;transform:translateX(-50%) translateY(0)}
.vf-mk.origen .vf-mk-dot{background:${COLOR.coral}}
`;

function injectCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById("vf-globo-mk")) return;
  const s = document.createElement("style");
  s.id = "vf-globo-mk";
  s.textContent = MARKER_CSS;
  document.head.appendChild(s);
}

export function DestinosGlobe({ inView, onReady }: { inView: boolean; onReady?: () => void }) {
  const { openPackage, activePackageId } = useUI();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const markerMap = useRef<Map<PuntoDato, HTMLElement>>(new Map());
  const coarseRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [paises, setPaises] = useState<object[]>([]);

  const quality = useAdaptiveQuality(inView && ready);

  // --- Datos memoizados (estables) ----------------------------------------
  const arcs = useMemo<ArcoDato[]>(
    () => [...buildArcos(DESTINOS), ...buildArcosCrucero(RUTAS_CRUCERO)],
    [],
  );
  const puntos = useMemo<PuntoDato[]>(() => buildPuntos(DESTINOS, RUTAS_CRUCERO), []);
  const rutas = useMemo<RutaDato[]>(() => buildRutas(RUTAS_CRUCERO), []);
  const rings = useMemo(() => [{ lat: ORIGEN.lat, lng: ORIGEN.lng }], []);
  const destinoMap = useMemo(() => new Map(DESTINOS.map((d) => [d.id, d])), []);

  // Esfera "océano" navy: material Phong sutil (sin textura realista → liviano,
  // y los labels blancos se leen sobre el navy oscuro).
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("#0d2c54"),
        emissive: new THREE.Color("#0a2342"),
        emissiveIntensity: 0.35,
        shininess: 6,
        specular: new THREE.Color("#13386b"),
      }),
    [],
  );

  // Continentes en hexágonos ivory; Colombia un poco más brillante (es casa).
  const hexColor = useCallback((obj: object) => {
    const props = (obj as { properties?: { NAME?: string; ADMIN?: string } }).properties;
    const n = props?.NAME || props?.ADMIN || "";
    return n === "Colombia" ? "rgba(247,243,236,0.78)" : "rgba(247,243,236,0.5)";
  }, []);

  // --- Cargar fronteras de países (lazy, al montar) -----------------------
  useEffect(() => {
    let vivo = true;
    fetch("/globe/countries-110m.geojson")
      .then((r) => r.json())
      .then((geo: { features?: object[] }) => {
        if (vivo && geo.features) setPaises(geo.features);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  // --- Dimensionar con ResizeObserver (debounce 150 ms) -------------------
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let t = 0;
    const apply = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    apply();
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(apply, 150);
    });
    ro.observe(el);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  // --- Acciones de clic (vía ref para no recrear los marcadores HTML) -----
  const volverAlGeneral = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(POV_GENERAL, 1000);
    g.controls().autoRotate = quality.autorotar;
  }, [quality.autorotar]);

  const abrir = useCallback(
    (refId: string) => {
      const d = destinoMap.get(refId);
      if (d) {
        if (d.paqueteId) openPackage(d.paqueteId);
        else {
          window.open(waLink(`Hola Vuela Fácil, quiero cotizar un viaje a ${d.nombre}.`), "_blank", "noopener");
          timers.current.push(window.setTimeout(volverAlGeneral, 600));
        }
        return;
      }
      const c = RUTAS_CRUCERO.find((r) => r.id === refId);
      if (c) {
        if (c.paqueteId) openPackage(c.paqueteId);
        else {
          window.open(waLink(`Hola Vuela Fácil, quiero cotizar el ${c.nombre}.`), "_blank", "noopener");
          timers.current.push(window.setTimeout(volverAlGeneral, 600));
        }
      }
    },
    [destinoMap, openPackage, volverAlGeneral],
  );

  const handlePointClick = useCallback(
    (pt: PuntoDato) => {
      const g = globeRef.current;
      if (!g) return;
      if (pt.tipo === "origen") {
        g.pointOfView(POV_GENERAL, 900);
        return;
      }
      g.controls().autoRotate = false;
      g.pointOfView({ lat: pt.lat, lng: pt.lng, altitude: POV_ZOOM_ALT }, 1100);
      if (pt.refId) timers.current.push(window.setTimeout(() => abrir(pt.refId as string), 750));
    },
    [abrir],
  );
  const clickRef = useRef(handlePointClick);
  clickRef.current = handlePointClick;

  // --- Crear cada marcador HTML (una vez por dato) ------------------------
  const crearMarcador = useCallback((obj: object): HTMLElement => {
    const pt = obj as PuntoDato;
    const el = document.createElement("div");
    el.className =
      "vf-mk" +
      (pt.destacado ? " destacado" : "") +
      (pt.tipo === "puerto" ? " puerto" : "") +
      (pt.tipo === "origen" ? " origen" : "");
    el.style.setProperty("--c", pt.color);
    const dot = document.createElement("span");
    dot.className = "vf-mk-dot";
    el.appendChild(dot);
    if (pt.label) {
      const lb = document.createElement("span");
      lb.className = "vf-mk-label";
      lb.textContent = pt.label;
      el.appendChild(lb);
    }
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      clickRef.current(pt);
    });
    markerMap.current.set(pt, el);
    return el;
  }, []);

  // --- Setup imperativo al estar listo ------------------------------------
  const autorotarRef = useRef(quality.autorotar);
  autorotarRef.current = quality.autorotar;

  const handleReady = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    injectCSS();

    // Iluminación suave (reemplaza la default) para que lea como esfera; sin sombras.
    const hemi = new THREE.HemisphereLight(0xbcd4ff, 0x081428, 0.95);
    const dir = new THREE.DirectionalLight(0xffffff, 0.35);
    dir.position.set(1, 0.5, 0.8);
    g.lights([hemi, dir]);

    const coarse =
      typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
    coarseRef.current = !!coarse;

    g.pointOfView(POV_GENERAL, 0);
    const c = g.controls();
    c.enableZoom = !coarse; // desktop: zoom con rueda; móvil: revelado por cercanía
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.autoRotate = true;
    c.autoRotateSpeed = 0.4;
    c.minDistance = 140;
    c.maxDistance = 420;

    // Pausar autorotación mientras el usuario interactúa; reanudar al soltar.
    c.addEventListener("start", () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      c.autoRotate = false;
    });
    c.addEventListener("end", () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        if (!activePackageId) c.autoRotate = autorotarRef.current;
      }, 3500);
    });

    g.renderer().setPixelRatio(quality.dpr);
    setReady(true);
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  // --- Móvil: revelar la etiqueta del destino que queda al frente ---------
  useEffect(() => {
    if (!ready || !inView || !coarseRef.current) return;
    const id = window.setInterval(() => {
      const g = globeRef.current;
      if (!g || document.hidden) return;
      const cam = g.camera().position;
      const camLen = Math.hypot(cam.x, cam.y, cam.z) || 1;
      let best: PuntoDato | null = null;
      let bestCos = -1;
      for (const pt of puntos) {
        if (pt.tipo === "puerto") continue; // solo destinos/origen revelan ref
        const p = g.getCoords(pt.lat, pt.lng);
        const len = Math.hypot(p.x, p.y, p.z) || 1;
        const cos = (p.x * cam.x + p.y * cam.y + p.z * cam.z) / (len * camLen);
        if (cos > bestCos) {
          bestCos = cos;
          best = pt;
        }
      }
      for (const [pt, el] of markerMap.current) {
        if (pt.tipo === "origen") continue; // Pereira siempre etiquetada
        el.classList.toggle("activo", pt === best && bestCos > 0.55);
      }
    }, 220);
    return () => window.clearInterval(id);
  }, [ready, inView, puntos]);

  // --- Restaurar la vista al cerrar el modal ------------------------------
  const prevActive = useRef<string | null>(activePackageId);
  useEffect(() => {
    if (prevActive.current && !activePackageId && ready) volverAlGeneral();
    prevActive.current = activePackageId;
  }, [activePackageId, ready, volverAlGeneral]);

  // --- Pausar/reanudar render (viewport + pestaña) ------------------------
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;
    const update = () => {
      if (inView && !document.hidden) g.resumeAnimation();
      else g.pauseAnimation();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [inView, ready]);

  // --- Aplicar tier de calidad en runtime ---------------------------------
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;
    g.renderer().setPixelRatio(quality.dpr);
    g.controls().autoRotate = quality.autorotar && !activePackageId;
  }, [quality.dpr, quality.autorotar, ready, activePackageId]);

  // --- Limpieza ------------------------------------------------------------
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      globeMaterial.dispose();
    };
  }, [globeMaterial]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          rendererConfig={{ alpha: true, antialias: quality.antialias, powerPreference: "high-performance" }}
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={COLOR.coral}
          atmosphereAltitude={0.15}
          onGlobeReady={handleReady}
          // Continentes en hexágonos ivory (estilo cartográfico, no textura real)
          hexPolygonsData={paises}
          hexPolygonResolution={3}
          hexPolygonMargin={0.3}
          hexPolygonAltitude={0.005}
          hexPolygonColor={hexColor}
          hexPolygonsTransitionDuration={0}
          // Arcos de vuelo
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcStroke={0.5}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={quality.arcosAnimados ? 2500 : 0}
          arcsTransitionDuration={0}
          // Rutas de crucero
          pathsData={rutas}
          pathPoints="coords"
          pathPointLat={(p) => (p as number[])[0]}
          pathPointLng={(p) => (p as number[])[1]}
          pathColor="color"
          pathStroke={1.6}
          pathDashLength={0.5}
          pathDashGap={0.25}
          pathDashAnimateTime={quality.arcosAnimados ? 4000 : 0}
          pathTransitionDuration={0}
          // Marcadores HTML (origen, destinos, puertos)
          htmlElementsData={puntos}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.012}
          htmlElement={crearMarcador}
          htmlElementVisibilityModifier={(el, isVisible) => {
            el.style.opacity = isVisible ? "1" : "0";
            el.style.pointerEvents = isVisible ? "auto" : "none";
          }}
          // Pulso en Pereira
          ringsData={quality.efectos ? rings : []}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(232,99,26,${Math.sqrt(1 - t)})`}
          ringMaxRadius={5}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1400}
        />
      )}
    </div>
  );
}

export default DestinosGlobe;
