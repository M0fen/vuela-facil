// Contenido del tutorial del operador que se muestra en /admin/ayuda.
// Fuente única para la página de Ayuda del panel (se renderiza con marked).
// Mantener en sincronía con TUTORIAL-OPERADOR.md (versión para repositorio).

export const TUTORIAL_OPERADOR = `
## ¡Bienvenido/a! 👋

Esta es tu guía completa para manejar **todo el contenido** de la página:
paquetes, fotos, ofertas, blog, testimonios y tus clientes. Está escrita para que
la entiendas sin saber nada de tecnología.

> 🌟 **Lo primero, tranquilidad:** no vas a dañar nada por explorar o equivocarte.
> Todo se puede corregir. Léelo con calma y vuelve cuando lo necesites.

## 1. Cómo funciona (lo esencial)

Tres ideas que aplican a **todo** el panel:

- ✅ **Guardas y aparece al instante.** No hay que "publicar" aparte.
- 📝 **Es como llenar formularios.** Llenas las casillas, guardas, listo.
- 🔄 **Todo es editable.** Si te equivocaste, entras de nuevo y corriges.

> 💡 Si guardas algo y no lo ves, aprieta **Ctrl + Shift + R** para refrescar.

## 2. Paquetes (lo que más vas a usar)

Los paquetes son los viajes que se ven en la página.

**Crear uno nuevo:** menú **Paquetes** → botón **Nuevo paquete**. Llena:

| Campo | Qué poner |
|---|---|
| **Destino** | Nombre del viaje (ej: San Andrés Isla) |
| **País** | País del destino (ej: Colombia) |
| **Categoría** | Elige de la lista (define dónde aparece) |
| **Etiqueta** | Sello opcional que resalta (ej: Más vendido) |
| **Duración** | Texto (4 días · 3 noches) y número de días |
| **Precio por persona** | Solo números (ej: 1890000) |
| **Precio anterior** | Opcional: si es mayor, se ve tachado con el % de ahorro |
| **Calificación / reseñas** | Déjalo en 0 si aún no tienes reseñas reales |

> 💰 **Sobre el precio:** lo ideal es escribir solo números (1890000). Pero si
> escribes con puntos (1.890.000), **también funciona**.

Luego: sube la **imagen principal**, completa **Qué incluye** y **Próximas
salidas** (una cosa por línea) y pulsa **Guardar**.

> 🤖 **¿Sin tiempo de escribir?** Llena destino, país y categoría y pulsa
> **Redactar textos**: la IA propone el resumen, la mejor época y cómo llegar.
> Tú lo revisas y ajustas.

**Editar:** toca el paquete → **Editar** → cambia → **Guardar cambios**.
**Eliminar:** botón **Eliminar** en la lista.

> 💡 Con poner bien la **Categoría**, el paquete aparece solo en el buscador del
> inicio y en las páginas por tema. No haces nada extra.

## 3. Paquetes express desde un flyer (consolidadores)

Cuando un consolidador te manda una **imagen con todo el plan adentro**, no
transcribas nada:

1. Menú **Paquetes** → botón **Express (flyer)**.
2. **Sube la imagen** del consolidador.
3. Llena solo: **destino, país, categoría, precio desde** y **vigencia**
   (ej: "Salidas en julio y agosto 2026").
4. **Publicar paquete**.

En la página se muestra **el flyer completo** (sin recortar) y el botón de cotizar
por WhatsApp. No salen secciones inventadas, porque todo está en la imagen.

## 4. Fotos: buenas prácticas

- 📐 **Horizontal** y nítida (el flyer de consolidador puede ir vertical).
- 🏋️ **Liviana:** idealmente menos de **2 MB**. Si pesa mucho, no sube.
- 🚫 Evita marcas de agua o logos de otras agencias.

## 5. Promo: la oferta con cuenta regresiva

El banner naranja del inicio.

1. Menú **Promo**.
2. **Activa** la promo y pon la **fecha de cierre** (aparece el reloj).
3. Edita título, descuento y texto. **Guardar**.

> ⏰ Cuando la promo termine, **cambia la fecha** o **desactívala**. Nunca dejes
> una fecha vieja.

## 6. Guías (el blog)

Artículos que posicionan tu página en Google y dan confianza.

1. Menú **Guías** → **Nueva guía**.
2. Pon **título, destino y etiquetas**.
3. 🤖 Pulsa **Redactar con IA**: te escribe un borrador completo. Ajústalo a tu voz.
4. Marca **Publicada** para que salga en el sitio.
5. **Guardar**.

## 7. Testimonios

Opiniones de viajeros. **Regla de oro: que sean reales.**

1. Menú **Testimonios** → "Agregar testimonio".
2. Pon nombre, ciudad y destino.
3. En **Notas reales del cliente**, escribe en puntos lo que te contó.
4. 🤖 Pulsa **Redactar reseña con IA**: convierte tus notas en una reseña natural
   (sin inventar nada).
5. Revisa, pon la calificación y **Guardar**.

> ⚠️ No publiques reseñas inventadas: es injusto con el cliente y puede traer
> problemas legales.

## 8. Destinos del globo / tablero

Los puntos del globo (computador) y del tablero de aeropuerto (celular).

1. Menú **Destinos** → **Nuevo destino** o edita uno.
2. Pon nombre y país; si el destino tiene paquete, enlázalo.
3. **Guardar**. (No hace falta tocarlo seguido; ya viene cargado.)

## 9. Leads: tus clientes 💙

Aquí está el oro: **toda persona interesada**. Llegan **solos** de dos formas:

- 📝 Del **formulario** de la página.
- 🤖 De **Lía** (la asistente): cuando un visitante le da su WhatsApp en el chat,
  Lía **crea el contacto solo**, con un resumen de lo que pidió en las notas.

**Cómo trabajarlos:**

1. Menú **Leads**. Cada contacto tiene una etapa:
   **Nuevo → Contactado → Cotizado → ¡Ganado! / Perdido**.
2. Toca los botones para moverlo según avanzas.
3. Si dejó WhatsApp, hay un **botón verde** para escribirle directo.
4. Escribe **notas internas** (presupuesto, fechas) y **Guarda**.
5. Usa los **filtros** de arriba para atender primero a los **Nuevos**.

> Un lead respondido rápido es casi una venta. Revisa los **Nuevos** a diario.

## 10. Reservas

Solicitudes hechas desde un paquete.

1. Menú **Reservas**. Mueve cada una:
   **Pendiente → En proceso → Confirmada / Cancelada**.
2. Toca una para ver el detalle, escribir por WhatsApp y dejar notas.
3. Puedes **Exportar CSV** para tu control en Excel.

## 11. Si algo sale mal

- **"No se pudo guardar el cambio"** (aviso rojo): problema momentáneo de
  conexión. **Inténtalo otra vez.** Si sigue, avisa al administrador.
- **No veo un cambio que guardé:** **Ctrl + Shift + R** para refrescar.
- **No sube una foto:** está muy pesada (más de 2 MB). Redúcela.
- **Olvidé la contraseña:** la restablece quien administra el sitio.

## 12. Receta: publicar un paquete bien hecho ✅

- Foto horizontal, nítida y liviana (menos de 2 MB).
- Destino y país correctos.
- Categoría bien elegida (define dónde aparece).
- Precio real, solo números.
- Resumen atractivo (1-2 frases) — puedes usar la IA.
- "Qué incluye" claro, una cosa por línea.
- Próximas salidas reales y futuras.
- Guardar y revisar cómo se ve en la página.

## 13. Qué NO tocas tú

Esto lo hace el técnico (no aparece en tu panel). Si lo necesitas, avísale:

- Datos legales y de contacto (RNT, NIT, dirección, correos, WhatsApp).
- Textos de Términos, Privacidad y Reembolsos.
- Activar pagos en línea, correos automáticos o precios de vuelos.
- Colores, tipografías y estructura general.

---

### 🆘 ¿Necesitas ayuda?

Respira: no se dañó nada. Escribe o llama al **WhatsApp del negocio: +57 311 449 4224**.

¡Lo estás haciendo muy bien! 🌟
`;
