# Guía del sitio Cadgrafics

Documento para **cualquier persona del equipo**: marketing, ventas, diseño o desarrollo.  
Objetivo: que sepas **dónde está cada cosa** y **qué archivo tocar** sin romper el resto del sitio.

---

## Índice

1. [¿Qué es este proyecto?](#qué-es-este-proyecto)
2. [Primeros 10 minutos](#primeros-10-minutos)
3. [La regla de oro (HTML, CSS, JS)](#la-regla-de-oro-html-css-js)
4. [Mapa de carpetas](#mapa-de-carpetas)
5. [Lista de páginas y sus 3 archivos](#lista-de-páginas-y-sus-3-archivos)
6. [Contáctanos, menú y WhatsApp](#contáctanos-menú-y-whatsapp)
7. [Rutas: por qué a veces “no se ve” una imagen](#rutas-por-qué-a-veces-no-se-ve-una-imagen)
8. [Cómo nombrar archivos](#cómo-nombrar-archivos)
9. [Tareas del día a día](#tareas-del-día-a-día)
10. [Crear una página nueva](#crear-una-página-nueva)
11. [Publicar el sitio](#publicar-el-sitio)
12. [Problemas frecuentes](#problemas-frecuentes)
13. [Checklist antes de dar por terminado](#checklist-antes-de-dar-por-terminado)
14. [Glosario](#glosario)
15. [Pendientes de contenido](#pendientes-de-contenido)
16. [Contacto interno](#contacto-interno)

Guía de ejemplo (Dell): [guia-dell.md](guia-dell.md).

---

## ¿Qué es este proyecto?

Es el sitio público de **Cadgrafics** ([cadgrafics.com.mx](https://cadgrafics.com.mx)):

- Una **página de inicio** (`index.html`)
- Páginas por **marca / solución**: Adobe, Autodesk, SketchUp, HP y Dell
- Un **aviso de privacidad**

Es un sitio **estático**: son archivos HTML, CSS, JS, imágenes y videos. No hay base de datos ni instalación compleja.  
El visitante lee el contenido y puede pedir información con **Contáctanos** o el botón verde de **WhatsApp**.

| Marca en el menú | Carpeta en el proyecto | Nota |
|------------------|------------------------|------|
| Adobe | `pages/adobe/` | Tiene 3 páginas (inicio, Creative Cloud, Acrobat Studio) |
| Autodesk | `pages/autodesk/` | Inicio + AEC Collection |
| SketchUp | `pages/chaos/` | La carpeta se llama `chaos` (proveedor); en el menú dice SketchUp |
| Dell | `pages/dell/` | |
| HP | `pages/hp/` | |

---

## Primeros 10 minutos

1. Abre esta carpeta del proyecto en **Cursor** o **VS Code**.
2. Instala / usa la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server** (en este proyecto suele usarse el puerto **5501**).
4. Navega desde el menú a Dell, Adobe, etc.
5. Cuando quieras editar algo, usa la [tabla de páginas](#lista-de-páginas-y-sus-3-archivos) para saber qué archivo abrir.

**Importante:** no abras el HTML con doble clic desde el Explorador de Windows si puedes evitarlo. Con Live Server las rutas y los videos funcionan mejor.

---

## La regla de oro (HTML, CSS, JS)

Cada página “viva” se arma con **tres archivos** (más imágenes/videos):

| Si quieres cambiar… | Abre | Extensión típica |
|---------------------|------|------------------|
| Textos, botones, orden de secciones, qué imagen se muestra | el **HTML** | `.html` |
| Colores, tamaños, espacios, cómo se ve en celular | el **CSS** | `.css` |
| Qué pasa al hacer clic, menú móvil, formularios | el **JS** | `.js` |

**Ejemplos concretos**

| Quiero… | Archivo |
|---------|---------|
| Cambiar el título de Dell | `pages/dell/home-dell.html` |
| Hacer el azul de Dell más oscuro | `assets/css/dell/home-dell.css` |
| Contáctanos no abre la ventana | Revisar `assets/js/shared/site-common.js` y el JS de esa página |

No mezcles estilos grandes ni lógica larga dentro del HTML: así el siguiente del equipo encuentra rápido lo que busca.

---

## Mapa de carpetas

```
CADGRAFICS_pag_web/
│
├── index.html              ← Inicio Cadgrafics (raíz del sitio)
├── robots.txt              ← Instrucciones para Google y otros buscadores
├── sitemap.xml             ← Lista de URLs públicas
├── README.md               ← Puerta de entrada corta
├── .gitignore
│
├── docs/                   ← Estas guías (no se indexan en Google)
├── tools/                  ← Scripts internos de mantenimiento (no se publican como páginas)
├── shared/partials/        ← Modelos del menú y del botón WhatsApp
│
├── pages/                  ← Páginas HTML del sitio
│   ├── legal/              ← Aviso de privacidad
│   ├── adobe/
│   ├── autodesk/
│   ├── chaos/              ← SketchUp
│   ├── dell/
│   └── hp/
│
└── assets/                 ← Recursos
    ├── images/
    │   ├── brand/          ← Logo, favicon, imagen para redes (todo el sitio)
    │   ├── index/          ← Fotos del inicio
    │   ├── adobe/          ← home / acrobat-studio / creative-cloud
    │   ├── autodesk/       ← home / aec-collection
    │   ├── chaos/home/
    │   ├── dell/home/
    │   └── hp/home/
    ├── video/              ← Misma lógica que images (espejo por marca/página)
    ├── css/                ← shared + cada marca + index + legal
    └── js/                 ← shared + cada marca + index (legal no usa JS)
```

### Idea clave: el “espejo”

Si existe `pages/dell/home-dell.html`, lo normal es que existan:

- `assets/css/dell/home-dell.css`
- `assets/js/dell/home-dell.js`
- `assets/images/dell/home/`
- `assets/video/dell/home/` (aunque esté vacío, con un `.gitkeep` para guardar la carpeta en Git)

Así siempre sabes dónde poner una foto nueva: **misma marca, misma página**.

| Carpeta | Para qué |
|---------|----------|
| `pages/` | Contenido HTML de cada marca |
| `assets/images/brand/` | Logo, favicon y preview para redes |
| `assets/images/{marca}/` | Fotos de esa marca (subcarpeta por página) |
| `assets/video/` | Videos (misma estructura que imágenes) |
| `assets/css/` | Apariencia |
| `assets/js/` | Comportamiento |
| `assets/css/shared/` y `assets/js/shared/` | Cosas comunes a casi todas las páginas |
| `shared/partials/` | Modelos del menú / WhatsApp (ver [README de partials](../shared/partials/README.md)) |
| `docs/` | Guías del equipo |
| `tools/` | Utilidades internas ([README](../tools/README.md)) |
| `robots.txt` / `sitemap.xml` | SEO |

---

## Lista de páginas y sus 3 archivos

| Qué ves en el sitio | Archivo HTML |
|---------------------|--------------|
| Inicio Cadgrafics | `index.html` |
| Aviso de privacidad | `pages/legal/aviso-privacidad.html` |
| Adobe (inicio) | `pages/adobe/home-adobe.html` |
| Creative Cloud | `pages/adobe/creative-cloud.html` |
| Acrobat Studio | `pages/adobe/acrobat-studio.html` |
| Autodesk (inicio) | `pages/autodesk/home-autodesk.html` |
| AEC Collection | `pages/autodesk/aec-collection.html` |
| SketchUp | `pages/chaos/home-chaos.html` |
| Dell | `pages/dell/home-dell.html` |
| HP | `pages/hp/home-hp.html` |

### Tres archivos por página

| Página | Contenido (HTML) | Apariencia (CSS) | Comportamiento (JS) |
|--------|------------------|------------------|---------------------|
| Inicio | `index.html` | `assets/css/index/index.css` | `assets/js/index/index.js` |
| Aviso de privacidad | `pages/legal/aviso-privacidad.html` | `assets/css/legal/aviso-privacidad.css` | — (página estática, sin JS) |
| Adobe | `pages/adobe/home-adobe.html` | `assets/css/adobe/home-adobe.css` | `assets/js/adobe/home-adobe.js` |
| Creative Cloud | `pages/adobe/creative-cloud.html` | `assets/css/adobe/creative-cloud.css` | `assets/js/adobe/creative-cloud.js` |
| Acrobat Studio | `pages/adobe/acrobat-studio.html` | `assets/css/adobe/acrobat-studio.css` | `assets/js/adobe/acrobat-studio.js` |
| Autodesk | `pages/autodesk/home-autodesk.html` | `assets/css/autodesk/home-autodesk.css` | `assets/js/autodesk/home-autodesk.js` |
| AEC Collection | `pages/autodesk/aec-collection.html` | `assets/css/autodesk/aec-collection.css` | `assets/js/autodesk/aec-collection.js` |
| SketchUp | `pages/chaos/home-chaos.html` | `assets/css/chaos/home-chaos.css` | `assets/js/chaos/home-chaos.js` |
| Dell | `pages/dell/home-dell.html` | `assets/css/dell/home-dell.css` | `assets/js/dell/home-dell.js` |
| HP | `pages/hp/home-hp.html` | `assets/css/hp/home-hp.css` | `assets/js/hp/home-hp.js` |

Además, casi todas cargan:

1. `assets/css/shared/base.css` — colores base Cadgrafics y menú compartido  
2. `assets/js/shared/site-common.js` — menú móvil, Contáctanos y WhatsApp  

Orden típico en el HTML (como en Dell): primero lo **compartido**, luego lo **de la marca**.

---

## Contáctanos, menú y WhatsApp

### Qué ve el visitante

| Pieza | Qué es |
|-------|--------|
| Menú de arriba | Logo, marcas, Soluciones Claves, Casos, **Contáctanos** |
| Contáctanos | Abre una **ventana encima de la página** (modal) con un formulario corto |
| Formulario largo (en algunas páginas) | Bloque de contacto dentro del contenido |
| Pie de página | Direcciones, correos, redes, aviso de privacidad |
| Botón verde WhatsApp | Fijo en una esquina |

Al enviar Contáctanos (o el formulario de la página), el sitio **abre WhatsApp** con el mensaje listo. Ese es el canal real del lead.

Opcionalmente intenta un `POST /api/leads` (útil si más adelante hay backend). En hosting estático ese endpoint no existe: el fallo es esperado y **no bloquea** WhatsApp.

### Patrón técnico (igual en todo el sitio)

Para que Contáctanos funcione igual en inicio, Adobe, Autodesk, AEC, Dell, HP y Chaos:

| Pieza | Identificador / archivo |
|-------|-------------------------|
| Enlace del menú | clase `textbutton-trigger` |
| Ventana | `#formModal` |
| Formulario corto | `#leadForm` |
| Lógica compartida | `assets/js/shared/site-common.js` |

Si copias una página nueva, **copia también** ese bloque de modal del HTML de Dell o del inicio, y asegúrate de cargar `site-common.js`.

### Modelos en `shared/partials/`

El menú y el WhatsApp **no se insertan solos** en las páginas: cada HTML lleva su propia copia.  
`shared/partials/` guarda el **modelo oficial**. No uses `fetch`/includes en runtime: edita el modelo y sincroniza.

Si cambias un teléfono o un ítem del menú:

1. Edita el modelo en `shared/partials/header.html`.
2. Ejecuta `powershell -ExecutionPolicy Bypass -File tools/sync-header.ps1` para copiarlo a todas las páginas.
3. Prueba al menos: inicio, Dell y Adobe (menú en celular + Contáctanos).

Detalle: [shared/partials/README.md](../shared/partials/README.md).

---

## Rutas: por qué a veces “no se ve” una imagen

Las rutas son **relativas** a dónde está el HTML:

| Estás en… | Para llegar a `assets/...` usas |
|-----------|----------------------------------|
| `index.html` (raíz) | `assets/images/...` |
| `pages/dell/home-dell.html` | `../../assets/images/...` |
| `pages/legal/aviso-privacidad.html` | `../../assets/images/...` |

Ejemplos:

- Desde el inicio → aviso: `pages/legal/aviso-privacidad.html`
- Desde Dell → aviso: `../legal/aviso-privacidad.html`

Si renombras un archivo y no actualizas **todas** las rutas que lo mencionan, “se rompe” la página.

---

## Cómo nombrar archivos

1. Todo en **minúsculas**: `home-chaos.html`, no `home-Chaos.html`.
2. Separar palabras con **guion medio**: `home-dell`, `aviso-privacidad`.
3. **Sin acentos ni espacios** en nombres de archivos.
4. Aviso de privacidad: siempre `pages/legal/aviso-privacidad.html`.
5. Logo del sitio: `assets/images/brand/logo_cadgrafics.png`.

| Si creas… | Ejemplo bueno |
|-----------|----------------|
| Página de marca | `pages/marca/home-marca.html` |
| Página de producto | `pages/marca/nombre-producto.html` |
| Fotos de inicio de marca | `assets/images/marca/home/` |
| Fotos de un producto | `assets/images/marca/nombre-producto/` |
| Video de esa página | `assets/video/marca/home/` (o el nombre del producto) |
| Apariencia | `assets/css/marca/home-marca.css` |
| Comportamiento | `assets/js/marca/home-marca.js` |

Las carpetas vacías (por ejemplo videos aún no disponibles) pueden llevar un archivo `.gitkeep` para que Git conserve la carpeta.

---

## Tareas del día a día

### Cambiar un texto o un botón

1. Localiza la página en la [tabla](#lista-de-páginas-y-sus-3-archivos).
2. Abre el HTML.
3. Busca el texto (Ctrl+F) y cámbialo.
4. Guarda y revisa en el navegador con Live Server.

### Cambiar una imagen

1. Pon la imagen nueva en la carpeta de esa página (ej. `assets/images/dell/home/`).
2. En el HTML, el nombre del archivo debe coincidir **exactamente** (mayúsculas/minúsculas importan en el servidor).

### Cambiar un color o el espacio entre secciones

Abre el CSS de esa página. Al inicio del archivo suele haber una lista de bloques para orientarte.

### Contáctanos o el menú dejaron de funcionar

1. Confirma que el HTML carga `assets/js/shared/site-common.js`.
2. Confirma que existe `#formModal`, `#leadForm` y un enlace con clase `textbutton-trigger`.
3. Revisa el JS de la página por si hay un error que detenga el resto del script.

### Cambiar el logo de todo el sitio

Sustituye (con el mismo nombre) el archivo en `assets/images/brand/`. Si cambias el nombre del archivo, tendrás que actualizar todas las páginas.

---

## Crear una página nueva

1. HTML en `pages/marca/`.
2. CSS en `assets/css/marca/`.
3. JS en `assets/js/marca/`.
4. Carpetas de fotos/videos: `assets/images/marca/nombre-página/` y `assets/video/marca/nombre-página/`.
5. Enlaza CSS/JS desde el HTML (copia el patrón de Dell u otra página lista).
6. Incluye menú, pie, WhatsApp y modal Contáctanos como en las páginas existentes.
7. Agrega la URL a `sitemap.xml`.
8. Actualiza los menús de las demás páginas si la página debe aparecer allí.
9. Prueba con el [checklist](#checklist-antes-de-dar-por-terminado).

---

## Publicar el sitio

1. Sube al servidor la misma estructura de carpetas (raíz con `index.html`).
2. Incluye en la raíz: `robots.txt` y `sitemap.xml`.
3. No hace falta publicar `docs/`, `tools/` ni `shared/` como contenido útil para el visitante (además, `robots.txt` ya pide a los buscadores no indexar esas carpetas). Sí puedes subirlas si tu flujo de despliegue copia todo el repo; no afectan al visitante.
4. Después de publicar, abre en el celular real (o modo responsive) y prueba Contáctanos + WhatsApp.
5. Si cambiaste URLs o agregaste páginas, actualiza `sitemap.xml` (fecha `lastmod`) antes de subir.

Dominio de referencia en los archivos: `https://cadgrafics.com.mx/`.

---

## Problemas frecuentes

| Problema | Qué revisar |
|----------|-------------|
| El aviso de privacidad no abre | Ruta correcta según dónde estés (ver [Rutas](#rutas-por-qué-a-veces-no-se-ve-una-imagen)). |
| Una imagen no se ve | Nombre exacto + carpeta correcta + `../../assets/...` desde `pages/`. |
| SketchUp no abre desde el menú | El archivo es `pages/chaos/home-chaos.html` (carpeta `chaos`, minúsculas). |
| Cambié un nombre y “se rompió todo” | Busca el nombre viejo en todo el proyecto y actualízalo (menús, CSS, JS, sitemap). |
| En celular el menú no se abre | Botón de tres líneas; lógica en `site-common.js` / JS de la página. |
| Contáctanos no abre | Clase `textbutton-trigger`, `#formModal`, `#leadForm` y `site-common.js`. |
| Videos no cargan al abrir el archivo local | Usa Live Server. |

---

## Checklist antes de dar por terminado

1. Abrir la página con Live Server.
2. Probar el menú en vista de celular (botón de tres líneas).
3. Probar Contáctanos (debe abrir la ventana).
4. Enviar el formulario de prueba y confirmar que abre WhatsApp.
5. Abrir el aviso de privacidad desde el pie.
6. Revisar escritorio y celular (textos cortados, imágenes rotas, botones).
7. Si agregaste una página pública: actualizar `sitemap.xml`.

---

## Glosario

| Palabra | Significado aquí |
|---------|------------------|
| **HTML** | Archivo de la página: textos, estructura, enlaces a imágenes |
| **CSS** | Archivo de apariencia: colores, tipografía, layout |
| **JS / JavaScript** | Archivo de comportamiento: clics, menú, formularios |
| **Asset** | Recurso: imagen, video, CSS o JS |
| **Modal** | Ventana que aparece encima de la página (Contáctanos) |
| **Partial / modelo** | Fragmento HTML de referencia en `shared/partials/` |
| **Hero / portada** | Primera sección grande de la página |
| **Live Server** | Extensión que sirve el sitio en local como un servidor web |
| **SEO** | Cómo encuentran el sitio los buscadores (`robots.txt`, `sitemap.xml`) |
| **`.gitkeep`** | Archivo vacío para que Git guarde una carpeta sin contenido aún |
| **Raíz** | Carpeta principal del proyecto (donde está `index.html`) |

---

## Pendientes de contenido

La **estructura** del proyecto ya está alineada. Lo que sigue es contenido (cuando exista):

- Al cambiar el menú en `shared/partials/header.html`, ejecutar `tools/sync-header.ps1` para propagar el cambio.
- Llenar `assets/images/chaos/home/` con fotos propias de SketchUp.
- Fotos de producto propias para Dell (la portada ya usa `hero-background.jpg`).
- Videos propios en `assets/video/{chaos,dell,hp}/home/` y `assets/video/autodesk/aec-collection/` (las carpetas ya existen).
- Los MP4 publicados ya están optimizados para web (≤1280px, `faststart`). Si agregas videos nuevos, ejecuta `tools/optimize-videos.ps1`.

---

## Contacto interno

Si algo no cuadra con esta guía, pregunta al responsable del sitio **antes** de renombrar carpetas grandes.  
Renombrar sin actualizar enlaces es la causa más común de páginas rotas.

Documentos relacionados:

- [Guía rápida Dell](guia-dell.md)
- [Modelos del menú / WhatsApp](../shared/partials/README.md)
- [Tools](../tools/README.md)
- [README de la raíz](../README.md)
