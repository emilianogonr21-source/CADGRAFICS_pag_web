# Tools (utilidades internas)

Scripts de mantenimiento del **equipo**. No son páginas del sitio. `tools/.htaccess` niega el acceso por HTTP si la carpeta llega a subirse. Aun así, no la publiques: contiene originales y, en local, FFmpeg.

| Archivo | Para qué |
|---------|----------|
| `optimize-videos.ps1` | Comprime los MP4 de `assets/video/` para web (H.264, sin audio, inicio rápido) |
| `originales/` | Fotos originales en alta resolución que el sitio no usa directamente (ej. `sandra-alvarez-original.png`, de donde sale `assets/images/team/sandra-alvarez.jpg`) |

### Comprimir videos

1. Descarga el build *essentials* de FFmpeg desde [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) y descomprímelo en `tools/_ffmpeg/` (solo local; está en `.gitignore`).
2. Ejecuta desde la raíz del proyecto:
   ```
   powershell -ExecutionPolicy Bypass -File tools/optimize-videos.ps1
   ```

Qué hace el script:

- **Guarda el original** la primera vez en `tools/_video-originals/` (local, no se sube) y siempre comprime desde ese original. Puedes ejecutarlo varias veces sin que el video pierda calidad.
- **Calidad y ancho por video**: las tablas `$Crf` y `$MaxWidth` al inicio del script. Los videos de fondo usan más compresión y 960 px; las demos con controles conservan 1280 px y más detalle. Si agregas un video nuevo, agrégalo a esas tablas (si no, usa CRF 28 y 1280 px).
- **Quita el audio** (los videos del sitio son mudos). Si algún día subes un video con narración, no lo pases por este script.
- Si el resultado pesa más que el original, conserva el original.

Resultado actual: 33.9 MB → 21.4 MB en total (Autodesk 11.7 → 5.7 MB, Adobe 9.9 → 5.6 MB, Creative Cloud 5.3 → 3.2 MB).

Guía del sitio: [docs/README.md](../docs/README.md).
