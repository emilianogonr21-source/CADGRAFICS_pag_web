# Sitio web de Cadgrafics

Sitio oficial de **Cadgrafics S.A. de C.V.** (CDMX) y **Cadgrafics de Occidente** (Guadalajara): software, equipos y capacitación de Autodesk, Adobe, Microsoft, Chaos, SketchUp, Dell, HP y Apple.

Dominio: **https://cadgrafics.com.mx/**

> **¿Primera vez aquí?** Lee esta página completa (10 minutos). Si vas a modificar el código, sigue con la guía técnica: **[docs/README.md](docs/README.md)**.

---

## 1. Qué es este proyecto, en pocas palabras

- Las páginas son **HTML, CSS y JavaScript**. No hay base de datos ni WordPress. El único archivo de servidor es `contacto.php`: recibe el formulario y lo manda por correo.
- **No necesita instalar nada** en tu computadora para verlo. Para publicarlo, el hosting debe ejecutar PHP y permitir la función `mail()`.
- Tiene **16 páginas**: la de inicio, 14 páginas de marcas y productos, y el aviso de privacidad.
- Todas las páginas comparten **un solo archivo de estilos** (`assets/css/site.css`) y **un solo archivo de comportamiento** (`assets/js/site.js`). Si cambias algo ahí, cambia en todo el sitio.

### Qué hace el sitio por el visitante

| Función | Qué pasa |
|---|---|
| **Formulario de contacto** (en cada página, menos el aviso de privacidad) | 2 pasos. Al enviar, llega un **correo a marketing@cadgrafics.com.mx** con los datos permitidos y la etapa (recomendación, demo o cotización). Si el correo falla, el visitante puede reintentar o mandar los mismos datos por WhatsApp, y el servidor guarda una copia en `private/leads/`. |
| **Botón flotante de WhatsApp** | Abre un chat con la oficina CDMX (55 3112 0508). Si la persona eligió "Jalisco y occidente" en el formulario, cambia a Guadalajara (33 1404 0396). Norte y Sur y sureste siguen con el número de CDMX: solo hay dos oficinas. |
| **Videos de fondo** | Sin sonido, en bucle, solo mientras están en pantalla. No tienen botón de pausa. Se quedan en la imagen fija si la persona pidió reducir movimiento, ahorrar datos o está en una red 2G. |
| **Animaciones** | Las secciones aparecen suavemente al bajar, las cifras cuentan hasta su valor y las certificaciones de Autodesk se desplazan en un carril infinito. Todo se desactiva si la persona pidió "reducir movimiento" en su sistema. |

---

## 2. Cómo está organizado

```
CADGRAFICS_pag_web/
├── index.html              ← Página de inicio
├── contacto.php            ← Recibe el formulario, valida y envía el correo
├── .htaccess               ← HTTPS, cabeceras de seguridad y redirecciones
├── private/                ← Copias si el correo falla, y conteo de intentos (no se publica)
├── pages/                  ← Una carpeta por marca
│   ├── autodesk/             Autodesk, AEC, PD&M, M&E (+ redirección vieja)
│   ├── adopcion_autodesk/    Programa de Adopción
│   ├── adobe/                Adobe, Creative Cloud, Acrobat Studio
│   ├── microsoft/  chaos/  sketchup/  dell/  hp/  mac/
│   └── legal/                Aviso de privacidad
├── assets/                 ← Todo lo que usan las páginas
│   ├── css/site.css          Colores, tipografía y diseño de TODO el sitio
│   ├── css/shared/header.css Menú superior (no modificar el logo)
│   ├── js/site.js            Formularios, WhatsApp, animaciones, videos
│   ├── js/shared/            Menú (compartido con el sitio anterior)
│   ├── images/               Imágenes ordenadas por uso:
│   │   ├── brand/              Logo, favicon e imagen para redes de Cadgrafics
│   │   ├── partners/           Logos de fabricantes (Autodesk, Adobe, Dell…)
│   │   ├── casos/              Fotos de casos de éxito
│   │   ├── team/               Fotos del equipo
│   │   ├── {marca}/{página}/   Imágenes de cada página (ej. adobe/creative-cloud/)
│   │   ├── brevo/              Imágenes de correos de campaña (no mover)
│   │   └── icons.svg           Todos los íconos
│   └── video/{marca}/{página}/ Videos MP4
├── robots.txt  sitemap.xml ← Para Google
├── docs/                   ← Documentación (no se publica)
└── tools/                  ← Utilidades internas (no se publica)
```

---

## 3. Ver el sitio en tu computadora

1. Abre la carpeta del proyecto en **Cursor** o **VS Code**.
2. Instala la extensión **Live Server** (una sola vez).
3. Clic derecho en `index.html` → **Open with Live Server**. Se abre el navegador y se actualiza solo cada vez que guardas.

> Abrir `index.html` con doble clic también funciona para ver el diseño, pero el formulario y algunos videos necesitan Live Server (o el sitio publicado) para comportarse igual que en internet.

---

## 4. Publicar en internet

Sube esto a la raíz del dominio (por FTP o el panel del hosting):

```
index.html
contacto.php
.htaccess
robots.txt
sitemap.xml
assets/
pages/
private/.htaccess
private/leads/          (puede ir vacía; el servidor crea el registro si hace falta)
private/ratelimit/      (puede ir vacía; cuenta intentos si el temporal del sistema no se puede usar)
```

**No subas** `docs/`, `tools/`, `README.md`, `.gitignore`, `.gitattributes` ni archivos `private/leads/*.log`. Esos registros tienen datos personales.

Sí sube los `.htaccess`. El de la raíz fuerza HTTPS en cadgrafics.com.mx y pone las cabeceras de seguridad. Los de `docs/`, `tools/` y `private/` niegan el acceso por HTTP por si alguna de esas carpetas se sube por error. `robots.txt` pide a los buscadores que no indexen esas tres rutas; eso no sustituye el `.htaccess`.

### Lista de revisión antes de publicar

- [ ] Abrir varias páginas en celular y computadora y revisar que se vean bien.
- [ ] Probar el formulario de una página (ver la sección siguiente).
- [ ] Si agregas o reemplazas un video, comprímelo antes con la herramienta de `tools/` (ver [tools/README.md](tools/README.md)). Los videos actuales ya están optimizados (21 MB en total).
### Paso obligatorio después de publicar: probar el formulario

El formulario envía los datos a `contacto.php`, en el mismo dominio. El correo llega a **marketing@cadgrafics.com.mx**.

1. Entra al sitio **ya publicado** (https://cadgrafics.com.mx), pulsa un botón que lleve a `#contacto` (por ejemplo «Solicitar cotización») y envía un formulario de prueba.
2. Debe mostrarse «Recibimos tu solicitud». El correo debe llegar a marketing@ con la etapa («Quiere una cotización», «Quiere una demo» o «Explorando, quiere una recomendación»).
3. Si aparece «No pudimos enviar tu solicitud», revisa dos cosas: que el hosting entregue `mail()` y que la carpeta temporal de PHP, o `private/ratelimit/`, se pueda escribir. Si `mail()` falla, la solicitud queda en `private/leads/failed.log`. Esa dirección no debe abrirse en el navegador.
4. Comprueba que `https://cadgrafics.com.mx/docs/` y `https://cadgrafics.com.mx/private/` respondan acceso denegado, y que `http://cadgrafics.com.mx/` pase a `https://`.

En tu computadora, con Live Server, el formulario no envía el correo: `contacto.php` solo acepta el origen `https://cadgrafics.com.mx` y `https://www.cadgrafics.com.mx`. Verás el aviso y la opción de WhatsApp. Eso es lo esperado.

### Probar los enlaces antiguos de colecciones

`.htaccess` redirige la página que ya no existe `pages/autodesk/mfg-collection.html`. Esto solo funciona en el sitio publicado (Live Server no lee `.htaccess`):

- https://cadgrafics.com.mx/pages/autodesk/mfg-collection.html y `?coleccion=pdm` deben abrir **PD&M**.
- https://cadgrafics.com.mx/pages/autodesk/mfg-collection.html?coleccion=me debe abrir **M&E**.

---

## 5. Cambios frecuentes (sin saber programar)

Abre el archivo en Cursor/VS Code, usa **Ctrl + Shift + F** para buscar el texto en todo el proyecto, cámbialo y guarda.

| Quiero cambiar… | Dónde | Cómo |
|---|---|---|
| Un texto de una página | El `.html` de esa página | Busca el texto y reemplázalo. No borres lo que está entre `< >`. |
| El correo que recibe los formularios | `contacto.php`, constante `RECIPIENT` | Cambia la dirección. Tiene que ser un buzón del mismo dominio para que `mail()` lo entregue. Si agregas un campo nuevo al formulario, también hay que añadirlo a `ALLOWED_FIELDS` y, si el servidor debe exigirlo, a la validación. |
| Un número de WhatsApp | `assets/js/site.js` (`WHATSAPP` y `WA_LABEL`) **y** los enlaces `wa.me/52…` en los `.html` | Usa Ctrl + Shift + F con el número viejo (ej. `525531120508`) para encontrar todos. |
| Teléfonos o direcciones del pie de página | Cada `.html`, al final, dentro de `<footer>` | Búscalo con Ctrl + Shift + F y cámbialo en todas las páginas. |
| La foto de una persona | `assets/images/team/` | Reemplaza el archivo con una foto cuadrada de 192 × 192 px con el mismo nombre. |
| Un color del sitio | `assets/css/site.css`, al inicio (`--red`, `--wa`, etc.) | Cambia el código de color una vez y se aplica en todo el sitio. |
| Agregar una página nueva | Ver [docs/README.md → Crear una página](docs/README.md#crear-o-editar-una-página) | Copiar una página parecida y ajustar textos. |

> **Regla de oro:** no pongas estilos (colores, tamaños) dentro de las páginas. Todo el diseño vive en `assets/css/site.css`; así el sitio se mantiene uniforme.

---

## 6. Guardar cambios (Git)

El proyecto usa **Git** para guardar el historial: cada cambio queda registrado y se puede volver atrás.

- En Cursor/VS Code: pestaña **Source Control** (Ctrl + Shift + G) → escribe una descripción breve → **Commit**.
- Para subirlo al repositorio remoto: **Sync / Push**.

---

## 7. Contactos y datos clave

| Dato | Valor |
|---|---|
| Correo que recibe los formularios | marketing@cadgrafics.com.mx |
| WhatsApp CDMX | 55 3112 0508 |
| WhatsApp Guadalajara | 33 1404 0396 |
| Color principal | Rojo Pantone 1807 C · `#B80007` |
| Tipografía | Inter |

---

**Siguiente lectura:** [docs/README.md](docs/README.md) — guía técnica completa (diseño, formularios, animaciones, seguridad, SEO y solución de problemas).
