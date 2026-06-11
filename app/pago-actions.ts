"use server";

import { FINANCIACION } from "@/lib/data";
import { addReserva } from "@/lib/store";
import { urlCheckoutWompi, siteUrl } from "@/lib/pagos";

export type AbonoResult = { ok: boolean; url?: string | null; reservaId?: string; error?: string };

/**
 * Inicia el "Separa tu viaje": registra la reserva (pendiente) y genera el
 * checkout de Wompi por el abono. Si no hay credenciales, `url` viene null y el
 * cliente cae a WhatsApp.
 */
export async function iniciarAbono(input: {
  paqueteId: string;
  destino: string;
  fecha: string;
  viajeros: number;
  totalEstimado: number;
  nombre: string;
  telefono: string;
  email?: string;
}): Promise<AbonoResult> {
  if (!input.nombre?.trim() || !input.telefono?.trim()) {
    return { ok: false, error: "Necesitamos tu nombre y WhatsApp." };
  }
  try {
    const reserva = await addReserva({
      ...input,
      mensaje: `Abono ${FINANCIACION.abonoPct}% (pago en línea)`,
    });
    const montoCents = Math.round((input.totalEstimado * FINANCIACION.abonoPct) / 100) * 100;
    const url = urlCheckoutWompi({
      referencia: reserva.id,
      montoCents,
      redirectUrl: siteUrl(`/pago/${reserva.id}`),
    });
    return { ok: true, reservaId: reserva.id, url };
  } catch {
    return { ok: false, error: "No se pudo iniciar el pago." };
  }
}
