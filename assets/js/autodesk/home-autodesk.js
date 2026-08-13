(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // Header scroll
    const header = $('#header');
    let ticking = false;

    const updateHeader = () => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu
    const mobileToggle = $('#mobileToggle');
    const navMenu = $('#navMenu');
    
    mobileToggle?.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    const setupDropdown = (selector, parentSelector) => {
        document.querySelectorAll(selector).forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const parent = link.closest(parentSelector);
                    const hasMenu = parent && parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
                    if (!hasMenu) return;
                    if (parent.classList.contains('active')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    parent.classList.add('active');
                    link.setAttribute('aria-expanded', 'true');
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
    });

    // Smooth scroll
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = $(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    $$('.fade-in').forEach(el => observer.observe(el));

    // Credentials infinite carousel
    const credentialsTrack = $('#credentialsTrack');
    if (credentialsTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const originalItems = Array.from(credentialsTrack.children);
        originalItems.forEach((item) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('img').forEach((img) => {
                img.setAttribute('alt', '');
                img.setAttribute('loading', 'lazy');
            });
            credentialsTrack.appendChild(clone);
        });
    }

    // Modal
    const modal = $('#formModal');
    const modalClose = $('#modalClose');
    const leadForm = $('#leadForm');
    const formFields = $('#formFields');
    const successMessage = $('#successMessage');

    const openModal = (e) => {
        e?.preventDefault();
        modal?.classList.add('active');
        modal?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        $('#name')?.focus();
    };

    const closeModal = () => {
        modal?.classList.remove('active');
        modal?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    $$('.textbutton-trigger').forEach(btn => btn.addEventListener('click', openModal));
    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
    });

    leadForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const modalFormMessage = $('#modalFormMessage');
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());

        const setMessage = (text, type) => {
            if (!modalFormMessage) return;
            modalFormMessage.hidden = !text;
            modalFormMessage.textContent = text || '';
            modalFormMessage.className = 'form-message' + (type ? ` ${type}` : '');
        };

        setMessage('');

        if (!data.name || !data.email || !data.phone || !data.company) {
            setMessage('Por favor completa todos los campos obligatorios.', 'error');
            const firstEmpty = ['name', 'email', 'phone', 'company']
                .map((id) => document.getElementById(id))
                .find((el) => el && !String(el.value || '').trim());
            firstEmpty?.focus();
            return;
        }

        const submitBtn = leadForm.querySelector('.cta-modal');
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, source: 'autodesk-modal' })
            });

            if (!response.ok) throw new Error('Error en el servidor');

            formFields.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.setAttribute('tabindex', '-1');
            successMessage.focus();

            setTimeout(() => {
                closeModal();
                setTimeout(() => {
                    leadForm.reset();
                    formFields.style.display = '';
                    successMessage.style.display = 'none';
                    setMessage('');
                }, 300);
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
        }
    });
})();
