# Modelos compartidos (menú y WhatsApp)

Aquí viven los **modelos** del menú de arriba y del botón de WhatsApp.

Cada página del sitio **sigue llevando su propia copia** de esas piezas dentro del HTML (así no se rompen rutas ni el botón Contáctanos).

## Si cambias un teléfono o un ítem del menú

1. Edita el modelo aquí en `shared/partials/`.
2. Copia el cambio a las páginas del sitio.
3. Prueba menú en celular + Contáctanos en al menos: inicio, Dell y Adobe.

## Archivos de esta carpeta

| Archivo | Qué es |
|---------|--------|
| `header.html` | Modelo del menú superior |
| `whatsapp-float.html` | Modelo del botón verde de WhatsApp |

En los modelos verás `{{ROOT}}`: se reemplaza por nada (páginas en la raíz) o por `../../` (páginas dentro de `pages/marca/`).
