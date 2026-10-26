# Sitio web de Cadgrafics

Esta guía explica el sitio completo con palabras sencillas. Sirve para quien vende, atiende clientes, publica páginas o llega nuevo al equipo, aunque no programe.

El sitio es la página pública de **Cadgrafics** (Ciudad de México) y **Cadgrafics de Occidente** (Guadalajara). Una empresa entra, conoce las marcas, pide una recomendación, una demo o una cotización, y puede hablar por WhatsApp.

Dirección publicada: **https://cadgrafics.com.mx/**

Si vas a cambiar el diseño o el programa que envía los correos, después de esta guía abre **[docs/README.md](docs/README.md)**.

**Contenido**

1. [Qué es el sitio](#1-qué-es-el-sitio)
2. [Cómo se mueve un visitante](#2-cómo-se-mueve-un-visitante)
3. [Las 16 páginas](#3-las-16-páginas)
4. [Cómo nos contactan](#4-cómo-nos-contactan)
5. [Qué hay en cada carpeta](#5-qué-hay-en-cada-carpeta)
6. [Cómo se ve una página, de arriba abajo](#6-cómo-se-ve-una-página-de-arriba-abajo)
7. [Ver el sitio en tu computadora](#7-ver-el-sitio-en-tu-computadora)
8. [Publicar](#8-publicar)
9. [Cambios que puedes hacer tú](#9-cambios-que-puedes-hacer-tú)
10. [Qué conviene no tocar](#10-qué-conviene-no-tocar)

---

## 1. Qué es el sitio

Cadgrafics vende software, equipos y capacitación, y se queda con el cliente después de la compra: asesoría, implementación y soporte.

En la portada el sitio se presenta así: más de 30 años, cobertura en México, oficinas en Ciudad de México y Guadalajara, y tres líneas de trabajo (software, hardware y capacitación).

El visitante no crea una cuenta ni compra en línea. Cada página lo invita a dejar sus datos o a escribir por WhatsApp. Marketing recibe el correo y una persona del equipo responde.

---

## 2. Cómo se mueve un visitante

Todas las páginas comparten el mismo menú, el mismo pie y un botón verde de WhatsApp. En el celular, abajo aparece una barra con «Cotizar» y «WhatsApp».

### Menú

| Opción | A dónde lleva |
|---|---|
| Logotipo | Inicio |
| Marcas | La franja de logos del inicio, y un submenú con cada marca |
| Soluciones | La sección del inicio «¿Te suenan familiares estos problemas?». No es una página aparte |
| Casos de éxito | La sección del inicio con los videos de clientes. No es una página aparte |
| Contáctanos | El formulario de la página en la que estás |

Dentro de **Marcas** el submenú abre así:

- **Adobe:** página de Adobe, y dentro Acrobat Studio y Creative Cloud.
- **Autodesk:** página de Autodesk, y dentro AEC Collection, Product Design & Manufacturing, Media & Entertainment y Programa de Adopción.
- **Sin subpáginas:** Chaos, Dell, HP, Mac, Microsoft y SketchUp. Cada una es una sola página.

### Logos que se ven y no tienen página

En el inicio aparecen CivilCAD, Lumion y Opus junto a las demás marcas. Esos tres logos no llevan a ninguna página: solo muestran que Cadgrafics también trabaja con ellos.

### Un enlace que ya no existe

`pages/autodesk/mfg-collection.html` se usó antes para manufactura. Quien lo abra en el sitio publicado llega a Product Design & Manufacturing. Si el enlace trae `?coleccion=me`, llega a Media & Entertainment.

---

## 3. Las 16 páginas

Cada página de marca cuenta lo mismo, con otro producto: quién es Cadgrafics para esa marca, qué se puede comprar o contratar, cómo acompaña el equipo, y un formulario al final.

| Página | Para quién es | Promesa que ve al entrar | Archivo |
|---|---|---|---|
| Inicio | Quien llega por primera vez | Tecnología que el equipo sí va a usar, con personas en cada paso | `index.html` |
| Autodesk | Quien busca al partner Platinum | Convertir la visión en realidad digital | `pages/autodesk/home-autodesk.html` |
| AEC Collection | Arquitectura, ingeniería y construcción | Diseñar, construir y gestionar de la idea a la obra | `pages/autodesk/aec-collection.html` |
| Product Design & Manufacturing | Diseño de producto y manufactura | La colección para diseñar, simular y fabricar | `pages/autodesk/pdm-collection.html` |
| Media & Entertainment | Animación, cine y videojuegos | La colección para modelar, animar y renderizar | `pages/autodesk/me-collection.html` |
| Programa de Adopción | Equipos que ya tienen Autodesk y no lo aprovechan | Pasar de la licencia a la productividad | `pages/adopcion_autodesk/adopcion_Autodesk.html` |
| Adobe | Quien busca al reseller Platinum | Diseñar, firmar y compartir con alguien que acompaña | `pages/adobe/home-adobe.html` |
| Creative Cloud | Equipos de diseño, video y fotografía | La suite completa, en el plan que le toca al equipo | `pages/adobe/creative-cloud.html` |
| Acrobat Studio | Quien vive en PDF, contratos y firmas | PDF con una IA que trabaja con la persona | `pages/adobe/acrobat-studio.html` |
| Microsoft 365 | Empresas que quieren correo, archivos y seguridad | Toda la empresa conectada en un solo lugar | `pages/microsoft/home-microsoft.html` |
| Chaos | Quien renderiza (Enscape, V-Ray, Corona, Veras) | Del modelo a la imagen que vende el proyecto | `pages/chaos/home-chaos.html` |
| SketchUp | Quien busca modelado 3D fácil de enseñar | El modelador 3D más utilizado | `pages/sketchup/home-sketchup.html` |
| Dell | Quien necesita computadoras y estaciones de trabajo | El equipo correcto para cada persona | `pages/dell/home-dell.html` |
| HP gran formato | Quien imprime planos o gran formato | Imprimir más rápido y gastar menos | `pages/hp/home-hp.html` |
| Mac para empresas | Quien quiere equipos Apple para el trabajo | La Mac correcta para cada persona | `pages/mac/home-mac.html` |
| Aviso de privacidad | Quien quiere saber qué pasa con sus datos | El aviso legal y cómo pedir derechos ARCO. Esta página no tiene formulario | `pages/legal/aviso-privacidad.html` |

### Inicio

1. Presentación con video de fondo y el formulario a un lado. Las opciones son licencias, renovación, equipos, impresión de gran formato, capacitación y soporte.
2. Logos de las marcas. Ocho llevan a su página; CivilCAD, Lumion y Opus no.
3. Quiénes somos: más de 30 años, cobertura nacional, software más hardware más capacitación, y soporte.
4. Problemas frecuentes: equipos lentos, seguridad débil, soporte que no resuelve, implementaciones largas y falta de capacitación. El menú «Soluciones» baja aquí.
5. El acompañamiento en tres momentos: diagnóstico, implementación y soporte.
6. Tres casos con video: Grupo Idinsa, Grupo Alba y Universidad ETAC. El menú «Casos de éxito» baja aquí.
7. Una segunda invitación a escribir, con otro formulario.

### Autodesk y sus páginas

- **Autodesk.** Certificaciones, las colecciones (AEC, diseño y manufactura, medios) y el camino antes, durante y después. Desde aquí se llega a cada colección y al Programa de Adopción.
- **AEC Collection.** Para obra y proyecto: retos del día a día, programas incluidos (Revit, AutoCAD, Civil 3D y más), acompañamiento y un caso de cliente. Enlaza a las otras colecciones.
- **Product Design & Manufacturing.** 14 productos en una suscripción, retos de diseño y fábrica, y novedades 2027. Si el visitante hace animación, lo manda a Media & Entertainment.
- **Media & Entertainment.** 11 productos (Maya, 3ds Max y más), retos de animación, efectos y videojuegos, y novedades 2027. Si diseña producto o fabrica, lo manda a Product Design & Manufacturing.
- **Programa de Adopción.** El recorrido de adopción, cuatro talleres a elegir (Revit Architecture, Revit Structure, Revit MEP y Data Management; de 4 a 8 horas; 40 temas en total) y cómo participar: una llamada informativa. La empresa elige un taller, no los cuatro.

### Adobe y sus páginas

- **Adobe.** Por qué un Platinum Reseller, cómo elegir entre VIP y ETLA, Creative Cloud, Firefly, Acrobat y firma electrónica.
- **Creative Cloud.** Tres planes según el tamaño del equipo, las aplicaciones, lo que incluye la licencia, Firefly, Adobe Express, un caso y preguntas frecuentes.
- **Acrobat Studio.** PDF, asistente de IA y espacios de trabajo; un video de demostración; usos por área (ventas, legal, operaciones); comparación de Acrobat Pro, AI Assistant y Acrobat Studio; preguntas frecuentes.

### El resto de las marcas

- **Microsoft 365.** Planes Business (Basic, Standard, Premium), una tabla para elegir según el tamaño y la necesidad, Copilot, seguridad, cambios de 2026, planes Enterprise y cómo migrar sin parar la operación.
- **Chaos.** Novedades 2026 (Enscape, V-Ray, Corona y Veras), qué herramienta toca en cada etapa, ejemplos de renders, licencias y una invitación a no comprar de más.
- **SketchUp.** Planes, usos por sector, proyectos reales y el enlace a Chaos porque SketchUp Studio incluye V-Ray.
- **Dell.** Portafolio (laptops, escritorio, estaciones de trabajo, servidores y casos especiales) y el acompañamiento desde la elección hasta que el equipo ya está en uso. Cadgrafics es Gold Partner.
- **HP.** Plotters DesignJet y PageWide: beneficios, familias, comparación de nueve modelos, sectores y el camino de la llamada al primer plano impreso.
- **Mac.** Qué equipo le toca a cada área, laptops, escritorio (iMac, Mac mini, Mac Studio y Mac Pro) y una comparación de la línea.
- **Aviso de privacidad.** Cómo Cadgrafics trata los datos y cómo ejercer los derechos ARCO. Está enlazado en cada formulario y al final de cada página. No pide datos.

---

## 4. Cómo nos contactan

### Formulario

Casi todas las páginas piden los datos en **dos pasos**:

1. Qué le interesa y su correo.
2. Nombre, empresa, celular, región y la aceptación del aviso de privacidad.

El visitante elige una intención con un botón que dice, por ejemplo, «Solicitar cotización», «Agendar demo» o «Pedir recomendación». Ese botón tiene que llevar al formulario de la misma página. Marketing recibe uno de estos textos:

| Lo que pulsó | Lo que dice el correo |
|---|---|
| Pedir recomendación | Explorando, quiere una recomendación |
| Agendar demo, o no pulsó ningún botón de estos | Quiere una demo |
| Solicitar cotización | Quiere una cotización |

El correo llega solo a **marketing@cadgrafics.com.mx**. El visitante no puede cambiar ese destino. Para contestar, se usa «Responder» y el mensaje va al correo que la persona escribió.

El asunto incluye la página y el interés, por ejemplo: *Nuevo contacto web · Inicio · Licencias de software*. Así se sabe de qué página llegó.

El programa revisa que haya correo válido, celular de 10 dígitos, nombre, empresa, interés, región y la aceptación del aviso. Ignora cualquier dato que no sea de esa lista. Acepta como máximo **5 envíos por hora** desde la misma conexión.

Si el correo no puede enviarse, la persona ve el aviso y el botón de WhatsApp. En el servidor queda una copia en `private/leads/` durante 30 días. Esa carpeta no se abre en el navegador y contiene datos personales: no la compartas ni la subas a un chat.

En una vista de prueba en tu computadora el formulario no envía el correo. Solo lo hace el sitio ya publicado en cadgrafics.com.mx. Ver el aviso de WhatsApp en esa prueba es normal.

Las regiones del formulario son CDMX y centro, Norte, y Sur y sureste. No hay opción de Guadalajara: toda solicitud llega al mismo correo de marketing.

### WhatsApp

El botón verde, el de «Continuar por WhatsApp» y el respaldo si el correo falla usan siempre el número de CDMX: **55 3112 0508**. No cambia al elegir región.

En el pie sigue el teléfono de la oficina de Guadalajara, **33 1404 0396**. Ese enlace no cambia con la región del formulario.

### Oficinas que aparecen en el pie

- **Cadgrafics S.A. de C.V.** — Norte 56-A #5204, Col. Tablas de San Agustín, 07860, Gustavo A. Madero, CDMX. Correo: sandra.alvarez@cadgrafics.com.mx.
- **Cadgrafics de Occidente S.A. de C.V.** — Calle Día #2381, Col. Jardines del Bosque, 44520, Guadalajara, Jalisco. Correo: rafael.castro@cadgrafics.com.mx.

En el pie también están las redes: LinkedIn, YouTube, X, Facebook e Instagram.

---

## 5. Qué hay en cada carpeta

| Carpeta o archivo | En palabras simples | ¿Lo ve el visitante? |
|---|---|---|
| `index.html` | La página de inicio | Sí |
| `pages/` | El resto de las páginas, una carpeta por marca o por el aviso legal | Sí |
| `assets/` | Colores, letras, fotos, íconos y videos que usan las páginas | Sí, como parte de cada página |
| `contacto.php` | El programa que recibe el formulario y manda el correo | No se ve; trabaja al enviar |
| `.htaccess` | Reglas del servidor: obliga a usar https en el dominio público, niega carpetas internas y redirige el enlace viejo de manufactura | No se ve |
| `robots.txt` y `sitemap.xml` | Le dicen a Google qué páginas existen (las 16) y cuáles carpetas internas debe ignorar | No forman parte del diseño |
| `private/` | Respaldo del formulario. Ver el detalle abajo | No. Si alguien abre la dirección, el servidor la niega |
| `docs/` | La explicación para quien edita el diseño (`docs/README.md`) y un catálogo visual de botones y tarjetas (`docs/componentes.html`) | No. Es para el equipo |
| `tools/` | Utilidades para preparar fotos y videos antes de publicarlos. No son páginas | No. Es para el equipo |
| `.vscode/` | Un ajuste del editor para ver el sitio en el puerto 5501 | No |

### `private/`, por dentro

No es una página. `contacto.php` la usa en el servidor:

- `private/leads/` guarda `failed.log` solo cuando el correo no pudo enviarse. En el proyecto suele verse vacía, con un archivo `.gitkeep`, hasta que eso ocurra.
- `private/ratelimit/` cuenta intentos (los 5 por hora) si el hosting no deja escribir en su carpeta temporal. Si esa carpeta temporal sí funciona, esta queda sin uso.
- `private/.htaccess` niega el acceso por el navegador.

Hay que subir la carpeta vacía al publicar. Los archivos que se generen ahí son datos de clientes: no se comparten ni se suben al repositorio.

### `tools/`, por dentro

- `optimize-videos.ps1` comprime los videos del sitio.
- `originales/` guarda fotos en alta resolución que el sitio no muestra directo. De ahí salen, por ejemplo, las fotos del equipo.
- `_video-originals/` guarda el video original antes de comprimirlo.
- `_ffmpeg/` es el programa que comprime. Solo vive en la computadora de quien edita; no se publica ni entra al repositorio. El sitio no lo abre.

### Una regla fácil

Si cambias un color o un comportamiento en `assets/`, cambia en **todas** las páginas. Si cambias un texto dentro de un archivo de `pages/`, cambia solo esa página. El menú y el pie están copiados en cada página: un teléfono nuevo hay que repetirlo en las 16.

---

## 6. Cómo se ve una página, de arriba abajo

1. **Menú.** Marcas, soluciones, casos y «Contáctanos».
2. **Presentación.** Título, una frase y, en la mayoría, el formulario o un video sin sonido.
3. **Información.** Productos, planes o beneficios. El fondo alterna blanco y un papel claro.
4. **Cierre en rojo.** Invitación a escribir o a cotizar.
5. **Pie.** Las dos oficinas, enlaces a las marcas, redes y el aviso de privacidad.

Los videos de fondo no tienen botón para pausarlos. Se mueven solo mientras se ven en pantalla y se quedan en una foto fija si la persona pidió menos movimiento, ahorrar datos o está en una red muy lenta.

El rojo de marca es el Pantone 1807 C. La letra de todo el sitio es Inter.

---

## 7. Ver el sitio en tu computadora

1. Abre esta carpeta en Cursor o en VS Code.
2. Instala la extensión **Live Server** (una sola vez).
3. Clic derecho en `index.html` → **Open with Live Server**.

También puedes abrir `index.html` con doble clic para leer los textos. El formulario y algunos videos se comportan como en internet solo con Live Server o con el sitio ya publicado.

Para ver el catálogo de botones, tarjetas y formularios (no es una página pública), abre `docs/componentes.html` con Live Server.

---

## 8. Publicar

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
- [ ] Las direcciones `/docs/`, `/tools/` y `/private/` responden que el acceso está negado.

Si el formulario publicado dice «No pudimos enviar tu solicitud», pide al hosting que active el correo de PHP y que la carpeta temporal, o `private/ratelimit/`, se pueda escribir. Revisa también la carpeta de spam de marketing@.

---

## 9. Cambios que puedes hacer tú

Abre el archivo, busca el texto con **Ctrl + Shift + F**, cámbialo y guarda. No borres lo que está entre `<` y `>`.

| Quiero… | Dónde |
|---|---|
| Corregir una frase de una página | El archivo de esa página, en la tabla de la sección 3 |
| Cambiar el correo que recibe los formularios | `contacto.php`, la línea `RECIPIENT`. Tiene que ser un buzón de cadgrafics.com.mx |
| Cambiar un WhatsApp | `assets/js/site.js` y, con la búsqueda, el número viejo en todas las páginas (`525531120508` o `523314040396`) |
| Cambiar dirección o teléfono del pie | El final de cada página, en la zona del pie. Hay que repetirlo en las 16 |
| Cambiar la foto de una persona del equipo | `assets/images/team/`, misma foto cuadrada y el mismo nombre de archivo (192 × 192 px) |
| Cambiar el rojo de la marca | `assets/css/site.css`, al inicio, el valor de `--red` (`#B80007`) |

Para una página nueva, copia una parecida y pide apoyo a quien edita el código: hay que registrarla en el menú de las 16 páginas y en `sitemap.xml`. Los pasos están en [docs/README.md](docs/README.md).

---

## 10. Qué conviene no tocar

- El logo del menú y el archivo `assets/css/shared/header.css`.
- Los logos de Autodesk, Adobe, Dell y las demás marcas: hay que usarlos como los entrega cada fabricante.
- El nombre del campo oculto del formulario (`_honey`). Si se cambia, pueden colarse envíos automáticos o perderse uno real.
- Las copias de `private/leads/`: son datos de clientes.
- `tools/_ffmpeg/`: es un programa local para comprimir videos, no una parte del sitio.

Cada cambio puede guardarse en el historial del proyecto: en Cursor, pestaña **Source Control** (Ctrl + Shift + G), escribe una frase corta y confirma el commit. **Sync** o **Push** lo sube al repositorio remoto.

---

**Para quien va a editar el diseño o el formulario:** [docs/README.md](docs/README.md).
