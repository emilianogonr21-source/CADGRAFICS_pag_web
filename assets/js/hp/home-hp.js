/*
  Comportamiento de la página HP — Cadgrafics
  -------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)

  Guía del equipo: docs/README.md
*/
(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { $, $$, submitLead, initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  initHeader({ lockBodyScroll: true });
  initSmoothAnchors();
  initStandardLeadModal({
    source: 'modal-hp',
    label: 'HP',
    fieldMap: { name: '#name', email: '#email', phone: '#phone', company: '#company' },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger, .modal-trigger',
  });

  // ===== GALERÍA DE IMÁGENES DEL PORTAFOLIO =====
  $$('.product-carousel[data-images]').forEach(function (carousel) {
    const card = carousel.closest('.product-card');
    const imageList =
      carousel
        .getAttribute('data-images')
        ?.split(',')
        .map(function (image) {
          return image.trim();
        })
        .filter(Boolean) || [];

    if (!card || !imageList.length) return;

    const productName = card.querySelector('.product-name')?.textContent?.trim() || 'Producto';
    let currentIndex = 0;

    carousel.setAttribute('data-count', String(imageList.length));
    carousel.setAttribute('aria-roledescription', 'carrusel');
    carousel.setAttribute('aria-label', 'Imágenes de ' + productName);

    const slides = imageList.map(function (src, index) {
      const slide = document.createElement('div');
      slide.className = 'product-carousel-slide' + (index === 0 ? ' is-active' : '');
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

      const img = document.createElement('img');
      img.src = src;
      img.alt = productName + ' - imagen ' + (index + 1);
      img.className = 'product-carousel-image';
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.width = 600;
      img.height = 400;

      slide.appendChild(img);
      carousel.appendChild(slide);
      return slide;
    });

    if (imageList.length < 2) return;

    const counter = document.createElement('span');
    counter.className = 'product-carousel-counter';
    counter.setAttribute('aria-live', 'polite');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'product-carousel-next';
    nextBtn.setAttribute('aria-label', 'Ver siguiente imagen de ' + productName);
    nextBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

    const updateCarousel = function () {
      slides.forEach(function (slide, index) {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
      counter.textContent = currentIndex + 1 + ' / ' + imageList.length;
    };

    nextBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      currentIndex = (currentIndex + 1) % imageList.length;
      updateCarousel();
    });

    carousel.appendChild(counter);
    carousel.appendChild(nextBtn);
    updateCarousel();
  });

  // ===== TABS DEL PORTAFOLIO =====
  const tabButtons = $$('.tab-btn');
  const tabPanels = $$('.portfolio-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPanel = $('#panel-' + targetTab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // ===== FORMULARIO DE CONTACTO EN PÁGINA =====
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;
      }

      try {
        await submitLead(
          {
            name: formData.get('name') || formData.get('nombre'),
            email: formData.get('email'),
            phone: formData.get('phone') || formData.get('telefono'),
            company: formData.get('company') || formData.get('empresa'),
            message: formData.get('message') || formData.get('mensaje'),
            source: 'hp-contact',
          },
          { label: 'HP — formulario de página' }
        );
        if (submitBtn) {
          submitBtn.innerHTML = 'Solicitud enviada';
          submitBtn.style.backgroundColor = '#10b981';
        }
        setTimeout(function () {
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
          }
          contactForm.reset();
        }, 3000);
      } catch (err) {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }
})();
