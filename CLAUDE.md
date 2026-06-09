# CLAUDE.md — Vuela Fácil Travel

Contexto para Claude Code al trabajar en este repo.

## Qué es

Sitio de una agencia de viajes en Pereira (Colombia). Es la migración a Next.js de un
prototipo HTML/React single-file. Modelo de negocio: **WhatsApp-first** (todas las CTAs
abren `wa.me` con un mensaje prellenado).

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript estricto
- Tailwind CSS v4 (config por CSS en `app/globals.css` con `@theme`, sin `tailwind.config`)
- `next/font` (Fraunces display + Inter body) · `next/image`
- Estado de UI por React Context (`lib/ui-context.tsx`), no Redux/Zustand

## Convenciones

- **Datos** centralizados en `lib/data.ts` (tipados en `lib/types.ts`). No hardcodear
  paquetes/precios en componentes.
- **Colores** solo vía tokens de marca: `navy`, `coral`, `amber`, `emerald`, `ivory`,
  `sky` (definidos en `@theme`). Evitar hexadecimales sueltos salvo el verde de WhatsApp
  `#25D366`.
- **Tipografías**: `font-serif` (Fraunces) para títulos, `font-sans` (Inter) para texto.
- Componentes interactivos llevan `"use client"`. Los puramente presentacionales
  (`Footer`, `FloatingWA`, `ui.tsx`) son server components.
- Moneda siempre con `formatCOP()`; enlaces de WhatsApp con `waLink()`.
- Número de WhatsApp: `NEXT_PUBLIC_WHATSAPP_NUMERO` en `.env.local`.

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # build de producción (valida tipos)
npm run lint
```

## Tareas frecuentes / dónde tocar

- Agregar/editar un paquete → `lib/data.ts` (`PAQUETES`). Aparece solo en grid + modal.
- Cambiar una imagen → `public/images/` + ruta en `lib/data.ts`.
- Persistir el formulario de leads → `components/CapturaContacto.tsx` (hoy solo confirma
  en cliente; convertir a Server Action).
- Asistente "Lía" real → `components/AIAssistant.tsx` + nuevo `app/api/chat/route.ts`.

## Pendientes conocidos

- Imágenes hero/varios paquetes son placeholders de Unsplash (ver `lib/data.ts`).
- Formulario de contacto y asistente IA son simulados (no persisten ni llaman a un modelo).
- Faltan `sitemap.ts`, `robots.ts` y JSON-LD para SEO.
