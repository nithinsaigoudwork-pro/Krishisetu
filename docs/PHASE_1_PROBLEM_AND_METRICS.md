# Phase 1: Problem Definition, Persona Mapping & Mathematical Optimization Framework

---

## 1. Problem Context & Ground Realities in Indian Agricultural Procurement

Under the Minimum Support Price (MSP) scheme in India, government procurement agencies (such as Food Corporation of India [FCI], NAFED, Cotton Corporation of India [CCI], and State Civil Supplies Corporations) procure millions of tonnes of food grains and commercial crops directly from farmers.

### The Real-World Bottlenecks:
1. **Uncoordinated Arrivals (The Morning Stampede)**: In traditional systems, even if a farmer has a slot booked for 2:00 PM, anxiety causes them to arrive at 6:00 AM with their tractor-trolley to get an early spot in line. This creates an immediate 300+ tractor jam at the mandi entrance.
2. **Asymmetric Information**: Farmers cannot see how many vehicles are ahead of them, if the weighbridge is broken, or if moisture testing is backlogged. They are trapped waiting in queues without basic amenities for 12 to 36 hours.
3. **Static, Blind Slot Allocation**: Existing apps (e.g., e-Samridhi, Kapas Kisan) allocate fixed slots (e.g., 50 farmers between 9 AM - 12 PM) regardless of whether the farmer brings 20 quintals or 200 quintals, or whether the crop is Paddy (high moisture risk) or Wheat.
4. **Sub-optimal Center Selection**: Farmers default to the nearest mandi by road distance (e.g., 5 km away), even if that mandi has an 8-hour backlog, unaware that another mandi 15 km away is completely empty with zero wait time.
5. **Cascading Missed Slot Penalties**: If a tractor has a flat tyre or breakdown on the way, the slot lapses, forcing the farmer into a multi-day re-registration queue or leaving them at the mercy of private middlemen (Arhtiyas) who buy at 30% below MSP.

---

## 2. Target User Personas & Pain Point Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                 USER PERSONA MATRIX                                                   │
├──────────────────────────┬───────────────────────────────────────────┬────────────────────────────────────────────────┤
│ Persona                  │ Key Responsibilities & Context            │ Core Pain Points & Friction Points             │
├──────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 1. Ramesh Kumar          │ • Smallholder farmer (3.5 acres, Haryana) │ • Cannot afford to wait 2 days in tractor      │
│    (Farmer)              │ • Speaks Hindi / Haryanvi; basic smart-   │ • High diesel cost idling in queue             │
│                          │   phone; intermittent 2G/4G connectivity  │ • Fear of crop spoilage / rain in open queue   │
│                          │ • Sells 80 quintals of Paddy at MSP       │ • Lack of live visibility on token & payment   │
├──────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 2. Suresh Sharma         │ • Manages mandi operations, 2 weigh-      │ • Overwhelmed by simultaneous arrivals         │
│    (Center Officer)      │   bridges, 1 quality testing lab          │ • Weighbridge breakdowns cause farmer protests │
│                          │ • Responsible for daily throughput quota  │ • Manual token distribution creates disputes   │
│                          │ • Submits daily procurement tally to Govt │ • Constant pressure without dynamic workload   │
├──────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 3. Dr. Ananya Iyer       │ • Monitors district-level procurement     │ • Blind to real-time bottlenecks across mandis │
│    (District Collector / │ • Ensures 100% MSP disbursement & zero    │ • Cannot proactively divert trucks from choke  │
│     Admin)               │   spoilage                                │   points                                       │
│                          │ • Handles farmer grievances & escalations │ • Post-facto reporting (24-48 hrs delayed)     │
└──────────────────────────┴───────────────────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 3. Mathematical Optimization Model: Total Farmer Time Minimization

Existing systems optimize solely for geographical distance:
$$\min \text{Distance}(F, C_i)$$

**KisanSetu-AI** formulates center recommendation and dynamic slot allocation as a **Multi-Objective Global Time & Cost Minimization Problem**:

$$\min_{C_i \in \mathcal{C}, t_s \in \mathcal{T}} \mathcal{J}(F, C_i, t_s) = \underbrace{T_{\text{travel}}(F, C_i)}_{\text{Travel Time}} + \underbrace{\mathbb{E}\left[W_{\text{queue}}(C_i, t_s)\right]}_{\text{Predicted Queue Wait}} + \underbrace{\mathbb{E}\left[P_{\text{process}}(C_i, \text{Crop}, Q)\right]}_{\text{Processing Duration}} + \lambda \cdot \mathcal{R}_{\text{risk}}(C_i, t_s)$$

Where:
* $F$: Farmer profile with location $(lat_F, lon_F)$, Crop type, and Quantity $Q$ (in quintals).
* $\mathcal{C}$: Set of operational procurement centers in the district/cluster.
* $t_s$: Proposed arrival slot timestamp.
* $T_{\text{travel}}(F, C_i) = \frac{\text{HaversineDistance}(F, C_i)}{\bar{v}_{\text{vehicle}}} \times \kappa_{\text{road}}$ (where $\bar{v}$ is estimated tractor/tempo speed $\approx 25 \text{ km/h}$, $\kappa_{\text{road}} \approx 1.25$ is rural road tortuosity factor).
* $\mathbb{E}\left[W_{\text{queue}}(C_i, t_s)\right]$: Expected queue waiting time predicted by our **XGBoost/LightGBM Model** based on scheduled arrivals, active weighbridges, current unserved tokens, and historical throughput.
* $\mathbb{E}\left[P_{\text{process}}(C_i, \text{Crop}, Q)\right]$: Estimated processing duration at center $C_i$:
  $$\mathbb{E}[P] = \tau_{\text{gate}} + \left(\frac{Q}{\mu_{\text{weigh}}}\right) + \tau_{\text{assay}}(\text{Crop}) + \left(\frac{Q}{\mu_{\text{unload}}}\right) + \tau_{\text{doc}}$$
* $\mathcal{R}_{\text{risk}}(C_i, t_s)$: Penalty risk term representing probability of weather disruption (rain on open yard) or center over-capacity ($\text{Occupancy} > 90\%$).
* $\lambda$: Risk weighting hyperparameter (default $\lambda = 1.0$).

### Concrete Comparative Example:
Suppose Farmer Ramesh has 80 quintals of Paddy:
* **Center A (Local Mandi - 6 km away)**:
  * Travel Time: $\frac{6}{25} \times 60 = 14.4 \text{ mins} \approx 15 \text{ mins}$
  * Live Queue Length: 42 tractors $\Rightarrow \mathbb{E}[W_{\text{queue}}] = 115 \text{ mins}$
  * Processing Time: 35 mins
  * Total Farmer Time = $15 + 115 + 35 = \mathbf{165 \text{ minutes}}$ (2 hrs 45 mins)
* **Center B (Sub-center - 16 km away)**:
  * Travel Time: $\frac{16}{25} \times 60 = 38.4 \text{ mins} \approx 38 \text{ mins}$
  * Live Queue Length: 3 tractors $\Rightarrow \mathbb{E}[W_{\text{queue}}] = 12 \text{ mins}$
  * Processing Time: 30 mins
  * Total Farmer Time = $38 + 12 + 30 = \mathbf{80 \text{ minutes}}$ (1 hr 20 mins)

$$\text{Time Saved} = 165 - 80 = \mathbf{85 \text{ minutes (51.5\% reduction)}}$$

**KisanSetu-AI** recommends **Center B**, displays the exact time breakdown in the farmer's native language, and saves 85 minutes of diesel and waiting.

---

## 4. Key Performance Indicators (KPIs) & SIH Evaluation Metrics

| Metric Category | Baseline (Current State) | KisanSetu-AI Target | Measurement Methodology |
|---|---|---|---|
| **Average Mandi Wait Time** | 8.5 to 18.0 hours | $\le 1.75$ hours (75% reduction) | Time elapsed from `GATE_VERIFIED` to `UNLOADING` |
| **Prediction Accuracy ($R^2$ / MAE)** | N/A (No prediction exists) | $\text{MAE} \le 12 \text{ mins}, R^2 \ge 0.91$ | Evaluated against actual ground-truth queue timestamps |
| **Center Utilization Balance** | Severe imbalance (Gini Coeff $\approx 0.72$) | Balanced (Gini Coeff $\le 0.28$) | Variance of daily capacity utilization across neighboring centers |
| **Missed Slot Reschedule Latency** | 24 - 72 hours (Manual intervention) | $< 30$ seconds (Instant AI slot re-slotting) | Time from missed check-in to newly confirmed digital token |
| **Farmer Adoption & Accessibility** | 35% (English/text heavy UI) | $\ge 90\%$ (Voice + Multilingual + Offline QR) | Usability testing across Hindi, Marathi, Telugu, Punjabi |
| **Payment Status Transparency** | 5 - 12 days visibility blackout | Real-time stage tracking (PFMS/DBT webhooks) | Latency between state updates and mobile push/SMS delivery |
