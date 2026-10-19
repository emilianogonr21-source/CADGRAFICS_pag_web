/* =========================================================
   1. CONFIGURACIÓN: cambia aquí tus datos de contacto
   ========================================================= */
const CONFIG = {
  whatsapp: "525531120508",
  telefono: "+525531120508",
  email: "sandra.alvarez@cadgrafics.com.mx",
  nombres: { pdm: "Product Design & Manufacturing Collection", me: "Media & Entertainment Collection" }
};

/* =========================================================
   2. HERRAMIENTAS DE CADA COLECCIÓN
   f = categoría para los filtros · n = novedad 2027
   ========================================================= */
const TOOLS = {
  pdm: [
    { ab:"INV", l:"I", name:"Inventor Professional", c:"#E8A21B", f:"dis", n:true,  d:"Diseño mecánico 3D: modelado, simulación, visualización y documentación." },
    { ab:"CAD", l:"A", name:"AutoCAD", c:"#C8102E", f:"dis", n:true, d:"Dibujo 2D y 3D con toolsets especializados como Mechanical y Electrical." },
    { ab:"FUS", l:"F", name:"Fusion", c:"#E26B12", f:"dis", n:true, d:"Plataforma en la nube para diseño de producto, electrónica, simulación y CAM." },
    { ab:"MAX", l:"3", name:"3ds Max", c:"#1F9AA8", f:"dis", d:"Modelado y visualización 3D para presentar tus diseños." },
    { ab:"NAS", l:"N", name:"Inventor Nastran", c:"#B25E0C", f:"sim", d:"Análisis por elemento finito integrado en tu entorno CAD." },
    { ab:"ITA", l:"T", name:"Inventor Tolerance Analysis", c:"#B25E0C", f:"sim", d:"Estima cómo la variación dimensional afecta el costo de manufactura." },
    { ab:"CAM", l:"C", name:"Inventor CAM Ultimate", c:"#8F4A0B", f:"fab", d:"Programación CAD/CAM integrada de 2.5 a 5 ejes." },
    { ab:"NST", l:"N", name:"Inventor Nesting", c:"#8F4A0B", f:"fab", d:"Anidado de forma real para aprovechar mejor la lámina." },
    { ab:"FDU", l:"F", name:"Factory Design Utilities", c:"#6E7A1E", f:"fab", d:"Planea y valida la distribución de tu planta de manufactura." },
    { ab:"VLT", l:"V", name:"Vault Basic", c:"#2D5DAA", f:"dat", n:true, d:"Gestión de archivos de diseño y control de versiones para tu equipo." },
    { ab:"NAV", l:"N", name:"Navisworks Manage", c:"#2D5DAA", f:"dat", d:"Coordina disciplinas y detecta interferencias antes de construir." },
    { ab:"RCP", l:"R", name:"ReCap Pro", c:"#7A2A80", f:"dat", d:"Captura de realidad y escaneo 3D." },
    { ab:"DRV", l:"D", name:"Autodesk Drive", c:"#5C6168", f:"dat", d:"Almacenamiento en la nube para compartir archivos." },
    { ab:"RND", l:"R", name:"Autodesk Rendering", c:"#5C6168", f:"dis", d:"Render en la nube para imágenes de alta calidad." }
  ],
  me: [
    { ab:"MAYA", l:"M", name:"Maya", c:"#1E9CA6", f:"ani", n:true, d:"Animación de personajes, efectos y producción 3D profesional." },
    { ab:"MAX", l:"3", name:"3ds Max", c:"#1F9AA8", f:"mod", n:true, d:"Modelado y visualización 3D para juegos, diseño y producción." },
    { ab:"ARN", l:"A", name:"Arnold", c:"#3B3F46", f:"ren", n:true, d:"Render con iluminación global. Licencias para varias máquinas." },
    { ab:"BIF", l:"B", name:"Bifrost para Maya", c:"#2A6DB5", f:"ren", n:true, d:"Programación visual para efectos complejos. Hasta 15 máquinas por licencia." },
    { ab:"MOB", l:"M", name:"MotionBuilder", c:"#1E9CA6", f:"ani", d:"Animación de personajes y captura de movimiento en tiempo real." },
    { ab:"GOL", l:"G", name:"Golaem", c:"#4C5A9E", f:"ani", d:"Simulación de multitudes dentro de Maya." },
    { ab:"MUD", l:"M", name:"Mudbox", c:"#6F737A", f:"mod", d:"Escultura y pintura digital. Última colección que lo incluye." },
    { ab:"FLOW", l:"F", name:"Flow Studio", c:"#C8102E", f:"ia", n:true, d:"Herramientas de VFX con IA que convierten video en escenas CG. Nivel Pro." },
    { ab:"CHR", l:"C", name:"Character Generator", c:"#4C5A9E", f:"mod", d:"Crea personajes base listos para rig y animación." },
    { ab:"RCP", l:"R", name:"ReCap Pro", c:"#7A2A80", f:"ia", d:"Captura de realidad y escaneo 3D." },
    { ab:"RND", l:"R", name:"Autodesk Rendering", c:"#5C6168", f:"ren", d:"Render en la nube para imágenes de alta calidad." }
  ]
};

/* Insignias de certificación (texto; reemplaza por imágenes oficiales si las tienes) */
const CERTS = [
  { k:"plat", top:"AUTODESK", mid:"PLATINUM", bot:"SOLUTION PROVIDER" },
  { k:"acc",  top:"AUTODESK", mid:"CUSTOMER SUCCESS", bot:"ACCREDITED" },
  { k:"acc",  top:"AUTODESK", mid:"CONSULTING IMPLEMENTATION FRAMEWORK", bot:"ACCREDITED" },
  { k:"spe",  top:"AUTODESK", mid:"BUILDING ARCHITECTURE", bot:"SPECIALIZED" },
  { k:"spe",  top:"AUTODESK", mid:"CONSTRUCTION", bot:"SPECIALIZED" },
  { k:"spe",  top:"AUTODESK", mid:"MECHANICAL, ELECTRICAL & PLUMBING", bot:"SPECIALIZED" },
  { k:"spe",  top:"AUTODESK", mid:"TRANSPORTATION INFRASTRUCTURE", bot:"SPECIALIZED" }
];

/* =========================================================
   3. RENDER DE HERRAMIENTAS Y CERTIFICACIONES
   ========================================================= */
const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
function renderTools(key){
  const box = document.getElementById("tools-" + key);
  box.innerHTML = TOOLS[key].map((t, i) => `
    <div class="tool" data-f="${t.f}">
      <button type="button" aria-expanded="false" aria-describedby="tdesc-${key}-${i}">
        <span class="inner">
          <span class="front"><span class="chip" style="--c:${t.c}"><i>${t.l}</i><small>${t.ab}</small></span><span class="name">${esc(t.name)}</span></span>
          <span class="back"><b>${esc(t.name)}</b><span id="tdesc-${key}-${i}">${esc(t.d)}</span>${t.n ? "<em>Novedades 2027</em>" : ""}</span>
        </span>
      </button>
      ${t.n ? '<span class="new" aria-hidden="true">2027</span>' : ""}
    </div>`).join("");
}
renderTools("pdm"); renderTools("me");

const track = document.getElementById("certTrack");
const badge = (c, hidden) => `<div class="badge ${c.k}"${hidden ? ' aria-hidden="true"' : ""}><span class="top">${c.top}</span><span class="mid">${c.mid}</span><span class="bot">${c.bot}</span></div>`;
track.innerHTML = CERTS.map(c => badge(c,false)).join("") + CERTS.map(c => badge(c,true)).join(""); // duplicado para el carrusel infinito

/* Tocar una herramienta voltea la tarjeta (útil en celular y con teclado) */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".tool button");
  document.querySelectorAll('.tool button[aria-expanded="true"]').forEach(x => { if (x !== b) x.setAttribute("aria-expanded","false"); });
  if (b) b.setAttribute("aria-expanded", b.getAttribute("aria-expanded") === "true" ? "false" : "true");
});

/* Filtros por categoría */
document.querySelectorAll(".filters").forEach((group) => {
  group.addEventListener("click", (e) => {
    const b = e.target.closest(".fb"); if (!b) return;
    group.querySelectorAll(".fb").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const grid = group.parentElement.querySelector(`.tools[data-c="${group.dataset.c}"]`);
    grid.querySelectorAll(".tool").forEach(t => { t.hidden = !(b.dataset.f === "all" || t.dataset.f === b.dataset.f); });
  });
});

/* =========================================================
   4. CAMBIO DE COLECCIÓN
   La URL guarda la elección: ?coleccion=pdm o ?coleccion=me
   ========================================================= */
/* Guarda la colección en la URL solo cuando la página está publicada en un sitio web.
   En vistas previas (iframes, archivos locales) el navegador no lo permite, así que se omite. */
function saveInUrl(key){
  if (!/^https?:$/.test(location.protocol)) return;
  try {
    const url = new URL(location.href);
    url.searchParams.set("coleccion", key);
    history.replaceState(null, "", url);
  } catch (e) { /* la página sigue funcionando aunque no se pueda actualizar la URL */ }
}

function setCollection(key){
  if (!TOOLS[key]) key = "pdm";
  document.body.dataset.col = key;
  document.querySelectorAll(`[data-c="${key}"]`).forEach(el => { el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); });
  updateLinks();
  saveInUrl(key);
}

/* =========================================================
   5. PESTAÑAS DE NOVEDADES (accesibles con flechas)
   ========================================================= */
document.querySelectorAll('#novedades [role="tablist"]').forEach((list) => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panels = [...list.parentElement.querySelectorAll('[role="tabpanel"]')];
  const select = (tab, focus) => {
    tabs.forEach(t => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
    panels.forEach(p => { const on = p.dataset.np === tab.dataset.np; p.hidden = !on; if (on){ p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap"); } });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") select(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
});

/* =========================================================
   6. ENLACES DE CONTACTO (llevan el nombre de la colección)
   ========================================================= */
function updateLinks(){
  const col = CONFIG.nombres[document.body.dataset.col];
  document.querySelectorAll("[data-link]").forEach((a) => {
    const k = a.dataset.link;
    if (k === "whatsapp") a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola, me interesa la " + col + " de Autodesk")}`;
    if (k === "email") a.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Información " + col)}`;
    if (k === "phone") a.href = `tel:${CONFIG.telefono}`;
  });
}

/* =========================================================
   7. MENÚ COMPARTIDO
   ========================================================= */
if (window.Cadgrafics) {
  Cadgrafics.initHeader({ lockBodyScroll: true });
  Cadgrafics.initSmoothAnchors();
}
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll('.tool button[aria-expanded="true"]').forEach(x => x.setAttribute("aria-expanded","false"));
});

/* Inicio */
setCollection(new URLSearchParams(location.search).get("coleccion") || "pdm");
