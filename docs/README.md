# Guía del sitio Cadgrafics

## Páginas

| Página | Archivo |
|--------|---------|
| Inicio | `index.html` |
| Autodesk | `pages/autodesk/home-autodesk.html` |
| AEC Collection | `pages/autodesk/aec-collection.html` |
| Product Design & Manufacturing | `pages/autodesk/pdm-collection.html` |
| Media & Entertainment | `pages/autodesk/me-collection.html` |
| Programa de Adopción Autodesk | `pages/adopcion_autodesk/adopcion_Autodesk.html` |
| Adobe | `pages/adobe/home-adobe.html` |
| Creative Cloud | `pages/adobe/creative-cloud.html` |
| Acrobat Studio | `pages/adobe/acrobat-studio.html` |
| Microsoft 365 | `pages/microsoft/home-microsoft.html` |
| Chaos | `pages/chaos/home-chaos.html` |
| SketchUp | `pages/sketchup/home-sketchup.html` |
| Dell | `pages/dell/home-dell.html` |
| HP gran formato | `pages/hp/home-hp.html` |
| Mac | `pages/mac/home-mac.html` |
| Aviso de privacidad | `pages/legal/aviso-privacidad.html` |

`pages/autodesk/mfg-collection.html` solo redirige los enlaces viejos (`?coleccion=pdm` o `?coleccion=me`) a las dos páginas nuevas. No lo borres.

## Identidad

- **Rojo Cadgrafics:** Pantone Process 1807 C · CMYK 0/100/96/28 → `#B80007`. Degradado hasta `#660000` (C0 M100 Y100 K60).
- **Negro:** Pantone Process Black · CMYK 0/0/0/100 → `#000000`.
- **Tipografía:** Inter en todo el sitio, con los tamaños de la página de inicio.
- Sobre fondo negro, el rojo solo va en títulos grandes; los textos pequeños van en blanco con una línea o punto rojo.
- Los colores, tamaños y componentes viven en `assets/css/site.css`. **No agregues estilos dentro de las páginas**: usa las clases de ese archivo (ejemplos en `docs/componentes.html`).
- Cada página sigue el orden de módulos de la marca: **Identidad → Impacto → Información → Conversión**.
  - Identidad (rojo 1807 C, quién habla): la etiqueta `eyebrow` o `hero__badge` del hero.
  - Impacto (negro, qué queremos que recuerden): el `hero` y, si hace falta, una banda `section--ink` o `trust` justo después.
  - Información (claro, qué necesitan entender): secciones `section` y `section section--paper` alternadas. No uses `section--ink` a mitad de página, salvo que un logo del fabricante solo exista en blanco.
  - Conversión (rojo profundo, qué queremos que hagan): la banda final `cta-band`.

## Crear o editar una página

1. Copia una página parecida de `pages/` (el menú, el pie, el botón de WhatsApp y los scripts ya vienen listos).
2. Cambia `<title>`, `meta description`, `canonical`, las etiquetas `og:` y `data-page` del `<body>`.
3. Marca la marca activa en el menú con `aria-current="page"`.
4. Deja un solo formulario por página, dentro de `#contacto`. Las opciones del paso 1 (`name="interes"`) deben coincidir con los `data-interest` de los botones de la página.
5. Agrega la página a `sitemap.xml`.

Rutas desde `pages/{carpeta}/{pagina}.html`: assets con `../../assets/…`, inicio con `../../index.html`, otras páginas con `../{carpeta}/{pagina}.html`.

## Formularios

- Se configuran con atributos (`data-lead-form`, `data-sf`, `data-error`, `data-show-if`); la lógica está en `assets/js/site.js`.
- **Hoy (sin CRM, `data-endpoint=""`):** el formulario tiene 2 pasos y al presionar "Enviar por WhatsApp" abre WhatsApp con todos los datos (interés, nombre, empresa, correo, celular, industria y región) dirigido a la oficina según la región: CDMX 55 3112 0508 u Occidente 33 1404 0396. La persona solo presiona Enviar en WhatsApp.
- **Con CRM:** pon la URL del servicio en `data-endpoint` del `<form>`. El formulario vuelve a 3 pasos (el tercero pide datos para calificar: usuarios, plazo, vencimiento de licencias, volumen, etc.) y envía los datos a esa URL.

## Videos

- Los videos sin sonido llevan `data-ambient` y un botón de pausa; solo se reproducen cuando están en pantalla.
- En celular, los videos pesados (`data-desktop-only`) muestran su imagen de espera hasta que la persona da play.
- Para comprimirlos antes de publicar: `tools/optimize-videos.ps1` (ver `tools/README.md`).

## Publicar

Sube `index.html`, `robots.txt`, `sitemap.xml`, `assets/` y `pages/` a la raíz del dominio. Las imágenes de `assets/images/brevo/` se usan en correos de campañas: no las borres del servidor.
