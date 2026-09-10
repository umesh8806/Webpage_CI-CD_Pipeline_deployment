/**
 * CMS-BRIDGE.JS - Dynamic Asynchronous Synchronization with Portfolio CMS API
 */
(function() {
  const config = window.PORTFOLIO_CONFIG || {};

  async function syncProfile() {
    if (!window.API_CONFIG || !window.API_CONFIG.profile) return;

    try {
      const res = await fetch(`${window.API_CONFIG.profile}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const profile = await res.json();
      if (!profile || !profile.full_name) return;

      // Update brand logo and name
      const brandInitials = document.querySelectorAll('.brand-initials');
      const brandFull = document.querySelectorAll('.brand-fullname');
      
      const initials = profile.full_name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      brandInitials.forEach(el => el.textContent = initials || config.initials || "UB");
      brandFull.forEach(el => el.textContent = profile.full_name.toUpperCase());

      // Update hero intro if available
      const bioEl = document.getElementById('aboutBio');
      if (bioEl && profile.bio) {
        bioEl.textContent = profile.bio;
      }

      // Update contact elements
      const emailLinks = document.querySelectorAll('.dynamic-email');
      emailLinks.forEach(el => {
        if (profile.email) {
          el.textContent = profile.email;
          if (el.tagName === 'A') el.href = `mailto:${profile.email}`;
        }
      });

      const phoneLinks = document.querySelectorAll('.dynamic-phone');
      phoneLinks.forEach(el => {
        if (profile.phone) {
          el.textContent = profile.phone;
          if (el.tagName === 'A') el.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
        }
      });

      const locElements = document.querySelectorAll('.dynamic-location');
      locElements.forEach(el => {
        if (profile.location) el.textContent = profile.location;
      });

      // Update social links
      if (profile.github_url) {
        const gh = document.querySelector('.dynamic-github');
        if (gh) gh.href = profile.github_url;
      }
      if (profile.linkedin_url) {
        const li = document.querySelector('.dynamic-linkedin');
        if (li) {
          const url = profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`;
          li.href = url;
        }
      }
    } catch (err) {
      // Graceful fallback to static showcase defaults
      console.log('Using local portfolio showcase defaults (CMS API unavailable).');
    }
  }

  async function syncProjects() {
    if (!window.API_CONFIG || !window.API_CONFIG.projects) return;

    try {
      const res = await fetch(`${window.API_CONFIG.projects}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const projects = await res.json();
      if (!Array.isArray(projects) || projects.length === 0) return;

      const dynamicContainer = document.getElementById('dynamicProjectsGrid');
      if (!dynamicContainer) return;

      // Filter active projects
      const activeProjects = projects.filter(p => p.status !== 'archived');
      if (activeProjects.length === 0) return;

      // Show dynamic CMS section
      const section = document.getElementById('cmsProjectsSection');
      if (section) section.style.display = 'block';

      dynamicContainer.innerHTML = activeProjects.map(proj => {
        const hasLive = proj.live_url && proj.live_url.trim() !== '';
        const hasGithub = proj.github_url && proj.github_url.trim() !== '';
        const techTags = (proj.tech_stack || ['Full Stack', 'Web']).slice(0, 3);

        return `
          <div class="glass-card rounded-3xl p-8 reveal-up flex flex-col justify-between">
            <div>
              <div class="portfolio-tag mb-4">${proj.category || 'Live Web App'}</div>
              <h3 class="font-display font-bold text-2xl mb-3 text-white">${proj.title}</h3>
              <p class="text-sm text-white/70 font-body mb-6 leading-relaxed">
                ${proj.short_desc || proj.description || 'Modern full-stack web application built with high-performance architecture.'}
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
                ${techTags.map(t => `<span class="text-xs px-3 py-1 bg-white/10 rounded-full font-sans text-white/80">${t}</span>`).join('')}
              </div>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-white/10">
              ${hasLive ? `<a href="${proj.live_url}" target="_blank" class="btn-neon text-xs py-2.5 px-5"><span>Live Demo</span><span>→</span></a>` : ''}
              ${hasGithub ? `<a href="${proj.github_url}" target="_blank" class="btn-outline text-xs py-2.5 px-5">GitHub</a>` : ''}
            </div>
          </div>
        `;
      }).join('');

      // Re-trigger GSAP reveal if animations engine is ready
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    } catch (err) {
      console.log('Defaulting to curated portfolio showcase projects.');
    }
  }

  // Run synchronization on page load
  document.addEventListener('DOMContentLoaded', () => {
    syncProfile();
    syncProjects();
  });
})();
