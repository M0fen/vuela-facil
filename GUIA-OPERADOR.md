# Guía del operador — Vuela Fácil Travel

Guía sencilla para manejar el sitio y el panel de administración. No necesitas saber programar.

---

## 1. Cómo entrar al panel

1. Abre el navegador y ve a: **`https://TU-DOMINIO/admin`**
   *(reemplaza `TU-DOMINIO` por la dirección real del sitio).*
2. Escribe la **contraseña** de administrador.
3. Listo: verás el panel con el menú a la izquierda.

> 🔒 La contraseña la maneja quien configuró el sitio. Si la cambias, pídele que la actualice.

---

## 2. Qué puedes hacer en el panel

El menú tiene estas secciones:

| Sección | Para qué sirve |
|---|---|
| **Paquetes** | Crear, editar o quitar los viajes que se muestran en la página. |
| **Destinos** | Los puntos del globo/mapa (“Explora el mundo desde Pereira”). |
| **Promo** | El banner de oferta con cuenta regresiva. |
| **Testimonios** | Las reseñas de viajeros que aparecen en la página. |
| **Guías** | El blog de viajes (artículos). |
| **Leads** | Los contactos que llegan por el formulario (con seguimiento). |
| **Reservas** | Las solicitudes de reserva que hacen desde un paquete. |

Cualquier cambio que guardes aparece en el sitio **al instante** (no hay que “publicar” aparte).

---

## 3. Editar o crear un paquete (lo más común)

1. Entra a **Paquetes** → botón **“Nuevo paquete”** (o toca uno existente para editar).
2. Llena los campos:
   - **Destino**, **País**, **Duración** (ej: “4 días · 3 noches”).
   - **Precio** (solo el número, en pesos; sin puntos ni símbolos).
   - **Precio antes** (opcional): si lo pones mayor al precio, se muestra tachado con el % de ahorro.
   - **Categoría**: Playa, Eje Cafetero, Cruceros, Internacional, Aventura o Luna de Miel.
   - **Incluye / Salidas**: una línea por ítem (Enter para separar).
   - **Imagen**: sube una foto desde tu computador.
3. Pulsa **Guardar**.

> 💡 Para que un destino aparezca en el **buscador del inicio** y en las **landings** (`/viajes/...`), basta con que el paquete tenga su **categoría** bien puesta.

---

## 4. Manejar Leads (contactos) — seguimiento

En **Leads** ves a todos los que dejaron su correo/WhatsApp. Cada contacto tiene una **etapa**:

**Nuevo → Contactado → Cotizado → Ganado / Perdido**

- Toca los botones de etapa para mover el contacto según vayas avanzando.
- Escribe **notas internas** (presupuesto, fechas, lo que hablaron) y **Guardar**.
- Si dejaron WhatsApp, hay un **enlace directo** para escribirles.
- Si vino **referido**, aparece marcado “Referido por …”.

> Usa los filtros de arriba (Nuevos, Contactados…) para no perder ningún contacto sin atender.

---

## 5. Manejar Reservas

En **Reservas** llegan las solicitudes hechas desde un paquete (con destino, fecha, viajeros y total estimado). Igual que los leads, puedes cambiar su **estado** (Pendiente → En proceso → Confirmada / Cancelada) y exportarlas a CSV.

---

## 6. Cómo funciona la página para el cliente (resumen)

- Todo termina en **WhatsApp**: casi todos los botones abren un chat con un mensaje ya escrito.
- **Lía** (el asistente con burbuja flotante) responde dudas con IA y siempre ofrece “hablar con un asesor” por WhatsApp.
- El **buscador del inicio** filtra los paquetes por destino, categoría y presupuesto, y arma una cotización por WhatsApp.
- En **celular**, la sección de destinos se ve como un **tablero de salidas de aeropuerto**; en computador, como un **globo 3D**.
- La página se puede **instalar como app** desde el navegador (PWA).

---

## 7. Cosas que NO se tocan desde el panel (las hace el técnico)

- Datos legales y de contacto (RNT, NIT, dirección, correos, número de WhatsApp).
- Textos legales (Términos, Privacidad, Reembolsos).
- Activar pagos en línea (Wompi) o correos automáticos (Resend).
- Colores, tipografías y estructura general.

Para cualquiera de estos, contacta a quien administra el código. La lista de pendientes técnicos está en **`PENDIENTES.md`**.

---

## 8. Problemas frecuentes

- **No veo un cambio que guardé:** recarga con **Ctrl + Shift + R** (refresco forzado).
- **No carga una imagen nueva:** revisa que el archivo no sea muy pesado (idealmente menos de ~2 MB) y vuelve a subirla.
- **El globo no aparece en el celular:** es a propósito — en celular se muestra el tablero de destinos (más rápido y claro).
- **Olvidé la contraseña del panel:** la restablece quien administra el código.

---

📞 **Soporte WhatsApp del negocio:** +57 311 449 4224
