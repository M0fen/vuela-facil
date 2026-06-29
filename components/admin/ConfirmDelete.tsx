"use client";

/**
 * Botón de envío que pide confirmación antes de ejecutar la acción (borrar).
 * Va dentro de un <form action={deleteAction}>. Si el operador cancela, se
 * detiene el envío.
 */
export function ConfirmDelete({
  children,
  className,
  title,
  message = "¿Seguro que deseas borrar esto? Esta acción no se puede deshacer.",
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  message?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      title={title}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
