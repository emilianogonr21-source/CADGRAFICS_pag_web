/*
  Cadgrafics — comportamiento compartido
  Cargar después de assets/js/shared/site-common.js (menú original).

  1. Menú (reutiliza Cadgrafics.initHeader)
  2. Formulario progresivo: form[data-lead-form]
  3. Prellenado desde CTAs: [data-interest], [data-stage]
  4. Pestañas: [data-tabs]
  5. WhatsApp por región y por página
  6. Animación de entrada: .reveal
  7. Cifras animadas: .stats (entrada escalonada y conteo)
  8. Videos ambientales: video[data-ambient] (sin sonido, en bucle)
  9. Carril infinito de insignias: [data-marquee]
*/
(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // Sin CRM (data-endpoint vacío) cada solicitud se envía al script del propio sitio.
  // El destinatario vive solo en contacto.php, no en este archivo.
  const CONTACT_ENDPOINT = '/contacto.php';
  // Orígenes extra solo si más adelante un CRM recibe el lead. Vacío = solo este sitio.
  const LEAD_ENDPOINT_ORIGINS = [];

  // Solo hay dos oficinas. Norte y Sur y sureste se atienden con el número de CDMX.
  const WHATSAPP = { 'CDMX y centro': '525531120508', Occidente: '523314040396' };
  const DEFAULT_WA = WHATSAPP['CDMX y centro'];
  const pageName = document.body.dataset.page || 'el sitio';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const WA_LABEL = { '525531120508': '55 3112 0508', '523314040396': '33 1404 0396' };
  const waUrl = (phone, text) => 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
  const setWhatsAppLinks = (phone, text) => {
    $$('[data-wa]').forEach((a) => {
      a.href = waUrl(phone, text);
      if (a.classList.contains('whatsapp-float')) a.setAttribute('aria-label', 'WhatsApp: ' + WA_LABEL[phone]);
    });
  };

  // ===== 1. Menú =====
  if (window.Cadgrafics) window.Cadgrafics.initHeader({ lockBodyScroll: true });

  setWhatsAppLinks(DEFAULT_WA, 'Hola Cadgrafics, vengo de la página de ' + pageName + ' y quiero platicar con un especialista.');

  // ===== 2. Formulario progresivo =====
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const digits = (v) => String(v || '').replace(/\D/g, '');

  const fieldIsValid = (el, form) => {
    if (el.type === 'radio') return !!form.querySelector('[name="' + el.name + '"]:checked');
    if (el.type === 'checkbox') return el.checked;
    const value = el.value.trim();
    if (!value) return false;
    if (el.type === 'email') return isEmail(value);
    if (el.type === 'tel') return digits(value).slice(-10).length === 10;
    if (el.dataset.rule === 'fullname') return value.split(/\s+/).length >= 2;
    return true;
  };

  const errorAnchor = (el) => (el.type === 'radio' ? el.closest('.chips') : el.closest('.field, .check') || el);

  const showError = (el, invalid) => {
    const anchor = errorAnchor(el);
    const id = 'err-' + (el.id || el.name);
    let msg = document.getElementById(id);
    if (invalid && !msg) {
      msg = document.createElement('p');
      msg.className = 'field__error';
      msg.id = id;
      msg.textContent = el.dataset.error || 'Revisa este dato.';
      anchor.insertAdjacentElement(el.type === 'checkbox' || el.type === 'radio' ? 'afterend' : 'beforeend', msg);
    }
    if (msg) msg.hidden = !invalid;
    const targets = el.type === 'radio' ? $$('[name="' + el.name + '"]', el.form) : [el];
    targets.forEach((t) => {
      if (!t.dataset.describedby && t.hasAttribute('aria-describedby')) {
        t.dataset.describedby = t.getAttribute('aria-describedby');
      }
      t.setAttribute('aria-invalid', String(invalid));
      const hint = t.dataset.describedby || '';
      if (invalid) t.setAttribute('aria-describedby', [id, hint].filter(Boolean).join(' '));
      else if (hint) t.setAttribute('aria-describedby', hint);
      else t.removeAttribute('aria-describedby');
    });
  };

  const validateStep = (step, form) => {
    const seen = new Set();
    let firstInvalid = null;
    $$('[required]', step).forEach((el) => {
      if (el.type === 'radio') {
        if (seen.has(el.name)) return;
        seen.add(el.name);
      }
      const invalid = !fieldIsValid(el, form);
      showError(el, invalid);
      if (invalid && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  const buildLead = (form) => {
    const lead = { LeadSource: 'Web', Origen_Formulario__c: form.dataset.leadForm, Landing_Page__c: location.pathname };
    const qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => {
      if (qs.get(k)) lead['UTM_' + k.split('_')[1].replace(/^./, (c) => c.toUpperCase()) + '__c'] = qs.get(k).slice(0, 100);
    });
    $$('[data-sf]', form).forEach((el) => {
      if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
      const value = el.type === 'checkbox' ? true : el.value.trim();
      if (value !== '') lead[el.dataset.sf] = value;
    });
    const name = form.elements.nombre ? form.elements.nombre.value.trim().split(/\s+/) : [];
    if (name.length) {
      lead.FirstName = name.shift();
      lead.LastName = name.join(' ') || '-';
    }
    if (lead.Consentimiento_Privacidad__c) lead.Fecha_Consentimiento__c = new Date().toISOString();
    return lead;
  };

  // Mensaje de WhatsApp con todos los datos visibles del formulario (etiqueta: valor)
  const SHORT_LABEL = { interes: 'Me interesa', nombre: 'Nombre', empresa: 'Empresa', email: 'Correo', celular: 'Celular', region: 'Región', industria: 'Industria' };
  const STAGE_LABEL = {
    descubrir: 'Explorando, quiere una recomendación',
    evaluar: 'Quiere una demo',
    cotizar: 'Quiere una cotización'
  };
  const fieldLabel = (form, el) => {
    if (SHORT_LABEL[el.name]) return SHORT_LABEL[el.name];
    const label = el.id && form.querySelector('label[for="' + el.id + '"]');
    if (label) return label.textContent.replace(/\s+/g, ' ').replace(/[*:]\s*$/, '').trim();
    const legend = el.closest('fieldset') && $('legend', el.closest('fieldset'));
    return legend ? legend.textContent.trim() : el.name;
  };
  // Pares [etiqueta, valor] de los campos llenos en los pasos indicados (sin honeypot ni casilla de consentimiento)
  const collectFields = (form, steps) => {
    const pairs = [];
    const seen = new Set();
    steps.forEach((step) => {
      $$('input, select, textarea', step).forEach((el) => {
        if (el.type === 'hidden' || el.type === 'checkbox' || el.name === '_honey' || seen.has(el.name)) return;
        let value = '';
        if (el.type === 'radio') {
          seen.add(el.name);
          const checked = form.querySelector('[name="' + el.name + '"]:checked');
          value = checked ? checked.value : '';
        } else if (el.tagName === 'SELECT') {
          value = el.value ? el.options[el.selectedIndex].text : '';
        } else {
          value = el.value.trim();
        }
        if (value) pairs.push([fieldLabel(form, el), value.slice(0, 500)]);
      });
    });
    return pairs;
  };
  const buildMessage = (form, steps) => {
    const lines = ['Hola Cadgrafics, quiero información. Envío mis datos desde la página de ' + pageName + ':', ''];
    collectFields(form, steps).forEach(([label, value]) => lines.push(label + ': ' + value));
    return lines.join('\n');
  };

  // Correo vía contacto.php: el asunto lo arma el servidor; aquí solo viajan los datos ya validados.
  const sendEmail = (form, steps) => {
    const data = { _honey: form.elements._honey ? form.elements._honey.value : '' };
    collectFields(form, steps).forEach(([label, value]) => { data[label.slice(0, 80)] = value.slice(0, 500); });
    data['Página'] = pageName.slice(0, 120);
    data['Dirección de la página'] = location.href.split('#')[0].slice(0, 300);
    const stageKey = form.elements.etapa ? form.elements.etapa.value : '';
    if (STAGE_LABEL[stageKey]) data['Etapa'] = STAGE_LABEL[stageKey];
    const qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => { if (qs.get(k)) data[k] = qs.get(k).slice(0, 100); });
    data['Aceptó aviso de privacidad'] = 'Sí, ' + new Date().toLocaleString('es-MX');

    const controller = 'AbortController' in window ? new AbortController() : null;
    const timer = controller && setTimeout(() => controller.abort(), 15000);
    return fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: controller ? controller.signal : undefined
    })
      .then((res) => res.json().catch(() => ({})).then((json) => {
        if (!res.ok || json.ok !== true) throw new Error('HTTP ' + res.status);
      }))
      .finally(() => { if (timer) clearTimeout(timer); });
  };

  const sendLead = (form, lead, isUpdate) => {
    const endpoint = form.dataset.endpoint;
    if (!endpoint) return;
    let url;
    try { url = new URL(endpoint, location.origin); } catch (err) { return; }
    if (url.origin !== location.origin && LEAD_ENDPOINT_ORIGINS.indexOf(url.origin) === -1) return;
    fetch(url.href, {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(lead)
    }).catch(() => {});
  };

  $$('form[data-lead-form]').forEach((form) => {
    const card = form.closest('.form-card') || form;
    // Sin CRM (data-endpoint vacío) la solicitud llega en un solo correo,
    // así que el paso 3 opcional se omite para no pedir datos que ese correo no guardaría aparte.
    const emailMode = !form.dataset.endpoint;
    const allSteps = $$('.form-step', form);
    const steps = allSteps.filter((s) => !(emailMode && s.dataset.step === '3'));
    const title = $('.form-card__title', card);
    const counter = $('.form-card__steps', card);
    const bar = $('.form-progress span', card);
    const total = steps.filter((s) => s.dataset.step !== 'done').length;
    const submitBtn = $('button[type="submit"]', form);
    let current = 0;
    let sending = false;

    const show = (index, focus) => {
      current = index;
      const step = steps[index];
      allSteps.forEach((s) => { s.hidden = s !== step; });
      const isDone = step.dataset.step === 'done';
      if (title && step.dataset.title) title.textContent = step.dataset.title;
      if (counter) counter.textContent = isDone ? 'Solicitud enviada' : 'Paso ' + (index + 1) + ' de ' + total;
      if (bar) bar.style.width = (isDone ? 100 : ((index + 1) / total) * 100) + '%';
      if (focus) {
        const target = isDone ? step : $('input:not([type=hidden]), select, textarea', step);
        if (target) target.focus({ preventScroll: true });
      }
    };

    const updateConditional = () => {
      $$('[data-show-if]', form).forEach((el) => {
        const [name, value] = el.dataset.showIf.split('=');
        const field = form.elements[name];
        el.hidden = !field || field.value !== value;
      });
    };

    const updateWhatsApp = () => {
      const region = form.elements.region ? form.elements.region.value : '';
      const interest = form.elements.interes ? form.elements.interes.value : '';
      const person = form.elements.nombre ? form.elements.nombre.value.trim() : '';
      const company = form.elements.empresa ? form.elements.empresa.value.trim() : '';
      const text = 'Hola Cadgrafics, soy ' + (person || 'un visitante') + (company ? ' de ' + company : '') +
        '. Acabo de dejar mis datos en la página de ' + pageName + (interest ? ' (me interesa: ' + interest + ')' : '') + '.';
      setWhatsAppLinks(WHATSAPP[region] || DEFAULT_WA, text);
    };

    form.addEventListener('change', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' && fieldIsValid(e.target, form)) showError(e.target, false);
      if (e.target.name === 'region') updateWhatsApp();
      updateConditional();
    });

    form.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) {
        if (validateStep(steps[current], form)) show(current + 1, true);
      } else if (e.target.closest('[data-back]')) {
        show(current - 1, true);
      } else if (e.target.closest('[data-finish]')) {
        sendLead(form, buildLead(form), true);
        show(steps.length - 1, true);
      } else if (e.target.closest('[data-skip]')) {
        show(steps.length - 1, true);
      }
    });

    form.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA') return;
      const next = $('[data-next]', steps[current]);
      if (next) {
        e.preventDefault();
        next.click();
      }
    });

    // Aviso si el correo no sale: se puede reintentar o mandar los mismos datos por WhatsApp
    const showSendError = (show) => {
      let alert = $('.form-alert', form);
      if (!show) { if (alert) alert.hidden = true; return; }
      const region = form.elements.region ? form.elements.region.value : '';
      const phone = WHATSAPP[region] || DEFAULT_WA;
      if (!alert) {
        alert = document.createElement('div');
        alert.className = 'form-alert';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = '<p>No pudimos enviar tu solicitud. Inténtalo de nuevo o mándanos los mismos datos por WhatsApp.</p>' +
          '<a class="btn btn--wa btn--block" target="_blank" rel="noopener">Enviar mis datos por WhatsApp</a>';
        $('.form-actions', steps[current]).insertAdjacentElement('beforebegin', alert);
      }
      $('a', alert).href = waUrl(phone, buildMessage(form, steps));
      alert.hidden = false;
    };

    const setSending = (on) => {
      sending = on;
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.setAttribute('aria-busy', String(on));
      if (submitBtn.firstChild && submitBtn.firstChild.nodeType === 3) submitBtn.firstChild.textContent = on ? 'Enviando… ' : 'Enviar ';
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (sending) return;
      if (form.elements._honey && form.elements._honey.value) {
        showSendError(true);
        return;
      }
      if (!validateStep(steps[current], form)) return;
      sendLead(form, buildLead(form), false);
      updateWhatsApp();
      if (!emailMode) {
        show(current + 1, true);
        return;
      }
      showSendError(false);
      setSending(true);
      sendEmail(form, steps)
        .then(() => show(current + 1, true))
        .catch((err) => {
          console.warn('No se pudo enviar el correo de la solicitud:', err);
          showSendError(true);
        })
        .finally(() => setSending(false));
    });

    updateConditional();
    show(0, false);
  });

  // ===== 3. Prellenado desde CTAs =====
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-interest], [data-stage]');
    if (!cta) return;
    const href = cta.getAttribute('href') || '';
    if (href.slice(-9) !== '#contacto') return;
    const form = $('form[data-lead-form]');
    if (!form) return;
    if (cta.dataset.stage && form.elements.etapa) form.elements.etapa.value = cta.dataset.stage;
    if (cta.dataset.interest) {
      const option = $$('[name="interes"]', form).find((r) => r.value === cta.dataset.interest);
      if (option) {
        option.checked = true;
        option.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  // ===== 4. Pestañas =====
  $$('[data-tabs]').forEach((tabs) => {
    const buttons = $$('[role="tab"]', tabs);
    const select = (btn, focus) => {
      buttons.forEach((b) => {
        const active = b === btn;
        b.setAttribute('aria-selected', String(active));
        b.tabIndex = active ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !active;
      });
      if (focus) btn.focus();
    };
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => select(btn));
      btn.addEventListener('keydown', (e) => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        select(buttons[(i + dir + buttons.length) % buttons.length], true);
      });
    });
    const initial = buttons.find((b) => b.getAttribute('aria-selected') === 'true') || buttons[0];
    if (initial) select(initial);
  });

  // ===== 6. Animación de entrada =====
  const below = $$('.reveal').filter((el) => el.getBoundingClientRect().top > window.innerHeight);
  if (below.length && !reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal--pending');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    below.forEach((el) => {
      el.classList.add('reveal--pending');
      io.observe(el);
    });
  }

  // ===== 7. Cifras animadas: .stats =====
  // Solo cuentan los valores que empiezan con número ("500M+", "99.9%", "−40%", "30 A1/min").
  // Textos como "Platinum" o "macOS 27" y años como "2010" solo aparecen, sin contar.
  const parseStat = (text) => {
    const m = text.trim().match(/^([+\-−]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!m || (!m[1] && !m[3].trim() && /^(19|20)\d{2}$/.test(m[2]))) return null;
    return { prefix: m[1], value: parseFloat(m[2]), decimals: (m[2].split('.')[1] || '').length, suffix: m[3] };
  };
  const formatStat = (s, n) => s.prefix + n.toFixed(s.decimals) + s.suffix;
  const countUp = (el, s) => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1600, 1);
      el.textContent = formatStat(s, s.value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const counters = new Map();
    const statsIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        statsIO.unobserve(entry.target);
        entry.target.classList.remove('stats--pending');
        $$('.stat__count', entry.target).forEach((el) => {
          const { stat, delay } = counters.get(el);
          setTimeout(() => countUp(el, stat), delay);
        });
      });
    }, { threshold: 0.35 });

    $$('.stats').forEach((stats) => {
      $$('.stat', stats).forEach((item, i) => {
        item.style.setProperty('--i', i);
        const value = $('dd, strong', item);
        const stat = value && parseStat(value.textContent);
        if (!stat) return;
        // El número que se anima va oculto para lectores de pantalla; ellos leen el valor final
        const finalText = value.textContent.trim();
        const visible = document.createElement('span');
        visible.className = 'stat__count';
        visible.setAttribute('aria-hidden', 'true');
        visible.textContent = formatStat(stat, 0);
        const hidden = document.createElement('span');
        hidden.className = 'visually-hidden';
        hidden.textContent = finalText;
        value.replaceChildren(visible, hidden);
        counters.set(visible, { stat, delay: i * 120 + 150 });
      });
      stats.classList.add('stats--pending');
      statsIO.observe(stats);
    });
  }

  // ===== 8. Videos ambientales =====
  // Sin sonido y en bucle (loop en el HTML). Corren mientras están en pantalla; fuera de ella se detienen
  // para no gastar batería. Con "reducir movimiento", ahorro de datos o red 2G se queda la imagen fija (poster).
  const net = navigator.connection;
  const saveData = !!(net && net.saveData);
  const slowNet = !!(net && (net.effectiveType === 'slow-2g' || net.effectiveType === '2g'));

  if (!reduceMotion && !saveData && !slowNet) {
    $$('video[data-ambient]').forEach((video) => {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
          });
        }, { threshold: 0.25 }).observe(video);
      } else {
        video.play().catch(() => {});
      }
    });
  }

  // ===== 9. Carril infinito de insignias =====
  // Con "reducir movimiento" se queda la fila fija original. Las copias van ocultas para lectores de pantalla.
  if (!reduceMotion) {
    $$('[data-marquee]').forEach((row) => {
      const items = Array.from(row.children);
      if (items.length < 3) return;
      const track = document.createElement('div');
      track.className = 'marquee__track';
      // Se repite el juego hasta cubrir pantallas anchas; luego se duplica todo para que el bucle no tenga corte
      const sets = Math.max(1, Math.ceil(1600 / (items.length * 170)));
      const half = [];
      for (let s = 0; s < sets; s++) {
        items.forEach((item) => {
          const node = s === 0 ? item : item.cloneNode(true);
          if (s > 0) { node.setAttribute('aria-hidden', 'true'); if (node.alt !== undefined) node.alt = ''; }
          half.push(node);
        });
      }
      half.forEach((node) => track.appendChild(node));
      half.forEach((node) => {
        const copy = node.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        if (copy.alt !== undefined) copy.alt = '';
        copy.removeAttribute('loading');
        track.appendChild(copy);
      });
      track.style.setProperty('--marquee-duration', half.length * 5 + 's');
      row.classList.remove('badge-row');
      row.classList.add('marquee');
      row.replaceChildren(track);
    });
  }
})();
