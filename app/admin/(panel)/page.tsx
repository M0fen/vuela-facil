import Link from "next/link";
import { readPaquetes, readTestimonios, listLeads, readPromo } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [paquetes, testimonios, leads, promo] = await Promise.all([
    readPaquetes(),
    readTestimonios(),
    listLeads(),
    readPromo(),
  ]);

  const cards = [
    { href: "/admin/paquetes", label: "Paquetes", value: paquetes.length, hint: "Gestiona destinos y precios" },
    { href: "/admin/testimonios", label: "Testimonios", value: testimonios.length, hint: "Reseñas del sitio" },
    { href: "/admin/leads", label: "Leads", value: leads.length, hint: "Contactos capturados" },
    {
      href: "/admin/promo",
      label: "Promo",
      value: promo.activa ? "Activa" : "Inactiva",
      hint: "Banner de oferta",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-navy text-[28px] mb-1">Hola 👋</h1>
      <p className="text-navy/55 text-[14px] mb-7">
        Administra el contenido del sitio. Los cambios se publican al guardar.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="p-5 rounded-2xl bg-white border border-navy/10 hover:border-coral/40 hover:shadow-sm transition-all"
          >
            <div className="font-serif text-navy text-[32px] leading-none">{c.value}</div>
            <div className="text-navy font-semibold text-[14px] mt-2">{c.label}</div>
            <div className="text-navy/50 text-[12px] mt-0.5">{c.hint}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
