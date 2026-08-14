// Header CADGRAFICS: scrolled, menú móvil y dropdowns
        const header = document.getElementById('header');
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        window.addEventListener('scroll', function() {
            if (!header) return;
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                const isActive = navMenu.classList.toggle('active');
                mobileToggle.setAttribute('aria-expanded', String(isActive));
                mobileToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
                const icon = mobileToggle.querySelector('use');
                if (icon) icon.setAttribute('href', isActive ? '#icon-close' : '#icon-menu');
                if (!isActive) {
                    document.querySelectorAll('.nav-item.active, .dropdown-submenu.active').forEach(function(el) {
                        el.classList.remove('active');
                    });
                }
            });
        }

        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                const parent = link.closest('.nav-item, .dropdown-submenu');
                const hasMenu = parent && parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
                if (hasMenu && window.innerWidth <= 768) return;
                if (navMenu) navMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.setAttribute('aria-label', 'Abrir menú');
                    const icon = mobileToggle.querySelector('use');
                    if (icon) icon.setAttribute('href', '#icon-menu');
                }
            });
        });

        function setupDropdown(selector, parentSelector) {
            document.querySelectorAll(selector).forEach(function(link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth > 768) return;
                    const parent = link.closest(parentSelector);
                    const hasMenu = parent && parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
                    if (!hasMenu) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = parent.classList.toggle('active');
                    link.setAttribute('aria-expanded', String(isActive));
                    document.querySelectorAll(parentSelector + '.active').forEach(function(sib) {
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

        function switchTab(tab) {
            document.querySelectorAll('.pro-line .tab').forEach(function(btn) {
                const isActive = btn.dataset.tab === tab;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            document.querySelectorAll('.pro-line .card').forEach(function(card) {
                const isActive = card.dataset.tab === tab;
                card.classList.toggle('active', isActive);
                if (isActive) card.classList.add('visible');
                card.style.display = '';
            });
        }

        document.querySelectorAll('.pro-line .tab').forEach(function(btn) {
            btn.addEventListener('click', function() {
                switchTab(btn.dataset.tab);
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (anchor.classList.contains('textbutton-trigger')) return;
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: 'smooth'
                });
            });
        });

        // Modal de contacto (mismo comportamiento que index.html)
        const $ = (sel, ctx = document) => ctx.querySelector(sel);
        const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
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
            setTimeout(() => $('#modal-name')?.focus(), 100);
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
                leadForm.querySelector('#modal-name')?.classList.add('is-invalid');
                hasError = true;
            }
            if (!isValidEmail(data.email)) {
                leadForm.querySelector('#modal-email')?.classList.add('is-invalid');
                hasError = true;
            }
            if (!isValidPhone(data.phone)) {
                leadForm.querySelector('#modal-phone')?.classList.add('is-invalid');
                hasError = true;
            }
            if (!data.company || data.company.length < 2) {
                leadForm.querySelector('#modal-company')?.classList.add('is-invalid');
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
                    body: JSON.stringify({ ...data, source: 'modal-dell' })
                });

                if (!response.ok) throw new Error('Error en el servidor');

                const whatsappText = encodeURIComponent('Hola Cadgrafics, acabo de enviar un requerimiento desde su sitio web (Dell). ¿Podrían contactarme?');
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

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu interés! Un especialista te contactará en menos de 24 horas hábiles.');
            this.reset();
        });

        // Cookie banner
        function acceptCookies() {
            document.getElementById('cookieBanner').style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
        }

        function rejectCookies() {
            document.getElementById('cookieBanner').style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'false');
        }

        // Check cookies
        if (localStorage.getItem('cookiesAccepted')) {
            document.getElementById('cookieBanner').style.display = 'none';
        }

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.precision-card, .form-card, .feature-box').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // Stats counter animation
        function animateStats() {
            const stats = document.querySelectorAll('.stat-item h3');
            stats.forEach(stat => {
                const target = parseInt(stat.innerText);
                const suffix = stat.innerText.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.innerText = target + suffix;
                        clearInterval(timer);
                    } else {
                        stat.innerText = Math.floor(current) + suffix;
                    }
                }, 30);
            });
        }

        // Trigger stats animation when visible
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
