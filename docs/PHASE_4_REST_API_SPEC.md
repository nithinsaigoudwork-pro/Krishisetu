# Phase 4: REST API Architecture & OpenAPI Specifications

---

## 1. API Design Principles & Global Standards

1. **Protocol & Versioning**: `HTTPS` with URI path versioning: `/api/v1/...` for transactional core and `/ai/v1/...` for AI microservice.
2. **Standard Headers**:
   * `Authorization: Bearer <JWT_TOKEN>`
   * `Content-Type: application/json`
   * `X-Request-ID: <UUID>` for distributed tracing.
3. **Unified Response Envelope**:
```json
{
  "success": true,
  "timestamp": "2026-09-07T14:15:00Z",
  "data": { ... },
  "error": null
}
```
4. **Standard Error Envelope**:
```json
{
  "success": false,
  "timestamp": "2026-09-07T14:15:00Z",
  "data": null,
  "error": {
    "code": "SLOT_CAPACITY_EXCEEDED",
    "message": "Selected slot has reached maximum truck capacity (20/20).",
    "details": ["Suggested alternative slot: 2026-09-08 14:00:00"]
  }
}
```

---

## 2. API Endpoint Catalog

### Authentication & User Management
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new farmer / center officer |
| `POST` | `/api/v1/auth/login` | Public | Authenticate via mobile/password or OTP |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve current user profile & permissions |

### Farmer Operations
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/farmers/{id}` | Farmer, Officer, Admin | Get farmer profile & landholding details |
| `POST` | `/api/v1/farmers/{id}/produce` | Farmer | Register seasonal crop & acreage |
| `GET` | `/api/v1/farmers/{id}/bookings` | Farmer, Officer | Get all historical and active bookings |
| `GET` | `/api/v1/farmers/{id}/queue-status` | Farmer, Officer | Real-time queue position & wait time |
| `GET` | `/api/v1/farmers/{id}/procurement-status` | Farmer, Officer | Current stage in 11-stage state machine |
| `GET` | `/api/v1/farmers/{id}/payment-status` | Farmer, Admin | DBT disbursement & PFMS UTR status |

### Center Discovery & AI Recommendation
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/centers/nearby` | Authenticated | List centers within given radius (km) |
| `GET` | `/api/v1/centers/recommend` | Authenticated | **AI Multi-Objective Time Minimizer** |
| `GET` | `/api/v1/centers/{id}` | Authenticated | Get center details, weighbridges & status |
| `GET` | `/api/v1/centers/{id}/availability` | Authenticated | Get available slot dates & capacities |
| `GET` | `/api/v1/centers/{id}/queue` | Authenticated | Get current live queue tokens & active stage |
| `GET` | `/api/v1/centers/{id}/prediction` | Authenticated | AI predicted wait-time & congestion forecast |

### Booking & Appointment Lifecycle
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/bookings` | Farmer | Book new procurement slot |
| `GET` | `/api/v1/bookings/{id}` | Authenticated | Get booking details & offline QR payload |
| `GET` | `/api/v1/bookings/{id}/qr-pass` | Authenticated | Retrieve HMAC-SHA256 signed QR pass |
| `PUT` | `/api/v1/bookings/{id}/cancel` | Farmer, Admin | Cancel appointment with reason |
| `PUT` | `/api/v1/bookings/{id}/reschedule` | Farmer, Officer | Reschedule to alternative slot |

### Center Officer Queue Management
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/centers/{id}/gate-checkin` | Officer, Admin | Verify QR code & issue queue token |
| `POST` | `/api/v1/centers/{id}/queue/call-next` | Officer | Call next token to weighbridge / lab |
| `POST` | `/api/v1/centers/{id}/queue/advance-stage` | Officer | Move token to next procurement stage |
| `POST` | `/api/v1/centers/{id}/capacity/update` | Officer | Update active weighbridges / lab counters |

### Assaying, Weighbridge & Receipts
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/procurement/weigh-gross` | Officer | Log gross truck weight at Weighbridge 1 |
| `POST` | `/api/v1/procurement/quality-assay` | Officer (Lab) | Record moisture, foreign matter & grade |
| `POST` | `/api/v1/procurement/weigh-tare` | Officer | Log tare weight, net quintals & generate J-Form |
| `GET` | `/api/v1/procurement/{bookingId}/j-form`| Authenticated | Download official MSP Procurement Receipt |

### Government & Admin Analytics
| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/analytics/overview` | Admin | District/Statewide volume, TAT & MSP tally |
| `GET` | `/api/v1/admin/analytics/bottlenecks` | Admin | Identify stage delays (weighbridge vs lab) |
| `GET` | `/api/v1/admin/analytics/congestion-map`| Admin | Geospatial congestion heatmap data |
| `GET` | `/api/v1/admin/analytics/centers-comparison`| Admin | Comparative center performance metrics |

### FastAPI AI Microservice Contracts
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/v1/predict-wait-time` | XGBoost wait-time prediction (minutes) |
| `POST` | `/ai/v1/predict-congestion` | 4-class congestion classifier (`LOW`/`MOD`/`HIGH`/`CRITICAL`) |
| `POST` | `/ai/v1/recommend-center` | Global time minimization engine |
| `POST` | `/ai/v1/chat` | Safe Multilingual Voice/Text LLM with Tool-Calling |

---

## 3. Real-Time WebSocket Topics (STOMP Broker)

* `/topic/queue/{centerId}`: Broadcasts token additions, call-next events, and live queue length.
* `/topic/farmer/{farmerId}`: Pushes private token movements, stage advancement, and payment confirmation.
* `/topic/admin/district/{district}`: Pushes center congestion alerts and weighbridge breakdown warnings.
