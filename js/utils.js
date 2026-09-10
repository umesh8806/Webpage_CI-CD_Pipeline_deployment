// Utility helpers for Portfolio CMS
window.formatDate = function(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
};
