/*
  Comportamiento de la página Microsoft — Cadgrafics
  --------------------------------------------------
  El contenido está en: pages/microsoft/home-microsoft.html
  La apariencia está en: assets/css/microsoft/home-microsoft.css

  Bloques de este archivo:
  1. Fotos oficiales con ilustración de respaldo
  2. Menú superior
  3. Selector "¿Qué Mac necesita cada área?"
  4. Pestañas de laptops y colores de MacBook Neo
  5. Specs por chip (Mac mini / Mac Studio)
  6. Formulario de contacto (interés, UTMs y validación)

  Guía del equipo: docs/README.md
*/

(function () {
'use strict';

/* Si la foto oficial no existe, se quita el <img> y queda visible el <svg> de respaldo */
function useFallback(scope){
  scope.querySelectorAll(".dev img").forEach(img=>{
    if(img.complete&&img.naturalWidth===0){img.remove();return;}
    img.addEventListener("error",()=>img.remove(),{once:true});
  });
}
useFallback(document);

/* Header */
const header=document.getElementById("header");
const onScroll=()=>header.classList.toggle("scrolled",scrollY>40);
addEventListener("scroll",onScroll,{passive:true});onScroll();
const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
menuBtn.addEventListener("click",()=>{const o=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o)});
nav.addEventListener("click",e=>{if(e.target.tagName==="A"){nav.classList.remove("open");menuBtn.setAttribute("aria-expanded",false)}});

/* ---------- Selector por perfil ---------- */
const svgs={
  laptopNeo:'<svg viewBox="0 0 220 140" style="--body:#2E3550;--base:#9AA6D6"><use href="#i-laptop"/></svg>',
  laptopAir:'<svg viewBox="0 0 220 140" style="--body:#3A3D44"><use href="#i-laptop"/></svg>',
  laptopPro:'<svg viewBox="0 0 220 140" style="--base:url(#alu-dark)"><use href="#i-laptop"/></svg>',
  aio:'<svg viewBox="0 0 200 190" style="--body:#B9C7DA"><use href="#i-aio"/></svg>',
  mini:'<svg viewBox="0 0 140 70" style="max-height:130px"><use href="#i-mini"/></svg>',
  studio:'<svg viewBox="0 0 140 110" style="max-height:180px"><use href="#i-studio"/></svg>'
};
const recs={
  admin:{n:"MacBook Neo",img:"macbook-neo",svg:"laptopNeo",why:"Toda la experiencia de macOS para correo, documentos y navegador, al precio más accesible de una Mac.",tags:["A18 Pro","13 pulgadas","Hasta 16 h"],go:"#laptops",tab:"neo"},
  movil:{n:"MacBook Air",img:"macbook-air",svg:"laptopAir",why:"Ligera, sin ventilador y con 16 GB de memoria desde el modelo base. Aguanta un día completo de juntas y visitas.",tags:["M5","13 o 15 pulgadas","Wi-Fi 7"],go:"#laptops",tab:"air"},
  creativo:{n:"MacBook Pro",img:"macbook-pro",svg:"laptopPro",why:"M5 Pro o M5 Max, pantalla XDR y Thunderbolt 5 para editar video, compilar y trabajar en 3D sin esperas.",tags:["Hasta 128 GB","Pantalla XDR","Thunderbolt 5"],go:"#laptops",tab:"pro"},
  fijo:{n:"iMac",img:"imac",svg:"aio",why:"Todo en uno: pantalla 4.5K, cámara y bocinas en un solo equipo. Una instalación limpia para atención a clientes.",tags:["24 pulgadas","Todo en uno","7 colores"],go:"#escritorio"},
  flex:{n:"Mac mini",img:"mac-mini",svg:"mini",why:"Con M6 ofrece IA hasta 4 veces más rápida que la generación anterior, en un equipo que se conecta a tu monitor actual.",tags:["M6 o M5 Pro","Hasta 64 GB","Ethernet 2.5 Gb"],go:"#escritorio"},
  pesado:{n:"Mac Studio",img:"mac-studio",svg:"studio",why:"Con M5 Ultra llega a 512 GB de memoria unificada para color en 8K, efectos visuales y modelos de IA locales.",tags:["M5 Max o M5 Ultra","Hasta 512 GB","Hasta 8 monitores"],go:"#escritorio"}
};
const match=document.getElementById("match");
function showRec(k){
  const r=recs[k];
  match.classList.remove("enter");void match.offsetWidth;match.classList.add("enter");
  match.innerHTML=`<div><p class="lbl">Te recomendamos</p><h3>${r.n}</h3><p class="why">${r.why}</p></div>
    <div class="dev"><img src="../../assets/images/mac/${r.img}.webp" alt="">${svgs[r.svg]}</div>
    <div class="row"><div class="chips">${r.tags.map(t=>`<span>${t}</span>`).join("")}</div>
    <a class="btn btn-primary" href="${r.go}" ${r.tab?`data-tab="${r.tab}"`:""}>Ver ${r.n}</a></div>`;
  useFallback(match);
}
document.querySelectorAll(".profile").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".profile").forEach(x=>x.setAttribute("aria-pressed",x===b));
  showRec(b.dataset.p);
}));
showRec("admin");

/* ---------- Pestañas de laptops ---------- */
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectTab(key,focus){
  tabs.forEach(t=>{
    const on=t.dataset.key===key;
    t.setAttribute("aria-selected",on);t.tabIndex=on?0:-1;
    const p=document.getElementById(t.getAttribute("aria-controls"));
    p.hidden=!on;if(on){p.classList.remove("enter");void p.offsetWidth;p.classList.add("enter");if(focus)t.focus();}
  });
}
tabs.forEach((t,i)=>{
  t.addEventListener("click",()=>selectTab(t.dataset.key));
  t.addEventListener("keydown",e=>{
    if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const n=tabs[(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length];selectTab(n.dataset.key,true);}
  });
});
document.addEventListener("click",e=>{const a=e.target.closest("[data-tab]");if(a)selectTab(a.dataset.tab)});

/* Colores de MacBook Neo */
document.querySelectorAll(".sw").forEach(s=>s.addEventListener("click",()=>{
  document.querySelectorAll(".sw").forEach(x=>x.setAttribute("aria-pressed",x===s));
  const [body,base]=s.dataset.c.split("|");const svg=document.getElementById("neoSvg");
  svg.style.setProperty("--body",body);svg.style.setProperty("--base",base);
  document.getElementById("neoName").textContent=s.dataset.n;
}));

/* ---------- Specs por chip (Mac mini / Mac Studio) ---------- */
const specs={
  "mini-m6":[["CPU","12 núcleos"],["GPU","12 núcleos"],["Memoria","16 GB, hasta 32 GB"],["Ancho de banda","170 GB/s"]],
  "mini-pro":[["CPU","Hasta 18 núcleos"],["GPU","Hasta 20 núcleos"],["Memoria","Hasta 64 GB"],["Ancho de banda","307 GB/s"]],
  "studio-max":[["CPU","18 núcleos"],["GPU","Hasta 40 núcleos"],["Memoria","Hasta 128 GB"],["Puertos","Thunderbolt 5"]],
  "studio-ultra":[["CPU","Hasta 36 núcleos"],["GPU","Hasta 80 núcleos"],["Memoria","Hasta 512 GB"],["Ancho de banda","1.2 TB/s"]]
};
function renderSpec(key){
  const target=document.getElementById(key.startsWith("mini")?"kv-mini":"kv-studio");
  target.innerHTML=specs[key].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
}
document.querySelectorAll(".chipsel button").forEach(b=>b.addEventListener("click",()=>{
  b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));
  renderSpec(b.dataset.spec);
}));
renderSpec("mini-m6");renderSpec("studio-max");

/* Interés del botón presionado + UTMs */
document.addEventListener("click",e=>{const a=e.target.closest("[data-interest]");if(a)document.getElementById("interes").value=a.dataset.interest});
const qs=new URLSearchParams(location.search);
["utm_source","utm_medium","utm_campaign"].forEach(k=>{document.getElementById(k).value=qs.get(k)||""});

/* Validación */
const form=document.getElementById("leadForm"),msg=document.getElementById("formMsg");
form.addEventListener("submit",e=>{
  if(!form.checkValidity()){e.preventDefault();msg.textContent="Completa los campos obligatorios para enviar tu solicitud.";msg.classList.add("show");form.querySelector(":invalid").focus();return;}
  if(form.getAttribute("action")==="#"){e.preventDefault();msg.textContent="Solicitud enviada. Un especialista de Cadgrafics te contactará en menos de 24 horas hábiles.";msg.classList.add("show");form.reset();}
});

})();
