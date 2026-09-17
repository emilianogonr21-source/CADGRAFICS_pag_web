/*
  Comportamiento de la página Adobe — Cadgrafics
  ----------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)
  Contenido: pages/adobe/home-adobe.html
  Apariencia: assets/css/adobe/home-adobe.css

  Guía del equipo: docs/README.md
*/
(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  initHeader({ lockBodyScroll: true });
  initSmoothAnchors({ offset: 80 });
  initStandardLeadModal({
    source: 'modal-adobe',
    label: 'Adobe',
    fieldMap: {
      name: '#name',
      email: '#modal-email',
      phone: '#phone',
      company: '#company',
    },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger',
  });

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) {
      element.textContent = target + suffix;
      return;
    }
    const duration = 2000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(target * ease) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        const counter = entry.target.querySelector('.stat-number');
        if (counter && !counter.classList.contains('counted')) {
          counter.classList.add('counted');
          animateCounter(counter);
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

  const heroVideo = document.querySelector('.hero-video');
  if (
    heroVideo &&
    (window.innerWidth <= 768 ||
      (navigator.connection && navigator.connection.saveData) ||
      prefersReducedMotion)
  ) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    heroVideo.removeAttribute('loop');
  }
})();
