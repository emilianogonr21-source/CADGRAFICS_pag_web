# Guía rápida — página Dell

Documento corto para quien edite la página Dell sin perderse.

Cada página Dell (y el resto del sitio) ya sigue el mismo patrón:

| Archivo | Pregunta que responde |
|---------|------------------------|
| `pages/dell/home-dell.html` | ¿Qué textos, botones e imágenes hay? |
| `assets/css/dell/home-dell.css` | ¿Cómo se ve (colores, tamaños, menú)? |
| `assets/js/dell/home-dell.js` | ¿Qué pasa al hacer clic o enviar un formulario? |

Ver la tabla completa en el [README](../README.md).

Si cambias un texto → HTML.  
Si cambias un color o espacio → CSS.  
Si el menú o Contáctanos dejan de funcionar → JS.

## Contáctanos

El enlace del menú abre una **ventana emergente** con un formulario corto.  
Eso lo controla la clase `textbutton-trigger` y el bloque de la ventana al final del HTML.

El envío de Contáctanos y del formulario de página usa `Cadgrafics.submitLead`
(en `assets/js/shared/site-common.js`): intenta la API y abre WhatsApp con los datos.

También se cargan:

- `../../assets/css/shared/base.css`
- `../../assets/js/shared/site-common.js` (antes de `home-dell.js`)

## Imágenes

Las fotos de Dell van en:

`assets/images/images_home-dell/`

Hoy la portada usa `hero-laptop.png`.

## Antes de publicar un cambio

1. Abre la página con Live Server.
2. Prueba el menú en celular (botón de tres líneas).
3. Prueba Contáctanos (debe abrir la ventana).
4. Revisa que el aviso de privacidad del pie abra bien.
