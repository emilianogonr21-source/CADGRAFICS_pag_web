# Tools (utilidades internas)

Scripts de mantenimiento del **equipo**.  
No son páginas del sitio y `robots.txt` pide a los buscadores no indexar esta carpeta.

| Archivo | Para qué |
|---------|----------|
| `sync-header.ps1` | Copia el menú oficial de `shared/partials/header.html` a todas las páginas |
| `optimize-videos.ps1` | Comprime los MP4 de `assets/video/` para web (requiere FFmpeg en `tools/_ffmpeg/`) |

### Sincronizar el menú

1. Edita `shared/partials/header.html`.
2. Desde la raíz del proyecto ejecuta:
   ```
   powershell -ExecutionPolicy Bypass -File tools/sync-header.ps1
   ```
3. Prueba menú en celular + Contáctanos en inicio, Dell y Adobe.

### Comprimir videos

1. Descarga el build *essentials* de FFmpeg y déjalo en `tools/_ffmpeg/` (solo local; está en `.gitignore` y no se publica).
2. Ejecuta:
   ```
   powershell -ExecutionPolicy Bypass -File tools/optimize-videos.ps1
   ```
   El script solo necesita `ffmpeg.exe` dentro de esa carpeta.

Guía del sitio: [docs/README.md](../docs/README.md).
