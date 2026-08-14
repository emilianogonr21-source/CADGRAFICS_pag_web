# Modelos compartidos (menú, WhatsApp, cookies)

Aquí viven los **modelos** del menú de arriba, del botón de WhatsApp y del aviso de cookies.

Cada página del sitio **sigue llevando su propia copia** de esas piezas dentro del HTML (así no se rompen rutas ni el botón Contáctanos).

## Si cambias un teléfono o un ítem del menú

1. Edita el modelo aquí en `shared/partials/`.
2. Copia el cambio a las páginas, o usa la ayuda `tools/sync-chrome.ps1` (WhatsApp / cookies).
3. Prueba menú en celular + Contáctanos en al menos: inicio, Dell y Adobe.

## Archivos de esta carpeta

| Archivo | Qué es |
|---------|--------|
| `header.html` | Modelo del menú superior |
| `whatsapp-float.html` | Modelo del botón verde de WhatsApp |
| `cookie-banner.html` | Modelo del aviso de cookies |

En los modelos verás `{{ROOT}}`: se reemplaza por nada (páginas en la raíz) o por `../../` (páginas dentro de `pages/marca/`).
