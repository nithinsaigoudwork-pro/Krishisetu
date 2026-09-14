// ============================================================
// Officer Pages
// ============================================================
import { renderAppLayout, showToast, navigate, statusBadge, generateQRSVG } from '../utils.js';
import { MOCK_QUEUE_TOKENS, MOCK_CENTERS, BOOKING_STAGES } from '../mockData.js';

// ============================================================
// Officer Dashboard — Live Queue Board
// ============================================================
export function renderOfficerDashboard(user) {
  const center = MOCK_CENTERS[1]; // Barwala
  let tokens = [...MOCK_QUEUE_TOKENS];

  const content = `
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:24px">
      <div>
        <h1 style="font-size:24px;font-weight:800">👮 Officer Dashboard</h1>
        <div style="font-size:13px;color:var(--slate-400);margin-top:4px">${user?.centerName || center.centerName}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span class="badge badge-green" style="animation:pulse-green 2s infinite">● LIVE</span>
        <span style="font-size:12px;color:var(--slate-400)" id="clock">${new Date().toLocaleTimeString('en-IN')}</span>
        <button class="btn btn-primary btn-sm" id="call-next-btn" style="border-radius:var(--radius-md)">📢 Call Next Token</button>
        <a href="#/officer/checkin" class="btn btn-gold btn-sm" style="border-radius:var(--radius-md)">📱 Gate Check-In</a>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="stats-grid mb-24">
      <div class="stat-card green">
        <div class="stat-icon">🎟️</div>
        <div class="stat-value text-gradient" id="stat-queue">${tokens.length}</div>
        <div class="stat-label">Tokens in Queue</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">✅</div>
        <div class="stat-value" style="color:var(--gold-400)">42</div>
        <div class="stat-label">Served Today</div>
        <div class="stat-change stat-up">Target: 150</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">⚖️</div>
        <div class="stat-value" style="color:#60a5fa">2</div>
        <div class="stat-label">Active Weighbridges</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">⏱️</div>
        <div class="stat-value" style="color:#a78bfa">12</div>
        <div class="stat-label">Avg Wait (min)</div>
        <div class="stat-change stat-up">↓ Down from 38</div>
      </div>
    </div>

    <!-- Currently Being Served -->
    <div class="section-header mb-16">
      <div class="section-title">🔴 Currently Being Served</div>
    </div>
    <div class="grid-2 mb-24" style="gap:16px">
      <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-lg);padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:12px;font-weight:700;color:var(--gold-300)">⚖️ WEIGHBRIDGE-1</span>
          <span class="badge badge-gold">Active</span>
        </div>
        <div style="font-size:24px;font-weight:800;color:var(--gold-400);margin-bottom:4px">T-101</div>
        <div style="font-size:13px;font-weight:600">Vijay Singh</div>
        <div style="font-size:12px;color:var(--slate-400);margin-top:3px">Wheat • 60 qtl • Since 09:15</div>
        <div style="margin-top:12px">
          <button class="btn btn-primary btn-sm advance-btn" data-token="T-101" data-stage="QUALITY_CHECK" style="border-radius:var(--radius-md);width:100%">→ Move to Quality Check</button>
        </div>
      </div>
      <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:var(--radius-lg);padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:12px;font-weight:700;color:#c4b5fd">🔬 LAB-1</span>
          <span class="badge badge-purple">Active</span>
        </div>
        <div style="font-size:24px;font-weight:800;color:#a78bfa;margin-bottom:4px">T-102</div>
        <div style="font-size:13px;font-weight:600">Mohan Lal</div>
        <div style="font-size:12px;color:var(--slate-400);margin-top:3px">Paddy • 80 qtl • Since 09:45</div>
        <div style="margin-top:12px">
          <button class="btn btn-outline btn-sm accept-btn" data-token="T-102" data-stage="ACCEPTED" style="border-radius:var(--radius-md);width:100%;color:var(--success);border-color:rgba(34,196,104,0.3)">✅ Accept</button>
        </div>
      </div>
    </div>

    <!-- Live Queue Board -->
    <div class="section-header mb-16">
      <div class="section-title">📊 Live Queue Board</div>
      <div style="font-size:12px;color:var(--slate-400)">Auto-refreshing every 30s</div>
    </div>
    <div class="queue-board" id="queue-board">
      ${tokens.filter(t => t.stage === 'WAITING').map((t, i) => `
        <div class="queue-token" id="token-${t.tokenNumber.replace('-','')}" data-token="${t.tokenNumber}">
          <div class="token-number">${t.tokenNumber}</div>
          <div class="token-info">
            <div class="token-name">${t.farmerName}</div>
            <div class="token-meta">${t.crop} • ${t.qty} qtl • Waiting since ${t.waitSince}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:6px">Position #${i + 1}</div>
            <span class="badge badge-gold">⏳ Waiting</span>
          </div>
        </div>`).join('')}
    </div>

    <!-- Capacity Controls -->
    <div class="card mt-24">
      <div class="card-header"><div style="font-weight:700">⚙️ Centre Capacity Controls</div></div>
      <div class="card-body">
        <div class="grid-3" style="gap:20px">
          <div>
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">Active Weighbridges</div>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="btn btn-outline btn-sm" id="wb-minus">−</button>
              <span style="font-size:18px;font-weight:700;min-width:28px;text-align:center" id="wb-count">2</span>
              <button class="btn btn-outline btn-sm" id="wb-plus">+</button>
            </div>
          </div>
          <div>
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">Active Lab Counters</div>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="btn btn-outline btn-sm" id="lab-minus">−</button>
              <span style="font-size:18px;font-weight:700;min-width:28px;text-align:center" id="lab-count">1</span>
              <button class="btn btn-outline btn-sm" id="lab-plus">+</button>
            </div>
          </div>
          <div>
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">Centre Status</div>
            <select class="form-select" id="center-status" style="height:38px">
              <option value="ACTIVE">🟢 Operational</option>
              <option value="PAUSED">🟡 Temporarily Paused</option>
              <option value="EMERGENCY">🔴 Emergency Closure</option>
            </select>
          </div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px">
          <button class="btn btn-primary btn-sm" id="save-capacity" style="border-radius:var(--radius-md)">💾 Save Capacity Settings</button>
          <button class="btn btn-danger btn-sm" id="emergency-reschedule" style="border-radius:var(--radius-md)">🚨 Emergency Mass Reschedule</button>
        </div>
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'dashboard', content);

  setTimeout(() => {
    // Live clock
    setInterval(() => {
      const el = document.getElementById('clock');
      if (el) el.textContent = new Date().toLocaleTimeString('en-IN');
    }, 1000);

    // Call next
    document.getElementById('call-next-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('call-next-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span>';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 600));
      showToast('📢 Token T-103 called to Weighbridge-1!', 'success');
      btn.innerHTML = '📢 Call Next Token';
      btn.disabled = false;
    });

    // Advance stage buttons
    document.querySelectorAll('.advance-btn, .accept-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.innerHTML = '<span class="spinner spinner-sm"></span>';
        btn.disabled = true;
        await new Promise(r => setTimeout(r, 700));
        showToast(`✅ Stage advanced successfully`, 'success');
        btn.innerHTML = btn.dataset.stage === 'QUALITY_CHECK' ? '→ Moved to Quality Check' : '✅ Accepted';
      });
    });

    // Weighbridge counter
    let wb = 2, lab = 1;
    document.getElementById('wb-minus')?.addEventListener('click', () => { if (wb > 0) { wb--; document.getElementById('wb-count').textContent = wb; } });
    document.getElementById('wb-plus')?.addEventListener('click', () => { if (wb < 5) { wb++; document.getElementById('wb-count').textContent = wb; } });
    document.getElementById('lab-minus')?.addEventListener('click', () => { if (lab > 0) { lab--; document.getElementById('lab-count').textContent = lab; } });
    document.getElementById('lab-plus')?.addEventListener('click', () => { if (lab < 5) { lab++; document.getElementById('lab-count').textContent = lab; } });

    document.getElementById('save-capacity')?.addEventListener('click', async () => {
      await new Promise(r => setTimeout(r, 400));
      showToast('⚙️ Capacity settings saved', 'success');
    });
    document.getElementById('emergency-reschedule')?.addEventListener('click', () => {
      showToast('🚨 Emergency reschedule initiated — AI assigning alternative slots', 'info');
    });
  }, 0);

  return page;
}

// ============================================================
// Gate Check-In
// ============================================================
export function renderGateCheckin(user) {
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">📱 Gate QR Check-In</h1>
        <div class="section-subtitle">Scan farmer's QR pass and issue queue token</div>
      </div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">
      <!-- QR Scanner Panel -->
      <div>
        <div class="card mb-16">
          <div class="card-header"><div style="font-weight:700">📷 QR Code Scanner</div></div>
          <div class="card-body">
            <!-- Simulated scanner viewfinder -->
            <div style="width:100%;aspect-ratio:1;max-width:300px;margin:0 auto;background:var(--green-950);border:2px solid var(--border-medium);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:pointer" id="scanner-view" onclick="document.getElementById('manual-qr').focus()">
              <div style="position:absolute;inset:0;border:3px solid transparent;border-image:linear-gradient(45deg,var(--green-400),transparent,transparent,var(--green-400)) 1;pointer-events:none"></div>
              <!-- Corner markers -->
              <div style="position:absolute;top:12px;left:12px;width:28px;height:28px;border-left:3px solid var(--green-400);border-top:3px solid var(--green-400)"></div>
              <div style="position:absolute;top:12px;right:12px;width:28px;height:28px;border-right:3px solid var(--green-400);border-top:3px solid var(--green-400)"></div>
              <div style="position:absolute;bottom:12px;left:12px;width:28px;height:28px;border-left:3px solid var(--green-400);border-bottom:3px solid var(--green-400)"></div>
              <div style="position:absolute;bottom:12px;right:12px;width:28px;height:28px;border-right:3px solid var(--green-400);border-bottom:3px solid var(--green-400)"></div>
              <!-- Scanning line -->
              <div id="scan-line" style="position:absolute;left:0;right:0;height:2px;background:var(--green-400);box-shadow:0 0 10px var(--green-400);animation:scanLine 2s linear infinite"></div>
              <div style="text-align:center;color:var(--slate-500);font-size:13px;z-index:1">
                <div style="font-size:32px;margin-bottom:8px">📷</div>
                <div>Camera scanner</div>
                <div style="font-size:11px;margin-top:4px">Click to focus</div>
              </div>
            </div>

            <div class="divider-text my-16" style="margin:16px 0">or enter manually</div>

            <div class="form-group">
              <label class="form-label">QR Payload / Booking Reference</label>
              <div class="input-group">
                <span class="input-icon">🔍</span>
                <input class="form-input" type="text" id="manual-qr" placeholder="e.g. KS-2026-001001 or paste QR payload" />
              </div>
            </div>
            <button class="btn btn-primary w-full mt-12" id="verify-btn" style="border-radius:var(--radius-md)">
              ✅ Verify & Issue Token
            </button>
          </div>
        </div>

        <!-- Recent check-ins -->
        <div class="card">
          <div class="card-header"><div style="font-weight:700">📋 Recent Check-Ins Today</div></div>
          <div class="card-body" style="padding:0">
            <table style="width:100%">
              <thead>
                <tr>
                  <th>Token</th><th>Farmer</th><th>Crop</th><th>Time</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${[
                  ['T-101','Vijay Singh','Wheat 60qt','09:15','WEIGHING'],
                  ['T-102','Mohan Lal','Paddy 80qt','09:47','QUALITY_CHECK'],
                  ['T-103','Gurpreet Kaur','Wheat 40qt','10:12','WAITING'],
                  ['T-104','Ramesh Kumar','Wheat 80qt','10:33','WAITING'],
                ].map(([tok,name,crop,time,stage]) => `
                  <tr>
                    <td style="font-weight:700;color:var(--gold-400)">${tok}</td>
                    <td>${name}</td>
                    <td style="font-size:12px;color:var(--slate-400)">${crop}</td>
                    <td style="font-size:12px;color:var(--slate-400)">${time}</td>
                    <td>${statusBadge(stage)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Verification Result Panel -->
      <div>
        <div id="verification-panel">
          <div class="card" style="border-color:rgba(34,196,104,0.3)">
            <div class="card-header" style="background:rgba(34,196,104,0.05)">
              <div style="font-weight:700">🔍 Verification Result</div>
            </div>
            <div class="card-body" id="verify-result">
              <div class="empty-state">
                <div class="empty-icon">🎟️</div>
                <div class="empty-title">No QR Scanned Yet</div>
                <div class="empty-desc">Scan a farmer's QR pass or enter booking reference to verify and issue token</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stage Advance Panel -->
        <div class="card mt-16">
          <div class="card-header"><div style="font-weight:700">⚡ Quick Stage Advance</div></div>
          <div class="card-body">
            <div class="form-group mb-14">
              <label class="form-label">Token Number</label>
              <input class="form-input" type="text" id="stage-token" placeholder="e.g. T-103" />
            </div>
            <div class="form-group mb-14">
              <label class="form-label">Advance to Stage</label>
              <select class="form-select" id="stage-target">
                ${BOOKING_STAGES.map(s => `<option value="${s.key}">${s.icon} ${s.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group mb-14">
              <label class="form-label">Resource / Counter</label>
              <input class="form-input" type="text" id="stage-resource" placeholder="e.g. Weighbridge-2" />
            </div>
            <button class="btn btn-primary w-full" id="advance-stage-btn" style="border-radius:var(--radius-md)">
              ⚡ Advance Stage
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes scanLine { 0% { top: 10%; } 50% { top: 85%; } 100% { top: 10%; } }
    </style>
  `;

  const page = renderAppLayout(user, 'checkin', content);

  setTimeout(() => {
    document.getElementById('verify-btn')?.addEventListener('click', async () => {
      const val = document.getElementById('manual-qr').value.trim() || 'KS-2026-001001';
      const btn = document.getElementById('verify-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Verifying HMAC...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1000));
      btn.innerHTML = '✅ Verify & Issue Token';
      btn.disabled = false;

      // Simulate successful verification
      document.getElementById('verify-result').innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(34,196,104,0.1);border-radius:var(--radius-md);margin-bottom:16px;border:1px solid rgba(34,196,104,0.25)">
          <span style="font-size:24px">✅</span>
          <div>
            <div style="font-weight:700;color:var(--green-300)">QR Verified — HMAC Valid</div>
            <div style="font-size:11px;color:var(--slate-400)">Booking is authentic & not expired</div>
          </div>
        </div>
        <div style="display:grid;gap:10px;margin-bottom:16px">
          ${[['Farmer','Ramesh Kumar'],['Mobile','9876543210'],['Booking Ref','KS-2026-001001'],['Centre','Barwala Sub-Centre'],['Crop','Wheat • 80 quintals'],['Slot','10 Sep 2026, 10:00 AM'],['Status','BOOKED → GATE_VERIFIED']].map(([k,v]) => `
            <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid var(--border-subtle)">
              <span style="color:var(--slate-400)">${k}</span><span style="font-weight:600">${v}</span>
            </div>`).join('')}
        </div>
        <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-md);padding:14px;text-align:center;margin-bottom:16px">
          <div style="font-size:12px;color:var(--slate-400);margin-bottom:4px">New Queue Token Issued</div>
          <div style="font-size:36px;font-weight:900;color:var(--gold-400)">T-107</div>
          <div style="font-size:12px;color:var(--green-300);margin-top:4px">Position #5 in queue</div>
        </div>
        <button class="btn btn-gold w-full" style="border-radius:var(--radius-md)" onclick="document.getElementById('manual-qr').value='';document.getElementById('verify-result').innerHTML='<div class=\\'empty-state\\'><div class=\\'empty-icon\\'>🎟️</div><div class=\\'empty-title\\'>Ready for Next</div></div>'">
          ✅ Confirm & Process Next Farmer
        </button>
      `;
      showToast('✅ QR verified! Token T-107 issued to Ramesh Kumar', 'success');
    });

    document.getElementById('advance-stage-btn')?.addEventListener('click', async () => {
      const token = document.getElementById('stage-token').value;
      if (!token) { showToast('Please enter a token number', 'error'); return; }
      const btn = document.getElementById('advance-stage-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span>';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 700));
      const stage = document.getElementById('stage-target').value;
      showToast(`✅ Token ${token} advanced to ${stage.replace('_',' ')}`, 'success');
      btn.innerHTML = '⚡ Advance Stage';
      btn.disabled = false;
    });
  }, 0);

  return page;
}
