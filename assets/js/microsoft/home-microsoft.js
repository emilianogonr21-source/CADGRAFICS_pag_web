/*
  Comportamiento de la página Microsoft 365 — Cadgrafics
  ------------------------------------------------------
  El contenido está en: pages/microsoft/home-microsoft.html
  La apariencia está en: assets/css/microsoft/home-microsoft.css
  Depende de: assets/js/shared/site-common.js (menú superior)

  Bloques de este archivo:
  1. Menú superior
  2. Demostración de Copilot (pestañas por app)
  3. Recomendador de plan
  4. Formulario de contacto (interés, UTMs y validación)

  Guía del equipo: docs/README.md
*/

(function () {
'use strict';

/* Menú superior (compartido) */
if(window.Cadgrafics)window.Cadgrafics.initHeader({lockBodyScroll:true});
else console.error("Cadgrafics site-common.js no cargó");

/* Demostración de Copilot */
const ex={
  outlook:{q:"Resume este hilo con el proveedor y redacta una respuesta.",a:"El proveedor confirmó entrega para el 15 de octubre y pide la orden firmada.<ul><li>Borrador listo: agradecer, adjuntar la orden y confirmar la fecha.</li></ul>"},
  teams:{q:"¿Qué acuerdos salieron de la reunión de ventas?",a:"Se acordaron 3 puntos:<ul><li>Enviar la propuesta a Grupo Norte el viernes.</li><li>Laura actualiza el pronóstico del trimestre.</li><li>Próxima revisión el lunes a las 10:00.</li></ul>"},
  excel:{q:"¿Qué producto creció más este trimestre?",a:"La línea de servicios creció 31%, la mayor alza del trimestre.<ul><li>Agregué una gráfica de barras con la comparación por mes.</li></ul>"},
  ppt:{q:"Crea una presentación con el informe anual.",a:"Listo: 8 diapositivas con portada, resultados clave, gráficas y próximos pasos.<ul><li>Apliqué la plantilla de tu empresa.</li></ul>"}
};
const pd=document.getElementById("pdBody");
function showEx(k){
  pd.classList.remove("enter");void pd.offsetWidth;pd.classList.add("enter");
  pd.innerHTML=`<div class="q">${ex[k].q}</div><div class="a">${ex[k].a}</div>`;
}
document.querySelectorAll("[data-ex]").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("[data-ex]").forEach(x=>x.setAttribute("aria-pressed",x===b));showEx(b.dataset.ex);
}));
showEx("outlook");

/* Recomendador de plan */
const $=id=>document.getElementById(id);
const st={size:"small",desk:true,sec:false,ai:false};
const info={
  basic:{n:"Business Basic",why:"Para equipos que trabajan desde el navegador y el celular.",f:["Correo empresarial con tu dominio","Word, Excel y PowerPoint en web y móvil","Teams para chat y reuniones","1 TB en OneDrive por usuario"]},
  standard:{n:"Business Standard",why:"Office completo instalado en las computadoras de tu equipo.",f:["Apps de escritorio para PC y Mac","Hasta 5 PC o Mac, 5 tabletas y 5 teléfonos","Teams y seminarios web","1 TB en OneDrive por usuario"]},
  premium:{n:"Business Premium",why:"Todo Office más la protección de tus equipos e información.",f:["Todo lo de Standard","Defender contra ransomware y phishing","Intune para administrar laptops y celulares","Entra ID P1 para controlar accesos"]},
  ent:{n:"Microsoft 365 E3 / E5",why:"Planes Enterprise sin límite de usuarios para grandes organizaciones.",f:["Productividad completa a gran escala","Windows Enterprise","Cumplimiento y seguridad avanzada (E5)","Administración centralizada"]}
};
function rec(){
  let k=st.size==="big"?"ent":st.sec?"premium":st.desk?"standard":"basic";
  const r=info[k];const name=r.n+(st.ai?" + Copilot":"");
  $("recName").textContent=name;
  $("recWhy").textContent=r.why;
  $("recList").innerHTML=r.f.map(x=>`<li><span>✓</span><span>${x}</span></li>`).join("")+(st.ai?"<li><span>✓</span><span>Copilot en Word, Excel, Outlook y Teams</span></li>":"");
  $("tip").textContent=st.ai?"Copilot no tiene que ser para todos: puedes asignarlo solo a quienes más lo aprovechen.":
    k==="standard"?"Si tu equipo maneja información sensible, considera Premium para proteger correo y dispositivos.":
    k==="basic"?"Puedes combinar planes: Basic para unos usuarios y Standard o Premium para otros.":
    k==="premium"?"Premium es el plan más completo para empresas de hasta 300 usuarios.":"Te ayudamos a definir si tu organización necesita E3 o E5.";
  $("estimado").value=name;
}
document.querySelectorAll("[data-size]").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("[data-size]").forEach(x=>x.setAttribute("aria-pressed",x===b));st.size=b.dataset.size;rec();
}));
document.querySelectorAll(".sw-btn[data-q]").forEach(b=>b.addEventListener("click",()=>{
  st[b.dataset.q]=!st[b.dataset.q];b.setAttribute("aria-checked",st[b.dataset.q]);rec();
}));
$("calcCta").addEventListener("click",()=>{$("interes").value="Recomendador";});
rec();

/* Formulario de contacto: interés, UTMs, validación y envío por WhatsApp (compartido) */
if(window.Cadgrafics)window.Cadgrafics.initLandingLeadForm({
  label:"Microsoft 365",source:"Landing Microsoft",
  extraFields:[{name:"usuarios",label:"Usuarios"},{name:"situacion",label:"Situación"},{name:"recomendacion",label:"Plan sugerido"},{name:"interes",label:"Botón"}]
});

})();
