import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui";
import { logout } from "../auth-actions";

export const metadata: Metadata = {
  title: "Panel · Vuela Fácil",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/paquetes", label: "Paquetes" },
  { href: "/admin/promo", label: "Promo" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/leads", label: "Leads" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-navy text-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-serif text-[18px]">
              Vuela <span className="text-amber italic">Fácil</span>
              <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
                Panel
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-[12px] text-white/70 hover:text-white">
              Ver sitio ↗
            </Link>
            <form action={logout}>
              <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                Salir
              </button>
            </form>
          </div>
        </div>
        <nav className="border-t border-white/10">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8 flex gap-1 overflow-x-auto no-scrollbar">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-3 text-[13px] font-medium text-white/75 hover:text-white whitespace-nowrap"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="max-w-[1100px] mx-auto px-5 md:px-8 py-8">{children}</main>
    </div>
  );
}
