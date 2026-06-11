"use client";

// Atribución de referidos SIN cuentas ni perfiles: el nombre de quien refiere
// viaja en el enlace (?ref=) y/o en el mensaje de WhatsApp. Si un visitante
// llega con ?ref=, lo recordamos en este dispositivo (localStorage) para
// adjuntarlo cuando se registre o escriba. Nada se envía a un servidor por sí
// solo y no hay datos personales más allá de un nombre de pila.

import { useEffect, useState } from "react";

const KEY = "vf:ref";
const PARAM = "ref";
const MAX = 40;

export interface Referido {
  nombre: string;
  ts: number;
}

function sanitizar(nombre: string): string {
  return nombre.replace(/\s+/g, " ").trim().slice(0, MAX);
}

/** Lee el parámetro ?ref= de la URL actual (o null si no hay). */
export function leerRefDeUrl(): string | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get(PARAM);
  if (!v) return null;
  const nombre = sanitizar(decodeURIComponent(v));
  return nombre || null;
}

export function getReferido(): Referido | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as unknown;
    if (r && typeof r === "object" && typeof (r as Referido).nombre === "string") {
      return r as Referido;
    }
    return null;
  } catch {
    return null;
  }
}

export function guardarReferido(nombre: string): void {
  const limpio = sanitizar(nombre);
  if (!limpio) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ nombre: limpio, ts: Date.now() }));
  } catch {
    // localStorage no disponible: ignorar.
  }
}

/** Enlace para compartir que atribuye el referido a `nombre`. */
export function enlaceReferido(nombre: string, base = "https://vuelafacil.com"): string {
  return `${base}/?ref=${encodeURIComponent(sanitizar(nombre))}`;
}

/**
 * Hook: captura el ?ref= entrante (lo persiste) y devuelve el referido vigente.
 * Arranca en null para evitar desajustes de hidratación.
 */
export function useReferido(): Referido | null {
  const [ref, setRef] = useState<Referido | null>(null);
  useEffect(() => {
    const url = leerRefDeUrl();
    if (url) guardarReferido(url);
    setRef(getReferido());
  }, []);
  return ref;
}
