import type { ReactNode } from "react";

const labelCls = "block text-[12px] uppercase tracking-wider text-navy/60 font-semibold mb-1.5";
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-navy/15 outline-none focus:border-coral text-navy text-[14px] bg-white";

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
      <textarea name={name} defaultValue={defaultValue} rows={rows} className={inputCls} />
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

export function Card({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-navy/10 p-5">
      {title && <h2 className="font-serif text-navy text-[18px] mb-4">{title}</h2>}
      {children}
    </div>
  );
}
