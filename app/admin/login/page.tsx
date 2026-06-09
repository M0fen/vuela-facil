import type { Metadata } from "next";
import { Logo } from "@/components/ui";
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
    <div className="min-h-screen bg-ivory flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size={56} />
        </div>
        <div className="bg-white rounded-3xl border border-navy/10 shadow-[0_30px_60px_-30px_rgba(13,44,84,0.3)] p-7">
          <h1 className="font-serif text-navy text-[24px] mb-1">Panel de administración</h1>
          <p className="text-navy/55 text-[13px] mb-6">Ingresa para gestionar el contenido del sitio.</p>
          <LoginForm from={from ?? "/admin"} />
        </div>
        <p className="text-center text-navy/40 text-[12px] mt-6">Vuela Fácil Travel · Pereira</p>
      </div>
    </div>
  );
}
