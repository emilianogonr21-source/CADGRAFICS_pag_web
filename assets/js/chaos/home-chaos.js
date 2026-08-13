// ============ HEADER + MODAL (lógica de index.html) ============
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

      if (header) {
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
          }
        }, { passive: true });
        updateHeader();
      }

      // Mobile menu
      const mobileToggle = $('#mobileToggle');
      const navMenu = $('#navMenu');

      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
          const isActive = navMenu.classList.toggle('active');
          mobileToggle.setAttribute('aria-expanded', String(isActive));
          mobileToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
          document.body.style.overflow = isActive ? 'hidden' : '';

          const icon = mobileToggle.querySelector('svg use');
          if (icon) icon.setAttribute('href', isActive ? '#icon-close' : '#icon-menu');

          if (!isActive) {
            $$('.nav-item.active, .dropdown-submenu.active').forEach(el => el.classList.remove('active'));
            $$('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false'));
          }
        });
      }

      // Dropdowns
      const setupDropdown = (selector, parentSelector) => {
        $$(selector).forEach(link => {
          link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
              const parent = link.closest(parentSelector);
              const hasMenu = parent?.querySelector('.dropdown-menu, .dropdown-submenu-menu');
              if (!parent || !hasMenu) return;
              if (parent.classList.contains('active')) return;

              e.preventDefault();
              parent.classList.add('active');
              link.setAttribute('aria-expanded', 'true');

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
              if (parent?.querySelector('.dropdown-menu, .dropdown-submenu-menu')) {
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

      // Smooth scroll anchors (excepto trigger del modal)
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          if (anchor.classList.contains('textbutton-trigger')) return;

          const targetId = anchor.getAttribute('href');
          if (!targetId || targetId.length < 2) return;

          const target = $(targetId);
          if (!target) return;

          e.preventDefault();
          const headerOffset = window.innerWidth <= 768 ? 80 : 140;
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      });

      // Modal
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
        if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
        if (modal?.classList.contains('active') && e.key === 'Tab') {
          const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
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
        if (!data.name || data.name.length < 3) { $('#name').classList.add('is-invalid'); hasError = true; }
        if (!isValidEmail(data.email)) { $('#email').classList.add('is-invalid'); hasError = true; }
        if (!isValidPhone(data.phone)) { $('#phone').classList.add('is-invalid'); hasError = true; }
        if (!data.company || data.company.length < 2) { $('#company').classList.add('is-invalid'); hasError = true; }

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
            body: JSON.stringify({ ...data, source: 'modal-chaos' })
          });

          if (!response.ok) throw new Error('Error en el servidor');

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
    })();

    // ============ PLANES + STATS ============
    (function () {
      'use strict';

      // Datos (herramientas vía comparisonData)
      const plansData = {
        pro: {
          title: 'SketchUp Pro',
          dark: false,
          description: 'Ideal para arquitectos y diseñadores que trabajan con SketchUp como herramienta principal de modelado, documentación y colaboración.'
        },
        proscan: {
          title: 'SketchUp Pro Scan',
          dark: false,
          description: 'Agrega Scan Essentials al plan Pro. Ideal para profesionales que trabajan con nubes de puntos (LiDAR), levantamientos As Built y remodelaciones.'
        },
        proadvanced: {
          title: 'SketchUp Pro Advanced',
          dark: false,
          description: 'Incorpora Scan Essentials y Revit Importer. Para oficinas en entornos mixtos Revit + SketchUp que necesitan importar archivos .rvt directamente.'
        },
        studio: {
          title: 'SketchUp Studio',
          dark: true,
          tag: 'MÁS COMPLETO',
          note: 'Nota: V-Ray, Scan Essentials y Revit Importer disponibles solo en Windows.',
          description: 'El plan más completo. Añade V-Ray for SketchUp para rendering fotorrealista de alto nivel, conectividad BIM completa y nube de puntos.'
        }
      };

      const comparisonData = [
        ['SketchUp Web', true, true, true, true],
        ['SketchUp Desktop', true, true, true, true],
        ['SketchUp for iPad', true, true, true, true],
        ['LayOut', true, true, true, true],
        ['Extension Warehouse', true, true, true, true],
        ['3D Warehouse', true, true, true, true],
        ['Trimble Connect', true, true, true, true],
        ['PreDesign', true, true, true, true],
        ['Scan Essentials', false, true, true, true],
        ['Revit Importer', false, false, true, true],
        ['V-Ray (render)', false, false, false, true]
      ];

      const planColumnMap = { pro: 1, proscan: 2, proadvanced: 3, studio: 4 };

      function renderPlan(planKey) {
        const plan = plansData[planKey];
        const display = document.getElementById('plan-display');
        const toolsList = document.getElementById('tools-list');
        const col = planColumnMap[planKey];
        const activeTab = document.querySelector(`.tab[data-plan="${planKey}"]`);

        display.className = 'plan-content' + (plan.dark ? ' dark' : '');
        if (activeTab?.id) {
          display.setAttribute('aria-labelledby', activeTab.id);
        }

        display.innerHTML = `
          <div class="plan-title">
            ${plan.title}
            ${plan.tag ? `<span class="plan-tag">${plan.tag}</span>` : ''}
          </div>
          <p>${plan.description}</p>
          ${plan.note ? `<div class="plan-note">${plan.note}</div>` : ''}
          <a href="#contacto" class="btn btn-primary btn-large btn-full">Solicitar cotización</a>
        `;

        // Herramientas desde comparisonData (columna del plan activo)
        let toolsHtml = '';
        comparisonData.forEach(row => {
          const name = row[0];
          const included = Boolean(row[col]);
          if (included) {
            toolsHtml += `
              <div class="tool-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                ${name}
              </div>`;
          } else {
            toolsHtml += `
              <div class="tool-item disabled">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                ${name}
              </div>`;
          }
        });
        toolsList.innerHTML = toolsHtml;
      }

      const tabs = Array.from(document.querySelectorAll('.tab'));

      const activateTab = (tab, { focusPanel = false } = {}) => {
        tabs.forEach(t => {
          const selected = t === tab;
          t.classList.toggle('active', selected);
          t.setAttribute('aria-selected', String(selected));
          t.tabIndex = selected ? 0 : -1;
        });
        renderPlan(tab.dataset.plan);
        if (focusPanel) {
          document.getElementById('plan-display')?.focus();
        }
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (e) => {
          let nextIndex = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIndex = (index + 1) % tabs.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (e.key === 'Home') {
            nextIndex = 0;
          } else if (e.key === 'End') {
            nextIndex = tabs.length - 1;
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateTab(tab, { focusPanel: true });
            return;
          }
          if (nextIndex !== null) {
            e.preventDefault();
            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);
          }
        });
      });

      // Counter animation (hero__stats)
      const formatStat = (value, decimals) =>
        decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));

      const animateCounter = (element, target, suffix, decimals) => {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(timer);
            element.textContent = formatStat(target, decimals) + suffix;
            return;
          }
          element.textContent = formatStat(current, decimals) + suffix;
        }, 25);
      };

      const statsSection = document.querySelector('.hero__stats');
      if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              document.querySelectorAll('.stat__number').forEach(stat => {
                const target = parseFloat(stat.dataset.target);
                const suffix = stat.dataset.suffix || '';
                const decimals = parseInt(stat.dataset.decimals || '0', 10);
                animateCounter(stat, target, suffix, decimals);
              });
              statsObserver.disconnect();
            }
          });
        }, { threshold: 0.4 });

        statsObserver.observe(statsSection);
      }

      renderPlan('studio');
    })();

    // ============ HERO LEAD FORM ============
    (function () {
      'use strict';

      const form = document.getElementById('heroLeadForm');
      const messageEl = document.getElementById('heroFormMessage');
      if (!form || !messageEl) return;

      const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      const setMessage = (text, type) => {
        messageEl.hidden = !text;
        messageEl.textContent = text || '';
        messageEl.className = 'form-message' + (type ? ` ${type}` : '');
      };

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setMessage('');

        const fd = new FormData(form);
        const nombre = String(fd.get('nombre') || '').trim();
        const email = String(fd.get('email') || '').trim();
        const telefono = String(fd.get('telefono') || '').trim();
        const empresa = String(fd.get('empresa') || '').trim();
        const interes = String(fd.get('interes') || '').trim();

        if (!nombre) {
          setMessage('Por favor, ingresa tu nombre.', 'error');
          document.getElementById('hero-nombre')?.focus();
          return;
        }
        if (!isValidEmail(email)) {
          setMessage('Por favor, ingresa un correo válido.', 'error');
          document.getElementById('hero-email')?.focus();
          return;
        }
        if (!interes) {
          setMessage('Selecciona qué deseas saber.', 'error');
          document.getElementById('hero-interes')?.focus();
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
          const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre,
              email,
              telefono,
              empresa,
              interes,
              source: 'chaos-hero-form'
            })
          });

          if (!response.ok) throw new Error('Error en el servidor');

          setMessage('¡Gracias ' + nombre + '! Te contactaremos pronto.', 'success');
          form.reset();
        } catch (error) {
          console.error('Error al enviar formulario:', error);
          setMessage('No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }
      });
    })();
