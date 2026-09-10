/**
 * CONFIG.JS - Portfolio CMS Configuration & Showcase Defaults
 */
const API_BASE = '/api';

const API_CONFIG = {
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    session: `${API_BASE}/auth/session`
  },
  profile: `${API_BASE}/profile`,
  projects: `${API_BASE}/projects`
};

// Global default identity & fallback data (synced with CMS profile)
const DEFAULT_PORTFOLIO_DATA = {
  name: "Umesh Narendra Bhamare",
  initials: "UB",
  title: "Premium Web Designer & AI Developer",
  tagline: "I design modern, high-converting, AI-powered websites for businesses, restaurants, gyms, real estate, and modern enterprises.",
  location: "Pune, India",
  phone: "+91 9373036872",
  phoneDisplay: "+91 9373036872",
  email: "umeshbhamare613@gmail.com",
  whatsappNumber: "919373036872",
  githubUrl: "https://github.com/umesh8806",
  linkedinUrl: "https://www.linkedin.com/in/umesh-bhamare",
  stats: {
    projects: "50+",
    rating: "4.9",
    speed: "3x"
  }
};

// Expose to window
window.API_CONFIG = API_CONFIG;
window.PORTFOLIO_CONFIG = DEFAULT_PORTFOLIO_DATA;

// Toast Utility
window.showToast = function(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 14px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.5);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Space Grotesk', sans-serif;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(20px);
    ${type === 'success' 
      ? 'background: linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(16, 185, 129, 0.9));' 
      : 'background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));'}
  `;
  
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠'}</span> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};
