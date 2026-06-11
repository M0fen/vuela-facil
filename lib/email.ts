import "server-only";

// ---------------------------------------------------------------------------
// Notificaciones por correo — "listo para credenciales" (Fase 2).
// Usa la API REST de Resend vía fetch (sin dependencias nuevas). Si faltan
// RESEND_API_KEY o NOTIFY_EMAIL, todo es un no-op silencioso: el sitio funciona
// igual sin correo (modelo WhatsApp-first). Nunca lanza: notificar nunca debe
// tumbar la captura de un lead o una reserva.
// ---------------------------------------------------------------------------

/** ¿Están configuradas las credenciales de correo? */
export function emailActivo(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL);
}

/** Remitente. Configurable por env; por defecto, dominio onboarding de Resend. */
function from(): string {
  return process.env.NOTIFY_FROM || "Vuela Fácil <onboarding@resend.dev>";
}

async function enviar(asunto: string, html: string): Promise<void> {
  if (!emailActivo()) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from(),
        to: [process.env.NOTIFY_EMAIL],
        subject: asunto,
        html,
      }),
    });
  } catch {
    // Silencioso a propósito: una falla de correo no debe afectar al usuario.
  }
}

const fila = (k: string, v: string) =>
  `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font:13px sans-serif">${k}</td><td style="padding:4px 0;color:#0d2c54;font:600 13px sans-serif">${v}</td></tr>`;

/** Aviso al asesor de un nuevo lead capturado. */
export async function notificarNuevoLead(lead: {
  email: string;
  telefono?: string;
  origen: string;
}): Promise<void> {
  const html = `
    <div style="max-width:480px">
      <h2 style="font:600 18px sans-serif;color:#0d2c54">Nuevo contacto 🎉</h2>
      <table style="border-collapse:collapse">
        ${fila("Email", lead.email)}
        ${fila("WhatsApp", lead.telefono || "—")}
        ${fila("Origen", lead.origen)}
      </table>
      <p style="font:13px sans-serif;color:#64748b">Atiéndelo desde el panel → /admin/leads</p>
    </div>`;
  await enviar(`Nuevo lead: ${lead.email}`, html);
}

/** Aviso al asesor de una nueva reserva/solicitud. */
export async function notificarNuevaReserva(reserva: {
  destino: string;
  nombre: string;
  telefono: string;
  viajeros: number;
  fecha: string;
  totalEstimado: number;
}): Promise<void> {
  const total = reserva.totalEstimado.toLocaleString("es-CO");
  const html = `
    <div style="max-width:480px">
      <h2 style="font:600 18px sans-serif;color:#0d2c54">Nueva reserva ✈️</h2>
      <table style="border-collapse:collapse">
        ${fila("Destino", reserva.destino)}
        ${fila("Cliente", reserva.nombre)}
        ${fila("WhatsApp", reserva.telefono)}
        ${fila("Viajeros", String(reserva.viajeros))}
        ${fila("Salida", reserva.fecha)}
        ${fila("Total estimado", `$${total} COP`)}
      </table>
      <p style="font:13px sans-serif;color:#64748b">Gestiónala desde el panel → /admin/reservas</p>
    </div>`;
  await enviar(`Nueva reserva: ${reserva.destino} (${reserva.nombre})`, html);
}
