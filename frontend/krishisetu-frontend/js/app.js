// ============================================================
// KisanSetu AI — Application Entry Point
// ============================================================

import { initRouter, addRoute, navigate } from './utils.js';
import { renderLanding } from './pages/landing.js';
import { renderLogin, renderRegister } from './pages/auth.js';
import {
  renderFarmerDashboard,
  renderCenterFinder,
  renderBookSlot,
  renderMyBookings,
  renderPaymentStatus
} from './pages/farmer.js';
import {
  renderOfficerDashboard,
  renderGateCheckin
} from './pages/officer.js';
import {
  renderAdminDashboard,
  renderAdminAnalytics,
  renderAdminMap
} from './pages/admin.js';

// Global navigation helper
window.navigate = navigate;

// Register Public Routes
addRoute('#/', renderLanding);
addRoute('#/landing', renderLanding);
addRoute('#/login', renderLogin);
addRoute('#/register', renderRegister);

// Register Farmer Routes
addRoute('#/farmer/dashboard', renderFarmerDashboard);
addRoute('#/farmer/centers', renderCenterFinder);
addRoute('#/farmer/book', renderBookSlot);
addRoute('#/farmer/bookings', renderMyBookings);
addRoute('#/farmer/payment', renderPaymentStatus);

// Register Officer Routes
addRoute('#/officer/dashboard', renderOfficerDashboard);
addRoute('#/officer/queue', renderOfficerDashboard);
addRoute('#/officer/checkin', renderGateCheckin);

// Register Admin Routes
addRoute('#/admin/dashboard', renderAdminDashboard);
addRoute('#/admin/analytics', renderAdminAnalytics);
addRoute('#/admin/map', renderAdminMap);

// Initialize router when DOM is ready
function startApp() {
  const appEl = document.getElementById('app');
  if (appEl) {
    initRouter(appEl);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
