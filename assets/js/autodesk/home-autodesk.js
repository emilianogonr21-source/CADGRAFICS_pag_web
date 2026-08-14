/*
  Comportamiento de la página Autodesk — Cadgrafics
  -------------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)
  Contenido: pages/autodesk/home-autodesk.html
  Apariencia: assets/css/autodesk/home-autodesk.css

  Guía del equipo: docs/README.md
*/
(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { $, $$, initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  initHeader({ lockBodyScroll: true });
  initSmoothAnchors();
  initStandardLeadModal({
    source: 'modal-autodesk',
    label: 'Autodesk',
    fieldMap: { name: '#name', email: '#email, #modal-email', phone: '#phone', company: '#company' },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger, .modal-trigger, .cta-modal-trigger',
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  $$('.fade-in').forEach((el) => observer.observe(el));

  const credentialsTrack = $('#credentialsTrack');
  if (credentialsTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const originalItems = Array.from(credentialsTrack.children);
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach((img) => {
        img.setAttribute('alt', '');
        img.setAttribute('loading', 'lazy');
      });
      credentialsTrack.appendChild(clone);
    });
  }
})();
