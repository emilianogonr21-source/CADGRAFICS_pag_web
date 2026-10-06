/*
  Cadgrafics — piezas que se repiten en casi todas las páginas
  ------------------------------------------------------------
  Qué hace este archivo (en simple):
  - Menú de arriba (también en celular)
  - Ventana de Contáctanos
  - Envío de formularios: abre WhatsApp con el mensaje listo y deja un
    enlace de respaldo por si el navegador bloquea la ventana

  Cómo usarlo: cargar ESTE archivo ANTES del JS de cada página.
  Cada marca reutiliza esta lógica sin cambiar su propio aspecto (CSS).

  Guía del equipo: docs/README.md
*/
(function (global) {
  'use strict';

  const WHATSAPP_PHONE = '525531120508';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const normalizeText = (str) => {
    return String(str || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, 500);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => {
    const value = String(phone || '');
    return /^[\d\s+\-()]+$/.test(value) && value.replace(/\D/g, '').length >= 7;
  };

  /* Arma el texto que se envía por WhatsApp con los datos del formulario. */
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

  /**
   * Envía el contacto del visitante abriendo WhatsApp con sus datos.
   * Llamarla sin "await" previo dentro del submit: window.open debe ocurrir
   * durante el clic o el navegador lo bloquea.
   * Devuelve la URL para mostrar un enlace de respaldo (con noopener no hay
   * forma de saber si la ventana se abrió).
   */
  function submitLead(raw, options) {
    const opts = options || {};
    const data = {
      name: normalizeText(raw.name || raw.nombre),
      email: normalizeText(raw.email),
      phone: normalizeText(raw.phone || raw.telefono),
      company: normalizeText(raw.company || raw.empresa),
      message: normalizeText(raw.message),
      source: normalizeText(raw.source) || 'site',
    };
    const text = opts.whatsappText || buildWhatsAppMessage(data, opts.label || data.source);
    const url = 'https://wa.me/' + (opts.phone || WHATSAPP_PHONE) + '?text=' + encodeURIComponent(text);
    if (opts.openWhatsApp !== false) window.open(url, '_blank', 'noopener,noreferrer');
    return { whatsappUrl: url, data: data };
  }

  /* Agrega "Si no se abrió, Abrir WhatsApp." al mensaje de éxito. */
  function appendWhatsAppFallback(container, url) {
    if (!container || !url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir WhatsApp';
    /* Estilo en línea: cada página resetea los enlaces de forma distinta */
    link.style.color = 'inherit';
    link.style.fontWeight = '700';
    link.style.textDecoration = 'underline';
    container.append(' Si no se abrió, ', link, '.');
  }

  /* Menú de arriba: cambia al hacer scroll, abre en celular y maneja submenús. */
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
      const setMenuOpen = function (isOpen) {
        navMenu.classList.toggle('active', isOpen);
        mobileToggle.classList.toggle('is-open', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        if (opts.lockBodyScroll) document.body.style.overflow = isOpen ? 'hidden' : '';
        if (!isOpen) {
          $$('.nav-item.active, .dropdown-submenu.active').forEach(function (el) {
            el.classList.remove('active');
          });
        }
      };
      const isMenuOpen = function () {
        return navMenu.classList.contains('active');
      };

      mobileToggle.addEventListener('click', function () {
        setMenuOpen(!isMenuOpen());
      });

      $$('.nav-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
          const parent = link.closest('.nav-item, .dropdown-submenu');
          const hasMenu =
            parent &&
            parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
          if (hasMenu && window.innerWidth <= breakpoint) return;
          setMenuOpen(false);
        });
      });

      /* Al girar una tablet o agrandar la ventana, el menú móvil no debe dejar el scroll bloqueado. */
      window.addEventListener('resize', function () {
        if (window.innerWidth > breakpoint && isMenuOpen()) setMenuOpen(false);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !isMenuOpen()) return;
        setMenuOpen(false);
        mobileToggle.focus();
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

  /* Enlaces internos (#seccion): baja suavemente sin chocar con el menú. */
  function initSmoothAnchors(options) {
    const opts = options || {};
    const header = $('#header');
    const skip = opts.skipSelector || '.textbutton-trigger';

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
   * Ventana de Contáctanos (la que usan inicio, Dell, HP, SketchUp, etc.).
   * options: de dónde viene el contacto, qué campos leer y qué botón la abre.
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
    const triggerSelector = opts.triggerSelector || '.textbutton-trigger';
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

      leadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (modalFormMessage) {
          modalFormMessage.textContent = '';
          modalFormMessage.className = 'form-message';
        }

        const fd = new FormData(leadForm);
        const data = {
          name: normalizeText(fd.get('name') || fd.get('nombre')),
          email: normalizeText(fd.get('email')),
          phone: normalizeText(fd.get('phone') || fd.get('telefono')),
          company: normalizeText(fd.get('company') || fd.get('empresa')),
          message: normalizeText(fd.get('message') || fd.get('mensaje')),
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

        const result = submitLead(data, {
          label: opts.label || data.source,
          whatsappText: opts.whatsappText,
        });

        if (formFields) formFields.style.display = 'none';
        if (successMessage) {
          const successText = successMessage.querySelector('p');
          if (successText) {
            successText.textContent = 'Abrimos WhatsApp con tus datos para que envíes la consulta.';
            appendWhatsAppFallback(successText, result.whatsappUrl);
          }
          successMessage.style.display = 'block';
          successMessage.classList.add('show');
        }

        /* Tiempo suficiente para usar el enlace de respaldo antes de cerrar. */
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
        }, 8000);
      });
    }

    return { openModal: openModal, closeModal: closeModal };
  }

  /**
   * Formulario de las landings Mac, Microsoft y Chaos: rellena interés y UTMs,
   * valida y envía por WhatsApp.
   * options.extraFields: [{ name, label }] campos propios de cada página que
   * se agregan al mensaje.
   */
  function initLandingLeadForm(options) {
    const opts = options || {};
    const form = $(opts.formSelector || '#leadForm');
    if (!form) return;
    const msg = $(opts.messageSelector || '#formMsg');
    const interest = form.querySelector('[name="interes"]');
    const phoneField = form.querySelector('[name="phone"]');

    const showMessage = function (text) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.add('show');
    };

    const qs = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (key) {
      const field = form.querySelector('[name="' + key + '"]');
      if (field) field.value = normalizeText(qs.get(key)).slice(0, 100);
    });

    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-interest]');
      if (trigger && interest) interest.value = trigger.dataset.interest;
    });

    if (phoneField) {
      phoneField.addEventListener('input', function () {
        phoneField.setCustomValidity('');
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      if (phoneField) {
        phoneField.setCustomValidity(isValidPhone(fd.get('phone')) ? '' : 'Escribe un teléfono válido.');
      }
      if (!form.checkValidity()) {
        showMessage('Completa los campos obligatorios para enviar tu solicitud.');
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const details = (opts.extraFields || [])
        .map(function (field) {
          const value = normalizeText(fd.get(field.name));
          return value ? field.label + ': ' + value : null;
        })
        .filter(Boolean);

      const result = submitLead(
        {
          name: fd.get('first_name') || fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          company: fd.get('company'),
          message: details.join(' | '),
          source: fd.get('lead_source') || opts.source,
        },
        { label: opts.label }
      );

      form.reset();
      showMessage('Abrimos WhatsApp con tus datos para que envíes la solicitud; un especialista te responderá en menos de 24 horas hábiles.');
      appendWhatsAppFallback(msg, result.whatsappUrl);
    });
  }

  /**
   * Videos con preload="none": carga y reproduce al entrar en vista
   * (ahorra ancho de banda en secciones bajo el fold).
   */
  function initLazyVideos(options) {
    const opts = options || {};
    const videos = $$(opts.selector || 'video[preload="none"]');
    if (!videos.length) return;

    const playWhenVisible = function (video) {
      if (video.hasAttribute('controls') && !video.hasAttribute('data-autoplay-onview')) return;
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* autoplay bloqueado */ });
    };

    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (video) {
        video.setAttribute('preload', 'metadata');
        video.load();
        playWhenVisible(video);
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.getAttribute('data-lazy-loaded') !== '1') {
              video.setAttribute('preload', 'metadata');
              video.load();
              video.setAttribute('data-lazy-loaded', '1');
            }
            playWhenVisible(video);
          } else if (!video.hasAttribute('controls')) {
            video.pause();
          }
        });
      },
      { rootMargin: opts.rootMargin || '120px 0px', threshold: 0.15 }
    );

    videos.forEach(function (video) {
      io.observe(video);
    });
  }

  /* API pública usada por los JS de cada página (el resto queda interno). */
  global.Cadgrafics = {
    $: $,
    $$: $$,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    submitLead: submitLead,
    appendWhatsAppFallback: appendWhatsAppFallback,
    initHeader: initHeader,
    initSmoothAnchors: initSmoothAnchors,
    initStandardLeadModal: initStandardLeadModal,
    initLandingLeadForm: initLandingLeadForm,
  };

  /* Videos lazy: se activan solos en cualquier página que cargue este archivo. */
  function bootLazyVideos() {
    initLazyVideos();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootLazyVideos);
  } else {
    bootLazyVideos();
  }
})(window);
