// ============================================================
// Admin Pages — Analytics Dashboard & Congestion Map
// ============================================================
import { renderAppLayout, showToast, formatCurrency, congestionBadge } from '../utils.js';
import { MOCK_ADMIN_OVERVIEW, MOCK_CENTERS } from '../mockData.js';

// ============================================================
// Admin Dashboard
// ============================================================
export function renderAdminDashboard(user) {
  const d = MOCK_ADMIN_OVERVIEW;

  const content = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:24px">
      <div>
        <h1 style="font-size:24px;font-weight:800">🏛️ Admin Dashboard</h1>
        <div style="font-size:13px;color:var(--slate-400);margin-top:4px">Hisar District — Live Procurement Overview</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" id="export-btn" style="border-radius:var(--radius-md)">📥 Export Report</button>
        <button class="btn btn-primary btn-sm" id="refresh-btn" style="border-radius:var(--radius-md)">🔄 Refresh</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="stats-grid mb-24">
      <div class="stat-card green">
        <div class="stat-icon">👨‍🌾</div>
        <div class="stat-value text-gradient">${d.totalFarmersServedToday}</div>
        <div class="stat-label">Farmers Served Today</div>
        <div class="stat-change stat-up">▲ 22% vs yesterday</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">🌾</div>
        <div class="stat-value" style="color:var(--gold-400)">${d.totalQuantityProcuredTonnes.toLocaleString()}</div>
        <div class="stat-label">Tonnes Procured</div>
        <div class="stat-change stat-up">▲ Target: 2000T</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">💰</div>
        <div class="stat-value" style="color:#60a5fa">₹${d.totalMspValueCrore} Cr</div>
        <div class="stat-label">MSP Value Disbursed</div>
        <div class="stat-change stat-up">▲ DBT Transferred</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">⏱️</div>
        <div class="stat-value" style="color:#a78bfa">${d.avgWaitTimeMins}</div>
        <div class="stat-label">Avg Wait Time (min)</div>
        <div class="stat-change stat-up">▼ 75% improvement</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">🏢</div>
        <div class="stat-value text-gradient">${d.activeCenters}/${d.totalCenters}</div>
        <div class="stat-label">Active Centres</div>
        <div class="stat-change" style="color:var(--slate-400)">2 on maintenance</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">📅</div>
        <div class="stat-value" style="color:var(--gold-400)">${d.autoRescheduled}</div>
        <div class="stat-label">Auto-Rescheduled</div>
        <div class="stat-change" style="color:var(--slate-400)">${d.missedSlots} missed slots today</div>
      </div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">
      <!-- Weekly Farmers Chart -->
      <div class="card">
        <div class="card-header">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:700">📈 Weekly Farmer Volume</div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm chart-tab active" data-metric="farmers" style="border-radius:var(--radius-sm)">Farmers</button>
              <button class="btn btn-ghost btn-sm chart-tab" data-metric="qty" style="border-radius:var(--radius-sm)">Quantity</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div id="weekly-chart" style="display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 8px">
            ${d.weeklyData.map(w => {
              const pct = Math.round((w.farmers / 360) * 100);
              return `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
                  <div style="font-size:10px;color:var(--slate-400);font-weight:600">${w.farmers}</div>
                  <div style="flex:1;width:100%;background:var(--gradient-green);border-radius:4px 4px 0 0;min-height:4px" 
                       style="height:${pct}%" 
                       data-farmers="${w.farmers}" data-qty="${w.qty}"
                       class="chart-bar-item" title="${w.day}: ${w.farmers} farmers"></div>
                  <div style="font-size:11px;color:var(--slate-500)">${w.day}</div>
                </div>`;
            }).join('')}
          </div>
          <div class="chart-legend">
            <div class="legend-item"><div class="legend-dot" style="background:var(--green-500)"></div>Farmers Served</div>
          </div>
        </div>
      </div>

      <!-- Centre Utilization -->
      <div class="card">
        <div class="card-header"><div style="font-weight:700">🏢 Centre Utilization</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
          ${d.centersData.map(c => `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
                <span style="font-weight:600">${c.name}</span>
                <div style="display:flex;gap:10px">
                  <span style="color:var(--slate-400)">${c.farmers} farmers</span>
                  <span style="color:${c.utilization > 80 ? 'var(--error)' : c.utilization > 60 ? 'var(--warning)' : 'var(--success)'};font-weight:700">${c.utilization}%</span>
                </div>
              </div>
              <div class="progress" style="height:8px">
                <div class="progress-bar ${c.utilization > 80 ? 'progress-gold' : 'progress-green'}" style="width:${c.utilization}%"></div>
              </div>
              <div style="font-size:10px;color:var(--slate-500);margin-top:3px">Avg wait: ${c.wait}min • ${c.qty}T procured</div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Bottleneck Alerts -->
    <div class="card mt-24">
      <div class="card-header">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:700">🚨 Active Alerts & Bottlenecks</div>
          <span class="badge badge-red">3 Critical</span>
        </div>
      </div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
        ${[
          { type: 'critical', icon: '🔴', title: 'Hansi Depot — Critical Congestion', desc: '88% capacity used. 24 trucks waiting. Avg wait: 110 min. AI recommends redirecting to Fatehabad.', action: 'Redirect Traffic', center: 'Hansi' },
          { type: 'warning', icon: '🟡', title: 'Hisar Mandi-1 — Weighbridge Down', desc: 'Weighbridge-2 reported offline at 09:30. Effective capacity reduced 50%. 18 farmers affected.', action: 'Send Technician', center: 'Hisar' },
          { type: 'info', icon: '🔵', title: 'Barwala Centre — Optimal Capacity', desc: 'Only 28% utilized. AI is proactively recommending this centre to 45 nearby farmers to balance load.', action: 'View Details', center: 'Barwala' },
        ].map(alert => `
          <div class="alert alert-${alert.type === 'critical' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}">
            <span style="font-size:18px">${alert.icon}</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px">${alert.title}</div>
              <div style="font-size:12px;margin-top:3px;opacity:0.8">${alert.desc}</div>
            </div>
            <button class="btn btn-outline btn-sm" style="border-radius:var(--radius-md);flex-shrink:0;font-size:12px">${alert.action}</button>
          </div>`).join('')}
      </div>
    </div>

    <!-- Centre Performance Table -->
    <div class="card mt-24">
      <div class="card-header"><div style="font-weight:700">📊 Centre Performance Comparison</div></div>
      <div class="table-container" style="border:none">
        <table>
          <thead>
            <tr>
              <th>Centre</th><th>Status</th><th>Farmers</th><th>Qty (T)</th><th>Avg Wait</th><th>Utilization</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_CENTERS.map(c => `
              <tr>
                <td>
                  <div style="font-weight:600">${c.centerName}</div>
                  <div style="font-size:11px;color:var(--slate-500)">${c.address}</div>
                </td>
                <td>${congestionBadge(c.congestionLevel)}</td>
                <td style="font-weight:600">${Math.round(c.currentOccupancy * 0.3)}</td>
                <td style="font-weight:600">${Math.round(c.currentOccupancy * 0.3 * 4.5)}</td>
                <td style="color:${c.estimatedWaitMins > 60 ? 'var(--error)' : 'var(--success)'}"><strong>${c.estimatedWaitMins} min</strong></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress" style="width:80px;height:6px">
                      <div class="progress-bar ${c.currentOccupancy/c.totalCapacityPerDay > 0.8 ? 'progress-gold' : 'progress-green'}" style="width:${Math.round(c.currentOccupancy/c.totalCapacityPerDay*100)}%"></div>
                    </div>
                    <span style="font-size:12px">${Math.round(c.currentOccupancy/c.totalCapacityPerDay*100)}%</span>
                  </div>
                </td>
                <td><button class="btn btn-ghost btn-sm" style="border-radius:var(--radius-md);font-size:11px">Details</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'dashboard', content);

  setTimeout(() => {
    document.getElementById('refresh-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('refresh-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span>';
      await new Promise(r => setTimeout(r, 800));
      btn.innerHTML = '🔄 Refresh';
      showToast('✅ Data refreshed', 'success');
    });
    document.getElementById('export-btn')?.addEventListener('click', () => {
      showToast('📥 Generating district report PDF...', 'info');
    });

    // Dynamic chart bars heights
    const bars = document.querySelectorAll('.chart-bar-item');
    const maxFarmers = Math.max(...d.weeklyData.map(w => w.farmers));
    bars.forEach((bar, i) => {
      const farmers = parseInt(bar.dataset.farmers);
      const pct = Math.round((farmers / maxFarmers) * 100);
      bar.style.height = `${pct}%`;
    });

    // Chart tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const metric = tab.dataset.metric;
        const maxVal = metric === 'farmers' ? maxFarmers : Math.max(...d.weeklyData.map(w => w.qty));
        bars.forEach((bar, i) => {
          const val = parseInt(bar.dataset[metric]);
          const pct = Math.round((val / maxVal) * 100);
          bar.style.height = `${pct}%`;
          bar.previousElementSibling.textContent = val;
        });
      });
    });
  }, 0);

  return page;
}

// ============================================================
// Analytics Page
// ============================================================
export function renderAdminAnalytics(user) {
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">📈 District Analytics</h1>
        <div class="section-subtitle">Real-time procurement KPIs and bottleneck analysis</div>
      </div>
      <div style="display:flex;gap:8px">
        <select class="form-select" style="height:36px;font-size:13px">
          <option>Last 7 Days</option><option>Last 30 Days</option><option>This Season</option>
        </select>
      </div>
    </div>

    <!-- KPI Highlights -->
    <div class="grid-4 mb-24">
      ${[
        { val: '42 min', label: 'Avg Wait Time', change: '↓ 75% from 168 min', color: 'var(--green-400)', up: true },
        { val: '0.24', label: 'Gini Coeff (Utilization)', change: '↓ From 0.72 (balanced)', color: 'var(--gold-400)', up: true },
        { val: '92%', label: 'Farmer Adoption Rate', change: '↑ Target: 90%', color: '#60a5fa', up: true },
        { val: '28 sec', label: 'Auto-Reschedule Time', change: '↓ Target: < 30 sec', color: '#a78bfa', up: true },
      ].map(kpi => `
        <div class="stat-card green">
          <div style="font-size:28px;font-weight:900;color:${kpi.color}">${kpi.val}</div>
          <div style="font-size:13px;margin-top:4px">${kpi.label}</div>
          <div style="font-size:11px;margin-top:6px;color:${kpi.up ? 'var(--success)' : 'var(--error)'}">${kpi.change}</div>
        </div>`).join('')}
    </div>

    <!-- Stage Bottleneck Analysis -->
    <div class="card mb-24">
      <div class="card-header"><div style="font-weight:700">🔍 Stage Bottleneck Analysis (Today)</div></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:14px">
          ${[
            { stage: 'Gate Verification', avg: 4, max: 8, count: 347, icon: '✅' },
            { stage: 'Queue Wait', avg: 42, max: 115, count: 289, icon: '⏳', highlight: true },
            { stage: 'Weighbridge', avg: 18, max: 35, count: 248, icon: '⚖️' },
            { stage: 'Quality Check', avg: 22, max: 55, count: 248, icon: '🔬', highlight: true },
            { stage: 'Unloading', avg: 25, max: 45, count: 198, icon: '🏪' },
            { stage: 'Documentation', avg: 8, max: 15, count: 198, icon: '📄' },
          ].map(s => `
            <div style="${s.highlight ? 'background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:var(--radius-md);padding:12px;' : 'padding:4px 0'}">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <div style="display:flex;align-items:center;gap:8px">
                  <span>${s.icon}</span>
                  <span style="font-size:13px;font-weight:600">${s.stage}</span>
                  ${s.highlight ? '<span class="badge badge-gold" style="font-size:9px">BOTTLENECK</span>' : ''}
                </div>
                <div style="font-size:12px;color:var(--slate-400)">${s.count} farmers</div>
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="progress" style="flex:1;height:8px">
                  <div class="progress-bar ${s.highlight ? 'progress-gold' : 'progress-green'}" style="width:${Math.round(s.avg/s.max*100)}%"></div>
                </div>
                <div style="font-size:12px;font-weight:600;min-width:80px;text-align:right">Avg: ${s.avg}min / Max: ${s.max}min</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Payment Analytics -->
    <div class="grid-2" style="gap:24px">
      <div class="card">
        <div class="card-header"><div style="font-weight:700">💰 DBT Payment Analytics</div></div>
        <div class="card-body">
          ${[
            { label: 'PFMS Submitted', count: 198, amount: '₹4.2 Cr', color: '#60a5fa', pct: 100 },
            { label: 'Bank Transfer Initiated', count: 192, amount: '₹4.0 Cr', color: 'var(--green-400)', pct: 97 },
            { label: 'Amount Credited', count: 185, amount: '₹3.9 Cr', color: 'var(--gold-400)', pct: 93 },
            { label: 'Pending / Failed', count: 7, amount: '₹0.14 Cr', color: 'var(--error)', pct: 4 },
          ].map(p => `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
                <span style="font-weight:600">${p.label}</span>
                <div style="display:flex;gap:10px">
                  <span style="color:var(--slate-400)">${p.count} txns</span>
                  <span style="font-weight:700;color:${p.color}">${p.amount}</span>
                </div>
              </div>
              <div class="progress" style="height:8px">
                <div class="progress-bar" style="width:${p.pct}%;background:${p.color}"></div>
              </div>
            </div>`).join('')}
          <div class="alert alert-success" style="font-size:12px;margin-top:16px">
            ✅ Average payment credit time: <strong>18 hours</strong> (vs. 5–12 day blackout previously)
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div style="font-weight:700">🌾 Crop-wise Procurement</div></div>
        <div class="card-body">
          ${[
            { crop: 'Wheat (गेहूं)', icon: '🌾', qty: 820, value: '₹1.86 Cr', pct: 68, msp: 2275 },
            { crop: 'Paddy (धान)', icon: '🌾', qty: 380, value: '₹0.83 Cr', pct: 31, msp: 2183 },
            { crop: 'Mustard (सरसों)', icon: '🌻', qty: 42, value: '₹0.24 Cr', pct: 3, msp: 5650 },
          ].map(c => `
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
                <span style="font-weight:600">${c.icon} ${c.crop}</span>
                <div style="display:flex;gap:10px">
                  <span style="color:var(--slate-400)">${c.qty}T</span>
                  <span style="font-weight:700;color:var(--gold-400)">${c.value}</span>
                </div>
              </div>
              <div class="progress" style="height:10px">
                <div class="progress-bar progress-green" style="width:${c.pct}%"></div>
              </div>
              <div style="font-size:10px;color:var(--slate-500);margin-top:3px">MSP: ₹${c.msp}/qtl • ${c.pct}% of total</div>
            </div>`).join('')}
          
          <div style="border-top:1px solid var(--border-subtle);padding-top:16px;margin-top:8px">
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">AI Prediction — Tomorrow</div>
            <div class="alert alert-info" style="font-size:12px">
              📊 AI forecasts <strong>380±20 farmers</strong> will arrive tomorrow. Recommend opening Barwala extra shift (6 AM – 2 PM).
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderAppLayout(user, 'analytics', content);
}

// ============================================================
// Congestion Map Page
// ============================================================
export function renderAdminMap(user) {
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">🗺️ District Congestion Map</h1>
        <div class="section-subtitle">Real-time centre utilization across Hisar District</div>
      </div>
      <div style="display:flex;gap:8px">
        <span class="badge badge-green" style="animation:pulse-green 2s infinite">● LIVE</span>
        <button class="btn btn-outline btn-sm" id="alert-btn" style="border-radius:var(--radius-md)">🚨 Set Alert Threshold</button>
      </div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">
      <!-- Simulated Map -->
      <div>
        <div class="map-container" style="height:500px">
          <div style="position:absolute;inset:0;background:linear-gradient(160deg,#021a0e 0%,#030d07 50%,#042d18 100%)"></div>
          <!-- Grid pattern -->
          <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(34,196,104,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,196,104,0.04) 1px,transparent 1px);background-size:30px 30px;pointer-events:none"></div>
          <!-- SVG Roads -->
          <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.2" viewBox="0 0 600 500">
            <line x1="0" y1="250" x2="600" y2="250" stroke="#137a42" stroke-width="2"/>
            <line x1="300" y1="0" x2="300" y2="500" stroke="#137a42" stroke-width="2"/>
            <line x1="0" y1="0" x2="600" y2="500" stroke="#137a42" stroke-width="1" stroke-dasharray="8,4"/>
            <line x1="600" y1="0" x2="0" y2="500" stroke="#137a42" stroke-width="1" stroke-dasharray="8,4"/>
            <circle cx="300" cy="250" r="4" fill="#22c468" opacity="0.6"/>
            <text x="305" y="245" fill="#4dd98a" font-size="10">Hisar City</text>
          </svg>
          <!-- Centre markers with glow effects -->
          ${MOCK_CENTERS.map((c, i) => {
            const positions = [{x:35,y:55},{x:55,y:35},{x:70,y:62}];
            const pos = positions[i];
            const colors = { LOW:'#22c468', MODERATE:'#fbbf24', HIGH:'#ef4444', CRITICAL:'#dc2626' };
            const col = colors[c.congestionLevel] || '#22c468';
            const sizes = { LOW:12, MODERATE:16, HIGH:20, CRITICAL:24 };
            const sz = sizes[c.congestionLevel] || 14;
            return `
              <div style="position:absolute;left:${pos.x}%;top:${pos.y}%;transform:translate(-50%,-50%);cursor:pointer" class="center-marker" data-center="${c.id}">
                <!-- Glow ring -->
                <div style="position:absolute;inset:-8px;border-radius:50%;background:${col};opacity:0.15;animation:pulse-${c.congestionLevel === 'LOW' ? 'green' : 'gold'} 2s infinite"></div>
                <div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${col};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 ${sz}px ${col}"></div>
                <!-- Label -->
                <div style="position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);background:rgba(2,26,14,0.95);border:1px solid ${col};border-radius:6px;padding:4px 8px;white-space:nowrap;font-size:10px;font-weight:600;color:${col}">
                  ${c.centerName.split(' ').slice(0,2).join(' ')}<br/>
                  <span style="color:var(--slate-400);font-weight:400">${c.estimatedWaitMins}min wait</span>
                </div>
              </div>`;
          }).join('')}
          <!-- Legend -->
          <div style="position:absolute;bottom:16px;left:16px;background:rgba(2,26,14,0.95);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:12px 16px">
            <div style="font-size:10px;font-weight:700;color:var(--slate-500);text-transform:uppercase;margin-bottom:8px">Congestion Level</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${[['#22c468','Low (< 50%)'],['#fbbf24','Moderate (50-70%)'],['#ef4444','High (70-90%)'],['#dc2626','Critical (> 90%)']].map(([col, lbl]) => `
                <div style="display:flex;align-items:center;gap:8px;font-size:11px">
                  <div style="width:10px;height:10px;border-radius:50%;background:${col};box-shadow:0 0 6px ${col}"></div>
                  <span style="color:var(--slate-300)">${lbl}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Centre Details Panel -->
      <div>
        <div class="section-title mb-16">Centre Status Panel</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${MOCK_CENTERS.map(c => {
            const colors = { LOW:'rgba(34,196,104,0.1)', MODERATE:'rgba(245,158,11,0.1)', HIGH:'rgba(239,68,68,0.1)', CRITICAL:'rgba(220,38,38,0.15)' };
            const borderColors = { LOW:'rgba(34,196,104,0.3)', MODERATE:'rgba(245,158,11,0.3)', HIGH:'rgba(239,68,68,0.3)', CRITICAL:'rgba(220,38,38,0.4)' };
            const bgCol = colors[c.congestionLevel] || colors.LOW;
            const bdCol = borderColors[c.congestionLevel] || borderColors.LOW;
            return `
              <div style="background:${bgCol};border:1px solid ${bdCol};border-radius:var(--radius-lg);padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                  <div>
                    <div style="font-size:13px;font-weight:700">${c.centerName}</div>
                    <div style="font-size:11px;color:var(--slate-400);margin-top:2px">${c.address}</div>
                  </div>
                  ${congestionBadge(c.congestionLevel)}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
                  <div style="text-align:center"><div style="font-size:18px;font-weight:800;color:var(--gold-400)">${c.currentQueueLength}</div><div style="font-size:10px;color:var(--slate-500)">Queue</div></div>
                  <div style="text-align:center"><div style="font-size:18px;font-weight:800;color:var(--green-400)">${c.estimatedWaitMins}</div><div style="font-size:10px;color:var(--slate-500)">Wait Min</div></div>
                  <div style="text-align:center"><div style="font-size:18px;font-weight:800">${c.activeWeighbridges}</div><div style="font-size:10px;color:var(--slate-500)">WBridges</div></div>
                </div>
                <div class="progress" style="height:6px;margin-bottom:6px">
                  <div class="progress-bar ${c.currentOccupancy/c.totalCapacityPerDay > 0.8 ? 'progress-gold' : 'progress-green'}" style="width:${Math.round(c.currentOccupancy/c.totalCapacityPerDay*100)}%"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--slate-500)">
                  <span>${c.currentOccupancy} / ${c.totalCapacityPerDay} today</span>
                  <span>${Math.round(c.currentOccupancy/c.totalCapacityPerDay*100)}% utilized</span>
                </div>
                ${c.congestionLevel === 'CRITICAL' ? `
                  <div class="alert alert-error mt-10" style="font-size:11px">
                    🚨 Recommend diverting to Barwala Centre (only 28% utilized, 16km away)
                  </div>
                  <button class="btn btn-danger btn-sm mt-8 w-full" style="border-radius:var(--radius-md);font-size:12px">🚨 Redirect Farmers</button>
                ` : ''}
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'map', content);

  setTimeout(() => {
    document.getElementById('alert-btn')?.addEventListener('click', () => {
      showToast('🔔 Alert thresholds can be configured in Settings', 'info');
    });
  }, 0);

  return page;
}
