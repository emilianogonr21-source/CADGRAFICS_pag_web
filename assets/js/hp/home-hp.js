(function () {
  'use strict';

  // ===== Manejo global de errores =====
  window.addEventListener('error', (e) => {
    console.error('Error global capturado:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada sin manejar:', e.reason);
  });

  // ===== Utilidades DOM =====
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ===== Header scroll effect =====
  const header = $('#header');
  let ticking = false;

  const updateHeader = () => {
    const currentScroll = window.scrollY;
    header?.classList.toggle('scrolled', currentScroll > 50);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };

  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();
  }

  // ===== Mobile menu toggle =====
  const mobileToggle = $('#mobileToggle');
  const navMenu = $('#navMenu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isActive));
      mobileToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
      
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      const icon = mobileToggle.querySelector('svg use');
      if (icon) {
        icon.setAttribute('href', isActive ? '#icon-close' : '#icon-menu');
      }
      
      if (!isActive) {
        $$('.nav-item.active, .dropdown-submenu.active').forEach(el => el.classList.remove('active'));
        $$('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  // ===== Dropdown menus =====
  const setupDropdown = (selector, parentSelector) => {
    $$(selector).forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = link.closest(parentSelector);
          const isActive = parent?.classList.toggle('active');
          link.setAttribute('aria-expanded', String(!!isActive));
          
          $$(`${parentSelector}.active`).forEach(sib => {
            if (sib !== parent) {
              sib.classList.remove('active');
              sib.querySelector('a')?.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });

      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const parent = link.closest(parentSelector);
          const dropdown = parent?.querySelector('.dropdown-menu, .dropdown-submenu-menu');
          if (dropdown) {
            e.preventDefault();
            const isActive = parent.classList.toggle('active');
            link.setAttribute('aria-expanded', String(isActive));
          }
        }
      });
    });
  };

  setupDropdown('.nav-item > a', '.nav-item');
  setupDropdown('.dropdown-submenu > a', '.dropdown-submenu');

  // ===== Smooth scroll para anchors internos =====
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== GALERÍA DE IMÁGENES DEL PORTAFOLIO =====
  $$('.product-carousel[data-images]').forEach(function (carousel) {
    const card = carousel.closest('.product-card');
    const imageList = carousel.getAttribute('data-images')?.split(',').map(function (image) {
      return image.trim();
    }).filter(Boolean) || [];

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
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

    const updateCarousel = function () {
      slides.forEach(function (slide, index) {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
      counter.textContent = (currentIndex + 1) + ' / ' + imageList.length;
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
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ===== FORMULARIO DE CONTACTO =====
  const contactForm = $('#contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      console.log('Datos del formulario:', data);

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Enviando...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.innerHTML = '✓ Solicitud enviada';
        submitBtn.style.backgroundColor = '#10b981';

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  // ===== Modal de contacto =====
  const modal = $('#formModal');
  const modalClose = $('#modalClose');
  const leadForm = $('#leadForm');
  const formFields = $('#formFields');
  const successMessage = $('#successMessage');
  const modalFormMessage = $('#modalFormMessage');
  let lastFocusedElement = null;
  
  const sanitize = (str) => {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML.trim().slice(0, 500);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[\d\s+\-()]{7,}$/.test(phone);

  const openModal = (e) => {
    e?.preventDefault();
    lastFocusedElement = document.activeElement;
    modal?.classList.add('active');
    modal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#name')?.focus(), 100);
  };

  const closeModal = () => {
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  $$('.textbutton-trigger').forEach(btn => btn.addEventListener('click', openModal));
  
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
    if (modal?.classList.contains('active') && e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  $$('#leadForm input, #leadForm textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('is-invalid'));
  });

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      modalFormMessage.textContent = '';
      modalFormMessage.className = 'form-message';
      
      const fd = new FormData(leadForm);
      const data = {
        name: sanitize(fd.get('name')),
        email: sanitize(fd.get('email')),
        phone: sanitize(fd.get('phone')),
        company: sanitize(fd.get('company')),
        message: sanitize(fd.get('message'))
      };

      let hasError = false;

      if (!data.name || data.name.length < 3) {
        $('#name').classList.add('is-invalid');
        hasError = true;
      }
      if (!isValidEmail(data.email)) {
        $('#email').classList.add('is-invalid');
        hasError = true;
      }
      if (!isValidPhone(data.phone)) {
        $('#phone').classList.add('is-invalid');
        hasError = true;
      }
      if (!data.company || data.company.length < 2) {
        $('#company').classList.add('is-invalid');
        hasError = true;
      }

      if (hasError) {
        modalFormMessage.textContent = 'Por favor completa todos los campos obligatorios correctamente.';
        modalFormMessage.className = 'form-message error';
        return;
      }

      const submitBtn = leadForm.querySelector('.cta-modal');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg width="16" height="16" style="animation: spin 1s linear infinite;" aria-hidden="true"><use href="#icon-send"/></svg> Enviando...';

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'modal-hp' })
        });

        if (!response.ok) throw new Error('Error en el servidor');

        const whatsappText = encodeURIComponent('Hola Cadgrafics, acabo de enviar un requerimiento desde su sitio web (HP). ¿Podrían contactarme?');
        window.open(`https://wa.me/525531120508?text=${whatsappText}`, '_blank', 'noopener,noreferrer');
        
        formFields.style.display = 'none';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            leadForm.reset();
            formFields.style.display = '';
            successMessage.style.display = 'none';
          }, 300);
        }, 3000);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        modalFormMessage.textContent = 'Error al enviar. Por favor intenta de nuevo.';
        modalFormMessage.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

})();
