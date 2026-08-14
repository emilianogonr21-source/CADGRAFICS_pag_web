/*
  Comportamiento de la página Dell — Cadgrafics
  ---------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)

  Bloques de este archivo:
  1. Menú, ventana Contáctanos y cookies (compartidos)
  2. Pestañas de la línea Pro
  3. Formulario largo de la sección de contacto
  4. Animaciones al aparecer contenido y cifras

  Guía del equipo: docs/README.md
*/

(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { $, $$, submitLead, initHeader, initSmoothAnchors, initStandardLeadModal, initCookieBanner } = CG;

  initHeader();
  initSmoothAnchors();
  initCookieBanner();
  initStandardLeadModal({
    source: 'modal-dell',
    label: 'Dell',
    fieldMap: {
      name: '#modal-name',
      email: '#modal-email',
      phone: '#modal-phone',
      company: '#modal-company',
    },
    focusSelector: '#modal-name',
    triggerSelector: '.textbutton-trigger',
  });

  /* ===== Pestañas de la línea Pro ===== */
  function switchTab(tab) {
    document.querySelectorAll('.pro-line .tab').forEach(function (btn) {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.pro-line .card').forEach(function (card) {
      const isActive = card.dataset.tab === tab;
      card.classList.toggle('active', isActive);
      if (isActive) card.classList.add('visible');
      card.style.display = '';
    });
  }

  document.querySelectorAll('.pro-line .tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(btn.dataset.tab);
    });
  });

  /* ===== Formulario largo de contacto ===== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const original = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';
      }
      try {
        await submitLead(
          {
            name: fd.get('name') || fd.get('nombre'),
            email: fd.get('email'),
            phone: fd.get('phone') || fd.get('telefono'),
            company: fd.get('company') || fd.get('empresa'),
            message: fd.get('message') || fd.get('mensaje'),
            source: 'dell-contact',
          },
          { label: 'Dell — formulario de página' }
        );
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = original;
        }
      }
    });
  }

  /* ===== Animaciones ===== */
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.precision-card, .form-card, .feature-box').forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  function animateStats() {
    document.querySelectorAll('.stat-item h3').forEach(function (stat) {
      const target = parseInt(stat.innerText, 10);
      const suffix = stat.innerText.replace(/[0-9]/g, '');
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          stat.innerText = target + suffix;
          clearInterval(timer);
        } else {
          stat.innerText = Math.floor(current) + suffix;
        }
      }, 30);
    });
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);
})();
