# Sitio web Cadgrafics

Guía sencilla para el equipo. Aquí encontrarás cómo está armado el sitio, dónde va cada cosa y cómo trabajar sin romper lo que ya funciona.

---

## ¿Qué es este proyecto?

Es el sitio de Cadgrafics: la página de inicio y las páginas de cada marca (Adobe, Autodesk, SketchUp/Chaos, HP y Dell).

No es una app complicada: son páginas web normales. Alguien abre una página, ve el contenido y puede pedir información con el formulario o el botón **Contáctanos**.

---

## Mapa rápido de carpetas

```
CADGRAFICS_pag_web/
│
├── index.html                 ← Página de inicio (Cadgrafics)
├── aviso-privacidad.html      ← Aviso de privacidad (siempre con guion)
├── README.md                  ← Esta guía
├── docs/                      ← Guías cortas por marca / tema
├── tools/                     ← Scripts de apoyo (renombrar, sync chrome)
├── shared/partials/           ← Fuente de verdad del menú / WhatsApp / cookies
│
├── pages/                     ← Páginas de cada marca
│   ├── adobe/
│   ├── autodesk/
│   ├── chaos/
│   ├── dell/
│   └── hp/
│
└── assets/                    ← Todo lo visual y de comportamiento
    ├── images/                ← Fotos, logos e ilustraciones
    ├── video/                 ← Videos
    ├── css/
    │   ├── shared/base.css    ← Tokens + cookies (cargar ANTES del CSS de página)
    │   └── …una carpeta por marca…
    └── js/
        ├── shared/site-common.js  ← Menú, leads (API + WhatsApp), modal, cookies
        └── …una carpeta por marca…
```

### En palabras simples

| Carpeta | Para qué sirve |
|--------|----------------|
| `pages/` | Una carpeta por marca. Ahí viven las páginas de esa marca. |
| `assets/images/` | Imágenes. Cada marca o producto tiene su subcarpeta. |
| `assets/video/` | Videos del sitio. |
| `assets/css/` | Archivos de apariencia (colores, tamaños, diseño). |
| `assets/js/` | Archivos de comportamiento (menú móvil, ventanas emergentes, formularios). |

---

## Páginas del sitio

| Página | Archivo |
|--------|---------|
| Inicio Cadgrafics | `index.html` |
| Aviso de privacidad | `aviso-privacidad.html` |
| Adobe (inicio) | `pages/adobe/home-adobe.html` |
| Creative Cloud | `pages/adobe/creative-cloud.html` |
| Acrobat Studio | `pages/adobe/acrobat-studio.html` |
| Autodesk (inicio) | `pages/autodesk/home-autodesk.html` |
| AEC Collection | `pages/autodesk/aec-collection.html` |
| SketchUp (Chaos) | `pages/chaos/home-chaos.html` |
| Dell | `pages/dell/home-dell.html` |
| HP | `pages/hp/home-hp.html` |

---

## Cómo están organizados estilos y comportamiento

Cada página tiene **tres piezas** (mismo criterio en todo el sitio):

| Qué | Dónde |
|-----|--------|
| Contenido (textos, botones, estructura) | archivo `.html` |
| Apariencia (colores, espaciados, menú) | `assets/css/...` |
| Comportamiento (menú, formularios, animaciones) | `assets/js/...` |

**Idea:** el HTML describe qué hay; el CSS define cómo se ve; el JS define qué pasa al hacer clic.

### Tabla de archivos por página

| Página | HTML | CSS | JS |
|--------|------|-----|-----|
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

Guía corta de Dell: [`docs/guia-dell.md`](docs/guia-dell.md).

Si cambias un texto → HTML.  
Si cambias un color o espacio → CSS.  
Si el menú o Contáctanos dejan de funcionar → JS.

---

## Reglas de nombres (para que todos usemos el mismo criterio)

1. **Minúsculas** en nombres de archivos y carpetas (`home-chaos.html`, no `home-Chaos.html`).
2. **Guion medio** entre palabras (`home-dell`, `acrobat-studio`, `aviso-privacidad`).
3. **Sin acentos ni espacios** en nombres de archivos (`caso-exito-1.png`, no `caso_éxito 1.png`).
4. El aviso de privacidad siempre se llama **`aviso-privacidad.html`** (con guion).
5. Logo compartido: `assets/images/logo_cadgrafics.png`.

### Cómo nombrar cosas nuevas

| Tipo | Ejemplo bueno |
|------|----------------|
| Página de marca | `home-nombre.html` |
| Página de producto | `nombre-del-producto.html` |
| Carpeta de imágenes de una página | `assets/images/images_home-marca/` |
| Estilos de una página | `assets/css/marca/home-marca.css` |
| Comportamiento de una página | `assets/js/marca/home-marca.js` |

---

## Piezas que se repiten en casi todas las páginas

### Menú superior (header)
Logo Cadgrafics, marcas, Soluciones Claves, Casos y **Contáctanos**.

### Contáctanos
En varias páginas abre una ventana emergente con un formulario corto. En Dell ya está separado y documentado en su archivo JS.

### Pie de página (footer)
Direcciones, correos, WhatsApp, redes y enlace al aviso de privacidad.

### WhatsApp flotante
Botón verde fijo para escribir por WhatsApp.

---

## Cómo ver el sitio en tu computadora

1. Abre la carpeta del proyecto en Cursor / VS Code.
2. Usa **Live Server** (en este proyecto suele usarse el puerto **5501**).
3. Abre `index.html` y navega a las marcas desde el menú.

Si abres un archivo HTML directo desde el explorador de Windows, algunos videos o rutas pueden fallar. Mejor usar Live Server.

---

## Cómo agregar o editar contenido con cuidado

1. **Identifica la página** en la tabla de arriba.
2. **Edita solo lo necesario** (un texto, una imagen, un botón).
3. **Si cambias el nombre de un archivo**, actualiza también todos los enlaces que lo usan (menús de otras páginas, pie de página, etc.).
4. **Prueba** la página en escritorio y en celular.
5. **Revisa el menú de marcas** en inicio y en otras páginas: debe seguir funcionando.

### Si vas a crear una página nueva

1. Crea el HTML en `pages/marca/`.
2. Crea `assets/css/marca/nombre.css` y `assets/js/marca/nombre.js`.
3. Enlázalos desde el HTML (como Dell u otras páginas ya hechas).
4. No dejes estilos ni comportamiento grandes dentro del HTML.

---

## Problemas frecuentes y cómo evitarlos

| Problema | Qué hacer |
|----------|-----------|
| El aviso de privacidad no abre | Usa siempre `aviso-privacidad.html` (con guion). Desde una marca: `../../aviso-privacidad.html`. Desde el inicio: `aviso-privacidad.html`. |
| Una imagen no se ve | Revisa que la ruta apunte a `assets/images/...` y que el nombre del archivo coincida exactamente. |
| El menú de SketchUp no abre | El archivo correcto es `pages/chaos/home-chaos.html` (todo en minúsculas). |
| Cambié un nombre y “se rompió todo” | Busca el nombre viejo en el proyecto y actualízalo en todos los menús. |

---

## Piezas compartidas (no rompen el look de cada marca)

| Archivo | Qué hace |
|---------|----------|
| `assets/css/shared/base.css` | Tokens Cadgrafics + estilos del aviso de cookies |
| `assets/js/shared/site-common.js` | Menú, anclas, modal estándar, cookies y **leads** |
| `shared/partials/` | Plantillas del header / WhatsApp / cookies |

**Leads:** cada formulario intenta `POST /api/leads` (si el servidor lo tiene) y **siempre** abre WhatsApp con los datos, para que el contacto no se pierda en hosting estático.

**SEO:** `assets/images/favicon.png`, `og-image.jpg` y `hero-poster.jpg` ya están en el repo.

**Nombres:** carpetas de imágenes del home → `images_home-cadgrafics/`; casos → `caso-exito-*.png`; videos → `videos-*-kebab/`.

## Qué falta ordenar más adelante (sin prisa)

- Propagar cambios del menú desde `shared/partials/header.html` a todas las páginas (el CTA Contáctanos aún varía por marca).
- Crear carpeta de imágenes propia para Chaos cuando dejen de usarse fotos externas.
- Unificar IDs de modals Adobe/AEC al contrato `#formModal` + `#leadForm` cuando el equipo lo priorice.

---

## Contacto interno

Si algo no cuadra con esta guía, pregunta al responsable del sitio antes de renombrar carpetas grandes. Renombrar sin actualizar enlaces es la causa más común de páginas rotas.
