"use client";

import { Component, type ReactNode } from "react";

/**
 * Red de seguridad del globo 3D. Si react-globe.gl/three fallan en el navegador
 * del usuario (WebGL, driver, etc.), capturamos el error para que NO rompa la
 * página: avisamos al padre (onError) y dejamos a la vista el mapa 2D, que
 * siempre funciona. Tiene que ser un componente de clase: es la única forma de
 * capturar errores de render en React.
 */
export class GloboBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { fallo: boolean }
> {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.fallo) return null;
    return this.props.children;
  }
}
