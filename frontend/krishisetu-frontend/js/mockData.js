// ============================================================
// KisanSetu AI — Mock Data (used when backend is offline)
// ============================================================

export const MOCK_USERS = {
  farmer: {
    id: 1, userId: 1, name: 'Ramesh Kumar', mobile: '9876543210',
    role: 'FARMER', aadhaar: '1234-5678-9012', district: 'Hisar', state: 'Haryana',
    totalLandAcres: 3.5, preferredLanguage: 'hi', verified: true
  },
  officer: {
    id: 2, userId: 2, name: 'Suresh Sharma', mobile: '9812345678',
    role: 'OFFICER', centerName: 'Hisar Grain Market', centerId: 1, district: 'Hisar',
    preferredLanguage: 'hi', verified: true
  },
  admin: {
    id: 3, userId: 3, name: 'Dr. Ananya Iyer', mobile: '9988776655',
    role: 'ADMIN', district: 'Hisar', state: 'Haryana',
    preferredLanguage: 'en', verified: true
  }
};

export const MOCK_CENTERS = [
  {
    id: 1, centerName: 'Hisar Grain Market (Mandi-1)', district: 'Hisar',
    latitude: 29.15, longitude: 75.72, address: 'NH-9, Hisar, Haryana 125001',
    activeWeighbridges: 2, totalCapacityPerDay: 200, currentOccupancy: 142,
    currentQueueLength: 18, estimatedWaitMins: 65, congestionLevel: 'HIGH',
    cropsAccepted: ['Wheat', 'Paddy', 'Mustard'],
    operatingHours: '8:00 AM – 6:00 PM', status: 'ACTIVE',
    distanceKm: 6, travelTimeMins: 15, processingTimeMins: 35,
    totalFarmerTimeMins: 115, timeSavedMins: -35, rank: 2
  },
  {
    id: 2, centerName: 'Barwala Sub-Procurement Centre', district: 'Hisar',
    latitude: 29.38, longitude: 75.89, address: 'Village Barwala, Hisar, Haryana',
    activeWeighbridges: 2, totalCapacityPerDay: 150, currentOccupancy: 42,
    currentQueueLength: 3, estimatedWaitMins: 12, congestionLevel: 'LOW',
    cropsAccepted: ['Wheat', 'Paddy'],
    operatingHours: '8:00 AM – 5:00 PM', status: 'ACTIVE',
    distanceKm: 16, travelTimeMins: 38, processingTimeMins: 30,
    totalFarmerTimeMins: 80, timeSavedMins: 35, rank: 1,
    recommended: true
  },
  {
    id: 3, centerName: 'Hansi Procurement Depot', district: 'Hisar',
    latitude: 29.10, longitude: 75.97, address: 'Old Grain Market, Hansi, Haryana',
    activeWeighbridges: 1, totalCapacityPerDay: 100, currentOccupancy: 88,
    currentQueueLength: 24, estimatedWaitMins: 110, congestionLevel: 'CRITICAL',
    cropsAccepted: ['Wheat', 'Mustard', 'Sunflower'],
    operatingHours: '8:00 AM – 6:00 PM', status: 'ACTIVE',
    distanceKm: 22, travelTimeMins: 53, processingTimeMins: 40,
    totalFarmerTimeMins: 203, timeSavedMins: -88, rank: 3
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 1001, bookingReference: 'KS-2026-001001',
    farmerId: 1, farmerName: 'Ramesh Kumar',
    centerId: 2, centerName: 'Barwala Sub-Procurement Centre',
    cropId: 1, cropName: 'Wheat (Gehun)', cropNameHi: 'गेहूं',
    estimatedQuantityQuintals: 80, slotDate: '2026-09-10',
    slotStartTime: '10:00', slotEndTime: '12:00',
    status: 'WAITING', tokenNumber: 'T-104', queuePosition: 3,
    estimatedWaitMins: 18, mspRatePerQuintal: 2275,
    totalMspValue: 182000, bookedAt: '2026-09-07T14:30:00',
    qrPayload: 'KS:bId=1001:fId=1:cId=2:crop=WHEAT:qty=80:exp=1757548800:sig=abc123hmac'
  },
  {
    id: 1002, bookingReference: 'KS-2026-001002',
    farmerId: 1, farmerName: 'Ramesh Kumar',
    centerId: 1, centerName: 'Hisar Grain Market (Mandi-1)',
    cropId: 2, cropName: 'Paddy (Dhan)', cropNameHi: 'धान',
    estimatedQuantityQuintals: 45, slotDate: '2026-08-20',
    slotStartTime: '09:00', slotEndTime: '11:00',
    status: 'PAYMENT_COMPLETED', tokenNumber: 'T-067', queuePosition: null,
    estimatedWaitMins: null, mspRatePerQuintal: 2183,
    totalMspValue: 98235, bookedAt: '2026-08-18T10:00:00',
    netWeightQuintals: 44.2, grossWeight: 6820, tare: 4600,
    qualityGrade: 'A', moisture: 15.2, foreignMatter: 1.1,
    qrPayload: 'KS:bId=1002:fId=1:cId=1:crop=PADDY:qty=45:exp=1756000000:sig=def456hmac'
  }
];

export const MOCK_QUEUE_TOKENS = [
  { tokenNumber: 'T-101', farmerName: 'Vijay Singh', crop: 'Wheat', qty: 60, stage: 'WEIGHING', weighbridge: 'Weighbridge-1', waitSince: '09:15', isActive: true },
  { tokenNumber: 'T-102', farmerName: 'Mohan Lal', crop: 'Paddy', qty: 80, stage: 'QUALITY_CHECK', weighbridge: 'Lab-1', waitSince: '09:45', isActive: true },
  { tokenNumber: 'T-103', farmerName: 'Gurpreet Kaur', crop: 'Wheat', qty: 40, stage: 'WAITING', weighbridge: null, waitSince: '10:10', isActive: false },
  { tokenNumber: 'T-104', farmerName: 'Ramesh Kumar', crop: 'Wheat', qty: 80, stage: 'WAITING', weighbridge: null, waitSince: '10:30', isActive: false },
  { tokenNumber: 'T-105', farmerName: 'Sita Devi', crop: 'Mustard', qty: 35, stage: 'WAITING', weighbridge: null, waitSince: '10:55', isActive: false },
  { tokenNumber: 'T-106', farmerName: 'Harish Yadav', crop: 'Paddy', qty: 90, stage: 'WAITING', weighbridge: null, waitSince: '11:15', isActive: false }
];

export const MOCK_ADMIN_OVERVIEW = {
  totalFarmersServedToday: 347,
  totalQuantityProcuredTonnes: 1842.5,
  totalMspValueCrore: 4.2,
  avgWaitTimeMins: 42,
  activeCenters: 12,
  totalCenters: 15,
  missedSlots: 8,
  autoRescheduled: 6,
  centersData: [
    { name: 'Hisar M-1', farmers: 78, qty: 412, utilization: 71, wait: 65 },
    { name: 'Barwala', farmers: 42, qty: 218, utilization: 28, wait: 12 },
    { name: 'Hansi', farmers: 88, qty: 510, utilization: 88, wait: 110 },
    { name: 'Fatehabad', farmers: 55, qty: 287, utilization: 52, wait: 38 },
    { name: 'Sirsa', farmers: 63, qty: 310, utilization: 60, wait: 48 },
    { name: 'Tohana', farmers: 21, qty: 105, utilization: 22, wait: 15 }
  ],
  weeklyData: [
    { day: 'Mon', farmers: 210, qty: 980 },
    { day: 'Tue', farmers: 285, qty: 1340 },
    { day: 'Wed', farmers: 320, qty: 1580 },
    { day: 'Thu', farmers: 290, qty: 1420 },
    { day: 'Fri', farmers: 347, qty: 1842 },
    { day: 'Sat', farmers: 180, qty: 820 }
  ]
};

export const MOCK_PAYMENT = {
  bookingId: 1002, bookingRef: 'KS-2026-001002',
  farmerName: 'Ramesh Kumar', cropName: 'Paddy (Dhan)',
  netQuintals: 44.2, mspRate: 2183,
  grossAmount: 96487, deductions: 0, netPayable: 96487,
  bankName: 'Punjab National Bank', accountNo: '****4521', ifsc: 'PUNB0123400',
  pfmsStatus: 'TRANSFERRED', utrNumber: 'PFMS2026090842311',
  initiatedAt: '2026-08-21T16:45:00', completedAt: '2026-08-22T10:30:00',
  steps: [
    { label: 'J-Form Generated', labelHi: 'J-फॉर्म तैयार', status: 'done', time: '21 Aug, 4:00 PM' },
    { label: 'DBT Payload Submitted to PFMS', labelHi: 'PFMS को DBT भेजा', status: 'done', time: '21 Aug, 4:45 PM' },
    { label: 'PFMS Processing', labelHi: 'PFMS प्रक्रियाधीन', status: 'done', time: '21 Aug, 6:00 PM' },
    { label: 'Bank Transfer Initiated', labelHi: 'बैंक ट्रांसफर शुरू', status: 'done', time: '22 Aug, 9:00 AM' },
    { label: 'Amount Credited to Account', labelHi: 'खाते में राशि जमा', status: 'done', time: '22 Aug, 10:30 AM' }
  ]
};

export const BOOKING_STAGES = [
  { key: 'BOOKED',              label: 'Slot Booked',          labelHi: 'स्लॉट बुक',           icon: '📋' },
  { key: 'ARRIVED',             label: 'Arrived at Centre',    labelHi: 'केंद्र पर आगमन',       icon: '🚜' },
  { key: 'GATE_VERIFIED',       label: 'Gate Verified',        labelHi: 'गेट सत्यापन पूर्ण',    icon: '✅' },
  { key: 'WAITING',             label: 'In Queue',             labelHi: 'कतार में प्रतीक्षारत', icon: '⏳' },
  { key: 'WEIGHING',            label: 'Weighbridge',          labelHi: 'धर्मकांटा तुलाई',      icon: '⚖️' },
  { key: 'QUALITY_CHECK',       label: 'Quality Check',        labelHi: 'गुणवत्ता जांच',         icon: '🔬' },
  { key: 'ACCEPTED',            label: 'Crop Accepted',        labelHi: 'फसल स्वीकार',          icon: '✔️' },
  { key: 'UNLOADING',           label: 'Unloading',            labelHi: 'गोदाम अनलोडिंग',       icon: '🏪' },
  { key: 'DOCUMENTATION',       label: 'J-Form / Receipt',     labelHi: 'J-फॉर्म रसीद',         icon: '📄' },
  { key: 'PAYMENT_PROCESSING',  label: 'Payment Processing',   labelHi: 'DBT भुगतान प्रक्रिया', icon: '🏦' },
  { key: 'PAYMENT_COMPLETED',   label: 'Payment Completed',    labelHi: 'भुगतान पूर्ण',          icon: '💰' }
];

export const CROPS = [
  { id: 1, nameEn: 'Wheat',    nameHi: 'गेहूं',   msp: 2275, icon: '🌾' },
  { id: 2, nameEn: 'Paddy',    nameHi: 'धान',    msp: 2183, icon: '🌾' },
  { id: 3, nameEn: 'Mustard',  nameHi: 'सरसों',  msp: 5650, icon: '🌻' },
  { id: 4, nameEn: 'Sunflower',nameHi: 'सूरजमुखी', msp: 6760, icon: '🌻' },
  { id: 5, nameEn: 'Maize',    nameHi: 'मक्का',   msp: 1850, icon: '🌽' },
  { id: 6, nameEn: 'Cotton',   nameHi: 'कपास',   msp: 7121, icon: '☁️' }
];

export const CHAT_RESPONSES = {
  en: [
    { q: ['token', 'number', 'queue', 'position', 'wait', 'line'], r: '🪙 Ramesh Ji, your token number is **T-104**. You are currently **#3 in line** at Barwala Sub-Centre. Estimated wait time is **18 minutes**. Please be ready near the weighbridge.' },
    { q: ['payment', 'money', 'paid', 'status', 'credited', 'dbt', 'pfms', 'account', 'bank'], r: '💰 Your last payment of **₹96,487** for 44.2 quintals of Paddy has been **credited** directly to your PNB account (****4521) via PFMS DBT. UTR: PFMS2026090842311.' },
    { q: ['booking', 'slot', 'appointment', 'center', 'barwala', 'details'], r: '📋 You have an **active booking** (Ref: KS-2026-001001) at Barwala Sub-Centre on **10 Sep 2026**, slot 10:00 AM – 12:00 PM for 80 quintals of Wheat.' },
    { q: ['msp', 'rate', 'price', 'wheat', 'paddy', 'mustard', 'crops'], r: '🌾 Official MSP for **Wheat (Rabi 2025-26)** is ₹2,275 per quintal. Your 80 quintals will fetch **₹1,82,000**. Paddy MSP is ₹2,183/qtl and Mustard is ₹5,650/qtl.' },
    { q: ['cancel', 'reschedule', 'change', 'date', 'time', 'postpone'], r: '📅 You can cancel or reschedule your booking up to 12 hours before your slot without any penalty. Go to **My Bookings** section to select a new slot.' },
    { q: ['quality', 'moisture', 'assay', 'check', 'grade'], r: '🔬 Grain quality check requires moisture level under 12% and foreign matter under 0.75% for instant grade approval at the center.' },
    { q: ['hello', 'hi', 'help', 'namaste'], r: '🙏 Hello Ramesh Ji! I am your KisanSetu AI assistant. Ask me about your token number, payment status, MSP rates, or booking details.' }
  ],
  hi: [
    { q: ['token', 'टोकन', 'number', 'नंबर', 'queue', 'कतार', 'position', 'स्थान', 'wait', 'इंतजार', 'प्रतीक्षा', 'लाइन'], r: '🪙 रामेश जी, आपका **टोकन नंबर T-104** है। बरवाला उप-केंद्र पर आपके आगे **3 किसान कतार में** हैं। आपका अनुमानित प्रतीक्षा समय **18 मिनट** है। कृपया तुलाई के लिए तैयार रहें।' },
    { q: ['payment', 'पैसे', 'भुगतान', 'रकम', 'paid', 'credited', 'dbt', 'pfms', 'account', 'खाता', 'बैंक', 'रुपये'], r: '💰 रामेश जी, आपके 44.2 क्विंटल धान के लिए **₹96,487 की राशि** सीधे DBT के माध्यम से आपके **PNB बैंक खाते (****4521)** में **जमा हो चुकी है**। UTR: PFMS2026090842311।' },
    { q: ['booking', 'बुकिंग', 'slot', 'स्लॉट', 'appointment', 'अपॉइंटमेंट', 'center', 'केंद्र', 'सेंटर', 'barwala', 'बरवाला', 'विवरण', 'तारीख'], r: '📋 आपकी सक्रिय स्लॉट **बुकिंग (KS-2026-001001)** बरवाला उप-केंद्र पर **10 सितंबर 2026** को सुबह **10:00 से 12:00 बजे** के लिए 80 क्विंटल गेहूं की पक्की है।' },
    { q: ['msp', 'भाव', 'दाम', 'दर', 'rate', 'price', 'wheat', 'गेहूं', 'paddy', 'धान', 'सरसों', 'mustard', 'फसल', 'मूल्य'], r: '🌾 रबी 2025-26 के लिए **गेहूं का आधिकारिक MSP भाव ₹2,275 प्रति क्विंटल** है। आपके 80 क्विंटल गेहूं का कुल मूल्य **₹1,82,000** होगा। धान का भाव ₹2,183 और सरसों का ₹5,650 है।' },
    { q: ['cancel', 'रद्द', 'reschedule', 'बदलना', 'समय', 'date', 'पुनर्निर्धारण', 'बदलो', 'तारीख'], r: '📅 आप बिना किसी पेनल्टी के अपने स्लॉट से 12 घंटे पहले तक बुकिंग को रद्द या पुनर्निर्धारित कर सकते हैं। इसके लिए **"मेरी बुकिंग"** में जाकर नया समय चुनें।' },
    { q: ['quality', 'गुणवत्ता', 'नमी', 'moisture', 'जांच', 'assay', 'check', 'पास'], r: '🔬 खरीद केंद्र पर गुणवत्ता जांच के लिए गेहूं में नमी 12% से कम होनी चाहिए। गुणवत्ता पास होते ही डिजिटल J-फॉर्म तुरंत जारी हो जाता है।' },
    { q: ['hello', 'hi', 'नमस्ते', 'प्रणाम', 'help', 'सहायता', 'मदद', 'रामेश'], r: '🙏 नमस्ते रामेश जी! मैं आपका कृषि सेतु AI सहायक हूं। आप मुझसे टोकन नंबर, बैंक भुगतान, MSP भाव या स्लॉट बुकिंग के बारे में कुछ भी पूछ सकते हैं।' }
  ]
};

export function getAIResponse(query, language = 'en') {
  const lower = query.toLowerCase();
  const responses = CHAT_RESPONSES[language] || CHAT_RESPONSES.en;
  for (const item of responses) {
    if (item.q.some(kw => lower.includes(kw.toLowerCase()))) return item.r;
  }
  if (language === 'hi') return '🤖 रामेश जी, मैं आपकी पूरी सहायता करूंगा। आप पूछ सकते हैं: "मेरा टोकन नंबर क्या है?", "क्या मेरा भुगतान जमा हुआ?", या "गेहूं का MSP भाव क्या है?"।';
  return '🤖 I can help with your token status, payment info, MSP rates, and booking details. Try asking: "What is my queue position?" or "Has my payment been processed?"';
}
