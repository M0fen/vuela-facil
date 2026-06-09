"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { waLink } from "@/lib/utils";

interface Msg {
  role: "assistant" | "user";
  text: string;
}

const SALUDO: Msg = {
  role: "assistant",
  text: "¡Hola! Soy Lía, tu asistente de viajes de Vuela Fácil ✈️ Cuéntame: ¿a dónde sueñas con ir, con qué presupuesto o en qué fechas? Te ayudo a encontrar el plan ideal.",
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([SALUDO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  // Resumen de la conversación para el handoff a un asesor humano por WhatsApp.
  const handoffMsg = () => {
    const intereses = msgs
      .filter((m) => m.role === "user")
      .map((m) => `• ${m.text}`)
      .join("\n");
    return `Hola Vuela Fácil 👋 Vengo del chat con Lía y quiero hablar con un asesor.${
      intereses ? `\n\nEsto fue lo que le conté:\n${intereses}` : ""
    }\n\n¿Me ayudan a cotizar?`;
  };

  const send = async () => {
    const texto = input.trim();
    if (!texto || loading) return;

    const userMsg: Msg = { role: "user", text: texto };
    const historia = [...msgs, userMsg];
    // Pintamos el mensaje del usuario + un placeholder del asistente que se irá
    // llenando con el stream.
    setMsgs([...historia, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historia.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("bad response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((m) => {
          const copia = [...m];
          copia[copia.length - 1] = { role: "assistant", text: acc };
          return copia;
        });
      }
      // Si el stream vino vacío, dejamos un fallback útil.
      if (!acc.trim()) {
        setMsgs((m) => {
          const copia = [...m];
          copia[copia.length - 1] = {
            role: "assistant",
            text: "Mejor te conecto con un asesor humano por WhatsApp para no hacerte esperar 🙌",
          };
          return copia;
        });
      }
    } catch {
      setMsgs((m) => {
        const copia = [...m];
        copia[copia.length - 1] = {
          role: "assistant",
          text: "Uy, tuve un problema para responder 😅. Escríbenos por WhatsApp y un asesor te atiende enseguida.",
        };
        return copia;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 left-5 md:bottom-6 md:left-6 z-50">
      {open && (
        <div className="absolute bottom-16 left-0 w-[320px] sm:w-[360px] bg-white rounded-3xl shadow-[0_30px_80px_-10px_rgba(13,44,84,0.4)] border border-navy/8 overflow-hidden">
          <div className="bg-gradient-to-r from-navy to-[#163b6e] text-white p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center font-serif text-[18px]">
                L
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-navy" />
            </div>
            <div className="flex-1 leading-tight">
              <div className="font-semibold text-[14px]">Lía · Asistente IA</div>
              <div className="text-[11px] text-white/70">Asistente de viajes 24/7 · En línea</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-white/70 hover:text-white">
              <Icon.Close className="w-5 h-5" />
            </button>
          </div>
          <div ref={scrollRef} className="p-4 h-[280px] overflow-y-auto space-y-3 bg-ivory">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-navy text-white rounded-br-sm"
                      : "bg-white text-navy border border-navy/8 rounded-bl-sm"
                  }`}
                >
                  {m.text || (loading ? "Lía está escribiendo…" : "")}
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 pt-2 bg-white">
            <a
              href={waLink(handoffMsg())}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-full bg-[#25D366]/10 text-[#127a3e] text-[12px] font-semibold hover:bg-[#25D366]/20 transition-colors"
            >
              <Icon.Whatsapp className="w-3.5 h-3.5" />
              Hablar con un asesor por WhatsApp
            </a>
          </div>
          <div className="p-3 border-t border-navy/8 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              disabled={loading}
              placeholder="Escribe tu destino soñado…"
              className="flex-1 px-3 py-2.5 rounded-full bg-ivory border border-navy/10 text-[13px] outline-none focus:border-coral disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="w-9 h-9 rounded-full bg-gradient-to-r from-coral to-amber text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon.Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-white border border-navy/10 shadow-[0_15px_30px_-5px_rgba(13,44,84,0.25)] hover:shadow-[0_20px_40px_-5px_rgba(13,44,84,0.35)] transition-shadow"
      >
        <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-navy to-[#163b6e] flex items-center justify-center text-white font-serif">
          L
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-white" />
        </span>
        <span className="hidden sm:block text-left leading-tight">
          <span className="block text-[12px] font-semibold text-navy">Asistente de viajes 24/7</span>
          <span className="block text-[10px] text-navy/55">Pregúntame lo que quieras</span>
        </span>
      </button>
    </div>
  );
}
