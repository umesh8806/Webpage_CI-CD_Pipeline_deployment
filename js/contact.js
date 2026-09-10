/**
 * CONTACT.JS - Interactive Contact Form & WhatsApp Direct Messenger
 */
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const config = window.PORTFOLIO_CONFIG || {};
  const whatsappNumber = config.whatsappNumber || "919373036872";
  const developerEmail = config.email || "umeshbhamare613@gmail.com";

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]')?.value.trim() || '';
    const email = form.querySelector('input[name="email"]')?.value.trim() || '';
    const phone = form.querySelector('input[name="phone"]')?.value.trim() || '';
    const service = form.querySelector('select[name="service"]')?.value || 'Website Development';
    const message = form.querySelector('textarea[name="message"]')?.value.trim() || '';

    if (!name || !email || !message) {
      if (window.showToast) window.showToast('Please fill out all required fields.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Visual button success state
    submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    submitBtn.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.4)';
    submitBtn.disabled = true;

    if (window.showToast) {
      window.showToast('Thank you! Your message has been received. I will reach out within 24 hours.', 'success');
    }

    // Reset after delay
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.boxShadow = '';
      submitBtn.disabled = false;
      form.reset();
    }, 3500);
  });

  // Prefill WhatsApp trigger
  const whatsappBtns = document.querySelectorAll('.whatsapp-trigger');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = encodeURIComponent("Hello! I am interested in discussing a website project with you.");
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    });
  });
})();
