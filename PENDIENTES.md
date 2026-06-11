# Pendientes — Vuela Fácil

Checklist de lo que falta de tu lado. Marca con `x` lo que vayas completando.

## 🟥 CRÍTICO — número de WhatsApp en Vercel
- [ ] **Actualizar `NEXT_PUBLIC_WHATSAPP_NUMERO` en Vercel** → Settings → Environment Variables a **`573114494224`** y re-desplegar. El código y `.env.local` ya usan el número nuevo, pero **la variable de Vercel manda**: si quedó el viejo (`573145452095`), los enlaces de WhatsApp en producción seguirán yendo al número equivocado.

## 🟥 Antes de publicar Fase 0 (datos reales en `lib/data.ts` → `NEGOCIO`)
- [x] **WhatsApp** real: `573114494224` (display `+57 311 449 4224`). *(Falta actualizar la env var en Vercel, ver arriba.)*
- [x] **NIT** real: `902057889-8`.
- [~] **RNT**: puesto como **"RNT vigente"** + fecha de inscripción **20 de abril de 2026** (en el footer). Si tienes el **número de RNT** (formato "RNT 12345"), dímelo y lo muestro como número.
- [ ] **Razón social** correcta (hoy `Vuela Fácil Travel S.A.S.`).
- [ ] **Correo de contacto** real (hoy `hola@vuelafacil.com`).
- [ ] **Correo de Habeas Data** real (hoy `datos@vuelafacil.com`).
- [ ] **Dirección** confirmada (hoy `Cra. 14 #20-35, Pereira`).
- [ ] **ANATO**: número de afiliación si aplica (campo `anato`, hoy vacío).
- [ ] **Facebook**: URL real o dejar vacío (campo `facebook`).
- [ ] **Revisión legal por un abogado** de `/terminos`, `/privacidad` y `/reembolsos` (son plantillas base).

## ✅ Verificar afirmaciones de marketing (auditoría de contenido)
Dejé el copy honesto y conservador; confirma los datos reales para poder ser más específicos:
- [ ] **Marcas con las que reservas** (sección "Reservamos con las marcas que ya conoces" en `components/Confianza.tsx`): confirma cuáles son ciertas. Hoy: Avianca, LATAM, Wingo, Royal Caribbean, Decameron, Iberostar, AssistCard. Quité el encabezado "aliados estratégicos / operamos con marcas líderes" para no afirmar una alianza formal. Si tienes acuerdos reales, podemos decirlo explícitamente.
- [ ] **N.º real de destinos** (antes decía "+40 destinos · 5 continentes", lo retiré por inflado). Si quieres mostrar una cifra, dime la real.
- [ ] **% de recompra** (antes el hero decía "98% vuelven con nosotros", sin fuente → lo cambié a "100% por WhatsApp"). Si tienes el dato real medido, lo reponemos.
- [ ] **"Reseñas verificadas"** → lo cambié a "reseñas de viajeros". Cuando conectes reseñas reales de Google, vuelve a ser "verificadas".

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

## 🟪 Para activar avisos por correo (Resend) — Fase 2 (OPCIONAL)
- [ ] Crear cuenta en **Resend** (https://resend.com) y copiar la API key.
- [ ] Configurar en Vercel / `.env.local`:
  - [ ] `RESEND_API_KEY`
  - [ ] `NOTIFY_EMAIL` (correo donde recibirás cada lead y reserva)
  - [ ] `NOTIFY_FROM` (opcional; remitente con dominio verificado)
- [ ] Sin estas variables no se envía nada: el panel y WhatsApp siguen igual.

## 📱 WhatsApp Business / PWA — Fase 4 (lado tuyo, opcional)
- [ ] Pasar el número a **WhatsApp Business** (gratis): cuenta verificada, **horario de atención**, **mensaje de ausencia** y **respuestas rápidas**. El sitio ya muestra "En línea / Fuera de horario" según Lun–Sáb 8 a.m.–8 p.m.
- [ ] (Opcional) **Catálogo** de WhatsApp Business con los paquetes destacados.
- [ ] (Opcional) Reemplazar el ícono SVG por **PNG 192×192 y 512×512** para máxima compatibilidad de instalación en iOS antiguo (hoy se usa `/public/icon.svg`, suficiente para Android/Chrome).
- [ ] Si cambias el horario de atención, ajústalo en `lib/horario.ts` (y `NEGOCIO.horario`).

## 🎁 Programa de referidos / Club — Fase 5 (decisión comercial tuya)
- [ ] **Definir los beneficios reales**: monto/% del descuento de bienvenida (referido) y del bono (quien refiere). Hoy el copy es genérico a propósito (no promete cifras). Se editan en `lib/data.ts` → `REFERIDOS` y `CLUB`.
- [ ] Decidir si el beneficio del Club se comunica con cifras o se mantiene "a criterio del asesor".
- [ ] Operativa: cómo acreditas el bono a quien refiere (lo gestiona el asesor; los leads referidos llegan marcados "Referido por X" en el panel).

## 🟩 Operación / cuenta (no bloquean, pero conviene)
- [ ] Habilitar la pestaña **Analytics** en Vercel (vistas de página).
- [ ] **Rotar** los secretos que pasaron por el chat: `ADMIN_PASSWORD`, tokens de Blob y DeepSeek.
- [ ] Reemplazar imágenes placeholder de Unsplash por fotos propias (`lib/data.ts`).

## ⏸️ Pausado
- [ ] **Logo que despega**: entregar el avión como capa aparte (PNG/SVG transparente) para animarlo.

## 🔜 Próximas fases del plan competitivo (cuando quieras)
- [x] Fase 2 — `AggregateRating` + `Review` JSON-LD + CRM/seguimiento de cotizaciones + avisos por correo. *(Reseñas de Google embebidas: pendiente conectar la cuenta real.)*
- [ ] Fase 3 — Landings comerciales por destino y temática + schema (SEO a escala).
- [x] Fase 4 — PWA (instalable + offline) + indicador "En línea" de WhatsApp por horario. *(Favoritos descartados a propósito: no queremos cuentas/perfiles.)*
- [x] Fase 5 — Referidos con atribución por enlace (sin cuentas) + Club Vuela Fácil (fidelización). *(Falta que definas los montos reales del beneficio.)*
