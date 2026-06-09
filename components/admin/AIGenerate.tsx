"use client";

import { useRef, useState } from "react";

/**
 * Botón "Generar con IA" para el panel. Lee campos del formulario contenedor
 * (por `name`), pide a /api/admin/generate que redacte los textos con DeepSeek y
 * los escribe en los campos destino. Funciona con inputs/textareas no controlados.
 */
export function AIGenerate({
  kind,
  read,
  write,
  label = "Generar con IA",
}: {
  kind: "paquete" | "testimonio";
  read: string[];
  write: string[];
  label?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    const form = ref.current?.closest("form");
    if (!form) return;

    const input: Record<string, string> = {};
    for (const name of read) {
      const el = form.elements.namedItem(name) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      input[name] = el?.value ?? "";
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, input }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "No se pudo generar.");
        return;
      }
      const data = json?.data ?? {};
      for (const name of write) {
        if (typeof data[name] === "string") {
          const el = form.elements.namedItem(name) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | null;
          if (el) el.value = data[name];
        }
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        ref={ref}
        type="button"
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[12px] font-semibold hover:shadow-[0_10px_24px_-8px_rgba(232,99,26,0.6)] transition-shadow disabled:opacity-60"
      >
        <span aria-hidden>✨</span>
        {loading ? "Generando…" : label}
      </button>
      {error && <span className="text-[12px] text-coral">{error}</span>}
    </div>
  );
}
