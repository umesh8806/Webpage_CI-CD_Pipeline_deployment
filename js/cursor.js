/**
 * CURSOR.JS - Smooth Magnetic Cursor & Mouse Glow Tracker
 */
(function() {
  // Disable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const glow = document.getElementById('mouseGlow');

  if (!dot || !ring || !glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  // Track real mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMoving) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      glow.style.opacity = '1';
      isMoving = true;
    }

    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
  }, { passive: true });

  // Hide cursor elements when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    glow.style.opacity = '0';
    isMoving = false;
  });

  // Smooth lerp for outer ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Delegation for hoverable elements (including dynamically added ones)
  const hoverSelector = 'a, button, .glass-card, .portfolio-card, input, textarea, select, .floating-badge, .nav-link, .btn-neon, .btn-outline';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) {
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) {
      ring.classList.remove('hover');
    }
  });
})();
