/*
  Comportamiento de la página de inicio — Cadgrafics
  --------------------------------------------------
  Depende de: assets/js/shared/site-common.js (piezas compartidas)

  Bloques de este archivo:
  1. Menú y ventana Contáctanos (compartidos)
  2. Formulario corto de la portada
  3. Otras interacciones propias del inicio

  Guía del equipo: docs/README.md
*/
(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { $, $$, isValidEmail, isValidPhone, submitLead, initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  initHeader({ lockBodyScroll: true });
  initSmoothAnchors({ offset: 80 });
  initStandardLeadModal({
    source: 'modal-index',
    label: 'Inicio Cadgrafics',
    fieldMap: {
      name: '#name',
      email: '#modal-email',
      phone: '#phone',
      company: '#company',
    },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger',
  });

  // ===== Formulario de la portada =====
  const consultForm = $('#consultForm');
  const formMessage = $('#formMessage');

  const setMessage = (msg, type) => {
    if (!formMessage) return;
    formMessage.textContent = msg;
    formMessage.className = 'form-message ' + type;
  };

  const clearValidation = (input) => input && input.classList.remove('is-invalid');
  const setInvalid = (input) => input && input.classList.add('is-invalid');

  $$('#consultForm input').forEach((input) => {
    input.addEventListener('input', () => clearValidation(input));
  });

  consultForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('', '');

    const honeypot = $('#honeypot');
    if (honeypot && honeypot.value) return;

    const formData = new FormData(consultForm);
    const nombre = String(formData.get('nombre') || '').trim();
    const empresa = String(formData.get('empresa') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const telefono = String(formData.get('telefono') || '').trim();

    const nombreInput = consultForm.querySelector('#nombre');
    const emailInput = consultForm.querySelector('#email');
    const telefonoInput = consultForm.querySelector('#telefono');

    let hasError = false;
    if (!nombre || nombre.length < 3) {
      setInvalid(nombreInput);
      if (!hasError) setMessage('Por favor, ingresa tu nombre completo.', 'error');
      hasError = true;
    }
    if (!isValidEmail(email)) {
      setInvalid(emailInput);
      if (!hasError) setMessage('Por favor, ingresa un correo válido.', 'error');
      hasError = true;
    }
    if (!isValidPhone(telefono)) {
      setInvalid(telefonoInput);
      if (!hasError) setMessage('Por favor, ingresa un teléfono válido.', 'error');
      hasError = true;
    }
    if (hasError) return;

    const submitBtn = consultForm.querySelector('.btn-primary');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';
    }

    try {
      await submitLead(
        { nombre, empresa, email, telefono, source: 'hero-form' },
        { label: 'Formulario inicio Cadgrafics' }
      );
      setMessage('¡Gracias ' + nombre + '! Te redirigimos a WhatsApp para continuar.', 'success');
      consultForm.reset();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setMessage('Error al enviar. Contáctanos por WhatsApp al 55 3112 0508.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  // ===== Carrusel de marcas =====
  const brandsTrack = $('#brandsTrack');
  if (brandsTrack) {
    const originalCards = Array.from(brandsTrack.children);
    originalCards.forEach((card) => brandsTrack.appendChild(card.cloneNode(true)));

    const pauseAnimation = () => {
      brandsTrack.style.animationPlayState = 'paused';
    };
    const resumeAnimation = () => {
      brandsTrack.style.animationPlayState = 'running';
    };

    brandsTrack.addEventListener('mouseenter', pauseAnimation);
    brandsTrack.addEventListener('mouseleave', resumeAnimation);
    brandsTrack.addEventListener('focus', pauseAnimation);
    brandsTrack.addEventListener('blur', resumeAnimation);
  }

  // ===== Animaciones al scroll =====
  const animatedElements = $$('.problem-card, .process-card, .feature-card, .case-card');
  if (animatedElements.length) {
    animatedElements.forEach((el) => el.classList.add('animate-in'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedElements.forEach((el) => observer.observe(el));
  }

  // ===== Tarjetas de problemas =====
  $$('.problem-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');

    const toggle = () => {
      card.classList.toggle('selected');
      card.setAttribute('aria-pressed', String(card.classList.contains('selected')));
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // ===== Video Hero =====
  const heroVideo = $('.hero-video');
  if (heroVideo && (window.innerWidth <= 768 || (navigator.connection && navigator.connection.saveData))) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    heroVideo.removeAttribute('loop');
  }
})();
