import type { ReactNode } from "react";

/** Contenedor de texto legal/informativo con estilos de marca (sin plugin). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-[15px] text-navy/75 [&_h2]:font-serif [&_h2]:text-navy [&_h2]:text-[22px] [&_h2]:mt-9 [&_h2]:mb-2 [&_h2]:tracking-[-0.01em] [&_h3]:font-semibold [&_h3]:text-navy [&_h3]:text-[16px] [&_h3]:mt-6 [&_h3]:mb-1 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mt-3 [&_ol]:space-y-1.5 [&_a]:text-coral [&_a]:font-medium hover:[&_a]:underline [&_strong]:text-navy [&_strong]:font-semibold">
      {children}
    </div>
  );
}

/** Encabezado estándar de una página de información. */
export function InfoHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <header className="mb-8 md:mb-10">
      {eyebrow && (
        <div className="inline-flex items-center gap-3 text-coral text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
          <span className="w-8 h-px bg-coral" />
          {eyebrow}
        </div>
      )}
      <h1 className="font-serif text-navy text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
        {title}
      </h1>
      {intro && <p className="text-navy/60 mt-4 text-[16px] md:text-[17px] max-w-2xl leading-relaxed">{intro}</p>}
    </header>
  );
}
