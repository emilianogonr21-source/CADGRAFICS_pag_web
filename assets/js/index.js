(function () {
    'use strict';

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
                    const parent = link.closest(parentSelector);
                    const hasMenu = parent?.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
                    if (!hasMenu) return;

                    e.preventDefault();
                    const isActive = parent.classList.toggle('active');
                    link.setAttribute('aria-expanded', String(isActive));

                    $$(`${parentSelector}.active`).forEach(sib => {
                        if (sib !== parent) {
                            sib.classList.remove('active');
                            sib.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });

            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const parent = link.closest(parentSelector);
                    const dropdown = parent?.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
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
            const headerOffset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ===== Formulario Hero - Validación y envío =====
    const consultForm = $('#consultForm');
    const formMessage = $('#formMessage');

    const setMessage = (msg, type) => {
        formMessage.textContent = msg;
        formMessage.className = 'form-message ' + type;
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => /^[\d\s+\-()]{7,}$/.test(phone);

    const clearValidation = (input) => input.classList.remove('is-invalid');
    const setInvalid = (input) => input.classList.add('is-invalid');

    $$('#consultForm input').forEach(input => {
        input.addEventListener('input', () => clearValidation(input));
    });

    consultForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        // Honeypot anti-spam
        const honeypot = $('#honeypot');
        if (honeypot && honeypot.value) {
            console.log('Spam detectado');
            return;
        }

        const formData = new FormData(consultForm);
        const nombre = formData.get('nombre').trim();
        const empresa = formData.get('empresa').trim();
        const email = formData.get('email').trim();
        const telefono = formData.get('telefono').trim();

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
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, empresa, email, telefono, source: 'hero-form' })
            });

            if (response.ok) {
                setMessage('¡Gracias ' + nombre + '! Nos contactaremos pronto.', 'success');
                consultForm.reset();
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            setMessage('Error al enviar. Por favor intenta de nuevo o contáctanos por WhatsApp.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // ===== Carrusel de marcas - Clonación dinámica y pausa =====
    const brandsTrack = $('#brandsTrack');
    if (brandsTrack) {
        // Clonar las tarjetas originales para el efecto infinito
        const originalCards = Array.from(brandsTrack.children);
        originalCards.forEach(card => {
            brandsTrack.appendChild(card.cloneNode(true));
        });

        const pauseAnimation = () => { brandsTrack.style.animationPlayState = 'paused'; };
        const resumeAnimation = () => { brandsTrack.style.animationPlayState = 'running'; };
        
        brandsTrack.addEventListener('mouseenter', pauseAnimation);
        brandsTrack.addEventListener('mouseleave', resumeAnimation);
        brandsTrack.addEventListener('focus', pauseAnimation);
        brandsTrack.addEventListener('blur', resumeAnimation);
    }

    // ===== Animaciones al hacer scroll =====
    const animateOnScroll = () => {
        const animatedElements = $$('.problem-card, .process-card, .feature-card, .case-card');
        
        if (!animatedElements.length) return;

        animatedElements.forEach(el => el.classList.add('animate-in'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animatedElements.forEach(el => observer.observe(el));
    };

    animateOnScroll();

    // ===== Modal de contacto =====
    const modal = $('#formModal');
    const modalClose = $('#modalClose');
    const leadForm = $('#leadForm');
    const formFields = $('#formFields');
    const successMessage = $('#successMessage');
    const modalFormMessage = $('#modalFormMessage');
    let lastFocusedElement = null;
    
    // Sanitización contra XSS
    const sanitize = (str) => {
        const div = document.createElement('div');
        div.textContent = String(str || '');
        return div.innerHTML.trim().slice(0, 500);
    };

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

    // Triggers del modal
    $$('.textbutton-trigger').forEach(btn => btn.addEventListener('click', openModal));
    
    // Cierre del modal
    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
    // Accesibilidad del modal: Escape y focus trap
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

    // Validación del formulario del modal
    $$('#leadForm input, #leadForm textarea').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('is-invalid'));
    });

    leadForm?.addEventListener('submit', async (e) => {
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
            leadForm.querySelector('#name')?.classList.add('is-invalid');
            hasError = true;
        }
        if (!isValidEmail(data.email)) {
            leadForm.querySelector('#modal-email')?.classList.add('is-invalid');
            hasError = true;
        }
        if (!isValidPhone(data.phone)) {
            leadForm.querySelector('#phone')?.classList.add('is-invalid');
            hasError = true;
        }
        if (!data.company || data.company.length < 2) {
            leadForm.querySelector('#company')?.classList.add('is-invalid');
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
                body: JSON.stringify({ ...data, source: 'modal' })
            });

            if (!response.ok) throw new Error('Error en el servidor');

            // Abrir WhatsApp como fallback de contacto
            const whatsappText = encodeURIComponent('Hola Cadgrafics, acabo de enviar un requerimiento desde su sitio web. ¿Podrían contactarme?');
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

    // ===== Tarjetas de problemas - Interactividad =====
    const problemCards = $$('.problem-card');
    problemCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const isSelected = card.classList.contains('selected');
            card.setAttribute('aria-pressed', String(isSelected));
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('selected');
                const isSelected = card.classList.contains('selected');
                card.setAttribute('aria-pressed', String(isSelected));
            }
        });
    });
    
    // ===== Video Hero - Pausa en móviles o modo ahorro de datos =====
    const heroVideo = $('.hero-video');
    if (heroVideo && (window.innerWidth <= 768 || (navigator.connection && navigator.connection.saveData))) {
        heroVideo.pause();
        heroVideo.removeAttribute('autoplay');
        heroVideo.removeAttribute('loop');
    }
})();
