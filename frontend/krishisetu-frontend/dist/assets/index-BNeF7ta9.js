(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(t){if(t.ep)return;t.ep=!0;const s=n(t);fetch(t.href,s)}})();const J="ks_user",ge="ks_token",F={getUser(){try{return JSON.parse(localStorage.getItem(J)||"null")}catch{return null}},setUser(a,i){localStorage.setItem(J,JSON.stringify(a)),i&&localStorage.setItem(ge,i)},clear(){localStorage.removeItem(J),localStorage.removeItem(ge)},isLoggedIn(){return!!this.getUser()},getRole(){var a;return((a=this.getUser())==null?void 0:a.role)||null}};let H=null;function Ie(){return H||(H=document.createElement("div"),H.className="toast-container",H.id="toast-container",document.body.appendChild(H)),H}function k(a,i="success",n=3500){const e=Ie(),t={success:"✅",error:"❌",info:"ℹ️",warning:"⚠️"},s=document.createElement("div");s.className=`toast toast-${i}`,s.innerHTML=`<span>${t[i]||"•"}</span><span>${a}</span>`,e.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateX(20px)",s.style.transition="all 0.3s ease",setTimeout(()=>s.remove(),300)},n)}const K={};function M(a,i){K[a]=i}function S(a){window.location.hash=a}typeof window<"u"&&(window.navigate=S);function Se(a){function i(){const n=window.location.hash||"#/",e=n.split("?")[0]||"#/",t=K[e]||K[n]||K["#/404"]||(()=>'<div class="empty-state"><div class="empty-icon">🌾</div><h2>Page not found</h2></div>'),s=F.getUser();if(["#/farmer","#/officer","#/admin"].some(p=>e.startsWith(p))&&!s){S("#/login");return}a.innerHTML="";const d=t(s);typeof d=="string"?a.innerHTML=d:d instanceof HTMLElement&&a.appendChild(d),window.dispatchEvent(new CustomEvent("ks:pagerendered",{detail:{hash:n,path:e}})),window.scrollTo(0,0)}window.addEventListener("hashchange",i),i()}function he(a){const i={FARMER:"Farmer",OFFICER:"Officer",ADMIN:"Admin"},n={FARMER:"var(--green-400)",OFFICER:"var(--gold-400)",ADMIN:"#a78bfa"},e=a?`#/${a.role.toLowerCase()}/dashboard`:"#/";return`
  <nav class="navbar">
    <a class="navbar-brand" href="${e}">
      <div class="navbar-logo">🌾</div>
      <div>
        <div class="navbar-title">Kisan<span>Setu</span></div>
      </div>
    </a>
    <div class="navbar-nav" id="navbar-nav">
      ${a?`
        <a href="${e}" id="nav-dashboard">Dashboard</a>
        ${a.role==="FARMER"?'<a href="#/farmer/centers" id="nav-centers">Find Centres</a><a href="#/farmer/bookings" id="nav-bookings">My Bookings</a>':""}
        ${a.role==="OFFICER"?'<a href="#/officer/queue" id="nav-queue">Queue Board</a><a href="#/officer/checkin" id="nav-checkin">Gate Check-In</a>':""}
        ${a.role==="ADMIN"?'<a href="#/admin/analytics" id="nav-analytics">Analytics</a><a href="#/admin/map" id="nav-map">Map View</a>':""}
      `:`
        <a href="#/">Home</a>
        <a href="#/login">Login</a>
      `}
    </div>
    ${a?`
      <div class="navbar-user" id="user-menu-btn">
        <div class="navbar-avatar">${a.name.charAt(0)}</div>
        <div>
          <div class="navbar-username">${a.name.split(" ")[0]}</div>
          <div class="navbar-role" style="color:${n[a.role]||"var(--green-400)"}">${i[a.role]||a.role}</div>
        </div>
        <span style="color:var(--slate-500);font-size:10px">▼</span>
      </div>
    `:'<a href="#/login" class="btn btn-primary btn-sm">Login / Register</a>'}
  </nav>`}function Me(a,i){if(!a)return"";const n=[{href:"#/farmer/dashboard",icon:"🏠",label:"Dashboard",key:"dashboard"},{href:"#/farmer/centers",icon:"🗺️",label:"Find Centres",key:"centers"},{href:"#/farmer/bookings",icon:"📋",label:"My Bookings",key:"bookings"},{href:"#/farmer/payment",icon:"💰",label:"Payment Status",key:"payment"}],e=[{href:"#/officer/dashboard",icon:"🏠",label:"Dashboard",key:"dashboard"},{href:"#/officer/checkin",icon:"📱",label:"Gate Check-In",key:"checkin"},{href:"#/officer/queue",icon:"📊",label:"Queue Board",key:"queue"}],t=[{href:"#/admin/dashboard",icon:"🏠",label:"Overview",key:"dashboard"},{href:"#/admin/analytics",icon:"📈",label:"Analytics",key:"analytics"},{href:"#/admin/map",icon:"🗺️",label:"Congestion Map",key:"map"}];return`
  <aside class="sidebar">
    <div class="sidebar-section"><span class="sidebar-label">Navigation</span></div>
    ${(a.role==="FARMER"?n:a.role==="OFFICER"?e:t).map(d=>`
    <a href="${d.href}" class="sidebar-item ${i===d.key?"active":""}">
      <span class="icon">${d.icon}</span>
      <span>${d.label}</span>
    </a>`).join("")}
    <div style="margin-top:auto;padding-top:24px;border-top:1px solid var(--border-subtle)">
      <a id="logout-btn" class="sidebar-item" style="cursor:pointer">
        <span class="icon">🚪</span><span>Logout</span>
      </a>
    </div>
  </aside>`}function C(a,i,n){return`
    ${he(a)}
    <div class="app-layout">
      ${Me(a,i)}
      <main class="app-main animate-fadeIn">
        ${n}
      </main>
    </div>`}window.addEventListener("ks:pagerendered",()=>{const a=document.getElementById("logout-btn");a&&a.addEventListener("click",()=>{F.clear(),k("Logged out successfully","info"),S("#/login")});const i=window.location.hash;document.querySelectorAll(".navbar-nav a").forEach(n=>{n.classList.toggle("active",n.getAttribute("href")===i)})});function Ae(a){let t=0;for(let r=0;r<a.length;r++)t=t*31+a.charCodeAt(r)&4294967295;let s="";for(let r=0;r<21;r++)for(let d=0;d<21;d++){const p=r<8&&d<8||r<8&&d>=13||r>=13&&d<8;let y=!1;if(p){const h=r<8?r:r-13,o=d<8?d:d-13;if(r<8&&d>=13){const g=r,f=d-13;y=g===0||g===6||f===0||f===6||g>=2&&g<=4&&f>=2&&f<=4}else y=h===0||h===6||o===0||o===6||h>=2&&h<=4&&o>=2&&o<=4}else{const h=r*21+d;y=((t^h*2654435761)>>>0)%3!==0}y&&(s+=`<rect x="${d*7}" y="${r*7}" width="7" height="7" fill="#1a3a20"/>`)}return`<svg xmlns="http://www.w3.org/2000/svg" width="147" height="147" viewBox="0 0 147 147">${s}</svg>`}function A(a){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(a)}function W(a){return a?new Date(a).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"}function X(a){if(!a)return"—";const[i,n]=a.split(":"),e=parseInt(i);return`${e>12?e-12:e}:${n} ${e>=12?"PM":"AM"}`}function V(a){const i={LOW:["badge-green","🟢 Low"],MODERATE:["badge-gold","🟡 Moderate"],HIGH:["badge-red","🔴 High"],CRITICAL:["badge-red","🔴 Critical"]},[n,e]=i[a]||["badge-gray",a];return`<span class="badge ${n}">${e}</span>`}function ee(a){const i={BOOKED:["badge-blue","📋 Booked"],ARRIVED:["badge-green","🚜 Arrived"],GATE_VERIFIED:["badge-green","✅ Verified"],WAITING:["badge-gold","⏳ Waiting"],WEIGHING:["badge-purple","⚖️ Weighing"],QUALITY_CHECK:["badge-purple","🔬 Quality"],ACCEPTED:["badge-green","✔️ Accepted"],UNLOADING:["badge-blue","🏪 Unloading"],DOCUMENTATION:["badge-blue","📄 Docs"],PAYMENT_PROCESSING:["badge-gold","🏦 Payment"],PAYMENT_COMPLETED:["badge-green","💰 Paid"],REJECTED:["badge-red","❌ Rejected"],CANCELLED:["badge-gray","🚫 Cancelled"],RESCHEDULED:["badge-gold","📅 Rescheduled"]},[n,e]=i[a]||["badge-gray",a];return`<span class="badge ${n}">${e}</span>`}function xe(){const a=`
    ${he(null)}
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg-pattern"></div>
      <div class="hero-grid"></div>
      <div class="container hero-content">
        <div style="max-width:700px">
          <div class="hero-badge">🇮🇳 Smart India Hackathon 2026 &nbsp;|&nbsp; Problem Statement PS - 26032</div>
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
          ${[{icon:"🤖",title:"AI Center Recommender",desc:"Multi-objective time minimizer considers travel time, live queue wait, and processing duration — not just distance.",badge:"XGBoost + LightGBM"},{icon:"📡",title:"Real-Time Queue Tracking",desc:"Live token position updates via WebSocket. Know your exact position in queue without standing at the mandi.",badge:"< 80ms latency"},{icon:"🌐",title:"Multilingual AI Assistant",desc:"Ask questions in Hindi, Marathi, Telugu, Punjabi. Get answers about your token, payment & booking instantly.",badge:"5 Languages"},{icon:"📱",title:"Offline QR Pass",desc:"HMAC-SHA256 signed QR pass works without internet. Gate officers can verify bookings even in offline mode.",badge:"AES-256"},{icon:"⚡",title:"Auto Rescheduling",desc:"Missed your slot? AI auto-reschedules you within 30 seconds — no 24–72 hour manual wait, no middlemen.",badge:"< 30 seconds"},{icon:"💸",title:"Real-Time Payment Tracking",desc:"Track DBT disbursement from J-Form generation to PFMS processing to bank credit. Zero black-out window.",badge:"PFMS Integration"}].map(i=>`
            <div class="card">
              <div class="card-body">
                <div style="font-size:36px;margin-bottom:16px">${i.icon}</div>
                <span class="badge badge-green" style="margin-bottom:12px">${i.badge}</span>
                <h3 style="font-size:16px;margin-bottom:8px">${i.title}</h3>
                <p style="font-size:13px;color:var(--slate-400);line-height:1.6">${i.desc}</p>
              </div>
            </div>`).join("")}
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
          ${["📋 Booked","🚜 Arrived","✅ Gate Verified","⏳ Waiting","⚖️ Weighing","🔬 Quality Check","✔️ Accepted","🏪 Unloading","📄 Documentation","🏦 Payment Processing","💰 Payment Done"].map((i,n)=>`
            <div style="display:flex;align-items:center;flex-shrink:0">
              <div style="text-align:center;padding:8px 12px;min-width:100px">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--gradient-green);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 8px">${i.split(" ")[0]}</div>
                <div style="font-size:11px;font-weight:600;color:var(--green-200)">${i.substring(i.indexOf(" ")+1)}</div>
                <div style="font-size:10px;color:var(--slate-500);margin-top:3px">Stage ${n+1}</div>
              </div>
              ${n<10?'<div style="width:32px;height:2px;background:var(--border-subtle);flex-shrink:0;margin-top:-16px"></div>':""}
            </div>`).join("")}
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
  `;return setTimeout(()=>{var n,e,t,s;(n=document.getElementById("cta-farmer"))==null||n.addEventListener("click",()=>S("#/login?role=FARMER")),(e=document.getElementById("cta-officer"))==null||e.addEventListener("click",()=>S("#/login?role=OFFICER")),(t=document.getElementById("cta-register"))==null||t.addEventListener("click",()=>S("#/register"));const i=document.getElementById("hero-float-card");i&&window.innerWidth>1200&&(i.style.display="block"),(s=document.getElementById("demo-login-btn"))==null||s.addEventListener("click",()=>{F.setUser({id:1,name:"Ramesh Kumar",role:"FARMER",mobile:"9876543210",farmerId:1,preferredLanguage:"hi"},"mock-jwt-token-farmer"),k("Demo login successful! Welcome, Ramesh Ji 🌾","success"),S("#/farmer/dashboard")})},0),a}const ye={farmer:{id:1,userId:1,name:"Ramesh Kumar",mobile:"9876543210",role:"FARMER",aadhaar:"1234-5678-9012",district:"Hisar",state:"Haryana",totalLandAcres:3.5,preferredLanguage:"hi",verified:!0},officer:{id:2,userId:2,name:"Suresh Sharma",mobile:"9812345678",role:"OFFICER",centerName:"Hisar Grain Market",centerId:1,district:"Hisar",preferredLanguage:"hi",verified:!0},admin:{id:3,userId:3,name:"Dr. Ananya Iyer",mobile:"9988776655",role:"ADMIN",district:"Hisar",state:"Haryana",preferredLanguage:"en",verified:!0}},T=[{id:1,centerName:"Hisar Grain Market (Mandi-1)",district:"Hisar",latitude:29.15,longitude:75.72,address:"NH-9, Hisar, Haryana 125001",activeWeighbridges:2,totalCapacityPerDay:200,currentOccupancy:142,currentQueueLength:18,estimatedWaitMins:65,congestionLevel:"HIGH",cropsAccepted:["Wheat","Paddy","Mustard"],operatingHours:"8:00 AM – 6:00 PM",status:"ACTIVE",distanceKm:6,travelTimeMins:15,processingTimeMins:35,totalFarmerTimeMins:115,timeSavedMins:-35,rank:2},{id:2,centerName:"Barwala Sub-Procurement Centre",district:"Hisar",latitude:29.38,longitude:75.89,address:"Village Barwala, Hisar, Haryana",activeWeighbridges:2,totalCapacityPerDay:150,currentOccupancy:42,currentQueueLength:3,estimatedWaitMins:12,congestionLevel:"LOW",cropsAccepted:["Wheat","Paddy"],operatingHours:"8:00 AM – 5:00 PM",status:"ACTIVE",distanceKm:16,travelTimeMins:38,processingTimeMins:30,totalFarmerTimeMins:80,timeSavedMins:35,rank:1,recommended:!0},{id:3,centerName:"Hansi Procurement Depot",district:"Hisar",latitude:29.1,longitude:75.97,address:"Old Grain Market, Hansi, Haryana",activeWeighbridges:1,totalCapacityPerDay:100,currentOccupancy:88,currentQueueLength:24,estimatedWaitMins:110,congestionLevel:"CRITICAL",cropsAccepted:["Wheat","Mustard","Sunflower"],operatingHours:"8:00 AM – 6:00 PM",status:"ACTIVE",distanceKm:22,travelTimeMins:53,processingTimeMins:40,totalFarmerTimeMins:203,timeSavedMins:-88,rank:3}],Z=[{id:1001,bookingReference:"KS-2026-001001",farmerId:1,farmerName:"Ramesh Kumar",centerId:2,centerName:"Barwala Sub-Procurement Centre",cropId:1,cropName:"Wheat (Gehun)",cropNameHi:"गेहूं",estimatedQuantityQuintals:80,slotDate:"2026-09-10",slotStartTime:"10:00",slotEndTime:"12:00",status:"WAITING",tokenNumber:"T-104",queuePosition:3,estimatedWaitMins:18,mspRatePerQuintal:2275,totalMspValue:182e3,bookedAt:"2026-09-07T14:30:00",qrPayload:"KS:bId=1001:fId=1:cId=2:crop=WHEAT:qty=80:exp=1757548800:sig=abc123hmac"},{id:1002,bookingReference:"KS-2026-001002",farmerId:1,farmerName:"Ramesh Kumar",centerId:1,centerName:"Hisar Grain Market (Mandi-1)",cropId:2,cropName:"Paddy (Dhan)",cropNameHi:"धान",estimatedQuantityQuintals:45,slotDate:"2026-08-20",slotStartTime:"09:00",slotEndTime:"11:00",status:"PAYMENT_COMPLETED",tokenNumber:"T-067",queuePosition:null,estimatedWaitMins:null,mspRatePerQuintal:2183,totalMspValue:98235,bookedAt:"2026-08-18T10:00:00",netWeightQuintals:44.2,grossWeight:6820,tare:4600,qualityGrade:"A",moisture:15.2,foreignMatter:1.1,qrPayload:"KS:bId=1002:fId=1:cId=1:crop=PADDY:qty=45:exp=1756000000:sig=def456hmac"}],Te=[{tokenNumber:"T-101",farmerName:"Vijay Singh",crop:"Wheat",qty:60,stage:"WEIGHING",weighbridge:"Weighbridge-1",waitSince:"09:15",isActive:!0},{tokenNumber:"T-102",farmerName:"Mohan Lal",crop:"Paddy",qty:80,stage:"QUALITY_CHECK",weighbridge:"Lab-1",waitSince:"09:45",isActive:!0},{tokenNumber:"T-103",farmerName:"Gurpreet Kaur",crop:"Wheat",qty:40,stage:"WAITING",weighbridge:null,waitSince:"10:10",isActive:!1},{tokenNumber:"T-104",farmerName:"Ramesh Kumar",crop:"Wheat",qty:80,stage:"WAITING",weighbridge:null,waitSince:"10:30",isActive:!1},{tokenNumber:"T-105",farmerName:"Sita Devi",crop:"Mustard",qty:35,stage:"WAITING",weighbridge:null,waitSince:"10:55",isActive:!1},{tokenNumber:"T-106",farmerName:"Harish Yadav",crop:"Paddy",qty:90,stage:"WAITING",weighbridge:null,waitSince:"11:15",isActive:!1}],Ce={totalFarmersServedToday:347,totalQuantityProcuredTonnes:1842.5,totalMspValueCrore:4.2,avgWaitTimeMins:42,activeCenters:12,totalCenters:15,missedSlots:8,autoRescheduled:6,centersData:[{name:"Hisar M-1",farmers:78,qty:412,utilization:71,wait:65},{name:"Barwala",farmers:42,qty:218,utilization:28,wait:12},{name:"Hansi",farmers:88,qty:510,utilization:88,wait:110},{name:"Fatehabad",farmers:55,qty:287,utilization:52,wait:38},{name:"Sirsa",farmers:63,qty:310,utilization:60,wait:48},{name:"Tohana",farmers:21,qty:105,utilization:22,wait:15}],weeklyData:[{day:"Mon",farmers:210,qty:980},{day:"Tue",farmers:285,qty:1340},{day:"Wed",farmers:320,qty:1580},{day:"Thu",farmers:290,qty:1420},{day:"Fri",farmers:347,qty:1842},{day:"Sat",farmers:180,qty:820}]},ze={bookingRef:"KS-2026-001002",cropName:"Paddy (Dhan)",netQuintals:44.2,mspRate:2183,grossAmount:96487,netPayable:96487,bankName:"Punjab National Bank",accountNo:"****4521",ifsc:"PUNB0123400",utrNumber:"PFMS2026090842311",initiatedAt:"2026-08-21T16:45:00",completedAt:"2026-08-22T10:30:00",steps:[{label:"J-Form Generated",labelHi:"J-फॉर्म तैयार",status:"done",time:"21 Aug, 4:00 PM"},{label:"DBT Payload Submitted to PFMS",labelHi:"PFMS को DBT भेजा",status:"done",time:"21 Aug, 4:45 PM"},{label:"PFMS Processing",labelHi:"PFMS प्रक्रियाधीन",status:"done",time:"21 Aug, 6:00 PM"},{label:"Bank Transfer Initiated",labelHi:"बैंक ट्रांसफर शुरू",status:"done",time:"22 Aug, 9:00 AM"},{label:"Amount Credited to Account",labelHi:"खाते में राशि जमा",status:"done",time:"22 Aug, 10:30 AM"}]},D=[{key:"BOOKED",label:"Slot Booked",labelHi:"स्लॉट बुक",icon:"📋"},{key:"ARRIVED",label:"Arrived at Centre",labelHi:"केंद्र पर आगमन",icon:"🚜"},{key:"GATE_VERIFIED",label:"Gate Verified",labelHi:"गेट सत्यापन पूर्ण",icon:"✅"},{key:"WAITING",label:"In Queue",labelHi:"कतार में प्रतीक्षारत",icon:"⏳"},{key:"WEIGHING",label:"Weighbridge",labelHi:"धर्मकांटा तुलाई",icon:"⚖️"},{key:"QUALITY_CHECK",label:"Quality Check",labelHi:"गुणवत्ता जांच",icon:"🔬"},{key:"ACCEPTED",label:"Crop Accepted",labelHi:"फसल स्वीकार",icon:"✔️"},{key:"UNLOADING",label:"Unloading",labelHi:"गोदाम अनलोडिंग",icon:"🏪"},{key:"DOCUMENTATION",label:"J-Form / Receipt",labelHi:"J-फॉर्म रसीद",icon:"📄"},{key:"PAYMENT_PROCESSING",label:"Payment Processing",labelHi:"DBT भुगतान प्रक्रिया",icon:"🏦"},{key:"PAYMENT_COMPLETED",label:"Payment Completed",labelHi:"भुगतान पूर्ण",icon:"💰"}],te=[{id:1,nameEn:"Wheat",nameHi:"गेहूं",msp:2275,icon:"🌾"},{id:2,nameEn:"Paddy",nameHi:"धान",msp:2183,icon:"🌾"},{id:3,nameEn:"Mustard",nameHi:"सरसों",msp:5650,icon:"🌻"},{id:4,nameEn:"Sunflower",nameHi:"सूरजमुखी",msp:6760,icon:"🌻"},{id:5,nameEn:"Maize",nameHi:"मक्का",msp:1850,icon:"🌽"},{id:6,nameEn:"Cotton",nameHi:"कपास",msp:7121,icon:"☁️"}],be={en:[{q:["token","number","queue","position","wait","line"],r:"🪙 Ramesh Ji, your token number is **T-104**. You are currently **#3 in line** at Barwala Sub-Centre. Estimated wait time is **18 minutes**. Please be ready near the weighbridge."},{q:["payment","money","paid","status","credited","dbt","pfms","account","bank"],r:"💰 Your last payment of **₹96,487** for 44.2 quintals of Paddy has been **credited** directly to your PNB account (****4521) via PFMS DBT. UTR: PFMS2026090842311."},{q:["booking","slot","appointment","center","barwala","details"],r:"📋 You have an **active booking** (Ref: KS-2026-001001) at Barwala Sub-Centre on **10 Sep 2026**, slot 10:00 AM – 12:00 PM for 80 quintals of Wheat."},{q:["msp","rate","price","wheat","paddy","mustard","crops"],r:"🌾 Official MSP for **Wheat (Rabi 2025-26)** is ₹2,275 per quintal. Your 80 quintals will fetch **₹1,82,000**. Paddy MSP is ₹2,183/qtl and Mustard is ₹5,650/qtl."},{q:["cancel","reschedule","change","date","time","postpone"],r:"📅 You can cancel or reschedule your booking up to 12 hours before your slot without any penalty. Go to **My Bookings** section to select a new slot."},{q:["quality","moisture","assay","check","grade"],r:"🔬 Grain quality check requires moisture level under 12% and foreign matter under 0.75% for instant grade approval at the center."},{q:["hello","hi","help","namaste"],r:"🙏 Hello Ramesh Ji! I am your KisanSetu AI assistant. Ask me about your token number, payment status, MSP rates, or booking details."}],hi:[{q:["token","टोकन","number","नंबर","queue","कतार","position","स्थान","wait","इंतजार","प्रतीक्षा","लाइन"],r:"🪙 रामेश जी, आपका **टोकन नंबर T-104** है। बरवाला उप-केंद्र पर आपके आगे **3 किसान कतार में** हैं। आपका अनुमानित प्रतीक्षा समय **18 मिनट** है। कृपया तुलाई के लिए तैयार रहें।"},{q:["payment","पैसे","भुगतान","रकम","paid","credited","dbt","pfms","account","खाता","बैंक","रुपये"],r:"💰 रामेश जी, आपके 44.2 क्विंटल धान के लिए **₹96,487 की राशि** सीधे DBT के माध्यम से आपके **PNB बैंक खाते (****4521)** में **जमा हो चुकी है**। UTR: PFMS2026090842311।"},{q:["booking","बुकिंग","slot","स्लॉट","appointment","अपॉइंटमेंट","center","केंद्र","सेंटर","barwala","बरवाला","विवरण","तारीख"],r:"📋 आपकी सक्रिय स्लॉट **बुकिंग (KS-2026-001001)** बरवाला उप-केंद्र पर **10 सितंबर 2026** को सुबह **10:00 से 12:00 बजे** के लिए 80 क्विंटल गेहूं की पक्की है।"},{q:["msp","भाव","दाम","दर","rate","price","wheat","गेहूं","paddy","धान","सरसों","mustard","फसल","मूल्य"],r:"🌾 रबी 2025-26 के लिए **गेहूं का आधिकारिक MSP भाव ₹2,275 प्रति क्विंटल** है। आपके 80 क्विंटल गेहूं का कुल मूल्य **₹1,82,000** होगा। धान का भाव ₹2,183 और सरसों का ₹5,650 है।"},{q:["cancel","रद्द","reschedule","बदलना","समय","date","पुनर्निर्धारण","बदलो","तारीख"],r:'📅 आप बिना किसी पेनल्टी के अपने स्लॉट से 12 घंटे पहले तक बुकिंग को रद्द या पुनर्निर्धारित कर सकते हैं। इसके लिए **"मेरी बुकिंग"** में जाकर नया समय चुनें।'},{q:["quality","गुणवत्ता","नमी","moisture","जांच","assay","check","पास"],r:"🔬 खरीद केंद्र पर गुणवत्ता जांच के लिए गेहूं में नमी 12% से कम होनी चाहिए। गुणवत्ता पास होते ही डिजिटल J-फॉर्म तुरंत जारी हो जाता है।"},{q:["hello","hi","नमस्ते","प्रणाम","help","सहायता","मदद","रामेश"],r:"🙏 नमस्ते रामेश जी! मैं आपका कृषि सेतु AI सहायक हूं। आप मुझसे टोकन नंबर, बैंक भुगतान, MSP भाव या स्लॉट बुकिंग के बारे में कुछ भी पूछ सकते हैं।"}]};function Pe(a,i="en"){const n=a.toLowerCase(),e=be[i]||be.en;for(const t of e)if(t.q.some(s=>n.includes(s.toLowerCase())))return t.r;return i==="hi"?'🤖 रामेश जी, मैं आपकी पूरी सहायता करूंगा। आप पूछ सकते हैं: "मेरा टोकन नंबर क्या है?", "क्या मेरा भुगतान जमा हुआ?", या "गेहूं का MSP भाव क्या है?"।':'🤖 I can help with your token status, payment info, MSP rates, and booking details. Try asking: "What is my queue position?" or "Has my payment been processed?"'}function we(){return`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 70%, rgba(26,158,85,0.12) 0%,transparent 50%),radial-gradient(circle at 70% 20%, rgba(245,158,11,0.07) 0%,transparent 40%)"></div>
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(34,196,104,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,196,104,0.03) 1px,transparent 1px);background-size:60px 60px"></div>
  `}function Le(){const a=`
    <div class="auth-page">
      ${we()}
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
  `;return setTimeout(()=>{var s,r,d,p;let i="FARMER";const n=window.location.hash||"",e=(s=new URLSearchParams(n.split("?")[1]||"").get("role"))==null?void 0:s.toUpperCase();e&&["FARMER","OFFICER","ADMIN"].includes(e)&&(i=e,document.querySelectorAll(".role-option").forEach(y=>y.classList.remove("selected")),(r=document.getElementById(`role-${e}`))==null||r.classList.add("selected")),document.querySelectorAll(".role-option").forEach(y=>{y.addEventListener("click",()=>{document.querySelectorAll(".role-option").forEach(h=>h.classList.remove("selected")),y.classList.add("selected"),i=y.dataset.role})}),(d=document.getElementById("toggle-password"))==null||d.addEventListener("click",()=>{const y=document.getElementById("password-input");y.type=y.type==="password"?"text":"password"}),(p=document.getElementById("login-form"))==null||p.addEventListener("submit",async y=>{y.preventDefault();const h=document.getElementById("login-btn");h.innerHTML='<span class="spinner spinner-sm"></span> Verifying...',h.disabled=!0,await new Promise(g=>setTimeout(g,800));const o=ye[i.toLowerCase()];F.setUser(o,`mock-jwt-${i.toLowerCase()}`),k(`Welcome back, ${o.name.split(" ")[0]} ji! 🌾`,"success"),S(`#/${i.toLowerCase()}/dashboard`)}),[["demo-farmer","farmer"],["demo-officer","officer"],["demo-admin","admin"]].forEach(([y,h])=>{var o;(o=document.getElementById(y))==null||o.addEventListener("click",()=>{const g=ye[h];F.setUser(g,`mock-jwt-${h}`),k(`Demo login as ${g.name}`,"success"),S(`#/${h}/dashboard`)})})},0),a}function qe(){const a=`
    <div class="auth-page" style="align-items:flex-start;padding:40px 24px">
      ${we()}
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
  `;return setTimeout(()=>{var i;(i=document.getElementById("register-form"))==null||i.addEventListener("submit",async n=>{n.preventDefault();const e=document.getElementById("register-btn");e.innerHTML='<span class="spinner spinner-sm"></span> Registering...',e.disabled=!0,await new Promise(r=>setTimeout(r,1200));const t=document.getElementById("reg-name").value,s={id:Date.now(),name:t,role:"FARMER",mobile:document.getElementById("reg-mobile").value,district:document.getElementById("reg-district").value,state:document.getElementById("reg-state").value,preferredLanguage:document.getElementById("reg-lang").value,farmerId:Date.now(),verified:!1};F.setUser(s,"mock-jwt-new-farmer"),k(`Registration successful! Welcome, ${t.split(" ")[0]} ji! 🎉`,"success"),S("#/farmer/dashboard")})},0),a}function Re(a){const i=Z[0],n=(a==null?void 0:a.preferredLanguage)||"en",e=D.findIndex(o=>o.key===i.status),t=Math.round((e+1)/D.length*100),s=D.slice(0,7).map((o,g)=>{const f=g<e,x=g===e,I=g>e;return`
      <div class="stage-item ${f?"completed":x?"active":""}">
        <div class="stage-line"></div>
        <div class="stage-dot ${f?"stage-dot-done":x?"stage-dot-active":"stage-dot-pending"}">
          ${f?"✓":x?o.icon:g+1}
        </div>
        <div class="stage-info">
          <div class="stage-name ${I?"stage-name-pending":""}">${o.label}</div>
          <div class="stage-hi devanagari">${o.labelHi}</div>
          ${x?'<div class="stage-time" style="color:var(--gold-400)">● Currently here</div>':""}
        </div>
      </div>`}).join(""),r=typeof window<"u"&&"speechSynthesis"in window;let d=typeof localStorage<"u"?localStorage.getItem("ks_autoread")==="true":!1;const p=n==="hi"?[{bot:!0,text:"🙏 नमस्ते रामेश जी! मैं आपका KisanSetu AI सहायक हूं। आप हिंदी में पूछ सकते हैं — टोकन नंबर, भुगतान, MSP दर, या कुछ भी।"}]:[{bot:!0,text:"🙏 Hello Ramesh Ji! I'm your KisanSetu AI assistant. Ask me about your token, payment status, MSP rates, or anything about your booking."}],y=`
    <!-- Welcome Banner -->
    <div style="background:var(--gradient-card);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);padding:24px 28px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-size:13px;color:var(--green-400);margin-bottom:4px">🙏 Good Morning</div>
        <h1 style="font-size:26px;font-weight:800">${(a==null?void 0:a.name)||"Farmer"} <span class="devanagari" style="font-size:18px;color:var(--gold-400);font-weight:400">(रामेश जी)</span></h1>
        <p style="font-size:13px;color:var(--slate-400);margin-top:4px">District: ${(a==null?void 0:a.district)||"Hisar"}, Haryana &bull; Farmer ID: ${(a==null?void 0:a.id)||1}</p>
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
        <div class="stat-value" style="color:#60a5fa">${A(96487)}</div>
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
            <div class="section-subtitle">${i.bookingReference}</div>
          </div>
          ${ee(i.status)}
        </div>
        <div class="card">
          <div class="card-body">
            <!-- Booking info -->
            <div style="display:flex;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)">
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Centre</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${i.centerName}</div>
              </div>
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Crop</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${i.cropName}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--slate-500)">Quantity</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${i.estimatedQuantityQuintals} qtl</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)">
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Date</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${W(i.slotDate)}</div>
              </div>
              <div style="flex:1">
                <div style="font-size:11px;color:var(--slate-500)">Slot</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px">${X(i.slotStartTime)} – ${X(i.slotEndTime)}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--slate-500)">Token</div>
                <div style="font-size:13px;font-weight:700;margin-top:2px;color:var(--gold-400)">${i.tokenNumber}</div>
              </div>
            </div>

            <!-- Queue live indicator -->
            <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-md);padding:16px;margin-bottom:20px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-size:13px;font-weight:600">📡 Live Queue Position</span>
                <span class="badge badge-gold" style="animation:pulse-gold 2s infinite">● LIVE</span>
              </div>
              <div style="font-size:40px;font-weight:900;color:var(--gold-400);margin-bottom:4px">#${i.queuePosition}</div>
              <div style="font-size:13px;color:var(--green-300)">Estimated wait: <strong>${i.estimatedWaitMins} minutes</strong></div>
              <div class="progress mt-12">
                <div class="progress-bar progress-gold" style="width:${t}%"></div>
              </div>
              <div style="font-size:11px;color:var(--slate-500);margin-top:6px">${t}% complete — WAITING → WEIGHING</div>
            </div>

            <!-- Stage tracker -->
            <div class="stage-tracker">
              ${s}
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
            ${r?`
              <button class="auto-read-btn ${d?"active":""}" id="auto-read-toggle" title="Toggle automatic reading of AI responses">
                <span>🔊</span>
                <span>Auto-read: <strong id="auto-read-status">${d?"ON":"OFF"}</strong></span>
              </button>
            `:""}
            <div style="display:flex;gap:2px;background:rgba(2,45,24,0.6);border:1px solid var(--border-medium);border-radius:var(--radius-full);padding:2px">
              <button class="btn btn-xs ${n==="hi"?"btn-primary":"btn-ghost"}" id="lang-hi" style="border-radius:var(--radius-full);font-size:12px;padding:3px 12px;font-weight:600">🇮🇳 हिंदी</button>
              <button class="btn btn-xs ${n==="en"?"btn-primary":"btn-ghost"}" id="lang-en" style="border-radius:var(--radius-full);font-size:12px;padding:3px 12px;font-weight:600">🇬🇧 English</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="chat-widget">
            <div class="chat-messages" id="chat-messages">
              ${p.map(o=>`
                <div class="chat-msg ${o.bot?"":"chat-msg-user"}">
                  ${o.bot?'<div class="chat-avatar" style="background:var(--gradient-green)">🤖</div>':""}
                  <div class="${o.bot?"chat-msg-bot-wrap":""}">
                    <div class="chat-bubble ${o.bot?"chat-bubble-bot":"chat-bubble-user"}">${o.text}</div>
                    ${o.bot&&r?`
                      <div class="chat-bubble-footer">
                        <button class="chat-speak-btn" type="button" data-text="${encodeURIComponent(o.text)}" title="Read response aloud">
                          <span class="speak-icon">🔊</span>
                          <span class="speak-label">Read aloud</span>
                        </button>
                      </div>`:""}
                  </div>
                  ${o.bot?"":'<div class="chat-avatar" style="background:var(--gradient-gold);color:var(--green-950)">R</div>'}
                </div>`).join("")}
            </div>
            <div style="padding:8px 12px;border-top:1px solid var(--border-subtle)">
              <div id="chat-quick-replies" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
                ${(n==="hi"?["मेरा टोकन नंबर?","भुगतान हुआ क्या?","MSP दर बताओ","बुकिंग विवरण"]:["My queue position?","Payment received?","MSP rates today","My booking details"]).map(o=>`<button class="btn btn-ghost btn-sm quick-reply" data-q="${o}" style="font-size:11px;padding:4px 10px;border:1px solid var(--border-subtle);border-radius:var(--radius-full)">${o}</button>`).join("")}
              </div>
            </div>
            <!-- Listening Bar (Web Speech STT) -->
            <div class="chat-listening-bar" id="chat-listening-bar" style="display:none">
              <div class="listening-content">
                <div class="waveform">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span id="listening-status-text">${n==="hi"?"सुन रहे हैं... बोलिए":"Listening... Speak now"}</span>
              </div>
              <button class="chat-cancel-speech-btn" id="chat-cancel-speech" type="button" title="Stop listening">Cancel</button>
            </div>
            <div class="chat-input-row">
              <button class="chat-mic-btn" id="chat-mic" type="button" title="${n==="hi"?"आवाज़ से पूछें (Voice Input)":"Voice Input (Click to speak)"}" aria-label="Voice input">
                <span id="chat-mic-icon">🎤</span>
              </button>
              <button class="btn btn-ghost btn-sm" id="chat-voice-boxes-btn" type="button" title="${n==="hi"?"आवाज़ प्रश्न बॉक्स खोलें":"Open Voice Question Boxes"}" style="font-size:11px;padding:4px 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);color:var(--gold-300);white-space:nowrap">
                🎙️ ${n==="hi"?"प्रश्न बॉक्स":"Voice Qs"}
              </button>
              <input class="chat-input" id="chat-input" placeholder="${n==="hi"?"हिंदी में पूछें... (उदा. मेरा टोकन नंबर?)":"Ask in English... (e.g. My queue position?)"}" />
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
              ${te.slice(0,4).map(o=>`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-subtle)">
                  <div style="font-size:13px">${o.icon} ${o.nameEn} <span class="devanagari" style="font-size:11px;color:var(--slate-400)">(${o.nameHi})</span></div>
                  <div style="font-size:14px;font-weight:700;color:var(--gold-400)">₹${o.msp.toLocaleString()}/qtl</div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,h=C(a,"dashboard",y);return setTimeout(()=>{var ne,oe,re,de,le,ce,pe,ve,ue;(ne=document.getElementById("btn-book-slot"))==null||ne.addEventListener("click",()=>S("#/farmer/book")),(oe=document.getElementById("btn-find-centers"))==null||oe.addEventListener("click",()=>S("#/farmer/centers"));let o=n,g=!1,f=null,x=!1,I=null;function O(c){if(!c)return"";if(/[\u0900-\u097F]/.test(c))return c.replace(/₹\s*([0-9,]+)/g,"$1 रुपये").replace(/T-(\d+)/g,"टी $1").replace(/%/g," प्रतिशत").replace(/qtl/gi,"क्विंटल");const l=c.toLowerCase();return l.includes("token")||l.includes("queue")||l.includes("line")?"रामेश जी, आपका टोकन नंबर टी 104 है। बरवाला उप-केंद्र पर आपके आगे 3 किसान कतार में हैं। आपका अनुमानित प्रतीक्षा समय 18 मिनट है। कृपया तुलाई के लिए तैयार रहें।":l.includes("payment")||l.includes("paid")||l.includes("credited")?"रामेश जी, आपके 44.2 क्विंटल धान के लिए 96,487 रुपये की राशि सीधे डीबीटी के माध्यम से आपके पंजाब नेशनल बैंक खाते में जमा हो चुकी है।":l.includes("booking")||l.includes("slot")?"आपकी सक्रिय स्लॉट बुकिंग बरवाला उप-केंद्र पर 10 सितंबर 2026 को सुबह 10 से 12 बजे के लिए 80 क्विंटल गेहूं की निर्धारित है।":l.includes("msp")||l.includes("wheat")||l.includes("price")||l.includes("rate")?"रबी 2025-26 के लिए गेहूं का आधिकारिक एमएसपी भाव 2,275 रुपये प्रति क्विंटल है। आपके 80 क्विंटल गेहूं का कुल मूल्य 1,82,000 रुपये होगा। धान का भाव 2,183 और सरसों का 5,650 रुपये है।":l.includes("cancel")||l.includes("reschedule")?"आप बिना किसी पेनल्टी के अपने स्लॉट से 12 घंटे पहले तक बुकिंग को रद्द या पुनर्निर्धारित कर सकते हैं। इसके लिए मेरी बुकिंग में जाकर नया समय चुनें।":l.includes("quality")||l.includes("moisture")?"खरीद केंद्र पर गुणवत्ता जांच के लिए गेहूं में नमी 12 प्रतिशत से कम होनी चाहिए। गुणवत्ता पास होते ही डिजिटल जे-फॉर्म तुरंत जारी हो जाता है।":l.includes("hello")||l.includes("assistant")||l.includes("ramesh")?"नमस्ते रामेश जी! मैं आपका कृषि सेतु एआई सहायक हूं। आप मुझसे टोकन नंबर, बैंक भुगतान, एमएसपी भाव या स्लॉट बुकिंग के बारे में हिंदी में कुछ भी पूछ सकते हैं।":c}function Q(c,l="en"){if(!c)return"";let v=c;return l==="hi"&&(v=O(v)),v.replace(/\*\*(.*?)\*\*/g,"$1").replace(/[*_#`~]/g,"").replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,"").replace(/₹\s*([0-9,]+)/g,l==="hi"?"$1 रुपये":"$1 rupees").replace(/\s+/g," ").trim()}let z=[];function U(){typeof window<"u"&&window.speechSynthesis&&(z=window.speechSynthesis.getVoices()||[])}U(),typeof window<"u"&&window.speechSynthesis&&(window.speechSynthesis.onvoiceschanged=U);function P(){if(r){try{window.speechSynthesis.cancel()}catch{}if(I){I.classList.remove("speaking");const c=I.querySelector(".speak-icon");c&&(c.textContent="🔊");const l=I.querySelector(".speak-label");l&&(l.textContent="Read aloud"),I=null}}}function _(c,l=null){if(!r)return;const v=Q(c,o);if(!v)return;if(I===l&&window.speechSynthesis.speaking){P();return}P(),(!z||z.length===0)&&U();const u=new SpeechSynthesisUtterance(v);if(o==="hi"){const b=z.find(w=>{const E=(w.lang||"").toLowerCase().replace("_","-"),m=(w.name||"").toLowerCase();return E==="hi-in"||E.startsWith("hi")||m.includes("hindi")||m.includes("हिन्दी")||m.includes("kalpana")||m.includes("hemant")||m.includes("swara")||m.includes("madhur")});b?(u.voice=b,u.lang=b.lang||"hi-IN"):u.lang="hi-IN",u.rate=.88,u.pitch=1}else{const b=z.find(w=>{const E=(w.lang||"").toLowerCase().replace("_","-"),m=(w.name||"").toLowerCase();return E==="en-in"||E.startsWith("en-in")||m.includes("india")||m.includes("neerja")||m.includes("prabhat")||m.includes("ravi")})||z.find(w=>(w.lang||"").toLowerCase().startsWith("en"));b?(u.voice=b,u.lang=b.lang||"en-IN"):u.lang="en-US",u.rate=.95,u.pitch=1}if(l){I=l,l.classList.add("speaking");const b=l.querySelector(".speak-icon");b&&(b.textContent="⏹️");const w=l.querySelector(".speak-label");w&&(w.textContent="Stop")}u.onend=()=>{P()},u.onerror=b=>{console.warn("Speech synthesis error:",b),P()},window.speechSynthesis.speak(u)}function R(){var w,E;const c=document.getElementById("voice-fallback-modal");c&&c.remove();const l=o==="hi"?[{icon:"🪙",title:"टोकन व कतार स्थिति",text:"मेरा टोकन नंबर और कतार क्या है?",q:"मेरा टोकन नंबर क्या है?"},{icon:"💰",title:"DBT बैंक भुगतान",text:"क्या मेरा धान का भुगतान बैंक खाते में जमा हुआ?",q:"भुगतान हुआ क्या?"},{icon:"🌾",title:"MSP सरकारी भाव",text:"गेहूं, धान और सरसों का आज का आधिकारिक MSP भाव क्या है?",q:"MSP दर बताओ"},{icon:"📋",title:"सक्रिय स्लॉट बुकिंग",text:"मेरी बरवाला उप-केंद्र पर सक्रिय बुकिंग का विवरण दिखाओ",q:"बुकिंग विवरण"},{icon:"📅",title:"स्लॉट तारीख बदलाव",text:"मैं अपनी बुकिंग का समय या तारीख कैसे बदल सकता हूं?",q:"बुकिंग पुनर्निर्धारण"},{icon:"🔬",title:"गुणवत्ता व नमी जांच",text:"फसल स्वीकार होने के लिए नमी और गुणवत्ता की क्या शर्तें हैं?",q:"गुणवत्ता जांच"}]:[{icon:"🪙",title:"Token & Queue Position",text:"What is my token number and queue wait time?",q:"What is my queue position?"},{icon:"💰",title:"DBT Bank Payment",text:"Has my payment for paddy been credited to my account?",q:"Has my payment been processed?"},{icon:"🌾",title:"Official MSP Rates",text:"What are the current MSP rates for wheat, paddy and mustard?",q:"What are the MSP rates today?"},{icon:"📋",title:"Active Slot Booking",text:"Show my active slot booking details at Barwala center",q:"Show my booking details"},{icon:"📅",title:"Reschedule Appointment",text:"How can I cancel or reschedule my appointment slot?",q:"How to reschedule booking"},{icon:"🔬",title:"Quality & Moisture Rules",text:"What are the grain moisture and quality specifications?",q:"Quality check rules"}],v=document.createElement("div");v.className="voice-modal-backdrop",v.id="voice-fallback-modal",v.innerHTML=`
        <div class="voice-modal-card" style="max-width:540px">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--gradient-green);display:flex;align-items:center;justify-content:center;font-size:20px">🎙️</div>
              <div>
                <h3 style="font-size:17px;font-weight:800">${o==="hi"?"आवाज़ सहायक प्रश्न (Voice Assistant)":"Voice Assistant Questions"}</h3>
                <p style="font-size:12px;color:var(--green-300)">${o==="hi"?"किसी भी बॉक्स पर टैप करें और आवाज़ में उत्तर सुनें 🔊":"Tap any box below to ask and hear the answer aloud 🔊"}</p>
              </div>
            </div>
            <button class="btn btn-ghost btn-xs" id="close-voice-modal" style="font-size:16px;padding:4px 8px;border-radius:var(--radius-full)">✕</button>
          </div>

          <div class="voice-prompt-list" style="display:grid;grid-template-columns:1fr;gap:10px;max-height:340px;overflow-y:auto">
            ${l.map(m=>`
              <button class="voice-prompt-btn" data-query="${m.q}" style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:rgba(10,64,35,0.6);border:1px solid var(--border-medium);border-radius:var(--radius-lg);cursor:pointer;text-align:left;transition:all var(--transition-fast)">
                <span style="font-size:24px;line-height:1;margin-top:2px">${m.icon}</span>
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:700;color:var(--gold-300);margin-bottom:2px">${m.title}</div>
                  <div style="font-size:12px;color:var(--text-primary)">${m.text}</div>
                </div>
                <span style="color:var(--green-400);font-size:18px;margin-top:4px">🔊</span>
              </button>
            `).join("")}
          </div>

          <!-- Custom query input inside modal -->
          <div style="display:flex;gap:8px;padding-top:8px;border-top:1px solid var(--border-subtle)">
            <input class="chat-input" id="voice-modal-custom-input" placeholder="${o==="hi"?"अपना प्रश्न यहां लिखें और आवाज़ में सुनें...":"Type any custom question to hear aloud..."}" style="flex:1;border-radius:var(--radius-md)" />
            <button class="btn btn-primary btn-sm" id="voice-modal-submit-btn" style="border-radius:var(--radius-md);white-space:nowrap">🔊 ${o==="hi"?"पूछें":"Ask"}</button>
          </div>
        </div>
      `,document.body.appendChild(v),(w=v.querySelector("#close-voice-modal"))==null||w.addEventListener("click",()=>v.remove()),v.addEventListener("click",m=>{m.target===v&&v.remove()}),v.querySelectorAll(".voice-prompt-btn").forEach(m=>{m.addEventListener("click",()=>{const $=m.dataset.query;v.remove(),L($,!0)})});const u=v.querySelector("#voice-modal-custom-input"),b=()=>{var $;const m=($=u==null?void 0:u.value)==null?void 0:$.trim();m&&(v.remove(),L(m,!0))};(E=v.querySelector("#voice-modal-submit-btn"))==null||E.addEventListener("click",b),u==null||u.addEventListener("keydown",m=>{m.key==="Enter"&&b()})}let ie=null;function B(){if(f)try{f.stop()}catch{}x=!1;const c=document.getElementById("chat-mic"),l=document.getElementById("chat-mic-icon"),v=document.getElementById("chat-listening-bar"),u=document.getElementById("chat-input");c&&c.classList.remove("listening"),l&&(l.textContent="🎤"),v&&(v.style.display="none"),u&&(u.placeholder.startsWith("Listening")||u.placeholder.startsWith("सुन"))&&(u.placeholder=o==="hi"?"हिंदी में पूछें... (उदा. मेरा टोकन नंबर?)":"Ask in English... (e.g. My queue position?)")}async function $e(){P();const c=window.SpeechRecognition||window.webkitSpeechRecognition;if(!c){R();return}const l=document.getElementById("chat-mic"),v=document.getElementById("chat-mic-icon"),u=document.getElementById("chat-listening-bar"),b=document.getElementById("listening-status-text"),w=document.getElementById("chat-input");try{!ie&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(ie=await navigator.mediaDevices.getUserMedia({audio:!0}))}catch($){console.warn("Microphone permission request:",$),k("Microphone access prompt dismissed. Opening Voice Question Boxes 🎙️","info"),R();return}try{if(f)try{f.abort()}catch{}f=new c}catch{R();return}f.continuous=!1,f.interimResults=!0,f.maxAlternatives=1,f.lang=o==="hi"?"hi-IN":"en-IN";let E="",m=!1;f.onstart=()=>{x=!0,m=!1,l&&l.classList.add("listening"),v&&(v.textContent="🛑"),u&&(u.style.display="flex"),b&&(b.textContent=o==="hi"?"🎤 सुन रहे हैं... बोलिए (Listening... Speak now)":"🎤 Listening... Speak now"),w&&(w.placeholder=o==="hi"?"आपकी आवाज़ सुनी जा रही है...":"Listening to your voice...")},f.onresult=$=>{let q="",G="";for(let N=$.resultIndex;N<$.results.length;++N){const me=$.results[N][0].transcript;$.results[N].isFinal?G+=me:q+=me}const Y=G||q;if(Y&&w&&(w.value=Y,E=Y),G.trim()&&!m){m=!0;const N=G.trim();B(),L(N,!0),w&&(w.value="")}},f.onerror=$=>{console.warn("SpeechRecognition error:",$.error),B(),$.error==="network"?(k("Speech recognition connection error in browser. Opening Voice Question Boxes 🎙️","info"),R()):$.error==="not-allowed"?(k("Microphone access denied. Opening Voice Question Boxes 🎙️","info"),R()):$.error==="no-speech"&&k(o==="hi"?"कोई आवाज़ नहीं मिली। कृपया दोबारा बोलें।":"No speech detected. Please speak closer to the mic.","info")},f.onend=()=>{!m&&E.trim()&&w&&w.value&&(m=!0,L(E.trim(),!0),w&&(w.value="")),B()};try{f.start()}catch($){console.warn("Failed to start speech recognition:",$),B(),R()}}function ae(c,l=!1){const v=document.getElementById("chat-messages");if(!v)return;const u=document.createElement("div");if(u.className=`chat-msg ${l?"chat-msg-user":""} animate-slideUp`,l)u.innerHTML=`
          <div class="chat-bubble chat-bubble-user">${c}</div>
          <div class="chat-avatar" style="background:var(--gradient-gold);color:var(--green-950)">R</div>`;else if(u.innerHTML=`
          <div class="chat-avatar" style="background:var(--gradient-green)">🤖</div>
          <div class="chat-msg-bot-wrap">
            <div class="chat-bubble chat-bubble-bot">${c}</div>
            ${r?`
              <div class="chat-bubble-footer">
                <button class="chat-speak-btn" type="button" title="Read response aloud">
                  <span class="speak-icon">🔊</span>
                  <span class="speak-label">Read aloud</span>
                </button>
              </div>`:""}
          </div>`,r){const b=u.querySelector(".chat-speak-btn");b==null||b.addEventListener("click",()=>_(c,b))}v.appendChild(u),v.scrollTop=v.scrollHeight}function Ee(){const c=document.getElementById("chat-messages");if(!c)return null;const l=document.createElement("div");return l.className="chat-msg",l.id="typing-indicator",l.innerHTML='<div class="chat-avatar" style="background:var(--gradient-green)">🤖</div><div class="chat-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>',c.appendChild(l),c.scrollTop=c.scrollHeight,l}async function L(c,l=!1){if(!c.trim()||g)return;g=!0,P(),ae(c,!0);const v=Ee();await new Promise(b=>setTimeout(b,900+Math.random()*600)),v==null||v.remove();const u=Pe(c,o);if(ae(u),g=!1,(d||l)&&r){const b=document.getElementById("chat-messages"),w=b?b.querySelector(".chat-msg:last-child .chat-speak-btn"):null;_(u,w)}}(re=document.getElementById("chat-voice-boxes-btn"))==null||re.addEventListener("click",()=>{R()}),(de=document.getElementById("chat-send"))==null||de.addEventListener("click",()=>{const c=document.getElementById("chat-input");c&&(L(c.value),c.value="")}),(le=document.getElementById("chat-input"))==null||le.addEventListener("keydown",c=>{c.key==="Enter"&&(L(c.target.value),c.target.value="")}),document.querySelectorAll(".quick-reply").forEach(c=>{c.addEventListener("click",()=>L(c.dataset.q))});const j=document.getElementById("auto-read-toggle");j==null||j.addEventListener("click",()=>{d=!d,localStorage.setItem("ks_autoread",String(d)),j.classList.toggle("active",d);const c=document.getElementById("auto-read-status");c&&(c.textContent=d?"ON":"OFF"),d?k("Auto-read responses enabled 🔊","info"):P()}),(ce=document.getElementById("chat-mic"))==null||ce.addEventListener("click",()=>{x?B():$e()}),(pe=document.getElementById("chat-cancel-speech"))==null||pe.addEventListener("click",()=>{B()}),document.querySelectorAll("#chat-messages .chat-speak-btn").forEach(c=>{c.addEventListener("click",()=>{const l=decodeURIComponent(c.dataset.text||"");_(l,c)})});function se(c){o=c,P();const l=document.getElementById("lang-hi"),v=document.getElementById("lang-en");l&&v&&(o==="hi"?(l.className="btn btn-xs btn-primary",v.className="btn btn-xs btn-ghost"):(l.className="btn btn-xs btn-ghost",v.className="btn btn-xs btn-primary"));const u=document.getElementById("chat-input");u&&!x&&(u.placeholder=o==="hi"?"हिंदी में पूछें... (उदा. मेरा टोकन नंबर?)":"Ask in English... (e.g. My queue position?)");const b=document.getElementById("chat-quick-replies");if(b){const $=o==="hi"?["मेरा टोकन नंबर?","भुगतान हुआ क्या?","MSP दर बताओ","बुकिंग विवरण"]:["My queue position?","Payment received?","MSP rates today","My booking details"];b.innerHTML=$.map(q=>`<button class="btn btn-ghost btn-sm quick-reply" data-q="${q}" style="font-size:11px;padding:4px 10px;border:1px solid var(--border-subtle);border-radius:var(--radius-full)">${q}</button>`).join(""),b.querySelectorAll(".quick-reply").forEach(q=>{q.addEventListener("click",()=>L(q.dataset.q))})}const w=document.getElementById("chat-messages"),E=w?w.querySelector(".chat-msg:first-child .chat-bubble-bot"):null,m=w?w.querySelector(".chat-msg:first-child .chat-speak-btn"):null;E&&(o==="hi"?(E.textContent="🙏 नमस्ते रामेश जी! मैं आपका KisanSetu AI सहायक हूं। आप हिंदी में पूछ सकते हैं — टोकन नंबर, भुगतान, MSP दर, या कुछ भी।",m&&(m.dataset.text=encodeURIComponent(E.textContent))):(E.textContent="🙏 Hello Ramesh Ji! I'm your KisanSetu AI assistant. Ask me about your token, payment status, MSP rates, or anything about your booking.",m&&(m.dataset.text=encodeURIComponent(E.textContent)))),k(o==="hi"?"🇮🇳 हिंदी भाषा चुनी गई — AI आवाज़ हिंदी में बोलेगा 🌾":"🇬🇧 English mode active — AI voice will speak in English 🌾","info")}(ve=document.getElementById("lang-hi"))==null||ve.addEventListener("click",()=>se("hi")),(ue=document.getElementById("lang-en"))==null||ue.addEventListener("click",()=>se("en")),window.addEventListener("hashchange",()=>{P(),B()},{once:!0})},0),h}function Be(a){const i=`
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
              ${te.map(e=>`<option value="${e.id}">${e.icon} ${e.nameEn} (${e.nameHi})</option>`).join("")}
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
        ${T.map((e,t)=>{const s=[35,60,72][t],r=[50,40,65][t],p={LOW:"var(--success)",MODERATE:"var(--warning)",HIGH:"var(--error)",CRITICAL:"#dc2626"}[e.congestionLevel]||"var(--success)";return`
            <div class="map-dot" style="left:${s}%;top:${r}%;background:${p};color:${p};cursor:pointer" 
                 data-center-id="${e.id}" title="${e.centerName}">
            </div>
            <div style="position:absolute;left:calc(${s}% + 16px);top:calc(${r}% - 20px);background:rgba(2,26,14,0.9);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:4px 8px;font-size:10px;white-space:nowrap;pointer-events:none">
              ${e.centerName.split(" ")[0]} &bull; Wait: ${e.estimatedWaitMins}min
            </div>`}).join("")}
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
        ${T.sort((e,t)=>e.totalFarmerTimeMins-t.totalFarmerTimeMins).map((e,t)=>`
          <div class="center-card ${e.recommended?"recommended":""}" data-center-id="${e.id}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                  <div style="width:28px;height:28px;border-radius:50%;background:${t===0?"var(--gradient-gold)":"var(--bg-card)"};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${t===0?"var(--green-950)":"var(--slate-400)"}">
                    ${t+1}
                  </div>
                  <div>
                    <div style="font-size:15px;font-weight:700">${e.centerName}</div>
                    <div style="font-size:12px;color:var(--slate-400)">${e.address}</div>
                  </div>
                </div>

                <!-- Time Breakdown -->
                <div class="center-time-breakdown">
                  <span class="time-pill time-pill-travel">🚗 ${e.travelTimeMins} min travel</span>
                  <span class="time-pill time-pill-queue">⏳ ${e.estimatedWaitMins} min queue</span>
                  <span class="time-pill time-pill-process">⚙️ ${e.processingTimeMins} min process</span>
                  <span class="time-pill time-pill-total" style="font-weight:700">= ${e.totalFarmerTimeMins} min total</span>
                </div>

                <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap">
                  <span style="font-size:12px;color:var(--slate-400)">📍 ${e.distanceKm} km away</span>
                  <span style="font-size:12px;color:var(--slate-400)">🚗 ${e.currentQueueLength} vehicles in queue</span>
                  <span style="font-size:12px;color:var(--slate-400)">⚖️ ${e.activeWeighbridges} weighbridges active</span>
                  ${V(e.congestionLevel)}
                </div>
              </div>
              <div style="text-align:right">
                ${e.timeSavedMins>0?`<div style="font-size:12px;color:var(--success);margin-bottom:8px">⬆ Saves <strong>${e.timeSavedMins} min</strong></div>`:`<div style="font-size:12px;color:var(--error);margin-bottom:8px">⬇ ${Math.abs(e.timeSavedMins)} min slower</div>`}
                <button class="btn btn-primary btn-sm book-center-btn" data-center-id="${e.id}" data-center-name="${e.centerName}" style="border-radius:var(--radius-md)">Book Slot</button>
              </div>
            </div>

            <!-- Capacity bar -->
            <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-subtle)">
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--slate-500);margin-bottom:6px">
                <span>Capacity Utilization</span>
                <span>${e.currentOccupancy} / ${e.totalCapacityPerDay} farmers today</span>
              </div>
              <div class="progress">
                <div class="progress-bar ${e.currentOccupancy/e.totalCapacityPerDay>.8?"progress-gold":"progress-green"}" 
                     style="width:${Math.round(e.currentOccupancy/e.totalCapacityPerDay*100)}%"></div>
              </div>
            </div>
          </div>`).join("")}
      </div>
    </div>
  `,n=C(a,"centers",i);return setTimeout(()=>{var e;(e=document.getElementById("find-btn"))==null||e.addEventListener("click",async()=>{const t=document.getElementById("find-btn");t.innerHTML='<span class="spinner spinner-sm"></span> AI Analysing...',t.disabled=!0,await new Promise(s=>setTimeout(s,1200)),t.innerHTML="🔍 Find Centres",t.disabled=!1,k("✅ AI analysis complete — centres ranked by total farmer time","success")}),document.querySelectorAll(".book-center-btn").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const r=t.dataset.centerId;S(`#/farmer/book?centerId=${r}`)})})},0),n}function Ne(a){const i=T.find(t=>t.recommended)||T[0],n=`
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
              ${T.map(t=>`
                <div class="center-card ${t.recommended?"recommended":""}" data-center-id="${t.id}" style="cursor:pointer;padding:14px" id="center-opt-${t.id}">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <div style="font-size:13px;font-weight:700">${t.centerName}</div>
                      <div style="font-size:11px;color:var(--slate-400);margin-top:2px">${t.distanceKm}km &bull; ${t.totalFarmerTimeMins}min total time</div>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center">
                      ${V(t.congestionLevel)}
                      <div class="select-radio" data-for="${t.id}" style="width:18px;height:18px;border-radius:50%;border:2px solid var(--border-medium);display:flex;align-items:center;justify-content:center;flex-shrink:0"></div>
                    </div>
                  </div>
                </div>`).join("")}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div style="font-weight:700">Step 2: Crop & Quantity</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:14px">
            <div class="form-group">
              <label class="form-label">Crop Type *</label>
              <select class="form-select" id="book-crop">
                ${te.map(t=>`<option value="${t.id}" data-msp="${t.msp}">${t.icon} ${t.nameEn} (${t.nameHi}) — MSP ₹${t.msp}/qtl</option>`).join("")}
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
              <input class="form-input" type="date" id="book-date" min="${new Date().toISOString().split("T")[0]}" value="2026-09-10" />
            </div>
            <div class="form-group">
              <label class="form-label">Time Slot *</label>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="slot-grid">
                ${[["08:00","10:00","8:00 AM – 10:00 AM",8],["10:00","12:00","10:00 AM – 12:00 PM",3],["12:00","14:00","12:00 PM – 2:00 PM",15],["14:00","16:00","2:00 PM – 4:00 PM",5]].map(([t,s,r,d])=>`
                  <div class="slot-option" data-start="${t}" data-end="${s}" style="padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;text-align:center">
                    <div style="font-size:12px;font-weight:600">${r}</div>
                    <div style="font-size:10px;color:var(--slate-400);margin-top:3px">${d} slots left</div>
                  </div>`).join("")}
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
              <span style="font-weight:600" id="sum-center">${i.centerName}</span>
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
  `,e=C(a,"bookings",n);return setTimeout(()=>{var d,p,y,h;let t=i;document.querySelectorAll("#center-selector .center-card").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll("#center-selector .center-card").forEach(g=>{g.style.borderColor="",g.querySelector(".select-radio").innerHTML=""}),o.style.borderColor="var(--green-500)",o.querySelector(".select-radio").innerHTML="✓",o.querySelector(".select-radio").style.background="var(--green-500)",o.querySelector(".select-radio").style.color="white",o.querySelector(".select-radio").style.fontSize="10px",t=T.find(g=>g.id===parseInt(o.dataset.centerId)),document.getElementById("sum-center").textContent=t.centerName})});const s=document.querySelector("#center-selector .center-card.recommended")||document.querySelector("#center-selector .center-card");s==null||s.click(),document.querySelectorAll(".slot-option").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".slot-option").forEach(g=>{g.style.borderColor="",g.style.background=""}),o.style.borderColor="var(--green-500)",o.style.background="rgba(34,196,104,0.1)",o.dataset.start,o.dataset.end,document.getElementById("sum-slot").textContent=o.querySelector("div").textContent})}),(d=document.querySelectorAll(".slot-option")[1])==null||d.click();function r(){var O,Q,z;const o=document.getElementById("book-crop"),g=parseFloat((O=document.getElementById("book-qty"))==null?void 0:O.value)||0,f=parseFloat((Q=o==null?void 0:o.options[o.selectedIndex])==null?void 0:Q.dataset.msp)||2275,x=g*f;document.getElementById("msp-value").textContent=A(x),document.getElementById("sum-qty").textContent=`${g} quintals`,document.getElementById("sum-value").textContent=A(x),document.querySelector("#msp-preview div:last-child").textContent=`${g} qtl × ₹${f} = ${A(x)}`;const I=((z=o==null?void 0:o.options[o.selectedIndex])==null?void 0:z.text.split("—")[0].trim())||"Wheat";document.getElementById("sum-crop").textContent=I}(p=document.getElementById("book-qty"))==null||p.addEventListener("input",r),(y=document.getElementById("book-crop"))==null||y.addEventListener("change",r),(h=document.getElementById("confirm-booking-btn"))==null||h.addEventListener("click",async()=>{const o=document.getElementById("confirm-booking-btn");o.innerHTML='<span class="spinner spinner-sm"></span> Generating QR Pass...',o.disabled=!0,await new Promise(g=>setTimeout(g,1500)),k("🎉 Booking confirmed! QR Pass generated.","success"),S("#/farmer/bookings")})},0),e}function He(a){const i=`
    <div class="section-header mb-24">
      <div>
        <h1 class="section-title">📋 My Bookings</h1>
        <div class="section-subtitle">All your procurement appointments</div>
      </div>
      <button class="btn btn-gold btn-sm" onclick="navigate('#/farmer/book')" style="border-radius:var(--radius-md)">+ New Booking</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:20px">
      ${Z.map(e=>{const t=D.findIndex(d=>d.key===e.status),s=Math.round((t+1)/D.length*100),r=!["PAYMENT_COMPLETED","CANCELLED","REJECTED"].includes(e.status);return`
          <div class="card ${r?"booking-active-card":""}" style="${r?"border-color:rgba(34,196,104,0.3)":""}">
            <div class="card-header">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                <div>
                  <div style="font-size:15px;font-weight:700">${e.bookingReference}</div>
                  <div style="font-size:12px;color:var(--slate-400);margin-top:2px">${e.centerName}</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  ${ee(e.status)}
                  ${r?'<span class="badge badge-green" style="animation:pulse-green 2s infinite">● ACTIVE</span>':""}
                </div>
              </div>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-bottom:16px">
                <div><div style="font-size:11px;color:var(--slate-500)">Crop</div><div style="font-size:13px;font-weight:600;margin-top:2px">${e.cropName}</div></div>
                <div><div style="font-size:11px;color:var(--slate-500)">Quantity</div><div style="font-size:13px;font-weight:600;margin-top:2px">${e.estimatedQuantityQuintals} quintals</div></div>
                <div><div style="font-size:11px;color:var(--slate-500)">Date</div><div style="font-size:13px;font-weight:600;margin-top:2px">${W(e.slotDate)}</div></div>
                <div><div style="font-size:11px;color:var(--slate-500)">Slot</div><div style="font-size:13px;font-weight:600;margin-top:2px">${X(e.slotStartTime)}</div></div>
                ${e.tokenNumber?`<div><div style="font-size:11px;color:var(--slate-500)">Token</div><div style="font-size:13px;font-weight:700;margin-top:2px;color:var(--gold-400)">${e.tokenNumber}</div></div>`:""}
                <div><div style="font-size:11px;color:var(--slate-500)">MSP Value</div><div style="font-size:13px;font-weight:700;margin-top:2px;color:var(--gold-400)">${A(e.totalMspValue)}</div></div>
              </div>

              ${r?`
                <div class="progress mb-8" style="height:8px">
                  <div class="progress-bar progress-green" style="width:${s}%"></div>
                </div>
                <div style="font-size:11px;color:var(--slate-400)">Journey Progress: ${s}% — ${e.status.replace("_"," ")}</div>
              `:`
                ${e.netWeightQuintals?`
                  <div style="background:rgba(34,196,104,0.08);border:1px solid rgba(34,196,104,0.2);border-radius:var(--radius-md);padding:12px;margin-bottom:12px">
                    <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">Procurement Details</div>
                    <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:12px">
                      <span>Net Weight: <strong>${e.netWeightQuintals} qtl</strong></span>
                      <span>Grade: <strong>${e.qualityGrade}</strong></span>
                      <span>Moisture: <strong>${e.moisture}%</strong></span>
                      <span>Payment: <strong style="color:var(--gold-400)">${A(e.totalMspValue)}</strong></span>
                    </div>
                  </div>`:""}
              `}

              <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
                <button class="btn btn-outline btn-sm qr-view-btn" data-ref="${e.bookingReference}" data-payload="${e.qrPayload}" style="border-radius:var(--radius-md)">📱 View QR Pass</button>
                ${r?`
                  <button class="btn btn-ghost btn-sm" style="border-radius:var(--radius-md)">📅 Reschedule</button>
                  <button class="btn btn-danger btn-sm" style="border-radius:var(--radius-md)">🚫 Cancel</button>
                `:""}
                ${e.status==="PAYMENT_COMPLETED"?'<a href="#/farmer/payment" class="btn btn-ghost btn-sm" style="border-radius:var(--radius-md)">💰 Payment Details</a>':""}
              </div>
            </div>
          </div>`}).join("")}
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
  `,n=C(a,"bookings",i);return setTimeout(()=>{var e,t;document.querySelectorAll(".qr-view-btn").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.ref,d=s.dataset.payload,p=Z.find(y=>y.bookingReference===r);document.getElementById("qr-ref-display").textContent=r,document.getElementById("qr-center-display").textContent=(p==null?void 0:p.centerName)||"",document.getElementById("qr-payload-display").textContent=d,document.getElementById("qr-code-container").innerHTML=Ae(d||r),document.getElementById("qr-modal").classList.remove("hidden")})}),(e=document.getElementById("close-qr"))==null||e.addEventListener("click",()=>{document.getElementById("qr-modal").classList.add("hidden")}),(t=document.getElementById("qr-modal"))==null||t.addEventListener("click",s=>{s.target.id==="qr-modal"&&document.getElementById("qr-modal").classList.add("hidden")})},0),n}function De(a){const i=ze,n=`
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
                <div style="font-size:16px;font-weight:700;margin-top:2px">${i.bookingRef}</div>
              </div>
              <span class="badge badge-green">✅ TRANSFERRED</span>
            </div>
            <div style="font-size:40px;font-weight:900;color:var(--gold-400);margin-bottom:4px">${A(i.netPayable)}</div>
            <div style="font-size:13px;color:var(--slate-400)">For ${i.netQuintals} quintals of ${i.cropName} @ ₹${i.mspRate}/qtl MSP</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px;padding-top:20px;border-top:1px solid var(--border-subtle)">
              <div><div style="font-size:11px;color:var(--slate-500)">Bank</div><div style="font-size:13px;font-weight:600;margin-top:2px">${i.bankName}</div></div>
              <div><div style="font-size:11px;color:var(--slate-500)">Account</div><div style="font-size:13px;font-weight:600;margin-top:2px">${i.accountNo}</div></div>
              <div><div style="font-size:11px;color:var(--slate-500)">IFSC</div><div style="font-size:13px;font-weight:600;margin-top:2px">${i.ifsc}</div></div>
              <div><div style="font-size:11px;color:var(--slate-500)">UTR Number</div><div style="font-size:12px;font-weight:600;margin-top:2px;color:var(--green-400)">${i.utrNumber}</div></div>
            </div>

            <div style="background:rgba(34,196,104,0.08);border:1px solid rgba(34,196,104,0.2);border-radius:var(--radius-md);padding:14px;margin-top:16px">
              <div style="font-size:12px;color:var(--slate-400);margin-bottom:6px">Payment Timeline</div>
              <div style="font-size:12px;display:flex;justify-content:space-between">
                <span>Initiated</span><span style="font-weight:600">${W(i.initiatedAt)}</span>
              </div>
              <div style="font-size:12px;display:flex;justify-content:space-between;margin-top:4px">
                <span>Completed</span><span style="font-weight:600;color:var(--success)">${W(i.completedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div style="font-weight:700">📊 Procurement Breakdown</div></div>
          <div class="card-body">
            ${[["Gross Weight","6,820 kg"],["Tare Weight","4,600 kg"],["Net Weight",`${i.netQuintals} qtl (${i.netQuintals*100} kg)`],["MSP Rate",`₹${i.mspRate}/qtl`],["Gross Amount",A(i.grossAmount)],["Deductions","₹0"],["Net Payable",A(i.netPayable)]].map(([e,t])=>`
              <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border-subtle);font-size:13px">
                <span style="color:var(--slate-400)">${e}</span>
                <span style="font-weight:${e==="Net Payable"?"700":"500"};color:${e==="Net Payable"?"var(--gold-400)":"inherit"}">${t}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <div>
        <div class="section-title mb-16">🏦 DBT / PFMS Journey</div>
        <div class="card">
          <div class="card-body">
            <div class="payment-steps">
              ${i.steps.map((e,t)=>`
                <div class="payment-step ${e.status==="done"?"done":e.status==="active"?"active":""}">
                  <div class="payment-step-icon payment-step-icon-${e.status==="done"?"done":e.status==="active"?"active":"pending"}">
                    ${e.status==="done"?"✓":e.status==="active"?"●":t+1}
                  </div>
                  <div class="payment-step-info">
                    <div class="payment-step-title">${e.label}</div>
                    <div class="payment-step-desc devanagari" style="font-size:11px;color:var(--green-400)">${e.labelHi}</div>
                    ${e.time?`<div class="payment-step-time">✅ ${e.time}</div>`:""}
                  </div>
                </div>`).join("")}
            </div>

            <div class="alert alert-success mt-16">
              🎉 Payment of ${A(i.netPayable)} successfully credited to your bank account on ${W(i.completedAt)}. 
              UTR: <strong>${i.utrNumber}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;return C(a,"payment",n)}function ke(a){const i=T[1];let n=[...Te];const e=`
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:24px">
      <div>
        <h1 style="font-size:24px;font-weight:800">👮 Officer Dashboard</h1>
        <div style="font-size:13px;color:var(--slate-400);margin-top:4px">${(a==null?void 0:a.centerName)||i.centerName}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span class="badge badge-green" style="animation:pulse-green 2s infinite">● LIVE</span>
        <span style="font-size:12px;color:var(--slate-400)" id="clock">${new Date().toLocaleTimeString("en-IN")}</span>
        <button class="btn btn-primary btn-sm" id="call-next-btn" style="border-radius:var(--radius-md)">📢 Call Next Token</button>
        <a href="#/officer/checkin" class="btn btn-gold btn-sm" style="border-radius:var(--radius-md)">📱 Gate Check-In</a>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="stats-grid mb-24">
      <div class="stat-card green">
        <div class="stat-icon">🎟️</div>
        <div class="stat-value text-gradient" id="stat-queue">${n.length}</div>
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
      ${n.filter(s=>s.stage==="WAITING").map((s,r)=>`
        <div class="queue-token" id="token-${s.tokenNumber.replace("-","")}" data-token="${s.tokenNumber}">
          <div class="token-number">${s.tokenNumber}</div>
          <div class="token-info">
            <div class="token-name">${s.farmerName}</div>
            <div class="token-meta">${s.crop} • ${s.qty} qtl • Waiting since ${s.waitSince}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:6px">Position #${r+1}</div>
            <span class="badge badge-gold">⏳ Waiting</span>
          </div>
        </div>`).join("")}
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
  `,t=C(a,"dashboard",e);return setTimeout(()=>{var d,p,y,h,o,g,f;setInterval(()=>{const x=document.getElementById("clock");x&&(x.textContent=new Date().toLocaleTimeString("en-IN"))},1e3),(d=document.getElementById("call-next-btn"))==null||d.addEventListener("click",async()=>{const x=document.getElementById("call-next-btn");x.innerHTML='<span class="spinner spinner-sm"></span>',x.disabled=!0,await new Promise(I=>setTimeout(I,600)),k("📢 Token T-103 called to Weighbridge-1!","success"),x.innerHTML="📢 Call Next Token",x.disabled=!1}),document.querySelectorAll(".advance-btn, .accept-btn").forEach(x=>{x.addEventListener("click",async()=>{x.innerHTML='<span class="spinner spinner-sm"></span>',x.disabled=!0,await new Promise(I=>setTimeout(I,700)),k("✅ Stage advanced successfully","success"),x.innerHTML=x.dataset.stage==="QUALITY_CHECK"?"→ Moved to Quality Check":"✅ Accepted"})});let s=2,r=1;(p=document.getElementById("wb-minus"))==null||p.addEventListener("click",()=>{s>0&&(s--,document.getElementById("wb-count").textContent=s)}),(y=document.getElementById("wb-plus"))==null||y.addEventListener("click",()=>{s<5&&(s++,document.getElementById("wb-count").textContent=s)}),(h=document.getElementById("lab-minus"))==null||h.addEventListener("click",()=>{r>0&&(r--,document.getElementById("lab-count").textContent=r)}),(o=document.getElementById("lab-plus"))==null||o.addEventListener("click",()=>{r<5&&(r++,document.getElementById("lab-count").textContent=r)}),(g=document.getElementById("save-capacity"))==null||g.addEventListener("click",async()=>{await new Promise(x=>setTimeout(x,400)),k("⚙️ Capacity settings saved","success")}),(f=document.getElementById("emergency-reschedule"))==null||f.addEventListener("click",()=>{k("🚨 Emergency reschedule initiated — AI assigning alternative slots","info")})},0),t}function Fe(a){const i=`
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
                ${[["T-101","Vijay Singh","Wheat 60qt","09:15","WEIGHING"],["T-102","Mohan Lal","Paddy 80qt","09:47","QUALITY_CHECK"],["T-103","Gurpreet Kaur","Wheat 40qt","10:12","WAITING"],["T-104","Ramesh Kumar","Wheat 80qt","10:33","WAITING"]].map(([e,t,s,r,d])=>`
                  <tr>
                    <td style="font-weight:700;color:var(--gold-400)">${e}</td>
                    <td>${t}</td>
                    <td style="font-size:12px;color:var(--slate-400)">${s}</td>
                    <td style="font-size:12px;color:var(--slate-400)">${r}</td>
                    <td>${ee(d)}</td>
                  </tr>`).join("")}
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
                ${D.map(e=>`<option value="${e.key}">${e.icon} ${e.label}</option>`).join("")}
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
  `,n=C(a,"checkin",i);return setTimeout(()=>{var e,t;(e=document.getElementById("verify-btn"))==null||e.addEventListener("click",async()=>{document.getElementById("manual-qr").value.trim();const s=document.getElementById("verify-btn");s.innerHTML='<span class="spinner spinner-sm"></span> Verifying HMAC...',s.disabled=!0,await new Promise(r=>setTimeout(r,1e3)),s.innerHTML="✅ Verify & Issue Token",s.disabled=!1,document.getElementById("verify-result").innerHTML=`
        <div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(34,196,104,0.1);border-radius:var(--radius-md);margin-bottom:16px;border:1px solid rgba(34,196,104,0.25)">
          <span style="font-size:24px">✅</span>
          <div>
            <div style="font-weight:700;color:var(--green-300)">QR Verified — HMAC Valid</div>
            <div style="font-size:11px;color:var(--slate-400)">Booking is authentic & not expired</div>
          </div>
        </div>
        <div style="display:grid;gap:10px;margin-bottom:16px">
          ${[["Farmer","Ramesh Kumar"],["Mobile","9876543210"],["Booking Ref","KS-2026-001001"],["Centre","Barwala Sub-Centre"],["Crop","Wheat • 80 quintals"],["Slot","10 Sep 2026, 10:00 AM"],["Status","BOOKED → GATE_VERIFIED"]].map(([r,d])=>`
            <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid var(--border-subtle)">
              <span style="color:var(--slate-400)">${r}</span><span style="font-weight:600">${d}</span>
            </div>`).join("")}
        </div>
        <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-md);padding:14px;text-align:center;margin-bottom:16px">
          <div style="font-size:12px;color:var(--slate-400);margin-bottom:4px">New Queue Token Issued</div>
          <div style="font-size:36px;font-weight:900;color:var(--gold-400)">T-107</div>
          <div style="font-size:12px;color:var(--green-300);margin-top:4px">Position #5 in queue</div>
        </div>
        <button class="btn btn-gold w-full" style="border-radius:var(--radius-md)" onclick="document.getElementById('manual-qr').value='';document.getElementById('verify-result').innerHTML='<div class=\\'empty-state\\'><div class=\\'empty-icon\\'>🎟️</div><div class=\\'empty-title\\'>Ready for Next</div></div>'">
          ✅ Confirm & Process Next Farmer
        </button>
      `,k("✅ QR verified! Token T-107 issued to Ramesh Kumar","success")}),(t=document.getElementById("advance-stage-btn"))==null||t.addEventListener("click",async()=>{const s=document.getElementById("stage-token").value;if(!s){k("Please enter a token number","error");return}const r=document.getElementById("advance-stage-btn");r.innerHTML='<span class="spinner spinner-sm"></span>',r.disabled=!0,await new Promise(p=>setTimeout(p,700));const d=document.getElementById("stage-target").value;k(`✅ Token ${s} advanced to ${d.replace("_"," ")}`,"success"),r.innerHTML="⚡ Advance Stage",r.disabled=!1})},0),n}function We(a){const i=Ce,n=`
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
        <div class="stat-value text-gradient">${i.totalFarmersServedToday}</div>
        <div class="stat-label">Farmers Served Today</div>
        <div class="stat-change stat-up">▲ 22% vs yesterday</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">🌾</div>
        <div class="stat-value" style="color:var(--gold-400)">${i.totalQuantityProcuredTonnes.toLocaleString()}</div>
        <div class="stat-label">Tonnes Procured</div>
        <div class="stat-change stat-up">▲ Target: 2000T</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">💰</div>
        <div class="stat-value" style="color:#60a5fa">₹${i.totalMspValueCrore} Cr</div>
        <div class="stat-label">MSP Value Disbursed</div>
        <div class="stat-change stat-up">▲ DBT Transferred</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">⏱️</div>
        <div class="stat-value" style="color:#a78bfa">${i.avgWaitTimeMins}</div>
        <div class="stat-label">Avg Wait Time (min)</div>
        <div class="stat-change stat-up">▼ 75% improvement</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">🏢</div>
        <div class="stat-value text-gradient">${i.activeCenters}/${i.totalCenters}</div>
        <div class="stat-label">Active Centres</div>
        <div class="stat-change" style="color:var(--slate-400)">2 on maintenance</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">📅</div>
        <div class="stat-value" style="color:var(--gold-400)">${i.autoRescheduled}</div>
        <div class="stat-label">Auto-Rescheduled</div>
        <div class="stat-change" style="color:var(--slate-400)">${i.missedSlots} missed slots today</div>
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
            ${i.weeklyData.map(t=>{const s=Math.round(t.farmers/360*100);return`
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
                  <div style="font-size:10px;color:var(--slate-400);font-weight:600">${t.farmers}</div>
                  <div style="flex:1;width:100%;background:var(--gradient-green);border-radius:4px 4px 0 0;min-height:4px" 
                       style="height:${s}%" 
                       data-farmers="${t.farmers}" data-qty="${t.qty}"
                       class="chart-bar-item" title="${t.day}: ${t.farmers} farmers"></div>
                  <div style="font-size:11px;color:var(--slate-500)">${t.day}</div>
                </div>`}).join("")}
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
          ${i.centersData.map(t=>`
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
                <span style="font-weight:600">${t.name}</span>
                <div style="display:flex;gap:10px">
                  <span style="color:var(--slate-400)">${t.farmers} farmers</span>
                  <span style="color:${t.utilization>80?"var(--error)":t.utilization>60?"var(--warning)":"var(--success)"};font-weight:700">${t.utilization}%</span>
                </div>
              </div>
              <div class="progress" style="height:8px">
                <div class="progress-bar ${t.utilization>80?"progress-gold":"progress-green"}" style="width:${t.utilization}%"></div>
              </div>
              <div style="font-size:10px;color:var(--slate-500);margin-top:3px">Avg wait: ${t.wait}min • ${t.qty}T procured</div>
            </div>`).join("")}
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
        ${[{type:"critical",icon:"🔴",title:"Hansi Depot — Critical Congestion",desc:"88% capacity used. 24 trucks waiting. Avg wait: 110 min. AI recommends redirecting to Fatehabad.",action:"Redirect Traffic",center:"Hansi"},{type:"warning",icon:"🟡",title:"Hisar Mandi-1 — Weighbridge Down",desc:"Weighbridge-2 reported offline at 09:30. Effective capacity reduced 50%. 18 farmers affected.",action:"Send Technician",center:"Hisar"},{type:"info",icon:"🔵",title:"Barwala Centre — Optimal Capacity",desc:"Only 28% utilized. AI is proactively recommending this centre to 45 nearby farmers to balance load.",action:"View Details",center:"Barwala"}].map(t=>`
          <div class="alert alert-${t.type==="critical"?"error":t.type==="warning"?"warning":"info"}">
            <span style="font-size:18px">${t.icon}</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px">${t.title}</div>
              <div style="font-size:12px;margin-top:3px;opacity:0.8">${t.desc}</div>
            </div>
            <button class="btn btn-outline btn-sm" style="border-radius:var(--radius-md);flex-shrink:0;font-size:12px">${t.action}</button>
          </div>`).join("")}
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
            ${T.map(t=>`
              <tr>
                <td>
                  <div style="font-weight:600">${t.centerName}</div>
                  <div style="font-size:11px;color:var(--slate-500)">${t.address}</div>
                </td>
                <td>${V(t.congestionLevel)}</td>
                <td style="font-weight:600">${Math.round(t.currentOccupancy*.3)}</td>
                <td style="font-weight:600">${Math.round(t.currentOccupancy*.3*4.5)}</td>
                <td style="color:${t.estimatedWaitMins>60?"var(--error)":"var(--success)"}"><strong>${t.estimatedWaitMins} min</strong></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress" style="width:80px;height:6px">
                      <div class="progress-bar ${t.currentOccupancy/t.totalCapacityPerDay>.8?"progress-gold":"progress-green"}" style="width:${Math.round(t.currentOccupancy/t.totalCapacityPerDay*100)}%"></div>
                    </div>
                    <span style="font-size:12px">${Math.round(t.currentOccupancy/t.totalCapacityPerDay*100)}%</span>
                  </div>
                </td>
                <td><button class="btn btn-ghost btn-sm" style="border-radius:var(--radius-md);font-size:11px">Details</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,e=C(a,"dashboard",n);return setTimeout(()=>{var r,d;(r=document.getElementById("refresh-btn"))==null||r.addEventListener("click",async()=>{const p=document.getElementById("refresh-btn");p.innerHTML='<span class="spinner spinner-sm"></span>',await new Promise(y=>setTimeout(y,800)),p.innerHTML="🔄 Refresh",k("✅ Data refreshed","success")}),(d=document.getElementById("export-btn"))==null||d.addEventListener("click",()=>{k("📥 Generating district report PDF...","info")});const t=document.querySelectorAll(".chart-bar-item"),s=Math.max(...i.weeklyData.map(p=>p.farmers));t.forEach((p,y)=>{const h=parseInt(p.dataset.farmers),o=Math.round(h/s*100);p.style.height=`${o}%`}),document.querySelectorAll(".chart-tab").forEach(p=>{p.addEventListener("click",()=>{document.querySelectorAll(".chart-tab").forEach(o=>o.classList.remove("active")),p.classList.add("active");const y=p.dataset.metric,h=y==="farmers"?s:Math.max(...i.weeklyData.map(o=>o.qty));t.forEach((o,g)=>{const f=parseInt(o.dataset[y]),x=Math.round(f/h*100);o.style.height=`${x}%`,o.previousElementSibling.textContent=f})})})},0),e}function Oe(a){const i=`
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
      ${[{val:"42 min",label:"Avg Wait Time",change:"↓ 75% from 168 min",color:"var(--green-400)",up:!0},{val:"0.24",label:"Gini Coeff (Utilization)",change:"↓ From 0.72 (balanced)",color:"var(--gold-400)",up:!0},{val:"92%",label:"Farmer Adoption Rate",change:"↑ Target: 90%",color:"#60a5fa",up:!0},{val:"28 sec",label:"Auto-Reschedule Time",change:"↓ Target: < 30 sec",color:"#a78bfa",up:!0}].map(n=>`
        <div class="stat-card green">
          <div style="font-size:28px;font-weight:900;color:${n.color}">${n.val}</div>
          <div style="font-size:13px;margin-top:4px">${n.label}</div>
          <div style="font-size:11px;margin-top:6px;color:${n.up?"var(--success)":"var(--error)"}">${n.change}</div>
        </div>`).join("")}
    </div>

    <!-- Stage Bottleneck Analysis -->
    <div class="card mb-24">
      <div class="card-header"><div style="font-weight:700">🔍 Stage Bottleneck Analysis (Today)</div></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:14px">
          ${[{stage:"Gate Verification",avg:4,max:8,count:347,icon:"✅"},{stage:"Queue Wait",avg:42,max:115,count:289,icon:"⏳",highlight:!0},{stage:"Weighbridge",avg:18,max:35,count:248,icon:"⚖️"},{stage:"Quality Check",avg:22,max:55,count:248,icon:"🔬",highlight:!0},{stage:"Unloading",avg:25,max:45,count:198,icon:"🏪"},{stage:"Documentation",avg:8,max:15,count:198,icon:"📄"}].map(n=>`
            <div style="${n.highlight?"background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:var(--radius-md);padding:12px;":"padding:4px 0"}">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <div style="display:flex;align-items:center;gap:8px">
                  <span>${n.icon}</span>
                  <span style="font-size:13px;font-weight:600">${n.stage}</span>
                  ${n.highlight?'<span class="badge badge-gold" style="font-size:9px">BOTTLENECK</span>':""}
                </div>
                <div style="font-size:12px;color:var(--slate-400)">${n.count} farmers</div>
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="progress" style="flex:1;height:8px">
                  <div class="progress-bar ${n.highlight?"progress-gold":"progress-green"}" style="width:${Math.round(n.avg/n.max*100)}%"></div>
                </div>
                <div style="font-size:12px;font-weight:600;min-width:80px;text-align:right">Avg: ${n.avg}min / Max: ${n.max}min</div>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </div>

    <!-- Payment Analytics -->
    <div class="grid-2" style="gap:24px">
      <div class="card">
        <div class="card-header"><div style="font-weight:700">💰 DBT Payment Analytics</div></div>
        <div class="card-body">
          ${[{label:"PFMS Submitted",count:198,amount:"₹4.2 Cr",color:"#60a5fa",pct:100},{label:"Bank Transfer Initiated",count:192,amount:"₹4.0 Cr",color:"var(--green-400)",pct:97},{label:"Amount Credited",count:185,amount:"₹3.9 Cr",color:"var(--gold-400)",pct:93},{label:"Pending / Failed",count:7,amount:"₹0.14 Cr",color:"var(--error)",pct:4}].map(n=>`
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
                <span style="font-weight:600">${n.label}</span>
                <div style="display:flex;gap:10px">
                  <span style="color:var(--slate-400)">${n.count} txns</span>
                  <span style="font-weight:700;color:${n.color}">${n.amount}</span>
                </div>
              </div>
              <div class="progress" style="height:8px">
                <div class="progress-bar" style="width:${n.pct}%;background:${n.color}"></div>
              </div>
            </div>`).join("")}
          <div class="alert alert-success" style="font-size:12px;margin-top:16px">
            ✅ Average payment credit time: <strong>18 hours</strong> (vs. 5–12 day blackout previously)
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div style="font-weight:700">🌾 Crop-wise Procurement</div></div>
        <div class="card-body">
          ${[{crop:"Wheat (गेहूं)",icon:"🌾",qty:820,value:"₹1.86 Cr",pct:68,msp:2275},{crop:"Paddy (धान)",icon:"🌾",qty:380,value:"₹0.83 Cr",pct:31,msp:2183},{crop:"Mustard (सरसों)",icon:"🌻",qty:42,value:"₹0.24 Cr",pct:3,msp:5650}].map(n=>`
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
                <span style="font-weight:600">${n.icon} ${n.crop}</span>
                <div style="display:flex;gap:10px">
                  <span style="color:var(--slate-400)">${n.qty}T</span>
                  <span style="font-weight:700;color:var(--gold-400)">${n.value}</span>
                </div>
              </div>
              <div class="progress" style="height:10px">
                <div class="progress-bar progress-green" style="width:${n.pct}%"></div>
              </div>
              <div style="font-size:10px;color:var(--slate-500);margin-top:3px">MSP: ₹${n.msp}/qtl • ${n.pct}% of total</div>
            </div>`).join("")}
          
          <div style="border-top:1px solid var(--border-subtle);padding-top:16px;margin-top:8px">
            <div style="font-size:12px;color:var(--slate-400);margin-bottom:8px">AI Prediction — Tomorrow</div>
            <div class="alert alert-info" style="font-size:12px">
              📊 AI forecasts <strong>380±20 farmers</strong> will arrive tomorrow. Recommend opening Barwala extra shift (6 AM – 2 PM).
            </div>
          </div>
        </div>
      </div>
    </div>
  `;return C(a,"analytics",i)}function Qe(a){const i=`
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
          ${T.map((e,t)=>{const r=[{x:35,y:55},{x:55,y:35},{x:70,y:62}][t],p={LOW:"#22c468",MODERATE:"#fbbf24",HIGH:"#ef4444",CRITICAL:"#dc2626"}[e.congestionLevel]||"#22c468",h={LOW:12,MODERATE:16,HIGH:20,CRITICAL:24}[e.congestionLevel]||14;return`
              <div style="position:absolute;left:${r.x}%;top:${r.y}%;transform:translate(-50%,-50%);cursor:pointer" class="center-marker" data-center="${e.id}">
                <!-- Glow ring -->
                <div style="position:absolute;inset:-8px;border-radius:50%;background:${p};opacity:0.15;animation:pulse-${e.congestionLevel==="LOW"?"green":"gold"} 2s infinite"></div>
                <div style="width:${h}px;height:${h}px;border-radius:50%;background:${p};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 ${h}px ${p}"></div>
                <!-- Label -->
                <div style="position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);background:rgba(2,26,14,0.95);border:1px solid ${p};border-radius:6px;padding:4px 8px;white-space:nowrap;font-size:10px;font-weight:600;color:${p}">
                  ${e.centerName.split(" ").slice(0,2).join(" ")}<br/>
                  <span style="color:var(--slate-400);font-weight:400">${e.estimatedWaitMins}min wait</span>
                </div>
              </div>`}).join("")}
          <!-- Legend -->
          <div style="position:absolute;bottom:16px;left:16px;background:rgba(2,26,14,0.95);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:12px 16px">
            <div style="font-size:10px;font-weight:700;color:var(--slate-500);text-transform:uppercase;margin-bottom:8px">Congestion Level</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${[["#22c468","Low (< 50%)"],["#fbbf24","Moderate (50-70%)"],["#ef4444","High (70-90%)"],["#dc2626","Critical (> 90%)"]].map(([e,t])=>`
                <div style="display:flex;align-items:center;gap:8px;font-size:11px">
                  <div style="width:10px;height:10px;border-radius:50%;background:${e};box-shadow:0 0 6px ${e}"></div>
                  <span style="color:var(--slate-300)">${t}</span>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Centre Details Panel -->
      <div>
        <div class="section-title mb-16">Centre Status Panel</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${T.map(e=>{const t={LOW:"rgba(34,196,104,0.1)",MODERATE:"rgba(245,158,11,0.1)",HIGH:"rgba(239,68,68,0.1)",CRITICAL:"rgba(220,38,38,0.15)"},s={LOW:"rgba(34,196,104,0.3)",MODERATE:"rgba(245,158,11,0.3)",HIGH:"rgba(239,68,68,0.3)",CRITICAL:"rgba(220,38,38,0.4)"},r=t[e.congestionLevel]||t.LOW,d=s[e.congestionLevel]||s.LOW;return`
              <div style="background:${r};border:1px solid ${d};border-radius:var(--radius-lg);padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                  <div>
                    <div style="font-size:13px;font-weight:700">${e.centerName}</div>
                    <div style="font-size:11px;color:var(--slate-400);margin-top:2px">${e.address}</div>
                  </div>
                  ${V(e.congestionLevel)}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
                  <div style="text-align:center"><div style="font-size:18px;font-weight:800;color:var(--gold-400)">${e.currentQueueLength}</div><div style="font-size:10px;color:var(--slate-500)">Queue</div></div>
                  <div style="text-align:center"><div style="font-size:18px;font-weight:800;color:var(--green-400)">${e.estimatedWaitMins}</div><div style="font-size:10px;color:var(--slate-500)">Wait Min</div></div>
                  <div style="text-align:center"><div style="font-size:18px;font-weight:800">${e.activeWeighbridges}</div><div style="font-size:10px;color:var(--slate-500)">WBridges</div></div>
                </div>
                <div class="progress" style="height:6px;margin-bottom:6px">
                  <div class="progress-bar ${e.currentOccupancy/e.totalCapacityPerDay>.8?"progress-gold":"progress-green"}" style="width:${Math.round(e.currentOccupancy/e.totalCapacityPerDay*100)}%"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--slate-500)">
                  <span>${e.currentOccupancy} / ${e.totalCapacityPerDay} today</span>
                  <span>${Math.round(e.currentOccupancy/e.totalCapacityPerDay*100)}% utilized</span>
                </div>
                ${e.congestionLevel==="CRITICAL"?`
                  <div class="alert alert-error mt-10" style="font-size:11px">
                    🚨 Recommend diverting to Barwala Centre (only 28% utilized, 16km away)
                  </div>
                  <button class="btn btn-danger btn-sm mt-8 w-full" style="border-radius:var(--radius-md);font-size:12px">🚨 Redirect Farmers</button>
                `:""}
              </div>`}).join("")}
        </div>
      </div>
    </div>
  `,n=C(a,"map",i);return setTimeout(()=>{var e;(e=document.getElementById("alert-btn"))==null||e.addEventListener("click",()=>{k("🔔 Alert thresholds can be configured in Settings","info")})},0),n}window.navigate=S;M("#/",xe);M("#/landing",xe);M("#/login",Le);M("#/register",qe);M("#/farmer/dashboard",Re);M("#/farmer/centers",Be);M("#/farmer/book",Ne);M("#/farmer/bookings",He);M("#/farmer/payment",De);M("#/officer/dashboard",ke);M("#/officer/queue",ke);M("#/officer/checkin",Fe);M("#/admin/dashboard",We);M("#/admin/analytics",Oe);M("#/admin/map",Qe);function fe(){const a=document.getElementById("app");a&&Se(a)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fe):fe();
