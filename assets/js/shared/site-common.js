/*
  Cadgrafics — menú y videos diferidos
  ------------------------------------------------------------
  Qué hace este archivo:
  - Menú de arriba (también en celular)
  - Videos con preload="none": cargan al entrar en pantalla

  El formulario de contacto vive en assets/js/site.js.
  Guía del equipo: docs/README.md
*/
(function (global) {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* Menú de arriba: cambia al hacer scroll, abre en celular y maneja submenús. */
  function initHeader(options) {
    const opts = options || {};
    const header = $('#header');
    const mobileToggle = $('#mobileToggle');
    const navMenu = $('#navMenu');
    /* 1024: menú hamburguesa también en tablet/laptop estrecha */
    const breakpoint = opts.breakpoint || 1024;

    if (header) {
      let ticking = false;
      const update = function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      };
      window.addEventListener(
        'scroll',
        function () {
          if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
          }
        },
        { passive: true }
      );
      update();
    }

    if (mobileToggle && navMenu) {
      const setMenuOpen = function (isOpen) {
        navMenu.classList.toggle('active', isOpen);
        mobileToggle.classList.toggle('is-open', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        if (opts.lockBodyScroll) document.body.style.overflow = isOpen ? 'hidden' : '';
        if (!isOpen) {
          $$('.nav-item.active, .dropdown-submenu.active').forEach(function (el) {
            el.classList.remove('active');
          });
        }
      };
      const isMenuOpen = function () {
        return navMenu.classList.contains('active');
      };

      mobileToggle.addEventListener('click', function () {
        setMenuOpen(!isMenuOpen());
      });

      $$('.nav-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
          const parent = link.closest('.nav-item, .dropdown-submenu');
          const hasMenu =
            parent &&
            parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
          if (hasMenu && window.innerWidth <= breakpoint) return;
          setMenuOpen(false);
        });
      });

      /* Al girar una tablet o agrandar la ventana, el menú móvil no debe dejar el scroll bloqueado. */
      window.addEventListener('resize', function () {
        if (window.innerWidth > breakpoint && isMenuOpen()) setMenuOpen(false);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !isMenuOpen()) return;
        setMenuOpen(false);
        mobileToggle.focus();
      });
    }

    function setupDropdown(selector, parentSelector) {
      $$(selector).forEach(function (link) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth > breakpoint) return;
          const parent = link.closest(parentSelector);
          const hasMenu =
            parent &&
            parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-menu');
          if (!hasMenu) return;
          e.preventDefault();
          e.stopPropagation();
          const isActive = parent.classList.toggle('active');
          link.setAttribute('aria-expanded', String(isActive));
          $$(parentSelector + '.active').forEach(function (sib) {
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
  }

  /**
   * Videos con preload="none": carga y reproduce al entrar en vista
   * (ahorra ancho de banda en secciones bajo el fold).
   */
  function initLazyVideos(options) {
    const opts = options || {};
    const videos = $$(opts.selector || 'video[preload="none"]');
    if (!videos.length) return;

    const playWhenVisible = function (video) {
      if (video.hasAttribute('controls') && !video.hasAttribute('data-autoplay-onview')) return;
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* autoplay bloqueado */ });
    };

    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (video) {
        video.setAttribute('preload', 'metadata');
        video.load();
        playWhenVisible(video);
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.getAttribute('data-lazy-loaded') !== '1') {
              video.setAttribute('preload', 'metadata');
              video.load();
              video.setAttribute('data-lazy-loaded', '1');
            }
            playWhenVisible(video);
          } else if (!video.hasAttribute('controls')) {
            video.pause();
          }
        });
      },
      { rootMargin: opts.rootMargin || '120px 0px', threshold: 0.15 }
    );

    videos.forEach(function (video) {
      io.observe(video);
    });
  }

  global.Cadgrafics = {
    initHeader: initHeader
  };

  /* Videos lazy: se activan solos en cualquier página que cargue este archivo. */
  function bootLazyVideos() {
    initLazyVideos();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootLazyVideos);
  } else {
    bootLazyVideos();
  }
})(window);
