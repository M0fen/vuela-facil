"use client";

// components/admin/MapPicker.tsx
//
// Selector de coordenadas para el panel: un mini-mapa donde el operador hace
// clic para fijar el punto. Carga Leaflet por CDN (cero dependencia npm) y
// escribe lat/lng en inputs (name="lat"/"lng") que viajan en el formulario.

import { useEffect, useRef, useState } from "react";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.L) return resolve(w.L);
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    let script = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", () => resolve((window as any).L));
    script.addEventListener("error", reject);
    if (w.L) resolve(w.L);
  });
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-navy/12 bg-white text-navy text-[14px] outline-none focus:border-coral focus:ring-2 focus:ring-coral/15";

export function MapPicker({ initialLat, initialLng }: { initialLat?: number; initialLng?: number }) {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [lat, setLat] = useState(initialLat ?? 4.6);
  const [lng, setLng] = useState(initialLng ?? -74.08);

  useEffect(() => {
    let cancel = false;
    loadLeaflet()
      .then((L) => {
        if (cancel || !mapDiv.current || mapRef.current) return;
        const map = L.map(mapDiv.current).setView([lat, lng], 4);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 18,
        }).addTo(map);
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          color: "#e8631a",
          fillColor: "#e8631a",
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        map.on("click", (e: any) => {
          const la = Math.round(e.latlng.lat * 1e4) / 1e4;
          const ln = Math.round(e.latlng.lng * 1e4) / 1e4;
          setLat(la);
          setLng(ln);
          marker.setLatLng([la, ln]);
        });
        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch(() => {});
    return () => {
      cancel = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // init una sola vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aplicarManual = (la: number, ln: number) => {
    setLat(la);
    setLng(ln);
    if (markerRef.current) markerRef.current.setLatLng([la, ln]);
    if (mapRef.current) mapRef.current.setView([la, ln]);
  };

  return (
    <div>
      <div
        ref={mapDiv}
        className="w-full h-[260px] rounded-xl overflow-hidden border border-navy/12 bg-ivory"
      />
      <p className="text-[11px] text-navy/45 mt-1.5">
        Haz clic en el mapa para fijar la ubicación, o ajusta lat/lng a mano.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <label className="block">
          <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Latitud</span>
          <input
            name="lat"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => aplicarManual(Number(e.target.value) || 0, lng)}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="block text-[12px] font-semibold text-navy/55 mb-1.5">Longitud</span>
          <input
            name="lng"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => aplicarManual(lat, Number(e.target.value) || 0)}
            className={inputCls}
          />
        </label>
      </div>
    </div>
  );
}
