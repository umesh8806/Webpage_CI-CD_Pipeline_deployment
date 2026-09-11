// js/cms-content-loader.js
// Fetches data/content.json and hydrates all [data-cms-*] elements on the page.
// Falls back to localStorage cache when offline.
(async () => {
  let content;
  try {
    const r = await fetch('/data/content.json');
    if (!r.ok) throw new Error('fetch failed');
    content = await r.json();
    localStorage.setItem('siteContent', JSON.stringify(content));
  } catch {
    const cached = localStorage.getItem('siteContent');
    if (cached) content = JSON.parse(cached);
    else return; // nothing to hydrate
  }

  const set = (sel, val) => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = val;
      else el.textContent = val;
    });
  };
  const setHref = (sel, val) => document.querySelectorAll(sel).forEach(el => el.href = val);

  const { brand = {}, hero = {}, about = {}, contact = {}, footer = {} } = content;

  // Brand
  set('.brand-initials',    brand.initials  || 'UB');
  set('.brand-fullname',    brand.fullname  || 'Umesh Bhamare');
  set('.brand-tagline',     brand.tagline   || '');
  set('.dynamic-location',  brand.location  || 'Pune, India');
  set('.dynamic-email',     brand.email     || '');
  set('.dynamic-phone',     brand.phone     || '');
  document.querySelectorAll('.dynamic-email-link').forEach(el => el.href = 'mailto:' + (brand.email || ''));
  document.querySelectorAll('.dynamic-phone-link').forEach(el => el.href = 'tel:'    + (brand.phone || '').replace(/\s/g,''));
  document.querySelectorAll('.whatsapp-trigger').forEach(el => el.href = brand.whatsapp || '#');
  setHref('.dynamic-linkedin', brand.linkedin || '#');
  setHref('.dynamic-github',   brand.github   || '#');

  // Hero
  if (hero.badge)    set('#heroBadge',   hero.badge);
  if (hero.tagline)  set('#heroTagline', hero.tagline);

  // About
  if (about.bio)  set('#aboutBio',  about.bio);
  if (about.bio2) set('#aboutBio2', about.bio2);

  // Contact
  set('.contact-email',    contact.email    || '');
  set('.contact-phone',    contact.phone    || '');
  set('.contact-location', contact.location || '');

  // Footer
  set('.footer-copyright', footer.copyright || '');
  set('.footer-tagline',   footer.tagline   || '');

  // Page title
  if (content.meta && content.meta.title) document.title = content.meta.title;
})();
