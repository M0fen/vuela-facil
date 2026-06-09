# Vuela Fácil Travel — Next.js

Migración del prototipo `Vuela_Facil_Travel_-_Standalone.html` (React + Babel-in-browser + Tailwind por CDN) a un proyecto **Next.js 15 (App Router) + TypeScript + Tailwind v4** listo para producción y para iterar en Claude Code.

El diseño se conservó **1:1**: misma paleta (navy / coral / amber / ivory), mismas tipografías (Fraunces display + Inter body), mismos componentes y copy.

---

## Arranque rápido

```bash
npm install
cp .env.example .env.local   # pon tu número real de WhatsApp
npm run dev                  # http://localhost:3000
```

Build de producción:

```bash
npm run build && npm start
```

> El número de WhatsApp se configura en `.env.local` con `NEXT_PUBLIC_WHATSAPP_NUMERO` (formato internacional, sin `+` ni espacios, ej. `573001234567`).

---

## Estructura

```
app/
  layout.tsx        # next/font (Fraunces + Inter), metadata, UIProvider
  page.tsx          # composición de todas las secciones
  globals.css       # Tailwind v4 + @theme (tokens de marca) + estilos propios
components/
  icons.tsx         # set de íconos SVG
  ui.tsx            # Logo + SectionEyebrow
  Header / Hero / Categorias / Paquetes / OfferBanner /
  Confianza / Testimonios / StoryEjeCafetero / CapturaContacto /
  Footer / FloatingWA / AIAssistant / PackageModal
lib/
  data.ts           # FUENTE ÚNICA: paquetes, categorías, testimonios, imágenes
  types.ts          # tipos del dominio (Paquete, Categoria, Testimonio…)
  utils.ts          # formatCOP, waLink, número de WhatsApp
  ui-context.tsx    # estado de UI (filtro + modal de paquete + scroll)
hooks/
  useReveal.ts      # fade-in al hacer scroll (IntersectionObserver)
public/
  images/           # imágenes que venían empaquetadas en el prototipo
  logo.svg          # marca (círculo coral/amber + avión)
```

## Qué cambió respecto al HTML original (mismas pantallas, mejor base)

- **Bus de eventos global → React Context.** El prototipo usaba `window.dispatchEvent`
  (`vf:open-package`, `vf:set-filter`). Ahora todo eso vive en `lib/ui-context.tsx`
  (`useUI()`): filtro de paquetes, apertura/cierre del modal y scroll suave.
- **`window.PACKAGES` / `window.IMG` → `lib/data.ts` tipado.** Una sola fuente de
  datos, lista para conectar a un CMS o base de datos sin tocar los componentes.
- **`<img>` → `next/image`** con `fill` + `sizes` para optimización automática.
- **Fuentes por CDN → `next/font`** (self-hosted, sin saltos de layout).
- **Babel en el navegador → compilación real** (TypeScript estricto, tree-shaking).

> Nota sobre imágenes: el proyecto incluye **las 19 imágenes originales** del
> prototipo en `public/images`. Reemplázalas por fotos propias cuando las tengas
> y actualiza las rutas en `lib/data.ts`.

---

## Stack recomendado para el sitio (agencia de viajes)

La base actual ya cubre el frontend. Para crecer hacia un sitio de agencia completo:

| Necesidad | Recomendación | Por qué |
|---|---|---|
| **Frontend** | Next.js 15 App Router + TS + Tailwind v4 *(ya hecho)* | SEO/SSR, imágenes optimizadas, Vercel-native |
| **Hosting** | Vercel | Deploy directo, edge, analytics |
| **Contenido (paquetes/destinos editables sin código)** | **Sanity** o **Payload CMS** — o **Supabase** si quieres también auth/DB | Que el operador edite paquetes sin tocar `data.ts` |
| **Captura de leads** (newsletter + formularios) | **Server Action** → Supabase / Resend / Google Sheets | Hoy el form solo confirma en el cliente; falta persistir |
| **Reservas / WhatsApp** | Mantener el flujo WhatsApp-first *(ya implementado)* + opcional WhatsApp Business API | Encaja con el mercado local; fricción mínima |
| **Asistente "Lía"** | Route handler `/api/chat` con un LLM + handoff a asesor | Hoy es simulado; ver `AIAssistant.tsx` |
| **Idiomas** | `next-intl` (ES base, EN opcional) | Turismo internacional |
| **Analítica** | Vercel Analytics o Plausible | Medir conversión a WhatsApp |
| **Formularios/validación** | `react-hook-form` + `zod` | Cuando los forms persistan datos |

## Roadmap sugerido

1. **Imágenes propias** → reemplazar placeholders de Unsplash en `lib/data.ts`.
2. **Leads reales** → Server Action en `CapturaContacto` que guarde email/teléfono.
3. **CMS** → mover `PAQUETES`/`CATEGORIAS`/`TESTIMONIOS` a Sanity/Supabase; los
   componentes ya consumen datos tipados, así que el cambio es localizado.
4. **Rutas de detalle** → opcional: `/paquetes/[id]` (SEO) además del modal.
5. **SEO** → `sitemap.ts`, `robots.ts`, JSON-LD de `TouristTrip` por paquete.
6. **Asistente real** → conectar `AIAssistant` a `/api/chat`.

---

Hecho a partir del prototipo. Listo para `git init`, subir a GitHub y desplegar en Vercel.
