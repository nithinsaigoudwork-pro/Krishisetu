// ============================================================
// Landing Page
// ============================================================
import { navigate, renderNavbar, AuthStore, showToast } from '../utils.js';

export function renderLanding() {
  const html = `
    ${renderNavbar(null)}
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg-pattern"></div>
      <div class="hero-grid"></div>
      <div class="container hero-content">
        <div style="max-width:700px">
          <div class="hero-badge">🇮🇳 Smart India Hackathon 2026 &nbsp;|&nbsp; Problem Statement PS-1508</div>
          <h1 class="hero-title">
            <span class="text-gradient">KisanSetu</span> AI<br/>
            <span style="color:var(--gold-400)">Zero Queue.</span> Fair MSP.
          </h1>
          <p class="hero-subtitle devanagari" style="font-size:16px; color:var(--green-200); margin-bottom:12px">
            किसानों के लिए स्मार्ट खरीद प्रबंधन प्रणाली
          </p>
          <p class="hero-subtitle">
            AI-powered platform eliminating 8–18 hour mandi queues. Dynamic slot allocation, 
            real-time queue tracking, multilingual AI assistant & instant MSP payments for Indian farmers.
          </p>
          <div class="hero-cta">
            <button class="btn btn-gold btn-xl" id="cta-farmer">
              🌾 Farmer Login / Register
            </button>
            <button class="btn btn-outline btn-lg" id="cta-officer">
              👮 Officer / Admin Portal
            </button>
          </div>
          <div class="hero-stats">
            <div>
              <div class="hero-stat-value text-gradient">75%</div>
              <div class="hero-stat-label">Reduction in Wait Time</div>
            </div>
            <div>
              <div class="hero-stat-value" style="color:var(--gold-400)">₹2,275</div>
              <div class="hero-stat-label">Wheat MSP per Quintal</div>
            </div>
            <div>
              <div class="hero-stat-value text-gradient">11</div>
              <div class="hero-stat-label">Stage Digital Tracking</div>
            </div>
            <div>
              <div class="hero-stat-value" style="color:var(--gold-400)">5+</div>
              <div class="hero-stat-label">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Floating Card -->
      <div style="position:absolute;right:5%;top:50%;transform:translateY(-50%);width:300px;display:none" class="animate-float" id="hero-float-card">
        <div class="glass-card" style="padding:24px">
          <div class="flex items-center gap-12 mb-16">
            <div style="width:44px;height:44px;background:var(--gradient-gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px">🌾</div>
            <div>
              <div style="font-weight:700;font-size:14px">Ramesh Kumar</div>
              <div style="font-size:12px;color:var(--green-400)">Token #T-104 &bull; Barwala Centre</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--slate-400);margin-bottom:12px">Queue Position</div>
          <div style="font-size:40px;font-weight:900;color:var(--gold-400);margin-bottom:4px">#3</div>
          <div style="font-size:13px;color:var(--green-300)">Estimated wait: <strong>18 minutes</strong></div>
          <div class="progress mt-12" style="height:8px">
            <div class="progress-bar progress-gold" style="width:72%"></div>
          </div>
          <div style="font-size:11px;color:var(--slate-500);margin-top:6px">WAITING → WEIGHING</div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section style="padding:80px 0;background:var(--green-950)">
      <div class="container">
        <div class="text-center mb-32">
          <h2 style="font-size:36px;font-weight:900" class="mb-8">Why <span class="text-gradient">KisanSetu AI</span>?</h2>
          <p class="text-muted" style="font-size:16px;max-width:560px;margin:0 auto">End-to-end procurement intelligence — from AI center recommendations to real-time DBT payment tracking</p>
        </div>
        <div class="grid-3" style="gap:24px">
          ${[
            { icon:'🤖', title:'AI Center Recommender', desc:'Multi-objective time minimizer considers travel time, live queue wait, and processing duration — not just distance.', badge:'XGBoost + LightGBM' },
            { icon:'📡', title:'Real-Time Queue Tracking', desc:'Live token position updates via WebSocket. Know your exact position in queue without standing at the mandi.', badge:'< 80ms latency' },
            { icon:'🌐', title:'Multilingual AI Assistant', desc:'Ask questions in Hindi, Marathi, Telugu, Punjabi. Get answers about your token, payment & booking instantly.', badge:'5 Languages' },
            { icon:'📱', title:'Offline QR Pass', desc:'HMAC-SHA256 signed QR pass works without internet. Gate officers can verify bookings even in offline mode.', badge:'AES-256' },
            { icon:'⚡', title:'Auto Rescheduling', desc:'Missed your slot? AI auto-reschedules you within 30 seconds — no 24–72 hour manual wait, no middlemen.', badge:'< 30 seconds' },
            { icon:'💸', title:'Real-Time Payment Tracking', desc:'Track DBT disbursement from J-Form generation to PFMS processing to bank credit. Zero black-out window.', badge:'PFMS Integration' }
          ].map(f => `
            <div class="card">
              <div class="card-body">
                <div style="font-size:36px;margin-bottom:16px">${f.icon}</div>
                <span class="badge badge-green" style="margin-bottom:12px">${f.badge}</span>
                <h3 style="font-size:16px;margin-bottom:8px">${f.title}</h3>
                <p style="font-size:13px;color:var(--slate-400);line-height:1.6">${f.desc}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- 11 Stage Process -->
    <section style="padding:80px 0">
      <div class="container">
        <div class="text-center mb-32">
          <h2 style="font-size:36px;font-weight:900" class="mb-8">11-Stage <span style="color:var(--gold-400)">Procurement Journey</span></h2>
          <p class="text-muted">Complete transparency from slot booking to payment in your bank account</p>
        </div>
        <div style="display:flex;gap:0;overflow-x:auto;padding:20px 0">
          ${['📋 Booked','🚜 Arrived','✅ Gate Verified','⏳ Waiting','⚖️ Weighing','🔬 Quality Check','✔️ Accepted','🏪 Unloading','📄 Documentation','🏦 Payment Processing','💰 Payment Done'].map((s,i) => `
            <div style="display:flex;align-items:center;flex-shrink:0">
              <div style="text-align:center;padding:8px 12px;min-width:100px">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--gradient-green);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 8px">${s.split(' ')[0]}</div>
                <div style="font-size:11px;font-weight:600;color:var(--green-200)">${s.substring(s.indexOf(' ')+1)}</div>
                <div style="font-size:10px;color:var(--slate-500);margin-top:3px">Stage ${i+1}</div>
              </div>
              ${i < 10 ? '<div style="width:32px;height:2px;background:var(--border-subtle);flex-shrink:0;margin-top:-16px"></div>' : ''}
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section style="padding:80px 0;background:var(--green-950)">
      <div class="container text-center">
        <div style="max-width:560px;margin:0 auto">
          <h2 style="font-size:40px;font-weight:900;margin-bottom:16px">Ready to <span class="text-gradient">sell your crop</span>?</h2>
          <p style="color:var(--slate-400);margin-bottom:32px;font-size:16px">Register in 2 minutes. Book your slot. Get paid at MSP — no middlemen, no queues.</p>
          <div class="flex gap-16 justify-center flex-wrap">
            <button class="btn btn-gold btn-xl" id="cta-register">Register as Farmer 🌾</button>
            <button class="btn btn-outline btn-lg" id="demo-login-btn">Try Demo Login</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="background:var(--green-950);border-top:1px solid var(--border-subtle);padding:32px 0">
      <div class="container flex items-center justify-between flex-wrap gap-16">
        <div class="flex items-center gap-10">
          <div style="width:32px;height:32px;background:var(--gradient-green);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🌾</div>
          <div style="font-size:16px;font-weight:800">Kisan<span style="color:var(--gold-400)">Setu</span> AI</div>
        </div>
        <div style="font-size:12px;color:var(--slate-500)">© 2026 KisanSetu AI — SIH 2026 Project | Ministry of Agriculture & Farmers Welfare</div>
      </div>
    </footer>
  `;

  setTimeout(() => {
    document.getElementById('cta-farmer')?.addEventListener('click', () => navigate('#/login?role=FARMER'));
    document.getElementById('cta-officer')?.addEventListener('click', () => navigate('#/login?role=OFFICER'));
    document.getElementById('cta-register')?.addEventListener('click', () => navigate('#/register'));
    const floatCard = document.getElementById('hero-float-card');
    if (floatCard && window.innerWidth > 1200) floatCard.style.display = 'block';
    
    document.getElementById('demo-login-btn')?.addEventListener('click', () => {
      AuthStore.setUser({ id: 1, name: 'Ramesh Kumar', role: 'FARMER', mobile: '9876543210', farmerId: 1, preferredLanguage: 'hi' }, 'mock-jwt-token-farmer');
      showToast('Demo login successful! Welcome, Ramesh Ji 🌾', 'success');
      navigate('#/farmer/dashboard');
    });
  }, 0);

  return html;
}
