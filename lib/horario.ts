// Horario de atención del negocio, en hora local de Colombia (America/Bogota).
// Coincide con NEGOCIO.horario: Lunes a sábado, 8:00 a.m. – 8:00 p.m.
// Se usa para mostrar el estado "En línea" / "Fuera de horario" en el CTA de
// WhatsApp y adaptar el mensaje prellenado. Calcula la hora de Bogotá con Intl,
// así funciona sin importar la zona horaria del visitante.

const HORA_APERTURA = 8;
const HORA_CIERRE = 20; // 8:00 p.m.

export function estaAbierto(now: Date = new Date()): boolean {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const map = Object.fromEntries(partes.map((p) => [p.type, p.value]));
  const esDomingo = map.weekday === "Sun";
  let hora = parseInt(map.hour ?? "0", 10);
  if (hora === 24) hora = 0; // medianoche puede venir como "24"

  return !esDomingo && hora >= HORA_APERTURA && hora < HORA_CIERRE;
}
