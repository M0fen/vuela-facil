"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Categoria } from "./types";
import { recordVisto } from "./vistos";

export type Filtro = "Todos" | Categoria;

interface UIContextValue {
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  activePackageId: string | null;
  openPackage: (id: string) => void;
  closePackage: () => void;
  scrollTo: (selector: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

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
    () => ({ filtro, setFiltro, activePackageId, openPackage, closePackage, scrollTo }),
    [filtro, activePackageId, openPackage, closePackage, scrollTo],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}
