// ============================================================
// KisanSetu AI — Auth Store & Shared State
// ============================================================

const AUTH_KEY = 'ks_user';
const TOKEN_KEY = 'ks_token';

export const AuthStore = {
  getUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
  },
  setUser(user, token) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn() { return !!this.getUser(); },
  getRole() { return this.getUser()?.role || null; }
};

// ============================================================
// Toast Notification System
// ============================================================
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'success', duration = 3500) {
  const container = ensureToastContainer();
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// Router
// ============================================================
const routes = {};

export function addRoute(hash, handler) { routes[hash] = handler; }

export function navigate(hash) { window.location.hash = hash; }
if (typeof window !== 'undefined') {
  window.navigate = navigate;
}

export function initRouter(appEl) {
  function render() {
    const rawHash = window.location.hash || '#/';
    const path = rawHash.split('?')[0] || '#/';
    const handler = routes[path] || routes[rawHash] || routes['#/404'] || (() => `<div class="empty-state"><div class="empty-icon">🌾</div><h2>Page not found</h2></div>`);
    const user = AuthStore.getUser();

    // Guard protected routes
    const protectedRoutes = ['#/farmer', '#/officer', '#/admin'];
    if (protectedRoutes.some(p => path.startsWith(p)) && !user) {
      navigate('#/login');
      return;
    }

    appEl.innerHTML = '';
    const content = handler(user);
    if (typeof content === 'string') {
      appEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      appEl.appendChild(content);
    }
    // Attach event listeners after render
    window.dispatchEvent(new CustomEvent('ks:pagerendered', { detail: { hash: rawHash, path } }));
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);
  render();
}

// ============================================================
// Shared UI Helpers
// ============================================================
export function renderNavbar(user) {
  const roleLabel = { FARMER: 'Farmer', OFFICER: 'Officer', ADMIN: 'Admin' };
  const roleColor = { FARMER: 'var(--green-400)', OFFICER: 'var(--gold-400)', ADMIN: '#a78bfa' };
  const dashboardLink = user ? `#/${user.role.toLowerCase()}/dashboard` : '#/';
  return `
  <nav class="navbar">
    <a class="navbar-brand" href="${dashboardLink}">
      <div class="navbar-logo">🌾</div>
      <div>
        <div class="navbar-title">Kisan<span>Setu</span></div>
      </div>
    </a>
    <div class="navbar-nav" id="navbar-nav">
      ${user ? `
        <a href="${dashboardLink}" id="nav-dashboard">Dashboard</a>
        ${user.role === 'FARMER' ? `<a href="#/farmer/centers" id="nav-centers">Find Centres</a><a href="#/farmer/bookings" id="nav-bookings">My Bookings</a>` : ''}
        ${user.role === 'OFFICER' ? `<a href="#/officer/queue" id="nav-queue">Queue Board</a><a href="#/officer/checkin" id="nav-checkin">Gate Check-In</a>` : ''}
        ${user.role === 'ADMIN' ? `<a href="#/admin/analytics" id="nav-analytics">Analytics</a><a href="#/admin/map" id="nav-map">Map View</a>` : ''}
      ` : `
        <a href="#/">Home</a>
        <a href="#/login">Login</a>
      `}
    </div>
    ${user ? `
      <div class="navbar-user" id="user-menu-btn">
        <div class="navbar-avatar">${user.name.charAt(0)}</div>
        <div>
          <div class="navbar-username">${user.name.split(' ')[0]}</div>
          <div class="navbar-role" style="color:${roleColor[user.role] || 'var(--green-400)'}">${roleLabel[user.role] || user.role}</div>
        </div>
        <span style="color:var(--slate-500);font-size:10px">▼</span>
      </div>
    ` : `<a href="#/login" class="btn btn-primary btn-sm">Login / Register</a>`}
  </nav>`;
}

export function renderSidebar(user, activeItem) {
  if (!user) return '';
  const farmerNav = [
    { href: '#/farmer/dashboard', icon: '🏠', label: 'Dashboard', key: 'dashboard' },
    { href: '#/farmer/centers', icon: '🗺️', label: 'Find Centres', key: 'centers' },
    { href: '#/farmer/bookings', icon: '📋', label: 'My Bookings', key: 'bookings' },
    { href: '#/farmer/payment', icon: '💰', label: 'Payment Status', key: 'payment' },
  ];
  const officerNav = [
    { href: '#/officer/dashboard', icon: '🏠', label: 'Dashboard', key: 'dashboard' },
    { href: '#/officer/checkin', icon: '📱', label: 'Gate Check-In', key: 'checkin' },
    { href: '#/officer/queue', icon: '📊', label: 'Queue Board', key: 'queue' },
  ];
  const adminNav = [
    { href: '#/admin/dashboard', icon: '🏠', label: 'Overview', key: 'dashboard' },
    { href: '#/admin/analytics', icon: '📈', label: 'Analytics', key: 'analytics' },
    { href: '#/admin/map', icon: '🗺️', label: 'Congestion Map', key: 'map' },
  ];
  const navItems = user.role === 'FARMER' ? farmerNav : user.role === 'OFFICER' ? officerNav : adminNav;
  const itemsHtml = navItems.map(item => `
    <a href="${item.href}" class="sidebar-item ${activeItem === item.key ? 'active' : ''}">
      <span class="icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`).join('');
  return `
  <aside class="sidebar">
    <div class="sidebar-section"><span class="sidebar-label">Navigation</span></div>
    ${itemsHtml}
    <div style="margin-top:auto;padding-top:24px;border-top:1px solid var(--border-subtle)">
      <a id="logout-btn" class="sidebar-item" style="cursor:pointer">
        <span class="icon">🚪</span><span>Logout</span>
      </a>
    </div>
  </aside>`;
}

export function renderAppLayout(user, activeNav, contentHtml) {
  return `
    ${renderNavbar(user)}
    <div class="app-layout">
      ${renderSidebar(user, activeNav)}
      <main class="app-main animate-fadeIn">
        ${contentHtml}
      </main>
    </div>`;
}

// Attach global logout
window.addEventListener('ks:pagerendered', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AuthStore.clear();
      showToast('Logged out successfully', 'info');
      navigate('#/login');
    });
  }
  // Highlight active nav
  const hash = window.location.hash;
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === hash);
  });
});

// ============================================================
// QR Code Generator (Simple SVG-based)
// ============================================================
export function generateQRSVG(text) {
  // Simple visual QR representation using a pattern
  const size = 21;
  const cellSize = 7;
  const svgSize = size * cellSize;
  
  // Generate a deterministic but visually varied pattern from text
  let hash = 0;
  for (let i = 0; i < text.length; i++) { hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff; }
  
  let cells = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Finder patterns (corners)
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8);
      let filled = false;
      if (inFinder) {
        const lr = r < 8 ? r : r - (size - 8);
        const lc = c < 8 ? c : c - (size - 8);
        if (r < 8 && c >= size - 8) { const rr = r; const rc = c - (size - 8); filled = (rr === 0 || rr === 6 || rc === 0 || rc === 6) || (rr >= 2 && rr <= 4 && rc >= 2 && rc <= 4); }
        else { filled = (lr === 0 || lr === 6 || lc === 0 || lc === 6) || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4); }
      } else {
        const idx = r * size + c;
        const seed = (hash ^ (idx * 2654435761)) >>> 0;
        filled = (seed % 3) !== 0;
      }
      if (filled) cells += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#1a3a20"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">${cells}</svg>`;
}

// ============================================================
// Formatters
// ============================================================
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function formatTime(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}
export function congestionBadge(level) {
  const map = { LOW: ['badge-green', '🟢 Low'], MODERATE: ['badge-gold', '🟡 Moderate'], HIGH: ['badge-red', '🔴 High'], CRITICAL: ['badge-red', '🔴 Critical'] };
  const [cls, text] = map[level] || ['badge-gray', level];
  return `<span class="badge ${cls}">${text}</span>`;
}
export function statusBadge(status) {
  const map = {
    BOOKED: ['badge-blue', '📋 Booked'], ARRIVED: ['badge-green', '🚜 Arrived'],
    GATE_VERIFIED: ['badge-green', '✅ Verified'], WAITING: ['badge-gold', '⏳ Waiting'],
    WEIGHING: ['badge-purple', '⚖️ Weighing'], QUALITY_CHECK: ['badge-purple', '🔬 Quality'],
    ACCEPTED: ['badge-green', '✔️ Accepted'], UNLOADING: ['badge-blue', '🏪 Unloading'],
    DOCUMENTATION: ['badge-blue', '📄 Docs'], PAYMENT_PROCESSING: ['badge-gold', '🏦 Payment'],
    PAYMENT_COMPLETED: ['badge-green', '💰 Paid'], REJECTED: ['badge-red', '❌ Rejected'],
    CANCELLED: ['badge-gray', '🚫 Cancelled'], RESCHEDULED: ['badge-gold', '📅 Rescheduled']
  };
  const [cls, text] = map[status] || ['badge-gray', status];
  return `<span class="badge ${cls}">${text}</span>`;
}
