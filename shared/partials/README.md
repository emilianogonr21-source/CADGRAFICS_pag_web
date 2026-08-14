# Partials compartidos

Fuente de verdad del menú, WhatsApp flotante y cookies.

Los HTML de cada página **siguen llevando el chrome inline** (para no romper rutas ni clases de Contáctanos). Cuando cambies teléfonos o ítems del menú:

1. Edita el partial aquí.
2. Copia el cambio a las páginas, o ejecuta `tools/sync-chrome.ps1` (WhatsApp / cookies).
3. Prueba menú móvil + Contáctanos en al menos index, Dell y Adobe.

Placeholders comunes: `{{ROOT}}` (`""` o `"../../"`).
