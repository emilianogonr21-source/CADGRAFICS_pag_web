/**
 * Aviso de privacidad — menú compartido (mismo que index).
 */
(function () {
  'use strict';
  function boot() {
    if (!window.Cadgrafics || typeof Cadgrafics.initHeader !== 'function') return;
    Cadgrafics.initHeader({ lockBodyScroll: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
