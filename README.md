# Cadgrafics — sitio web

Sitio estático de Cadgrafics: inicio + páginas por marca (Adobe, Autodesk, SketchUp, HP, Dell).

No hace falta saber programar a fondo para editar textos, imágenes o colores. Sí hace falta saber **qué carpeta abrir**.

## Empieza aquí (elige una)

| Si quieres… | Abre |
|-------------|------|
| Entender el proyecto completo | **[docs/README.md](docs/README.md)** ← guía principal |
| Un ejemplo concreto (Dell) | **[docs/guia-dell.md](docs/guia-dell.md)** |
| Cambiar el menú o WhatsApp | **[shared/partials/README.md](shared/partials/README.md)** |
| Ver el sitio en tu PC | Abre la carpeta en VS Code / Cursor → Live Server → `index.html` (puerto **5501**) |

## En una frase

| Tipo | Pregunta que responde |
|------|------------------------|
| **HTML** | ¿Qué textos, botones e imágenes hay? |
| **CSS** | ¿Cómo se ve (colores, tamaños, celular)? |
| **JS** | ¿Qué pasa al hacer clic o enviar un formulario? |

## Dónde está cada cosa (resumen)

| Qué | Dónde |
|-----|--------|
| Página de inicio | `index.html` (raíz) |
| Páginas por marca | `pages/{marca}/` |
| Aviso de privacidad | `pages/legal/` |
| Apariencia | `assets/css/{marca}/` |
| Comportamiento | `assets/js/{marca}/` |
| Logo y favicon | `assets/images/brand/` |
| Fotos | `assets/images/{marca}/{página}/` |
| Videos | `assets/video/{marca}/{página}/` |
| Menú / WhatsApp (modelos) | `shared/partials/` |
| Guías del equipo | `docs/` |
| Scripts internos | `tools/` (no se publican) |
| SEO | `robots.txt`, `sitemap.xml` |

Al publicar en el servidor, sube también `robots.txt` y `sitemap.xml` en la **raíz del dominio**.

Detalle, tablas de archivos, Contáctanos, publicar y problemas frecuentes: **[docs/README.md](docs/README.md)**.
