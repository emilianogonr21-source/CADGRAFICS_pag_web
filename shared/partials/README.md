# Modelos compartidos (menú y WhatsApp)

Esta carpeta guarda los **modelos oficiales** del menú de arriba y del botón verde de WhatsApp.

## Idea importante (léela)

Cada página del sitio **lleva su propia copia** de esas piezas dentro de su HTML.  
No se “inyectan” solas. Por eso, si editas solo el modelo aquí, **las páginas no cambian** hasta que copies el cambio.

¿Por qué así? Para no romper rutas (`assets/...` vs `../../assets/...`) ni el botón Contáctanos de cada página.

## Si cambias un teléfono o un ítem del menú

1. Edita el modelo aquí en `shared/partials/`.
2. Copia el cambio a las páginas del sitio (`index.html` y todo lo que hay en `pages/`).
3. Prueba menú en celular + Contáctanos en al menos: **inicio, Dell y Adobe**.

## Archivos de esta carpeta

| Archivo | Qué es |
|---------|--------|
| `header.html` | Modelo del menú superior |
| `whatsapp-float.html` | Modelo del botón verde de WhatsApp |

## El marcador `{{ROOT}}`

En los modelos verás `{{ROOT}}`. Es un recordatorio de la ruta según dónde viva la página:

| Página | Sustituye `{{ROOT}}` por |
|--------|---------------------------|
| `index.html` (raíz) | (nada) → ejemplo: `assets/images/brand/...` |
| `pages/marca/...` | `../../` → ejemplo: `../../assets/images/brand/...` |

Guía general del proyecto: [docs/README.md](../../docs/README.md).
