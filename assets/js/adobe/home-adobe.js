(function() {
  'use strict';
  
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const header = document.getElementById('header');
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
  
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isActive));
      mobileToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isActive ? 'hidden' : '';
      const icon = mobileToggle.querySelector('svg use');
      if (icon) icon.setAttribute('href', isActive ? '#icon-close' : '#icon-menu');
      if (!isActive) {
        document.querySelectorAll('.nav-item.active, .dropdown-submenu.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false'));
      }
    });
  }
  
  const setupDropdown = (selector, parentSelector) => {
    document.querySelectorAll(selector).forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          const parent = link.closest(parentSelector);
          const hasMenu = parent?.querySelector('.dropdown-menu, .dropdown-submenu-menu');
          if (!parent || !hasMenu) return;
          if (parent.classList.contains('active')) return;

          e.preventDefault();
          parent.classList.add('active');
          link.setAttribute('aria-expanded', 'true');
          document.querySelectorAll(`${parentSelector}.active`).forEach(sib => {
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
        if (e.key === 'Escape') {
          const parent = link.closest(parentSelector);
          if (parent?.classList.contains('active')) {
            parent.classList.remove('active');
            link.setAttribute('aria-expanded', 'false');
            link.focus();
          }
        }
      });
    });
  };
  setupDropdown('.nav-item > a', '.nav-item');
  setupDropdown('.dropdown-submenu > a', '.dropdown-submenu');
  
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) {
      element.textContent = target + suffix;
      return;
    }
    const duration = 2000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * ease);
      element.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const counter = entry.target.querySelector('.stat-number');
        if (counter && !counter.classList.contains('counted')) {
          counter.classList.add('counted');
          animateCounter(counter);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
  
  const MODAL_CONFIGS = {
    'diagnostico': {
      title: 'Solicita tu diagnóstico gratuito',
      description: 'Completa el formulario y un especialista te contactará en menos de 24 horas.',
      submitText: 'Enviar solicitud',
      fields: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo', required: true, autocomplete: 'name', maxlength: 100 },
        { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true, autocomplete: 'email', maxlength: 150 },
        { name: 'empresa', type: 'text', placeholder: 'Empresa', required: false, autocomplete: 'organization', maxlength: 100 },
        { name: 'mensaje', type: 'textarea', placeholder: '¿En qué podemos ayudarte?', required: false, maxlength: 500 }
      ]
    },
    'cotizacion': {
      title: 'Solicitar Cotización',
      description: 'Cuéntanos qué necesitas y te enviaremos una propuesta personalizada.',
      submitText: 'Solicitar cotización',
      fields: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo', required: true, autocomplete: 'name', maxlength: 100 },
        { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true, autocomplete: 'email', maxlength: 150 },
        { name: 'empresa', type: 'text', placeholder: 'Empresa', required: true, autocomplete: 'organization', maxlength: 100 },
        { name: 'producto', type: 'text', placeholder: 'Producto de interés (ej: Creative Cloud Pro)', required: false, maxlength: 100 },
        { name: 'mensaje', type: 'textarea', placeholder: 'Detalles adicionales...', required: false, maxlength: 500 }
      ]
    },
    'firefly': {
      title: 'Conoce Adobe Firefly',
      description: 'Descubre cómo la IA generativa puede transformar los workflows creativos de tu equipo.',
      submitText: 'Quiero saber más',
      fields: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo', required: true, autocomplete: 'name', maxlength: 100 },
        { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true, autocomplete: 'email', maxlength: 150 },
        { name: 'empresa', type: 'text', placeholder: 'Empresa', required: false, autocomplete: 'organization', maxlength: 100 },
        { name: 'mensaje', type: 'textarea', placeholder: '¿Cómo te gustaría usar Firefly en tu equipo?', required: false, maxlength: 500 }
      ]
    },
    'acrobat-standard': {
      title: 'Adobe Acrobat Standard',
      description: 'Obtén más información sobre las funcionalidades esenciales de Acrobat Standard.',
      submitText: 'Solicitar información',
      fields: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo', required: true, autocomplete: 'name', maxlength: 100 },
        { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true, autocomplete: 'email', maxlength: 150 },
        { name: 'empresa', type: 'text', placeholder: 'Empresa', required: false, autocomplete: 'organization', maxlength: 100 },
        { name: 'mensaje', type: 'textarea', placeholder: '¿Qué te gustaría saber sobre Acrobat Standard?', required: false, maxlength: 500 }
      ]
    },
    'acrobat-pro': {
      title: 'Adobe Acrobat Pro - Cotización',
      description: 'Solicita una cotización personalizada para Acrobat Pro.',
      submitText: 'Solicitar cotización',
      fields: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo', required: true, autocomplete: 'name', maxlength: 100 },
        { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true, autocomplete: 'email', maxlength: 150 },
        { name: 'empresa', type: 'text', placeholder: 'Empresa', required: true, autocomplete: 'organization', maxlength: 100 },
        { name: 'licencias', type: 'text', placeholder: 'Número de licencias necesarias', required: false, maxlength: 10 },
        { name: 'mensaje', type: 'textarea', placeholder: 'Requerimientos específicos de tu empresa', required: false, maxlength: 500 }
      ]
    },
    'adobe-sign-demo': {
      title: 'Solicitar demo de Adobe Sign',
      description: 'Descubre cómo Adobe Sign puede transformar tus procesos de firma digital. Completa el formulario y un especialista te contactará.',
      submitText: 'Solicitar demo',
      fields: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo', required: true, autocomplete: 'name', maxlength: 100 },
        { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true, autocomplete: 'email', maxlength: 150 },
        { name: 'empresa', type: 'text', placeholder: 'Empresa', required: true, autocomplete: 'organization', maxlength: 100 },
        { name: 'telefono', type: 'tel', placeholder: 'Teléfono', required: false, autocomplete: 'tel', maxlength: 20 },
        { name: 'mensaje', type: 'textarea', placeholder: '¿Cuántos documentos firmas al mes aproximadamente?', required: false, maxlength: 500 }
      ]
    }
  };
  
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalFields = document.getElementById('modal-fields');
  const modalForm = document.getElementById('modal-form');
  const modalSubmitBtn = document.getElementById('modal-submit-btn');
  const modalFormMessage = document.getElementById('modal-form-message');
  const modalCloseBtn = modalOverlay.querySelector('[data-modal-close]');
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let triggerElement = null;
  let currentConfig = null;
  
  function buildFormFields(fields) {
    modalFields.innerHTML = '';
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website_url';
    honeypot.className = 'visually-hidden';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.setAttribute('aria-hidden', 'true');
    modalFields.appendChild(honeypot);
    
    fields.forEach(field => {
      const label = document.createElement('label');
      label.className = 'visually-hidden';
      label.setAttribute('for', `field-${field.name}`);
      label.textContent = field.placeholder;
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }
      input.id = `field-${field.name}`;
      input.name = field.name;
      input.placeholder = field.placeholder;
      if (field.required) input.required = true;
      if (field.autocomplete) input.autocomplete = field.autocomplete;
      if (field.maxlength) input.maxLength = field.maxlength;
      const errorSpan = document.createElement('span');
      errorSpan.id = `error-${field.name}`;
      errorSpan.className = 'field-error';
      errorSpan.setAttribute('aria-live', 'polite');
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        errorSpan.textContent = '';
      });
      modalFields.appendChild(label);
      modalFields.appendChild(input);
      modalFields.appendChild(errorSpan);
    });
  }
  
  function openModal(e) {
    const trigger = e.currentTarget;
    const modalKey = trigger.getAttribute('data-modal-trigger');
    currentConfig = MODAL_CONFIGS[modalKey];
    if (!currentConfig) return;
    triggerElement = trigger;
    modalTitle.textContent = currentConfig.title;
    modalDescription.textContent = currentConfig.description;
    modalSubmitBtn.textContent = currentConfig.submitText;
    modalFormMessage.textContent = '';
    modalFormMessage.className = 'form-message';
    buildFormFields(currentConfig.fields);
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const mainContent = document.querySelector('main');
    const headerContent = document.querySelector('.header');
    if (mainContent) {
      mainContent.setAttribute('inert', '');
      mainContent.setAttribute('aria-hidden', 'true');
    }
    if (headerContent) {
      headerContent.setAttribute('inert', '');
      headerContent.setAttribute('aria-hidden', 'true');
    }
    requestAnimationFrame(() => {
      modalCloseBtn.focus();
      modalOverlay.removeEventListener('keydown', trapFocus);
      modalOverlay.addEventListener('keydown', trapFocus);
    });
  }
  
  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const mainContent = document.querySelector('main');
    const headerContent = document.querySelector('.header');
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
    const focusableContent = Array.from(modalOverlay.querySelectorAll(focusableSelector));
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
  
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (trigger.tagName === 'A') e.preventDefault();
      openModal(e);
    });
  });
  
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });
  
  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  
  const WHATSAPP_PHONE = '525531120508';
  
  function buildWhatsAppMessage(formData, modalType) {
    const data = Object.fromEntries(formData);
    let message = '';
    
    const modalTitles = {
      'diagnostico': 'Solicitud de diagnóstico gratuito',
      'cotizacion': 'Solicitud de cotización',
      'firefly': 'Información sobre Adobe Firefly',
      'acrobat-standard': 'Información sobre Acrobat Standard',
      'acrobat-pro': 'Cotización de Acrobat Pro',
      'adobe-sign-demo': 'Solicitud de demo de Adobe Sign'
    };
    
    message += `*${modalTitles[modalType] || 'Nueva solicitud'}*\n\n`;
    
    if (data.nombre) message += `👤 *Nombre:* ${data.nombre}\n`;
    if (data.email) message += `📧 *Email:* ${data.email}\n`;
    if (data.empresa) message += `🏢 *Empresa:* ${data.empresa}\n`;
    if (data.producto) message += `📦 *Producto:* ${data.producto}\n`;
    if (data.licencias) message += `🔢 *Licencias:* ${data.licencias}\n`;
    if (data.telefono) message += `📱 *Teléfono:* ${data.telefono}\n`;
    if (data.mensaje) message += `\n💬 *Mensaje:* ${data.mensaje}`;
    
    return message;
  }
  
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    modalFormMessage.textContent = '';
    modalFormMessage.className = 'form-message';
    const honeypot = modalForm.querySelector('input[name="website_url"]');
    if (honeypot && honeypot.value) {
      console.log('Spam detectado');
      return;
    }
    let hasError = false;
    let firstErrorField = null;
    const inputs = modalForm.querySelectorAll('input:not([name="website_url"]), textarea');
    inputs.forEach(input => {
      const fieldName = input.name;
      const errorSpan = document.getElementById(`error-${fieldName}`);
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      if (errorSpan) errorSpan.textContent = '';
      if (input.required && !input.value.trim()) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `error-${fieldName}`);
        if (errorSpan) errorSpan.textContent = 'Este campo es obligatorio';
        if (!hasError) { firstErrorField = input; hasError = true; }
      }
      else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `error-${fieldName}`);
        if (errorSpan) errorSpan.textContent = 'Ingresa un correo electrónico válido';
        if (!hasError) { firstErrorField = input; hasError = true; }
      }
    });
    if (hasError) {
      modalFormMessage.textContent = 'Por favor corrige los errores en el formulario.';
      modalFormMessage.className = 'form-message error';
      if (firstErrorField) firstErrorField.focus();
      return;
    }
    const originalHTML = modalSubmitBtn.innerHTML;
    modalSubmitBtn.innerHTML = 'Abriendo WhatsApp...';
    modalSubmitBtn.disabled = true;
    
    try {
      const modalType = triggerElement?.getAttribute('data-modal-trigger') || 'cotizacion';
      const formData = new FormData(modalForm);
      const message = buildWhatsAppMessage(formData, modalType);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      modalSubmitBtn.innerHTML = '✓ Abriendo WhatsApp...';
      modalSubmitBtn.style.background = '#059669';
      modalSubmitBtn.style.borderColor = '#059669';
      modalFormMessage.textContent = '¡Redirigiendo a WhatsApp con tu mensaje!';
      modalFormMessage.className = 'form-message success';
      
      setTimeout(() => {
        modalForm.reset();
        modalSubmitBtn.innerHTML = originalHTML;
        modalSubmitBtn.style.background = '';
        modalSubmitBtn.style.borderColor = '';
        modalSubmitBtn.disabled = false;
        closeModal();
      }, 1500);
    } catch (error) {
      console.error('Error al abrir WhatsApp:', error);
      modalSubmitBtn.innerHTML = '✗ Error al abrir WhatsApp';
      modalSubmitBtn.style.background = '#DC2626';
      modalSubmitBtn.style.borderColor = '#DC2626';
      modalFormMessage.textContent = 'Error al abrir WhatsApp. Puedes contactarnos directamente.';
      modalFormMessage.className = 'form-message error';
      modalSubmitBtn.disabled = false;
      setTimeout(() => {
        modalSubmitBtn.innerHTML = originalHTML;
        modalSubmitBtn.style.background = '';
        modalSubmitBtn.style.borderColor = '';
      }, 2000);
    }
  });
  
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && (window.innerWidth <= 768 || (navigator.connection && navigator.connection.saveData) || prefersReducedMotion)) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    heroVideo.removeAttribute('loop');
  }
})();
