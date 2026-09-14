// ============================================================
// Farmer Pages
// ============================================================
import { renderAppLayout, showToast, navigate, formatCurrency, formatDate, formatTime, statusBadge, congestionBadge, generateQRSVG } from '../utils.js';
import { MOCK_BOOKINGS, MOCK_CENTERS, MOCK_PAYMENT, BOOKING_STAGES, CROPS, getAIResponse } from '../mockData.js';

// ============================================================
// Farmer Dashboard
// ============================================================
export function renderFarmerDashboard(user) {
  const activeBooking = MOCK_BOOKINGS[0];
  const lang = user?.preferredLanguage || 'en';

  const stageIndex = BOOKING_STAGES.findIndex(s => s.key === activeBooking.status);
  const progressPct = Math.round(((stageIndex + 1) / BOOKING_STAGES.length) * 100);

  const stagesHtml = BOOKING_STAGES.slice(0, 7).map((s, i) => {
    const isDone = i < stageIndex;
    const isActive = i === stageIndex;
    const isPending = i > stageIndex;
    return `
      <div class="stage-item ${isDone ? 'completed' : isActive ? 'active' : ''}">
        <div class="stage-line"></div>
        <div class="stage-dot ${isDone ? 'stage-dot-done' : isActive ? 'stage-dot-active' : 'stage-dot-pending'}">
          ${isDone ? '✓' : isActive ? s.icon : i + 1}
        </div>
        <div class="stage-info">
          <div class="stage-name ${isPending ? 'stage-name-pending' : ''}">${s.label}</div>
          <div class="stage-hi devanagari">${s.labelHi}</div>
          ${isActive ? '<div class="stage-time" style="color:var(--gold-400)">● Currently here</div>' : ''}
        </div>
      </div>`;
  }).join('');

  // Chat messages & Speech capabilities
  const hasSpeechRecognition = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  let autoRead = typeof localStorage !== 'undefined' ? localStorage.getItem('ks_autoread') === 'true' : false;

  const initMessages = lang === 'hi'
    ? [{ bot: true, text: '🙏 नमस्ते रामेश जी! मैं आपका KisanSetu AI सहायक हूं। आप हिंदी में पूछ सकते हैं — टोकन नंबर, भुगतान, MSP दर, या कुछ भी।' }]
    : [{ bot: true, text: '🙏 Hello Ramesh Ji! I\'m your KisanSetu AI assistant. Ask me about your token, payment status, MSP rates, or anything about your booking.' }];

  const content = `
    <!-- Welcome Banner -->
    <div style="background:var(--gradient-card);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);padding:24px 28px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-size:13px;color:var(--green-400);margin-bottom:4px">🙏 Good Morning</div>
        <h1 style="font-size:26px;font-weight:800">${user?.name || 'Farmer'} <span class="devanagari" style="font-size:18px;color:var(--gold-400);font-weight:400">(रामेश जी)</span></h1>
        <p style="font-size:13px;color:var(--slate-400);margin-top:4px">District: ${user?.district || 'Hisar'}, Haryana &bull; Farmer ID: ${user?.id || 1}</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-gold btn-sm" id="btn-book-slot">+ Book New Slot</button>
        <button class="btn btn-outline btn-sm" id="btn-find-centers">🗺️ Find Centres</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="stats-grid mb-24">
      <div class="stat-card green">
        <div class="stat-icon">⏳</div>
        <div class="stat-value text-gradient">#3</div>
        <div class="stat-label">Queue Position (Token T-104)</div>
        <div class="stat-change stat-up">⬆ ~18 min wait</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">📋</div>
        <div class="stat-value" style="color:var(--gold-400)">1</div>
        <div class="stat-label">Active Bookings</div>
        <div class="stat-change" style="color:var(--slate-400)">10 Sep, 10:00 AM</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">💰</div>
        <div class="stat-value" style="color:#60a5fa">${formatCurrency(96487)}</div>
        <div class="stat-label">Last Payment Received</div>
        <div class="stat-change stat-up">✓ 22 Aug 2026</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">🌾</div>
        <div class="stat-value" style="color:#a78bfa">₹2,275</div>
        <div class="stat-label">Wheat MSP (per Quintal)</div>
        <div class="stat-change" style="color:var(--slate-400)">Rabi 2025-26</div>
      </div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">
      <!-- Active Booking Tracker -->
      <div>
        <div class="section-header">
          <div>
            <div class="section-title">Active Booking</div>
            <div class="section-subtitle">${activeBooking.bookingReference}</div>
          </div>
          ${statusBadge(activeBooking.status)}
        </div>
        <div class="card">
          <div class="card-body">
            <!-- Booking info -->
            <div style="display:flex;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)">
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Centre</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${activeBooking.centerName}</div>
              </div>
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Crop</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${activeBooking.cropName}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--slate-500)">Quantity</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${activeBooking.estimatedQuantityQuintals} qtl</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)">
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Date</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${formatDate(activeBooking.slotDate)}</div>
              </div>
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Slot</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${formatTime(activeBooking.slotStartTime)} – ${formatTime(activeBooking.slotEndTime)}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--slate-500)">Token</div>
                <div style="font-size:13px;font-weight:700;margin-top:2px;color:var(--gold-400)">${activeBooking.tokenNumber}</div>
              </div>
            </div>

            <!-- Queue live indicator -->
            <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-md);padding:16px;margin-bottom:20px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-size:13px;font-weight:600">📡 Live Queue Position</span>
                <span class="badge badge-gold" style="animation:pulse-gold 2s infinite">● LIVE</span>
              </div>
              <div style="font-size:40px;font-weight:900;color:var(--gold-400);margin-bottom:4px">#${activeBooking.queuePosition}</div>
              <div style="font-size:13px;color:var(--green-300)">Estimated wait: <strong>${activeBooking.estimatedWaitMins} minutes</strong></div>
              <div class="progress mt-12">
                <div class="progress-bar progress-gold" style="width:${progressPct}%"></div>
              </div>
              <div style="font-size:11px;color:var(--slate-500);margin-top:6px">${progressPct}% complete — WAITING → WEIGHING</div>
            </div>

            <!-- Stage tracker -->
            <div class="stage-tracker">
              ${stagesHtml}
            </div>
            <div style="display:flex;gap:8px;margin-top:16px">
              <a href="#/farmer/bookings" class="btn btn-outline btn-sm" style="flex:1;border-radius:var(--radius-md)">View QR Pass</a>
              <a href="#/farmer/payment" class="btn btn-ghost btn-sm" style="flex:1;border-radius:var(--radius-md)">Payment Status</a>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Chat Widget -->
      <div>
        <div class="section-header">
          <div>
            <div class="section-title">🤖 AI Assistant</div>
            <div class="section-subtitle devanagari" style="font-size:12px">कृषि AI सहायक — Hindi & English</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            ${hasSpeechSynthesis ? `
              <button class="auto-read-btn ${autoRead ? 'active' : ''}" id="auto-read-toggle" title="Toggle automatic reading of AI responses">
                <span>🔊</span>
                <span>Auto-read: <strong id="auto-read-status">${autoRead ? 'ON' : 'OFF'}</strong></span>
              </button>
            ` : ''}
            <div style="display:flex;gap:2px;background:rgba(2,45,24,0.6);border:1px solid var(--border-medium);border-radius:var(--radius-full);padding:2px">
              <button class="btn btn-xs ${lang === 'hi' ? 'btn-primary' : 'btn-ghost'}" id="lang-hi" style="border-radius:var(--radius-full);font-size:12px;padding:3px 12px;font-weight:600">🇮🇳 हिंदी</button>
              <button class="btn btn-xs ${lang === 'en' ? 'btn-primary' : 'btn-ghost'}" id="lang-en" style="border-radius:var(--radius-full);font-size:12px;padding:3px 12px;font-weight:600">🇬🇧 English</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="chat-widget">
            <div class="chat-messages" id="chat-messages">
              ${initMessages.map(m => `
                <div class="chat-msg ${m.bot ? '' : 'chat-msg-user'}">
                  ${m.bot ? '<div class="chat-avatar" style="background:var(--gradient-green)">🤖</div>' : ''}
                  <div class="${m.bot ? 'chat-msg-bot-wrap' : ''}">
                    <div class="chat-bubble ${m.bot ? 'chat-bubble-bot' : 'chat-bubble-user'}">${m.text}</div>
                    ${m.bot && hasSpeechSynthesis ? `
                      <div class="chat-bubble-footer">
                        <button class="chat-speak-btn" type="button" data-text="${encodeURIComponent(m.text)}" title="Read response aloud">
                          <span class="speak-icon">🔊</span>
                          <span class="speak-label">Read aloud</span>
                        </button>
                      </div>` : ''}
                  </div>
                  ${!m.bot ? '<div class="chat-avatar" style="background:var(--gradient-gold);color:var(--green-950)">R</div>' : ''}
                </div>`).join('')}
            </div>
            <div style="padding:8px 12px;border-top:1px solid var(--border-subtle)">
              <div id="chat-quick-replies" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
                ${(lang === 'hi' ? ['मेरा टोकन नंबर?','भुगतान हुआ क्या?','MSP दर बताओ','बुकिंग विवरण'] : ['My queue position?','Payment received?','MSP rates today','My booking details'])
                  .map(q => `<button class="btn btn-ghost btn-sm quick-reply" data-q="${q}" style="font-size:11px;padding:4px 10px;border:1px solid var(--border-subtle);border-radius:var(--radius-full)">${q}</button>`).join('')}
              </div>
            </div>
            <!-- Listening Bar (Web Speech STT) -->
            <div class="chat-listening-bar" id="chat-listening-bar" style="display:none">
              <div class="listening-content">
                <div class="waveform">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span id="listening-status-text">${lang === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... Speak now'}</span>
              </div>
              <button class="chat-cancel-speech-btn" id="chat-cancel-speech" type="button" title="Stop listening">Cancel</button>
            </div>
            <div class="chat-input-row">
              <button class="chat-mic-btn" id="chat-mic" type="button" title="${lang === 'hi' ? 'आवाज़ से पूछें (Voice Input)' : 'Voice Input (Click to speak)'}" aria-label="Voice input">
                <span id="chat-mic-icon">🎤</span>
              </button>
              <button class="btn btn-ghost btn-sm" id="chat-voice-boxes-btn" type="button" title="${lang === 'hi' ? 'आवाज़ प्रश्न बॉक्स खोलें' : 'Open Voice Question Boxes'}" style="font-size:11px;padding:4px 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);color:var(--gold-300);white-space:nowrap">
                🎙️ ${lang === 'hi' ? 'प्रश्न बॉक्स' : 'Voice Qs'}
              </button>
              <input class="chat-input" id="chat-input" placeholder="${lang === 'hi' ? 'हिंदी में पूछें... (उदा. मेरा टोकन नंबर?)' : 'Ask in English... (e.g. My queue position?)'}" />
              <button class="chat-send-btn" id="chat-send" title="Send message">➤</button>
            </div>
          </div>
        </div>

        <!-- MSP Rates quick card -->
        <div class="card mt-16">
          <div class="card-body">
            <div class="section-header mb-12" style="margin-bottom:12px">
              <div class="text-sm font-semibold">🌾 MSP Rates — Rabi 2025-26</div>
              <span class="badge badge-green">CACP Official</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${CROPS.slice(0,4).map(c => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-subtle)">
                  <div style="font-size:13px">${c.icon} ${c.nameEn} <span class="devanagari" style="font-size:11px;color:var(--slate-400)">(${c.nameHi})</span></div>
                  <div style="font-size:14px;font-weight:700;color:var(--gold-400)">₹${c.msp.toLocaleString()}/qtl</div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'dashboard', content);

  setTimeout(() => {
    document.getElementById('btn-book-slot')?.addEventListener('click', () => navigate('#/farmer/book'));
    document.getElementById('btn-find-centers')?.addEventListener('click', () => navigate('#/farmer/centers'));

    let chatLang = lang;
    let chatTyping = false;
    let recognition = null;
    let isListening = false;
    let activeSpeakBtn = null;

    // Intelligent translation to natural Hindi speech for voice synthesis
    function translateToHindiIfEnglish(text) {
      if (!text) return '';
      // If text already has Devanagari Hindi characters, format numbers/symbols
      if (/[\u0900-\u097F]/.test(text)) {
        return text
          .replace(/₹\s*([0-9,]+)/g, '$1 रुपये')
          .replace(/T-(\d+)/g, 'टी $1')
          .replace(/%/g, ' प्रतिशत')
          .replace(/qtl/gi, 'क्विंटल');
      }

      const lower = text.toLowerCase();
      if (lower.includes('token') || lower.includes('queue') || lower.includes('line')) {
        return 'रामेश जी, आपका टोकन नंबर टी 104 है। बरवाला उप-केंद्र पर आपके आगे 3 किसान कतार में हैं। आपका अनुमानित प्रतीक्षा समय 18 मिनट है। कृपया तुलाई के लिए तैयार रहें।';
      }
      if (lower.includes('payment') || lower.includes('paid') || lower.includes('credited')) {
        return 'रामेश जी, आपके 44.2 क्विंटल धान के लिए 96,487 रुपये की राशि सीधे डीबीटी के माध्यम से आपके पंजाब नेशनल बैंक खाते में जमा हो चुकी है।';
      }
      if (lower.includes('booking') || lower.includes('slot')) {
        return 'आपकी सक्रिय स्लॉट बुकिंग बरवाला उप-केंद्र पर 10 सितंबर 2026 को सुबह 10 से 12 बजे के लिए 80 क्विंटल गेहूं की निर्धारित है।';
      }
      if (lower.includes('msp') || lower.includes('wheat') || lower.includes('price') || lower.includes('rate')) {
        return 'रबी 2025-26 के लिए गेहूं का आधिकारिक एमएसपी भाव 2,275 रुपये प्रति क्विंटल है। आपके 80 क्विंटल गेहूं का कुल मूल्य 1,82,000 रुपये होगा। धान का भाव 2,183 और सरसों का 5,650 रुपये है।';
      }
      if (lower.includes('cancel') || lower.includes('reschedule')) {
        return 'आप बिना किसी पेनल्टी के अपने स्लॉट से 12 घंटे पहले तक बुकिंग को रद्द या पुनर्निर्धारित कर सकते हैं। इसके लिए मेरी बुकिंग में जाकर नया समय चुनें।';
      }
      if (lower.includes('quality') || lower.includes('moisture')) {
        return 'खरीद केंद्र पर गुणवत्ता जांच के लिए गेहूं में नमी 12 प्रतिशत से कम होनी चाहिए। गुणवत्ता पास होते ही डिजिटल जे-फॉर्म तुरंत जारी हो जाता है।';
      }
      if (lower.includes('hello') || lower.includes('assistant') || lower.includes('ramesh')) {
        return 'नमस्ते रामेश जी! मैं आपका कृषि सेतु एआई सहायक हूं। आप मुझसे टोकन नंबर, बैंक भुगतान, एमएसपी भाव या स्लॉट बुकिंग के बारे में हिंदी में कुछ भी पूछ सकते हैं।';
      }
      return text;
    }

    // Helper to strip markdown and emojis for clean speech synthesis
    function cleanTextForSpeech(text, targetLang = 'en') {
      if (!text) return '';
      let cleaned = text;
      if (targetLang === 'hi') {
        cleaned = translateToHindiIfEnglish(cleaned);
      }
      return cleaned
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/[*_#`~]/g, '')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/₹\s*([0-9,]+)/g, targetLang === 'hi' ? '$1 रुपये' : '$1 rupees')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Cache browser voices for high-fidelity speech synthesis
    let availableVoices = [];
    function loadVoices() {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        availableVoices = window.speechSynthesis.getVoices() || [];
      }
    }
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Stop speaking currently active speech synthesis
    function stopSpeaking() {
      if (!hasSpeechSynthesis) return;
      try { window.speechSynthesis.cancel(); } catch (e) {}
      if (activeSpeakBtn) {
        activeSpeakBtn.classList.remove('speaking');
        const icon = activeSpeakBtn.querySelector('.speak-icon');
        if (icon) icon.textContent = '🔊';
        const label = activeSpeakBtn.querySelector('.speak-label');
        if (label) label.textContent = 'Read aloud';
        activeSpeakBtn = null;
      }
    }

    // Speak text aloud using browser SpeechSynthesis API with Hindi & English voice selection
    function speakText(rawText, buttonEl = null) {
      if (!hasSpeechSynthesis) return;
      const textToSpeak = cleanTextForSpeech(rawText, chatLang);
      if (!textToSpeak) return;

      // If clicked the currently playing button, treat as toggle to stop
      if (activeSpeakBtn === buttonEl && window.speechSynthesis.speaking) {
        stopSpeaking();
        return;
      }

      stopSpeaking();

      if (!availableVoices || availableVoices.length === 0) {
        loadVoices();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (chatLang === 'hi') {
        // High-precision Hindi voice detection (Microsoft Kalpana, Hemant, Swara, Google हिन्दी, or hi-IN)
        const hindiVoice = availableVoices.find(v => {
          const l = (v.lang || '').toLowerCase().replace('_', '-');
          const n = (v.name || '').toLowerCase();
          return l === 'hi-in' || l.startsWith('hi') || n.includes('hindi') || n.includes('हिन्दी') || n.includes('kalpana') || n.includes('hemant') || n.includes('swara') || n.includes('madhur');
        });

        if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = hindiVoice.lang || 'hi-IN';
        } else {
          utterance.lang = 'hi-IN';
        }
        utterance.rate = 0.88; // Relaxed rate for clear Hindi pronunciation
        utterance.pitch = 1.0;
      } else {
        // High-precision English voice detection (prefer Indian English en-IN or standard English)
        const englishVoice = availableVoices.find(v => {
          const l = (v.lang || '').toLowerCase().replace('_', '-');
          const n = (v.name || '').toLowerCase();
          return l === 'en-in' || l.startsWith('en-in') || n.includes('india') || n.includes('neerja') || n.includes('prabhat') || n.includes('ravi');
        }) || availableVoices.find(v => (v.lang || '').toLowerCase().startsWith('en'));

        if (englishVoice) {
          utterance.voice = englishVoice;
          utterance.lang = englishVoice.lang || 'en-IN';
        } else {
          utterance.lang = 'en-US';
        }
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
      }

      if (buttonEl) {
        activeSpeakBtn = buttonEl;
        buttonEl.classList.add('speaking');
        const icon = buttonEl.querySelector('.speak-icon');
        if (icon) icon.textContent = '⏹️';
        const label = buttonEl.querySelector('.speak-label');
        if (label) label.textContent = 'Stop';
      }

      utterance.onend = () => {
        stopSpeaking();
      };
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        stopSpeaking();
      };

      window.speechSynthesis.speak(utterance);
    }

    // Interactive Voice Assistant Question Boxes Modal
    function showVoiceQuestionBoxes() {
      const existing = document.getElementById('voice-fallback-modal');
      if (existing) existing.remove();

      const prompts = chatLang === 'hi' ? [
        { icon: '🪙', title: 'टोकन व कतार स्थिति', text: 'मेरा टोकन नंबर और कतार क्या है?', q: 'मेरा टोकन नंबर क्या है?' },
        { icon: '💰', title: 'DBT बैंक भुगतान', text: 'क्या मेरा धान का भुगतान बैंक खाते में जमा हुआ?', q: 'भुगतान हुआ क्या?' },
        { icon: '🌾', title: 'MSP सरकारी भाव', text: 'गेहूं, धान और सरसों का आज का आधिकारिक MSP भाव क्या है?', q: 'MSP दर बताओ' },
        { icon: '📋', title: 'सक्रिय स्लॉट बुकिंग', text: 'मेरी बरवाला उप-केंद्र पर सक्रिय बुकिंग का विवरण दिखाओ', q: 'बुकिंग विवरण' },
        { icon: '📅', title: 'स्लॉट तारीख बदलाव', text: 'मैं अपनी बुकिंग का समय या तारीख कैसे बदल सकता हूं?', q: 'बुकिंग पुनर्निर्धारण' },
        { icon: '🔬', title: 'गुणवत्ता व नमी जांच', text: 'फसल स्वीकार होने के लिए नमी और गुणवत्ता की क्या शर्तें हैं?', q: 'गुणवत्ता जांच' }
      ] : [
        { icon: '🪙', title: 'Token & Queue Position', text: 'What is my token number and queue wait time?', q: 'What is my queue position?' },
        { icon: '💰', title: 'DBT Bank Payment', text: 'Has my payment for paddy been credited to my account?', q: 'Has my payment been processed?' },
        { icon: '🌾', title: 'Official MSP Rates', text: 'What are the current MSP rates for wheat, paddy and mustard?', q: 'What are the MSP rates today?' },
        { icon: '📋', title: 'Active Slot Booking', text: 'Show my active slot booking details at Barwala center', q: 'Show my booking details' },
        { icon: '📅', title: 'Reschedule Appointment', text: 'How can I cancel or reschedule my appointment slot?', q: 'How to reschedule booking' },
        { icon: '🔬', title: 'Quality & Moisture Rules', text: 'What are the grain moisture and quality specifications?', q: 'Quality check rules' }
      ];

      const modal = document.createElement('div');
      modal.className = 'voice-modal-backdrop';
      modal.id = 'voice-fallback-modal';
      modal.innerHTML = `
        <div class="voice-modal-card" style="max-width:540px">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--gradient-green);display:flex;align-items:center;justify-content:center;font-size:20px">🎙️</div>
              <div>
                <h3 style="font-size:17px;font-weight:800">${chatLang === 'hi' ? 'आवाज़ सहायक प्रश्न (Voice Assistant)' : 'Voice Assistant Questions'}</h3>
                <p style="font-size:12px;color:var(--green-300)">${chatLang === 'hi' ? 'किसी भी बॉक्स पर टैप करें और आवाज़ में उत्तर सुनें 🔊' : 'Tap any box below to ask and hear the answer aloud 🔊'}</p>
              </div>
            </div>
            <button class="btn btn-ghost btn-xs" id="close-voice-modal" style="font-size:16px;padding:4px 8px;border-radius:var(--radius-full)">✕</button>
          </div>

          <div class="voice-prompt-list" style="display:grid;grid-template-columns:1fr;gap:10px;max-height:340px;overflow-y:auto">
            ${prompts.map(p => `
              <button class="voice-prompt-btn" data-query="${p.q}" style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:rgba(10,64,35,0.6);border:1px solid var(--border-medium);border-radius:var(--radius-lg);cursor:pointer;text-align:left;transition:all var(--transition-fast)">
                <span style="font-size:24px;line-height:1;margin-top:2px">${p.icon}</span>
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:700;color:var(--gold-300);margin-bottom:2px">${p.title}</div>
                  <div style="font-size:12px;color:var(--text-primary)">${p.text}</div>
                </div>
                <span style="color:var(--green-400);font-size:18px;margin-top:4px">🔊</span>
              </button>
            `).join('')}
          </div>

          <!-- Custom query input inside modal -->
          <div style="display:flex;gap:8px;padding-top:8px;border-top:1px solid var(--border-subtle)">
            <input class="chat-input" id="voice-modal-custom-input" placeholder="${chatLang === 'hi' ? 'अपना प्रश्न यहां लिखें और आवाज़ में सुनें...' : 'Type any custom question to hear aloud...'}" style="flex:1;border-radius:var(--radius-md)" />
            <button class="btn btn-primary btn-sm" id="voice-modal-submit-btn" style="border-radius:var(--radius-md);white-space:nowrap">🔊 ${chatLang === 'hi' ? 'पूछें' : 'Ask'}</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('#close-voice-modal')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      modal.querySelectorAll('.voice-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.query;
          modal.remove();
          sendChat(q, true);
        });
      });

      const customInput = modal.querySelector('#voice-modal-custom-input');
      const submitCustom = () => {
        const val = customInput?.value?.trim();
        if (val) {
          modal.remove();
          sendChat(val, true);
        }
      };
      modal.querySelector('#voice-modal-submit-btn')?.addEventListener('click', submitCustom);
      customInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitCustom();
      });
    }

    let activeMediaStream = null;

    // Stop listening for Speech-to-Text
    function stopListening() {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
      isListening = false;
      const micBtn = document.getElementById('chat-mic');
      const micIcon = document.getElementById('chat-mic-icon');
      const listeningBar = document.getElementById('chat-listening-bar');
      const inp = document.getElementById('chat-input');
      if (micBtn) micBtn.classList.remove('listening');
      if (micIcon) micIcon.textContent = '🎤';
      if (listeningBar) listeningBar.style.display = 'none';
      if (inp && (inp.placeholder.startsWith('Listening') || inp.placeholder.startsWith('सुन'))) {
        inp.placeholder = chatLang === 'hi' ? 'हिंदी में पूछें... (उदा. मेरा टोकन नंबर?)' : 'Ask in English... (e.g. My queue position?)';
      }
    }

    // Start listening directly using Web Speech API (SpeechRecognition)
    async function startListening() {
      stopSpeaking();

      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        showVoiceQuestionBoxes();
        return;
      }

      const micBtn = document.getElementById('chat-mic');
      const micIcon = document.getElementById('chat-mic-icon');
      const listeningBar = document.getElementById('chat-listening-bar');
      const statusText = document.getElementById('listening-status-text');
      const inp = document.getElementById('chat-input');

      // 1. Warm up microphone hardware & prompt permission
      try {
        if (!activeMediaStream && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          activeMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (err) {
        console.warn('Microphone permission request:', err);
        showToast('Microphone access prompt dismissed. Opening Voice Question Boxes 🎙️', 'info');
        showVoiceQuestionBoxes();
        return;
      }

      // 2. Initialize Speech Recognition engine
      try {
        if (recognition) {
          try { recognition.abort(); } catch (e) {}
        }
        recognition = new SpeechRecognitionClass();
      } catch (e) {
        showVoiceQuestionBoxes();
        return;
      }

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';

      let textCollected = '';
      let isFinalSubmitted = false;

      recognition.onstart = () => {
        isListening = true;
        isFinalSubmitted = false;
        if (micBtn) micBtn.classList.add('listening');
        if (micIcon) micIcon.textContent = '🛑';
        if (listeningBar) listeningBar.style.display = 'flex';
        if (statusText) statusText.textContent = chatLang === 'hi' ? '🎤 सुन रहे हैं... बोलिए (Listening... Speak now)' : '🎤 Listening... Speak now';
        if (inp) inp.placeholder = chatLang === 'hi' ? 'आपकी आवाज़ सुनी जा रही है...' : 'Listening to your voice...';
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const currentSaid = finalTranscript || interimTranscript;
        if (currentSaid && inp) {
          inp.value = currentSaid;
          textCollected = currentSaid;
        }

        // When user finishes phrase, auto-submit to chat and speak result
        if (finalTranscript.trim() && !isFinalSubmitted) {
          isFinalSubmitted = true;
          const finalQuery = finalTranscript.trim();
          stopListening();
          sendChat(finalQuery, true);
          if (inp) inp.value = '';
        }
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        stopListening();
        if (event.error === 'network') {
          showToast('Speech recognition connection error in browser. Opening Voice Question Boxes 🎙️', 'info');
          showVoiceQuestionBoxes();
        } else if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Opening Voice Question Boxes 🎙️', 'info');
          showVoiceQuestionBoxes();
        } else if (event.error === 'no-speech') {
          showToast(chatLang === 'hi' ? 'कोई आवाज़ नहीं मिली। कृपया दोबारा बोलें।' : 'No speech detected. Please speak closer to the mic.', 'info');
        }
      };

      recognition.onend = () => {
        if (!isFinalSubmitted && textCollected.trim() && inp && inp.value) {
          isFinalSubmitted = true;
          sendChat(textCollected.trim(), true);
          if (inp) inp.value = '';
        }
        stopListening();
      };

      try {
        recognition.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
        stopListening();
        showVoiceQuestionBoxes();
      }
    }

    function addMessage(text, isUser = false) {
      const msgs = document.getElementById('chat-messages');
      if (!msgs) return;
      const div = document.createElement('div');
      div.className = `chat-msg ${isUser ? 'chat-msg-user' : ''} animate-slideUp`;

      if (isUser) {
        div.innerHTML = `
          <div class="chat-bubble chat-bubble-user">${text}</div>
          <div class="chat-avatar" style="background:var(--gradient-gold);color:var(--green-950)">R</div>`;
      } else {
        div.innerHTML = `
          <div class="chat-avatar" style="background:var(--gradient-green)">🤖</div>
          <div class="chat-msg-bot-wrap">
            <div class="chat-bubble chat-bubble-bot">${text}</div>
            ${hasSpeechSynthesis ? `
              <div class="chat-bubble-footer">
                <button class="chat-speak-btn" type="button" title="Read response aloud">
                  <span class="speak-icon">🔊</span>
                  <span class="speak-label">Read aloud</span>
                </button>
              </div>` : ''}
          </div>`;

        if (hasSpeechSynthesis) {
          const speakBtn = div.querySelector('.chat-speak-btn');
          speakBtn?.addEventListener('click', () => speakText(text, speakBtn));
        }
      }

      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function addTyping() {
      const msgs = document.getElementById('chat-messages');
      if (!msgs) return null;
      const div = document.createElement('div');
      div.className = 'chat-msg';
      div.id = 'typing-indicator';
      div.innerHTML = `<div class="chat-avatar" style="background:var(--gradient-green)">🤖</div><div class="chat-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    async function sendChat(query, forceSpeak = false) {
      if (!query.trim() || chatTyping) return;
      chatTyping = true;
      stopSpeaking();
      addMessage(query, true);
      const typingEl = addTyping();
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      typingEl?.remove();
      const response = getAIResponse(query, chatLang);
      addMessage(response);
      chatTyping = false;

      // Auto-read response if enabled or if requested by voice assistant
      if ((autoRead || forceSpeak) && hasSpeechSynthesis) {
        const msgs = document.getElementById('chat-messages');
        const lastSpeakBtn = msgs ? msgs.querySelector('.chat-msg:last-child .chat-speak-btn') : null;
        speakText(response, lastSpeakBtn);
      }
    }

    // Voice Question Boxes button listener
    document.getElementById('chat-voice-boxes-btn')?.addEventListener('click', () => {
      showVoiceQuestionBoxes();
    });

    // Text chat submit listeners (retains exact text chat behavior)
    document.getElementById('chat-send')?.addEventListener('click', () => {
      const inp = document.getElementById('chat-input');
      if (!inp) return;
      sendChat(inp.value);
      inp.value = '';
    });
    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendChat(e.target.value);
        e.target.value = '';
      }
    });
    document.querySelectorAll('.quick-reply').forEach(btn => {
      btn.addEventListener('click', () => sendChat(btn.dataset.q));
    });

    // Auto-read toggle listener
    const autoReadBtn = document.getElementById('auto-read-toggle');
    autoReadBtn?.addEventListener('click', () => {
      autoRead = !autoRead;
      localStorage.setItem('ks_autoread', String(autoRead));
      autoReadBtn.classList.toggle('active', autoRead);
      const statusEl = document.getElementById('auto-read-status');
      if (statusEl) statusEl.textContent = autoRead ? 'ON' : 'OFF';
      if (!autoRead) {
        stopSpeaking();
      } else {
        showToast('Auto-read responses enabled 🔊', 'info');
      }
    });

    // Voice input mic click listener
    document.getElementById('chat-mic')?.addEventListener('click', () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    });

    // Cancel speech listening button
    document.getElementById('chat-cancel-speech')?.addEventListener('click', () => {
      stopListening();
    });

    // Attach speech playback listeners to initial bot messages
    document.querySelectorAll('#chat-messages .chat-speak-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text || '');
        speakText(text, btn);
      });
    });

    // Language switcher with UI sync and dynamic quick replies
    function setLanguage(newLang) {
      chatLang = newLang;
      stopSpeaking();

      const btnHi = document.getElementById('lang-hi');
      const btnEn = document.getElementById('lang-en');
      if (btnHi && btnEn) {
        if (chatLang === 'hi') {
          btnHi.className = 'btn btn-xs btn-primary';
          btnEn.className = 'btn btn-xs btn-ghost';
        } else {
          btnHi.className = 'btn btn-xs btn-ghost';
          btnEn.className = 'btn btn-xs btn-primary';
        }
      }

      const inp = document.getElementById('chat-input');
      if (inp && !isListening) {
        inp.placeholder = chatLang === 'hi' ? 'हिंदी में पूछें... (उदा. मेरा टोकन नंबर?)' : 'Ask in English... (e.g. My queue position?)';
      }

      // Update quick reply chips dynamically
      const qrContainer = document.getElementById('chat-quick-replies');
      if (qrContainer) {
        const replies = chatLang === 'hi'
          ? ['मेरा टोकन नंबर?', 'भुगतान हुआ क्या?', 'MSP दर बताओ', 'बुकिंग विवरण']
          : ['My queue position?', 'Payment received?', 'MSP rates today', 'My booking details'];
        qrContainer.innerHTML = replies.map(q => `<button class="btn btn-ghost btn-sm quick-reply" data-q="${q}" style="font-size:11px;padding:4px 10px;border:1px solid var(--border-subtle);border-radius:var(--radius-full)">${q}</button>`).join('');
        qrContainer.querySelectorAll('.quick-reply').forEach(btn => {
          btn.addEventListener('click', () => sendChat(btn.dataset.q));
        });
      }

      // Update initial greeting message in the chat DOM
      const msgs = document.getElementById('chat-messages');
      const firstBotBubble = msgs ? msgs.querySelector('.chat-msg:first-child .chat-bubble-bot') : null;
      const firstSpeakBtn = msgs ? msgs.querySelector('.chat-msg:first-child .chat-speak-btn') : null;
      if (firstBotBubble) {
        if (chatLang === 'hi') {
          firstBotBubble.textContent = '🙏 नमस्ते रामेश जी! मैं आपका KisanSetu AI सहायक हूं। आप हिंदी में पूछ सकते हैं — टोकन नंबर, भुगतान, MSP दर, या कुछ भी।';
          if (firstSpeakBtn) firstSpeakBtn.dataset.text = encodeURIComponent(firstBotBubble.textContent);
        } else {
          firstBotBubble.textContent = "🙏 Hello Ramesh Ji! I'm your KisanSetu AI assistant. Ask me about your token, payment status, MSP rates, or anything about your booking.";
          if (firstSpeakBtn) firstSpeakBtn.dataset.text = encodeURIComponent(firstBotBubble.textContent);
        }
      }

      showToast(chatLang === 'hi' ? '🇮🇳 हिंदी भाषा चुनी गई — AI आवाज़ हिंदी में बोलेगा 🌾' : '🇬🇧 English mode active — AI voice will speak in English 🌾', 'info');
    }

    document.getElementById('lang-hi')?.addEventListener('click', () => setLanguage('hi'));
    document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));

    // Stop active speech and listening if user navigates away
    window.addEventListener('hashchange', () => {
      stopSpeaking();
      stopListening();
    }, { once: true });
  }, 0);

  return page;
}

// ============================================================
// Center Finder
// ============================================================
export function renderCenterFinder(user) {
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">🗺️ Find Procurement Centres</h1>
        <div class="section-subtitle">AI-powered time minimizer — Find the best centre for your crop</div>
      </div>
    </div>

    <!-- Search Form -->
    <div class="card mb-24">
      <div class="card-body">
        <div style="font-size:14px;font-weight:600;margin-bottom:16px">🤖 AI Recommendation Engine</div>
        <div class="grid-4" style="gap:16px;grid-template-columns:1fr 1fr 1fr auto">
          <div class="form-group">
            <label class="form-label">Crop Type *</label>
            <select class="form-select" id="crop-select">
              ${CROPS.map(c => `<option value="${c.id}">${c.icon} ${c.nameEn} (${c.nameHi})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Quantity (Quintals) *</label>
            <input class="form-input" type="number" id="qty-input" placeholder="e.g. 80" value="80" min="1" />
          </div>
          <div class="form-group">
            <label class="form-label">Max Radius (km)</label>
            <select class="form-select" id="radius-select">
              <option value="30">30 km</option>
              <option value="60" selected>60 km</option>
              <option value="100">100 km</option>
            </select>
          </div>
          <div class="form-group" style="justify-content:flex-end">
            <label class="form-label" style="visibility:hidden">Search</label>
            <button class="btn btn-primary" id="find-btn" style="border-radius:var(--radius-md)">🔍 Find Centres</button>
          </div>
        </div>
        <div class="alert alert-info mt-12" style="font-size:12px">
          💡 AI analyses <strong>travel time + live queue wait + processing time</strong> — not just distance. Nearest ≠ Fastest!
        </div>
      </div>
    </div>

    <!-- Simulated Map -->
    <div class="map-container mb-24" id="map-container">
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,#021a0e,#030d07,#042d18)"></div>
      <!-- Grid overlay -->
      <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(34,196,104,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,196,104,0.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none"></div>
      <!-- Roads -->
      <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.3" viewBox="0 0 800 400">
        <line x1="0" y1="200" x2="800" y2="200" stroke="#137a42" stroke-width="2" stroke-dasharray="10,5"/>
        <line x1="400" y1="0" x2="400" y2="400" stroke="#137a42" stroke-width="2" stroke-dasharray="10,5"/>
        <line x1="0" y1="0" x2="800" y2="400" stroke="#137a42" stroke-width="1" stroke-dasharray="5,10"/>
      </svg>
      <!-- Center Markers -->
      <div id="center-markers">
        ${MOCK_CENTERS.map((c,i) => {
          const x = [35, 60, 72][i]; const y = [50, 40, 65][i];
          const colors = { LOW:'var(--success)', MODERATE:'var(--warning)', HIGH:'var(--error)', CRITICAL:'#dc2626' };
          const col = colors[c.congestionLevel] || 'var(--success)';
          return `
            <div class="map-dot" style="left:${x}%;top:${y}%;background:${col};color:${col};cursor:pointer" 
                 data-center-id="${c.id}" title="${c.centerName}">
            </div>
            <div style="position:absolute;left:calc(${x}% + 16px);top:calc(${y}% - 20px);background:rgba(2,26,14,0.9);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:4px 8px;font-size:10px;white-space:nowrap;pointer-events:none">
              ${c.centerName.split(' ')[0]} &bull; Wait: ${c.estimatedWaitMins}min
            </div>`;
        }).join('')}
      </div>
      <!-- Legend -->
      <div style="position:absolute;bottom:12px;left:12px;display:flex;gap:12px;background:rgba(2,26,14,0.9);padding:8px 12px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle)">
        <div class="flex items-center gap-4"><span class="congestion-dot congestion-low"></span><span style="font-size:10px">Low</span></div>
        <div class="flex items-center gap-4"><span class="congestion-dot congestion-moderate"></span><span style="font-size:10px">Moderate</span></div>
        <div class="flex items-center gap-4"><span class="congestion-dot congestion-high"></span><span style="font-size:10px">High</span></div>
        <div class="flex items-center gap-4"><span class="congestion-dot congestion-critical"></span><span style="font-size:10px">Critical</span></div>
      </div>
    </div>

    <!-- Results -->
    <div id="centers-results">
      <div class="section-header mb-16">
        <div class="section-title">📊 AI-Ranked Centres</div>
        <span class="badge badge-green">Sorted by Total Farmer Time</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        ${MOCK_CENTERS.sort((a,b) => a.totalFarmerTimeMins - b.totalFarmerTimeMins).map((c, idx) => `
          <div class="center-card ${c.recommended ? 'recommended' : ''}" data-center-id="${c.id}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                  <div style="width:28px;height:28px;border-radius:50%;background:${idx===0?'var(--gradient-gold)':'var(--bg-card)'};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${idx===0?'var(--green-950)':'var(--slate-400)'}">
                    ${idx + 1}
                  </div>
                  <div>
                    <div style="font-size:15px;font-weight:700">${c.centerName}</div>
                    <div style="font-size:12px;color:var(--slate-400)">${c.address}</div>
                  </div>
                </div>

                <!-- Time Breakdown -->
                <div class="center-time-breakdown">
                  <span class="time-pill time-pill-travel">🚗 ${c.travelTimeMins} min travel</span>
                  <span class="time-pill time-pill-queue">⏳ ${c.estimatedWaitMins} min queue</span>
                  <span class="time-pill time-pill-process">⚙️ ${c.processingTimeMins} min process</span>
                  <span class="time-pill time-pill-total" style="font-weight:700">= ${c.totalFarmerTimeMins} min total</span>
                </div>

                <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap">
                  <span style="font-size:12px;color:var(--slate-400)">📍 ${c.distanceKm} km away</span>
                  <span style="font-size:12px;color:var(--slate-400)">🚗 ${c.currentQueueLength} vehicles in queue</span>
                  <span style="font-size:12px;color:var(--slate-400)">⚖️ ${c.activeWeighbridges} weighbridges active</span>
                  ${congestionBadge(c.congestionLevel)}
                </div>
              </div>
              <div style="text-align:right">
                ${c.timeSavedMins > 0 ? `<div style="font-size:12px;color:var(--success);margin-bottom:8px">⬆ Saves <strong>${c.timeSavedMins} min</strong></div>` : 
                  `<div style="font-size:12px;color:var(--error);margin-bottom:8px">⬇ ${Math.abs(c.timeSavedMins)} min slower</div>`}
                <button class="btn btn-primary btn-sm book-center-btn" data-center-id="${c.id}" data-center-name="${c.centerName}" style="border-radius:var(--radius-md)">Book Slot</button>
              </div>
            </div>

            <!-- Capacity bar -->
            <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-subtle)">
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--slate-500);margin-bottom:6px">
                <span>Capacity Utilization</span>
                <span>${c.currentOccupancy} / ${c.totalCapacityPerDay} farmers today</span>
              </div>
              <div class="progress">
                <div class="progress-bar ${c.currentOccupancy/c.totalCapacityPerDay > 0.8 ? 'progress-gold' : 'progress-green'}" 
                     style="width:${Math.round(c.currentOccupancy/c.totalCapacityPerDay*100)}%"></div>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'centers', content);

  setTimeout(() => {
    document.getElementById('find-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('find-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span> AI Analysing...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      btn.innerHTML = '🔍 Find Centres';
      btn.disabled = false;
      showToast('✅ AI analysis complete — centres ranked by total farmer time', 'success');
    });

    document.querySelectorAll('.book-center-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const centerId = btn.dataset.centerId;
        navigate(`#/farmer/book?centerId=${centerId}`);
      });
    });
  }, 0);

  return page;
}

// ============================================================
// Book Slot Page
// ============================================================
export function renderBookSlot(user) {
  const preselectedCenter = MOCK_CENTERS.find(c => c.recommended) || MOCK_CENTERS[0];
  
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">📋 Book Procurement Slot</h1>
        <div class="section-subtitle">Secure your MSP procurement appointment</div>
      </div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">
      <div>
        <div class="card mb-16">
          <div class="card-header"><div style="font-weight:700">Step 1: Select Centre</div></div>
          <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:10px" id="center-selector">
              ${MOCK_CENTERS.map(c => `
                <div class="center-card ${c.recommended ? 'recommended' : ''}" data-center-id="${c.id}" style="cursor:pointer;padding:14px" id="center-opt-${c.id}">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <div style="font-size:13px;font-weight:700">${c.centerName}</div>
                      <div style="font-size:11px;color:var(--slate-400);margin-top:2px">${c.distanceKm}km &bull; ${c.totalFarmerTimeMins}min total time</div>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center">
                      ${congestionBadge(c.congestionLevel)}
                      <div class="select-radio" data-for="${c.id}" style="width:18px;height:18px;border-radius:50%;border:2px solid var(--border-medium);display:flex;align-items:center;justify-content:center;flex-shrink:0"></div>
                    </div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div style="font-weight:700">Step 2: Crop & Quantity</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:14px">
            <div class="form-group">
              <label class="form-label">Crop Type *</label>
              <select class="form-select" id="book-crop">
                ${CROPS.map(c => `<option value="${c.id}" data-msp="${c.msp}">${c.icon} ${c.nameEn} (${c.nameHi}) — MSP ₹${c.msp}/qtl</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Quantity (Quintals) *</label>
              <input class="form-input" type="number" id="book-qty" value="80" min="1" max="500" />
            </div>
            <div id="msp-preview" style="background:rgba(34,196,104,0.08);border:1px solid rgba(34,196,104,0.2);border-radius:var(--radius-md);padding:14px">
              <div style="font-size:12px;color:var(--slate-400)">Estimated MSP Value</div>
              <div style="font-size:24px;font-weight:800;color:var(--gold-400);margin-top:4px" id="msp-value">₹1,82,000</div>
              <div style="font-size:11px;color:var(--slate-500);margin-top:2px">80 qtl × ₹2,275 = ₹1,82,000</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card mb-16">
          <div class="card-header"><div style="font-weight:700">Step 3: Select Date & Slot</div></div>
          <div class="card-body">
            <div class="form-group mb-14">
              <label class="form-label">Preferred Date *</label>
              <input class="form-input" type="date" id="book-date" min="${new Date().toISOString().split('T')[0]}" value="2026-09-10" />
            </div>
            <div class="form-group">
              <label class="form-label">Time Slot *</label>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="slot-grid">
                ${[['08:00','10:00','8:00 AM – 10:00 AM',8],['10:00','12:00','10:00 AM – 12:00 PM',3],['12:00','14:00','12:00 PM – 2:00 PM',15],['14:00','16:00','2:00 PM – 4:00 PM',5]].map(([s,e,label,cnt]) => `
                  <div class="slot-option" data-start="${s}" data-end="${e}" style="padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;text-align:center">
                    <div style="font-size:12px;font-weight:600">${label}</div>
                    <div style="font-size:10px;color:var(--slate-400);margin-top:3px">${cnt} slots left</div>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="card" id="booking-summary" style="border-color:rgba(34,196,104,0.3)">
          <div class="card-header" style="background:rgba(34,196,104,0.05)">
            <div style="font-weight:700">📋 Booking Summary</div>
          </div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--slate-400)">Centre</span>
              <span style="font-weight:600" id="sum-center">${preselectedCenter.centerName}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--slate-400)">Crop</span>
              <span style="font-weight:600" id="sum-crop">Wheat (गेहूं)</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--slate-400)">Quantity</span>
              <span style="font-weight:600" id="sum-qty">80 quintals</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--slate-400)">Date</span>
              <span style="font-weight:600" id="sum-date">10 Sep 2026</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--slate-400)">Slot</span>
              <span style="font-weight:600" id="sum-slot">10:00 AM – 12:00 PM</span>
            </div>
            <div style="height:1px;background:var(--border-subtle);margin:8px 0"></div>
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700">
              <span>Estimated MSP Value</span>
              <span style="color:var(--gold-400)" id="sum-value">₹1,82,000</span>
            </div>
            <div class="alert alert-warning" style="font-size:11px;margin-top:8px">
              ⚠️ Arrive 30 min before your slot. Your QR pass will be generated after booking.
            </div>
            <button class="btn btn-gold w-full mt-8" id="confirm-booking-btn" style="border-radius:var(--radius-md)">
              ✅ Confirm Booking & Get QR Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'bookings', content);

  setTimeout(() => {
    // Center selection
    let selectedCenter = preselectedCenter;
    document.querySelectorAll('#center-selector .center-card').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('#center-selector .center-card').forEach(e => {
          e.style.borderColor = ''; e.querySelector('.select-radio').innerHTML = '';
        });
        el.style.borderColor = 'var(--green-500)';
        el.querySelector('.select-radio').innerHTML = '✓';
        el.querySelector('.select-radio').style.background = 'var(--green-500)';
        el.querySelector('.select-radio').style.color = 'white';
        el.querySelector('.select-radio').style.fontSize = '10px';
        selectedCenter = MOCK_CENTERS.find(c => c.id === parseInt(el.dataset.centerId));
        document.getElementById('sum-center').textContent = selectedCenter.centerName;
      });
    });
    // pre-select first recommended
    const firstCard = document.querySelector('#center-selector .center-card.recommended') || document.querySelector('#center-selector .center-card');
    firstCard?.click();

    // Slot selection
    let selectedSlot = { start: '10:00', end: '12:00', label: '10:00 AM – 12:00 PM' };
    document.querySelectorAll('.slot-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.slot-option').forEach(s => { s.style.borderColor = ''; s.style.background = ''; });
        el.style.borderColor = 'var(--green-500)'; el.style.background = 'rgba(34,196,104,0.1)';
        selectedSlot = { start: el.dataset.start, end: el.dataset.end };
        document.getElementById('sum-slot').textContent = el.querySelector('div').textContent;
      });
    });
    document.querySelectorAll('.slot-option')[1]?.click();

    // MSP calculation
    function updateMSP() {
      const cropOpt = document.getElementById('book-crop');
      const qty = parseFloat(document.getElementById('book-qty')?.value) || 0;
      const msp = parseFloat(cropOpt?.options[cropOpt.selectedIndex]?.dataset.msp) || 2275;
      const total = qty * msp;
      document.getElementById('msp-value').textContent = formatCurrency(total);
      document.getElementById('sum-qty').textContent = `${qty} quintals`;
      document.getElementById('sum-value').textContent = formatCurrency(total);
      document.querySelector('#msp-preview div:last-child').textContent = `${qty} qtl × ₹${msp} = ${formatCurrency(total)}`;
      const cropName = cropOpt?.options[cropOpt.selectedIndex]?.text.split('—')[0].trim() || 'Wheat';
      document.getElementById('sum-crop').textContent = cropName;
    }
    document.getElementById('book-qty')?.addEventListener('input', updateMSP);
    document.getElementById('book-crop')?.addEventListener('change', updateMSP);

    // Confirm booking
    document.getElementById('confirm-booking-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('confirm-booking-btn');
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Generating QR Pass...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1500));
      showToast('🎉 Booking confirmed! QR Pass generated.', 'success');
      navigate('#/farmer/bookings');
    });
  }, 0);

  return page;
}

// ============================================================
// My Bookings
// ============================================================
export function renderMyBookings(user) {
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">📋 My Bookings</h1>
        <div class="section-subtitle">All your procurement appointments</div>
      </div>
      <button class="btn btn-gold btn-sm" onclick="navigate('#/farmer/book')" style="border-radius:var(--radius-md)">+ New Booking</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:20px">
      ${MOCK_BOOKINGS.map(b => {
        const stageIdx = BOOKING_STAGES.findIndex(s => s.key === b.status);
        const progressPct = Math.round(((stageIdx + 1) / BOOKING_STAGES.length) * 100);
        const isActive = !['PAYMENT_COMPLETED','CANCELLED','REJECTED'].includes(b.status);
        return `
          <div class="card ${isActive ? 'booking-active-card' : ''}" style="${isActive ? 'border-color:rgba(34,196,104,0.3)' : ''}">
            <div class="card-header">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                <div>
                  <div style="font-size:15px;font-weight:700">${b.bookingReference}</div>
                  <div style="font-size:12px;color:var(--slate-400);margin-top:2px">${b.centerName}</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  ${statusBadge(b.status)}
                  ${isActive ? '<span class="badge badge-green" style="animation:pulse-green 2s infinite">● ACTIVE</span>' : ''}
                </div>
              </div>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-bottom:16px">
                <div><div style="font-size:11px;color:var(--slate-500)">Crop</div><div style="font-size:13px;font-weight:600;margin-top:2px">${b.cropName}</div></div>
                <div><div style="font-size:11px;color:var(--slate-500)">Quantity</div><div style="font-size:13px;font-weight:600;margin-top:2px">${b.estimatedQuantityQuintals} quintals</div></div>
                <div><div style="font-size:11px;color:var(--slate-500)">Date</div><div style="font-size:13px;font-weight:600;margin-top:2px">${formatDate(b.slotDate)}</div></div>
                <div><div style="font-size:11px;color:var(--slate-500)">Slot</div><div style="font-size:13px;font-weight:600;margin-top:2px">${formatTime(b.slotStartTime)}</div></div>
                ${b.tokenNumber ? `<div><div style="font-size:11px;color:var(--slate-500)">Token</div><div style="font-size:13px;font-weight:700;margin-top:2px;color:var(--gold-400)">${b.tokenNumber}</div></div>` : ''}
                <div><div style="font-size:11px;color:var(--slate-500)">MSP Value</div><div style="font-size:13px;font-weight:700;margin-top:2px;color:var(--gold-400)">${formatCurrency(b.totalMspValue)}</div></div>
              </div>

              ${isActive ? `
                <div class="progress mb-8" style="height:8px">
                  <div class="progress-bar progress-green" style="width:${progressPct}%"></div>
                </div>
                <div style="font-size:11px;color:var(--slate-400)">Journey Progress: ${progressPct}% — ${b.status.replace('_',' ')}</div>
              ` : `
                ${b.netWeightQuintals ? `
                  <div style="background:rgba(34,196,104,0.08);border:1px solid rgba(34,196,104,0.2);border-radius:var(--radius-md);padding:12px;margin-bottom:12px">
                    <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">Procurement Details</div>
                    <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:12px">
                      <span>Net Weight: <strong>${b.netWeightQuintals} qtl</strong></span>
                      <span>Grade: <strong>${b.qualityGrade}</strong></span>
                      <span>Moisture: <strong>${b.moisture}%</strong></span>
                      <span>Payment: <strong style="color:var(--gold-400)">${formatCurrency(b.totalMspValue)}</strong></span>
                    </div>
                  </div>` : ''}
              `}

              <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
                <button class="btn btn-outline btn-sm qr-view-btn" data-ref="${b.bookingReference}" data-payload="${b.qrPayload}" style="border-radius:var(--radius-md)">📱 View QR Pass</button>
                ${isActive ? `
                  <button class="btn btn-ghost btn-sm" style="border-radius:var(--radius-md)">📅 Reschedule</button>
                  <button class="btn btn-danger btn-sm" style="border-radius:var(--radius-md)">🚫 Cancel</button>
                ` : ''}
                ${b.status === 'PAYMENT_COMPLETED' ? `<a href="#/farmer/payment" class="btn btn-ghost btn-sm" style="border-radius:var(--radius-md)">💰 Payment Details</a>` : ''}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- QR Modal -->
    <div class="modal-overlay hidden" id="qr-modal">
      <div class="modal" style="max-width:420px">
        <div class="modal-header">
          <div class="modal-title">📱 QR Pass</div>
          <button class="modal-close" id="close-qr">✕</button>
        </div>
        <div class="modal-body">
          <div class="qr-pass">
            <div style="font-size:13px;font-weight:700;margin-bottom:4px" id="qr-ref-display"></div>
            <div style="font-size:11px;color:var(--slate-400)" id="qr-center-display"></div>
            <div class="qr-code-container" id="qr-code-container"></div>
            <div style="font-size:10px;color:var(--slate-500);word-break:break-all;padding:0 8px" id="qr-payload-display"></div>
            <div class="alert alert-success mt-16" style="font-size:11px;text-align:left">
              ✅ HMAC-SHA256 signed. Works <strong>offline</strong> at gate.
            </div>
            <button class="btn btn-primary mt-16 w-full" style="border-radius:var(--radius-md)" onclick="window.print()">⬇ Download / Print</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const page = renderAppLayout(user, 'bookings', content);

  setTimeout(() => {
    document.querySelectorAll('.qr-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ref = btn.dataset.ref;
        const payload = btn.dataset.payload;
        const booking = MOCK_BOOKINGS.find(b => b.bookingReference === ref);
        document.getElementById('qr-ref-display').textContent = ref;
        document.getElementById('qr-center-display').textContent = booking?.centerName || '';
        document.getElementById('qr-payload-display').textContent = payload;
        document.getElementById('qr-code-container').innerHTML = generateQRSVG(payload || ref);
        document.getElementById('qr-modal').classList.remove('hidden');
      });
    });
    document.getElementById('close-qr')?.addEventListener('click', () => {
      document.getElementById('qr-modal').classList.add('hidden');
    });
    document.getElementById('qr-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'qr-modal') document.getElementById('qr-modal').classList.add('hidden');
    });
  }, 0);

  return page;
}

// ============================================================
// Payment Status
// ============================================================
export function renderPaymentStatus(user) {
  const p = MOCK_PAYMENT;
  const content = `
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">💰 Payment Status</h1>
        <div class="section-subtitle">DBT / PFMS disbursement tracking</div>
      </div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">
      <div>
        <div class="card mb-20">
          <div class="card-body">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
              <div>
                <div style="font-size:12px;color:var(--slate-400)">Booking Reference</div>
                <div style="font-size:16px;font-weight:700;margin-top:2px">${p.bookingRef}</div>
              </div>
              <span class="badge badge-green">✅ TRANSFERRED</span>
            </div>
            <div style="font-size:40px;font-weight:900;color:var(--gold-400);margin-bottom:4px">${formatCurrency(p.netPayable)}</div>
            <div style="font-size:13px;color:var(--slate-400)">For ${p.netQuintals} quintals of ${p.cropName} @ ₹${p.mspRate}/qtl MSP</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px;padding-top:20px;border-top:1px solid var(--border-subtle)">
              <div><div style="font-size:11px;color:var(--slate-500)">Bank</div><div style="font-size:13px;font-weight:600;margin-top:2px">${p.bankName}</div></div>
              <div><div style="font-size:11px;color:var(--slate-500)">Account</div><div style="font-size:13px;font-weight:600;margin-top:2px">${p.accountNo}</div></div>
              <div><div style="font-size:11px;color:var(--slate-500)">IFSC</div><div style="font-size:13px;font-weight:600;margin-top:2px">${p.ifsc}</div></div>
              <div><div style="font-size:11px;color:var(--slate-500)">UTR Number</div><div style="font-size:12px;font-weight:600;margin-top:2px;color:var(--green-400)">${p.utrNumber}</div></div>
            </div>

            <div style="background:rgba(34,196,104,0.08);border:1px solid rgba(34,196,104,0.2);border-radius:var(--radius-md);padding:14px;margin-top:16px">
              <div style="font-size:12px;color:var(--slate-400);margin-bottom:6px">Payment Timeline</div>
              <div style="font-size:12px;display:flex;justify-content:space-between">
                <span>Initiated</span><span style="font-weight:600">${formatDate(p.initiatedAt)}</span>
              </div>
              <div style="font-size:12px;display:flex;justify-content:space-between;margin-top:4px">
                <span>Completed</span><span style="font-weight:600;color:var(--success)">${formatDate(p.completedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div style="font-weight:700">📊 Procurement Breakdown</div></div>
          <div class="card-body">
            ${[
              ['Gross Weight', '6,820 kg'],
              ['Tare Weight', '4,600 kg'],
              ['Net Weight', `${p.netQuintals} qtl (${p.netQuintals * 100} kg)`],
              ['MSP Rate', `₹${p.mspRate}/qtl`],
              ['Gross Amount', formatCurrency(p.grossAmount)],
              ['Deductions', '₹0'],
              ['Net Payable', formatCurrency(p.netPayable)],
            ].map(([k,v]) => `
              <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border-subtle);font-size:13px">
                <span style="color:var(--slate-400)">${k}</span>
                <span style="font-weight:${k === 'Net Payable' ? '700' : '500'};color:${k === 'Net Payable' ? 'var(--gold-400)' : 'inherit'}">${v}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div>
        <div class="section-title mb-16">🏦 DBT / PFMS Journey</div>
        <div class="card">
          <div class="card-body">
            <div class="payment-steps">
              ${p.steps.map((step,i) => `
                <div class="payment-step ${step.status === 'done' ? 'done' : step.status === 'active' ? 'active' : ''}">
                  <div class="payment-step-icon payment-step-icon-${step.status === 'done' ? 'done' : step.status === 'active' ? 'active' : 'pending'}">
                    ${step.status === 'done' ? '✓' : step.status === 'active' ? '●' : (i + 1)}
                  </div>
                  <div class="payment-step-info">
                    <div class="payment-step-title">${step.label}</div>
                    <div class="payment-step-desc devanagari" style="font-size:11px;color:var(--green-400)">${step.labelHi}</div>
                    ${step.time ? `<div class="payment-step-time">✅ ${step.time}</div>` : ''}
                  </div>
                </div>`).join('')}
            </div>

            <div class="alert alert-success mt-16">
              🎉 Payment of ${formatCurrency(p.netPayable)} successfully credited to your bank account on ${formatDate(p.completedAt)}. 
              UTR: <strong>${p.utrNumber}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderAppLayout(user, 'payment', content);
}
