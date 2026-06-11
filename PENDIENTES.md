# Pendientes — Vuela Fácil

Checklist de lo que falta de tu lado. Marca con `x` lo que vayas completando.

## 🟥 Antes de publicar Fase 0 (datos reales en `lib/data.ts` → `NEGOCIO`)
- [ ] **RNT** real del MinCIT (hoy `RNT 00000`).
- [ ] **NIT** real (hoy `PENDIENTE-NIT`).
- [ ] **Razón social** correcta (hoy `Vuela Fácil Travel S.A.S.`).
- [ ] **Correo de contacto** real (hoy `hola@vuelafacil.com`).
- [ ] **Correo de Habeas Data** real (hoy `datos@vuelafacil.com`).
- [ ] **Dirección** confirmada (hoy `Cra. 14 #20-35, Pereira`).
- [ ] **ANATO**: número de afiliación si aplica (campo `anato`, hoy vacío).
- [ ] **Facebook**: URL real o dejar vacío (campo `facebook`).
- [ ] **Revisión legal por un abogado** de `/terminos`, `/privacidad` y `/reembolsos` (son plantillas base).

## 🟦 Para activar el pago online (Wompi) — Fase 1
- [ ] Crear cuenta de comercio en **Wompi** (https://comercios.wompi.co).
- [ ] Configurar en Vercel / `.env.local`:
  - [ ] `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`
  - [ ] `WOMPI_INTEGRITY_SECRET`
  - [ ] `WOMPI_EVENTS_SECRET`
  - [ ] `NEXT_PUBLIC_SITE_URL` (dominio real, sin slash final)
- [ ] Configurar el **webhook** en el panel de Wompi: `https://TU-DOMINIO/api/pagos/wompi/webhook`
- [ ] **Probar un pago real** (sandbox primero). La integración no se pudo testear sin llaves.
- [ ] (Opcional) **Addi / Sistecrédito** directo: integración aparte. La mensajería ya está lista.

## 🟩 Operación / cuenta (no bloquean, pero conviene)
- [ ] Habilitar la pestaña **Analytics** en Vercel (vistas de página).
- [ ] **Rotar** los secretos que pasaron por el chat: `ADMIN_PASSWORD`, tokens de Blob y DeepSeek.
- [ ] Reemplazar imágenes placeholder de Unsplash por fotos propias (`lib/data.ts`).

## ⏸️ Pausado
- [ ] **Logo que despega**: entregar el avión como capa aparte (PNG/SVG transparente) para animarlo.

## 🔜 Próximas fases del plan competitivo (cuando quieras)
- [ ] Fase 2 — Reseñas de Google + `AggregateRating` + CRM/seguimiento de cotizaciones (email).
- [ ] Fase 3 — Landings comerciales por destino y temática + schema (SEO a escala).
- [ ] Fase 4 — PWA + WhatsApp Business + favoritos persistentes.
- [ ] Fase 5 — Referidos formal + fidelización.
