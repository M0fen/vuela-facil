import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "./AdminNav";
import { logout } from "../auth-actions";

export const metadata: Metadata = {
  title: "Panel · Vuela Fácil",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Fondo sutil de marca */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% -5%, rgba(244,169,60,0.10), transparent 40%), radial-gradient(circle at 100% 0%, rgba(232,99,26,0.08), transparent 35%)",
        }}
      />
      <header className="relative bg-gradient-to-r from-navy via-[#123257] to-navy text-white shadow-[0_10px_30px_-20px_rgba(13,44,84,0.8)]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral to-amber flex items-center justify-center font-serif text-[18px] shadow-[0_8px_20px_-8px_rgba(232,99,26,0.7)]">
              V
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-[17px]">
                Vuela <span className="text-amber italic">Fácil</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-white/45">
                Panel de control
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-[12px] text-white/70 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              Ver sitio ↗
            </Link>
            <form action={logout}>
              <button className="text-[12px] font-medium px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                Salir
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="relative max-w-[1100px] mx-auto px-4 md:px-8 py-8 md:py-10">{children}</main>
    </div>
  );
}
