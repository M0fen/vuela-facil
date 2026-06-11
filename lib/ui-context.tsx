"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { recordVisto } from "./vistos";
import { BUSQUEDA_INICIAL, type Busqueda, type Filtro } from "./buscador";

export type { Filtro, Busqueda } from "./buscador";

interface UIContextValue {
  /** Estado del buscador (Hero ↔ Paquetes). */
  busqueda: Busqueda;
  /** Mezcla un parche en la búsqueda actual. */
  setBusqueda: (patch: Partial<Busqueda>) => void;
  /** Vuelve la búsqueda a su estado inicial. */
  resetBusqueda: () => void;
  activePackageId: string | null;
  openPackage: (id: string) => void;
  closePackage: () => void;
  scrollTo: (selector: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [busqueda, setBusquedaState] = useState<Busqueda>(BUSQUEDA_INICIAL);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

  const setBusqueda = useCallback((patch: Partial<Busqueda>) => {
    setBusquedaState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetBusqueda = useCallback(() => setBusquedaState(BUSQUEDA_INICIAL), []);

  const openPackage = useCallback((id: string) => {
    recordVisto(id);
    setActivePackageId(id);
  }, []);

  const closePackage = useCallback(() => setActivePackageId(null), []);

  const scrollTo = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const value = useMemo(
    () => ({
      busqueda,
      setBusqueda,
      resetBusqueda,
      activePackageId,
      openPackage,
      closePackage,
      scrollTo,
    }),
    [busqueda, setBusqueda, resetBusqueda, activePackageId, openPackage, closePackage, scrollTo],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}
