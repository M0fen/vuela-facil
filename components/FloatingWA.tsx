import { Icon } from "./icons";
import { waLink } from "@/lib/utils";

export function FloatingWA() {
  return (
    <a
      href={waLink("Hola Vuela Fácil 👋 quiero hablar con un asesor.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar por WhatsApp"
      className="fixed bottom-24 right-5 md:bottom-6 md:right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      <span className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(37,211,102,0.6)] hover:scale-105 transition-transform">
        <Icon.Whatsapp className="w-7 h-7" />
      </span>
    </a>
  );
}
