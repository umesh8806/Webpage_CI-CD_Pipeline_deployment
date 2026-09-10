/**
 * MAIN.JS - App Lifecycle Coordinator & Initialization
 */
(function() {
  let hasInitialized = false;

  function onAppReady() {
    if (hasInitialized) return;
    hasInitialized = true;

    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hide');
        if (typeof window.initAnimations === 'function') {
          window.initAnimations();
        }
      }, 1600);
    } else {
      if (typeof window.initAnimations === 'function') {
        window.initAnimations();
      }
    }
  }

  window.addEventListener('load', onAppReady);
  // Fallback timer in case external assets are slow
  setTimeout(onAppReady, 2500);

  // Smooth scroll for in-page anchors
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });
})();
