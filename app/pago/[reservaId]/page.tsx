import Link from "next/link";
import { getReserva } from "@/lib/store";
import { formatCOP, waLink } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function PagoRetornoPage({
  params,
}: {
  params: Promise<{ reservaId: string }>;
}) {
  const { reservaId } = await params;
  const reserva = await getReserva(reservaId);

  const estado = reserva?.estado ?? "pendiente";
  const aprobado = estado === "confirmada";
  const cancelado = estado === "cancelada";

  const titulo = aprobado
    ? "¡Pago confirmado!"
    : cancelado
      ? "El pago no se completó"
      : "Estamos confirmando tu pago";
  const detalle = aprobado
    ? "Recibimos tu abono. Un asesor te contactará por WhatsApp para afinar los detalles de tu viaje."
    : cancelado
      ? "No pudimos procesar el pago. Puedes intentarlo de nuevo o escribirnos por WhatsApp."
      : "Tu pago se está procesando. En cuanto se confirme, te avisamos. Esto puede tardar unos minutos.";

  return (
    <div className="bg-ivory min-h-screen flex flex-col">
      <Header solido />
      <main className="pt-[72px] flex-1 flex items-center">
        <div className="max-w-[560px] mx-auto px-5 py-16 w-full text-center">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              aprobado ? "bg-emerald/10 text-emerald" : cancelado ? "bg-coral/10 text-coral" : "bg-amber/15 text-[#b8730a]"
            }`}
          >
            {aprobado ? <Icon.Check className="w-8 h-8" /> : <Icon.Clock className="w-8 h-8" />}
          </div>
          <h1 className="font-serif text-navy text-[30px] md:text-[36px] leading-tight mt-5">{titulo}</h1>
          <p className="text-navy/65 mt-3 leading-relaxed">{detalle}</p>

          {reserva && (
            <div className="mt-6 rounded-2xl bg-white border border-navy/8 p-5 text-left text-[14px]">
              <div className="flex justify-between py-1.5">
                <span className="text-navy/55">Destino</span>
                <span className="font-medium text-navy">{reserva.destino}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-navy/55">Viajeros</span>
                <span className="font-medium text-navy">{reserva.viajeros}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-navy/55">Total estimado</span>
                <span className="font-medium text-navy">{formatCOP(reserva.totalEstimado)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-navy/55">Referencia</span>
                <span className="font-mono text-[12px] text-navy/70">{reserva.id}</span>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink(
                `Hola Vuela Fácil, sobre mi pago/reserva ${reservaId}${reserva ? ` (${reserva.destino})` : ""}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-wa="pago-retorno"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
            >
              <Icon.Whatsapp className="w-5 h-5" /> Escribir a un asesor
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-navy/15 text-navy font-semibold hover:border-navy transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
