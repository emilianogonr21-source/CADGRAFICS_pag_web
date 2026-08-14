/*
  Comportamiento de SketchUp (Chaos) — Cadgrafics
  -----------------------------------------------
  Depende de: assets/js/shared/site-common.js (menú, Contáctanos, WhatsApp)
  Contenido: pages/chaos/home-chaos.html
  Apariencia: assets/css/chaos/home-chaos.css

  Guía del equipo: docs/README.md
*/
(function () {
  'use strict';

  const CG = window.Cadgrafics;
  if (!CG) {
    console.error('Cadgrafics site-common.js no cargó');
    return;
  }

  const { initHeader, initSmoothAnchors, initStandardLeadModal } = CG;

  initHeader({ lockBodyScroll: true });
  initSmoothAnchors();
  initStandardLeadModal({
    source: 'modal-chaos',
    label: 'SketchUp / Chaos',
    fieldMap: { name: '#name', email: '#email', phone: '#phone', company: '#company' },
    focusSelector: '#name',
    triggerSelector: '.textbutton-trigger, .modal-trigger',
  });

  // ============ PLANES + STATS ============
  const plansData = {
    pro: {
      title: 'SketchUp Pro',
      dark: false,
      description:
        'Ideal para arquitectos y diseñadores que trabajan con SketchUp como herramienta principal de modelado, documentación y colaboración.',
    },
    proscan: {
      title: 'SketchUp Pro Scan',
      dark: false,
      description:
        'Agrega Scan Essentials al plan Pro. Ideal para profesionales que trabajan con nubes de puntos (LiDAR), levantamientos As Built y remodelaciones.',
    },
    proadvanced: {
      title: 'SketchUp Pro Advanced',
      dark: false,
      description:
        'Incorpora Scan Essentials y Revit Importer. Para oficinas en entornos mixtos Revit + SketchUp que necesitan importar archivos .rvt directamente.',
    },
    studio: {
      title: 'SketchUp Studio',
      dark: true,
      tag: 'MÁS COMPLETO',
      note: 'Nota: V-Ray, Scan Essentials y Revit Importer disponibles solo en Windows.',
      description:
        'El plan más completo. Añade V-Ray for SketchUp para rendering fotorrealista de alto nivel, conectividad BIM completa y nube de puntos.',
    },
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
    ['V-Ray (render)', false, false, false, true],
  ];

  const planColumnMap = { pro: 1, proscan: 2, proadvanced: 3, studio: 4 };

  function renderPlan(planKey) {
    const plan = plansData[planKey];
    const display = document.getElementById('plan-display');
    const toolsList = document.getElementById('tools-list');
    if (!display || !toolsList || !plan) return;
    const col = planColumnMap[planKey];

    display.className = 'plan-content' + (plan.dark ? ' dark' : '');
    display.innerHTML =
      '<div class="plan-title">' +
      plan.title +
      (plan.tag ? '<span class="plan-tag">' + plan.tag + '</span>' : '') +
      '</div><p>' +
      plan.description +
      '</p>' +
      (plan.note ? '<div class="plan-note">' + plan.note + '</div>' : '') +
      '<a href="#contacto" class="btn btn-primary btn-large btn-full textbutton-trigger">Solicitar cotización</a>';

    let toolsHtml = '';
    comparisonData.forEach(function (row) {
      const name = row[0];
      const included = Boolean(row[col]);
      if (included) {
        toolsHtml +=
          '<div class="tool-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
          name +
          '</div>';
      } else {
        toolsHtml +=
          '<div class="tool-item disabled"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
          name +
          '</div>';
      }
    });
    toolsList.innerHTML = toolsHtml;

    // Re-bind modal triggers inside newly injected CTA
    display.querySelectorAll('.textbutton-trigger').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const modal = document.getElementById('formModal');
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) {
        t.classList.remove('active');
      });
      tab.classList.add('active');
      renderPlan(tab.dataset.plan);
    });
  });

  const formatStat = function (value, decimals) {
    return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  };

  const animateCounter = function (element, target, suffix, decimals) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(function () {
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
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            document.querySelectorAll('.stat__number').forEach(function (stat) {
              const target = parseFloat(stat.dataset.target);
              const suffix = stat.dataset.suffix || '';
              const decimals = parseInt(stat.dataset.decimals || '0', 10);
              animateCounter(stat, target, suffix, decimals);
            });
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }

  renderPlan('studio');
})();
