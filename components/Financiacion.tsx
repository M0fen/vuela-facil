import { FINANCIACION } from "@/lib/data";
import { Icon } from "./icons";

/**
 * Perks de financiación en una línea (chips). Reutilizable en el modal de
 * paquete, la ficha de destino y la home. Es solo mensajería comercial.
 */
export function FinanciacionPerks({ className = "" }: { className?: string }) {
  const perks = [
    `Hasta ${FINANCIACION.cuotas} cuotas sin interés`,
    `Separa con el ${FINANCIACION.abonoPct}%`,
    `Paga después con ${FINANCIACION.bnpl.join(" / ")}`,
  ];
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {perks.map((p) => (
        <span
          key={p}
          className="inline-flex items-center gap-1 rounded-full bg-emerald/10 text-emerald text-[11px] font-semibold px-2.5 py-1"
        >
          <Icon.Check className="w-3 h-3" />
          {p}
        </span>
      ))}
    </div>
  );
}
