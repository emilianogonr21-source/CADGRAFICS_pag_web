(function () {
  'use strict';

  /* Menú superior compartido (assets/js/shared/site-common.js) */
  if(window.Cadgrafics)window.Cadgrafics.initHeader({lockBodyScroll:true});

  /* Comparador modelo / render */
  const rv=document.getElementById("reveal"),rr=rv.querySelector("input");
  const setX=v=>{rv.style.setProperty("--x",v+"%");rr.value=v};
  setTimeout(()=>setX(30),700);
  setTimeout(()=>{setX(55);setTimeout(()=>rv.classList.remove("intro"),1300)},2000);
  rr.addEventListener("input",()=>{rv.classList.remove("intro");setX(rr.value)});

  /* Pestañas de productos */
  const pts=[...document.querySelectorAll(".pt")];
  function showP(k,focus){
    pts.forEach(t=>{const on=t.dataset.p===k;t.setAttribute("aria-selected",on);t.tabIndex=on?0:-1;if(on&&focus)t.focus()});
    document.querySelectorAll(".pp").forEach(p=>{const on=p.dataset.p===k;p.hidden=!on;if(on){p.classList.remove("enter");void p.offsetWidth;p.classList.add("enter")}});
  }
  pts.forEach((t,i)=>{
    t.addEventListener("click",()=>showP(t.dataset.p));
    t.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const n=pts[(i+(e.key==="ArrowRight"?1:-1)+pts.length)%pts.length];showP(n.dataset.p,true)}});
  });

  /* Formulario de contacto: interés, UTMs, validación y envío por WhatsApp (compartido) */
  if(window.Cadgrafics)window.Cadgrafics.initLandingLeadForm({
    label:"Chaos",source:"Landing Chaos",
    extraFields:[{name:"producto",label:"Producto"},{name:"situacion",label:"Situación"},{name:"interes",label:"Botón"}]
  });
})();
