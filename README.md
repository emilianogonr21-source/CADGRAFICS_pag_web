# Cadgrafics — sitio web

Sitio de Cadgrafics: inicio y páginas por marca (Adobe, Autodesk, SketchUp, HP, Dell).

## Empieza aquí

La guía del equipo (dónde está cada cosa y qué archivo editar) está en:

**[docs/README.md](docs/README.md)**

Guía corta de ejemplo (Dell): **[docs/guia-dell.md](docs/guia-dell.md)**

## Estructura (resumen)

| Qué | Dónde |
|-----|--------|
| Páginas por marca | `pages/{marca}/` |
| Páginas legales | `pages/legal/` |
| CSS / JS | `assets/css/{marca}/` y `assets/js/{marca}/` |
| Logo y favicon | `assets/images/brand/` |
| Fotos por página | `assets/images/{marca}/{página}/` |
| Videos | `assets/video/{marca}/{página}/` (espejo de `pages/`) |
| Modelos menú / WhatsApp | `shared/partials/` |
| Utilidades | `tools/` |
| SEO | `robots.txt`, `sitemap.xml` (raíz) |

## En una frase

- **HTML** = textos e imágenes  
- **CSS** = cómo se ve  
- **JS** = qué pasa al hacer clic  

Detalle y tablas de archivos: [docs/README.md](docs/README.md).

Al publicar, sube también `robots.txt` y `sitemap.xml` (van en la raíz del dominio).
