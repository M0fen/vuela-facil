// "Vistos recientemente" en el navegador (localStorage). Sin cookies ni datos
// sensibles. Guarda solo IDs de paquetes que el usuario abrió.

const KEY = "vf:vistos";
const MAX = 12;
export const VISTOS_EVENT = "vf:vistos";

export function getVistos(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function recordVisto(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const arr = [id, ...getVistos().filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(arr));
    window.dispatchEvent(new Event(VISTOS_EVENT));
  } catch {
    // localStorage no disponible (modo privado, etc.): ignorar.
  }
}
