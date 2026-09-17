/*
  Comportamiento de Acrobat Studio — Cadgrafics
  ---------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)
  Contenido: pages/adobe/acrobat-studio.html
  Apariencia: assets/css/adobe/acrobat-studio.css

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
  initSmoothAnchors({ offset: 80 });
  initStandardLeadModal({
    source: 'modal-acrobat-studio',
    label: 'Acrobat Studio',
    fieldMap: {
      name: '#name',
      email: '#modal-email',
      phone: '#phone',
      company: '#company',
    },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger',
  });

  /* Tabs */
  const tabButtons = $$('.tab-btn');
  const tabContents = $$('.tab-content');

  function activateTab(btn, options) {
    const opts = options || {};
    tabButtons.forEach((b) => {
      const isSelected = b === btn;
      b.setAttribute('aria-selected', String(isSelected));
      b.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    tabContents.forEach((c) => {
      const isActive = c.id === btn.getAttribute('aria-controls');
      c.classList.toggle('active', isActive);
      if (isActive) {
        c.removeAttribute('hidden');
        c.setAttribute('tabindex', '0');
      } else {
        c.setAttribute('hidden', '');
        c.removeAttribute('tabindex');
      }
    });

    if (opts.focus) btn.focus();
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn));
    btn.addEventListener('keydown', (e) => {
      const index = tabButtons.indexOf(btn);
      let newIndex = index;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabButtons.length;
      else if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabButtons.length - 1;
      else return;
      e.preventDefault();
      activateTab(tabButtons[newIndex], { focus: true });
    });
  });

  /* Animaciones al scroll */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  $$('.feature-card-2, .video-card, .solution-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * (1 - Math.pow(1 - progress, 3));
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('.stat-value', entry.target).forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = $('.stats');
  if (statsSection) statsObserver.observe(statsSection);

  const yearElement = $('#year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
})();
