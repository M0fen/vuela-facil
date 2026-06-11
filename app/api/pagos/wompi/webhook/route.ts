import { NextResponse } from "next/server";
import { validarEventoWompi, type WompiEvento } from "@/lib/pagos";
import { updateReserva } from "@/lib/store";
import type { EstadoReserva } from "@/lib/types";

// Webhook de eventos de Wompi. Configura esta URL en el panel de Wompi:
//   https://TU-DOMINIO/api/pagos/wompi/webhook
// Sin WOMPI_EVENTS_SECRET, valida en falso y responde 202 (no procesa).

export async function POST(req: Request) {
  let evento: WompiEvento;
  try {
    evento = (await req.json()) as WompiEvento;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!validarEventoWompi(evento)) {
    return NextResponse.json({ ok: false, motivo: "firma inválida o sin secreto" }, { status: 202 });
  }

  const tx = evento.data?.transaction;
  if (tx?.reference && tx.status) {
    let estado: EstadoReserva | undefined;
    if (tx.status === "APPROVED") estado = "confirmada";
    else if (["DECLINED", "ERROR", "VOIDED"].includes(tx.status)) estado = "cancelada";
    if (estado) {
      try {
        await updateReserva(tx.reference, { estado });
      } catch {
        // no rompemos la respuesta al webhook si falla la persistencia
      }
    }
  }

  return NextResponse.json({ ok: true });
}
