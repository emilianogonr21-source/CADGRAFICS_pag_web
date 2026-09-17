# Guía rápida — página Dell

Documento corto para quien edite Dell sin perderse.  
La guía completa del sitio está en [README.md](README.md).

---

## Los tres archivos

| Archivo | Pregunta que responde |
|---------|------------------------|
| `pages/dell/home-dell.html` | ¿Qué textos, botones e imágenes hay? |
| `assets/css/dell/home-dell.css` | ¿Cómo se ve (colores, tamaños, menú)? |
| `assets/js/dell/home-dell.js` | ¿Qué pasa al hacer clic o enviar un formulario? |

| Quiero… | Abro |
|---------|------|
| Cambiar un texto | HTML |
| Cambiar un color o espacio | CSS |
| Arreglar el menú o Contáctanos | JS compartido + JS de Dell |

---

## Cómo se cargan los archivos compartidos

Orden en el HTML de Dell:

1. `assets/css/shared/base.css` — colores base Cadgrafics  
2. `assets/css/dell/home-dell.css` — apariencia de Dell  
3. `assets/js/shared/site-common.js` — menú, ventana Contáctanos, WhatsApp  
4. `assets/js/dell/home-dell.js` — pestañas Pro, formulario largo, animaciones  

---

## Contáctanos

El enlace del menú abre una **ventana encima de la página** con un formulario corto.

| Pieza | Dónde |
|-------|--------|
| Enlace del menú | clase `textbutton-trigger` en el HTML |
| Ventana | bloque `#formModal` al final del HTML |
| Formulario | `#leadForm` |
| Lógica | `assets/js/shared/site-common.js` |

Al enviar Contáctanos o el formulario de la página, el sitio intenta guardar el dato y **abre WhatsApp** con el mensaje listo.

---

## Imágenes y videos

| Tipo | Carpeta |
|------|---------|
| Fotos | `assets/images/dell/home/` |
| Videos | `assets/video/dell/home/` |

Hoy la portada usa `hero-background.jpg`.

Desde el HTML de Dell, las rutas van con `../../assets/...` porque el archivo está dentro de `pages/dell/`.

---

## Orden del contenido en la página

1. Menú superior  
2. Portada (hero)  
3. Línea Pro (pestañas Premium / Plus / Max)  
4. Precision  
5. Latitude  
6. Formulario de contacto  
7. Bloque Cadgrafics + Dell  
8. Pie de página  
9. WhatsApp flotante  
10. Ventana de Contáctanos (modal)  

Ese mismo orden está comentado al inicio de `home-dell.html`.

---

## Antes de publicar un cambio

1. Abre la página con Live Server.  
2. Prueba el menú en celular (botón de tres líneas).  
3. Prueba Contáctanos (debe abrir la ventana).  
4. Revisa que el aviso de privacidad del pie abra bien.  
5. Mira escritorio y celular.
