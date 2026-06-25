// Contenido del tutorial del operador que se muestra en /admin/ayuda y que
// además alimenta a la Lía interna (/api/admin/asistente) como fuente de verdad.
// Cuanto más completo y claro esté esto, mejor responde Lía. Mantener en
// sincronía con TUTORIAL-OPERADOR.md (versión para repositorio).

export const TUTORIAL_OPERADOR = `
## ¡Bienvenido/a! 👋

Esta es tu guía completa para manejar **todo el contenido** de la página:
paquetes, fotos, ofertas, blog, testimonios, destinos y tus clientes. Está
escrita para que la entiendas sin saber nada de tecnología, paso a pasito.

> 🌟 **Tranquilidad ante todo:** no vas a dañar nada por explorar o equivocarte.
> Todo se puede corregir. No tienes que memorizar nada: cuando dudes, pregúntame
> aquí mismo o vuelve a leer la sección que necesites.

## 1. Cómo entrar al panel

1. Abre la página normal en tu navegador (Chrome, Edge, Safari…).
2. Baja hasta el **final de todo** (la franja azul oscura, el "pie de página").
3. Haz clic en el enlace **🛡️ ¿Eres colaborador?**
4. Escribe la **contraseña** y entra. Verás un **menú arriba** con todas las
   secciones: Inicio, Paquetes, Alojamientos, Destinos, Reservas, Guías, Promo,
   Testimonios, Leads, Analítica y Ayuda.

> 🔑 Si olvidas la contraseña, no te preocupes: contacta a Carlitos y él la
> restablece.

## 2. Tres cosas que aplican a TODO el panel

1. ✅ **Guardas y aparece al instante.** No hay que "publicar" aparte: apenas das
   **Guardar**, el cambio ya está en la página real.
2. 📝 **Es como llenar formularios.** Llenas las casillas, das Guardar, listo.
3. 🔄 **Todo es editable.** ¿Te equivocaste? Entra de nuevo, corrige y guarda.

> 💡 **Truco clave:** si guardas algo y al ver la página no lo notas, aprieta a la
> vez las teclas **Ctrl + Shift + R** (en Mac: ⌘ + Shift + R). Eso "refresca" y
> casi siempre soluciona.

## 3. Paquetes (lo que más vas a usar)

Los paquetes son los viajes que se muestran en la página.

### Crear un paquete nuevo — paso a paso
1. En el menú toca **Paquetes**.
2. Arriba a la derecha, botón **Nuevo paquete**.
3. Llena la sección **Información principal**:
   - **Destino:** el nombre del viaje. Ej: *San Andrés Isla*.
   - **País:** ej: *Colombia*.
   - **Categoría:** elige una de la lista (Playa, Eje Cafetero, Cruceros,
     Internacional, Aventura, Luna de Miel). Esto decide en qué filtros aparece.
   - **Etiqueta** (opcional): un sello que resalta la tarjeta. Ej: *Más vendido*,
     *Promo*. Si lo dejas vacío, no sale ningún sello.
   - **Duración (texto):** cómo se lee. Ej: *4 días · 3 noches*.
   - **Duración (días):** solo el número. Ej: *4*.
   - **Precio por persona:** el número, sin el signo $. Ej: *1890000*. (Si
     escribes *1.890.000* con puntos, también lo entiende.)
   - **Precio anterior** (opcional): solo si quieres mostrar descuento. Pon un
     número MAYOR al precio y se verá tachado con el % de ahorro.
   - **Calificación / N° de reseñas:** déjalas en **0** mientras no tengas
     reseñas reales (así no se muestran estrellas inventadas).
4. **Imagen principal:** toca **Subir nueva imagen** y elige una foto de tu
   computador (mira la sección 5 para que quede bonita).
5. **Detalle y contenido:**
   - **Resumen:** una o dos frases atractivas. Aparece en la página del viaje.
   - **Qué incluye:** escribe **una cosa por línea** (aprieta Enter para pasar a
     la siguiente). Ej: *Tiquetes ida y vuelta* / *Hotel 4★* / *Traslados*.
   - **Próximas salidas:** una por línea. Ej: *15 Jul* / *22 Jul*.
   - **Mejor época** y **Cómo llegar:** opcionales, pero ayudan.
   - 🤖 **Atajo con IA:** si ya pusiste destino, país y categoría, toca
     **Redactar textos** y la inteligencia artificial te propone el resumen, la
     mejor época y el cómo llegar. Tú los lees, ajustas a tu gusto y guardas.
6. Baja y toca **Crear paquete**. ✅ Ya está publicado.

### Editar un paquete que ya existe
1. Menú **Paquetes** → toca el paquete en la lista.
2. Botón **Editar**.
3. Cambia lo que necesites (precio, fotos, lo que incluye…).
4. Toca **Guardar cambios**. El cambio se ve de inmediato en la página.

### Eliminar un paquete
En la lista de paquetes, botón **Eliminar** en el paquete. Esto sí lo quita de la
página (no se puede deshacer, así que confirma que es el correcto).

### Duplicar y ordenar
- **Duplicar:** crea una copia idéntica para armar uno parecido sin empezar de
  cero. Queda con "(copia)" en el nombre; edítala y lista.
- **Ordenar:** con las flechas **↑ / ↓** subes o bajas un paquete. El orden de la
  lista es el mismo en que se ven en la página (pon arriba los que quieras
  destacar). *(Aplica igual en Alojamientos.)*

> 💡 Con solo elegir bien la **Categoría**, el paquete aparece solo en el buscador
> del inicio y en las páginas por tema. Tú no haces nada extra.

## 4. Paquetes express desde un flyer (consolidadores)

Cuando un consolidador te manda una **imagen con todo el plan adentro** (precio,
fechas, qué incluye), no transcribas nada:

1. Menú **Paquetes** → botón **Express (flyer)**.
2. Toca **Sube la imagen** del consolidador y elige el archivo.
3. Llena solo lo básico: **destino, país, categoría, precio desde** y la
   **vigencia** (ej: *Salidas en julio y agosto 2026*).
4. (Opcional) una **nota corta** para acompañar.
5. Toca **Publicar paquete**. ✅

En la página, ese paquete muestra **el flyer completo** (sin recortar) y el botón
de cotizar por WhatsApp. No salen secciones inventadas (itinerario, etc.) porque
todo está en la imagen. Si después quieres, puedes **editarlo como un paquete
normal** y seguirá tratándose como flyer.

> ⚡ **Cómo se distinguen:** en tu panel, los paquetes de consolidador llevan una
> marca naranja **"Consolidador"** (no muestran estrellas de reseñas). Y en la
> página, el cliente puede tocar el filtro **"⚡ Consolidador"** para ver solo
> esas ofertas. Así sumas muchos más planes sin transcribir nada.

## 5. Fotos: cómo que queden bien

- 📐 **Horizontales** y nítidas (paisajes, hoteles, playa). El flyer de
  consolidador sí puede ir vertical: se muestra completo.
- 🏋️ **Livianas:** idealmente **menos de 2 MB**. Si una foto pesa mucho, puede que
  **no suba** — esa es la causa más común.
- 🧭 Cómo subirla: en el formulario hay un botón **Subir nueva imagen** /
  **Sube la imagen**. Tócalo, busca la foto en tu computador y selecciónala.
  Si no subes nada al editar, se conserva la que ya tenía.
- 🚫 Evita fotos con marcas de agua o logos de otras agencias.

## 6. Promo: la oferta con cuenta regresiva (banner naranja)

1. Menú **Promo**.
2. Marca la casilla **Activa** y pon la **fecha de cierre**: ahí aparece la cuenta
   regresiva en el inicio.
3. Edita el título, el descuento (ej: *−25%*) y el texto.
4. Guarda.

> ⏰ Cuando la promo termine, **cambia la fecha** o **desmárcala (Activa)**. Nunca
> dejes una fecha vieja, porque el reloj se vería raro.

## 7. Guías (el blog de viajes)

Artículos que ayudan a que te encuentren en Google y dan confianza.

1. Menú **Guías** → botón **Nueva guía**.
2. Pon **título, destino y etiquetas** (las etiquetas separadas por comas).
3. 🤖 Toca **Redactar con IA**: te escribe un borrador completo en segundos.
   Léelo, ajústalo a tu voz y corrige lo que quieras.
4. Marca la casilla **Publicada** para que salga en el sitio. Si la dejas sin
   marcar, queda como borrador (no se ve aún).
5. Guarda.

## 8. Testimonios (opiniones de clientes)

**Regla de oro: que sean reales.**

1. Menú **Testimonios** → formulario **Agregar testimonio**.
2. Pon nombre, ciudad y destino del cliente.
3. En **Notas reales del cliente** escribe en puntos lo que te contó (no tiene
   que estar bonito).
4. 🤖 Toca **Redactar reseña con IA**: convierte tus notas en una reseña natural,
   sin inventar nada que el cliente no haya dicho.
5. Revisa el texto, ponle la calificación (de 0 a 5) y **Guarda**.

> ⚠️ No publiques reseñas inventadas: es injusto con el cliente y puede traer
> problemas legales.

## 9. Destinos del globo / tablero

Son los puntos del **globo terráqueo** (en computador) y del **tablero de
aeropuerto** (en celular) de la sección "Explora el mundo desde Pereira".

1. Menú **Destinos** → **Nuevo destino** o toca uno para editarlo.
2. Pon nombre y país. Si el destino tiene un paquete, **enlázalo** para que el
   punto abra ese plan.
3. Las coordenadas (lat/lng) ubican el punto en el globo; si no las sabes,
   déjalas como están.
4. Guarda. (No hace falta tocar esto seguido: ya viene cargado.)

## 10. Leads: tus clientes potenciales 💙

Aquí está el oro: **toda persona interesada**. Llegan **solos**, de dos formas:

- 📝 Del **formulario** de la página (cuando alguien deja su correo/WhatsApp).
- 🤖 De **Lía, la asistente de los clientes** (la burbujita del sitio): cuando un
  visitante le da su WhatsApp en el chat, **se crea el contacto solo**, con un
  resumen de lo que pidió en las notas.

### Cómo atender un lead — paso a paso
1. Menú **Leads**. Verás la lista de contactos. Cada uno tiene una **etapa**:
   **Nuevo → Contactado → Cotizado → ¡Ganado! / Perdido**.
2. Cuando le escribas o hables, toca el botón de la etapa para **moverlo**
   (ej: de *Nuevo* a *Contactado*).
3. Si dejó WhatsApp, hay un **botón verde** que abre el chat con esa persona
   directamente.
4. Escribe **notas internas** (presupuesto, fechas, lo que hablaron) y toca
   **Guardar**. Así no se te olvida nada para la próxima vez.
5. Usa los **filtros de arriba** (Nuevos, Contactados…) para atender primero a
   quienes aún no contactas.

> 💙 Un lead respondido rápido es casi una venta. Revisa los **Nuevos** todos los
> días.

## 11. Reservas

Solicitudes que la gente hace desde un paquete (con destino, fecha y viajeros).

1. Menú **Reservas**.
2. Mueve cada una según avances:
   **Pendiente → En proceso → Confirmada / Cancelada**.
3. Toca una reserva para ver el detalle, escribirle al cliente por WhatsApp y
   dejar notas.
4. Botón **Exportar CSV** si quieres llevar el control en Excel.

## 12. Analítica

En **Analítica** ves, de un vistazo, cómo va tu negocio. Solo es para mirar; no
hay que configurar nada. Tiene cuatro partes:

1. **Lo que debes mirar primero** (las 4 tarjetas de arriba):
   - **Leads sin atender:** personas que aún no has contactado. Si el número está
     en naranja, ¡escríbeles hoy! Son ventas que se pueden enfriar.
   - **Reservas pendientes:** solicitudes de paquetes por confirmar.
   - **Interés (clics WhatsApp):** cuántas veces tocaron un botón de WhatsApp.
   - **Clientes ganados:** cuántos leads terminaron en venta.
2. **Tus clientes por etapa (el embudo):** muestra cuánta gente está en cada paso
   — *Nuevos → Contactados → Cotizados → Ganados / Perdidos*. Si se te acumulan
   los **Nuevos**, te falta contactarlos. Los mueves en la sección **Leads**.
3. **Reservas:** cuántas hay en cada estado y el valor de las confirmadas.
4. **¿Qué despierta más interés?:** qué páginas y paquetes hacen que la gente
   toque WhatsApp. Refuerza esos (mejores fotos, ofertas, guías).

> 💡 La regla de oro: atiende rápido los **“Nuevos”**. Un lead contestado a tiempo
> es casi una venta.

## 13. Si algo sale mal (soluciones rápidas)

- **Sale "No se pudo guardar el cambio" (aviso rojo):** fue un problema
  momentáneo de internet. **Intenta de nuevo.** Si sigue, avisa a Carlitos.
- **Guardé algo y no lo veo en la página:** aprieta **Ctrl + Shift + R** para
  refrescar.
- **No me sube una foto:** seguramente pesa más de 2 MB. Usa una más liviana.
- **Olvidé la contraseña:** la restablece Carlitos.
- **El globo no sale en el celular:** es a propósito; en celular se muestra el
  tablero de destinos, que es más rápido.

## 14. Receta: publicar un paquete bien hecho ✅

- Foto horizontal, nítida y liviana (menos de 2 MB).
- Destino y país correctos.
- Categoría bien elegida (define dónde aparece).
- Precio real, solo números.
- Resumen atractivo (1-2 frases) — puedes usar la IA.
- "Qué incluye" claro, una cosa por línea.
- Próximas salidas reales y futuras.
- Guardar y revisar cómo se ve en la página.

## 15. Alojamientos (arriendo de fincas y estadías) 🏡

Además de los viajes, puedes publicar **alojamientos en arriendo** (fincas,
cabañas, glamping, apartamentos, casas). Funciona casi igual que los paquetes y
los reservan por WhatsApp.

### Crear o editar un alojamiento
1. Menú **Alojamientos** → botón **"Nuevo alojamiento"** (o toca uno y **"Editar"**).
2. Llena la **Información principal**:
   - **Título** (ej: "Finca cafetera con piscina") y **Tipo** (Finca, Cabaña,
     Glamping, Apartamento, Casa, Habitación).
   - **Ubicación** (ej: "Salento, Quindío").
   - **Precio por noche** (solo números) y, si quieres, **precio anterior**
     (se muestra tachado con el % de ahorro).
   - **Huéspedes, habitaciones, camas, baños** y, opcional, **mínimo de noches**.
3. Sube la **imagen principal** y, si tienes, más fotos a la **galería**.
4. En **Detalle y amenidades**: escribe una descripción que enamore y las
   **amenidades** (Piscina, WiFi, Cocina, Parqueadero, BBQ, Jacuzzi, Apto
   mascotas…), una por línea o separadas por coma.
5. En **Publicación**:
   - **Publicado**: marcado = visible en la página. Desmárcalo para dejarlo de
     borrador mientras lo terminas.
   - **Destacado**: aparece en el bloque de la página de inicio.
6. **Guardar**. ✅ Aparece al instante en la sección **Alojamientos** del sitio.

### ¿Cómo lo ve y reserva el cliente?
- Ve la ficha con fotos, capacidad y amenidades. Elige **fechas y # de huéspedes**,
  el sitio le calcula un estimado y abre **WhatsApp** con todo escrito.
- **No se cobra nada en línea**: tú confirmas disponibilidad y precio final por
  WhatsApp, como siempre.

> 💡 Mantén actualizados precio y fotos. Si un alojamiento ya no está disponible
> por una temporada, lo más fácil es **desmarcar "Publicado"** y volver a marcarlo
> cuando esté libre.

## 16. Qué NO tocas tú (lo hace Carlitos)

Estas cosas no salen en tu panel; si necesitas cambiarlas, solo avísale a
Carlitos:

- Datos legales y de contacto (RNT, NIT, dirección, correos, número de WhatsApp).
- Textos de Términos, Privacidad y Reembolsos.
- Activar pagos en línea, correos automáticos o precios de vuelos.
- Colores, tipografías y la estructura general de la página.

---

### 🆘 ¿Necesitas ayuda?

Respira: **no se dañó nada**. Si te trabas con algo, **llama o escríbele a
Carlitos** (él administra el sitio) y te ayuda enseguida. 🌟

¡Lo estás haciendo muy bien! Con esta guía tienes el control total del contenido
de tu página.
`;
