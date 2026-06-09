import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso · Panel Vuela Fácil",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 bg-gradient-to-br from-navy via-[#123257] to-navy overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(244,169,60,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(232,99,26,0.20), transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-7">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-amber flex items-center justify-center font-serif text-[26px] text-white shadow-[0_15px_30px_-10px_rgba(232,99,26,0.7)]">
            V
          </span>
          <div className="mt-3 font-serif text-white text-[20px]">
            Vuela <span className="text-amber italic">Fácil</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">Panel de control</div>
        </div>
        <div className="bg-white rounded-3xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] p-7">
          <h1 className="font-serif text-navy text-[22px] mb-1">Bienvenido de vuelta</h1>
          <p className="text-navy/55 text-[13px] mb-6">Ingresa para gestionar el contenido del sitio.</p>
          <LoginForm from={from ?? "/admin"} />
        </div>
        <p className="text-center text-white/40 text-[12px] mt-6">Vuela Fácil Travel · Pereira</p>
      </div>
    </div>
  );
}
