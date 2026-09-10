// Shared API functions for Frontend Portfolio CMS

// Check session status
async function checkSession() {
  try {
    const res = await fetch(`${window.API_CONFIG.auth.session}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Session check failed:', err);
    return null;
  }
}

// Admin login
async function loginAdmin(email, password) {
  const res = await fetch(window.API_CONFIG.auth.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// Admin logout
async function logoutAdmin() {
  const res = await fetch(window.API_CONFIG.auth.logout, { method: 'POST' });
  if (!res.ok) throw new Error('Logout failed');
  return await res.json();
}

// Fetch public profile
async function fetchProfile() {
  const res = await fetch(`${window.API_CONFIG.profile}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load profile');
  return await res.json();
}

// Save profile (Admin only)
async function saveProfileData(profile) {
  const res = await fetch(window.API_CONFIG.profile, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save profile');
  return data;
}

// Fetch public projects
async function fetchProjects() {
  const res = await fetch(`${window.API_CONFIG.projects}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load projects');
  return await res.json();
}

// Fetch admin projects (Admin only)
async function fetchAdminProjects() {
  const res = await fetch(`${window.API_CONFIG.projects}/admin?t=${Date.now()}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load admin projects');
  return data;
}

// Save project (Create or Update - Admin only)
async function saveProjectData(id, project) {
  const url = id ? `${window.API_CONFIG.projects}/${id}` : window.API_CONFIG.projects;
  const method = id ? 'PUT' : 'POST';
  
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save project');
  return data;
}

// Delete project (Admin only)
async function deleteProjectData(id) {
  const res = await fetch(`${window.API_CONFIG.projects}/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete project');
  return data;
}

// Export to window object
window.portfolioAPI = {
  checkSession,
  loginAdmin,
  logoutAdmin,
  fetchProfile,
  saveProfileData,
  fetchProjects,
  fetchAdminProjects,
  saveProjectData,
  deleteProjectData
};
