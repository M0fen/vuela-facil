# MASTER PROMPT — Acabado profesional y comercial de Vuela Fácil

> Pégale esto a Claude Code **después** de la migración a Next.js. Es un plan por
> sprints para llevar el sitio al nivel de los líderes (Despegar, Aviatur,
> Booking, asistentes IA tipo Layla/Mindtrip), **adaptado a una agencia boutique
> WhatsApp-first en Pereira** (no somos una OTA con inventario en vivo).
>
> Reglas de oro:
> 1. **No rompas el diseño** actual (paleta navy/coral/amber/ivory, Fraunces+Inter). Eleva, no rediseñes.
> 2. **Mobile-first y rápido** (muchos clientes navegan en celular y con datos).
> 3. **Persuasión ética**: escasez y prueba social SOLO si son reales y verificables. Nada de "quedan 2" falso ni countdowns que se reinician.
> 4. Trabaja **sprint por sprint**, commit por feature, y **pregúntame antes** de cualquier integración con llaves/secretos (Supabase, Resend, API de IA, analytics) o acción irreversible.
> 5. Mantén todo en **español de Colombia**, precios en **COP**, y el flujo de cierre por **WhatsApp**.

---

## Principios rectores (de la investigación de competencia)

- **Confianza primero**: señales de confianza integradas en la página (RNT, asistencia, reseñas reales), no pegadas como adorno.
- **Precio transparente**: mostrar total con impuestos/condiciones; nada de sorpresas al final → reduce abandono.
- **Un solo camino obvio**: el siguiente paso (cotizar/reservar por WhatsApp) siempre visible y claro.
- **Contenido local auténtico = nuestro foso**: el Eje Cafetero y "joyas escondidas" que las OTAs grandes no cuentan.
- **Híbrido IA + humano**: la IA inspira y filtra; el asesor humano cierra por WhatsApp con el contexto ya armado.
- **Velocidad y móvil**: Core Web Vitals en verde; un sitio rápido se siente premium.

---

## SPRINT 1 — Conversión y confianza (alto impacto, bajo esfuerzo)

1. **CTA WhatsApp pegajoso y contextual.** Además del botón flotante, una barra
   inferior sticky en móvil ("Cotiza gratis por WhatsApp") y CTAs claros en cada
   sección. El mensaje de WhatsApp debe llevar contexto (destino/sección).
2. **Barra de confianza** bajo el hero: RNT N°, "12 años", "+18.500 viajeros",
   medios de pago, "respuesta < 5 min". Discreta, integrada al diseño.
3. **Prueba social honesta**: en `PackageCard` y modal, mostrar nº real de
   reseñas y rating. Si más adelante hay datos reales, añadir "última consulta
   hace X". NO inventar "personas viendo ahora".
4. **Escasez real**: el countdown del `OfferBanner` debe atarse a una fecha de
   promo real configurable en `lib/data.ts` (campo `promoEnds`). Si no hay promo
   activa, el banner cambia a mensaje perenne (sin reloj falso).
5. **Reseñas con "punto dulce de confianza"**: fotos reales y ratings variados
   (4.7–5.0), no todo perfecto. Estructura lista para cargar reseñas reales.
6. **Precio transparente** en el modal: desglose claro (precio × viajeros,
   impuestos/condiciones, "qué incluye / no incluye") y total visible.

## SPRINT 2 — Páginas de paquete ricas + SEO (`/paquetes/[id]`)

Crear ruta de detalle por paquete (además del modal, para SEO y para compartir):
- Galería de fotos (varias por paquete), itinerario día a día, qué incluye / no
  incluye, **mapa del destino** (Google Maps embed o estático), bloque
  "cómo llegar / mejor época", **FAQ por paquete**, reseñas del destino, y CTA de
  WhatsApp con resumen prellenado (destino, fechas, viajeros, total).
- **SEO técnico**: `generateMetadata` por paquete, Open Graph con la foto del
  destino, `sitemap.ts`, `robots.ts`, y **JSON-LD**: `TravelAgency` (global) +
  `TouristTrip`/`Product` con `aggregateRating` por paquete.
- Mantener el modal para conversión rápida; la ruta es para descubrimiento/SEO.

## SPRINT 3 — Asistente "Lía" real con handoff humano

Convertir "Lía" (hoy simulada) en un asistente conversacional real:
- `app/api/chat/route.ts` que llame a un LLM. **Pídeme las llaves/proveedor
  antes de implementar** (puede ser la API de Anthropic u otra).
- Capacidades: entender lenguaje natural; recomendar paquetes de `lib/data.ts`
  por **presupuesto, fechas, estilo de viaje e intereses**; sugerir **hidden gems
  del Eje**; armar un mini-itinerario.
- **Handoff a humano sin fricción**: cuando el cliente quiere cerrar, generar un
  resumen y abrir WhatsApp con todo el contexto prellenado para el asesor
  (destino, fechas, presupuesto, nº de viajeros, paquete sugerido).
- Tono de marca: cercano, colombiano, experto local. Nunca inventar precios o
  disponibilidad: si no sabe, deriva al asesor.

## SPRINT 4 — Personalización ligera (sin login)

- **Quiz "¿Qué viajero eres?"** (playa / aventura / cultura / luna de miel /
  familia) que filtra y recomienda paquetes.
- **Recomendados por temporada y por origen** (detectar ciudad aproximada y
  sugerir salidas desde Pereira/Bogotá/Medellín).
- **"Vistos recientemente"** (estado en cliente, sin cookies invasivas).
- Bloque "También te puede gustar" en el detalle de paquete.

## SPRINT 5 — Contenido local auténtico (diferenciador + SEO)

- Sección/blog de **guías de destino** (Eje Cafetero, San Andrés, Cartagena…)
  con "joyas escondidas", mejor época, presupuesto estimado y CTA a paquetes.
- Markdown/MDX o CMS ligero para que el equipo publique sin código.
- Esto atrae tráfico orgánico y posiciona a Vuela Fácil como experto local.

## SPRINT 6 — Captación real, analítica y comercial

- **Leads reales**: Server Action en `CapturaContacto` y en cada CTA de
  cotización → persistir en **Supabase** (o Resend para email). Validar con `zod`.
  **Pídeme las llaves antes.**
- **Analítica de conversión**: medir clics a WhatsApp por sección/paquete
  (Vercel Analytics o Plausible) para saber qué convierte.
- **Comercial**: destacar **cuotas (Addi/Nequi/tarjetas)** y "sin interés";
  cupones/promos por temporada; **programa "Tribu Vuela Fácil"/referidos**
  (código por WhatsApp); captura de email con beneficio real (guía gratis =
  reciprocidad).

---

## Sprint extra (cuando haya presupuesto/inventario)

- Multimoneda/idioma (`next-intl`, EN para internacional).
- Integración real con proveedores (vuelos/hoteles) o motor de cotización.
- App/PWA, notificaciones, alertas de precio reales.

---

## Checklist de "acabado profesional" (criterios de aceptación)

- [ ] Lighthouse móvil: Performance, SEO y Accesibilidad ≥ 90.
- [ ] CTA de WhatsApp visible en todo momento en móvil, con contexto correcto.
- [ ] Páginas `/paquetes/[id]` con itinerario, mapa, FAQ, galería y JSON-LD válido.
- [ ] Precios siempre transparentes (total + qué incluye/no incluye).
- [ ] Reseñas con fotos reales y ratings variados (sin perfección artificial).
- [ ] Escasez/urgencia **solo real** (promo con fecha verdadera o sin reloj).
- [ ] "Lía" recomienda y hace handoff a WhatsApp con contexto completo.
- [ ] Leads se guardan de verdad (no solo confirmación en cliente).
- [ ] Diseño y marca intactos; todo responsive y en español de Colombia.
- [ ] `sitemap.xml`, `robots.txt`, OG por destino y metadata por página.

## Cómo trabajar

Empieza por el **Sprint 1** completo, muéstrame el resultado y mídelo contra el
checklist antes de pasar al Sprint 2. Antes de cualquier integración con llaves
(IA, Supabase, Resend, analytics), **detente y pídemelas**. Commit por feature.
