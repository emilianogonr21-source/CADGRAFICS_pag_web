# Sitio web Cadgrafics

Guía para el equipo. Aquí se explica **dónde está cada cosa** y **qué archivo tocar** según lo que quieras cambiar. Sin rodeos.

---

## ¿Qué es este proyecto?

Es el sitio de Cadgrafics: la página de inicio y una página (o varias) por marca: Adobe, Autodesk, SketchUp, HP y Dell.

Cada página es un archivo que se abre en el navegador. El visitante lee el contenido y puede pedir información con el formulario o con el botón **Contáctanos**.

---

## La regla de oro (léela primero)

Cada página se arma con **tres archivos**:

| Si quieres cambiar… | Abre este tipo de archivo |
|---------------------|---------------------------|
| Textos, botones, orden de secciones, imágenes que se ven | el archivo **HTML** (la página) |
| Colores, tamaños, espacios, cómo se ve en celular | el archivo **CSS** (la apariencia) |
| Qué pasa al hacer clic, menú móvil, formularios | el archivo **JS** (el comportamiento) |

**Ejemplo:**  
Cambiar el título de Dell → HTML.  
Hacer el azul más oscuro → CSS.  
Contáctanos no abre la ventana → JS.

No mezcles todo en un solo archivo: así el siguiente del equipo encuentra rápido lo que busca.

---

## Mapa de carpetas

```
CADGRAFICS_pag_web/
│
├── index.html              ← Inicio Cadgrafics
├── aviso-privacidad.html   ← Aviso de privacidad (siempre con guion)
├── robots.txt              ← Qué pueden indexar los buscadores
├── sitemap.xml             ← Lista de páginas para Google y otros
├── docs/                   ← Estas guías
├── tools/                  ← Ayudas para actualizar menú / WhatsApp
├── shared/partials/        ← Modelos del menú, WhatsApp y cookies
│
├── pages/                  ← Una carpeta por marca
│   ├── adobe/
│   ├── autodesk/
│   ├── chaos/              ← SketchUp vive aquí
│   ├── dell/
│   └── hp/
│
└── assets/                 ← Imágenes, videos, apariencia y comportamientos
    ├── images/
    ├── video/
    ├── css/
    └── js/
```

| Carpeta | Para qué |
|---------|----------|
| `pages/` | Páginas de cada marca |
| `assets/images/` | Fotos, logos e ilustraciones |
| `assets/video/` | Videos |
| `assets/css/` | Cómo se ve cada página |
| `assets/js/` | Qué hace cada página al interactuar |
| `shared/partials/` | Modelos del menú / WhatsApp / cookies (ver abajo) |
| `docs/` | Guías del equipo |
| `robots.txt` | Indica a Google qué puede indexar |
| `sitemap.xml` | Lista de páginas públicas del sitio |

---

## Lista de páginas

| Qué ves en el sitio | Archivo |
|---------------------|---------|
| Inicio Cadgrafics | `index.html` |
| Aviso de privacidad | `aviso-privacidad.html` |
| Adobe (inicio) | `pages/adobe/home-adobe.html` |
| Creative Cloud | `pages/adobe/creative-cloud.html` |
| Acrobat Studio | `pages/adobe/acrobat-studio.html` |
| Autodesk (inicio) | `pages/autodesk/home-autodesk.html` |
| AEC Collection | `pages/autodesk/aec-collection.html` |
| SketchUp | `pages/chaos/home-chaos.html` |
| Dell | `pages/dell/home-dell.html` |
| HP | `pages/hp/home-hp.html` |

### Tres archivos por página

| Página | Contenido | Apariencia | Comportamiento |
|--------|-----------|------------|----------------|
| Inicio | `index.html` | `assets/css/index/index.css` | `assets/js/index/index.js` |
| Aviso de privacidad | `aviso-privacidad.html` | `assets/css/aviso-privacidad/aviso-privacidad.css` | `assets/js/aviso-privacidad/aviso-privacidad.js` |
| Adobe | `pages/adobe/home-adobe.html` | `assets/css/adobe/home-adobe.css` | `assets/js/adobe/home-adobe.js` |
| Creative Cloud | `pages/adobe/creative-cloud.html` | `assets/css/adobe/creative-cloud.css` | `assets/js/adobe/creative-cloud.js` |
| Acrobat Studio | `pages/adobe/acrobat-studio.html` | `assets/css/adobe/acrobat-studio.css` | `assets/js/adobe/acrobat-studio.js` |
| Autodesk | `pages/autodesk/home-autodesk.html` | `assets/css/autodesk/home-autodesk.css` | `assets/js/autodesk/home-autodesk.js` |
| AEC Collection | `pages/autodesk/aec-collection.html` | `assets/css/autodesk/aec-collection.css` | `assets/js/autodesk/aec-collection.js` |
| SketchUp | `pages/chaos/home-chaos.html` | `assets/css/chaos/home-chaos.css` | `assets/js/chaos/home-chaos.js` |
| Dell | `pages/dell/home-dell.html` | `assets/css/dell/home-dell.css` | `assets/js/dell/home-dell.js` |
| HP | `pages/hp/home-hp.html` | `assets/css/hp/home-hp.css` | `assets/js/hp/home-hp.js` |

Guía corta de ejemplo (Dell): [guia-dell.md](guia-dell.md).

---

## Cómo nombrar archivos (mismo criterio para todos)

1. Todo en **minúsculas**: `home-chaos.html`, no `home-Chaos.html`.
2. Separar palabras con **guion medio**: `home-dell`, `aviso-privacidad`.
3. **Sin acentos ni espacios** en nombres de archivos.
4. El aviso de privacidad siempre se llama **`aviso-privacidad.html`**.
5. Logo del sitio: `assets/images/logo_cadgrafics.png`.

| Si creas… | Ejemplo bueno |
|-----------|----------------|
| Página de marca | `home-nombre.html` |
| Página de producto | `nombre-del-producto.html` |
| Carpeta de fotos de esa página | `assets/images/images-home-marca/` |
| Apariencia | `assets/css/marca/home-marca.css` |
| Comportamiento | `assets/js/marca/home-marca.js` |

---

## Piezas que se repiten en casi todas las páginas

### Menú de arriba
Logo Cadgrafics, marcas, Soluciones Claves, Casos y **Contáctanos**.

### Contáctanos
En muchas páginas abre una **ventana encima del contenido** con un formulario corto.  
Al enviar, el sitio intenta guardar el dato y **siempre abre WhatsApp** con el mensaje listo, para no perder el contacto.

### Pie de página
Direcciones, correos, WhatsApp, redes y enlace al aviso de privacidad.

### Botón verde de WhatsApp
Queda fijo en la esquina para escribir por WhatsApp.

### Aviso de cookies
La barrita que aparece la primera vez que alguien visita el sitio.

---

## Piezas compartidas (afectan a varias páginas)

Hay archivos que **no son de una sola marca**. Sirven para que el menú, Contáctanos y las cookies funcionen igual en todo el sitio:

| Archivo | Qué hace (en simple) |
|---------|----------------------|
| `assets/css/shared/base.css` | Colores base Cadgrafics + aspecto del aviso de cookies |
| `assets/js/shared/site-common.js` | Menú, ventanas de contacto, cookies y envío a WhatsApp |
| `shared/partials/` | Modelos del menú, WhatsApp y cookies |

**Importante:** cada página ya trae su menú “pegado” dentro del HTML. Si cambias un teléfono o un ítem del menú:

1. Actualiza el modelo en `shared/partials/`.
2. Copia el cambio a las páginas (o usa la ayuda en `tools/`).
3. Prueba al menos inicio, Dell y Adobe (menú en celular + Contáctanos).

Más detalle: [shared/partials/README.md](../shared/partials/README.md).

---

## Cómo ver el sitio en tu computadora

1. Abre la carpeta del proyecto en Cursor o VS Code.
2. Usa **Live Server** (en este proyecto suele usarse el puerto **5501**).
3. Abre `index.html` y navega a las marcas desde el menú.

Si abres el HTML directo desde el Explorador de Windows, a veces fallan videos o rutas. Mejor Live Server.

---

## Tareas del día a día

### Cambiar un texto o un botón
1. Localiza la página en la tabla de arriba.
2. Abre el HTML.
3. Busca el texto (Ctrl+F) y cámbialo.
4. Guarda y revisa en el navegador.

### Cambiar una imagen
1. Pon la imagen nueva en la carpeta de esa página (por ejemplo `assets/images/images-home-dell/`).
2. En el HTML, asegúrate de que el nombre del archivo coincida **exactamente** (mayúsculas/minúsculas importan).

### Cambiar un color o el espacio entre secciones
Abre el CSS de esa página. Al inicio del archivo suele haber una lista de bloques para orientarte.

### Contáctanos o el menú dejaron de funcionar
Revisa el JS de esa página y que también se cargue `assets/js/shared/site-common.js` (en Dell y otras ya está así).

### Crear una página nueva
1. HTML en `pages/marca/`.
2. CSS en `assets/css/marca/`.
3. JS en `assets/js/marca/`.
4. Enlázalos desde el HTML (copia el patrón de Dell u otra página lista).
5. No dejes estilos ni comportamientos grandes dentro del HTML.

---

## Problemas frecuentes

| Problema | Qué revisar |
|----------|-------------|
| El aviso de privacidad no abre | El archivo se llama `aviso-privacidad.html` (con guion). Desde una marca la ruta es `../../aviso-privacidad.html`. Desde el inicio: `aviso-privacidad.html`. |
| Una imagen no se ve | La ruta y el nombre del archivo deben coincidir exactamente. |
| SketchUp no abre desde el menú | El archivo correcto es `pages/chaos/home-chaos.html` (todo en minúsculas). |
| Cambié un nombre y “se rompió todo” | Busca el nombre viejo en el proyecto y actualízalo en todos los menús. |
| En celular el menú no se abre | Prueba el botón de tres líneas; si falla, el comportamiento está en el JS (compartido o de la página). |

---

## Antes de dar por terminado un cambio

1. Abre la página con Live Server.
2. Prueba el menú en celular (botón de tres líneas).
3. Prueba Contáctanos (debe abrir la ventana).
4. Revisa que el aviso de privacidad del pie abra bien.
5. Mira la página en escritorio y en celular.

---

## Pendientes del sitio (sin prisa)

- Unificar el menú en todas las páginas cuando cambie algo en `shared/partials/`.
- Carpeta de imágenes propia para SketchUp/Chaos (hoy aún pueden usarse fotos externas).
- Fotos de producto propias para Dell (hoy varias secciones reutilizan `hero-laptop.png`).
- Alinear ventanas de contacto de Adobe/AEC con el mismo patrón que inicio y Dell.

---

## Contacto interno

Si algo no cuadra con esta guía, pregunta al responsable del sitio **antes** de renombrar carpetas grandes. Renombrar sin actualizar enlaces es la causa más común de páginas rotas.
