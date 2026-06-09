import Link from "next/link";
import { Icon } from "@/components/icons";
import { readPaquetes, readTestimonios, listLeads, readPromo } from "@/lib/store";
import { PageHeader, btnPrimary, btnGhost } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [paquetes, testimonios, leads, promo] = await Promise.all([
    readPaquetes(),
    readTestimonios(),
    listLeads(),
    readPromo(),
  ]);

  const cards = [
    { href: "/admin/paquetes", label: "Paquetes", value: paquetes.length, hint: "Destinos y precios", icon: Icon.Plane },
    { href: "/admin/testimonios", label: "Testimonios", value: testimonios.length, hint: "Reseñas del sitio", icon: Icon.Star },
    { href: "/admin/leads", label: "Leads", value: leads.length, hint: "Contactos capturados", icon: Icon.Users },
    {
      href: "/admin/promo",
      label: "Promo",
      value: promo.activa ? "On" : "Off",
      hint: promo.activa ? "Banner activo" : "Banner inactivo",
      icon: Icon.Sparkle,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Hola 👋"
        subtitle="Administra el contenido del sitio. Los cambios se publican al guardar."
      />

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
        </div>
      </div>
    </div>
  );
}
