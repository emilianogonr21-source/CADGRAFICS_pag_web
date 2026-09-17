# Tools (utilidades internas)

Scripts de mantenimiento del **equipo**.  
No son páginas del sitio y `robots.txt` pide a los buscadores no indexar esta carpeta.

| Archivo | Para qué |
|---------|----------|
| `sync-header.ps1` | Copia el menú oficial de `shared/partials/header.html` a todas las páginas (recomendado en Windows) |
| `sync-header.py` | Misma sincronización si tienes Python instalado |
| `optimize-videos.ps1` | Comprime los MP4 de `assets/video/` para web (requiere FFmpeg en `tools/_ffmpeg/`) |
| `rename-assets.py` | Renombrar assets en lote cuando haga falta alinear nombres |

### Sincronizar el menú

1. Edita `shared/partials/header.html`.
2. Desde la raíz del proyecto ejecuta:
   ```
   powershell -ExecutionPolicy Bypass -File tools/sync-header.ps1
   ```
   (o `python tools/sync-header.py` si tienes Python).
3. Prueba menú en celular + Contáctanos en inicio, Dell y Adobe.

Guía del sitio: [docs/README.md](../docs/README.md).
