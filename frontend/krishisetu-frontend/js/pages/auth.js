// ============================================================
// Auth Pages — Login & Register
// ============================================================
import { AuthStore, showToast, navigate } from '../utils.js';
import { MOCK_USERS } from '../mockData.js';

// ---------- Shared auth background decorations ----------
function authBg() {
  return `
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 70%, rgba(26,158,85,0.12) 0%,transparent 50%),radial-gradient(circle at 70% 20%, rgba(245,158,11,0.07) 0%,transparent 40%)"></div>
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(34,196,104,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,196,104,0.03) 1px,transparent 1px);background-size:60px 60px"></div>
  `;
}

// ============================================================
// Login Page
// ============================================================
export function renderLogin() {
  const html = `
    <div class="auth-page">
      ${authBg()}
      <div class="auth-card animate-slideUp">
        <div class="auth-logo-wrap">
          <div class="auth-logo">🌾</div>
          <div class="auth-brand">Kisan<span>Setu</span> AI</div>
        </div>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Login to your KisanSetu account</p>

        <!-- Role Selector -->
        <div class="role-grid" id="role-grid">
          <div class="role-option selected" data-role="FARMER" id="role-FARMER">
            <div class="role-icon">🌾</div>
            <div class="role-name">Farmer</div>
            <div class="role-desc">किसान</div>
          </div>
          <div class="role-option" data-role="OFFICER" id="role-OFFICER">
            <div class="role-icon">👮</div>
            <div class="role-name">Officer</div>
            <div class="role-desc">अधिकारी</div>
          </div>
          <div class="role-option" data-role="ADMIN" id="role-ADMIN">
            <div class="role-icon">🏛️</div>
            <div class="role-name">Admin</div>
            <div class="role-desc">प्रशासक</div>
          </div>
        </div>

        <form id="login-form" style="display:flex;flex-direction:column;gap:16px">
          <div class="form-group">
            <label class="form-label" for="mobile-input">Mobile Number</label>
            <div class="input-group">
              <span class="input-icon">📱</span>
              <input class="form-input" type="tel" id="mobile-input" placeholder="e.g. 9876543210" maxlength="10" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="password-input">Password</label>
            <div class="input-group">
              <span class="input-icon">🔒</span>
              <input class="form-input has-icon-right" type="password" id="password-input" placeholder="Enter your password" required />
              <span class="input-icon input-icon-right" id="toggle-password">👁️</span>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-full" id="login-btn" style="border-radius:var(--radius-md);padding:14px">
            Login
          </button>
        </form>

        <div class="divider-text mt-24 mb-16">or use demo account</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-outline w-full btn-sm" id="demo-farmer" style="border-radius:var(--radius-md)">🌾 Demo Farmer — Ramesh Kumar</button>
          <button class="btn btn-outline w-full btn-sm" id="demo-officer" style="border-radius:var(--radius-md)">👮 Demo Officer — Suresh Sharma</button>
          <button class="btn btn-outline w-full btn-sm" id="demo-admin" style="border-radius:var(--radius-md)">🏛️ Demo Admin — Dr. Ananya Iyer</button>
        </div>

        <p style="text-align:center;font-size:13px;color:var(--slate-500);margin-top:24px">
          New farmer? <a href="#/register" style="color:var(--green-400);font-weight:600">Register here</a>
        </p>
      </div>
    </div>
  `;

  setTimeout(() => {
    let selectedRole = 'FARMER';
    const rawHash = window.location.hash || '';
    const paramRole = new URLSearchParams(rawHash.split('?')[1] || '').get('role')?.toUpperCase();
    if (paramRole && ['FARMER', 'OFFICER', 'ADMIN'].includes(paramRole)) {
      selectedRole = paramRole;
      document.querySelectorAll('.role-option').forEach(r => r.classList.remove('selected'));
      document.getElementById(`role-${paramRole}`)?.classList.add('selected');
    }

    // Role selector
    document.querySelectorAll('.role-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(r => r.classList.remove('selected'));
        el.classList.add('selected');
        selectedRole = el.dataset.role;
      });
    });

    // Toggle password
    document.getElementById('toggle-password')?.addEventListener('click', () => {
      const inp = document.getElementById('password-input');
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });

    // Form submit
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('login-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Verifying...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 800));

      const user = MOCK_USERS[selectedRole.toLowerCase()];
      AuthStore.setUser(user, `mock-jwt-${selectedRole.toLowerCase()}`);
      showToast(`Welcome back, ${user.name.split(' ')[0]} ji! 🌾`, 'success');
      navigate(`#/${selectedRole.toLowerCase()}/dashboard`);
    });

    // Demo logins
    const demos = [
      ['demo-farmer', 'farmer'], ['demo-officer', 'officer'], ['demo-admin', 'admin']
    ];
    demos.forEach(([id, role]) => {
      document.getElementById(id)?.addEventListener('click', () => {
        const user = MOCK_USERS[role];
        AuthStore.setUser(user, `mock-jwt-${role}`);
        showToast(`Demo login as ${user.name}`, 'success');
        navigate(`#/${role}/dashboard`);
      });
    });
  }, 0);

  return html;
}

// ============================================================
// Register Page
// ============================================================
export function renderRegister() {
  const html = `
    <div class="auth-page" style="align-items:flex-start;padding:40px 24px">
      ${authBg()}
      <div class="auth-card animate-slideUp" style="max-width:500px;margin:0 auto">
        <div class="auth-logo-wrap">
          <div class="auth-logo">🌾</div>
          <div class="auth-brand">Kisan<span>Setu</span> AI</div>
        </div>
        <h1 class="auth-title">Farmer Registration</h1>
        <p class="auth-subtitle">किसान पंजीकरण — Register in 2 minutes</p>

        <form id="register-form" style="display:flex;flex-direction:column;gap:14px">
          <div class="grid-2" style="gap:14px">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input class="form-input" type="text" id="reg-name" placeholder="Ramesh Kumar" required />
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input class="form-input" type="tel" id="reg-mobile" placeholder="9876543210" maxlength="10" required />
            </div>
          </div>
          <div class="grid-2" style="gap:14px">
            <div class="form-group">
              <label class="form-label">Aadhaar Number *</label>
              <input class="form-input" type="text" id="reg-aadhaar" placeholder="1234-5678-9012" required />
            </div>
            <div class="form-group">
              <label class="form-label">Total Land (Acres) *</label>
              <input class="form-input" type="number" id="reg-land" placeholder="3.5" step="0.1" min="0.1" required />
            </div>
          </div>
          <div class="grid-2" style="gap:14px">
            <div class="form-group">
              <label class="form-label">District *</label>
              <select class="form-select" id="reg-district">
                <option value="Hisar">Hisar</option>
                <option value="Sirsa">Sirsa</option>
                <option value="Fatehabad">Fatehabad</option>
                <option value="Bhiwani">Bhiwani</option>
                <option value="Rohtak">Rohtak</option>
                <option value="Karnal">Karnal</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">State *</label>
              <select class="form-select" id="reg-state">
                <option>Haryana</option>
                <option>Punjab</option>
                <option>Madhya Pradesh</option>
                <option>Uttar Pradesh</option>
                <option>Rajasthan</option>
              </select>
            </div>
          </div>
          <div class="grid-2" style="gap:14px">
            <div class="form-group">
              <label class="form-label">Bank Account No. *</label>
              <input class="form-input" type="text" id="reg-bank" placeholder="Account number" required />
            </div>
            <div class="form-group">
              <label class="form-label">IFSC Code *</label>
              <input class="form-input" type="text" id="reg-ifsc" placeholder="PUNB0123400" required />
            </div>
          </div>
          <div class="grid-2" style="gap:14px">
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input class="form-input" type="password" id="reg-password" placeholder="Create password" required minlength="6" />
            </div>
            <div class="form-group">
              <label class="form-label">Preferred Language</label>
              <select class="form-select" id="reg-lang">
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>

          <div class="alert alert-info mt-8" style="font-size:12px">
            ℹ️ Your Aadhaar will be used for identity verification. Bank account will receive MSP payments via DBT/PFMS.
          </div>

          <button type="submit" class="btn btn-primary w-full mt-8" id="register-btn" style="border-radius:var(--radius-md);padding:14px">
            Register & Get Started 🌾
          </button>
        </form>

        <p style="text-align:center;font-size:13px;color:var(--slate-500);margin-top:16px">
          Already registered? <a href="#/login" style="color:var(--green-400);font-weight:600">Login here</a>
        </p>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('register-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Registering...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));

      const name = document.getElementById('reg-name').value;
      const user = {
        id: Date.now(), name, role: 'FARMER',
        mobile: document.getElementById('reg-mobile').value,
        district: document.getElementById('reg-district').value,
        state: document.getElementById('reg-state').value,
        preferredLanguage: document.getElementById('reg-lang').value,
        farmerId: Date.now(), verified: false
      };
      AuthStore.setUser(user, 'mock-jwt-new-farmer');
      showToast(`Registration successful! Welcome, ${name.split(' ')[0]} ji! 🎉`, 'success');
      navigate('#/farmer/dashboard');
    });
  }, 0);

  return html;
}
