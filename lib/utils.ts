// Número de WhatsApp del negocio. Configúralo en .env.local
// (NEXT_PUBLIC_WHATSAPP_NUMERO). Por defecto, el número real de Vuela Fácil.
export const WHATSAPP_NUMERO =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "573114494224";

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatCOP = (n: number): string => copFormatter.format(n);

const milesFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * Formatea un precio en la moneda dada (COP por defecto).
 * USD → "US$ 1,500" · EUR → "€ 1,500" · COP → "$ 1.500" (formato colombiano).
 */
export const formatMoneda = (n: number, moneda: "COP" | "USD" | "EUR" = "COP"): string => {
  if (moneda === "USD") return `US$ ${milesFormatter.format(n)}`;
  if (moneda === "EUR") return `€ ${milesFormatter.format(n)}`;
  return formatCOP(n);
};

export const waLink = (msg: string): string =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;

/**
 * Porcentaje de ahorro si hay un precio anterior válido (mayor al actual).
 * Devuelve null si no aplica, para no mostrar descuentos falsos.
 */
export const descuentoPct = (precio: number, precioAntes?: number): number | null => {
  if (!precioAntes || precioAntes <= precio) return null;
  return Math.round((1 - precio / precioAntes) * 100);
};
