document.addEventListener('DOMContentLoaded', function () {
      const header = document.getElementById('header');

      // ============================================
      // UTILIDAD: DEBOUNCE
      // ============================================
      function debounce(func, wait) {
        let timeout;
        return function (...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
        };
      }

      // ============================================
      // DATOS DEL CUADRO COMPARATIVO
      // ============================================
      const tableData = [
        {
          section: "FUNCIONES CREATIVAS",
          rows: [
            {
              feature: "Aplicaciones y servicios creativos",
              values: [
                { type: "check", color: "blue" },
                { type: "check", color: "blue" },
                { type: "check", color: "blue" }
              ]
            },
            {
              feature: "Funciones de IA generativa estándar de Adobe Firefly (Imagen y vector¹)",
              values: [
                { type: "check", color: "blue", note: "Ilimitado" },
                { type: "check", color: "blue", note: "Ilimitado" },
                { type: "check", color: "blue", note: "Ilimitado<br>+ Composiciones de objetos y kits de estilos" }
              ]
            },
            {
              feature: "4,000 créditos generativos para funciones prémium de IA generativa (Video y audio)",
              values: [
                { type: "check", color: "blue" },
                { type: "check", color: "blue" },
                { type: "check", color: "blue" }
              ]
            },
            {
              feature: "Adobe Stock: fotos, activos de diseño y en 3D estándar ilimitados",
              values: [
                { type: "cross", color: "gray" },
                { type: "check", color: "blue" },
                { type: "check", color: "blue" }
              ]
            },
            {
              feature: "Adobe Stock: tipo de licencia²",
              values: [
                { type: "cross", color: "gray" },
                { type: "check", color: "yellow", note: "Mejorado" },
                { type: "check", color: "blue", note: "Ampliado" }
              ]
            },
            {
              feature: "Sesiones con especialistas en productos de Adobe",
              values: [
                { type: "check", color: "yellow", note: "2 por persona al año" },
                { type: "check", color: "yellow", note: "2 por persona al año" },
                { type: "check", color: "blue", note: "Ilimitado" }
              ]
            }
          ]
        },
        {
          section: "FUNCIONES ADMINISTRATIVAS",
          rows: [
            {
              feature: "Indemnización por propiedad intelectual (Adobe Stock y Firefly)³",
              values: [
                { type: "cross", color: "gray" },
                { type: "check", color: "yellow", note: "US$ 10,000/activo" },
                { type: "check", color: "blue", note: "Plan VIP: US$ 10,000/activo" }
              ]
            },
            {
              feature: "Seguridad y asistencia técnica de nivel empresarial",
              values: [
                { type: "check", color: "yellow", note: "Limitado" },
                { type: "check", color: "yellow", note: "Limitado" },
                { type: "check", color: "blue", note: "Ilimitado" }
              ]
            },
            {
              feature: "Funciones administrativas",
              values: [
                { type: "check", color: "yellow", note: "Solo rol de administrador del sistema" },
                { type: "check", color: "yellow", note: "Solo rol de administrador del sistema" },
                { type: "check", color: "blue", note: "Rol de administrador del sistema, producto, perfil del producto, grupo de personas usuarias, implementación y asistencia técnica" }
              ]
            },
            {
              feature: "Inicio de sesión único (SSO)",
              values: [
                { type: "cross", color: "gray" },
                { type: "cross", color: "gray" },
                { type: "check", color: "blue" }
              ]
            },
            {
              feature: "Control del acceso a los servicios en grupo",
              values: [
                { type: "cross", color: "gray" },
                { type: "cross", color: "gray" },
                { type: "check", color: "blue" }
              ]
            },
            {
              feature: "Incorporación e implementación personalizadas",
              values: [
                { type: "cross", color: "gray" },
                { type: "cross", color: "gray" },
                { type: "check", color: "blue" }
              ]
            }
          ]
        }
      ];

      function getIcon(type, color) {
        if (type === "check") {
          if (color === "blue") return '<span class="comparativo-icon icon-check-blue">☑</span>';
          if (color === "yellow") return '<span class="comparativo-icon icon-check-yellow">☑</span>';
        }
        if (type === "cross") {
          return '<span class="comparativo-icon icon-cross-gray">✗</span>';
        }
        return '';
      }

      function buildTable() {
        const tbody = document.getElementById('table-body');
        if (!tbody) return;

        tableData.forEach((sectionData, sectionIndex) => {
          sectionData.rows.forEach((row) => {
            const tr = document.createElement('tr');
            tr.className = 'feature-row';

            const tdFeature = document.createElement('td');
            tdFeature.textContent = row.feature;
            tr.appendChild(tdFeature);

            row.values.forEach(val => {
              const td = document.createElement('td');
              td.innerHTML = getIcon(val.type, val.color);
              if (val.note) {
                td.innerHTML += `<span class="comparativo-note">${val.note}</span>`;
              }
              tr.appendChild(td);
            });

            tbody.appendChild(tr);
          });

          if (sectionIndex < tableData.length - 1) {
            const dividerTr = document.createElement('tr');
            dividerTr.innerHTML = '<td colspan="4" style="background:var(--gray-700); height:3px; padding:0;"></td>';
            tbody.appendChild(dividerTr);
          }
        });
      }

      // Update sidebar on scroll
      function updateSidebar() {
        const table = document.getElementById('comparative-table');
        const sidebar = document.getElementById('sidebar-label');
        if (!table || !sidebar) return;

        const tableRect = table.getBoundingClientRect();
        const tableTop = tableRect.top + window.scrollY;
        const tableHeight = table.offsetHeight;

        const scrollProgress = (window.scrollY - tableTop + window.innerHeight / 2) / tableHeight;
        const firstSectionRows = tableData[0].rows.length;
        const totalRows = tableData.reduce((sum, s) => sum + s.rows.length, 0);

        if (scrollProgress > (firstSectionRows / totalRows)) {
          sidebar.textContent = "FUNCIONES ADMINISTRATIVAS";
          sidebar.style.background = "var(--adobe-red)";
        } else {
          sidebar.textContent = "FUNCIONES CREATIVAS";
          sidebar.style.background = "var(--gray-700)";
        }
      }

      // ============================================
      // HEADER SCROLL
      // ============================================
      const handleHeaderScroll = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
      };
      window.addEventListener('scroll', handleHeaderScroll, { passive: true });
      handleHeaderScroll();

      // ============================================
      // FAQ ACCORDION
      // ============================================
      const faqItems = document.querySelectorAll('.faq-item');

      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const answerInner = item.querySelector('.faq-answer-inner');
        if (!question || !answer || !answerInner) return;

        if (item.classList.contains('active')) {
          answer.style.maxHeight = answerInner.scrollHeight + 40 + 'px';
        }

        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            otherItem.querySelector('.faq-answer').style.maxHeight = '0';
          });

          if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answerInner.scrollHeight + 40 + 'px';
          }
        });
      });

      // ============================================
      // ANIMACIÓN DE APARICIÓN AL HACER SCROLL
      // ============================================
      function observeReveal(selector) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              entry.target.style.willChange = 'auto';
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        const DELAY_STEP = 0.08;
        document.querySelectorAll(selector).forEach((el, index) => {
          const groupDelay = (index % 6) * DELAY_STEP;
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.willChange = 'opacity, transform';
          el.style.transition = `opacity 0.6s ease ${groupDelay}s, transform 0.6s ease ${groupDelay}s`;
          observer.observe(el);
        });
      }

      // ============================================
      // MOBILE MENU TOGGLE
      // ============================================
      const mobileToggle = document.getElementById('mobileToggle');
      const navMenu = document.getElementById('navMenu');

      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
          const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
          const next = !isExpanded;
          mobileToggle.setAttribute('aria-expanded', String(next));
          mobileToggle.setAttribute('aria-label', next ? 'Cerrar menú' : 'Abrir menú');
          navMenu.classList.toggle('active', next);
          document.body.style.overflow = next ? 'hidden' : '';

          const icon = mobileToggle.querySelector('svg use');
          if (icon) icon.setAttribute('href', next ? '#icon-close' : '#icon-menu');

          if (!next) {
            document.querySelectorAll('.nav-item.open, .dropdown-submenu.open').forEach(el => {
              el.classList.remove('open');
              el.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
            });
          }
        });
      }

      // ============================================
      // DROPDOWN TOGGLE (Mobile + Accesibilidad)
      // ============================================
      function setupDropdown(linkSelector, parentSelector) {
        document.querySelectorAll(linkSelector).forEach(toggle => {
          toggle.addEventListener('click', (e) => {
            if (window.innerWidth > 768 && toggle.getAttribute('href') !== '#') return;

            e.preventDefault();
            const parent = toggle.closest(parentSelector);
            if (!parent) return;

            const isOpen = parent.classList.contains('open');

            parent.parentElement?.querySelectorAll(`:scope > ${parentSelector}.open`).forEach(sib => {
              if (sib !== parent) {
                sib.classList.remove('open');
                sib.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
              }
            });

            parent.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
          });
        });
      }

      setupDropdown('.nav-item > a', '.nav-item');
      setupDropdown('.dropdown-submenu > a', '.dropdown-submenu');

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item') && !e.target.closest('.dropdown-submenu')) {
          document.querySelectorAll('.nav-item.open, .dropdown-submenu.open').forEach(el => {
            el.classList.remove('open');
            el.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
          });
        }
      });

      // ============================================
      // MODAL CON FOCUS TRAP
      // ============================================
      const modal = document.getElementById('formModal');
      const modalClose = document.getElementById('modalClose');
      const leadForm = document.getElementById('leadForm');
      const formFields = document.getElementById('formFields');
      const successMessage = document.getElementById('successMessage');
      let lastFocusedElement = null;

      function openModal() {
        if (!modal) return;
        lastFocusedElement = document.activeElement;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => modalClose?.focus(), 100);
      }

      function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement) lastFocusedElement.focus();
      }

      document.querySelectorAll('.modal-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      });

      if (modalClose) modalClose.addEventListener('click', closeModal);

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (!modal?.classList.contains('active')) return;

        if (e.key === 'Escape') closeModal();

        if (e.key === 'Tab') {
          const focusableElements = modal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusable = focusableElements[0];
          const lastFocusable = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) { e.preventDefault(); lastFocusable.focus(); }
          } else {
            if (document.activeElement === lastFocusable) { e.preventDefault(); firstFocusable.focus(); }
          }
        }
      });

      // ============================================
      // FORMULARIO CON HONEYPOT
      // ============================================
      if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const honeypot = leadForm.querySelector('[name="website"]');
          if (honeypot && honeypot.value) return;

          if (!leadForm.checkValidity()) {
            leadForm.reportValidity();
            return;
          }

          if (formFields) formFields.style.display = 'none';
          if (successMessage) successMessage.style.display = 'block';

          setTimeout(() => {
            closeModal();
            leadForm.reset();
            if (formFields) formFields.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
          }, 3000);
        });
      }

      // ============================================
      // INICIALIZAR TABLA COMPARATIVO + REVEALS
      // ============================================
      buildTable();
      observeReveal('.app-card, .infra-card, .firefly-image-card, .express-feature, .faq-item, .feature-row');
      window.addEventListener('scroll', debounce(updateSidebar, 16), { passive: true });
      updateSidebar();
    });
