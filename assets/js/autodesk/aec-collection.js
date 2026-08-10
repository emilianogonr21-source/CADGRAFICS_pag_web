(function() {
    'use strict';

    // ============================================
    // AÑO DINÁMICO EN COPYRIGHT
    // ============================================
    document.getElementById('year').textContent = new Date().getFullYear();

    // ============================================
    // MENÚ MÓVIL
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
            mobileToggle.querySelector('use').setAttribute('href', isActive ? '#icon-close' : '#icon-menu');
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const parent = link.closest('.nav-item, .dropdown-submenu');
            const hasMenu = parent && parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
            if (hasMenu && window.innerWidth <= 768) return;
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.querySelector('use').setAttribute('href', '#icon-menu');
            }
        });
    });

    const setupDropdown = (selector, parentSelector) => {
        document.querySelectorAll(selector).forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const parent = link.closest(parentSelector);
                    const hasMenu = parent && parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
                    if (!hasMenu) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = parent.classList.toggle('active');
                    link.setAttribute('aria-expanded', String(isActive));
                    document.querySelectorAll(parentSelector + '.active').forEach(sib => {
                        if (sib !== parent) {
                            sib.classList.remove('active');
                            const a = sib.querySelector(':scope > a');
                            if (a) a.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });
        });
    };
    setupDropdown('.nav-item > a', '.nav-item');
    setupDropdown('.dropdown-submenu > a', '.dropdown-submenu');

    // ============================================
    // HEADER SCROLLED + NAVEGACIÓN ACTIVA
    // ============================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('main section[id]');
    let sectionPositions = [];

    function cacheSectionPositions() {
        sectionPositions = Array.from(sections).map(function(section) {
            return {
                id: section.getAttribute('id'),
                top: section.offsetTop,
                height: section.offsetHeight
            };
        });
    }

    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions, { passive: true });

    function onScroll() {
        const scrollPos = window.scrollY;

        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        const currentSection = scrollPos + 100;
        sectionPositions.forEach(function(section) {
            if (currentSection >= section.top && currentSection < section.top + section.height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ============================================
    // ANIMACIONES AL HACER SCROLL (IntersectionObserver)
    // ============================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        });

        animateElements.forEach(function(el) { observer.observe(el); });
    } else {
        animateElements.forEach(function(el) { el.classList.add('visible'); });
    }

    // ============================================
    // SCROLL SUAVE PARA NAVEGACIÓN INTERNA
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // MODALES - ABRIR/CERRAR + FOCUS TRAP
    // ============================================
    let lastFocusedElement = null;
    let activeTrapHandler = null;

    function openModal(modalId) {
        const modal = document.getElementById('modal-' + modalId);
        if (!modal) return;

        lastFocusedElement = document.activeElement;
        modal.classList.add('active');

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        setTimeout(function() {
            if (firstFocusable) firstFocusable.focus();
        }, 100);

        activeTrapHandler = function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        modal.addEventListener('keydown', activeTrapHandler);
        modal._trapHandler = activeTrapHandler;
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
            m.classList.remove('active');
            if (m._trapHandler) {
                m.removeEventListener('keydown', m._trapHandler);
                delete m._trapHandler;
            }
        });
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('[data-modal-trigger]');
        if (trigger) {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-trigger');
            openModal(modalId);
            return;
        }

        if (e.target.matches('[data-modal-close]') || e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // ============================================
    // VALIDACIÓN FORMULARIO
    // ============================================
    var form = document.getElementById('form-cotizacion');
    if (form) {
        var honeypot = form.querySelector('#honeypot');
        var nombre = form.querySelector('#input-nombre');
        var email = form.querySelector('#input-email');
        var messageEl = document.getElementById('form-message');

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function showError(input, show) {
            if (show) {
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        }

        function showMessage(msg, type) {
            messageEl.textContent = msg;
            messageEl.className = 'form-message ' + type;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (honeypot && honeypot.value) {
                console.log('Bot detected');
                return;
            }

            var valid = true;

            if (!nombre.value.trim()) {
                showError(nombre, true);
                valid = false;
            } else {
                showError(nombre, false);
            }

            if (!email.value.trim() || !validateEmail(email.value)) {
                showError(email, true);
                valid = false;
            } else {
                showError(email, false);
            }

            if (!valid) {
                showMessage('Por favor completa los campos requeridos', 'error');
                return;
            }

            showMessage('Enviando...', 'success');
            var btn = form.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            setTimeout(function() {
                showMessage('¡Gracias! Tu solicitud ha sido enviada. Te contactaremos pronto.', 'success');
                btn.textContent = '¡Enviado!';
                form.reset();

                setTimeout(function() {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    messageEl.textContent = '';
                    messageEl.className = 'form-message';
                    closeAllModals();
                }, 3000);
            }, 1500);
        });

        form.querySelectorAll('input, textarea').forEach(function(input) {
            input.addEventListener('input', function() {
                showError(this, false);
            });
        });
    }

})();
