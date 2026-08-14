/*
  Comportamiento de pages/adobe/acrobat-studio.html
  Separado del HTML (mismo patron que Dell).
  Edita este archivo para cambiar la comportamiento (menus, formularios, animaciones) de la pagina.
*/
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

  $$('a[href^="#"]:not([data-modal-trigger])').forEach(anchor => {
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
     MODAL Contáctanos (mismo que home-adobe cotización)
     ============================================================ */
  const modalOverlay = $('#modal-overlay');
  const modalForm = $('#modal-form');
  const modalSubmitBtn = $('#modal-submit-btn');
  const modalFormMessage = $('#modal-form-message');
  const modalCloseBtn = modalOverlay && $('[data-modal-close]', modalOverlay);
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let triggerElement = null;

  function openModal(e) {
    if (!modalOverlay) return;
    triggerElement = e.currentTarget;
    if (modalFormMessage) {
      modalFormMessage.textContent = '';
      modalFormMessage.className = 'form-message';
    }
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const mainContent = $('main');
    const headerContent = $('.header');
    if (mainContent) {
      mainContent.setAttribute('inert', '');
      mainContent.setAttribute('aria-hidden', 'true');
    }
    if (headerContent) {
      headerContent.setAttribute('inert', '');
      headerContent.setAttribute('aria-hidden', 'true');
    }
    requestAnimationFrame(() => {
      modalCloseBtn?.focus();
      modalOverlay.removeEventListener('keydown', trapFocus);
      modalOverlay.addEventListener('keydown', trapFocus);
    });
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const mainContent = $('main');
    const headerContent = $('.header');
    if (mainContent) {
      mainContent.removeAttribute('inert');
      mainContent.removeAttribute('aria-hidden');
    }
    if (headerContent) {
      headerContent.removeAttribute('inert');
      headerContent.removeAttribute('aria-hidden');
    }
    modalOverlay.removeEventListener('keydown', trapFocus);
    if (triggerElement) triggerElement.focus();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusableContent = $$(focusableSelector, modalOverlay);
    if (focusableContent.length === 0) return;
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];
    if (!focusableContent.includes(document.activeElement)) {
      e.preventDefault();
      firstFocusable.focus();
      return;
    }
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) { lastFocusable.focus(); e.preventDefault(); }
    } else {
      if (document.activeElement === lastFocusable) { firstFocusable.focus(); e.preventDefault(); }
    }
  }

  $$('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (trigger.tagName === 'A') e.preventDefault();
      openModal(e);
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
  });

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  function buildWhatsAppMessage(formData) {
    const data = Object.fromEntries(formData);
    let message = 'Solicitud de cotización\n\n';
    if (data.nombre) message += `Nombre: ${data.nombre}\n`;
    if (data.email) message += `Email: ${data.email}\n`;
    if (data.empresa) message += `Empresa: ${data.empresa}\n`;
    if (data.producto) message += `Producto: ${data.producto}\n`;
    if (data.mensaje) message += `\nMensaje: ${data.mensaje}`;
    return message;
  }

  if (modalForm) {
    $$('input:not([name="website_url"]), textarea', modalForm).forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        const errorSpan = $(`#error-${input.name}`);
        if (errorSpan) errorSpan.textContent = '';
      });
    });

    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (modalFormMessage) {
        modalFormMessage.textContent = '';
        modalFormMessage.className = 'form-message';
      }

      const honeypot = modalForm.querySelector('input[name="website_url"]');
      if (honeypot && honeypot.value) return;

      let hasError = false;
      let firstErrorField = null;
      $$('input:not([name="website_url"]), textarea', modalForm).forEach(input => {
        const errorSpan = $(`#error-${input.name}`);
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        if (errorSpan) errorSpan.textContent = '';

        if (input.required && !input.value.trim()) {
          input.classList.add('is-invalid');
          input.setAttribute('aria-invalid', 'true');
          if (errorSpan) errorSpan.textContent = 'Este campo es obligatorio';
          if (!hasError) { firstErrorField = input; hasError = true; }
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
          input.classList.add('is-invalid');
          input.setAttribute('aria-invalid', 'true');
          if (errorSpan) errorSpan.textContent = 'Ingresa un correo electrónico válido';
          if (!hasError) { firstErrorField = input; hasError = true; }
        }
      });

      if (hasError) {
        if (modalFormMessage) {
          modalFormMessage.textContent = 'Por favor corrige los errores en el formulario.';
          modalFormMessage.className = 'form-message error';
        }
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      const originalHTML = modalSubmitBtn ? modalSubmitBtn.innerHTML : '';
      if (modalSubmitBtn) {
        modalSubmitBtn.innerHTML = 'Abriendo WhatsApp...';
        modalSubmitBtn.disabled = true;
      }

      try {
        const formData = new FormData(modalForm);
        const message = buildWhatsAppMessage(formData);
        const CG = window.Cadgrafics;
        if (CG && CG.submitLead) {
          const data = Object.fromEntries(formData);
          await CG.submitLead(
            {
              name: data.nombre,
              email: data.email,
              company: data.empresa,
              message: data.mensaje || message,
              source: 'modal-acrobat-studio-cotizacion',
            },
            { whatsappText: message, label: 'Acrobat Studio' }
          );
        } else if (CG && CG.openWhatsApp) {
          CG.openWhatsApp(message);
        }

        if (modalSubmitBtn) modalSubmitBtn.style.background = '#059669';
        if (modalFormMessage) {
          modalFormMessage.textContent = '¡Redirigiendo a WhatsApp con tu mensaje!';
          modalFormMessage.className = 'form-message success';
        }

        setTimeout(() => {
          modalForm.reset();
          if (modalSubmitBtn) {
            modalSubmitBtn.innerHTML = originalHTML;
            modalSubmitBtn.style.background = '';
            modalSubmitBtn.disabled = false;
          }
          closeModal();
        }, 1500);
      } catch (error) {
        console.error('Error al abrir WhatsApp:', error);
        if (modalSubmitBtn) {
          modalSubmitBtn.innerHTML = '✗ Error al abrir WhatsApp';
          modalSubmitBtn.style.background = '#DC2626';
          modalSubmitBtn.disabled = false;
        }
        if (modalFormMessage) {
          modalFormMessage.textContent = 'Error al abrir WhatsApp. Puedes contactarnos directamente.';
          modalFormMessage.className = 'form-message error';
        }
        setTimeout(() => {
          if (modalSubmitBtn) {
            modalSubmitBtn.innerHTML = originalHTML;
            modalSubmitBtn.style.background = '';
          }
        }, 2000);
      }
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