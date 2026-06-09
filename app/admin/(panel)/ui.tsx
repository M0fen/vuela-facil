import type { ComponentType, ReactNode, SVGProps } from "react";

const labelCls = "block text-[12px] font-semibold text-navy/55 mb-1.5";
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-navy/12 bg-white text-navy text-[14px] outline-none transition-all focus:border-coral focus:ring-2 focus:ring-coral/15 placeholder:text-navy/30";

// --- Botones (clases reutilizables) ---------------------------------------

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e8631a] to-[#f4a93c] text-white text-[13px] font-semibold shadow-[0_10px_24px_-10px_rgba(232,99,26,0.6)] hover:shadow-[0_14px_28px_-10px_rgba(232,99,26,0.7)] transition-all disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-navy/15 text-navy/75 text-[13px] font-semibold hover:border-navy hover:text-navy transition-colors";
export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-coral/25 text-coral text-[12px] font-semibold hover:bg-coral hover:text-white transition-colors";

// --- Encabezado de página --------------------------------------------------

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
      <div>
        <h1 className="font-serif text-navy text-[28px] md:text-[32px] leading-tight tracking-[-0.01em]">
          {title}
        </h1>
        {subtitle && <p className="text-navy/55 text-[14px] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// --- Tarjeta con título e ícono opcional -----------------------------------

export function Card({
  children,
  title,
  icon: Ico,
}: {
  children: ReactNode;
  title?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="bg-white rounded-2xl border border-navy/8 shadow-[0_1px_0_rgba(13,44,84,0.04),0_12px_30px_-24px_rgba(13,44,84,0.25)] p-5 md:p-6">
      {title && (
        <div className="flex items-center gap-2.5 mb-4">
          {Ico && (
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-coral/15 to-amber/10 text-coral flex items-center justify-center">
              <Ico className="w-4 h-4" />
            </span>
          )}
          <h2 className="font-serif text-navy text-[18px]">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

// --- Campos ----------------------------------------------------------------

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputCls}
        step={type === "number" ? "any" : undefined}
      />
      {hint && <span className="block text-[11px] text-navy/45 mt-1">{hint}</span>}
    </label>
  );
}

export function Area({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={rows} className={`${inputCls} resize-y`} />
      {hint && <span className="block text-[11px] text-navy/45 mt-1">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <select name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
