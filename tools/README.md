# Tools (utilidades internas)

Scripts de mantenimiento del **equipo**. No son páginas del sitio y no se publican.

| Archivo | Para qué |
|---------|----------|
| `optimize-videos.ps1` | Comprime los MP4 de `assets/video/` para web (requiere FFmpeg en `tools/_ffmpeg/` y conserva originales en `tools/_video-originals/`) |

### Comprimir videos

1. Descarga el build *essentials* de FFmpeg y déjalo en `tools/_ffmpeg/` (solo local; está en `.gitignore`).
2. Ejecuta desde la raíz del proyecto:
   ```
   powershell -ExecutionPolicy Bypass -File tools/optimize-videos.ps1
   ```
   El script quita el audio. `video-landing-cc-adobe-express.mp4` se muestra con controles y podría tener narración: revisa si quieres conservar su audio antes de comprimirlo.

Guía del sitio: [docs/README.md](../docs/README.md).
