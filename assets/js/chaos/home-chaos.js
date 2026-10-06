(function () {
  'use strict';

  /* Header */
  const header=document.getElementById("header");
  const onScroll=()=>header.classList.toggle("scrolled",scrollY>40);
  addEventListener("scroll",onScroll,{passive:true});onScroll();
  const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
  menuBtn.addEventListener("click",()=>{const o=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o)});
  nav.addEventListener("click",e=>{if(e.target.tagName==="A"){nav.classList.remove("open");menuBtn.setAttribute("aria-expanded",false)}});

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

  /* Interés + UTMs */
  const $=id=>document.getElementById(id);
  document.addEventListener("click",e=>{const a=e.target.closest("[data-interest]");if(a)$("interes").value=a.dataset.interest});
  const qs=new URLSearchParams(location.search);
  ["utm_source","utm_medium","utm_campaign"].forEach(k=>{$(k).value=qs.get(k)||""});

  /* Validación */
  const form=$("leadForm"),msg=$("formMsg");
  form.addEventListener("submit",e=>{
    if(!form.checkValidity()){e.preventDefault();msg.textContent="Completa los campos obligatorios para enviar tu solicitud.";msg.classList.add("show");form.querySelector(":invalid").focus();return;}
    if(form.getAttribute("action")==="#"){e.preventDefault();msg.textContent="Solicitud enviada. Un especialista de Cadgrafics te contactará en menos de 24 horas hábiles.";msg.classList.add("show");form.reset();}
  });
})();
