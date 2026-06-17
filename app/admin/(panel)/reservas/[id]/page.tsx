import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { getReserva } from "@/lib/store";
import { formatCOP } from "@/lib/utils";
import { updateReservaAction, deleteReservaAction } from "../../../actions";
import { Card, Area, EstadoBadge, EstadoSelect, ErrorBanner, btnPrimary, btnDanger } from "../../ui";

export const dynamic = "force-dynamic";

function fechaLarga(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });
  } catch {
    return iso;
  }
}

/** Enlace de WhatsApp hacia el número del cliente (normaliza a formato CO). */
function waCliente(telefono: string, destino: string, fecha: string): string {
  const digits = telefono.replace(/\D/g, "");
  const intl = digits.length === 10 && digits.startsWith("3") ? `57${digits}` : digits;
  const msg = `Hola 👋 te escribimos de Vuela Fácil sobre tu reserva a ${destino} (salida ${fecha}).`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(msg)}`;
}

export default async function ReservaDetalle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const r = await getReserva(id);
  if (!r) notFound();

  const dato = (label: string, value: string) => (
    <div className="flex justify-between gap-4 py-2 border-b border-navy/5 last:border-0">
      <span className="text-navy/55 text-[13px]">{label}</span>
      <span className="text-navy text-[13px] font-medium text-right">{value}</span>
    </div>
  );

  return (
    <div>
      <ErrorBanner show={!!error} />
      <div className="mb-6">
        <Link
          href="/admin/reservas"
          className="inline-flex items-center gap-1 text-navy/50 hover:text-coral text-[13px] mb-2"
        >
          <Icon.Arrow className="w-4 h-4 rotate-180" /> Reservas
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight">
            {r.destino}
          </h1>
          <EstadoBadge estado={r.estado} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Detalle de la solicitud" icon={Icon.Calendar}>
            {dato("Salida", r.fecha)}
            {dato("Viajeros", String(r.viajeros))}
            {dato("Total estimado", formatCOP(r.totalEstimado))}
            {dato("Paquete (ref)", r.paqueteId)}
            {dato("Solicitada", fechaLarga(r.createdAt))}
            {r.mensaje && dato("Mensaje del cliente", r.mensaje)}
          </Card>

          <Card title="Notas internas y estado" icon={Icon.Shield}>
            <form action={updateReservaAction} className="space-y-4">
              <input type="hidden" name="id" value={r.id} />
              <EstadoSelect defaultValue={r.estado} />
              <Area
                label="Notas del asesor (privadas)"
                name="notas"
                defaultValue={r.notas}
                rows={4}
                hint="Solo visibles en el panel; el cliente no las ve."
              />
              <button className={btnPrimary}>
                <Icon.Check className="w-4 h-4" /> Guardar
              </button>
            </form>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Contacto" icon={Icon.Users}>
            <div className="space-y-1">
              {dato("Nombre", r.nombre)}
              {dato("WhatsApp", r.telefono)}
              {r.email && dato("Email", r.email)}
            </div>
            <a
              href={waCliente(r.telefono, r.destino, r.fecha)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1ebe57] transition-colors"
            >
              <Icon.Whatsapp className="w-4 h-4" /> Escribir al cliente
            </a>
          </Card>

          <form action={deleteReservaAction}>
            <input type="hidden" name="id" value={r.id} />
            <button className={`${btnDanger} w-full justify-center py-2.5`}>
              Eliminar reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
