/**
 * PARTICLES.JS - High-Performance 2D Particle Canvas Engine
 */
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;
  let isTabVisible = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * canvas.width : (Math.random() > 0.5 ? 0 : canvas.width);
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.isCyan = Math.random() > 0.45;
      this.alpha = Math.random() * 0.45 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isCyan 
        ? `rgba(0, 212, 255, ${this.alpha})` 
        : `rgba(168, 85, 247, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.isCyan ? 'rgba(0, 212, 255, 0.8)' : 'rgba(168, 85, 247, 0.8)';
      ctx.fill();
    }
  }

  // Adjust particle count based on screen size
  const particleCount = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    if (!isTabVisible) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animateParticles);
  }

  // Pause when tab is not active
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
      cancelAnimationFrame(animationFrameId);
      animateParticles();
    }
  });

  animateParticles();
})();
