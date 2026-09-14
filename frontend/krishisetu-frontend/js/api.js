// ============================================================
// KisanSetu AI — API Client
// Base URL: http://localhost:8080
// ============================================================

const API_BASE = 'http://localhost:8080/api/v1';
const AI_BASE  = 'http://localhost:8080/api/v1/ai';

// ---------- Token helpers ----------
function getToken() { return localStorage.getItem('ks_token'); }
function setToken(t) { localStorage.setItem('ks_token', t); }
function clearToken() { localStorage.removeItem('ks_token'); localStorage.removeItem('ks_user'); }

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) { clearToken(); window.location.hash = '#/login'; return null; }
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'API error');
    return json.data;
  } catch (e) {
    // Return mock data when backend is offline
    throw e;
  }
}

// ---------- Auth ----------
export async function apiLogin(mobile, password, role) {
  return apiFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ mobile, password, role })
  });
}
export async function apiRegister(data) {
  return apiFetch(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(data) });
}
export async function apiGetMe() {
  return apiFetch(`${API_BASE}/auth/me`);
}

// ---------- Farmers ----------
export async function apiFarmerByUserId(userId) {
  return apiFetch(`${API_BASE}/farmers/user/${userId}`);
}
export async function apiFarmerBookings(farmerId) {
  return apiFetch(`${API_BASE}/farmers/${farmerId}/bookings`);
}
export async function apiFarmerQueueStatus(farmerId) {
  return apiFetch(`${API_BASE}/farmers/${farmerId}/queue-status`);
}
export async function apiFarmerProduce(farmerId) {
  return apiFetch(`${API_BASE}/farmers/${farmerId}/produce`);
}
export async function apiRegisterProduce(farmerId, cropId, acres, estimatedYield, seasonYear) {
  return apiFetch(`${API_BASE}/farmers/${farmerId}/produce?cropId=${cropId}&acres=${acres}&estimatedYield=${estimatedYield}&seasonYear=${seasonYear}`, { method: 'POST' });
}

// ---------- Centers ----------
export async function apiGetCenters() {
  return apiFetch(`${API_BASE}/centers`);
}
export async function apiGetNearbyCenters(lat, lon) {
  return apiFetch(`${API_BASE}/centers/nearby?lat=${lat}&lon=${lon}`);
}
export async function apiRecommendCenters(lat, lon, cropId, qty, radius = 60) {
  return apiFetch(`${API_BASE}/centers/recommend?lat=${lat}&lon=${lon}&cropId=${cropId}&qty=${qty}&radius=${radius}`);
}
export async function apiGetCenterQueue(centerId) {
  return apiFetch(`${API_BASE}/centers/${centerId}/queue`);
}

// ---------- Bookings ----------
export async function apiCreateBooking(data) {
  return apiFetch(`${API_BASE}/bookings`, { method: 'POST', body: JSON.stringify(data) });
}
export async function apiGetBooking(id) {
  return apiFetch(`${API_BASE}/bookings/${id}`);
}
export async function apiCancelBooking(id, reason = 'Cancelled by farmer') {
  return apiFetch(`${API_BASE}/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`, { method: 'PUT' });
}
export async function apiRescheduleBooking(id, newDate, newSlot) {
  return apiFetch(`${API_BASE}/bookings/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify({ preferredDate: newDate, preferredSlot: newSlot })
  });
}

// ---------- AI / Chat ----------
export async function apiChat(farmerId, query, language = 'en') {
  return apiFetch(`${AI_BASE}/chat`, {
    method: 'POST',
    body: JSON.stringify({ farmerId, query, language })
  });
}

// ---------- Gate / Queue (Officer) ----------
export async function apiGateCheckin(centerId, qrPayload) {
  return apiFetch(`${API_BASE}/centers/${centerId}/gate-checkin`, {
    method: 'POST',
    body: JSON.stringify({ centerId, qrPayload })
  });
}
export async function apiCallNext(centerId, assignedWeighbridge = 'Weighbridge-1') {
  return apiFetch(`${API_BASE}/centers/${centerId}/queue/call-next?assignedWeighbridge=${encodeURIComponent(assignedWeighbridge)}`, { method: 'POST' });
}

// ---------- Admin ----------
export async function apiAdminOverview() {
  return apiFetch(`${API_BASE}/admin/analytics/overview`);
}
export async function apiAdminBottlenecks() {
  return apiFetch(`${API_BASE}/admin/analytics/bottlenecks`);
}
export async function apiAdminCentersComparison() {
  return apiFetch(`${API_BASE}/admin/analytics/centers-comparison`);
}
