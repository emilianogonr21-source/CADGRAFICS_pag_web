# Guía rápida — página Dell

Documento corto para quien edite Dell sin perderse.

## Los tres archivos

| Archivo | Pregunta que responde |
|---------|------------------------|
| `pages/dell/home-dell.html` | ¿Qué textos, botones e imágenes hay? |
| `assets/css/dell/home-dell.css` | ¿Cómo se ve (colores, tamaños, menú)? |
| `assets/js/dell/home-dell.js` | ¿Qué pasa al hacer clic o enviar un formulario? |

Tabla completa del sitio: [README.md](README.md).

Si cambias un texto → HTML.  
Si cambias un color o espacio → CSS.  
Si el menú o Contáctanos dejan de funcionar → JS.

## Contáctanos

El enlace del menú abre una **ventana encima de la página** con un formulario corto.

Eso lo controlan:

- en el HTML: el enlace con la clase `textbutton-trigger` y el bloque de la ventana al final;
- en el comportamiento: el archivo compartido `assets/js/shared/site-common.js` y luego `home-dell.js`.

Al enviar Contáctanos o el formulario de la página, el sitio intenta guardar el dato y **abre WhatsApp** con los datos, para no perder el contacto.

También se cargan (en este orden):

1. `assets/css/shared/base.css` (colores base + cookies)
2. `assets/css/dell/home-dell.css` (apariencia de Dell)
3. `assets/js/shared/site-common.js` (menú, ventana, WhatsApp)
4. `assets/js/dell/home-dell.js` (pestañas Pro, formulario largo, animaciones)

## Imágenes

Las fotos de Dell van en:

`assets/images/images_home-dell/`

Hoy la portada usa `hero-laptop.png`.

## Orden del contenido en la página

1. Menú superior  
2. Portada  
3. Línea Pro (pestañas Premium / Plus / Max)  
4. Precision  
5. Latitude  
6. Formulario de contacto  
7. Bloque Cadgrafics + Dell  
8. Pie de página  
9. WhatsApp flotante  
10. Ventana de Contáctanos  
11. Aviso de cookies  

## Antes de publicar un cambio

1. Abre la página con Live Server.
2. Prueba el menú en celular (botón de tres líneas).
3. Prueba Contáctanos (debe abrir la ventana).
4. Revisa que el aviso de privacidad del pie abra bien.
