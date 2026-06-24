"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

interface Msg {
  role: "assistant" | "user";
  text: string;
}

const SALUDO: Msg = {
  role: "assistant",
  text: "¡Hola! Soy Lía, tu apoyo dentro del panel 🛠️ Pregúntame lo que necesites: cómo crear o editar un paquete, subir una foto, mover un lead, poner una oferta… lo que sea.",
};

const SUGERENCIAS = [
  "¿Cómo creo un paquete nuevo?",
  "¿Cómo subo una oferta de consolidador (flyer)?",
  "¿Cómo publico un alojamiento en arriendo?",
  "¿Cómo cambio el precio de un paquete?",
  "¿Cómo atiendo un lead?",
];

/** Asistente interno para el operador (en /admin/ayuda). Llama a un endpoint
 *  protegido que conoce el manual del panel. Separado de la Lía de clientes. */
export function AsistenteOperador() {
  const [msgs, setMsgs] = useState<Msg[]>([SALUDO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const enviar = async (texto: string) => {
    const t = texto.trim();
    if (!t || loading) return;
    const historia = [...msgs, { role: "user" as const, text: t }];
    setMsgs([...historia, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historia.map((m) => ({ role: m.role, content: m.text })) }),
      });
      if (!res.ok || !res.body) throw new Error("bad");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", text: acc };
          return c;
        });
      }
      if (!acc.trim()) {
        setMsgs((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", text: "No pude responder esta vez. Intenta de nuevo 🙏" };
          return c;
        });
      }
    } catch {
      setMsgs((m) => {
        const c = [...m];
        c[c.length - 1] = {
          role: "assistant",
          text: "Tuve un problema para responder 😅. Revisa tu conexión e intenta de nuevo.",
        };
        return c;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-navy to-[#163b6e] text-white">
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center font-serif text-[17px]">
          L
        </span>
        <div className="leading-tight">
          <div className="font-semibold text-[14px]">Pregúntale a Lía</div>
          <div className="text-[11px] text-white/70">Tu apoyo dentro del panel</div>
        </div>
      </div>

      <div ref={scrollRef} className="p-4 max-h-[360px] overflow-y-auto space-y-3 bg-ivory">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-navy text-white rounded-br-sm"
                  : "bg-white text-navy border border-navy/8 rounded-bl-sm"
              }`}
            >
              {m.text || (loading ? "Lía está escribiendo…" : "")}
            </div>
          </div>
        ))}

        {msgs.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                onClick={() => enviar(s)}
                className="px-3 py-1.5 rounded-full bg-white border border-navy/12 text-navy/70 text-[12px] hover:border-coral hover:text-coral transition-colors active:scale-[0.97]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-navy/8 flex items-center gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") enviar(input);
          }}
          disabled={loading}
          placeholder="Escribe tu duda sobre el panel…"
          className="flex-1 px-3.5 py-2.5 rounded-full bg-ivory border border-navy/10 text-[13px] outline-none focus:border-coral disabled:opacity-60"
        />
        <button
          onClick={() => enviar(input)}
          disabled={loading || !input.trim()}
          aria-label="Enviar"
          className="w-9 h-9 rounded-full bg-gradient-to-r from-coral to-amber text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
        >
          <Icon.Arrow className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
