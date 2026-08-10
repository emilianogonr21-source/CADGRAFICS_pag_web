(function () {
  'use strict';

  /* ============================================================
     UTILIDADES
     ============================================================ */
  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* ============================================================
     HEADER SCROLL EFFECT
     ============================================================ */
  const header = $('#header');
  let headerTicking = false;

  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
    headerTicking = false;
  };

  if (header) {
    window.addEventListener('scroll', () => {
      if (!headerTicking) {
        requestAnimationFrame(updateHeader);
        headerTicking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  /* ============================================================
     MOBILE MENU TOGGLE
     ============================================================ */
  const mobileToggle = $('#mobileToggle');
  const navMenu = $('#navMenu');

  const closeMobileMenu = () => {
    if (!navMenu?.classList.contains('active')) return;
    navMenu.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileToggle?.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
    const icon = mobileToggle && $('svg use', mobileToggle);
    if (icon) icon.setAttribute('href', '#icon-menu');
    $$('.nav-item.active, .dropdown-submenu.active').forEach(el => el.classList.remove('active'));
    $$('[aria-expanded="true"]', navMenu).forEach(el => el.setAttribute('aria-expanded', 'false'));
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isActive));
      mobileToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isActive ? 'hidden' : '';

      const icon = $('svg use', mobileToggle);
      if (icon) icon.setAttribute('href', isActive ? '#icon-close' : '#icon-menu');

      if (!isActive) {
        $$('.nav-item.active, .dropdown-submenu.active').forEach(el => el.classList.remove('active'));
        $$('[aria-expanded="true"]', navMenu).forEach(el => el.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  /* ============================================================
     DROPDOWN MENUS
     ============================================================ */
  const setupDropdown = (selector, parentSelector) => {
    $$(selector).forEach(link => {
      const toggleDropdown = (e) => {
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const parent = link.closest(parentSelector);
        const isActive = parent?.classList.toggle('active');
        link.setAttribute('aria-expanded', String(!!isActive));

        $$(`${parentSelector}.active`).forEach(sib => {
          if (sib !== parent) {
            sib.classList.remove('active');
            $('a', sib)?.setAttribute('aria-expanded', 'false');
          }
        });
      };

      link.addEventListener('click', toggleDropdown);
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleDropdown(e);
      });
    });
  };

  setupDropdown('.nav-item > a', '.nav-item');
  setupDropdown('.dropdown-submenu > a', '.dropdown-submenu');

  /* ============================================================
     SMOOTH SCROLL PARA ANCHORS INTERNOS
     ============================================================ */
  const getHeaderHeight = () => (header ? header.offsetHeight : 80);

  $$('a[href^="#"]:not(.textbutton-trigger)').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      closeMobileMenu();

      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     MODAL DE CONTACTO (con Focus Trap)
     ============================================================ */
  const modal = $('#contactModal');
  const openModalBtns = $$('.textbutton-trigger');
  const closeModalBtn = $('#closeModal');
  const contactForm = $('#contactForm');
  const successMessage = $('#successMessage');
  let lastFocusedElement = null;

  function openModal() {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => $('#contact-name')?.focus());
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    contactForm?.reset();
    if (contactForm) contactForm.style.display = '';
    successMessage?.classList.remove('show');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModalBtn?.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();

      if (e.key === 'Tab' && modal.classList.contains('active')) {
        const focusable = $$('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', modal);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ============================================================
     ENVÍO DE FORMULARIO
     ============================================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      contactForm.style.display = 'none';
      successMessage?.classList.add('show');
      setTimeout(closeModal, 3000);
    });
  }

  /* ============================================================
     TABS (ARIA + teclado)
     ============================================================ */
  const tabButtons = $$('.tab-btn');
  const tabContents = $$('.tab-content');

  function activateTab(btn, { focus = false } = {}) {
    tabButtons.forEach(b => {
      const isSelected = b === btn;
      b.setAttribute('aria-selected', String(isSelected));
      b.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    tabContents.forEach(c => {
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

    if (focus) btn.focus();
  }

  tabButtons.forEach(btn => {
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

  /* ============================================================
     INTERSECTION OBSERVER (animaciones)
     ============================================================ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  $$('.feature-card-2, .video-card, .solution-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });

  /* ============================================================
     CONTADORES ANIMADOS
     ============================================================ */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.stat-value', entry.target).forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = $('.stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* ============================================================
     AÑO DINÁMICO
     ============================================================ */
  const yearElement = $('#year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

})();
