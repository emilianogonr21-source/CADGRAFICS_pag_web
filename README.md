# Sitio web de Cadgrafics

Esta guía explica el sitio completo con palabras sencillas. Sirve para quien vende, atiende clientes o publica páginas, aunque no programe.

El sitio es la página pública de **Cadgrafics** (Ciudad de México) y **Cadgrafics de Occidente** (Guadalajara). Ahí una empresa conoce las marcas, pide una recomendación, una demo o una cotización, y habla por WhatsApp.

Dirección publicada: **https://cadgrafics.com.mx/**

Si vas a cambiar el diseño o el programa que envía los correos, después de esta guía abre **[docs/README.md](docs/README.md)**.

---

## 1. Qué encuentra un visitante

El sitio tiene **16 páginas**. Todas llevan el mismo menú, el mismo pie con las dos oficinas y un botón verde de WhatsApp. En el celular, abajo aparece una barra con «Cotizar» y «WhatsApp».

Casi todas piden los datos en **dos pasos**:

1. Qué le interesa y su correo.
2. Nombre, empresa, celular, región y la aceptación del aviso de privacidad.

Al enviar, marketing recibe un correo. Si el correo no sale, la persona puede reenviar los mismos datos por WhatsApp.

| Página | Para quién es | Archivo |
|---|---|---|
| Inicio | Quien llega por primera vez: software, equipos, capacitación, casos de clientes y el formulario | `index.html` |
| Autodesk | Empresas que buscan al partner Platinum y las colecciones | `pages/autodesk/home-autodesk.html` |
| AEC Collection | Arquitectura, ingeniería y construcción (Revit, AutoCAD, Civil 3D y más) | `pages/autodesk/aec-collection.html` |
| Product Design & Manufacturing | Diseño de producto y manufactura | `pages/autodesk/pdm-collection.html` |
| Media & Entertainment | Animación, cine y videojuegos (Maya, 3ds Max y más) | `pages/autodesk/me-collection.html` |
| Programa de Adopción | Talleres para que el equipo use de verdad Revit y la gestión de datos | `pages/adopcion_autodesk/adopcion_Autodesk.html` |
| Adobe | Empresas que buscan al reseller Platinum | `pages/adobe/home-adobe.html` |
| Creative Cloud | Photoshop, Illustrator, Premiere y el resto de la suite | `pages/adobe/creative-cloud.html` |
| Acrobat Studio | PDF, firmas y el asistente de inteligencia artificial | `pages/adobe/acrobat-studio.html` |
| Microsoft 365 | Correo, archivos y seguridad para la empresa | `pages/microsoft/home-microsoft.html` |
| Chaos | Enscape, V-Ray, Corona y Veras | `pages/chaos/home-chaos.html` |
| SketchUp | Modelado 3D fácil de enseñar | `pages/sketchup/home-sketchup.html` |
| Dell | Computadoras y estaciones de trabajo | `pages/dell/home-dell.html` |
| HP gran formato | Plotters DesignJet y PageWide | `pages/hp/home-hp.html` |
| Mac para empresas | Equipos Apple para el trabajo | `pages/mac/home-mac.html` |
| Aviso de privacidad | Cómo Cadgrafics cuida los datos y cómo pedir derechos ARCO. Esta página no tiene formulario | `pages/legal/aviso-privacidad.html` |

Un enlace viejo, `pages/autodesk/mfg-collection.html`, ya no existe. Quien lo abra en el sitio publicado llega a Product Design & Manufacturing. Si el enlace trae `?coleccion=me`, llega a Media & Entertainment.

---

## 2. Cómo nos contactan

### Formulario

El visitante elige una intención con un botón que dice, por ejemplo, «Solicitar cotización», «Agendar demo» o «Pedir recomendación». Ese botón tiene que llevar al formulario de la misma página. Marketing recibe uno de estos textos:

| Lo que pulsó | Lo que dice el correo |
|---|---|
| Pedir recomendación | Explorando, quiere una recomendación |
| Agendar demo, o no pulsó ningún botón de estos | Quiere una demo |
| Solicitar cotización | Quiere una cotización |

El correo llega solo a **marketing@cadgrafics.com.mx**. El visitante no puede cambiar ese destino. Para contestar, se usa «Responder» y el mensaje va al correo que la persona escribió.

El programa revisa que haya correo válido, celular de 10 dígitos, nombre, empresa, interés, región y la aceptación del aviso. Ignora cualquier dato que no sea de esa lista. Acepta como máximo **5 envíos por hora** desde la misma conexión.

Si el correo no puede enviarse, la persona ve el aviso y el botón de WhatsApp. En el servidor queda una copia en `private/leads/`. Esa carpeta no se abre en el navegador y contiene datos personales: no la compartas ni la subas a un chat.

En una vista de prueba en tu computadora el formulario no envía el correo. Solo lo hace el sitio ya publicado en cadgrafics.com.mx. Ver el aviso de WhatsApp en esa prueba es normal.

### WhatsApp

El formulario no ofrece Guadalajara. Toda solicitud llega a **marketing@cadgrafics.com.mx**. El botón verde, el de «Continuar por WhatsApp» y el respaldo si el correo falla usan siempre el número de CDMX: 55 3112 0508. Norte y Sur y sureste también.

En el pie sigue el teléfono de la oficina de Guadalajara, 33 1404 0396. Ese enlace no cambia con la región del formulario.

### Oficinas que aparecen en el pie

- **Cadgrafics S.A. de C.V.** — Norte 56-A #5204, Col. Tablas de San Agustín, 07860, Gustavo A. Madero, CDMX. Correo: sandra.alvarez@cadgrafics.com.mx.
- **Cadgrafics de Occidente S.A. de C.V.** — Calle Día #2381, Col. Jardines del Bosque, 44520, Guadalajara, Jalisco. Correo: rafael.castro@cadgrafics.com.mx.

---

## 3. Qué hay en cada carpeta

| Carpeta o archivo | En palabras simples | ¿Lo ve el visitante? |
|---|---|---|
| `index.html` | La página de inicio | Sí |
| `pages/` | El resto de las páginas, una carpeta por marca | Sí |
| `assets/` | Colores, letras, fotos, íconos y videos que usan todas las páginas | Sí, como parte de cada página |
| `contacto.php` | El programa que recibe el formulario y manda el correo | No se ve; trabaja al enviar |
| `.htaccess` | Reglas del servidor: obliga a usar https en el dominio público y protege el sitio | No se ve |
| `robots.txt` y `sitemap.xml` | Le dicen a Google qué páginas existen y cuáles carpetas internas debe ignorar | No forman parte del diseño |
| `private/` | Copias de solicitudes que no pudieron enviarse, y un conteo de intentos | No. Si alguien abre la dirección, el servidor la niega |
| `docs/` | Esta explicación técnica y un catálogo visual de botones, tarjetas y formularios (`docs/componentes.html`) | No. Es para el equipo |
| `tools/` | Una herramienta para achicar videos antes de publicarlos, y las fotos originales en alta resolución | No. Es para el equipo |
| `.vscode/` | Un ajuste del editor para ver el sitio en el puerto 5501 | No |

Si cambias un color o un comportamiento en `assets/`, cambia en **todas** las páginas. Si cambias un texto dentro de un archivo de `pages/`, cambia solo esa página.

---

## 4. Cómo se ve una página, de arriba abajo

1. **Menú.** Marcas, soluciones, casos y «Contáctanos».
2. **Presentación.** Título, una frase y, en la mayoría, el formulario o un video sin sonido.
3. **Información.** Productos, planes o beneficios. El fondo alterna blanco y un papel claro.
4. **Cierre en rojo.** Invitación a escribir o a cotizar.
5. **Pie.** Las dos oficinas, enlaces y redes.

Los videos de fondo tienen un botón «Pausar video». Se mueven solo mientras se ven en pantalla y se quedan en una foto fija si la persona pidió menos movimiento, ahorrar datos o está en una red muy lenta.

---

## 5. Ver el sitio en tu computadora

1. Abre esta carpeta en Cursor o en VS Code.
2. Instala la extensión **Live Server** (una sola vez).
3. Clic derecho en `index.html` → **Open with Live Server**.

También puedes abrir `index.html` con doble clic para leer los textos. El formulario y algunos videos se comportan como en internet solo con Live Server o con el sitio ya publicado.

---

## 6. Publicar

Sube a la raíz del dominio:

- `index.html`
- `contacto.php`
- `.htaccess`
- `robots.txt`
- `sitemap.xml`
- la carpeta `assets/`
- la carpeta `pages/`
- la carpeta `private/` con su `.htaccess`, aunque `leads` y `ratelimit` vayan vacías

No subas `docs/`, `tools/`, `.vscode/`, este `README.md`, `.gitignore`, `.gitattributes` ni ningún archivo `private/leads/failed.log`.

Después de publicar, comprueba:

- [ ] Una página de marca se ve bien en celular y en computadora.
- [ ] Un formulario de prueba, pulsando antes «Solicitar cotización», muestra «Recibimos tu solicitud».
- [ ] El correo llega a marketing@ y dice «Quiere una cotización».
- [ ] `http://cadgrafics.com.mx/` pasa solo a `https://`.
- [ ] Las direcciones `/docs/` y `/private/` responden que el acceso está negado.

Si el formulario publicado dice «No pudimos enviar tu solicitud», pide al hosting que active el correo de PHP y que la carpeta temporal, o `private/ratelimit/`, se pueda escribir. Revisa también la carpeta de spam de marketing@.

---

## 7. Cambios que puedes hacer tú

Abre el archivo, busca el texto con **Ctrl + Shift + F**, cámbialo y guarda. No borres lo que está entre `<` y `>`.

| Quiero… | Dónde |
|---|---|
| Corregir una frase de una página | El archivo de esa página, en la tabla de la sección 1 |
| Cambiar el correo que recibe los formularios | `contacto.php`, la línea `RECIPIENT`. Tiene que ser un buzón de cadgrafics.com.mx |
| Cambiar un WhatsApp | `assets/js/site.js` y, con la búsqueda, el número viejo en todas las páginas (`525531120508` o `523314040396`) |
| Cambiar dirección o teléfono del pie | El final de cada página, en la zona del pie. Hay que repetirlo en las 16 |
| Cambiar la foto de una persona del equipo | `assets/images/team/`, misma foto cuadrada y el mismo nombre de archivo (192 × 192 px) |
| Cambiar el rojo de la marca | `assets/css/site.css`, al inicio, el valor de `--red` (`#B80007`) |

El rojo de marca es el Pantone 1807 C. La letra de todo el sitio es Inter.

Para una página nueva, copia una parecida y pide apoyo a quien edita el código: hay que registrarla en el menú y en `sitemap.xml`. Los pasos están en [docs/README.md](docs/README.md).

---

## 8. Qué conviene no tocar

- El logo del menú y el archivo `assets/css/shared/header.css`.
- Los logos de Autodesk, Adobe, Dell y las demás marcas: hay que usarlos como los entrega cada fabricante.
- El nombre del campo oculto del formulario (`_honey`). Si se cambia, pueden colarse envíos automáticos o perderse uno real.
- Las copias de `private/leads/`: son datos de clientes.

Cada cambio puede guardarse en el historial del proyecto: en Cursor, pestaña **Source Control** (Ctrl + Shift + G), escribe una frase corta y confirma el commit. **Sync** o **Push** lo sube al repositorio remoto.

---

**Para quien va a editar el diseño o el formulario:** [docs/README.md](docs/README.md).
