"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Inicio", icon: Icon.Compass },
  { href: "/admin/paquetes", label: "Paquetes", icon: Icon.Plane },
  { href: "/admin/reservas", label: "Reservas", icon: Icon.Calendar },
  { href: "/admin/promo", label: "Promo", icon: Icon.Sparkle },
  { href: "/admin/testimonios", label: "Testimonios", icon: Icon.Star },
  { href: "/admin/leads", label: "Leads", icon: Icon.Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-white/10">
      <div className="max-w-[1100px] mx-auto px-3 md:px-8 flex gap-1 overflow-x-auto no-scrollbar">
        {NAV.map(({ href, label, icon: I }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 px-3.5 py-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                active ? "text-white" : "text-white/55 hover:text-white/90"
              }`}
            >
              <I className="w-4 h-4" />
              {label}
              {active && (
                <span className="absolute left-3 right-3 -bottom-px h-[2.5px] rounded-full bg-gradient-to-r from-coral to-amber" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
