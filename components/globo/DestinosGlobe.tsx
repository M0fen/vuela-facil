"use client";

// components/globo/DestinosGlobe.tsx
//
// Globo WebGL editorial (react-globe.gl) — capa de presentación. Recibe sus
// datos y comandos de <ExploraDestinos> (estado único, sin duplicar).
//
// Estética v3: esfera navy Phong + continentes en hexágonos ivory + atmósfera
// coral. Marcadores HTML legibles con labels inteligentes (hover, cercanía al
// centro en móvil, y revelado por zoom). Highlight sincronizado con el rail.
// Micro-interacciones: arcos con reveal escalonado y un avión recorriendo el
// arco del destino activo. Disciplina de 60 fps: datos memoizados, cero
// setState por frame, ResizeObserver con debounce, pausa fuera de viewport,
// calidad adaptativa y dispose en unmount.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Color,
  DirectionalLight,
  HemisphereLight,
  MeshPhongMaterial,
  Sprite,
  SpriteMaterial,
} from "three";
import Globe, { type GlobeMethods } from "react-globe.gl";
import {
  type ArcoDato,
  type Coord,
  type ComandoGlobo,
  type Destino,
  type PuntoDato,
  type RutaCrucero,
  type RutaDato,
  COLOR,
  POV_COLOMBIA,
  buildArcos,
  buildArcosCrucero,
  buildPuntos,
  buildRutas,
} from "@/lib/geo";
import { useAdaptiveQuality } from "@/hooks/useAdaptiveQuality";

const POV_GENERAL = { lat: 8, lng: -75, altitude: 2.2 };
const POV_ZOOM_ALT = 0.7;

export interface DestinosGlobeProps {
  destinos: Destino[];
  rutas: RutaCrucero[];
  origen: Coord;
  /** ISO_A3 de países con destinos (para realzarlos). */
  paisesConDestinos: Set<string>;
  /** id de destino resaltado desde el rail (highlight bidireccional). */
  activoId: string | null;
  /** Comando imperativo de cámara (fly-to / Colombia / reset). */
  comando: ComandoGlobo | null;
  comandoNonce: number;
  /** id del destino cuyo arco lleva el avión animado (o null). */
  avionId: string | null;
  /** Si hay una tarjeta abierta: no reanudar autorotación. */
  pausado: boolean;
  inView: boolean;
  onReady?: () => void;
  onHover?: (id: string | null) => void;
  onSelect?: (refId: string, tipo: "destino" | "puerto") => void;
}

const MARKER_CSS = `
.vf-mk{position:relative;transform:translate(-50%,-50%);cursor:pointer;pointer-events:auto;transition:opacity .25s}
.vf-mk-dot{display:block;width:11px;height:11px;border-radius:9999px;background:var(--c);box-shadow:0 0 0 3px rgba(255,255,255,.18),0 0 12px var(--c);transition:transform .18s,box-shadow .18s}
.vf-mk.destacado .vf-mk-dot{width:15px;height:15px;box-shadow:0 0 0 4px rgba(255,255,255,.24),0 0 18px var(--c)}
.vf-mk.puerto .vf-mk-dot{width:7px;height:7px;box-shadow:0 0 0 2px rgba(255,255,255,.16)}
.vf-mk.sel .vf-mk-dot{transform:scale(1.3);box-shadow:0 0 0 6px rgba(232,99,26,.28),0 0 22px var(--c)}
.vf-mk-label{position:absolute;left:50%;bottom:calc(100% + 7px);transform:translateX(-50%) translateY(4px);white-space:nowrap;background:rgba(13,44,84,.94);color:#f7f3ec;font:600 12px/1.1 Fraunces,Georgia,serif;letter-spacing:.01em;padding:5px 10px;border-radius:9999px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;box-shadow:0 8px 22px rgba(0,0,0,.42)}
.vf-mk-label::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(13,44,84,.94)}
.vf-mk:hover .vf-mk-label,.vf-mk.activo .vf-mk-label,.vf-mk.sel .vf-mk-label,.vf-mk.origen .vf-mk-label{opacity:1;transform:translateX(-50%) translateY(0)}
.vf-mk.origen .vf-mk-dot{background:${COLOR.coral}}
`;

function injectCSS() {
  if (typeof document === "undefined" || document.getElementById("vf-globo-mk")) return;
  const s = document.createElement("style");
  s.id = "vf-globo-mk";
  s.textContent = MARKER_CSS;
  document.head.appendChild(s);
}

/** Textura de avión (vista superior) dibujada en canvas — sin asset externo. */
function makePlaneTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  x.translate(32, 32);
  x.shadowColor = COLOR.coral;
  x.shadowBlur = 7;
  x.fillStyle = "#f7f3ec";
  x.beginPath();
  x.moveTo(0, -22);
  x.quadraticCurveTo(4, -12, 4, -3);
  x.lineTo(22, 7);
  x.lineTo(22, 11);
  x.lineTo(4, 7);
  x.lineTo(4, 15);
  x.lineTo(11, 21);
  x.lineTo(11, 24);
  x.lineTo(0, 21);
  x.lineTo(-11, 24);
  x.lineTo(-11, 21);
  x.lineTo(-4, 15);
  x.lineTo(-4, 7);
  x.lineTo(-22, 11);
  x.lineTo(-22, 7);
  x.lineTo(-4, -3);
  x.quadraticCurveTo(-4, -12, 0, -22);
  x.closePath();
  x.fill();
  return new CanvasTexture(c);
}

export function DestinosGlobe({
  destinos,
  rutas,
  origen,
  paisesConDestinos,
  activoId,
  comando,
  comandoNonce,
  avionId,
  pausado,
  inView,
  onReady,
  onHover,
  onSelect,
}: DestinosGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const markerByKey = useRef<Map<string, HTMLElement>>(new Map());
  const prevSelKey = useRef<string | null>(null);
  const altitudeRef = useRef(2.2);
  const resumeTimer = useRef<number | null>(null);
  const planeRef = useRef<{ sprite: Sprite; raf: number } | null>(null);
  const planeTexRef = useRef<CanvasTexture | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [paises, setPaises] = useState<object[]>([]);
  const [arcosMostrados, setArcosMostrados] = useState(0);

  const quality = useAdaptiveQuality(inView && ready);

  // --- Material y refs estables -------------------------------------------
  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color("#0d2c54"),
        emissive: new Color("#0a2342"),
        emissiveIntensity: 0.35,
        shininess: 6,
        specular: new Color("#13386b"),
      }),
    [],
  );
  // Realce por país: Colombia (cálida) y países con destinos brillan; resto tenue.
  const hexColor = useCallback(
    (obj: object) => {
      const iso = (obj as { properties?: { ISO_A3?: string } }).properties?.ISO_A3 ?? "";
      if (iso === "COL") return "rgba(250,231,212,0.9)"; // ivory cálido (toque coral)
      if (paisesConDestinos.has(iso)) return "rgba(251,247,239,0.8)";
      return "rgba(247,243,236,0.4)";
    },
    [paisesConDestinos],
  );
  // "Glow" barato (sin bloom): un poco más de altura en los países con destinos.
  const hexAltitude = useCallback(
    (obj: object) => {
      const iso = (obj as { properties?: { ISO_A3?: string } }).properties?.ISO_A3 ?? "";
      if (iso === "COL") return 0.013;
      return paisesConDestinos.has(iso) ? 0.008 : 0.005;
    },
    [paisesConDestinos],
  );

  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const autorotarRef = useRef(quality.autorotar);
  autorotarRef.current = quality.autorotar;
  const pausadoRef = useRef(pausado);
  pausadoRef.current = pausado;

  // --- Datos memoizados (recalculan al cambiar filtro/origen) -------------
  const arcos = useMemo<ArcoDato[]>(
    () => [...buildArcos(destinos, origen), ...buildArcosCrucero(rutas, origen)],
    [destinos, rutas, origen],
  );
  const puntos = useMemo<PuntoDato[]>(
    () => buildPuntos(destinos, rutas, origen),
    [destinos, rutas, origen],
  );
  const rutasDato = useMemo<RutaDato[]>(() => buildRutas(rutas), [rutas]);
  const rings = useMemo(() => [{ lat: origen.lat, lng: origen.lng }], [origen]);

  // --- Cargar fronteras/continentes (lazy) --------------------------------
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

  // --- Medición del contenedor --------------------------------------------
  // Síncrona (useLayoutEffect): toma el tamaño con el layout ya resuelto, ANTES
  // del primer paint, para que el globo monte a su tamaño definitivo y no "salte"
  // a una posición rara. Los cambios posteriores (resize) van con debounce.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let t = 0;
    const apply = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      // Evita re-render si no cambió (no remonta el canvas innecesariamente).
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
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

  // --- Clic en un marcador → zambullida + avisar a la sección -------------
  const handlePointClick = useCallback((pt: PuntoDato) => {
    const g = globeRef.current;
    if (!g) return;
    if (pt.tipo === "origen") {
      g.pointOfView(POV_GENERAL, 900);
      return;
    }
    g.controls().autoRotate = false;
    g.pointOfView({ lat: pt.lat, lng: pt.lng, altitude: POV_ZOOM_ALT }, 1100);
    if (pt.refId) onSelectRef.current?.(pt.refId, pt.tipo === "puerto" ? "puerto" : "destino");
  }, []);
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
    if (pt.tipo === "destino" && pt.refId) {
      el.addEventListener("mouseenter", () => onHoverRef.current?.(pt.refId!));
      el.addEventListener("mouseleave", () => onHoverRef.current?.(null));
    }
    markerByKey.current.set(pt.key, el);
    return el;
  }, []);

  // --- Setup imperativo al estar listo ------------------------------------
  const handleReady = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    injectCSS();

    const hemi = new HemisphereLight(0xbcd4ff, 0x081428, 0.95);
    const dir = new DirectionalLight(0xffffff, 0.35);
    dir.position.set(1, 0.5, 0.8);
    g.lights([hemi, dir]);

    const coarse =
      typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;

    g.pointOfView(POV_GENERAL, 0);
    const c = g.controls();
    c.enableZoom = !coarse;
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.autoRotate = true;
    c.autoRotateSpeed = 0.4;
    c.minDistance = 140;
    c.maxDistance = 420;

    c.addEventListener("start", () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      c.autoRotate = false;
    });
    c.addEventListener("end", () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        if (!pausadoRef.current) c.autoRotate = autorotarRef.current;
      }, 3500);
    });

    g.renderer().setPixelRatio(quality.dpr);
    // Reafirma la posición tras un frame: garantiza que el primer fotograma
    // visible ya esté centrado en Colombia (y no en el POV por defecto).
    requestAnimationFrame(() => {
      globeRef.current?.pointOfView(POV_GENERAL, 0);
    });
    setReady(true);
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  // --- Comando imperativo de cámara ---------------------------------------
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready || !comando) return;
    if (comando.kind === "fly") {
      g.controls().autoRotate = false;
      g.pointOfView({ lat: comando.lat, lng: comando.lng, altitude: comando.alt }, 1000);
    } else if (comando.kind === "colombia") {
      g.controls().autoRotate = false;
      g.pointOfView(POV_COLOMBIA, 1200);
    } else if (comando.kind === "reset") {
      g.pointOfView(POV_GENERAL, 1000);
      g.controls().autoRotate = autorotarRef.current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comandoNonce, ready]);

  // --- Highlight sincronizado (rail → globo) + poda de marcadores stale ----
  useEffect(() => {
    // Al cambiar el set de puntos (filtro/origen), elimina del mapa los
    // marcadores cuyos DOM ya removió la librería (evita fuga de memoria).
    const vigentes = new Set(puntos.map((p) => p.key));
    for (const key of markerByKey.current.keys()) {
      if (!vigentes.has(key)) markerByKey.current.delete(key);
    }
    const prev = prevSelKey.current;
    if (prev) markerByKey.current.get(prev)?.classList.remove("sel");
    const k = activoId ? `d:${activoId}` : null;
    if (k) markerByKey.current.get(k)?.classList.add("sel");
    prevSelKey.current = k;
  }, [activoId, puntos]);

  // --- Zoom: solo registra la altitud (alimenta el declutter de labels) ---
  const onZoom = useCallback((pov: { altitude: number }) => {
    altitudeRef.current = pov.altitude;
  }, []);

  // --- Declutter de labels: revela los destinos del frente, con tope por
  //     zoom y anti-solapamiento (collision). Funciona en desktop y móvil. ---
  useEffect(() => {
    if (!ready || !inView) return;
    const id = window.setInterval(() => {
      const g = globeRef.current;
      if (!g || document.hidden) return;
      const cam = g.camera().position;
      const camLen = Math.hypot(cam.x, cam.y, cam.z) || 1;
      const cands: { pt: PuntoDato; cos: number; x: number; y: number }[] = [];
      for (const pt of puntos) {
        if (pt.tipo !== "destino") continue;
        const p = g.getCoords(pt.lat, pt.lng);
        const len = Math.hypot(p.x, p.y, p.z) || 1;
        const cos = (p.x * cam.x + p.y * cam.y + p.z * cam.z) / (len * camLen);
        if (cos < 0.25) continue; // descarta el lado lejano del globo
        const s = g.getScreenCoords(pt.lat, pt.lng);
        cands.push({ pt, cos, x: s.x, y: s.y });
      }
      cands.sort((a, b) => b.cos - a.cos); // los más centrados primero
      const alt = altitudeRef.current;
      const N = alt > 1.8 ? 4 : alt > 1.2 ? 7 : 12;
      const kept: typeof cands = [];
      for (const c of cands) {
        if (kept.length >= N) break;
        const choca = kept.some((k) => Math.abs(k.x - c.x) < 74 && Math.abs(k.y - c.y) < 26);
        if (!choca) kept.push(c);
      }
      const keptKeys = new Set(kept.map((k) => k.pt.key));
      for (const pt of puntos) {
        if (pt.tipo !== "destino") continue;
        markerByKey.current.get(pt.key)?.classList.toggle("activo", keptKeys.has(pt.key));
      }
    }, 220);
    return () => window.clearInterval(id);
  }, [ready, inView, puntos]);

  // --- Reveal escalonado de arcos ("rutas encendiéndose") -----------------
  // Se dispara al estar listo y al cambiar el set de arcos (filtro/origen);
  // NO depende de inView para no re-encenderse en cada scroll.
  useEffect(() => {
    if (!ready) return;
    setArcosMostrados(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setArcosMostrados(n);
      if (n >= arcos.length) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
    // Sin `inView`: no re-encender los arcos cada vez que se entra/sale del scroll.
  }, [arcos, ready]);

  // --- Avión recorriendo el arco del destino activo -----------------------
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;

    const teardown = () => {
      if (planeRef.current) {
        cancelAnimationFrame(planeRef.current.raf);
        const { sprite } = planeRef.current;
        g.scene().remove(sprite);
        sprite.material.dispose(); // la textura es compartida → se libera al desmontar
        planeRef.current = null;
      }
    };
    teardown();

    const destino = avionId ? destinos.find((d) => d.id === avionId) : null;
    const ruta = avionId ? rutas.find((r) => r.id === avionId) : null;
    const to: Coord | null = destino
      ? { nombre: destino.nombre, lat: destino.lat, lng: destino.lng }
      : ruta
        ? ruta.embarque
        : null;
    if (!to || !quality.arcosAnimados) return teardown;

    // Textura del avión creada una sola vez y reutilizada en cada selección.
    if (!planeTexRef.current) planeTexRef.current = makePlaneTexture();
    const mat = new SpriteMaterial({ map: planeTexRef.current, transparent: true, depthWrite: false });
    const sprite = new Sprite(mat);
    sprite.scale.setScalar(g.getGlobeRadius() * 0.07);
    g.scene().add(sprite);

    const dur = 4200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) % dur) / dur;
      const lat = origen.lat + (to.lat - origen.lat) * t;
      const lng = origen.lng + (to.lng - origen.lng) * t;
      const alt = Math.sin(t * Math.PI) * 0.45; // joroba del arco
      const p = g.getCoords(lat, lng, alt);
      sprite.position.set(p.x, p.y, p.z);
      planeRef.current!.raf = requestAnimationFrame(tick);
    };
    planeRef.current = { sprite, raf: requestAnimationFrame(tick) };

    return teardown;
  }, [avionId, ready, destinos, rutas, origen, quality.arcosAnimados]);

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
    g.controls().autoRotate = quality.autorotar && !pausado;
  }, [quality.dpr, quality.autorotar, ready, pausado]);

  // --- Limpieza ------------------------------------------------------------
  useEffect(() => {
    const pending = timers.current;
    const plane = planeRef;
    const planeTex = planeTexRef;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      if (plane.current) {
        cancelAnimationFrame(plane.current.raf);
        plane.current.sprite.material.dispose();
      }
      planeTex.current?.dispose();
      globeMaterial.dispose();
    };
  }, [globeMaterial]);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
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
          onZoom={onZoom}
          // Continentes en hexágonos ivory
          hexPolygonsData={paises}
          hexPolygonResolution={3}
          hexPolygonMargin={0.2}
          hexPolygonAltitude={hexAltitude}
          hexPolygonColor={hexColor}
          hexPolygonsTransitionDuration={0}
          // Arcos de vuelo (reveal escalonado)
          arcsData={arcos.slice(0, arcosMostrados)}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcStroke={0.5}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={quality.arcosAnimados ? 2500 : 0}
          arcsTransitionDuration={700}
          // Rutas de crucero
          pathsData={rutasDato}
          pathPoints="coords"
          pathPointLat={(p) => (p as number[])[0]}
          pathPointLng={(p) => (p as number[])[1]}
          pathColor="color"
          pathStroke={1.6}
          pathDashLength={0.5}
          pathDashGap={0.25}
          pathDashAnimateTime={quality.arcosAnimados ? 4000 : 0}
          pathTransitionDuration={0}
          // Marcadores HTML
          htmlElementsData={puntos}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.012}
          htmlElement={crearMarcador}
          htmlElementVisibilityModifier={(el, isVisible) => {
            el.style.opacity = isVisible ? "1" : "0";
            el.style.pointerEvents = isVisible ? "auto" : "none";
          }}
          // Pulso en el origen
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
