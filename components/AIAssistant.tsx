"use client";

import { useState } from "react";
import { Icon } from "./icons";

interface Msg {
  role: "ai" | "user";
  text: string;
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "¡Hola! Soy Lía, tu asistente de viajes 24/7 ✈️ ¿A dónde quieres ir?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    // Respuesta simulada. Para un asistente real, conecta esto a un route
    // handler (/api/chat) que llame a un modelo y, si hace falta, derive a
    // WhatsApp con un asesor humano.
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: `¡Excelente elección! Déjame conectarte con un asesor humano por WhatsApp para personalizar tu viaje a ${userMsg
            .split(" ")
            .slice(0, 3)
            .join(" ")}…`,
        },
      ]);
    }, 900);
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
          <div className="p-4 h-[280px] overflow-y-auto space-y-3 bg-ivory">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug ${
                    m.role === "user"
                      ? "bg-navy text-white rounded-br-sm"
                      : "bg-white text-navy border border-navy/8 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-navy/8 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Escribe tu destino soñado…"
              className="flex-1 px-3 py-2.5 rounded-full bg-ivory border border-navy/10 text-[13px] outline-none focus:border-coral"
            />
            <button
              onClick={send}
              aria-label="Enviar"
              className="w-9 h-9 rounded-full bg-gradient-to-r from-coral to-amber text-white flex items-center justify-center"
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
