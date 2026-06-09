"use client";

import Image from "next/image";
import { useState, type ComponentType, type SVGProps } from "react";
import { Icon } from "./icons";
import { IMG } from "@/lib/data";
import { useUI, type Filtro } from "@/lib/ui-context";

function SearchField({
  icon: I,
  label,
  value,
  className = "",
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <label
      className={`bg-white px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-amber/5 transition-colors ${className}`}
    >
      <I className="w-5 h-5 text-coral shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-navy/50 font-semibold">
          {label}
        </div>
        <div className="text-[14px] text-navy font-medium truncate">{value}</div>
      </div>
    </label>
  );
}

export function Hero() {
  const [tab, setTab] = useState("Vuelo + Hotel");
  const { setFiltro, scrollTo } = useUI();

  const handleSearch = () => {
    const map: Record<string, Filtro> = {
      "Vuelo + Hotel": "Todos",
      Paquetes: "Todos",
      Cruceros: "Cruceros",
      "Sólo hotel": "Todos",
    };
    setFiltro(map[tab] ?? "Todos");
    scrollTo("#paquetes");
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={IMG.hero}
          alt="Destino aspiracional"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/30 to-navy/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-8 pt-[140px] md:pt-[160px] pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-white/95 text-[12px] tracking-[0.18em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
            Pereira · Eje Cafetero · desde 2014
          </div>
          <h1 className="font-serif text-white text-[44px] leading-[1.02] md:text-[72px] md:leading-[1.02] tracking-[-0.02em]">
            El mundo es <em className="italic text-amber">más fácil</em>
            <br />
            cuando alguien <br className="hidden md:block" />
            lo planea por ti.
          </h1>
          <p className="mt-6 text-white/85 text-[16px] md:text-[18px] max-w-xl leading-relaxed">
            Diseñamos viajes a la medida por Colombia y el mundo. Tiquetes, hoteles, cruceros y
            experiencias — con asesoría humana en Pereira y reserva 100% por WhatsApp.
          </p>
        </div>

        {/* Buscador */}
        <div className="mt-12 md:mt-14">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[28px] shadow-[0_30px_80px_-20px_rgba(13,44,84,0.45)] border border-white/40 overflow-hidden">
            <div className="flex border-b border-navy/10 px-3 md:px-5 pt-3 gap-1 overflow-x-auto no-scrollbar">
              {["Vuelo + Hotel", "Paquetes", "Cruceros", "Sólo hotel"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-3 text-[13px] md:text-[14px] font-semibold whitespace-nowrap rounded-t-lg transition-colors relative ${
                    tab === t ? "text-navy" : "text-navy/50 hover:text-navy/80"
                  }`}
                >
                  {t}
                  {tab === t && (
                    <span className="absolute left-3 right-3 bottom-0 h-[3px] rounded-t-full bg-gradient-to-r from-coral to-amber" />
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-px bg-navy/5">
              <SearchField icon={Icon.Pin} label="Destino" value="Cartagena, Colombia" className="md:col-span-4" />
              <SearchField icon={Icon.Calendar} label="Salida" value="14 Jul 2026" className="md:col-span-2" />
              <SearchField icon={Icon.Calendar} label="Regreso" value="18 Jul 2026" className="md:col-span-2" />
              <SearchField icon={Icon.Users} label="Viajeros" value="2 adultos" className="md:col-span-2" />
              <SearchField icon={Icon.Wallet} label="Presupuesto" value="Hasta $3.000.000" className="md:col-span-2" />
            </div>
            <div className="bg-white p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 px-2 text-[12px] text-navy/60">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/5">
                  <Icon.Sparkle className="w-3.5 h-3.5 text-coral" /> Cuotas sin interés
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/5">
                  <Icon.Shield className="w-3.5 h-3.5 text-navy" /> RNT vigente
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/5">
                  <Icon.Clock className="w-3.5 h-3.5 text-navy" /> Respuesta &lt; 5 min
                </span>
              </div>
              <button
                onClick={handleSearch}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-[#e8631a] to-[#f4a93c] text-white text-[15px] font-semibold tracking-wide shadow-[0_14px_30px_-10px_rgba(232,99,26,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(232,99,26,0.7)] transition-all"
              >
                <Icon.Search className="w-5 h-5" />
                Buscar viaje
                <Icon.Arrow className="w-5 h-5 -mr-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-10 max-w-2xl text-white/90">
          {(
            [
              ["12 años", "diseñando viajes"],
              ["+18.500", "viajeros felices"],
              ["98%", "vuelven con nosotros"],
            ] as const
          ).map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-2xl md:text-4xl text-white">{n}</div>
              <div className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-white/60 mt-1">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-2">
        Descubre
        <span className="w-px h-10 bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}
