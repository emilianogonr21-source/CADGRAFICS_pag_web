/*
  Comportamiento de la página Dell — Cadgrafics
  ---------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)

  Bloques de este archivo:
  1. Menú y ventana Contáctanos (compartidos)
  2. Pestañas de la línea Dell Pro
  3. Botones de cotizar: recuerdan qué línea eligió el visitante
  4. Formulario de contacto de la página

  Guía del equipo: docs/README.md
*/

(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { $, $$, submitLead, appendWhatsAppFallback, initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  /* ===== 1. Menú y ventana Contáctanos ===== */
  initHeader({ lockBodyScroll: true });
  initSmoothAnchors();
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

  /* Fotos de producto: si un archivo no existe se quita el <img> para no mostrar el ícono roto */
  $$('img[src*="/images/dell/home/"]').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      img.remove();
      return;
    }
    img.addEventListener('error', function () { img.remove(); }, { once: true });
  });

  /* ===== 2. Pestañas de la línea Dell Pro ===== */
  const tabs = $$('#linea-pro [role="tab"]');

  function selectTab(key, moveFocus) {
    tabs.forEach(function (tab) {
      const isActive = tab.dataset.key === key;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      if (!panel) return;
      panel.hidden = !isActive;
      if (isActive) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
        if (moveFocus) tab.focus();
      }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      selectTab(tab.dataset.key);
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      selectTab(next.dataset.key, true);
    });
  });

  /* Las tarjetas del portafolio abren la pestaña que les corresponde */
  $$('.tile[data-tab]').forEach(function (tile) {
    tile.addEventListener('click', function () {
      selectTab(tile.dataset.tab);
    });
  });

  /* ===== 3. Botones de cotizar ===== */
  const interestInput = $('#contact-interest');
  const lineSelect = $('#contact-line');

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-interest]');
    if (!btn) return;
    const interest = btn.dataset.interest;
    if (interestInput) interestInput.value = btn.textContent.trim();
    if (lineSelect && Array.from(lineSelect.options).some(function (o) { return o.value === interest; })) {
      lineSelect.value = interest;
    }
  });

  /* ===== 4. Formulario de contacto de la página ===== */
  const contactForm = $('#contactForm');
  if (!contactForm) return;

  const formMessage = $('#contactFormMessage');

  function showMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = 'form-message' + (type ? ' ' + type : '');
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    showMessage('');

    if (!contactForm.checkValidity()) {
      showMessage('Completa los campos obligatorios para enviar tu solicitud.', 'error');
      const firstInvalid = contactForm.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const fd = new FormData(contactForm);
    const details = [
      fd.get('line') ? 'Línea de interés: ' + fd.get('line') : null,
      fd.get('interest') ? 'Botón: ' + fd.get('interest') : null,
      fd.get('message') ? 'Cargas de trabajo: ' + fd.get('message') : null,
    ].filter(Boolean);

    const result = submitLead(
      {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        company: fd.get('company'),
        message: details.join(' | '),
        source: 'dell-contact',
      },
      { label: 'Dell — formulario de página' }
    );
    contactForm.reset();
    showMessage('Abrimos WhatsApp con tus datos para que envíes la solicitud; un especialista te responderá en menos de 24 horas hábiles.', 'success');
    appendWhatsAppFallback(formMessage, result.whatsappUrl);
  });
})();
