"use client";

// components/globo/DestinosGlobe.tsx
//
// Globo WebGL (react-globe.gl). Disciplina de 60 fps:
//  - Cero setState por frame: toda la animación vive en el loop de three; React
//    solo reconfigura imperativamente vía ref o cuando cambia el tier de calidad.
//  - Datos memoizados (arcos/puntos/rutas/rings) para no reconstruir objetos.
//  - ResizeObserver con debounce; pausa fuera de viewport / pestaña oculta.
//  - Calidad adaptativa (useAdaptiveQuality) ajusta dpr, atmósfera, rings,
//    animación de arcos y autorotación en runtime.
//
// Interacción "entretenida": clic en un destino → la cámara se zambulle (fly-to
// con altitude baja) y luego abre el paquete (modal) o WhatsApp de cotización.

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

export function DestinosGlobe({ inView, onReady }: { inView: boolean; onReady?: () => void }) {
  const { openPackage, activePackageId } = useUI();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

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

  const globeMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#15315c") }),
    [],
  );

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

  // --- Setup imperativo al estar listo ------------------------------------
  const handleReady = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(POV_GENERAL, 0);
    const c = g.controls();
    c.enableZoom = false;
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.autoRotate = true;
    c.autoRotateSpeed = 0.4;
    c.minDistance = 200;
    g.renderer().setPixelRatio(quality.dpr);
    setReady(true);
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  // --- Acciones de clic ----------------------------------------------------
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
        if (d.paqueteId) {
          openPackage(d.paqueteId); // restauración al cerrar el modal (efecto abajo)
        } else {
          window.open(
            waLink(`Hola Vuela Fácil, quiero cotizar un viaje a ${d.nombre}.`),
            "_blank",
            "noopener",
          );
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
    (obj: object) => {
      const pt = obj as PuntoDato;
      const g = globeRef.current;
      if (!g) return;
      if (pt.tipo === "origen") {
        g.pointOfView(POV_GENERAL, 900);
        return;
      }
      // Zambullida hacia el punto y, a mitad del vuelo, abrir el destino.
      g.controls().autoRotate = false;
      g.pointOfView({ lat: pt.lat, lng: pt.lng, altitude: POV_ZOOM_ALT }, 1100);
      if (pt.tipo === "destino" && pt.refId) {
        timers.current.push(window.setTimeout(() => abrir(pt.refId as string), 750));
      }
    },
    [abrir],
  );

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
          showAtmosphere={quality.efectos}
          atmosphereColor={COLOR.coral}
          atmosphereAltitude={0.18}
          onGlobeReady={handleReady}
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
          // Puntos (origen, destinos, puertos)
          pointsData={puntos}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointLabel="label"
          pointAltitude={0.012}
          pointRadius={(o) => (o as PuntoDato).size * 0.4}
          pointsTransitionDuration={0}
          onPointClick={handlePointClick}
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
