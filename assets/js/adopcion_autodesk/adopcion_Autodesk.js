/* =========================================================
   Programa de Adopción Cadgrafics · Autodesk
   adopcion_Autodesk.js
   ========================================================= */

/* ---------- 1. CONFIGURACIÓN: cambia aquí tus enlaces ---------- */
const CONFIG = {
  calendly: "https://calendly.com/TU-ENLACE",            // ← pega aquí tu liga de Calendly
  whatsapp: "525531120508",                               // número con lada de país, sin + ni espacios
  email: "sandra.alvarez@cadgrafics.com.mx",
  mensajeWhatsApp: "Hola, me interesa el Programa de Adopción Autodesk de Cadgrafics",
  asuntoCorreo: "Programa de Adopción Autodesk"
};

/* ---------- 2. Enlaces de contacto ----------
   Todos los botones con data-link="calendly | whatsapp | email" toman su URL de CONFIG.
   Si el botón tiene data-ws="Nombre del taller", ese nombre viaja en el mensaje. */
function buildLink(type, taller) {
  if (type === "calendly") {
    return taller
      ? `${CONFIG.calendly}?a1=${encodeURIComponent("Taller: " + taller)}`
      : CONFIG.calendly;
  }
  if (type === "whatsapp") {
    const text = CONFIG.mensajeWhatsApp + (taller ? ` (taller ${taller})` : "");
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  }
  if (type === "email") {
    const subject = CONFIG.asuntoCorreo + (taller ? ` - ${taller}` : "");
    return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}`;
  }
  return "#";
}

document.querySelectorAll("[data-link]").forEach((a) => {
  a.href = buildLink(a.dataset.link, a.dataset.ws);
});

/* ---------- 3. Menú compartido del sitio ---------- */
if (window.Cadgrafics) {
  Cadgrafics.initHeader({ lockBodyScroll: true });
  Cadgrafics.initSmoothAnchors();
}

/* ---------- 4. Barra fija de contacto ----------
   Aparece después del hero y se oculta al llegar a la sección de contacto. */
const dock = document.getElementById("dock");
const contact = document.getElementById("contacto");
const dockLinks = dock ? dock.querySelectorAll("a") : [];

function setDock(visible) {
  if (!dock || dock.classList.contains("show") === visible) return;
  dock.classList.toggle("show", visible);
  dock.setAttribute("aria-hidden", String(!visible));
  dockLinks.forEach((a) => (a.tabIndex = visible ? 0 : -1));
}

function onScroll() {
  if (dock && contact) {
    const contactTop = contact.getBoundingClientRect().top;
    setDock(window.scrollY > window.innerHeight * 0.6 && contactTop > window.innerHeight * 0.6);
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

/* ---------- 5. Explorador de talleres ----------
   Los botones de área (.role) y las tarjetas (.wsc) comparten data-k
   con el panel (.wsp) que muestran: arq, est, mep, dm. */
const wsButtons = document.querySelectorAll(".role, .wsc");
const wsPanels = document.querySelectorAll(".wsp");

function showWorkshop(key) {
  wsButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === key)));
  wsPanels.forEach((panel) => {
    const active = panel.dataset.k === key;
    panel.hidden = !active;
    if (active) {
      panel.classList.remove("enter");
      void panel.offsetWidth;            // reinicia la animación de entrada
      panel.classList.add("enter");
    }
  });
}
wsButtons.forEach((b) => b.addEventListener("click", () => showWorkshop(b.dataset.k)));

/* Abre un taller directamente desde la URL: pagina.html#ws-mep */
const fromHash = location.hash.match(/^#ws-(arq|est|mep|dm)$/);
if (fromHash) showWorkshop(fromHash[1]);
