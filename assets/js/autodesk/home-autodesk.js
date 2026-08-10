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
        
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());

        // Validación simple
        if (!data.name || !data.email || !data.phone || !data.company) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        const submitBtn = leadForm.querySelector('.cta-modal');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            // Simular envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            formFields.style.display = 'none';
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                closeModal();
                setTimeout(() => {
                    leadForm.reset();
                    formFields.style.display = '';
                    successMessage.style.display = 'none';
                }, 300);
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<svg width="16" height="16"><use href="#icon-send"/></svg> Enviar consulta';
        }
    });
})();
