/*
  Comportamiento de aviso-privacidad.html
  Separado del HTML (mismo patron que Dell).
  Edita este archivo para cambiar la comportamiento (menus, formularios, animaciones) de la pagina.
*/
    'use strict';

    // ===== GLOBAL ERROR HANDLING =====
    window.addEventListener('error', (e) => {
        console.error('Error global capturado:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rechazada sin manejar:', e.reason);
    });

    document.addEventListener('DOMContentLoaded', function() {
        // ========================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ========================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ========================================
        // FOCUS MANAGEMENT FOR ACCESSIBILITY
        // ========================================
        // Detect keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    });
    