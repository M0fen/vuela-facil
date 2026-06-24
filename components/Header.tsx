"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { Logo } from "./ui";
import { waLink } from "@/lib/utils";

const LINKS: { label: string; href: string }[] = [
  { label: "Destinos", href: "/#explora" },
  { label: "Paquetes", href: "/#paquetes" },
  { label: "Alojamientos", href: "/alojamientos" },
  { label: "Financiación", href: "/financiacion" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/pqrs" },
];

export function Header({ solido = false }: { solido?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const opaco = solido || scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        opaco
          ? "bg-white/85 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_30px_rgba(13,44,84,0.06)]"
          : "bg-gradient-to-b from-black/30 to-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <a href="/" aria-label="Vuela Fácil — inicio">
          <Logo light={!opaco} />
        </a>
        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-[14px] font-medium tracking-wide transition-colors ${
                opaco ? "text-navy/80 hover:text-coral" : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={waLink("Hola Vuela Fácil, quiero información de viajes ✈️")}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1ebe57] transition-colors shadow-[0_8px_24px_-8px_rgba(37,211,102,0.55)]"
          >
            <Icon.Whatsapp className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
            className={`lg:hidden p-2 rounded-md ${opaco ? "text-navy" : "text-white"}`}
          >
            <Icon.Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-black/5 px-6 py-4 space-y-3 shadow-lg">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-navy/80 font-medium py-1"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
