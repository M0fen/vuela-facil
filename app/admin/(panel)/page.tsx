import Link from "next/link";
import { Icon } from "@/components/icons";
import { readPaquetes, readTestimonios, listLeads, listReservas, readPromo } from "@/lib/store";
import { PageHeader, btnPrimary, btnGhost } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [paquetes, testimonios, leads, reservas, promo] = await Promise.all([
    readPaquetes(),
    readTestimonios(),
    listLeads(),
    listReservas(),
    readPromo(),
  ]);

  const pendientes = reservas.filter((r) => r.estado === "pendiente").length;

  const cards = [
    { href: "/admin/paquetes", label: "Paquetes", value: paquetes.length, hint: "Destinos y precios", icon: Icon.Plane },
    {
      href: "/admin/reservas",
      label: "Reservas",
      value: reservas.length,
      hint: pendientes > 0 ? `${pendientes} pendientes` : "Al día",
      icon: Icon.Calendar,
    },
    { href: "/admin/leads", label: "Leads", value: leads.length, hint: "Contactos capturados", icon: Icon.Users },
    { href: "/admin/testimonios", label: "Testimonios", value: testimonios.length, hint: "Reseñas del sitio", icon: Icon.Star },
  ];

  return (
    <div>
      <PageHeader
        title="Hola 👋"
        subtitle="Administra el contenido del sitio. Los cambios se publican al guardar."
      />

      <Link
        href="/admin/ayuda"
        className="group mb-5 flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-navy to-[#163b6e] text-white shadow-[0_18px_40px_-24px_rgba(13,44,84,0.8)] hover:-translate-y-0.5 transition-all"
      >
        <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Icon.Help className="w-6 h-6" />
        </span>
        <span className="flex-1 leading-tight">
          <span className="block font-serif text-[18px]">¿Primera vez? Lee el tutorial</span>
          <span className="block text-white/70 text-[13px] mt-0.5">
            Paso a paso para manejar paquetes, fotos, ofertas, blog y tus clientes. Sin tecnicismos.
          </span>
        </span>
        <Icon.Arrow className="w-5 h-5 text-white/60 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </Link>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ href, label, value, hint, icon: I }) => (
          <Link
            key={href}
            href={href}
            className="group p-5 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] hover:border-coral/30 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral/15 to-amber/10 text-coral flex items-center justify-center">
                <I className="w-5 h-5" />
              </span>
              <Icon.Arrow className="w-4 h-4 text-navy/25 group-hover:text-coral group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-serif text-navy text-[34px] leading-none mt-4">{value}</div>
            <div className="text-navy font-semibold text-[14px] mt-1.5">{label}</div>
            <div className="text-navy/50 text-[12px] mt-0.5">{hint}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 p-5 md:p-6 rounded-2xl bg-white border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)]">
        <h2 className="font-serif text-navy text-[18px] mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/paquetes/nuevo" className={btnPrimary}>
            <Icon.Plane className="w-4 h-4" /> Nuevo paquete
          </Link>
          <Link href="/admin/testimonios" className={btnGhost}>
            <Icon.Star className="w-4 h-4" /> Agregar testimonio
          </Link>
          <Link href="/admin/promo" className={btnGhost}>
            <Icon.Sparkle className="w-4 h-4" /> Editar promoción
          </Link>
          <Link href="/admin/leads" className={btnGhost}>
            <Icon.Users className="w-4 h-4" /> Ver leads
          </Link>
          <Link href="/admin/ayuda" className={btnGhost}>
            <Icon.Help className="w-4 h-4" /> Ver tutorial
          </Link>
        </div>
      </div>
    </div>
  );
}
