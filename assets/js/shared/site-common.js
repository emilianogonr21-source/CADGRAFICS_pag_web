/*
  Cadgrafics — comportamiento compartido (menú, leads, cookies, modal estándar)
  ---------------------------------------------------------------------------
  Cargar ANTES del JS de cada página.
  Expone window.Cadgrafics para que cada marca reutilice la misma lógica
  sin cambiar el aspecto visual de sus hojas CSS.
*/
(function (global) {
  'use strict';

  const WHATSAPP_PHONE = '525531120508';
  const LEADS_ENDPOINT = '/api/leads';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const sanitize = (str) => {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML.trim().slice(0, 500);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[\d\s+\-()]{7,}$/.test(phone);

  /** Mensaje de WhatsApp con los datos del formulario (canal confiable en hosting estático). */
  function buildWhatsAppMessage(data, label) {
    const lines = [
      'Hola Cadgrafics,',
      label ? `Solicitud desde: ${label}` : 'Quiero información desde el sitio web.',
      '',
      data.name || data.nombre ? `Nombre: ${data.name || data.nombre}` : null,
      data.company || data.empresa ? `Empresa: ${data.company || data.empresa}` : null,
      data.email ? `Email: ${data.email}` : null,
      data.phone || data.telefono ? `Teléfono: ${data.phone || data.telefono}` : null,
      data.message ? `Mensaje: ${data.message}` : null,
    ].filter(Boolean);
    return lines.join('\n');
  }

  function openWhatsApp(text, phone) {
    const url = `https://wa.me/${phone || WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    return url;
  }

  /**
   * Envía el lead: intenta API si existe; siempre abre WhatsApp para no perder el contacto.
   * @returns {{ apiOk: boolean, whatsappOpened: boolean }}
   */
  async function submitLead(raw, options) {
    const opts = options || {};
    const data = {
      name: sanitize(raw.name || raw.nombre || ''),
      email: sanitize(raw.email || ''),
      phone: sanitize(raw.phone || raw.telefono || ''),
      company: sanitize(raw.company || raw.empresa || ''),
      message: sanitize(raw.message || ''),
      source: raw.source || 'site',
    };

    let apiOk = false;
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(function () { controller.abort(); }, 4000) : null;
      const response = await fetch(LEADS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller ? controller.signal : undefined,
      });
      if (timer) clearTimeout(timer);
      apiOk = !!(response && response.ok);
    } catch (err) {
      /* Hosting estático o API ausente: esperado; WhatsApp cubre el lead. */
      apiOk = false;
    }

    const waText =
      opts.whatsappText ||
      buildWhatsAppMessage(data, opts.label || data.source);

    if (opts.openWhatsApp !== false) {
      openWhatsApp(waText, opts.phone);
    }

    return { apiOk: apiOk, whatsappOpened: opts.openWhatsApp !== false, data: data };
  }

  /** Menú: scroll del header, móvil y submenús. */
  function initHeader(options) {
    const opts = options || {};
    const header = $('#header');
    const mobileToggle = $('#mobileToggle');
    const navMenu = $('#navMenu');
    /* 1024: menú hamburguesa también en tablet/laptop estrecha */
    const breakpoint = opts.breakpoint || 1024;

    if (header) {
      let ticking = false;
      const update = function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      };
      window.addEventListener(
        'scroll',
        function () {
          if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
          }
        },
        { passive: true }
      );
      update();
    }

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', function () {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('is-open', isActive);
        mobileToggle.setAttribute('aria-expanded', String(isActive));
        mobileToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
        if (opts.lockBodyScroll) {
          document.body.style.overflow = isActive ? 'hidden' : '';
        }
        const icon = mobileToggle.querySelector('use') || mobileToggle.querySelector('svg use');
        if (icon) icon.setAttribute('href', isActive ? '#icon-close' : '#icon-menu');
        if (!isActive) {
          $$('.nav-item.active, .dropdown-submenu.active').forEach(function (el) {
            el.classList.remove('active');
          });
        }
      });

      $$('.nav-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
          const parent = link.closest('.nav-item, .dropdown-submenu');
          const hasMenu =
            parent &&
            parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
          if (hasMenu && window.innerWidth <= breakpoint) return;
          navMenu.classList.remove('active');
          mobileToggle.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.setAttribute('aria-label', 'Abrir menú');
          const icon = mobileToggle.querySelector('use') || mobileToggle.querySelector('svg use');
          if (icon) icon.setAttribute('href', '#icon-menu');
          if (opts.lockBodyScroll) document.body.style.overflow = '';
        });
      });
    }

    function setupDropdown(selector, parentSelector) {
      $$(selector).forEach(function (link) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth > breakpoint) return;
          const parent = link.closest(parentSelector);
          const hasMenu =
            parent &&
            parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
          if (!hasMenu) return;
          e.preventDefault();
          e.stopPropagation();
          const isActive = parent.classList.toggle('active');
          link.setAttribute('aria-expanded', String(isActive));
          $$(parentSelector + '.active').forEach(function (sib) {
            if (sib !== parent) {
              sib.classList.remove('active');
              const a = sib.querySelector(':scope > a');
              if (a) a.setAttribute('aria-expanded', 'false');
            }
          });
        });
      });
    }

    setupDropdown('.nav-item > a', '.nav-item');
    setupDropdown('.dropdown-submenu > a', '.dropdown-submenu');
  }

  /** Anclas suaves; ignora triggers de modal. */
  function initSmoothAnchors(options) {
    const opts = options || {};
    const header = $('#header');
    const skip = opts.skipSelector || '.textbutton-trigger, .modal-trigger, [data-modal-trigger]';

    $$('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        if (anchor.matches(skip)) return;
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        const offset = opts.offset != null ? opts.offset : header ? header.offsetHeight : 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth',
        });
      });
    });
  }

  /**
   * Modal estándar #formModal + #leadForm (index, Dell, HP, Chaos, etc.).
   * options.fieldMap: { name, email, phone, company } → selectores CSS
   * options.source, options.label, options.focusSelector, options.triggerSelector
   */
  function initStandardLeadModal(options) {
    const opts = options || {};
    const modal = $(opts.modalSelector || '#formModal');
    const modalClose = $(opts.closeSelector || '#modalClose');
    const leadForm = $(opts.formSelector || '#leadForm');
    const formFields = $(opts.fieldsSelector || '#formFields');
    const successMessage = $(opts.successSelector || '#successMessage');
    const modalFormMessage = $(opts.messageSelector || '#modalFormMessage');
    const fieldMap = Object.assign(
      {
        name: '#name, #modal-name',
        email: '#modal-email, #email',
        phone: '#phone, #modal-phone',
        company: '#company, #modal-company',
      },
      opts.fieldMap || {}
    );
    const triggerSelector =
      opts.triggerSelector || '.textbutton-trigger, .modal-trigger, .cta-modal-trigger';
    let lastFocusedElement = null;

    const fieldEl = function (key) {
      return leadForm ? leadForm.querySelector(fieldMap[key]) : null;
    };

    const openModal = function (e) {
      if (e) e.preventDefault();
      lastFocusedElement = document.activeElement;
      if (!modal) return;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const focusSel = opts.focusSelector || fieldMap.name;
      setTimeout(function () {
        const el = typeof focusSel === 'string' ? $(focusSel, leadForm || document) : fieldEl('name');
        if (el && el.focus) el.focus();
      }, 100);
    };

    const closeModal = function () {
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    };

    $$(triggerSelector).forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
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

    if (leadForm) {
      $$('input, textarea', leadForm).forEach(function (input) {
        input.addEventListener('input', function () {
          input.classList.remove('is-invalid');
        });
      });

      leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (modalFormMessage) {
          modalFormMessage.textContent = '';
          modalFormMessage.className = 'form-message';
        }

        const fd = new FormData(leadForm);
        const data = {
          name: sanitize(fd.get('name') || fd.get('nombre')),
          email: sanitize(fd.get('email')),
          phone: sanitize(fd.get('phone') || fd.get('telefono')),
          company: sanitize(fd.get('company') || fd.get('empresa')),
          message: sanitize(fd.get('message') || fd.get('mensaje')),
          source: opts.source || 'modal',
        };

        let hasError = false;
        if (!data.name || data.name.length < 3) {
          fieldEl('name') && fieldEl('name').classList.add('is-invalid');
          hasError = true;
        }
        if (!isValidEmail(data.email)) {
          fieldEl('email') && fieldEl('email').classList.add('is-invalid');
          hasError = true;
        }
        if (!isValidPhone(data.phone)) {
          fieldEl('phone') && fieldEl('phone').classList.add('is-invalid');
          hasError = true;
        }
        if (!data.company || data.company.length < 2) {
          fieldEl('company') && fieldEl('company').classList.add('is-invalid');
          hasError = true;
        }

        if (hasError) {
          if (modalFormMessage) {
            modalFormMessage.textContent =
              'Por favor completa todos los campos obligatorios correctamente.';
            modalFormMessage.className = 'form-message error';
          }
          return;
        }

        const submitBtn = leadForm.querySelector(opts.submitSelector || '.cta-modal, button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML =
            opts.loadingHtml ||
            '<svg width="16" height="16" style="animation: spin 1s linear infinite;" aria-hidden="true"><use href="#icon-send"/></svg> Enviando...';
        }

        try {
          await submitLead(data, {
            label: opts.label || data.source,
            whatsappText: opts.whatsappText,
          });

          if (formFields) formFields.style.display = 'none';
          if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.classList.add('show');
          }

          setTimeout(function () {
            closeModal();
            setTimeout(function () {
              leadForm.reset();
              if (formFields) formFields.style.display = '';
              if (successMessage) {
                successMessage.style.display = 'none';
                successMessage.classList.remove('show');
              }
            }, 300);
          }, opts.successDelay || 3000);
        } catch (err) {
          console.error('Error al enviar formulario:', err);
          if (modalFormMessage) {
            modalFormMessage.textContent =
              'No se pudo abrir WhatsApp. Escríbenos al +52 55 3112 0508.';
            modalFormMessage.className = 'form-message error';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      });
    }

    return { openModal: openModal, closeModal: closeModal };
  }

  /** Banner de cookies (#cookieBanner) — Dell y páginas que lo incluyan. */
  function initCookieBanner() {
    const banner = $('#cookieBanner');
    if (!banner) return;

    function hide() {
      banner.style.display = 'none';
    }

    global.acceptCookies = function () {
      hide();
      try {
        localStorage.setItem('cookiesAccepted', 'true');
      } catch (e) {}
    };

    global.rejectCookies = function () {
      hide();
      try {
        localStorage.setItem('cookiesAccepted', 'false');
      } catch (e) {}
    };

    try {
      if (localStorage.getItem('cookiesAccepted') !== null) hide();
    } catch (e) {}
  }

  global.Cadgrafics = {
    WHATSAPP_PHONE: WHATSAPP_PHONE,
    $: $,
    $$: $$,
    sanitize: sanitize,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    buildWhatsAppMessage: buildWhatsAppMessage,
    openWhatsApp: openWhatsApp,
    submitLead: submitLead,
    initHeader: initHeader,
    initSmoothAnchors: initSmoothAnchors,
    initStandardLeadModal: initStandardLeadModal,
    initCookieBanner: initCookieBanner,
  };
})(window);
