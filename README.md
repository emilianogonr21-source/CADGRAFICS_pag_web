# Cadgrafics — sitio web

Sitio estático de Cadgrafics: inicio + páginas por marca (Autodesk, Adobe, Microsoft, Chaos, SketchUp, Dell, HP, Mac) + aviso de privacidad.

## Empieza aquí

| Si quieres… | Abre |
|-------------|------|
| Entender cómo está hecho el sitio | **[docs/README.md](docs/README.md)** |
| Ver todos los componentes con ejemplos | `docs/componentes.html` (con Live Server) |
| Ver el sitio en tu PC | Abre la carpeta en VS Code / Cursor → Live Server → `index.html` |

## Qué se publica en el servidor

Sube a la raíz del dominio **solo** esto:

```
index.html
robots.txt
sitemap.xml
assets/
pages/
```

`docs/`, `tools/` y `README.md` son de trabajo interno: no se suben.

## Dónde está cada cosa

| Qué | Dónde |
|-----|-------|
| Página de inicio | `index.html` |
| Páginas por marca | `pages/{marca}/` |
| Aviso de privacidad | `pages/legal/aviso-privacidad.html` |
| Estilos de todo el sitio (colores, tipografía Inter, componentes) | `assets/css/site.css` |
| Menú superior (logo y navegación) | `assets/css/shared/header.css` |
| Comportamiento (formulario, videos, WhatsApp, pestañas) | `assets/js/site.js` + `assets/js/shared/site-common.js` |
| Iconos | `assets/images/icons.svg` |
| Logos, fotos y videos | `assets/images/…` y `assets/video/…` |
| SEO | `robots.txt`, `sitemap.xml` |
