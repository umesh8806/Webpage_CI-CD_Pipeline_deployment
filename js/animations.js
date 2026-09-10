/**
 * ANIMATIONS.JS - GSAP & ScrollTrigger Interactive Motion Engine
 */
function initAnimations() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero Headline Character Split & Entrance
  const headline = document.getElementById('headline');
  if (headline) {
    const rawHTML = headline.innerHTML;
    // Split preserving spans/tags
    const parts = rawHTML.split(' ');
    headline.innerHTML = parts.map(part => {
      if (part.includes('<span') || part.includes('</span>') || part.includes('<br')) {
        return part;
      }
      return `<span style="display:inline-block; white-space:nowrap;">${part.split('').map(c => 
        `<span class="headline-char">${c === ' ' ? '&nbsp;' : c}</span>`
      ).join('')}</span>`;
    }).join(' ');

    gsap.to('.headline-char', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out',
      delay: 0.2
    });
  }

  // 2. Staggered ScrollTrigger Reveal for .reveal-up Elements
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.reveal-up').forEach((el, index) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        delay: (index % 4) * 0.08
      });
    });

    // 3. Parallax Background Glow Orbs
    gsap.utils.toArray('.glow-orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: (i % 2 === 0 ? 1 : -1) * 120,
        x: (i % 2 === 0 ? -1 : 1) * 60,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5
        }
      });
    });

    // 4. Navbar Dynamic Glass Appearance
    const navBar = document.querySelector('nav > div');
    if (navBar) {
      ScrollTrigger.create({
        start: 60,
        onUpdate: (self) => {
          if (self.scroll() > 60) {
            navBar.style.background = 'rgba(5, 5, 8, 0.75)';
            navBar.style.backdropFilter = 'blur(20px)';
            navBar.style.webkitBackdropFilter = 'blur(20px)';
            navBar.style.padding = '12px 28px';
            navBar.style.borderRadius = '50px';
            navBar.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            navBar.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.5)';
            navBar.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          } else {
            navBar.style.background = 'transparent';
            navBar.style.backdropFilter = 'none';
            navBar.style.webkitBackdropFilter = 'none';
            navBar.style.padding = '0';
            navBar.style.borderRadius = '0';
            navBar.style.border = '1px solid transparent';
            navBar.style.boxShadow = 'none';
          }
        }
      });
    }
  } else {
    // Fallback if ScrollTrigger is missing
    document.querySelectorAll('.reveal-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}

// Expose to window
window.initAnimations = initAnimations;
