/*
  Comportamiento de AEC Collection — Cadgrafics
  ---------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)
  Contenido: pages/autodesk/aec-collection.html
  Apariencia: assets/css/autodesk/aec-collection.css

  Guía del equipo: docs/README.md
*/
(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { $$, initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initHeader({ lockBodyScroll: true });
  initSmoothAnchors();
  initStandardLeadModal({
    source: 'modal-aec-collection',
    label: 'AEC Collection',
    fieldMap: { name: '#name', email: '#email', phone: '#phone', company: '#company' },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger',
  });

  /* Animaciones al hacer scroll */
  const animateElements = $$('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1,
      }
    );
    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animateElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();
